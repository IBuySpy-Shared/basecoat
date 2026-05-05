-- ============================================================================
-- INDEX VALIDATION & OPTIMIZATION QUERIES
-- Basecoat Portal Database v1.0
-- ============================================================================
-- This script validates all 55+ indexes, checks for duplicates, measures
-- performance impact, and identifies optimization opportunities.
-- ============================================================================

-- ============================================================================
-- PART 1: INDEX INVENTORY & VERIFICATION
-- ============================================================================

-- Complete index inventory (55 expected)
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
  CASE WHEN indexdef LIKE '%UNIQUE%' THEN 'UNIQUE' ELSE 'NON-UNIQUE' END AS type
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Index count by table
SELECT
  tablename,
  COUNT(*) AS index_count,
  COUNT(*) FILTER (WHERE indexdef LIKE '%UNIQUE%') AS unique_indexes,
  COUNT(*) FILTER (WHERE indexdef LIKE '%ASC%' OR indexdef NOT LIKE '%DESC%') AS asc_indexes,
  COUNT(*) FILTER (WHERE indexdef LIKE '%DESC%') AS desc_indexes
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY index_count DESC;

-- Primary key indexes (auto-created, one per table = 13)
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE '%_pkey'
ORDER BY tablename;

-- ============================================================================
-- PART 2: INDEX STRUCTURE VALIDATION
-- ============================================================================

-- Verify critical indexes exist (named per convention)
WITH critical_indexes AS (
  SELECT ARRAY[
    'idx_organizations_slug',
    'idx_users_email',
    'idx_users_github_id',
    'idx_teams_org_id',
    'idx_repositories_org_id',
    'idx_repositories_is_active',
    'idx_scans_repo_id',
    'idx_scans_status',
    'idx_scan_results_scan_id',
    'idx_scan_results_severity',
    'idx_compliance_issues_repo_id',
    'idx_compliance_issues_status',
    'idx_audit_logs_org_id',
    'idx_audit_logs_timestamp'
  ] AS expected_indexes
)
SELECT
  idx,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = idx AND schemaname = 'public'
  ) THEN 'EXISTS' ELSE 'MISSING' END AS status
FROM critical_indexes,
LATERAL unnest(critical_indexes.expected_indexes) AS idx
ORDER BY idx;

-- ============================================================================
-- PART 3: INDEX USAGE & PERFORMANCE
-- ============================================================================

-- Index usage statistics (requires postgres 10+)
SELECT
  schemaname,
  tablename,
  indexrelname,
  idx_scan AS scans,
  idx_tup_read AS tuples_read,
  idx_tup_fetch AS tuples_fetched,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC, schemaname, tablename;

-- Unused indexes (candidates for removal)
SELECT
  schemaname,
  tablename,
  indexrelname,
  idx_scan AS scans,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
AND idx_scan = 0
AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Most-used indexes
SELECT
  schemaname,
  tablename,
  indexrelname,
  idx_scan AS scans,
  idx_tup_read AS tuples_read,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
AND idx_scan > 0
ORDER BY idx_scan DESC
LIMIT 20;

-- ============================================================================
-- PART 4: DUPLICATE & REDUNDANT INDEX DETECTION
-- ============================================================================

-- Detect duplicate indexes (same columns, multiple indexes)
WITH index_columns AS (
  SELECT
    t.relname AS table_name,
    i.relname AS index_name,
    array_agg(a.attname ORDER BY x.pos) AS column_names,
    array_agg(x.pos ORDER BY x.pos) AS column_positions
  FROM pg_class t
  JOIN pg_index ix ON t.oid = ix.indrelid
  JOIN pg_class i ON i.oid = ix.indexrelid
  JOIN pg_attribute a ON a.attrelid = t.oid
  JOIN (SELECT * FROM generate_series(1, 32) AS n(pos)) x ON x.pos = ANY(ix.indkey)
    AND a.attnum = ix.indkey[x.pos - 1]
  WHERE t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  GROUP BY t.relname, i.relname
)
SELECT
  table_name,
  column_names::text,
  array_agg(index_name) AS indexes_with_same_columns,
  COUNT(*) AS duplicate_count
FROM index_columns
GROUP BY table_name, column_names
HAVING COUNT(*) > 1
ORDER BY table_name;

-- Detect oversized indexes (more than 10% bloat)
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size,
  ROUND(100.0 * (pg_relation_size(indexrelid) - pg_relation_size(indexrelid, 'main')) 
    / NULLIF(pg_relation_size(indexrelid), 0), 2) AS bloat_percentage,
  CASE WHEN ROUND(100.0 * (pg_relation_size(indexrelid) - pg_relation_size(indexrelid, 'main')) 
    / NULLIF(pg_relation_size(indexrelid), 0), 2) > 10 THEN 'REINDEX_CANDIDATE' ELSE 'OK' END AS action
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- ============================================================================
-- PART 5: INDEX TYPE DISTRIBUTION
-- ============================================================================

-- B-Tree indexes (standard for equality/range queries)
SELECT
  'B-Tree' AS index_type,
  COUNT(*) AS count,
  pg_size_pretty(SUM(pg_relation_size(indexrelid))) AS total_size
FROM pg_indexes
WHERE schemaname = 'public'
AND indexdef NOT LIKE '%GIN%'
AND indexdef NOT LIKE '%BRIN%'
AND indexdef NOT LIKE '%GIST%'
AND indexdef NOT LIKE '%HASH%';

