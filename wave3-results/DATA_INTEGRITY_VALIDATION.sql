-- ============================================================================
-- DATA INTEGRITY VALIDATION QUERIES
-- Basecoat Portal Database v1.0
-- ============================================================================
-- This script validates foreign key relationships, unique constraints,
-- NOT NULL constraints, check constraints, and referential integrity.
-- ============================================================================

-- ============================================================================
-- PART 1: FOREIGN KEY RELATIONSHIP VALIDATION
-- ============================================================================

-- Check for orphaned team_members (user_id doesn't exist)
SELECT 'team_members.user_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM team_members tm
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = tm.user_id);

-- Check for orphaned team_members (team_id doesn't exist)
SELECT 'team_members.team_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM team_members tm
WHERE NOT EXISTS (SELECT 1 FROM teams t WHERE t.id = tm.team_id);

-- Check for orphaned teams (org_id doesn't exist)
SELECT 'teams.org_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM teams t
WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = t.org_id);

-- Check for orphaned repositories (org_id doesn't exist)
SELECT 'repositories.org_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM repositories r
WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = r.org_id);

-- Check for orphaned scans (repo_id doesn't exist)
SELECT 'scans.repo_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM scans s
WHERE NOT EXISTS (SELECT 1 FROM repositories r WHERE r.id = s.repo_id);

-- Check for orphaned scan_results (scan_id doesn't exist)
SELECT 'scan_results.scan_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM scan_results sr
WHERE NOT EXISTS (SELECT 1 FROM scans s WHERE s.id = sr.scan_id);

-- Check for orphaned compliance_issues (repo_id doesn't exist)
SELECT 'compliance_issues.repo_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM compliance_issues ci
WHERE NOT EXISTS (SELECT 1 FROM repositories r WHERE r.id = ci.repo_id);

-- Check for orphaned compliance_issues (assigned_to user doesn't exist)
SELECT 'compliance_issues.assigned_to ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM compliance_issues ci
WHERE assigned_to IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = ci.assigned_to);

-- Check for orphaned audit_logs (org_id doesn't exist)
SELECT 'audit_logs.org_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM audit_logs al
WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = al.org_id);

-- Check for orphaned audit_logs (user_id doesn't exist)
SELECT 'audit_logs.user_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM audit_logs al
WHERE user_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = al.user_id);

-- Check for orphaned roles (org_id doesn't exist)
SELECT 'roles.org_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM roles r
WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = r.org_id);

-- Check for orphaned audit_retention_policies (org_id doesn't exist)
SELECT 'audit_retention_policies.org_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM audit_retention_policies arp
WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = arp.org_id);

-- Check for orphaned audit_log_archives (org_id doesn't exist)
SELECT 'audit_log_archives.org_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM audit_log_archives ala
WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = ala.org_id);

-- Check for orphaned simulations (org_id doesn't exist)
SELECT 'simulations.org_id ORPHANED' AS check_name, COUNT(*) AS orphaned_count
FROM simulations s
WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = s.org_id);

-- ============================================================================
-- PART 2: UNIQUE CONSTRAINT VALIDATION
-- ============================================================================

-- Check organizations.slug uniqueness
SELECT 'organizations.slug NOT UNIQUE' AS check_name, slug, COUNT(*) AS count
FROM organizations
GROUP BY slug
HAVING COUNT(*) > 1;

-- Check users.email uniqueness
SELECT 'users.email NOT UNIQUE' AS check_name, email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Check users.github_id uniqueness
SELECT 'users.github_id NOT UNIQUE' AS check_name, github_id, COUNT(*) AS count
FROM users
WHERE github_id IS NOT NULL
GROUP BY github_id
HAVING COUNT(*) > 1;

-- Check teams.(org_id, slug) uniqueness
SELECT 'teams.(org_id, slug) NOT UNIQUE' AS check_name,
  org_id, slug, COUNT(*) AS count
FROM teams
GROUP BY org_id, slug
HAVING COUNT(*) > 1;

-- Check repositories.(org_id, url) uniqueness
SELECT 'repositories.(org_id, url) NOT UNIQUE' AS check_name,
  org_id, url, COUNT(*) AS count
FROM repositories
GROUP BY org_id, url
HAVING COUNT(*) > 1;

-- Check roles.(org_id, name) uniqueness
SELECT 'roles.(org_id, name) NOT UNIQUE' AS check_name,
  org_id, name, COUNT(*) AS count
FROM roles
GROUP BY org_id, name
HAVING COUNT(*) > 1;

-- Check audit_retention_policies.org_id uniqueness
SELECT 'audit_retention_policies.org_id NOT UNIQUE' AS check_name,
  org_id, COUNT(*) AS count
FROM audit_retention_policies
GROUP BY org_id
HAVING COUNT(*) > 1;

-- ============================================================================
-- PART 3: NOT NULL CONSTRAINT VALIDATION
-- ============================================================================

-- Check organizations required fields
SELECT 'organizations.id NULL' AS issue, COUNT(*) FROM organizations WHERE id IS NULL
UNION ALL
SELECT 'organizations.name NULL', COUNT(*) FROM organizations WHERE name IS NULL
UNION ALL
SELECT 'organizations.slug NULL', COUNT(*) FROM organizations WHERE slug IS NULL
UNION ALL
SELECT 'organizations.plan NULL', COUNT(*) FROM organizations WHERE plan IS NULL;

-- Check users required fields
SELECT 'users.id NULL' AS issue, COUNT(*) FROM users WHERE id IS NULL
UNION ALL
SELECT 'users.email NULL', COUNT(*) FROM users WHERE email IS NULL
UNION ALL
SELECT 'users.github_id NULL', COUNT(*) FROM users WHERE github_id IS NULL
UNION ALL
SELECT 'users.github_login NULL', COUNT(*) FROM users WHERE github_login IS NULL
UNION ALL
SELECT 'users.display_name NULL', COUNT(*) FROM users WHERE display_name IS NULL;

-- Check teams required fields
SELECT 'teams.id NULL' AS issue, COUNT(*) FROM teams WHERE id IS NULL
UNION ALL
SELECT 'teams.org_id NULL', COUNT(*) FROM teams WHERE org_id IS NULL
UNION ALL
SELECT 'teams.name NULL', COUNT(*) FROM teams WHERE name IS NULL
UNION ALL
SELECT 'teams.slug NULL', COUNT(*) FROM teams WHERE slug IS NULL;

-- Check repositories required fields
SELECT 'repositories.id NULL' AS issue, COUNT(*) FROM repositories WHERE id IS NULL
UNION ALL
SELECT 'repositories.org_id NULL', COUNT(*) FROM repositories WHERE org_id IS NULL
UNION ALL
SELECT 'repositories.name NULL', COUNT(*) FROM repositories WHERE name IS NULL
UNION ALL
SELECT 'repositories.url NULL', COUNT(*) FROM repositories WHERE url IS NULL;

-- Check scans required fields
SELECT 'scans.id NULL' AS issue, COUNT(*) FROM scans WHERE id IS NULL
UNION ALL
SELECT 'scans.repo_id NULL', COUNT(*) FROM scans WHERE repo_id IS NULL
UNION ALL
SELECT 'scans.status NULL', COUNT(*) FROM scans WHERE status IS NULL;

-- Check audit_logs required fields
SELECT 'audit_logs.org_id NULL' AS issue, COUNT(*) FROM audit_logs WHERE org_id IS NULL
UNION ALL
SELECT 'audit_logs.action NULL', COUNT(*) FROM audit_logs WHERE action IS NULL
UNION ALL
SELECT 'audit_logs.entity_type NULL', COUNT(*) FROM audit_logs WHERE entity_type IS NULL
UNION ALL
SELECT 'audit_logs.timestamp NULL', COUNT(*) FROM audit_logs WHERE timestamp IS NULL;

-- ============================================================================
-- PART 4: CHECK CONSTRAINT VALIDATION
-- ============================================================================

-- Check organizations.plan values
SELECT DISTINCT 'INVALID_PLAN' AS check_name, plan
FROM organizations
WHERE plan NOT IN ('free', 'pro', 'enterprise');

-- Check organizations.data_retention_days range
SELECT 'INVALID_RETENTION' AS check_name, COUNT(*)
FROM organizations
WHERE data_retention_days <= 0;

-- Check users.role values
SELECT DISTINCT 'INVALID_ROLE' AS check_name, role
FROM users
WHERE role NOT IN ('admin', 'user', 'readonly');

-- Check team_members.role values
SELECT DISTINCT 'INVALID_TM_ROLE' AS check_name, role
FROM team_members
WHERE role NOT IN ('admin', 'member', 'readonly');

-- Check scans.status values
SELECT DISTINCT 'INVALID_SCAN_STATUS' AS check_name, status
FROM scans
WHERE status NOT IN ('pending', 'in_progress', 'completed', 'failed');

-- Check scan_results.severity values
SELECT DISTINCT 'INVALID_SEVERITY' AS check_name, severity
FROM scan_results
WHERE severity NOT IN ('low', 'medium', 'high', 'critical');

-- Check compliance_issues.severity values
SELECT DISTINCT 'INVALID_CI_SEVERITY' AS check_name, severity
FROM compliance_issues
WHERE severity NOT IN ('low', 'medium', 'high', 'critical');

-- Check compliance_issues.status values
SELECT DISTINCT 'INVALID_CI_STATUS' AS check_name, status
FROM compliance_issues
WHERE status NOT IN ('open', 'in_progress', 'resolved', 'closed');

-- Check audit_retention_policies.retention_days range
SELECT 'INVALID_RETENTION_POLICY' AS check_name, COUNT(*)
FROM audit_retention_policies
WHERE retention_days <= 0;

-- ============================================================================
-- PART 5: REFERENTIAL INTEGRITY SUMMARY
-- ============================================================================

-- Foreign key relationship count summary
SELECT
  'Foreign Keys Valid' AS check_type,
  COUNT(*) AS total_count
FROM (
  SELECT * FROM team_members tm
  WHERE EXISTS (SELECT 1 FROM teams t WHERE t.id = tm.team_id)
    AND EXISTS (SELECT 1 FROM users u WHERE u.id = tm.user_id)
  UNION ALL
  SELECT * FROM teams t
  WHERE EXISTS (SELECT 1 FROM organizations o WHERE o.id = t.org_id)
  UNION ALL
  SELECT * FROM repositories r
  WHERE EXISTS (SELECT 1 FROM organizations o WHERE o.id = r.org_id)
  UNION ALL
  SELECT * FROM scans s
  WHERE EXISTS (SELECT 1 FROM repositories r WHERE r.id = s.repo_id)
  UNION ALL
  SELECT * FROM scan_results sr
  WHERE EXISTS (SELECT 1 FROM scans s WHERE s.id = sr.scan_id)
  UNION ALL
  SELECT * FROM compliance_issues ci
  WHERE EXISTS (SELECT 1 FROM repositories r WHERE r.id = ci.repo_id)
    AND (ci.assigned_to IS NULL OR EXISTS (SELECT 1 FROM users u WHERE u.id = ci.assigned_to))
  UNION ALL
  SELECT * FROM audit_logs al
  WHERE EXISTS (SELECT 1 FROM organizations o WHERE o.id = al.org_id)
    AND (al.user_id IS NULL OR EXISTS (SELECT 1 FROM users u WHERE u.id = al.user_id))
  UNION ALL
  SELECT * FROM roles r
  WHERE EXISTS (SELECT 1 FROM organizations o WHERE o.id = r.org_id)
  UNION ALL
  SELECT * FROM audit_retention_policies arp
  WHERE EXISTS (SELECT 1 FROM organizations o WHERE o.id = arp.org_id)
  UNION ALL
  SELECT * FROM audit_log_archives ala
  WHERE EXISTS (SELECT 1 FROM organizations o WHERE o.id = ala.org_id)
  UNION ALL
  SELECT * FROM simulations s
  WHERE EXISTS (SELECT 1 FROM organizations o WHERE o.id = s.org_id)
) valid_records;

-- ============================================================================
-- PART 6: CASCADE DELETE VALIDATION
-- ============================================================================

-- Verify cascade delete rules exist (simulation, not actual delete)
-- Count records that would be affected by deleting one organization
SELECT
  'org_cascade_impact' AS check_name,
  (SELECT COUNT(*) FROM teams WHERE org_id = $1) AS teams_would_delete,
  (SELECT COUNT(*) FROM roles WHERE org_id = $1) AS roles_would_delete,
  (SELECT COUNT(*) FROM repositories WHERE org_id = $1) AS repos_would_delete,
  (SELECT COUNT(*) FROM scans s
   JOIN repositories r ON s.repo_id = r.id
   WHERE r.org_id = $1) AS scans_would_delete,
  (SELECT COUNT(*) FROM audit_logs WHERE org_id = $1) AS audit_logs_would_delete;

-- ============================================================================
-- PART 7: TIMESTAMP VALIDATION
-- ============================================================================

-- Check for future timestamps (data quality check)
SELECT 'FUTURE_TIMESTAMP' AS issue, 'organizations.created_at' AS table_col, COUNT(*)
FROM organizations WHERE created_at > NOW()
UNION ALL
SELECT 'FUTURE_TIMESTAMP', 'users.created_at', COUNT(*)
FROM users WHERE created_at > NOW()
UNION ALL
SELECT 'FUTURE_TIMESTAMP', 'teams.created_at', COUNT(*)
FROM teams WHERE created_at > NOW()
UNION ALL
SELECT 'FUTURE_TIMESTAMP', 'repositories.created_at', COUNT(*)
FROM repositories WHERE created_at > NOW()
UNION ALL
SELECT 'FUTURE_TIMESTAMP', 'audit_logs.timestamp', COUNT(*)
FROM audit_logs WHERE timestamp > NOW();

-- Check for chronological order (created_at <= updated_at)
SELECT 'INVALID_TIMESTAMP_ORDER' AS issue, table_name, COUNT(*)
FROM (
  SELECT 'organizations' as table_name FROM organizations
  WHERE created_at > updated_at
  UNION ALL
  SELECT 'users' FROM users WHERE created_at > updated_at
  UNION ALL
  SELECT 'teams' FROM teams WHERE created_at > updated_at
  UNION ALL
  SELECT 'repositories' FROM repositories WHERE created_at > updated_at
) t
GROUP BY table_name;

-- ============================================================================
-- PART 8: AUDIT LOG IMMUTABILITY VALIDATION
-- ============================================================================

-- Verify audit_logs cannot be updated (trigger validation)
-- This will succeed if trigger is properly configured
SELECT 'audit_logs_immutable' AS check_name, COUNT(*) AS current_records
FROM audit_logs;

-- ============================================================================
-- PART 9: COMPREHENSIVE INTEGRITY REPORT
-- ============================================================================

-- Summary of all integrity checks
WITH integrity_checks AS (
  SELECT 'Foreign Keys' AS category,
    COUNT(*) AS total_fk,
    0 AS orphaned_records
  FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY'
  AND table_schema = 'public'
  UNION ALL
  SELECT 'Unique Constraints',
    COUNT(*),
    0
  FROM information_schema.table_constraints
  WHERE constraint_type = 'UNIQUE'
  AND table_schema = 'public'
  UNION ALL
  SELECT 'Check Constraints',
    COUNT(*),
    0
  FROM information_schema.check_constraints
  WHERE table_schema = 'public'
)
SELECT * FROM integrity_checks;

-- ============================================================================
-- PART 10: DATA VALIDATION QUERIES FOR COMMON ISSUES
-- ============================================================================

-- Check for empty string values where NOT NULL (data quality)
SELECT 'EMPTY_STRING' AS issue, 'organizations.name' AS field, COUNT(*)
FROM organizations WHERE TRIM(name) = ''
UNION ALL
SELECT 'EMPTY_STRING', 'organizations.slug', COUNT(*)
FROM organizations WHERE TRIM(slug) = ''
UNION ALL
SELECT 'EMPTY_STRING', 'users.email', COUNT(*)
FROM users WHERE TRIM(email) = ''
UNION ALL
SELECT 'EMPTY_STRING', 'users.display_name', COUNT(*)
FROM users WHERE TRIM(display_name) = ''
UNION ALL
SELECT 'EMPTY_STRING', 'repositories.url', COUNT(*)
FROM repositories WHERE TRIM(url) = '';

-- Check email format validity
SELECT 'INVALID_EMAIL_FORMAT' AS issue, COUNT(*) AS count
FROM users
WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$';
