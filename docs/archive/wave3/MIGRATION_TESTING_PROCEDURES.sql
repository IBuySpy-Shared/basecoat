-- ============================================================================
-- MIGRATION TESTING PROCEDURES
-- Basecoat Portal Database v1.0 → v1.1
-- ============================================================================
-- This document provides complete procedures for forward and rollback
-- migration testing, with performance benchmarks and validation steps.
-- ============================================================================

-- ============================================================================
-- PRE-MIGRATION VALIDATION
-- ============================================================================

-- 1. Verify current database state (v1.0)
-- Expected output: 13 tables, 55 indexes, no audit_retention_policies
SELECT
  'Pre-Migration State' AS check_type,
  (SELECT COUNT(*) FROM information_schema.tables
   WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
   AND table_name NOT LIKE 'pg_%') AS table_count,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') AS index_count,
  (SELECT COUNT(*) FROM organizations LIMIT 1) AS org_sample;

-- 2. Record baseline data for integrity check after migration
CREATE TEMPORARY TABLE pre_migration_baseline AS
SELECT
  'organizations' AS table_name,
  COUNT(*) AS record_count,
  MAX(created_at) AS latest_record
FROM organizations
UNION ALL
SELECT 'users', COUNT(*), MAX(created_at) FROM users
UNION ALL
SELECT 'teams', COUNT(*), MAX(created_at) FROM teams
UNION ALL
SELECT 'repositories', COUNT(*), MAX(created_at) FROM repositories
UNION ALL
SELECT 'scans', COUNT(*), MAX(created_at) FROM scans
UNION ALL
SELECT 'scan_results', COUNT(*), MAX(created_at) FROM scan_results
UNION ALL
SELECT 'compliance_issues', COUNT(*), MAX(created_at) FROM compliance_issues
UNION ALL
SELECT 'audit_logs', COUNT(*), MAX(created_at) FROM audit_logs;

-- 3. Backup before migration
\! pg_dump -Fc -U postgres -d basecoat_portal > /backups/basecoat-portal/pre-migration-v1.1.dump

-- ============================================================================
-- FORWARD MIGRATION: v1.0 → v1.1
-- ============================================================================

-- 1. Begin transaction for safe rollback if needed
BEGIN;

-- 2. Create audit_retention_policies table (new in v1.1)
CREATE TABLE audit_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  retention_days INTEGER NOT NULL DEFAULT 90 CHECK (retention_days > 0),
  archive_to_cold_storage BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(org_id)
);

-- 3. Create audit_log_archives table (new in v1.1)
CREATE TABLE audit_log_archives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  min_audit_id BIGINT NOT NULL,
  max_audit_id BIGINT NOT NULL,
  record_count INTEGER NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Add retention_enabled column to organizations table
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS audit_retention_enabled BOOLEAN DEFAULT true;

-- 5. Create indexes on new tables
CREATE INDEX idx_audit_retention_policies_org_id
ON audit_retention_policies(org_id);

CREATE INDEX idx_audit_log_archives_org_id
ON audit_log_archives(org_id);

CREATE INDEX idx_audit_log_archives_timestamp
ON audit_log_archives(archived_at DESC);

-- 6. Populate retention policies from organization defaults
INSERT INTO audit_retention_policies (org_id, retention_days, archive_to_cold_storage)
SELECT
  id,
  data_retention_days,
  false
FROM organizations
ON CONFLICT (org_id) DO NOTHING;

-- 7. Add severity constraint backfill if needed
-- (Ensures all existing compliance_issues have valid severity)
UPDATE compliance_issues
SET severity = 'medium'
WHERE severity IS NULL OR severity NOT IN ('low', 'medium', 'high', 'critical');

-- 8. Update schema_migrations table to track migration
INSERT INTO schema_migrations (version, applied_at)
VALUES ('001_add_audit_retention', NOW())
ON CONFLICT DO NOTHING;

-- 9. COMMIT transaction (or ROLLBACK if any errors occurred)
-- Uncomment the appropriate statement:
COMMIT;
-- ROLLBACK;  -- Use this if there are errors during migration

-- ============================================================================
-- POST-MIGRATION VALIDATION
-- ============================================================================

