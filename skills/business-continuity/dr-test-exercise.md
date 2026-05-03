# DR Test Exercise Template

Use this template to plan, execute, and document a Disaster Recovery test exercise. The exercise type determines the scope and level of disruption.

## Instructions

1. Select the exercise type based on service tier and last test date.
2. Complete the planning section at least two weeks before the exercise.
3. Capture observations and results during execution.
4. Complete the post-exercise review within five business days.
5. File GitHub Issues for all findings and update the DR runbook.

---

## Exercise Metadata

**Exercise Title:** _[e.g., "Q3 Tier 1 Regional Failover Test — payments-api"]_
**Service(s) in Scope:** _[list services]_
**Exercise Type:** _[Tabletop / Functional / Parallel / Full-Interruption]_
**Scheduled Date:** _[YYYY-MM-DD]_
**Scheduled Duration:** _[e.g., 4 hours]_
**Exercise Lead:** _[name and role]_
**Participants:** _[names and roles]_
**BCP/DRP Document Reference:** _[link]_

---

## Exercise Types

| Type | What Happens | Who Participates | Risk |
|---|---|---|---|
| Tabletop | Stakeholders walk through the plan verbally; no systems touched | Leadership, SRE, application owners | Very low |
| Functional | Selected recovery steps executed in non-production environment | SRE, infrastructure, application engineers | Low |
| Parallel | Recovery environment brought up alongside production; both run simultaneously | Full DR team | Medium |
| Full-Interruption | Production traffic cut over to recovery environment; production suspended | Full DR team + communications lead | High |

---

## Pre-Exercise Planning

### Objectives

List the specific capabilities being tested:

1. _[e.g., Validate that payments-api can fail over to us-west-2 within RTO target of 15 minutes]_
2. _[e.g., Confirm that no customer transaction data is lost during failover (RPO = 0)]_
3. _[e.g., Verify that smoke tests detect a successful recovery automatically]_

### Success Criteria

| Criterion | Measurement Method | Pass Threshold |
|---|---|---|
| RTO met | Time from failure declaration to smoke test pass | ≤ _[X]_ minutes |
| RPO met | Data integrity check after recovery | 0 records lost |
| Runbook completeness | All steps executable without ad-hoc decisions | No undocumented steps |
| Communication | First status update sent within target window | ≤ 30 minutes |

### Abort Criteria

Stop the exercise immediately if any of the following occur:

- [ ] Production customer impact detected (for functional or parallel tests)
- [ ] Data loss or corruption in the production data store
- [ ] Security event triggered by exercise activity
- [ ] Exercise lead decides the risk of continuing exceeds the value

**Rollback procedure reference:** _[link to rollback runbook]_

### Pre-Exercise Checklist

- [ ] BCP/DRP master document reviewed and current
- [ ] DR runbook reviewed by exercise lead
- [ ] Participant roles and responsibilities briefed
- [ ] Change management approval obtained (if production scope)
- [ ] Monitoring dashboards open and baseline captured
- [ ] Customer communications pre-drafted (if production scope)
- [ ] Rollback procedure reviewed and rehearsed

---

## Exercise Execution Log

Record all events with timestamps during the exercise.

| Time (UTC) | Action | Executor | Result | Notes |
|---|---|---|---|---|
| | Exercise start declared | | | |
| | Failure scenario injected | | | |
| | Recovery procedure initiated | | | |
| | First smoke test executed | | | |
| | RTO checkpoint | | Pass / Fail | Elapsed: |
| | RPO validation completed | | Pass / Fail | Data checked: |
| | Recovery environment stable | | | |
| | Failback initiated (if applicable) | | | |
| | Production restored | | | |
| | Exercise concluded | | | |

---

## Results

| Criterion | Target | Actual | Result |
|---|---|---|---|
| RTO | | | ✅ Pass / ❌ Fail |
| RPO | | | ✅ Pass / ❌ Fail |
| Runbook completeness | No gaps | | ✅ Pass / ❌ Fail |
| Communication | First update ≤ 30 min | | ✅ Pass / ❌ Fail |

**Overall Exercise Result:** _[Pass / Conditional Pass / Fail]_

---

## Observations and Findings

| # | Observation | Category | Severity | Recommended Action | Filed Issue |
|---|---|---|---|---|---|
| 1 | | Runbook / Tooling / Communication / Process | Critical / High / Medium / Low | | |

---

## Post-Exercise Actions

- [ ] Update DR runbook for all runbook gaps discovered
- [ ] File GitHub Issues for all findings
- [ ] Update BCP/DRP master document with exercise results and date
- [ ] Schedule follow-up exercise if exercise result was Fail or Conditional Pass
- [ ] Share exercise report with security and compliance (if required)

---

## References

- BCP/DRP Master: `skills/business-continuity/bcp-drp-master.md`
- DR Runbook: `skills/business-continuity/dr-runbook.md`
- NIST SP 800-34 Rev. 1 — Section 3.6 Plan Testing, Training, and Exercises
- ISO 22301:2019 — Clause 8.5 Business Continuity Plan Exercises
