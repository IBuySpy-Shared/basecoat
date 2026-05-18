# GitHub Repository Secrets Setup

This document describes every secret that must be configured in repository
settings for Base Coat's GitHub Actions workflows to run correctly.

Navigate to: **Settings → Secrets and variables → Actions → New repository secret**

---

## Required Secrets

### `COPILOT_GITHUB_TOKEN`

**Used by:** `issue-triage.lock.yml`, `code-review-agent.lock.yml`,
`security-analyst.lock.yml`, `retro-facilitator.lock.yml`,
`self-healing-ci.lock.yml`, `release-impact-advisor.lock.yml`

**Purpose:** Authenticates the GitHub Agentic Workflow (gh-aw) agent containers.
Without this secret the agentic lock-file workflows will fail to start.

**How to create (recommended):**

1. Go to <https://github.com/settings/personal-access-tokens/new>
2. Create a **fine-grained PAT**
3. Set **Resource owner** to your user account
4. Under **Account permissions**, set **Copilot Requests** → `Read`
5. Set expiration to **90 days** (rotate on expiry)
6. Generate token and copy it immediately
7. Run bootstrap script:

```powershell
pwsh scripts/bootstrap-copilot-github-token.ps1 -Repo IBuySpy-Shared/basecoat
```

If you prefer manual UI setup, add the value as repository secret
`COPILOT_GITHUB_TOKEN`.

**Rotation schedule:** Rotate every 90 days. Set a calendar reminder.
When rotating, generate a new token *before* the old one expires, update
the secret, then revoke the old token.

---

### `GH_AW_GITHUB_TOKEN`

**Used by:** All `*.lock.yml` agentic workflow files

**Purpose:** Grants the agentic workflow read access to repository contents
during agent execution (separate from `COPILOT_GITHUB_TOKEN` for least-privilege
isolation).

**How to create:** Use a **separate token** from `COPILOT_GITHUB_TOKEN`
(recommended). Name it `basecoat-gh-aw` and grant only the minimum
repository read permissions required.

---

### `GH_AW_GITHUB_MCP_SERVER_TOKEN`

**Used by:** `issue-triage.lock.yml`, `code-review-agent.lock.yml`

**Purpose:** Authenticates the GitHub MCP server sidecar used by the gh-aw
agent to call GitHub APIs from within the agent container.

**How to create:** A fine-grained PAT scoped to this repository with:

- **Repository permissions:** Issues (read/write), Pull requests (read/write),
  Contents (read)
- Name it `basecoat-mcp-server`

---

### `GHCR_PULL_TOKEN`

**Used by:** `mcp-deploy.yml`, `portal-deploy.yml`

**Purpose:** Long-lived GitHub PAT with `read:packages` scope used as the
container registry pull credential stored in Azure Container Apps. Unlike
`GITHUB_TOKEN`, this token does not expire when the workflow run ends, so
Azure can authenticate GHCR on every container restart, scale-out, and
revision activation.

> ⚠️ Never substitute `GITHUB_TOKEN` here. `GITHUB_TOKEN` is scoped to a
> single workflow run and will cause image pull failures on any subsequent
> container lifecycle event.

**How to create:**

1. Go to <https://github.com/settings/tokens?type=beta> (fine-grained PAT)
2. Set **Resource owner** to your organization
3. Under **Repository permissions** → **Packages** → set to `Read`
4. Set expiration to **90 days** (rotate on expiry)
5. Generate and copy the token immediately
6. Add as repository secret `GHCR_PULL_TOKEN`

**Rotation schedule:** Rotate every 90 days. Update the secret before the
token expires to avoid deployment downtime.

---

### `PORTAL_RESOURCE_GROUP`

**Used by:** `portal-deploy.yml`

**Purpose:** Azure resource group name where the portal app infrastructure is
deployed.

---

### `PORTAL_DB_AAD_ADMIN_OBJECT_ID`

**Used by:** `portal-deploy.yml`

**Purpose:** Object ID of the Entra ID principal (user, group, or service
principal) that will be granted the PostgreSQL administrator role. The
PostgreSQL Flexible Server is configured with RBAC-only authentication
(password auth disabled), so this must be set before the first deployment.

---

### `PORTAL_DB_AAD_ADMIN_LOGIN`

**Used by:** `portal-deploy.yml`

**Purpose:** Display name / login of the Entra ID PostgreSQL administrator
principal (must match the object ID in `PORTAL_DB_AAD_ADMIN_OBJECT_ID`).

---

### `STAGING_API_TOKEN`

**Used by:** `performance-baseline-pr-check.yml`

**Purpose:** API token for the staging deployment used by k6 performance tests.

**Note:** This workflow is a pre-existing non-blocking failure when the staging
deployment is not provisioned. CI will report it as failing on every PR; this
does not block merges since branch protection is not enforced on `main`.

---

## Optional Secrets

### `SLACK_WEBHOOK_URL`

**Used by:** Release notification step (if added in future)

Not currently wired up. Reserve the name if Slack integration is planned.

---

## Validating Secrets

After setting all secrets, trigger a manual workflow run to confirm:

```bash
gh workflow run issue-triage.yml --repo IBuySpy-Shared/basecoat
```

Check the Actions tab for green status on the `triage` job. If it fails with
`secret not found`, verify the secret name matches exactly (case-sensitive).

---

## See Also

- [Operational Runbook](OPERATIONAL_RUNBOOK.md)
- [Enterprise Security Hardening](ENTERPRISE_SECURITY_HARDENING.md)
- [GitHub Agentic Workflows docs](https://github.github.com/gh-aw/introduction/overview/)
