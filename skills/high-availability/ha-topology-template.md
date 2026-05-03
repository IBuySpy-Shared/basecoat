# HA Topology Design Template

## Service Details

- **Service name:**
- **Criticality:** < Tier 0 | Tier 1 | Tier 2 | Tier 3 >
- **Reviewed by:**
- **Date:**

## Availability Requirements

| Metric | Target | Current |
|---|---|---|
| Availability SLA | % | % |
| RTO (Recovery Time Objective) | s / min | — |
| RPO (Recovery Point Objective) | s / min | — |
| MTTR (Mean Time to Recover) | — | — |

## Topology Selection

**Pattern chosen:** < Active-Active | Active-Passive | Single-Region Multi-AZ | Single-AZ >

**Justification:**

_State the primary reason for choosing this pattern (e.g., consistency requirement, cost, RTO constraint)._

## HA Tier Classification

| Component | Current Tier | Target Tier | Gap | Owner |
|---|---|---|---|---|
| < component name > | Tier 0 | Tier 2 | < describe gap > | < team > |

## Replication Strategy

| Data Store | Replication Type | RPO Impact | Conflict Resolution | Notes |
|---|---|---|---|---|
| < DB name > | < Sync / Async CDC / Event-Sourced > | < seconds > | < LWW / CRDT / App-merge > | |

## Quorum and Consensus

| Distributed Component | Replica Count | Quorum Size | Consensus Algorithm | Fencing Mechanism |
|---|---|---|---|---|
| < etcd / ZK / Redis Sentinel > | N | floor(N/2)+1 | < Raft / ZAB / Sentinel > | < STONITH / lease > |

## Failure Mode Analysis

| Failure Scenario | Impacted Components | Expected Behavior | RTO Met? |
|---|---|---|---|
| AZ failure | | | Yes / No |
| Primary database failure | | | Yes / No |
| Cache cluster failure | | | Yes / No |
| Network partition between regions | | | Yes / No |

## Health Check and Failover Automation

- **Health check endpoint:** `/health`
- **Health check interval:** s
- **Failure threshold (consecutive failures before failover):**
- **Failover mechanism:** < DNS TTL / Route53 / Azure Traffic Manager / k8s probe >
- **Failover automation:** < Fully automated | Operator-initiated | Manual >
- **DNS TTL:** s (must be ≤ RTO)

## Open Risks and Gaps

| Risk | Severity | Owner | Mitigation | Target Date |
|---|---|---|---|---|
| | | | | |

## Next Steps

- [ ] File GitHub issues for all Critical and High gaps
- [ ] Schedule failover drill date: ___
- [ ] Validate HA runbook with `failover-runbook-template.md`
- [ ] Update IaC templates to encode agreed topology
