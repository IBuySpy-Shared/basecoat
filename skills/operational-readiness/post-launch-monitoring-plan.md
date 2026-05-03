# Post-Launch Monitoring Plan

Use this template to define the monitoring strategy, watch windows, escalation thresholds, and stabilization criteria for a service after it enters production.

## Instructions

1. Complete the service and launch metadata.
2. Define each watch window with its duration and on-call commitment.
3. Specify the escalation thresholds that trigger immediate action or rollback.
4. Record the stabilization criteria that mark the service as stable.
5. Attach this plan to the launch readiness gate record.

---

## Plan Metadata

**Service:** _[service name]_
**Version / Commit:** _[version or SHA]_
**Launch Date:** _[YYYY-MM-DD HH:MM UTC]_
**Plan Owner:** _[name or role]_
**On-Call Contact:** _[name and channel]_

---

## Watch Windows

### Window 1 — Immediate (0–2 hours post-launch)

**Owner:** _[name or role]_
**Channel:** _[Slack channel, Teams, PagerDuty]_
**Check Frequency:** Every 5 minutes

Key signals to monitor:

- Error rate (target: < _[X]_ %)
- p50 / p99 latency (target: < _[X]_ ms)
- Request throughput (baseline: _[X]_ RPS)
- Deployment health checks
- Database connection pool utilization

### Window 2 — Active (2–24 hours post-launch)

**Owner:** _[name or role]_
**Check Frequency:** Every 15 minutes

Key signals to monitor:

- SLO burn rate (target: < 1× baseline)
- Error budget consumption
- Memory and CPU saturation trends
- Cache hit rate
- Downstream dependency health

### Window 3 — Stabilization (24–72 hours post-launch)

**Owner:** _[name or role]_
**Check Frequency:** Hourly review; automated alerts active

Key signals to monitor:

- SLO compliance over rolling 24-hour window
- Long-tail error patterns
- Batch job success rates
- Customer support ticket volume trend

---

## Escalation Thresholds

| Signal | Threshold | Action |
|---|---|---|
| Error rate | > _[X]_ % for > 5 minutes | Page on-call; consider rollback |
| p99 latency | > _[X]_ ms for > 10 minutes | Page on-call; investigate |
| Availability | < _[X]_ % over any 5-minute window | Declare incident; rollback if unresolved in 15 min |
| Database errors | > _[X]_ per minute | Page on-call and DBA |
| SLO burn rate | > 5× baseline | Page incident commander |
| Memory saturation | > 90% for > 10 minutes | Scale out; page if auto-scaling fails |

## Rollback Trigger Criteria

Initiate rollback immediately if any of the following occur:

- [ ] Error rate exceeds _[X]_ % and is not recovering within 10 minutes
- [ ] Data corruption or integrity violation detected
- [ ] Critical security event identified post-launch
- [ ] Service availability drops below SLO minimum for > 15 minutes
- [ ] Rollback decision approved by engineering lead or incident commander

**Rollback Procedure Reference:** _[link to rollback runbook]_

---

## Stabilization Criteria

The service is declared stable when all of the following are true for a continuous 24-hour period:

- [ ] Error rate within normal baseline (< _[X]_ %)
- [ ] p99 latency within SLO targets
- [ ] No P1 or P2 incidents attributed to this release
- [ ] SLO burn rate ≤ 1× baseline
- [ ] No open blocking conditions from the launch gate
- [ ] All post-launch watch window observations documented

**Stabilization Declaration:**

| Field | Value |
|---|---|
| Declared Stable | _[YYYY-MM-DD HH:MM UTC]_ |
| Declared By | _[name or role]_ |
| Outstanding Items | _[none / link to issues]_ |

---

## Post-Launch Observations Log

| Timestamp | Signal | Value | Action Taken | Owner |
|---|---|---|---|---|
| | | | | |

---

## References

- Google SRE Book, Ch. 32 — Production Readiness Reviews
- `skills/operational-readiness/launch-readiness-gate.md`
