---
description: "Use when configuring, invoking, or reviewing MCP servers and MCP tool usage. Covers trust boundaries, tool allowlisting, secrets handling, and safe operation patterns."
applyTo: "**/*.{md,json,yml,yaml,ts,js,py,ps1,sh}"
---

# MCP Standards

Use this instruction for any change that adds, modifies, or relies on MCP servers, MCP tools, or model-tool workflows.

## Expectations

- Treat every MCP server as an external trust boundary unless it is owned, reviewed, and pinned by your organization.
- Use an explicit allowlist of approved MCP servers and approved tools per server.
- Pin server versions and client dependencies. Do not use floating latest references for production usage.
- Scope credentials to least privilege and store secrets in secure configuration, not source control.
- Prefer short-lived credentials and managed identity where supported by the host platform.
- Require explicit user confirmation before any MCP tool can create, delete, deploy, or mutate external systems.
- Validate all MCP tool inputs and sanitize model-generated arguments before execution.
- Log tool invocation metadata for auditability, including tool name, caller context, and outcome.
- Do not send sensitive payloads to MCP servers unless data classification and retention are approved.
- Set timeout, retry, and circuit-breaker behavior for MCP operations to avoid runaway execution.

## Governance Rules

- Define approved MCP servers in a central registry document owned by the COE.
- Every approved server entry must include owner, purpose, data classification, auth method, and last review date.
- Add a deprecation process so old servers can be retired without breaking consumers.
- Require architecture or security review for any new MCP server integration.
- Track changes to MCP policy through versioned standards and amendments.

## Review Lens

- Is this MCP server approved and documented by the COE?
- Are tool permissions limited to the minimum needed for this scenario?
- Could model output trigger unsafe tool actions without a human checkpoint?
- Are secrets, PII, and regulated data protected before any MCP call is made?
- Are audit logs sufficient to reconstruct who invoked which tool and why?
- Is the integration resilient to server outages and partial failures?
