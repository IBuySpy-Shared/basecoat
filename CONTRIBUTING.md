# Contributing to basecoat

basecoat is a GitHub Enterprise template for agentic development shops. It must follow its own advice.
This document is the canonical reference for how changes are made — by humans and AI agents alike.

---

## Issue-First Workflow

**Every meaningful change starts with an issue.**

| Change Type | Issue Required? |
|---|---|
| New file, agent, skill, or instruction | ✅ Yes |
| Bug fix or typo affecting behavior | ✅ Yes |
| Typo-only or whitespace fix | ❌ Inline is fine |
| Dependency bump with no logic change | ❌ Inline is fine |
| Documentation rewrite | ✅ Yes |

If you are an AI agent: **do not begin implementation without an issue number**. If no issue exists, create one first, then proceed.

---

## Branch Naming

```text
<type>/<issue-number>-<short-description>
```

| Type | When to Use |
|---|---|
| `feat` | New feature or content |
| `fix` | Bug or correctness fix |
| `docs` | Documentation only |
| `chore` | Maintenance, deps, CI |
| `security` | Security-related changes |

**Examples:**

```text
feat/43-governance-docs
fix/17-hook-glob-pattern
docs/39-readme-overhaul
```

No direct commits to `main`. Ever.

---

## Pull Request Process

1. **Create a branch** from `main` using the naming convention above.
2. **Make your changes** — keep scope tight to the issue.
3. **Open a PR** referencing the issue: `closes #<issue-number>` in the description.
4. **Self-review** your diff before requesting review.
5. **All CI checks must pass** before merge.
6. **At least one approval** required (human or designated AI reviewer).
7. **Squash-merge** preferred to keep `main` history clean.

**PR Title Format:**

```text
<type>: <short description> (closes #<issue-number>)
```

**Examples:**

```text
feat: governance framework documentation (closes #43)
fix: commit-msg hook glob pattern (closes #17)
```

---

## Commit Message Format

```text
<type>(<scope>): <short summary>

- Optional bullet points for detail
- Reference issue: #<number>

Co-authored-by: <name> <email>  # if applicable
```

**Types:** `feat`, `fix`, `docs`, `chore`, `security`, `test`, `refactor`

**Rules:**

- First line ≤ 72 characters
- Reference the issue number
- No secrets, tokens, keys, passwords, or PII — ever
- Keep messages descriptive but non-sensitive
- Do not embed payloads, credentials, or connection strings

---

## Secret Policy

**Never commit secrets.** This is non-negotiable.

What counts as a secret:

- API keys, tokens, client secrets
- Passwords, passphrases, PINs
- Connection strings with credentials embedded
- Private keys or certificates
- PII (names, emails, IDs) not required for the change

**If you accidentally commit a secret:**

1. Rewrite history immediately (`git rebase`, `git filter-branch`, or BFG)
2. Rotate the affected credential immediately
3. Notify the repo owner

The `.githooks/commit-msg` hook scans commit messages for secret patterns. Install it:

```bash
bash scripts/install-git-hooks.sh
# or on Windows:
pwsh scripts/install-git-hooks.ps1
```

---

## Review Expectations

**For authors:**

- Keep PRs focused — one issue per PR
- Write a clear summary and validation steps in the PR description
- Call out any deviations from standards and why

**For reviewers:**

- Check that the change matches the linked issue
- Verify no secrets or PII are present
- Confirm tests or validation steps are included where applicable
- Approve explicitly — do not merge without review

**AI agents acting as reviewers** must apply the same standards. An AI approval carries the same weight as a human approval and the same accountability.

---

## Issue Labeling Standards

All issues MUST include at least one label for discoverability and sprint tracking.

### Required Labels

Every issue should include:

- **One asset type label** (if applicable): `agent`, `skill`, `instruction`, `prompt`
- **One issue type label**: `bug`, `enhancement`, `documentation`, `question`, `chore`, `security`
- **One sprint label** (if assigned to a sprint): `sprint-1`, `sprint-2`, `sprint-3`, `sprint-4`

### Recommended Labels

- **Priority**: `priority:high` (1hr SLA), `priority:medium` (4hr SLA), `priority:low` (1 week SLA)
- **Technology/Domain**: `azure`, `dotnet`, `kubernetes`, `python`, `terraform`, etc.
- **Blocking**: `blocked` (if waiting on a dependency), `spec-required` (if needs PRD before work starts)

