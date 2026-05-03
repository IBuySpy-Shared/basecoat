# OWASP API Security Top 10 Checklist (2023)

Use this checklist to evaluate an API against the OWASP API Security Top 10 (2023). Mark each item as **Pass**, **Fail**, or **N/A** and document evidence.

## Instructions

1. Review each risk category against the target API and its specification.
2. For each check item, record the status and supporting evidence.
3. Any **Fail** item must have a corresponding GitHub Issue filed with severity and remediation guidance.

---

## API1:2023 — Broken Object Level Authorization (BOLA)

| # | Check | Status | Evidence |
|---|---|---|---|
| 1.1 | Each endpoint verifies the authenticated user owns or has permission to access the requested object | ☐ Pass ☐ Fail ☐ N/A | |
| 1.2 | Object IDs are not predictable integers that can be enumerated (or enumeration is guarded) | ☐ Pass ☐ Fail ☐ N/A | |
| 1.3 | Cross-user object access returns 403, not 200 or 404 | ☐ Pass ☐ Fail ☐ N/A | |
| 1.4 | Authorization checks are performed server-side, not derived from client-supplied tokens alone | ☐ Pass ☐ Fail ☐ N/A | |

## API2:2023 — Broken Authentication

| # | Check | Status | Evidence |
|---|---|---|---|
| 2.1 | Tokens have a defined expiry and are rejected after expiration | ☐ Pass ☐ Fail ☐ N/A | |
| 2.2 | Revoked tokens (logout, password change) are rejected by the API | ☐ Pass ☐ Fail ☐ N/A | |
| 2.3 | Brute-force protection (lockout or throttling) is applied to authentication endpoints | ☐ Pass ☐ Fail ☐ N/A | |
| 2.4 | Credentials are not transmitted in URLs or logs | ☐ Pass ☐ Fail ☐ N/A | |
| 2.5 | OAuth redirect URIs are validated against a strict allowlist | ☐ Pass ☐ Fail ☐ N/A | |

## API3:2023 — Broken Object Property Level Authorization

| # | Check | Status | Evidence |
|---|---|---|---|
| 3.1 | Request body binding uses an allowlist of permitted fields (no mass assignment) | ☐ Pass ☐ Fail ☐ N/A | |
| 3.2 | Privileged fields (role, isVerified, creditBalance) cannot be set by regular users | ☐ Pass ☐ Fail ☐ N/A | |
| 3.3 | API responses do not return internal or sensitive fields not needed by the client | ☐ Pass ☐ Fail ☐ N/A | |
| 3.4 | Read-only properties are rejected when supplied in write requests | ☐ Pass ☐ Fail ☐ N/A | |

## API4:2023 — Unrestricted Resource Consumption

| # | Check | Status | Evidence |
|---|---|---|---|
| 4.1 | Rate limiting is applied to all public and authenticated endpoints | ☐ Pass ☐ Fail ☐ N/A | |
| 4.2 | Pagination is enforced with a maximum page size | ☐ Pass ☐ Fail ☐ N/A | |
| 4.3 | Request payload size limits are enforced | ☐ Pass ☐ Fail ☐ N/A | |
| 4.4 | Expensive operations (bulk export, search, reports) have dedicated throttle policies | ☐ Pass ☐ Fail ☐ N/A | |

## API5:2023 — Broken Function Level Authorization

| # | Check | Status | Evidence |
|---|---|---|---|
| 5.1 | Admin and internal endpoints reject requests from non-admin roles (403, not 404) | ☐ Pass ☐ Fail ☐ N/A | |
| 5.2 | HTTP method restrictions are enforced server-side (PUT/DELETE blocked where only GET is allowed) | ☐ Pass ☐ Fail ☐ N/A | |
| 5.3 | Sensitive operations require re-authentication or step-up authentication | ☐ Pass ☐ Fail ☐ N/A | |
| 5.4 | Authorization decisions are not derived from path or parameter names alone | ☐ Pass ☐ Fail ☐ N/A | |

## API6:2023 — Unrestricted Access to Sensitive Business Flows

