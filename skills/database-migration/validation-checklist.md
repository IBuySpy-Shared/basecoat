# Database Migration Validation Checklist

Run this checklist before and after every database migration. Record actual values in the Actual column.

## Pre-Migration Baseline

Capture these values from the source system before applying any changes.

| Check | Value |
|---|---|
| Total row count — table 1 | ___ |
| Total row count — table 2 | ___ |
| Checksum / hash of key table | ___ |
| p95 query latency (baseline) | ___ ms |
| Index list (count + names) | ___ |
| Constraint list | ___ |
| Database size | ___ GB |

## Post-Migration Validation

### Data Integrity

- [ ] Row count in target matches source within acceptable tolerance (define: ± 0%)
- [ ] Row count in affected tables matches pre-migration baseline
- [ ] Checksum or hash of key table matches baseline
- [ ] No unexpected NULL values in previously populated columns
- [ ] No duplicate rows on primary key or unique constraint columns
- [ ] Foreign key constraints verified (no orphaned records)

### Schema Correctness

- [ ] All expected columns present with correct data types
- [ ] All indexes created and validated (`pg_indexes` / `sys.indexes`)
- [ ] All constraints present and enabled
- [ ] No unexpected residual objects (shadow tables, temp columns) left behind
- [ ] Schema version number matches expected migration version

### Application Compatibility

- [ ] Application smoke tests pass against migrated database
- [ ] Critical user journeys verified end-to-end (list below)
- [ ] No error-rate spike in application logs for ≥ 30 min post-migration
- [ ] API response codes normal (no unexpected 5xx)

### Performance Baseline

- [ ] p95 query latency within 10% of pre-migration baseline
- [ ] No new full-table scans introduced (check `EXPLAIN` plans for key queries)
- [ ] No excessive lock waits or deadlocks in database logs
- [ ] Replication lag (if applicable) within acceptable range

## Critical User Journeys to Verify

List the application flows that touch the migrated tables:

| Journey | Expected Behavior | Pass/Fail |
|---|---|---|
| _User login_ | _Resolves user record_ | |
| _Place order_ | _Writes order record_ | |
| _View order history_ | _Reads order records_ | |

## Rollback Decision Criteria

Initiate rollback immediately if any of the following occur:

- Row count discrepancy > 0.1% between source and target
- Any data loss or corruption detected in spot checks
- Application error rate increases by > 1% post-migration
- p95 query latency increases by > 25% and cannot be explained by schema change
- Critical user journey fails smoke test

## Sign-Off

| Role | Name | Signature | Time |
|---|---|---|---|
| Migration author | | | |
| DBA / reviewer | | | |
| On-call engineer | | | |
