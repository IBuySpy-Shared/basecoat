# Backup Verification Checklist

**Reviewer:**
**Date:**
**Database / Store:**
**Environment:**

## Scoring Key

- ✅ Pass — requirement is met
- ❌ Fail (Critical) — blocking; backup integrity is at risk
- ⚠️ Fail (High) — fix before next release
- N/A — not applicable

---

## Backup Configuration

| ID | Check | Status | Notes |
|---|---|---|---|
| BCK-1 | Automated backups are enabled and scheduled | | |
| BCK-2 | Backup frequency meets RPO target (daily minimum; hourly for Tier 2+) | | |
| BCK-3 | Retention policy: 7 daily + 4 weekly + 12 monthly snapshots minimum | | |
| BCK-4 | Backups are encrypted at rest (AES-256 or equivalent) | | |
| BCK-5 | Backups are encrypted in transit | | |
| BCK-6 | Backups are stored in a different region or account from the primary database | | |
| BCK-7 | Backup storage access is restricted — application accounts cannot read or delete backups | | |
| BCK-8 | Point-in-time recovery (PITR) is enabled for Tier 2+ services | | |
| BCK-9 | WAL / binlog archival is continuous and gap-free | | |
| BCK-10 | Backup completion and size are monitored and alert on failure | | |

## Restore Verification

| ID | Check | Status | Notes |
|---|---|---|---|
| RST-1 | Restore procedure is documented as a runbook | | |
| RST-2 | A full restore has been tested within the last 90 days | | |
| RST-3 | Restore RTO has been measured and meets the SLA target | | |
| RST-4 | Row / document counts match the production snapshot at backup time | | |
| RST-5 | Checksums or hash verification pass on sampled tables/collections | | |
| RST-6 | Application health check passes against restored data | | |
| RST-7 | Restore test is automated in CI or a scheduled pipeline | | |
| RST-8 | PITR restore tested to a specific point in time | | |

## Last Restore Test Results

| Metric | Value |
|---|---|
| Date of last restore test | |
| Environment used for restore | |
| Restore completed without errors? | Yes / No |
| Restore duration (RTO measured) | minutes |
| RTO target | minutes |
| RTO target met? | Yes / No |
| Row count verification passed? | Yes / No |
| Checksum verification passed? | Yes / No |
| Health check passed? | Yes / No |

## Summary

| Category | Pass | Fail | N/A |
|---|---|---|---|
| Backup configuration | | | |
| Restore verification | | | |

## Critical Findings

| ID | Description | Recommended Fix | Owner |
|---|---|---|---|
| | | | |

## Next Steps

- [ ] Schedule next restore test: ___
- [ ] File GitHub issues for all Critical and High findings
- [ ] Update restore runbook if procedure was modified during test