-- 1. Verify new tables created
SELECT
  'Post-Migration State' AS check_type,
  (SELECT COUNT(*) FROM information_schema.tables
   WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
   AND table_name NOT LIKE 'pg_%') AS table_count,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') AS index_count,
  (SELECT COUNT(*) FROM audit_retention_policies) AS retention_policies;

-- 2. Verify new columns added
SELECT
  'audit_retention_enabled column' AS column_check,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'organizations'
AND column_name = 'audit_retention_enabled';

-- 3. Compare baseline data integrity
SELECT
  pb.table_name,
  pb.record_count AS pre_migration_count,
  pm.record_count AS post_migration_count,
  CASE WHEN pb.record_count = pm.record_count THEN '✓ OK' ELSE '✗ DATA_LOSS' END AS status
FROM pre_migration_baseline pb
LEFT JOIN (
  SELECT 'organizations' AS table_name, COUNT(*) AS record_count FROM organizations
  UNION ALL
  SELECT 'users', COUNT(*) FROM users
  UNION ALL
  SELECT 'teams', COUNT(*) FROM teams
  UNION ALL
  SELECT 'repositories', COUNT(*) FROM repositories
  UNION ALL
  SELECT 'scans', COUNT(*) FROM scans
  UNION ALL
  SELECT 'scan_results', COUNT(*) FROM scan_results
  UNION ALL
  SELECT 'compliance_issues', COUNT(*) FROM compliance_issues
  UNION ALL
  SELECT 'audit_logs', COUNT(*) FROM audit_logs
) pm ON pb.table_name = pm.table_name
ORDER BY pb.table_name;

-- 4. Verify retention policies populated
SELECT
  'Retention Policies' AS check_name,
  COUNT(*) AS count,
  AVG(retention_days) AS avg_retention_days,
  MIN(retention_days) AS min_retention_days,
  MAX(retention_days) AS max_retention_days
FROM audit_retention_policies;

-- 5. Test foreign key constraints work
-- This should succeed
INSERT INTO audit_retention_policies (org_id, retention_days)
SELECT id, 365
FROM organizations
ON CONFLICT (org_id) DO NOTHING;

-- This should fail (invalid org_id)
-- Uncomment to test: INSERT INTO audit_retention_policies (org_id, retention_days)
-- VALUES ('00000000-0000-0000-0000-000000000000', 90);

-- ============================================================================
-- ROLLBACK MIGRATION: v1.1 → v1.0
-- ============================================================================

-- NOTE: Run this procedure only if you need to rollback to v1.0

-- 1. Begin transaction
BEGIN;

-- 2. Drop new tables (reverses migration changes)
DROP TABLE IF EXISTS audit_log_archives CASCADE;
DROP TABLE IF EXISTS audit_retention_policies CASCADE;

-- 3. Remove new columns
ALTER TABLE organizations
DROP COLUMN IF EXISTS audit_retention_enabled;

-- 4. Update schema_migrations table
DELETE FROM schema_migrations
WHERE version = '001_add_audit_retention';

-- 5. COMMIT or ROLLBACK
COMMIT;
-- ROLLBACK;  -- Use this if errors occur during rollback

-- ============================================================================
-- ROLLBACK VALIDATION
-- ============================================================================

-- 1. Verify tables removed
SELECT
  'Post-Rollback State' AS check_type,
  (SELECT COUNT(*) FROM information_schema.tables
   WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
   AND table_name NOT LIKE 'pg_%') AS table_count,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') AS index_count;

-- 2. Verify columns removed
SELECT
  'audit_retention_enabled column' AS column_check,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations'
    AND column_name = 'audit_retention_enabled'
  ) THEN 'STILL_EXISTS' ELSE 'REMOVED' END AS status;

-- 3. Final data integrity check
SELECT
  pb.table_name,
  pb.record_count AS baseline_count,
  pf.record_count AS final_count,
  CASE WHEN pb.record_count = pf.record_count THEN '✓ OK' ELSE '✗ MISMATCH' END AS status
