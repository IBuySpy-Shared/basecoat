"""
Base Coat Adoption Metrics Collector

Collects metrics from GitHub APIs and outputs JSON for the dashboard.
Reads configuration from environment variables (set by GitHub Actions secrets).
No secrets are stored in this file.

Usage:
    python collect-metrics.py

Environment variables (set by GitHub Actions from secrets):
    GITHUB_TOKEN          — GitHub token with repo access
    COPILOT_METRICS_TOKEN — Token with org:read for Copilot API (optional, falls back to GITHUB_TOKEN)
    DASHBOARD_ORG         — Organization name
    DASHBOARD_REPOS       — JSON array of repos to monitor
"""

import json
import os
import sys
import time
from datetime import datetime, timedelta, timezone
from urllib.request import Request, urlopen
from urllib.error import HTTPError

# Backoff constants (mirrors CONTRIBUTING.md §GitHub API Rate Limit Handling)
BACKOFF_INITIAL_INTERVAL = 30    # seconds
BACKOFF_MAX_INTERVAL = 300       # seconds (5 minutes)
BACKOFF_MULTIPLIER = 1.5
RATE_LIMIT_WARNING_THRESHOLD = 100  # warn when remaining requests fall below this


def get_env(name, required=True):
    value = os.environ.get(name, "")
    if required and not value:
        print(f"ERROR: Environment variable {name} not set.", file=sys.stderr)
        sys.exit(1)
    return value


def github_api(url, token):
    """Make authenticated GitHub API request with exponential backoff on rate limits.

    Backoff policy (mirrors CONTRIBUTING.md §GitHub API Rate Limit Handling):
    - Initial interval: BACKOFF_INITIAL_INTERVAL (30 s)
    - Max interval:      BACKOFF_MAX_INTERVAL (300 s / 5 min)
    - Multiplier:        BACKOFF_MULTIPLIER (1.5×) per retry
    - Reset:             on success
    """
    interval = BACKOFF_INITIAL_INTERVAL
    attempt = 0

    while True:
        req = Request(url)
        req.add_header("Authorization", f"token {token}")
        req.add_header("Accept", "application/vnd.github+json")
        req.add_header("X-GitHub-Api-Version", "2022-11-28")
        try:
            with urlopen(req) as resp:
                # Log remaining quota proactively so callers can monitor headroom
                remaining = resp.headers.get("x-ratelimit-remaining")
                if remaining is not None and int(remaining) < RATE_LIMIT_WARNING_THRESHOLD:
                    reset_ts = resp.headers.get("x-ratelimit-reset", "")
                    reset_str = ""
                    if reset_ts:
                        reset_str = f", resets at {datetime.fromtimestamp(int(reset_ts), tz=timezone.utc).isoformat()}"
                    print(
                        f"  ⚠ Rate-limit headroom low: {remaining} requests remaining{reset_str}",
                        file=sys.stderr,
                    )
                interval = BACKOFF_INITIAL_INTERVAL  # reset backoff on success
                return json.loads(resp.read().decode())
        except HTTPError as e:
            if e.code == 404:
                return None
            if e.code in (429, 403):
                # Log rate-limit-reset header so operators know when quota refills
                reset_ts = e.headers.get("x-ratelimit-reset", "")
                reset_str = ""
                if reset_ts:
                    reset_str = f" (resets at {datetime.fromtimestamp(int(reset_ts), tz=timezone.utc).isoformat()})"
                remaining = e.headers.get("x-ratelimit-remaining", "unknown")
                print(
                    f"  ⚠ Rate limit hit (HTTP {e.code}): {remaining} requests remaining{reset_str}",
                    file=sys.stderr,
                )
                attempt += 1
                print(f"  ↻ Backing off {interval:.0f}s before retry (attempt {attempt})…", file=sys.stderr)
                time.sleep(interval)
                interval = min(interval * BACKOFF_MULTIPLIER, BACKOFF_MAX_INTERVAL)
                continue
            print(f"  WARNING: API error {e.code} for {url}", file=sys.stderr)
            return None


def collect_copilot_metrics(org, token):
    """Collect Copilot usage metrics for the organization."""
    print(f"  Collecting Copilot metrics for {org}...")
    data = github_api(
        f"https://api.github.com/orgs/{org}/copilot/usage",
        token
    )
    if not data:
        print("  WARNING: Could not fetch Copilot metrics (need org admin scope)")
        return {"available": False}

    # Extract recent metrics
    days = data.get("day_breakdown", data.get("breakdown", []))
    if not days:
        return {"available": True, "days": []}

    return {
        "available": True,
        "total_active_users": data.get("total_active_users", 0),
        "days": days[-28:] if len(days) > 28 else days
    }


