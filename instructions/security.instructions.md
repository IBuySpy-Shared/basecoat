---
description: "Use when working on authentication, authorization, secrets, input handling, or any change with security implications. Covers common secure coding best practices."
applyTo: "**/*"
---

# Security Standards

Use this instruction for any change that touches trust boundaries, data handling, or privileged behavior.

## Expectations

- Validate untrusted input at system boundaries and encode output for its destination context.
- Do not hardcode secrets, tokens, certificates, or connection strings.
- Do not include secrets, tokens, keys, passwords, or connection strings in commit messages.
- Do not include PII or production identifiers in commit messages.
- Prefer least privilege for identities, roles, API scopes, and data access.
- Fail closed when authorization or required security context is missing.
- Avoid logging sensitive values, security tokens, or personal data unless explicitly required and protected.
- Prefer platform security primitives over custom cryptography or homegrown auth flows.

## OIDC Federation for Azure Authentication

- All GitHub Actions workflows authenticating to Azure **must** use OIDC federated credentials via `azure/login@v2`.
- Storing service principal client secrets (`AZURE_CLIENT_SECRET`) as GitHub Secrets is **forbidden**.
- Workflows must include `permissions: id-token: write` to enable OIDC token issuance.
- Only non-secret identifiers (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`) may be stored as GitHub Secrets.
- See [`docs/guardrails/oidc-federation.md`](../docs/guardrails/oidc-federation.md) for the full bootstrap pattern and rationale.

## Review Lens

- What are the trust boundaries in this change?
- Can a caller bypass validation or authorization through alternate paths?
- Are secrets handled through configuration and secret stores rather than source control?
- Does the commit message contain any secret-like data or PII?
- Does the change expand attack surface through deserialization, shelling out, dynamic code, or unsafe parsing?

## Workflow Secrets

GitHub Actions workflow files (`*.yml` / `*.yaml` in `.github/workflows/`) must never contain hardcoded secrets, tokens, passwords, or connection strings — not in `env` blocks, `with` parameters, or `run` scripts.

- All sensitive values must be referenced via `${{ secrets.SECRET_NAME }}`.
- Treat any literal credential in a workflow file as a leaked secret — rotate immediately.
- See the full guardrail document: [`docs/guardrails/secrets-in-workflows.md`](/docs/guardrails/secrets-in-workflows.md).

## Commit Message Guardrails

- Keep commit messages descriptive but non-sensitive.
- Reference issue IDs or work items instead of embedding payloads, tokens, emails, or credentials.
- If a commit message accidentally contains sensitive content, rewrite history immediately and rotate affected credentials.
