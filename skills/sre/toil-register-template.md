# Toil Register Template

## Team

- **Team:**
- **Quarter:**
- **Owner:**

---

## What Is Toil

Toil is work that is:

- **Manual** — requires a human to perform the steps
- **Repetitive** — performed regularly without meaningful variation
- **Automatable** — could be replaced by a script, tool, or self-healing system
- **Devoid of lasting value** — does not permanently improve the system

Work that improves the system (incident post-mortems, architecture decisions, automation development) is NOT toil even if it is triggered by an operational event.

---

## Toil Inventory

| ID | Task | Trigger | Frequency | Duration per Occurrence | Annual Hours | Automatable? | Priority | Owner |
|---|---|---|---|---|---|---|---|---|
| T-01 | | | weekly / monthly | min | h/yr | Yes / No | High / Med / Low | |
| T-02 | | | | | | | | |

**Priority scoring:**

- **High** — > 4 hours/week per engineer OR blocks customer-impacting work
- **Medium** — 1–4 hours/week
- **Low** — < 1 hour/week

---

## Toil Budget

| Metric | Value |
|---|---|
| Team size (engineers) | |
| Total engineering hours/week | |
| Target toil budget (≤ 50%) | h/week |
| Current measured toil | h/week |
| Current toil % | % |
| Budget status | < Within budget | Over budget > |

---

## Automation Backlog

| ID | Toil Task | Automation Approach | Estimated Effort | Sprint Target | GitHub Issue |
|---|---|---|---|---|---|
| T-01 | | | pts | Sn | # |

---

## Quarterly Review

- [ ] All toil items inventoried and scored
- [ ] Toil % measured and compared to prior quarter
- [ ] High-priority automation items filed as GitHub issues
- [ ] Toil budget status reported to engineering lead
- [ ] Items removed from register when automation is deployed and verified

---

## Escalation

If toil exceeds 50% of team time for two consecutive quarters, escalate to engineering manager with a written toil reduction plan.