def collect_pr_metrics(repo, token):
    """Collect PR velocity metrics for a repo."""
    print(f"  Collecting PR metrics for {repo}...")
    since = (datetime.now(timezone.utc) - timedelta(days=28)).isoformat()

    # Get recently closed PRs
    prs = github_api(
        f"https://api.github.com/repos/{repo}/pulls?state=closed&sort=updated&per_page=50",
        token
    ) or []

    cycle_times = []
    for pr in prs:
        if not pr.get("merged_at"):
            continue
        created = datetime.fromisoformat(pr["created_at"].replace("Z", "+00:00"))
        merged = datetime.fromisoformat(pr["merged_at"].replace("Z", "+00:00"))
        hours = (merged - created).total_seconds() / 3600
        cycle_times.append(hours)

    if cycle_times:
        cycle_times.sort()
        median = cycle_times[len(cycle_times) // 2]
        p95 = cycle_times[int(len(cycle_times) * 0.95)]
    else:
        median = 0
        p95 = 0

    return {
        "prs_merged_28d": len(cycle_times),
        "cycle_time_median_hours": round(median, 1),
        "cycle_time_p95_hours": round(p95, 1)
    }


def collect_ci_metrics(repo, token):
    """Collect CI success rate for a repo."""
    print(f"  Collecting CI metrics for {repo}...")
    runs = github_api(
        f"https://api.github.com/repos/{repo}/actions/runs?per_page=100&status=completed",
        token
    )
    if not runs or "workflow_runs" not in runs:
        return {"success_rate": 0, "total_runs": 0}

    workflow_runs = runs["workflow_runs"][:100]
    success = sum(1 for r in workflow_runs if r["conclusion"] == "success")
    total = len(workflow_runs)

    return {
        "success_rate": round(success / total * 100, 1) if total > 0 else 0,
        "total_runs_sampled": total
    }


def collect_issue_metrics(repo, token):
    """Collect issue resolution metrics."""
    print(f"  Collecting issue metrics for {repo}...")
    since = (datetime.now(timezone.utc) - timedelta(days=28)).isoformat()

    issues = github_api(
        f"https://api.github.com/repos/{repo}/issues?state=closed&since={since}&per_page=50",
        token
    ) or []

    # Filter out PRs (they show up in issues endpoint)
    issues = [i for i in issues if "pull_request" not in i]

    resolution_times = []
    for issue in issues:
        created = datetime.fromisoformat(issue["created_at"].replace("Z", "+00:00"))
        closed = datetime.fromisoformat(issue["closed_at"].replace("Z", "+00:00"))
        hours = (closed - created).total_seconds() / 3600
        resolution_times.append(hours)

    median = 0
    if resolution_times:
        resolution_times.sort()
        median = resolution_times[len(resolution_times) // 2]

    return {
        "issues_closed_28d": len(resolution_times),
        "resolution_time_median_hours": round(median, 1)
    }


def collect_basecoat_coverage(repo, token):
    """Check which Base Coat assets are present in the target repo."""
    print(f"  Checking Base Coat coverage in {repo}...")

    # Check for common basecoat directories
    coverage = {}
    for path in [".github/agents", ".github/instructions", ".github/skills", ".github/prompts"]:
        result = github_api(
            f"https://api.github.com/repos/{repo}/contents/{path}",
            token
        )
        if result and isinstance(result, list):
            coverage[path.split("/")[-1]] = len(result)
        else:
            coverage[path.split("/")[-1]] = 0

    total_possible = 43 + 27 + 21 + 3  # agents + instructions + skills + prompts
    total_found = sum(coverage.values())
    coverage["percentage"] = round(total_found / total_possible * 100, 1)

    return coverage


def detect_degradation(current, history):
    """Compare current metrics to recent history and flag regressions."""
    alerts = []
    if len(history) < 2:
        return alerts

    prev = history[-1]

    # Check Copilot acceptance rate drop
    if current["copilot"]["available"] and prev.get("copilot", {}).get("available"):
        curr_rate = current["copilot"].get("acceptance_rate", 0)
        prev_rate = prev["copilot"].get("acceptance_rate", 0)
        if prev_rate > 0 and curr_rate < prev_rate * 0.9:
            alerts.append({
                "type": "copilot_acceptance_drop",
                "severity": "warning",
                "message": f"Copilot acceptance rate dropped from {prev_rate:.1f}% to {curr_rate:.1f}%",
                "previous": prev_rate,
                "current": curr_rate
            })

    # Check per-repo CI success rate drop
    for repo, data in current.get("repos", {}).items():
        prev_repo = prev.get("repos", {}).get(repo, {})
        curr_ci = data.get("ci", {}).get("success_rate", 100)
        prev_ci = prev_repo.get("ci", {}).get("success_rate", 100)
        if prev_ci > 0 and curr_ci < prev_ci - 15:
            alerts.append({
                "type": "ci_success_drop",
                "severity": "warning",
                "repo": repo,
                "message": f"CI success rate for {repo} dropped from {prev_ci}% to {curr_ci}%",
                "previous": prev_ci,
                "current": curr_ci
            })

        # Check PR cycle time increase (>50% slower)
        curr_cycle = data.get("pull_requests", {}).get("cycle_time_median_hours", 0)
        prev_cycle = prev_repo.get("pull_requests", {}).get("cycle_time_median_hours", 0)
        if prev_cycle > 0 and curr_cycle > prev_cycle * 1.5:
            alerts.append({
                "type": "cycle_time_increase",
                "severity": "info",
                "repo": repo,
                "message": f"PR cycle time for {repo} increased from {prev_cycle}h to {curr_cycle}h",
                "previous": prev_cycle,
                "current": curr_cycle
            })

    return alerts


def main():
    print("Base Coat Adoption Metrics Collector")
    print("=" * 40)

    token = get_env("GITHUB_TOKEN")
    copilot_token = os.environ.get("COPILOT_METRICS_TOKEN", token)
    org = get_env("DASHBOARD_ORG")
    repos_json = get_env("DASHBOARD_REPOS")
    repos = json.loads(repos_json)

    print(f"Organization: {org}")
    print(f"Repos to monitor: {repos}")
    print("")

    # Collect metrics
    metrics = {
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "organization": org,
        "copilot": collect_copilot_metrics(org, copilot_token),
        "repos": {}
    }

    for repo in repos:
        print(f"\n── {repo} ──")
        metrics["repos"][repo] = {
            "pull_requests": collect_pr_metrics(repo, token),
            "ci": collect_ci_metrics(repo, token),
            "issues": collect_issue_metrics(repo, token),
            "basecoat_coverage": collect_basecoat_coverage(repo, token)
        }

    # Output
    output_dir = os.environ.get("OUTPUT_DIR", "metrics")
    os.makedirs(output_dir, exist_ok=True)

    # Write current metrics
    output_path = os.path.join(output_dir, "latest.json")
    with open(output_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"\n✓ Metrics written to {output_path}")

    # Append to history
    history_path = os.path.join(output_dir, "history.json")
    history = []
    if os.path.exists(history_path):
        with open(history_path) as f:
            history = json.load(f)

    history.append(metrics)
    # Keep last 52 weeks
    history = history[-52:]

    with open(history_path, "w") as f:
        json.dump(history, f, indent=2)
    print(f"✓ History updated ({len(history)} data points)")

    # Check for degradation signals and output alerts
    alerts = detect_degradation(metrics, history)
    alerts_path = os.path.join(output_dir, "alerts.json")
    with open(alerts_path, "w") as f:
        json.dump(alerts, f, indent=2)
    if alerts:
        print(f"⚠ {len(alerts)} degradation alert(s) detected")
    else:
        print("✓ No degradation signals")

    # Generate summary markdown
    summary_path = os.path.join(output_dir, "SUMMARY.md")
    with open(summary_path, "w") as f:
        f.write(f"# Adoption Metrics Summary\n\n")
        f.write(f"Collected: {metrics['collected_at'][:10]}\n\n")
        f.write(f"## Copilot Usage\n\n")
        if metrics["copilot"]["available"]:
            f.write(f"- Active users: {metrics['copilot'].get('total_active_users', 'N/A')}\n\n")
        else:
            f.write("- Copilot metrics not available (check token permissions)\n\n")
        f.write(f"## Repository Metrics\n\n")
        f.write("| Repo | PRs Merged | Cycle Time | CI Success | Coverage |\n")
        f.write("|------|-----------|------------|------------|----------|\n")
        for repo, data in metrics["repos"].items():
            short = repo.split("/")[-1]
            pr = data["pull_requests"]
            ci = data["ci"]
            cov = data["basecoat_coverage"]
            f.write(f"| {short} | {pr['prs_merged_28d']} | {pr['cycle_time_median_hours']}h | {ci['success_rate']}% | {cov['percentage']}% |\n")
        f.write("\n")
    print(f"✓ Summary written to {summary_path}")


if __name__ == "__main__":
    main()