| # | Check | Status | Evidence |
|---|---|---|---|
| 6.1 | One-time-use resources (coupons, invite links, reset tokens) cannot be redeemed more than once | ☐ Pass ☐ Fail ☐ N/A | |
| 6.2 | Business workflows (checkout, account creation) enforce transactional integrity against replay | ☐ Pass ☐ Fail ☐ N/A | |
| 6.3 | Bulk or automated actions are rate-limited and require human interaction signals where appropriate | ☐ Pass ☐ Fail ☐ N/A | |
| 6.4 | Price and inventory are re-validated server-side at order confirmation, not trusted from the client | ☐ Pass ☐ Fail ☐ N/A | |

## API7:2023 — Server-Side Request Forgery (SSRF)

| # | Check | Status | Evidence |
|---|---|---|---|
| 7.1 | User-supplied URLs are validated against an allowlist of trusted domains | ☐ Pass ☐ Fail ☐ N/A | |
| 7.2 | Requests to internal IP ranges (169.254.x.x, 10.x.x.x, 172.16.x.x, 192.168.x.x) are blocked | ☐ Pass ☐ Fail ☐ N/A | |
| 7.3 | DNS rebinding protections are in place | ☐ Pass ☐ Fail ☐ N/A | |

## API8:2023 — Security Misconfiguration

| # | Check | Status | Evidence |
|---|---|---|---|
| 8.1 | CORS is restricted to known origins — no wildcard `*` in production | ☐ Pass ☐ Fail ☐ N/A | |
| 8.2 | Debug modes and verbose stack traces are disabled in production | ☐ Pass ☐ Fail ☐ N/A | |
| 8.3 | API documentation (Swagger UI, GraphQL playground) is protected or disabled in production | ☐ Pass ☐ Fail ☐ N/A | |
| 8.4 | Security headers are configured (HSTS, X-Content-Type-Options, X-Frame-Options) | ☐ Pass ☐ Fail ☐ N/A | |
| 8.5 | Default credentials and sample keys have been removed | ☐ Pass ☐ Fail ☐ N/A | |

## API9:2023 — Improper Inventory Management

| # | Check | Status | Evidence |
|---|---|---|---|
| 9.1 | An authoritative registry of all API versions and their lifecycle status exists | ☐ Pass ☐ Fail ☐ N/A | |
| 9.2 | Deprecated and retired API versions return 410 Gone or are unreachable | ☐ Pass ☐ Fail ☐ N/A | |
| 9.3 | Internal and staging endpoints are not routable from the public internet | ☐ Pass ☐ Fail ☐ N/A | |
| 9.4 | All active API routes are covered by the current security policy | ☐ Pass ☐ Fail ☐ N/A | |

## API10:2023 — Unsafe Consumption of Third-Party APIs

| # | Check | Status | Evidence |
|---|---|---|---|
| 10.1 | Responses from upstream APIs are validated against a strict schema before use | ☐ Pass ☐ Fail ☐ N/A | |
| 10.2 | Privileged fields received from third-party APIs are not passed directly to internal data models | ☐ Pass ☐ Fail ☐ N/A | |
| 10.3 | TLS certificate validation is enforced for all outbound API calls (no `verify=False`) | ☐ Pass ☐ Fail ☐ N/A | |
| 10.4 | Third-party API credentials are scoped to minimum required permissions | ☐ Pass ☐ Fail ☐ N/A | |
| 10.5 | Failures from upstream APIs are handled gracefully and do not expose internal errors | ☐ Pass ☐ Fail ☐ N/A | |

---

## Summary

| Risk | Status | Issues Filed |
|---|---|---|
| API1 — Broken Object Level Authorization | | |
| API2 — Broken Authentication | | |
| API3 — Broken Object Property Level Authorization | | |
| API4 — Unrestricted Resource Consumption | | |
| API5 — Broken Function Level Authorization | | |
| API6 — Unrestricted Access to Sensitive Business Flows | | |
| API7 — Server-Side Request Forgery | | |
| API8 — Security Misconfiguration | | |
| API9 — Improper Inventory Management | | |
| API10 — Unsafe Consumption of Third-Party APIs | | |

**Total Findings:** &nbsp; | **Issues Filed:** &nbsp;
