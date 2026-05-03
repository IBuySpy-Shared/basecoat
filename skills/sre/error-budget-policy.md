# Error Budget Policy

## Service

- **Service name:**
- **SLO target:**
- **Error budget (monthly):** minutes
- **Policy owner:**
- **Effective date:**

---

## Purpose

This policy defines mandatory actions at each error budget consumption tier. Its goal is to protect service reliability by constraining risky activity when the error budget is under pressure and enabling investment in reliability when the budget is healthy.

---

## Budget Consumption Tiers and Enforcement Actions

### Tier 1 — Budget Healthy (> 50% remaining)

**Actions:**

- Feature deployments proceed on normal release cadence.
- Chaos experiments are permitted.
- Dependency upgrades and infrastructure changes proceed normally.

### Tier 2 — Budget Under Pressure (25–50% remaining)

**Actions:**

- All deployments require an additional reviewer sign-off acknowledging budget status.
- Chaos experiments are paused.
- High-risk infrastructure changes require explicit SRE approval.
- Weekly SLO review is escalated to engineering lead.

### Tier 3 — Budget Low (10–25% remaining)

**Actions:**

- Only bug fixes, security patches, and incident mitigations are deployed.
- New feature work is halted.
- All deployments require SRE sign-off.
- An error budget burn-down plan must be filed as a GitHub issue within 48 hours.

### Tier 4 — Budget Critical or Exhausted (< 10% remaining or 0%)

**Actions:**

- Deployment freeze: no changes except emergency security patches and Sev 1 mitigations.
- On-call engineer is notified immediately.
- Engineering manager is escalated within 24 hours.
- Reliability work (bug fixes, toil reduction, SLO investigations) becomes the team's primary focus until the budget recovers to Tier 3.
- Post-mortem is required if budget is exhausted mid-window.

---

## Budget Recovery

The error budget resets at the start of each 30-day rolling window. Recovery within a window occurs naturally as incident-free time accumulates.

If the budget is exhausted mid-window, the team must document:

1. Root cause of budget exhaustion
2. Reliability investments planned to prevent recurrence
3. Expected recovery date

---

## Policy Review

This policy is reviewed and updated at each quarterly SLO review. Changes require SRE and engineering lead sign-off.