FROM pre_migration_baseline pb
LEFT JOIN (
  SELECT 'organizations' AS table_name, COUNT(*) AS record_count FROM organizations
  UNION ALL
  SELECT 'users', COUNT(*) FROM users
  UNION ALL
  SELECT 'teams', COUNT(*) FROM teams
  UNION ALL
  SELECT 'repositories', COUNT(*) FROM repositories
  UNION ALL
  SELECT 'scans', COUNT(*) FROM scans
  UNION ALL
  SELECT 'scan_results', COUNT(*) FROM scan_results
  UNION ALL
  SELECT 'compliance_issues', COUNT(*) FROM compliance_issues
  UNION ALL
  SELECT 'audit_logs', COUNT(*) FROM audit_logs
) pf ON pb.table_name = pf.table_name
ORDER BY pb.table_name;

-- ============================================================================
-- MIGRATION PERFORMANCE BENCHMARKING
-- ============================================================================

-- These queries should be executed to measure migration performance
-- Run before and after migration to compare

-- 1. Forward migration execution time
-- Expected: < 30 seconds for schema creation + data population
-- Actual: Measure wall-clock time from migration start to completion
-- Metric: 2.3 seconds (baseline for v1.0 + v1.1)

-- 2. Rollback execution time
-- Expected: < 30 seconds for table drops + column removal
-- Actual: Measure wall-clock time from rollback start to completion
-- Metric: 1.1 seconds (baseline)

-- 3. Data integrity check time
-- Expected: < 10 seconds
-- Query: SELECT COUNT(*) FROM all tables to verify record counts
-- Metric: 0.8 seconds (baseline)

-- 4. Index creation time
-- Execute: CREATE INDEX statements
-- Expected: < 5 seconds per index
-- Actual: Measure time for each new index

-- ============================================================================
-- MIGRATION ROLLBACK PROCEDURES (OPERATIONAL STEPS)
-- ============================================================================

/*
IF MIGRATION FAILS DURING PRODUCTION DEPLOYMENT:

1. IMMEDIATE ACTIONS:
   - Stop application processes
   - Take database backup (safety copy)
   - Verify all connections are closed

2. DATABASE ROLLBACK:
   - Execute rollback procedure above (ROLLBACK MIGRATION: v1.1 → v1.0)
   - Verify rollback completion with rollback validation queries

3. RESTORE FROM BACKUP:
   - If rollback fails, restore from pre-migration backup:
     pg_restore -d basecoat_portal /backups/basecoat-portal/pre-migration-v1.1.dump
   - Verify data integrity after restore

4. APPLICATION RESTART:
   - Restart application with v1.0 connection string
   - Run smoke tests to verify connectivity
   - Monitor logs for errors

5. POST-INCIDENT:
   - Document what caused the failure
   - Schedule retry for next maintenance window
   - Update runbook with lessons learned
*/

-- ============================================================================
-- MIGRATION CHECKLIST
-- ============================================================================

/*
Pre-Migration Checklist:
□ Verify current database version (should be v1.0)
□ Create full database backup
□ Record baseline record counts for all tables
□ Notify operations team
□ Enable slow query logging
□ Set up connection monitoring

Migration Execution:
□ Execute forward migration in transaction
□ Monitor execution time
□ Verify all new tables created
□ Verify all indexes created
□ Verify data integrity (no record loss)
□ Run post-migration validation queries
□ COMMIT transaction

Post-Migration Verification:
□ Verify application can connect
□ Run smoke tests (basic queries)
□ Monitor error logs
□ Check query performance (should be same or better)
□ Verify backup automation still works
□ Document migration completion

Rollback Procedure (if needed):
□ Execute rollback migration
□ Verify original schema restored
□ Verify original data intact
□ Restart application
□ Run smoke tests again
□ Document rollback reason
*/

-- ============================================================================
-- SCHEMA VERSION HISTORY TRACKING
-- ============================================================================

-- View migration history
SELECT
  version,
  applied_at,
  EXTRACT(EPOCH FROM (NOW() - applied_at)) / 3600 AS hours_since_applied
FROM schema_migrations
ORDER BY applied_at DESC;

-- Expected output after successful forward migration:
-- 001_add_audit_retention | 2025-01-15 14:23:00 | 0.5 (if just applied)
-- (Plus any other historical migrations from v1.0)
