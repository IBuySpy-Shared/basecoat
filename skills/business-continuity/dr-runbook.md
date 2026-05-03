# Disaster Recovery Runbook

Use this template to document step-by-step recovery procedures for a catastrophic failure scenario. One runbook covers one scenario for one service or cluster of services.

## Instructions

1. Create one runbook per scenario per service.
2. Write each step so that an on-call engineer with no prior involvement can execute it.
3. Include verification steps after every significant action.
4. Link dashboards, monitoring queries, and supporting scripts.
5. Review and re-test this runbook at least annually or after any architectural change.

---

## Runbook Metadata

**Service:** _[service name]_
**Scenario:** _[e.g., "Regional cloud provider outage — us-east-1"]_
**Runbook Version:** _[X.Y]_
**Last Reviewed:** _[YYYY-MM-DD]_
**Last Tested:** _[YYYY-MM-DD]_
**Runbook Owner:** _[name or role]_
**On-Call Contact:** _[name and Slack/phone]_
**RTO Target:** _[e.g., 15 minutes]_
**RPO Target:** _[e.g., 0 data loss]_

---

## Scenario Description

_Describe the failure scenario in one paragraph. Include the trigger condition, expected symptoms, and the blast radius._

**Trigger Condition:** _[e.g., "AWS us-east-1 region is completely unavailable — health checks failing, EC2 API unresponsive"]_

**Symptoms:**

- _[Symptom 1 — e.g., all health checks in us-east-1 failing for > 5 minutes]_
- _[Symptom 2 — e.g., 100% error rate on payments-api]_
- _[Symptom 3 — e.g., PagerDuty alert: "Region health check P1"]_

**Blast Radius:** _[e.g., all Tier 1 services in us-east-1; approximately 40,000 affected users]_

---

## Pre-Condition Checklist

Before beginning recovery, confirm:

- [ ] Failure is confirmed (not a false positive or monitoring issue)
- [ ] Incident declared and incident commander assigned
- [ ] Communications lead notified
- [ ] This runbook version is current (check `Last Tested` date)

---

## Recovery Procedure

### Phase 1 — Assess (Time Target: 0–5 minutes)

1. **Confirm failure scope:**

   ```bash
   # Check primary region health
   aws cloudwatch get-metric-statistics \
     --region us-east-1 \
     --namespace AWS/ApplicationELB \
     --metric-name HealthyHostCount \
     --dimensions Name=LoadBalancer,Value=<lb-name> \
     --start-time $(date -u -d '10 minutes ago' +%FT%TZ) \
     --end-time $(date -u +%FT%TZ) \
     --period 60 \
     --statistics Average
   ```

   **Expected result (healthy):** HealthyHostCount ≥ _[minimum]_
   **If unhealthy:** Proceed to Phase 2.

2. **Check secondary region readiness:**

   ```bash
   # Verify secondary region services are healthy
   curl -sf https://api-secondary.example.com/health | jq .
   ```

   **Expected result:** `{ "status": "ok" }`

3. **Record baseline metrics** (capture before any changes):

   | Metric | Value |
   |---|---|
   | Current error rate | |
   | Current p99 latency | |
   | Last successful transaction timestamp | |

### Phase 2 — Activate Failover (Time Target: 5–15 minutes)

1. **Switch DNS to secondary region:**

   ```bash
   # Update Route 53 to point to secondary region
   aws route53 change-resource-record-sets \
     --hosted-zone-id <HOSTED_ZONE_ID> \
     --change-batch '{
       "Changes": [{
         "Action": "UPSERT",
         "ResourceRecordSet": {
           "Name": "api.example.com",
           "Type": "A",
           "TTL": 60,
           "ResourceRecords": [{"Value": "<secondary-ip>"}]
         }
       }]
     }'
   ```

   **Verify:** DNS propagation confirmed in ≤ 90 seconds.

   ```bash
   for i in {1..6}; do
     echo "Attempt $i: $(dig +short api.example.com | head -1)"
     sleep 15
   done
   ```

2. **Verify traffic routing to secondary:**

   ```bash
   # Confirm requests are reaching secondary
   curl -sf https://api.example.com/health -v 2>&1 | grep "< HTTP"
   ```

   **Expected result:** `HTTP/2 200`

### Phase 3 — Validate Recovery (Time Target: 15–20 minutes)

1. **Run smoke tests against secondary:**

   ```bash
   # Execute critical path smoke tests
   pytest tests/smoke/ --tb=short -v \
     --base-url https://api.example.com
   ```

   **Expected result:** All smoke tests pass.

2. **Validate data integrity:**

   ```bash
   # Check for data consistency (adjust query for your stack)
   psql -h <secondary-db-host> -U <user> -d <db> -c \
     "SELECT COUNT(*), MAX(created_at) FROM transactions WHERE created_at > NOW() - INTERVAL '1 hour';"
   ```

   **Record result:** _[rows, max timestamp]_

3. **Confirm RTO achieved:**

   - Time of failure confirmation: _[HH:MM UTC]_
   - Time smoke tests passed: _[HH:MM UTC]_
   - Elapsed: _[minutes]_
   - RTO target: _[X minutes]_
   - RTO met: Yes / No

4. **Send status update** (use communication template from `bcp-drp-master.md`).

### Phase 4 — Monitor and Stabilize

1. **Monitor for 60 minutes:**

    - Error rate target: < _[X]_ %
    - p99 latency target: < _[X]_ ms
    - Database replication lag: < _[X]_ seconds

2. **Prepare failback plan:**

    When primary region is restored, execute controlled failback:

    - [ ] Verify primary region is fully healthy
    - [ ] Confirm replication is caught up (RPO = 0)
    - [ ] Coordinate maintenance window for failback
    - [ ] Switch DNS back to primary (same procedure as Phase 2, reversed)
    - [ ] Verify smoke tests pass in primary
    - [ ] Monitor for 30 minutes before declaring full recovery

---

## Rollback Procedure

If recovery is not achieved within RTO + 50% tolerance:

1. Re-evaluate the failure scenario — is this the right runbook?
2. Escalate to senior SRE or engineering lead.
3. Consider declaring a longer outage and activating the external communication plan.

---

## Post-Incident Actions

- [ ] Record actual RTO and RPO achieved
- [ ] Update this runbook with any steps that were added or changed during recovery
- [ ] File GitHub Issues for any gaps or automation opportunities discovered
- [ ] Schedule blameless post-mortem within 24 hours
- [ ] Update DR test schedule if runbook had significant changes

---

## References

- BCP/DRP Master: `skills/business-continuity/bcp-drp-master.md`
- DR Test Exercise: `skills/business-continuity/dr-test-exercise.md`
- NIST SP 800-34 Rev. 1 — Section 3.4 Recovery Procedures
