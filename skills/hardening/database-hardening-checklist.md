# Database Hardening Checklist

**Reviewer:**
**Date:**
**Database technology:** < PostgreSQL | MySQL | MSSQL | Oracle | MongoDB | other >
**Version:**
**Environment:**

## Scoring Key

- ✅ Pass — control is satisfied
- ❌ Fail (Critical) — blocking finding; fix before deployment
- ⚠️ Fail (High) — fix before next release
- 📋 Fail (Medium) — fix within sprint
- N/A — not applicable

---

## Authentication and Authorization

| ID | Control | Status | Notes |
|---|---|---|---|
| AUTH-1 | Default database credentials are changed or disabled | | |
| AUTH-2 | Remote root / sa / admin login is disabled | | |
| AUTH-3 | Application accounts cannot perform DDL (no CREATE, DROP, ALTER) | | |
| AUTH-4 | Application accounts have only the minimum required privileges | | |
| AUTH-5 | Each application or microservice uses a dedicated database account | | |
| AUTH-6 | Database accounts use strong passwords or certificate-based authentication | | |
| AUTH-7 | Password expiry and rotation policy is enforced | | |
| AUTH-8 | Connections from untrusted hosts are blocked by network policy or firewall | | |

## Encryption

| ID | Control | Status | Notes |
|---|---|---|---|
| ENC-1 | Encryption at rest is enabled (TDE or file-system encryption) | | |
| ENC-2 | Encryption keys are managed in a dedicated key management service, not on the DB host | | |
| ENC-3 | Encryption in transit is enforced: TLS 1.2+ required; plaintext connections rejected | | |
| ENC-4 | Backup files are encrypted at rest | | |
| ENC-5 | Connection strings in application configs use TLS; SSL mode is `verify-full` or equivalent | | |

## Auditing and Logging

| ID | Control | Status | Notes |
|---|---|---|---|
| AUD-1 | Audit logging is enabled | | |
| AUD-2 | Login attempts (success and failure) are logged | | |
| AUD-3 | Privilege changes and GRANT / REVOKE statements are logged | | |
| AUD-4 | DDL operations (CREATE, DROP, ALTER) are logged | | |
| AUD-5 | Audit logs are stored in an append-only location, not on the database host | | |
| AUD-6 | Audit logs are retained for at least 90 days (or as required by compliance) | | |
| AUD-7 | Alerts are configured for authentication failures and privilege escalations | | |

## Network Exposure

| ID | Control | Status | Notes |
|---|---|---|---|
| NET-1 | Database port is not exposed to the public internet | | |
| NET-2 | Database is in a private subnet / VNet with no public IP | | |
| NET-3 | Firewall rules restrict access to application servers only | | |
| NET-4 | Replication traffic uses a dedicated internal network segment | | |

## Patching and Configuration

| ID | Control | Status | Notes |
|---|---|---|---|
| PATCH-1 | Database engine is on a supported version with security patches applied | | |
| PATCH-2 | Unnecessary database extensions and features are disabled | | |
| PATCH-3 | `xp_cmdshell` (MSSQL) or equivalent shell-execution feature is disabled | | |
| PATCH-4 | Database configuration deviations from vendor-recommended baseline are documented | | |

## Backup and Recovery

| ID | Control | Status | Notes |
|---|---|---|---|
| BCK-1 | Automated backups are configured | | |
| BCK-2 | Backup retention meets RPO and compliance requirements | | |
| BCK-3 | Backups are stored in a different region or account from primary | | |
| BCK-4 | Restore procedure has been tested within the last 90 days | | |
| BCK-5 | Point-in-time recovery (PITR) is enabled for Tier 2+ services | | |

## Summary

| Category | Pass | Fail | N/A | Score |
|---|---|---|---|---|
| Authentication | | | | % |
| Encryption | | | | % |
| Auditing | | | | % |
| Network | | | | % |
| Patching | | | | % |
| Backup | | | | % |
| Overall | | | | % |

## Critical Findings Requiring Immediate Action

| ID | Control | Recommended Fix |
|---|---|---|
| | | |
