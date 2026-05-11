---
name: azure-devops-rest
description: "Use when building Azure DevOps REST integrations for work items, pipelines, repos, artifacts, auth, pagination, throttling, and API versioning."
context: fork
compatibility: ["VS Code", "Cursor", "Windsurf", "Claude Code"]
metadata:
  category: "Developer Tools"
  tags: ["azure-devops", "rest-api", "pipelines", "work-items", "automation"]
  maturity: "production"
  audience: ["developers", "devops-engineers"]
allowed-tools: ["bash", "git", "grep", "find"]
---

# Azure DevOps REST API Skill

Use this skill when you need proven patterns for scripts, automations, or agents that call Azure DevOps Services or Azure DevOps Server through the REST API. It helps with authentication choices, endpoint discovery, scope selection, pagination, throttling, and safe request construction for work items, pipelines, repos, artifacts, and extensions.

## When to Use

- Query or update work items with WIQL or JSON Patch
- Trigger pipelines or inspect runs from automation
- Read repos, pull requests, refs, commits, or artifacts
- Design reliable pagination and retry handling
- Choose the right auth flow for local scripts, agents, or pipelines

## Inputs and Outputs

Typical input includes the organization URL, project name, API version, auth method, endpoint path, request body, and any continuation token. The output usually returns JSON payloads, status codes, response headers, and resource identifiers. This skill also produces guidance on required scopes, safe headers, retry behavior, and common failure modes so the caller can turn raw API output into dependable automation.

## Example Requests

```bash
curl -sS \
  -u ":$AZDO_PAT" \
  -H "Content-Type: application/json" \
  "https://dev.azure.com/<org>/<project>/_apis/wit/workitems?ids=101,102&api-version=7.1"
```

Use `application/json-patch+json` for PATCH operations, and always include `api-version=7.1`. For pipeline runs, send the correct branch or template parameters and check the returned run identifier so downstream steps can poll for completion.

## Reference Files

| File | Contents |
|------|----------|
| [`references/pipelines.md`](references/pipelines.md) | Auth (PAT + OIDC), API versioning, pagination (continuation tokens), throttling, work items, repos, pipelines endpoints |
| [`references/extensions.md`](references/extensions.md) | Artifacts/packages, service hooks, extension development, common pitfalls, review lens |

## Auth Quick Reference

| Method | When to Use |
|--------|------------|
| PAT (Basic auth) | Scripts, local development |
| Managed Identity / `System.AccessToken` | Azure Pipelines, Azure-hosted automation |

Always specify `api-version=7.1`. PATs: expiry ≤ 90 days, stored in Key Vault.

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Wrong Content-Type on PATCH | Use `application/json-patch+json` |
| Missing `api-version` | Always include `?api-version=7.1` |
| Not handling 429 | Check `Retry-After` header; exponential backoff |
| No pagination | Always check `x-ms-continuationtoken` |

## Key Limits

- WIQL: max 20,000 work item IDs
- Batch get: max 200 IDs per request
- Default page size: ~200 items (use `$top` to control)
