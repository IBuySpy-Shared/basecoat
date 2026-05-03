# Blameless Post-Mortem Template

## Incident Summary

- **Incident ID:**
- **Severity:** < Sev 1 | Sev 2 >
- **Date and time (start):**
- **Date and time (end):**
- **Total duration:**
- **Customer-visible impact:** < Yes | No | Partial >
- **Services affected:**
- **Post-mortem owner:**
- **Review date:**

---

## Impact Summary

_Describe what customers experienced. Quantify where possible (requests failed, error rate, latency degradation, customers affected)._

---

## Timeline

All times in UTC. List events in chronological order.

| Time | Event |
|---|---|
| HH:MM | Alert fired |
| HH:MM | On-call engineer paged |
| HH:MM | Incident declared; incident commander assigned |
| HH:MM | < key diagnostic step > |
| HH:MM | < mitigation applied > |
| HH:MM | Service restored to normal |
| HH:MM | Incident closed |

---

## Root Cause

_State the direct technical cause. Identify the systemic contributing factors (process, tooling, or knowledge gaps) — not individual people. Use the 5-Whys technique if helpful._

**Direct cause:**

**Contributing factors:**

1.
2.
3.

---

## Detection

- How was the incident first detected? < Alert | Customer report | Internal monitoring >
- Was the detection timely? If not, why?
- What improvement would make detection faster or more reliable?

---

## Mitigation

- What action restored service?
- Was a runbook followed? If yes, was it accurate and complete?
- Was there any delay in mitigation? If yes, what caused it?

---

## Error Budget Impact

- Error budget consumed by this incident: minutes
- Budget remaining after incident: %
- Is a budget policy enforcement action required? (see `error-budget-policy.md`)

---

## Action Items

Each action item must have an owner and a due date. No action items are deferred without a documented reason.

| # | Action | Owner | Priority | Due Date | GitHub Issue |
|---|---|---|---|---|---|
| 1 | | | High | | # |
| 2 | | | Medium | | # |

---

## What Went Well

_Identify practices, tools, or behaviors that limited impact or sped up recovery. These should be reinforced._

-
-

---

## What to Improve

_Identify gaps in detection, response, communication, or tooling. These feed directly into action items._

-
-

---

## Review Sign-Off

| Role | Name | Date |
|---|---|---|
| Post-mortem owner | | |
| Engineering lead | | |
| SRE on-call | | |
