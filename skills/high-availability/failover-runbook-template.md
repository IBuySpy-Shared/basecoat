# Failover Runbook Template

## Service

- **Service name:**
- **Failover type:** < Planned | Unplanned >
- **Owner:**
- **Last tested:**

## Pre-Conditions

- [ ] Alert has fired indicating primary is unhealthy (if unplanned)
- [ ] Maintenance window is approved (if planned)
- [ ] Secondary / standby is confirmed healthy
- [ ] Stakeholder communication channel is open
- [ ] Rollback procedure is documented below

## Failover Steps

### 1. Confirm Failure

```bash
# Verify primary health
curl -f https://<primary-endpoint>/health || echo "Primary unhealthy"

# Check replication lag / replica status
# (replace with DB-specific command)
```

### 2. Promote Secondary

```bash
# Example: PostgreSQL promotion
pg_ctl promote -D /var/lib/postgresql/data

# Example: Redis Sentinel failover
redis-cli -p 26379 SENTINEL failover <master-name>
```

### 3. Update DNS or Load Balancer

```bash
# Example: Route 53 record update
aws route53 change-resource-record-sets \
  --hosted-zone-id <ZONE_ID> \
  --change-batch file://failover-change.json
```

### 4. Validate Traffic on Secondary

- [ ] API health check passes on secondary endpoint
- [ ] Error rate is within SLO on dashboards
- [ ] Latency is within p99 SLO
- [ ] No data loss confirmed (check replication lag at failover time)

### 5. Notify Stakeholders

- Update status page: _
- Send incident channel update: _

## Rollback Procedure

_Describe how to revert to the primary if the failover causes unexpected issues._

### Steps to Re-promote Primary

1.
2.
3.

## Post-Failover Checklist

- [ ] Root cause of failure documented
- [ ] Replication re-established to new secondary
- [ ] DNS TTL restored to normal value
- [ ] Incident post-mortem scheduled
- [ ] Runbook updated with any learnings

## Contacts

| Role | Name | Contact |
|---|---|---|
| Incident Commander | | |
| Database Owner | | |
| Platform On-Call | | |

## References

- Related SLO: ___
- Monitoring dashboard: ___
- Architecture design: `skills/high-availability/ha-topology-template.md`
