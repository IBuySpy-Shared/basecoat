-- ============================================================================
-- SCHEMA DEPLOYMENT VERIFICATION
-- Basecoat Portal Database v1.0
-- ============================================================================
-- This script verifies complete deployment of all 13 core tables with
-- correct structure, columns, constraints, and indexes.
-- Run this script after initial migration deployment to staging.
-- ============================================================================

-- ============================================================================
-- PART 1: TABLE STRUCTURE VERIFICATION
-- ============================================================================

-- Count total tables (should be 13 + system tables)
SELECT 'Total tables deployed' AS check_name, COUNT(*) AS count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
AND table_name NOT LIKE 'pg_%';

-- Verify core tables exist (13 required)
WITH required_tables AS (
  SELECT unnest(ARRAY[
    'organizations', 'users', 'teams', 'team_members',
    'roles', 'audit_retention_policies', 'repositories', 'scans',
    'scan_results', 'compliance_issues', 'audit_logs',
    'audit_log_archives', 'simulations'
  ]) AS table_name
)
SELECT
  rt.table_name,
  CASE WHEN t.table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END AS status,
  COALESCE(t.table_rows, 0) AS row_estimate
FROM required_tables rt
LEFT JOIN information_schema.tables t
  ON rt.table_name = t.table_name
  AND t.table_schema = 'public'
ORDER BY rt.table_name;

-- ============================================================================
-- PART 2: COLUMN VALIDATION
-- ============================================================================

-- Check organizations table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'organizations'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check users table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check teams table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'teams'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check repositories table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'repositories'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check scans table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'scans'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check scan_results table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'scan_results'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check audit_logs table structure (immutable table)
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'audit_logs'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- PART 3: CONSTRAINT VALIDATION
-- ============================================================================

-- Primary key verification
SELECT
  t.table_name,
  c.column_name,
  'PRIMARY KEY' AS constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage c
  ON tc.constraint_name = c.constraint_name
  AND tc.table_schema = c.table_schema
JOIN information_schema.tables t
  ON tc.table_name = t.table_name
WHERE tc.constraint_type = 'PRIMARY KEY'
AND tc.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position;

-- Unique constraint verification
SELECT
  tc.table_name,
  tc.constraint_name,
  string_agg(c.column_name, ', ' ORDER BY c.ordinal_position) AS columns,
  'UNIQUE' AS constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage c
  ON tc.constraint_name = c.constraint_name
  AND tc.table_schema = c.table_schema
WHERE tc.constraint_type = 'UNIQUE'
AND tc.table_schema = 'public'
GROUP BY tc.table_name, tc.constraint_name
ORDER BY tc.table_name;

-- Foreign key verification
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- Check constraint verification
SELECT
  table_name,
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE table_schema = 'public'
ORDER BY table_name, constraint_name;

-- ============================================================================
-- PART 4: INDEX VALIDATION
-- ============================================================================

-- Count total indexes (should be 55+)
SELECT
  'Total indexes' AS index_type,
  COUNT(*) AS count
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname NOT LIKE '%_pkey'; -- Exclude primary key indexes

-- Index inventory by table
SELECT
  t.relname AS table_name,
  i.relname AS index_name,
  a.attname AS column_name,
  ix.indisunique AS is_unique,
  ix.indisprimary AS is_primary
FROM pg_class t
JOIN pg_index ix ON t.oid = ix.indrelid
JOIN pg_class i ON i.oid = ix.indexrelid
JOIN pg_attribute a ON a.attrelid = t.oid
  AND a.attnum = ANY(ix.indkey)
WHERE t.relnamespace = 'public'::regnamespace
ORDER BY t.relname, i.relname, a.attnum;

-- Index size analysis
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_indexes
JOIN pg_class ON relname = indexname
WHERE schemaname = 'public'
AND indexname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Index bloat check
SELECT
  schemaname,
  tablename,
  indexname,
  ROUND(100.0 * (pg_relation_size(indexrelid) - pg_relation_size(indexrelid, 'main')) 
    / NULLIF(pg_relation_size(indexrelid), 0), 2) AS bloat_ratio
