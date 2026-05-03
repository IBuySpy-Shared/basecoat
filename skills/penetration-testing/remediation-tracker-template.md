# Remediation Tracker Template

Use this template to track the status of every finding from the penetration test report through to remediation and sign-off. Update the status column as each finding progresses.

---

## Tracker Metadata

| Field | Value |
|-------|-------|
| **Engagement** | _[name]_ |
| **Report Reference** | _[report file or URL]_ |
| **Tracker Owner** | _[security lead]_ |
| **Last Updated** | _[YYYY-MM-DD]_ |

---

## Finding Status Overview

| Severity | Total | Open | In Progress | Remediated | Risk Accepted |
|----------|-------|------|-------------|------------|---------------|
| Critical | | | | | |
| High | | | | | |
| Medium | | | | | |
| Low | | | | | |
| **Total** | | | | | |

---

## Detailed Tracker

| Finding ID | Title | Severity | CVSS | GitHub Issue | Owner | Target Date | Status | Verified By | Verified Date | Notes |
|------------|-------|----------|------|-------------|-------|-------------|--------|-------------|---------------|-------|
| PEN-YYYY-001 | | | | | | | Open | | | |
| PEN-YYYY-002 | | | | | | | Open | | | |

**Status values:** `Open` · `In Progress` · `Blocked` · `Remediated` · `Risk Accepted` · `Closed`

---

## Finding Detail Sheets

Use one sheet per finding to capture full remediation context.

---

### PEN-YYYY-001 — [Title]

| Field | Value |
|-------|-------|
| **Severity** | _Critical / High / Medium / Low_ |
| **CVSS v3.1** | _[score] ([vector string])_ |
| **GitHub Issue** | _[#number]_ |
| **Assigned To** | _[developer or team]_ |
| **Due Date** | _[YYYY-MM-DD]_ |

**Remediation Guidance:**
_Copied from the penetration test report. Include code example or config change._

**Fix Implementation Notes:**
_[Developer notes on the change made — commit SHA, PR link, deployment date]_

**Residual Risk Assessment:**

| Factor | Assessment |
|--------|-----------|
| Can the vulnerability be exploited at scale? | _Yes / No / Unknown_ |
| Is there external visibility (public tools, researcher interest)? | _Yes / No / Unknown_ |
| Are compensating controls in place (WAF, monitoring)? | _Yes / No_ |
| Is risk acceptance required? | _Yes / No_ |

**Risk Acceptance (if applicable):**

| Field | Value |
|-------|-------|
| Accepted by | _[name, role]_ |
| Acceptance date | _[YYYY-MM-DD]_ |
| Review date | _[YYYY-MM-DD]_ |
| Rationale | _[business justification]_ |

**Re-test Result:**
_Completed? Yes / No. Reference: `re-test-verification-checklist.md` item [N]._

---

_Copy the Finding Detail Sheet for each finding tracked._

---

## 30 / 60 / 90-Day Milestones

### 30-Day (Critical and High)

| Finding ID | Title | Owner | Status |
|------------|-------|-------|--------|
| | | | |

### 60-Day (High and Medium)

| Finding ID | Title | Owner | Status |
|------------|-------|-------|--------|
| | | | |

### 90-Day (Medium and Low)

| Finding ID | Title | Owner | Status |
|------------|-------|-------|--------|
| | | | |

---

## Closure Sign-Off

All critical and high findings must be verified as remediated or formally risk-accepted before engagement closure.

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Security Lead | | | |
| System Owner | | | |
| Penetration Tester | | | |

---

## References

- [CVSS v3.1 Calculator](https://www.first.org/cvss/calculator/3.1)
- [OWASP Risk Rating Methodology](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology)
- [NIST SP 800-115 §4 — Execution](https://csrc.nist.gov/publications/detail/sp/800-115/final)
