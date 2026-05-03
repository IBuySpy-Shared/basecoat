# Copilot Metrics Setup

Post-enablement configuration for GitHub Copilot usage metrics.

## Prerequisites

Before any metrics data is available you need:

1. **GitHub Enterprise Cloud** subscription
2. **Enterprise admin** to enable the usage-metrics policy (see below)
3. **24–48 hours** for the data pipeline to initialize after policy activation
4. A GitHub token with the `manage_billing:copilot` scope (or `read:org` for the
   legacy endpoint) stored as the `COPILOT_METRICS_TOKEN` Actions secret

## Enabling the Enterprise Policy

1. Sign in as an enterprise admin at `https://github.com/enterprises/<enterprise>`
2. Go to **Settings → Policies → Copilot**
3. Under **Usage metrics**, select **Enabled**
4. Save changes

Once enabled, the following endpoints become available:

| Endpoint | Description |
|---|---|
| `GET /orgs/{org}/copilot/metrics` | Daily metrics with language/editor breakdown |
| `GET /orgs/{org}/copilot/metrics/reports/org-1-day` | Single-day summary report |
| `GET /orgs/{org}/copilot/billing/seats` | Seat assignments and last-activity timestamps |

## What the Metrics Include

- **Active users** — seats that triggered at least one completion or chat session
- **Suggestions generated / accepted** — per language and per editor
- **Chat sessions** — Copilot Chat interactions in IDE and on github.com
- **Pull-request summaries** — auto-generated PR descriptions via Copilot

## Configuring the Adoption Metrics Workflow

The `adoption-metrics.yml` workflow calls
`scripts/metrics/collect-metrics.py`, which now tries the newer
`/copilot/metrics` endpoint first and automatically falls back to the
legacy `/copilot/usage` endpoint while the enterprise policy is pending.

Required Actions secrets:

| Secret | Description |
|---|---|
| `COPILOT_METRICS_TOKEN` | Token with `manage_billing:copilot` scope for the new endpoint; falls back to `GITHUB_TOKEN` |
| `DASHBOARD_ORG` | GitHub organisation name (e.g. `IBuySpy-Shared`) |
| `DASHBOARD_REPOS` | JSON array of repositories to monitor |

## Verifying the Endpoint Works

```bash
gh api /orgs/IBuySpy-Shared/copilot/metrics \
  --header "Accept: application/vnd.github+json"
```

A successful response is a JSON array of daily metric objects. A `404` means the
enterprise policy has not been enabled yet.

## Already-Working Endpoints

While waiting for policy activation, the following endpoints return data
with `admin:enterprise` + `admin:org` scopes:

```bash
# Seat costs
gh api /enterprises/ibuyspy/settings/billing/usage

# Seat assignments and last activity
gh api /orgs/IBuySpy-Shared/copilot/billing/seats
```

## References

- [GitHub Docs — Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics)
- [GitHub Docs — Copilot Billing API](https://docs.github.com/en/rest/copilot/copilot-billing)
- `docs/BLOCKED_ISSUES.md` — issue #282 tracking this prerequisite
