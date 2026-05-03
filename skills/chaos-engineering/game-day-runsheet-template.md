# Game Day Runsheet Template

## Game Day Overview

- **Name:**
- **Date:**
- **Duration:** hours
- **Facilitator:**
- **Communication channel:** < Slack channel | Teams channel >
- **Status page:** < link or N/A >

---

## Objectives

_State 2–4 specific resilience questions this game day is designed to answer._

1. Does the automatic failover for < dependency > complete within the RTO target?
2. Can the on-call team follow the runbook without external assistance?
3. Do alerts fire accurately and within < N > minutes of fault injection?
4.

---

## Participant Roster

| Role | Name | Contact | Responsibility |
|---|---|---|---|
| Facilitator | | | Runs the game day; coordinates transitions |
| Incident Commander | | | Leads response during each scenario |
| Observer | | | Captures timeline, timestamps, and unexpected behaviors |
| Database Owner | | | DB failover actions |
| Platform On-Call | | | Infrastructure actions |
| Customer Support | | | Monitor for customer-visible impact |

---

## Pre-Game Day Checklist

- [ ] Scenarios reviewed and approved by engineering lead
- [ ] All participants briefed on objectives, abort conditions, and their roles
- [ ] Rollback mechanisms verified and pre-staged (access confirmed)
- [ ] Monitoring dashboards, alerts, and log views open and confirmed working
- [ ] Communication channel open; status page ready
- [ ] Error budget checked — game day is not run if budget < 25%
- [ ] Maintenance window communicated to support and stakeholders

---

## Scenario Runsheet

### Scenario 1: < Name >

**Start time:** HH:MM
**Duration:** min
**Fault injected:** < type and target >
**Hypothesis:** < expected system behavior >
**Abort condition:** < threshold >
**Rollback command:** `< command >`

| Time | Action / Observation | Actor |
|---|---|---|
| HH:MM | Verify steady state | Observer |
| HH:MM | Inject fault | Facilitator |
| HH:MM | Observe system response | Observer |
| HH:MM | Validate safeguards activated | Observer |
| HH:MM | Remove fault | Facilitator |
| HH:MM | Confirm recovery to steady state | Observer |

**Outcome:** < hypothesis confirmed | partially confirmed | refuted >
**Resilience score:** / 25

---

### Scenario 2: < Name >

_(copy Scenario 1 block for each additional scenario)_

---

## Post-Game Day Debrief

Run the debrief within 2 hours of the game day ending.

### What Went Well

-
-

### What to Improve

-
-

### Action Items

| # | Action | Owner | Priority | Due Date | GitHub Issue |
|---|---|---|---|---|---|
| 1 | | | | | # |

---

## Runbook Updates

List any runbooks that need to be updated based on findings:

| Runbook | Update Required | Owner |
|---|---|---|
| | | |

---

## Sign-Off

| Role | Name | Date |
|---|---|---|
| Facilitator | | |
| Engineering lead | | |
| SRE on-call | | |
