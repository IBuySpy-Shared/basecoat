# Launch Readiness Gate

Use this template to record the formal gate decision before a service enters production. The gate requires explicit sign-off from all designated approvers. No launch may proceed while any Required item is in a Fail state.

## Instructions

1. Complete the review metadata.
2. Record the PRR checklist result and service maturity tier from the companion templates.
3. List any open conditions attached to a conditional approval.
4. Obtain required approver signatures.
5. File this completed record as a dated artifact (e.g., in the service's `docs/` directory or as a GitHub release note).

---

## Gate Metadata

**Service:** _[service name]_
**Version / Commit:** _[version or SHA]_
**Gate Date:** _[YYYY-MM-DD]_
**Launch Target:** _[YYYY-MM-DD HH:MM UTC]_
**Environment:** _[production | staging | canary]_
**PRR Review Reference:** _[link to completed PRR checklist]_

---

## Gate Inputs

| Input | Result | Reference |
|---|---|---|
| PRR Checklist — Required Items | _[Passed / Failed: N items]_ | _[link]_ |
| Service Maturity Tier | _[Tier 1–5]_ | _[link]_ |
| Load Test Report | _[Pass / Fail]_ | _[link]_ |
| Security Scan Report | _[Pass / Fail]_ | _[link]_ |
| Disaster Recovery Validation | _[Pass / Fail]_ | _[link]_ |
| Post-Launch Monitoring Plan | _[Prepared / Not ready]_ | _[link]_ |

---

## Open Conditions

_List any items approved with conditions. Each condition must have an owner and a resolution deadline. Conditions must be resolved within 72 hours of launch unless a longer window is explicitly approved._

| # | Condition | Owner | Resolution Deadline | Status |
|---|---|---|---|---|
| | | | | |

---

## Risk Register

_List any known risks accepted for this launch._

| Risk | Likelihood | Impact | Mitigation | Accepted By |
|---|---|---|---|---|
| | | | | |

---

## Gate Decision

| Decision | When to Apply |
|---|---|
| ✅ **APPROVED** | All Required PRR items passed; maturity tier ≥ 3; no open blocking conditions |
| ⚠️ **APPROVED WITH CONDITIONS** | ≤ 2 non-critical Required items failed; conditions documented and owned; canary launch only until conditions resolved |
| ❌ **REJECTED** | Any Required PRR item failed; maturity tier < 2; critical security or reliability gaps open |

**Decision:** _[APPROVED / APPROVED WITH CONDITIONS / REJECTED]_

**Decision Rationale:** _[Brief explanation of the decision, especially for conditional approvals or rejections.]_

---

## Approver Sign-Off

| Role | Name | Decision | Date |
|---|---|---|---|
| Engineering Lead | | ✅ / ⚠️ / ❌ | |
| SRE / Platform | | ✅ / ⚠️ / ❌ | |
| Security | | ✅ / ⚠️ / ❌ | |
| Product Owner | | ✅ / ⚠️ / ❌ | |

_All required approvers must sign before launch proceeds. For emergency deployments, obtain async approval and document the exception._

---

## Post-Launch Obligations

- [ ] Post-launch watch window active (see `post-launch-monitoring-plan.md`)
- [ ] All open conditions tracked and owned
- [ ] Any launch-day issues filed as GitHub Issues with `production-readiness` label
- [ ] Gate record archived in service documentation