-- GIN indexes (for JSONB/array queries)
SELECT
  'GIN' AS index_type,
  COUNT(*) AS count,
  pg_size_pretty(SUM(pg_relation_size(indexrelid))) AS total_size
FROM pg_indexes
WHERE schemaname = 'public'
AND indexdef LIKE '%GIN%';

-- BRIN indexes (for time-series/append-only data)
SELECT
  'BRIN' AS index_type,
  COUNT(*) AS count,
  pg_size_pretty(SUM(pg_relation_size(indexrelid))) AS total_size
FROM pg_indexes
WHERE schemaname = 'public'
AND indexdef LIKE '%BRIN%';

-- Partial indexes (filtered for specific conditions)
SELECT
  'Partial' AS index_type,
  COUNT(*) AS count,
  pg_size_pretty(SUM(pg_relation_size(indexrelid))) AS total_size
FROM pg_indexes
WHERE schemaname = 'public'
AND indexdef LIKE '%WHERE%';

-- ============================================================================
-- PART 6: INDEX PERFORMANCE IMPACT
-- ============================================================================

-- Table-level index coverage (indexes per table)
SELECT
  t.relname AS table_name,
  pg_size_pretty(pg_total_relation_size(t.oid)) AS table_size,
  pg_size_pretty(SUM(pg_relation_size(i.oid))) AS indexes_size,
  COUNT(i.oid) AS index_count,
  ROUND(100.0 * SUM(pg_relation_size(i.oid)) 
    / NULLIF(pg_total_relation_size(t.oid), 0), 2) AS indexes_percent_of_table
FROM pg_class t
LEFT JOIN pg_index ix ON t.oid = ix.indrelid
LEFT JOIN pg_class i ON i.oid = ix.indexrelid
WHERE t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND t.relkind = 'r'
GROUP BY t.relname, t.oid
ORDER BY pg_total_relation_size(t.oid) DESC;

-- ============================================================================
-- PART 7: MISSING INDEXES DETECTION
-- ============================================================================

-- Find frequently-scanned sequential scans (candidates for new indexes)
SELECT
  schemaname,
  tablename,
  seq_scan AS sequential_scans,
  seq_tup_read AS tuples_read_in_seq_scans,
  idx_scan AS index_scans,
  CASE WHEN seq_scan > idx_scan * 10 THEN 'CONSIDER_INDEX' ELSE 'OK' END AS action
FROM pg_stat_user_tables
WHERE schemaname = 'public'
AND seq_scan > 100
ORDER BY seq_scan DESC;

-- ============================================================================
-- PART 8: GIN INDEX VALIDATION (for JSONB queries)
-- ============================================================================

-- GIN index configuration check
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_indexes
WHERE schemaname = 'public'
AND indexdef LIKE '%GIN%'
ORDER BY tablename;

-- JSONB column check (should have GIN indexes)
SELECT
  t.table_name,
  c.column_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = t.table_name
    AND indexdef LIKE '%GIN%'
    AND indexdef LIKE CONCAT('%', c.column_name, '%')
  ) THEN 'HAS_GIN' ELSE 'MISSING_GIN' END AS gin_status
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
AND c.data_type = 'jsonb'
ORDER BY t.table_name, c.column_name;

-- ============================================================================
-- PART 9: INDEX MAINTENANCE RECOMMENDATIONS
-- ============================================================================

-- Indexes that need maintenance
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS current_size,
  CASE
    WHEN pg_relation_size(indexrelid) > 100000000 THEN 'REINDEX (>100MB)'
    WHEN ROUND(100.0 * (pg_relation_size(indexrelid) - pg_relation_size(indexrelid, 'main')) 
      / NULLIF(pg_relation_size(indexrelid), 0), 2) > 20 THEN 'REINDEX (bloat >20%)'
    WHEN EXISTS (
      SELECT 1 FROM pg_stat_user_indexes
      WHERE indexrelname = indexname AND idx_scan = 0
    ) THEN 'CONSIDER_DROP (unused)'
    ELSE 'OK'
  END AS maintenance_action
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname NOT LIKE '%_pkey'
ORDER BY tablename, indexname;

-- ============================================================================
-- PART 10: INDEX DEFINITION AUDIT
-- ============================================================================

-- Export all index definitions for documentation
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================================================
-- PERFORMANCE VALIDATION QUERIES
-- ============================================================================

-- Test: Point lookup (should use index)
EXPLAIN ANALYZE
SELECT * FROM organizations WHERE slug = 'techcorp';

-- Test: Range query on timestamp (should use index)
EXPLAIN ANALYZE
SELECT id, created_at FROM users
WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
ORDER BY created_at DESC LIMIT 100;

-- Test: Join with index usage
EXPLAIN ANALYZE
SELECT o.name, t.name, COUNT(tm.user_id) as members
FROM organizations o
JOIN teams t ON o.id = t.org_id
LEFT JOIN team_members tm ON t.id = tm.team_id
WHERE o.id = '550e8400-e29b-41d4-a716-446655440000'
GROUP BY o.id, o.name, t.id, t.name;

-- Test: JSONB index usage
EXPLAIN ANALYZE
SELECT * FROM scan_results
WHERE details @> '{"risk_level": "high"}'
LIMIT 50;

-- Test: Aggregate query
EXPLAIN ANALYZE
SELECT severity, COUNT(*) as count
FROM scan_results
WHERE created_at > CURRENT_DATE - INTERVAL '7 days'
GROUP BY severity;
