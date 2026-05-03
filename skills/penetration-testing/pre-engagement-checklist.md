# Pre-Engagement Checklist

Use this checklist before any penetration test begins. Every item must be confirmed in writing. Do not proceed to reconnaissance or active testing until all mandatory items are checked.

---

## Scope Definition

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | In-scope systems identified (URLs, IP ranges, API specs, repos) | ☐ | |
| 2 | Out-of-scope systems explicitly listed | ☐ | |
| 3 | Testing type confirmed: black-box / grey-box / white-box | ☐ | |
| 4 | Shared infrastructure excluded or separately authorized | ☐ | |
| 5 | Third-party / cloud provider acceptable-use policies reviewed | ☐ | |

---

## Authorization

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6 | Written authorization obtained from system owner | ☐ | |
| 7 | Legal agreement or NDA signed | ☐ | |
| 8 | Emergency contact list provided (security, ops, legal) | ☐ | |
| 9 | Incident response escalation path agreed | ☐ | |
| 10 | Rules of engagement document signed | ☐ | |

---

## Testing Window

| # | Item | Status | Notes |
|---|------|--------|-------|
| 11 | Start and end dates confirmed | ☐ | |
| 12 | Blackout periods identified (releases, maintenance windows) | ☐ | |
| 13 | Time-zone for communication agreed | ☐ | |
| 14 | Monitoring / alerting teams notified | ☐ | |

---

## Data Handling

| # | Item | Status | Notes |
|---|------|--------|-------|
| 15 | Data classification of target systems documented | ☐ | |
| 16 | PII / regulated data handling rules defined | ☐ | |
| 17 | Evidence storage policy agreed (encryption, retention, deletion) | ☐ | |
| 18 | Disclosure / reporting timeline confirmed | ☐ | |

---

## Technical Prerequisites

| # | Item | Status | Notes |
|---|------|--------|-------|
| 19 | Test accounts / credentials provisioned (grey/white-box) | ☐ | |
| 20 | Network access (VPN, firewall rules) confirmed | ☐ | |
| 21 | Source code / architecture diagrams received (white-box) | ☐ | |
| 22 | API documentation / Swagger / OpenAPI spec received | ☐ | |
| 23 | WAF / IPS in monitor-only mode or tester IP allow-listed | ☐ | |

---

## Success Criteria

| # | Item | Status | Notes |
|---|------|--------|-------|
| 24 | Vulnerability severity thresholds defined (what constitutes pass/fail) | ☐ | |
| 25 | Reporting format and delivery method agreed | ☐ | |
| 26 | Re-test policy agreed (how fixes will be validated) | ☐ | |
| 27 | Remediation SLA expectations documented | ☐ | |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| System Owner | | | |
| Security Lead | | | |
| Penetration Tester | | | |

---

## References

- [OWASP Testing Guide v4.2 — Pre-engagement](https://owasp.org/www-project-web-security-testing-guide/v42/3-The_OWASP_Testing_Framework/0-The_Web_Security_Testing_Framework)
- [PTES Pre-engagement Interactions](http://www.pentest-standard.org/index.php/Pre-engagement)
- [NIST SP 800-115 §3.1 — Planning](https://csrc.nist.gov/publications/detail/sp/800-115/final)
