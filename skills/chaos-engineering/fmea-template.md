# Failure Mode and Effects Analysis (FMEA) Template

## System / Service

- **Service:**
- **Scope:** < full service | specific component | dependency chain >
- **Reviewed by:**
- **Date:**

---

## FMEA Scoring Guide

Score each failure mode on three dimensions (1–5):

- **Severity (S):** Impact on customers or critical functionality if the failure occurs
  - 5 = Complete outage, data loss, or financial impact
  - 3 = Degraded functionality, some users affected
  - 1 = Minor degradation, no customer impact
- **Occurrence (O):** Likelihood the failure mode occurs in a given month
  - 5 = Likely (occurred in the last 90 days)
  - 3 = Possible (occurred in the last year)
  - 1 = Unlikely (never observed or theoretical)
- **Detectability (D):** Ease of detecting the failure before it impacts customers
  - 5 = No alert or detection mechanism exists
  - 3 = Alert exists but is noisy or delayed
  - 1 = Alert fires accurately within 2 minutes

**Risk Priority Number (RPN) = S × O × D**

Prioritization:

- **RPN ≥ 50** — High priority: design chaos experiment immediately
- **RPN 25–49** — Medium priority: schedule experiment within quarter
- **RPN < 25** — Low priority: monitor and revisit at next FMEA review

---

## Failure Mode Inventory

| ID | Component | Failure Mode | Effect on Service | S | O | D | RPN | Existing Controls | Priority | Experiment Needed? |
|---|---|---|---|---|---|---|---|---|---|---|
| FM-01 | < component > | < e.g., database primary fails > | < e.g., all writes fail > | | | | | < circuit breaker, replica > | High / Med / Low | Yes / No |
| FM-02 | | | | | | | | | | |
| FM-03 | | | | | | | | | | |
| FM-04 | | | | | | | | | | |
| FM-05 | | | | | | | | | | |

---

## High-Priority Failure Modes (RPN ≥ 50)

List failure modes that require a chaos experiment and link to their experiment plans:

| ID | Failure Mode | RPN | Experiment Plan | Owner | Target Date |
|---|---|---|---|---|---|
| FM-01 | | | `experiment-plan-template.md` | | |

---

## Control Gaps

List failure modes where no detection or mitigation control exists:

| ID | Failure Mode | Missing Control | Recommended Action | GitHub Issue |
|---|---|---|---|---|
| | | | | # |

---

## Review and Update Cadence

- Reviewed quarterly or after any Sev 1 or Sev 2 incident.
- New failure modes added whenever a new dependency or component is introduced.
