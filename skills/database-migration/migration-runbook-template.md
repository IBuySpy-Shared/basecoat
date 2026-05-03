# Migration Runbook Template

Use this template to document a database migration before execution. Complete every section before the migration window opens.

## Migration Summary

| Field | Value |
|---|---|
| Migration title | _One-line description_ |
| Author | _Name_ |
| Reviewed by | _Name_ |
| Target environment | _Staging / Production_ |
| Scheduled window | _YYYY-MM-DD HH:MM – HH:MM UTC_ |
| Estimated duration | _e.g., 30 min_ |
| Expected downtime | _None / Maintenance window of X min_ |
| Rollback window | _Time available to roll back before impact is unacceptable_ |
| DBA on-call | _Name and contact_ |

## Scope

Describe the databases, tables, and data volumes affected.

| Database | Table | Row Count | Change Type |
|---|---|---|---|
| `app_db` | `users` | ~2 M | Add column |
| `app_db` | `orders` | ~50 M | Backfill data |

## Prerequisites

- [ ] Backup of affected databases taken and verified
- [ ] Migration script reviewed and approved (PR link: ___)
- [ ] Migration executed successfully in staging with production-sized data
- [ ] Rollback script tested in staging
- [ ] Monitoring dashboards open and baselines captured
- [ ] Stakeholders notified of maintenance window
- [ ] Application feature flags configured for cutover (if applicable)

## Migration Steps

| Step | Action | Expected Outcome | Verification |
|---|---|---|---|
| 1 | Take full database backup | Backup file confirmed | `md5sum` of backup file |
| 2 | Apply migration script | Schema changes applied | Query `information_schema` |
| 3 | Run backfill job | All rows populated | Row count + null check |
| 4 | Validate data integrity | Counts and checksums match | See Validation section |
| 5 | Update application configuration | App reads new schema | Smoke test pass |
| 6 | Monitor for 30 min | No errors or performance degradation | Dashboard check |

## Rollback Procedure

Execute these steps in order if the migration must be reverted:

| Step | Action | Command or Script |
|---|---|---|
| 1 | Stop application writes | Feature flag / maintenance mode |
| 2 | Run rollback script | `flyway undo` or `psql -f rollback.sql` |
| 3 | Restore from backup if needed | `pg_restore -d app_db backup.dump` |
| 4 | Verify rollback | Run validation checklist against original schema |
| 5 | Re-enable application | Remove maintenance mode |
| 6 | Communicate status | Post to `#deployments` channel |

## Validation

After migration, run the validation checklist (`skills/database-migration/validation-checklist.md`) and record results here.

| Check | Expected | Actual | Pass/Fail |
|---|---|---|---|
| Row count — users | 2,134,567 | ___ | |
| Row count — orders | 50,210,000 | ___ | |
| Null rate on new column | 0% after backfill | ___ | |
| Application smoke tests | All green | ___ | |
| p95 query latency | < 50 ms | ___ | |

## Post-Migration Tasks

- [ ] Archive migration scripts and runbook in the repository
- [ ] Update the schema version in version-controlled documentation
- [ ] Remove temporary objects (shadow tables, old columns per expand-contract schedule)
- [ ] File a GitHub Issue for any deferred cleanup with a due date
- [ ] Update monitoring baselines to reflect new schema
