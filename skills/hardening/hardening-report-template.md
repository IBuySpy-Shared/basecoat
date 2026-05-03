# Hardening Report Template

## Report Header

- **Service / System:**
- **Scope:** < Container | Kubernetes | Database | Linux | Supply-Chain | All >
- **Benchmark(s):** < CIS Docker v1.6 | CIS Kubernetes v1.9 | DISA STIG | NIST SP 800-190 >
- **Reviewer:**
- **Date:**
- **Overall score:** % (pass/total scored controls)

---

## Executive Summary

_2–4 sentences summarizing the hardening posture, the most critical risks, and the recommended immediate actions._

---

## Scored Summary

| Target | Controls Scored | Pass | Fail (Critical) | Fail (High) | Fail (Medium) | Score |
|---|---|---|---|---|---|---|
| Container images | | | | | | % |
| Kubernetes | | | | | | % |
| Database | | | | | | % |
| Linux hosts | | | | | | % |
| Supply chain | | | | | | % |
| **Overall** | | | | | | **%** |

---

## Critical Findings (Blocking)

_These findings must be resolved before the service can be deployed to production._

| # | Benchmark | Control ID | Description | Recommended Fix | GitHub Issue | Owner | Target Date |
|---|---|---|---|---|---|---|---|
| 1 | | | | | # | | |

---

## High Findings

_Fix before the next release._

| # | Benchmark | Control ID | Description | Recommended Fix | GitHub Issue | Owner | Target Date |
|---|---|---|---|---|---|---|---|
| 1 | | | | | # | | |

---

## Medium Findings

_Fix within this sprint._

| # | Benchmark | Control ID | Description | Recommended Fix | GitHub Issue | Owner | Target Date |
|---|---|---|---|---|---|---|---|
| 1 | | | | | # | | |

---

## Remediation Roadmap

| Sprint | Actions | Owner |
|---|---|---|
| Current sprint | Resolve all Critical findings | |
| Next sprint | Resolve all High findings | |
| Within quarter | Resolve all Medium findings; re-run full checklist | |

---

## Verification

- [ ] All Critical findings have filed GitHub issues with acceptance criteria
- [ ] Re-scan scheduled after Critical remediations
- [ ] Hardening score target: ≥ 90% Level 1 controls passing before production sign-off