### Labeling Workflow

1. **When creating an issue:** Apply at least one label from each required category
2. **When starting work:** Add sprint label (e.g., `sprint-3`) and priority if not already set
3. **When blocked:** Add `blocked` label and explain in a comment
4. **When closing:** Labels carry forward to related issues for tracking

### Label Taxonomy Reference

Complete reference: [`docs/LABEL_TAXONOMY.md`](../docs/LABEL_TAXONOMY.md)

GitHub search examples:

- `is:issue label:agent` — Find all agent-related issues
- `is:issue label:sprint-3 label:enhancement` — Find Sprint 3 enhancements
- `is:issue label:priority:high is:open` — Find open high-priority issues

---

## Adding Agents, Skills, and Instructions

- **Agents** go in `agents/`. Use existing agents as templates.
- **Skills** go in `skills/<skill-name>/`. Every skill needs a `SKILL.md`.
- **Instructions** go in `instructions/`. Every instruction needs frontmatter with `description` and `applyTo`.
- **Templates** go in `docs/templates/`.

All new agents, skills, and instructions require an issue before implementation.

### Agent Frontmatter Schema

Every agent file (`agents/<name>.agent.md`) must begin with YAML frontmatter containing at minimum the required fields below.

| Field | Required | Description |
|---|---|---|
| `name` | ✅ Yes | Identifier for the agent (typically matches filename without extension) |
| `description` | ✅ Yes | One-line summary of what the agent does and when to use it |
| `tools` | ❌ Optional | List of tools the agent may invoke |
| `model` | ❌ Optional | Model override (e.g., `gpt-4o`, `claude-sonnet-4`) |
| `handoffs` | ❌ Optional | List of VS Code handoff transitions to other agents (see below) |

**Example:**

```yaml
---
name: backend-dev
description: "Backend development agent for APIs, services, and business logic."
tools: [read_file, write_file, list_dir, run_terminal_command]
handoffs:
  - label: Run Code Review
    agent: code-review
    prompt: Review the implementation above for correctness, security, and test coverage.
    send: false
---
```

The `name` and `description` fields are validated by `scripts/validate-basecoat.ps1` and CI.

#### Handoffs

The `handoffs` field enables VS Code to render transition buttons after an agent response,
letting users move to the next agent in a workflow with a pre-filled prompt. Each entry in
the array has four fields:

| Field | Required | Description |
|---|---|---|
| `label` | ✅ Yes | Text shown on the transition button in VS Code |
| `agent` | ✅ Yes | `name` of the target agent (matches filename without `.agent.md`) |
| `prompt` | ✅ Yes | Pre-filled context passed to the target agent |
| `send` | ❌ Optional | `false` (default) lets the user review before sending; `true` auto-sends |

Use `send: false` for all handoffs so users can review and adjust the pre-filled context.
See `docs/agent-handoffs.md` for the full list of implemented handoff chains and guidelines
for authoring effective prompts.

---

## Merge Policy & Build Verification

**This section is mandatory for all contributors — human and AI alike.**

### Branch Protection Rules

The `main` branch enforces the following protections:

- **No direct commits** — all changes must arrive via a pull request
- **Required status checks must pass** before any merge is allowed
- **Stale review dismissal** — approvals are invalidated if new commits are pushed after approval
- **At least one approval** required before merge

### Required Status Checks

Every PR targeting `main` must pass **all** of the following checks before it can be merged:

| Check Name | Workflow | Purpose |
|---|---|---|
| `Markdown lint` | `pr-validation.yml` | Lints changed `.md` files against markdownlint rules |
| `Validate agent file structure` | `pr-validation.yml` | Verifies agents have required frontmatter and sections |
| `Sync script dry-run` | `pr-validation.yml` | Validates sync.sh runs cleanly against a temp consumer repo |
| `version-consistency` | `version-check.yml` | Ensures version.json and latest CHANGELOG.md entry match |
| `prd-spec-gate` | `prd-spec-gate.yml` | Requires PRD/spec links for high-change or risky PRs |
| `validate-commit-messages` | `validate-basecoat.yml` | Scans commit messages for secrets and PII patterns |
| `validate-unix` | `validate-basecoat.yml` | Runs full validation suite on Ubuntu |
| `validate-windows` | `validate-basecoat.yml` | Runs full validation suite on Windows |