FROM pg_indexes
JOIN pg_class ON relname = indexname
WHERE schemaname = 'public'
AND indexname NOT LIKE '%_pkey'
HAVING ROUND(100.0 * (pg_relation_size(indexrelid) - pg_relation_size(indexrelid, 'main')) 
  / NULLIF(pg_relation_size(indexrelid), 0), 2) > 10
ORDER BY bloat_ratio DESC;

-- ============================================================================
-- PART 5: DATA TYPE VALIDATION
-- ============================================================================

-- Verify UUID columns (should be uuid type)
SELECT
  table_name,
  column_name,
  data_type,
  CASE WHEN data_type = 'uuid' THEN 'CORRECT' ELSE 'WRONG' END AS status
FROM information_schema.columns
WHERE column_name IN ('id', 'org_id', 'team_id', 'user_id', 'repo_id', 'scan_id')
AND table_schema = 'public'
ORDER BY table_name, column_name;

-- Verify JSONB columns
SELECT
  table_name,
  column_name,
  data_type,
  CASE WHEN data_type = 'jsonb' THEN 'CORRECT' ELSE 'WRONG' END AS status
FROM information_schema.columns
WHERE data_type IN ('json', 'jsonb')
AND table_schema = 'public'
ORDER BY table_name, column_name;

-- Verify timestamp columns
SELECT
  table_name,
  column_name,
  data_type,
  CASE WHEN data_type IN ('timestamp without time zone', 'timestamp with time zone') 
    THEN 'CORRECT' ELSE 'WRONG' END AS status
FROM information_schema.columns
WHERE column_name LIKE '%_at'
AND table_schema = 'public'
ORDER BY table_name, column_name;

-- ============================================================================
-- PART 6: SYSTEM VALIDATION
-- ============================================================================

-- Check schema migrations table exists (for version tracking)
SELECT
  'schema_migrations table' AS item,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'schema_migrations'
    AND table_schema = 'public'
  ) THEN 'EXISTS' ELSE 'MISSING' END AS status;

-- List applied migrations
SELECT
  version,
  applied_at
FROM schema_migrations
WHERE table_schema = 'public'
ORDER BY version DESC;

-- ============================================================================
-- PART 7: DEPLOYMENT SUMMARY
-- ============================================================================

-- Summary report
SELECT
  'Deployment Verification Summary' AS report_type,
  (SELECT COUNT(*) FROM information_schema.tables
   WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
   AND table_name NOT LIKE 'pg_%') AS total_tables,
  (SELECT COUNT(*) FROM information_schema.table_constraints
   WHERE table_schema = 'public') AS total_constraints,
  (SELECT COUNT(*) FROM pg_indexes
   WHERE schemaname = 'public') AS total_indexes;

-- Quick verification checklist
SELECT
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      AND table_name NOT IN ('schema_migrations') AND table_name NOT LIKE 'pg_%') >= 13
    THEN '✓ PASS' ELSE '✗ FAIL' END AS "Tables (13+)",
  CASE
    WHEN (SELECT COUNT(*) FROM pg_indexes
      WHERE schemaname = 'public' AND indexname NOT LIKE '%_pkey') >= 50
    THEN '✓ PASS' ELSE '✗ FAIL' END AS "Indexes (50+)",
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.table_constraints
      WHERE table_schema = 'public' AND constraint_type = 'FOREIGN KEY') >= 13
    THEN '✓ PASS' ELSE '✗ FAIL' END AS "Foreign Keys (13+)",
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.table_constraints
      WHERE table_schema = 'public' AND constraint_type = 'UNIQUE') >= 8
    THEN '✓ PASS' ELSE '✗ FAIL' END AS "Unique Constraints (8+)";
