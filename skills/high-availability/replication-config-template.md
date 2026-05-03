# Replication Configuration Template

## Target System

- **Database / store:**
- **Technology:** < PostgreSQL | MySQL | MongoDB | Redis | Kafka | other >
- **Environment:** < production | staging >
- **Reviewed by:**
- **Date:**

## Topology

| Role | Host / Endpoint | AZ / Region | Read/Write | Notes |
|---|---|---|---|---|
| Primary | | | Read + Write | |
| Replica 1 | | | Read-only | |
| Replica 2 | | | Read-only | |

## Replication Configuration

| Parameter | Value | Rationale |
|---|---|---|
| Replication mode | < synchronous / asynchronous / semi-sync > | |
| Replication factor | N | Must satisfy quorum: floor(N/2)+1 |
| Max replication lag (alert threshold) | s | Must be ≤ RPO target |
| Max replication lag (failover threshold) | s | Trigger failover if exceeded |
| WAL / binlog retention | days | Must cover backup-to-restore window |
| CDC tool (if applicable) | < Debezium / DMS / Maxwell > | |

## Quorum Settings

| Parameter | Value |
|---|---|
| Minimum synchronous replicas | |
| Consensus algorithm | < Raft / ZAB / Sentinel / Patroni > |
| Leader election timeout | s |
| Fencing mechanism | < STONITH / lease / token > |

## Health Monitoring

- **Replication lag metric:** `< db_replication_lag_seconds >`
- **Alert threshold:** s
- **Dashboard link:** ___
- **Runbook for lag breach:** `skills/high-availability/failover-runbook-template.md`

## Validation

- [ ] Replication lag is < alert threshold under normal load
- [ ] Failover to replica completes within RTO
- [ ] No data loss confirmed at failover time (lag = 0 or within RPO)
- [ ] Last successful restore test date: ___