> **Note:** `Gitleaks` scans run as warn-only and do **not** block merge by design.
> Findings must be reviewed and remediated, but they will not prevent a passing build
> from being merged.

### Agent Guardrail — Mandatory Build Verification Step

**Any AI agent that opens or works a PR must perform this verification before declaring the work done:**

```bash
# Verify all required checks are green before closing a PR
gh pr checks <PR-NUMBER> --repo <owner>/<repo>

# Expected: every listed check shows a ✓ pass status.
# Do NOT merge or mark work complete if any check is pending or failing.
```

Agents must:

1. Open the PR
2. Wait for the check suite to run (poll with `gh pr checks` until all are complete)
3. Confirm every required check shows **pass** status
4. Only then mark the PR as ready to merge / work as done

**Do not declare a PR "done" because it was opened. The PR is done when checks pass and it is merged.**

### No Auto-Merge

Auto-merge is not enabled. Merges require:

1. All required status checks green
2. At least one approval
3. No unresolved conversations

This is intentional — catching a broken build post-merge is significantly more expensive than the few minutes it takes to confirm checks passed first.

---

## Adoption Tooling

Base Coat provides tools to track, measure, and monitor asset adoption across your GitHub organization.

### 1. Adoption Scanner (`scripts/adoption/detect-basecoat.ps1`)

Scans all repositories in your organization to detect which ones have synced Base Coat assets, including version alignment and custom modifications.

**Usage:**

```powershell
# Scan default org (IBuySpy-Shared) and output as table
./scripts/adoption/detect-basecoat.ps1

# Scan specific org and output as JSON
./scripts/adoption/detect-basecoat.ps1 -Org "MyOrg" -OutputFormat json

# Output as markdown (good for reports)
./scripts/adoption/detect-basecoat.ps1 -OutputFormat markdown
```

**What it reports:**

- Which repos have synced assets (agents, instructions, prompts, skills)
- How many assets are **current** vs. **stale** (version drift)
- Custom assets (local modifications not from Base Coat)
- Overall **coverage %** — how many Base Coat assets are present
- Active Copilot seats in the organization

**Output formats:**

- `table` (default) — Human-readable terminal output
- `json` — Machine-readable for integration with dashboards
- `markdown` — Formatted for GitHub issues, reports, or email

### 2. Metrics Collector (`scripts/metrics/collect-metrics.py`)

Continuously collects and tracks metrics for Base Coat adoption alongside development metrics (PR velocity, CI success, issue resolution).

**Usage:**

```bash
export GITHUB_TOKEN="<your-token>"
export DASHBOARD_ORG="IBuySpy-Shared"
export DASHBOARD_REPOS='["org/repo1", "org/repo2"]'
python scripts/metrics/collect-metrics.py
```

**Collected metrics:**

- Base Coat coverage per repository (% of assets synced)
- Copilot usage trends (active users, acceptance rate)
- PR cycle time (median and p95)
- CI/CD success rate
- Issue resolution times
- Degradation alerts (acceptance rate drops, CI failures, cycle time increases)

**Output:**

- `metrics/latest.json` — Current metrics snapshot
- `metrics/history.json` — Time-series data (up to 52 weeks)
- `metrics/alerts.json` — Active degradation signals
- `metrics/SUMMARY.md` — Human-readable summary

**Integration:** Use with GitHub Actions to run daily and feed a dashboard or reporting system.

### 3. Tracking Inventory

The `INVENTORY.md` and `CATALOG.md` files document all available assets (agents, skills, instructions, prompts) with descriptions, keywords, and use cases. Keep these updated when adding or removing assets.

**When to update:**

- Add new agent, skill, or instruction file → add entry to `INVENTORY.md` and `CATALOG.md`
- Remove deprecated asset → remove from both files
- Change description or functionality → update both files

**Format:**

Both files follow Markdown table format with columns for name, file path, description, and keywords. See existing entries for the expected style.

---

## Questions

Open an issue with the `question` label. Do not DM maintainers for things that belong in the open.
