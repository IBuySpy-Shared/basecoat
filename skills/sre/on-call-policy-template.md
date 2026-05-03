# On-Call Policy Template

## Service

- **Service name:**
- **Policy owner:**
- **Effective date:**
- **Review cadence:** Quarterly

---

## Scope

This policy applies to all engineers on the on-call rotation for this service. It defines coverage expectations, escalation paths, response SLAs, and well-being protections.

---

## Rotation

| Parameter | Value |
|---|---|
| Rotation length | 1 week |
| Minimum rotation size | 4 engineers (to limit shift frequency to ≤ 13 weeks/year per person) |
| Current rotation size | N engineers |
| Shift handoff time | Monday 09:00 local time |
| Shadow rotation | Yes / No (shadow follows primary for first 2 shifts) |

---

## Coverage Hours

| Day | Hours | Coverage Type |
|---|---|---|
| Monday–Friday | Business hours | Active monitoring and response |
| Monday–Friday | After hours | Paged-only; acknowledge within 15 minutes |
| Saturday–Sunday | All day | Paged-only; acknowledge within 30 minutes |

---

## Response SLAs

| Severity | Response Time | Initial Acknowledgement | Escalation if No Response |
|---|---|---|---|
| Sev 1 — Customer impacting | 5 minutes | Page repeats every 5 minutes | Escalate to secondary after 10 minutes |
| Sev 2 — Degraded service | 15 minutes | Page once, follow-up in 15 minutes | Escalate after 30 minutes |
| Sev 3 — Minor degradation | Next business day | Ticket acknowledged | — |

---

## Escalation Path

1. **Primary on-call** — first responder; acknowledge and triage
2. **Secondary on-call** — backup if primary is unavailable or incident escalates
3. **Engineering lead** — escalate for Sev 1 incidents lasting > 30 minutes
4. **Engineering manager** — escalate for Sev 1 incidents lasting > 1 hour or for customer communication

---

## Well-Being Protections

These protections are mandatory and cannot be waived without engineering manager approval:

- **Maximum paged shifts:** No engineer is on primary on-call more than once per 4-week period without written consent.
- **Interruption limit:** If an engineer is paged more than 3 times in a single night (outside business hours), they are automatically removed from the next business day's on-call schedule.
- **Recovery time:** After a Sev 1 incident requiring more than 2 hours of response outside business hours, the engineer receives the following morning off.
- **Minimum rotation size:** The rotation must maintain at least 4 engineers. If it falls below 4, the engineering manager must recruit additional members before the next shift cycle.

---

## Onboarding Checklist

New on-call engineers must complete before first primary shift:

- [ ] Shadow rotation completed (at least 2 weeks)
- [ ] Service runbooks reviewed
- [ ] Monitoring dashboards and alert channels configured
- [ ] Escalation contacts saved in phone
- [ ] Incident response workflow walkthrough completed with a senior engineer

---

## Policy Review

Reviewed quarterly by the SRE lead and engineering manager. Changes require all rotation members to be notified at least 2 weeks before taking effect.
