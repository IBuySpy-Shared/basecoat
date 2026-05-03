# RTO/RPO Worksheet

Use this worksheet to validate that the infrastructure and operational capabilities of each service can actually meet the Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) derived from the Business Impact Analysis.

## Instructions

1. Copy each service from the BIA summary with its BIA-derived RTO and RPO targets.
2. Measure or estimate the actual recovery time and data loss achievable with current infrastructure.
3. Calculate the gap: target minus capability.
4. For any gap > 0, define a remediation action and file a GitHub Issue.

---

## Worksheet Metadata

**Service / Organization:** _[name]_
**Date:** _[YYYY-MM-DD]_
**Author(s):** _[names or roles]_
**BIA Reference:** _[link to BIA document]_

---

## RTO Capability Assessment

For each service, measure the end-to-end recovery time in a test or production environment.

| Service | Tier | BIA RTO Target | Measured Recovery Time | Gap | Recovery Method | Bottleneck | Issue |
|---|---|---|---|---|---|---|---|
| | Tier 1 | | | | | | |
| | Tier 2 | | | | | | |

**How to measure recovery time:**

1. Start the timer when the failure event is detected (not when it started).
2. Stop the timer when the first critical user journey completes a successful smoke test.
3. Include time for DNS propagation, cache warm-up, and health check stabilization.

**Common RTO bottlenecks:**

- Manual steps in the failover runbook
- DNS TTL too long (reduce to ≤ 60 seconds for Tier 1)
- Database restore time from snapshot
- Application startup and cache warm-up
- Dependency readiness (upstream services must also recover)
- Certificate or secret rotation required before traffic resumes

---

## RPO Capability Assessment

For each service, measure the actual data loss achievable under the current backup and replication configuration.

| Service | Tier | BIA RPO Target | Backup Frequency | Replication Lag | Achievable RPO | Gap | Remediation | Issue |
|---|---|---|---|---|---|---|---|---|
| | Tier 1 | | | | | | | |
| | Tier 2 | | | | | | | |

**Replication strategy guide:**

| RPO Target | Required Strategy |
|---|---|
| 0 (zero data loss) | Synchronous multi-region replication; no async lag |
| < 1 minute | Asynchronous replication with sub-minute lag; binlog or WAL streaming |
| < 1 hour | Hourly snapshots + continuous WAL archiving |
| < 4 hours | 4-hourly automated snapshots to secondary region |
| < 24 hours | Daily snapshot + offsite backup |

---

## Gap Summary

| Service | RTO Gap | RPO Gap | Priority | Remediation Action | Owner | Target Date |
|---|---|---|---|---|---|---|
| | | | | | | |

**Gap Priority:**

| Gap | Priority |
|---|---|
| RTO or RPO target missed by > 2× | Critical — block launch |
| RTO or RPO target missed by 1–2× | High — plan fix within sprint |
| RTO or RPO target missed by < 1× | Medium — monitor and plan |

---

## Infrastructure Capability Checklist

Confirm that the following capabilities are in place for each Tier 1 and Tier 2 service:

| Capability | In Place | Tested | Notes |
|---|---|---|---|
| Automated failover to secondary region or AZ | | | |
| DNS failover with TTL ≤ 60 seconds | | | |
| Synchronous or near-synchronous replication for Tier 1 data | | | |
| Automated backup to secondary region | | | |
| Backup restore tested within last 90 days | | | |
| Recovery automation runbook exists and is current | | | |
| Smoke tests available to verify recovery | | | |

---

## References

- BIA: `skills/business-continuity/bia-template.md`
- BCP/DRP Master: `skills/business-continuity/bcp-drp-master.md`
- NIST SP 800-34 Rev. 1 — Section 3.5 Recovery Strategies
