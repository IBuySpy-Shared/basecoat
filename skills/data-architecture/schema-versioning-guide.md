# Schema Versioning Guide (Flyway / Liquibase)

A reference for applying database schema changes as versioned, auditable migrations using Flyway or Liquibase.

## Naming Conventions

### Flyway

```
V<version>__<description>.sql          # Versioned migration (forward only)
U<version>__<description>.sql          # Undo migration (Flyway Teams)
R__<description>.sql                   # Repeatable migration (views, stored procs)
```

Examples:

```
V1__create_users_table.sql
V2__add_email_index.sql
V3__add_order_status_column.sql
U3__remove_order_status_column.sql
R__vw_active_users.sql
```

### Liquibase

```
changelog/<version>-<description>.sql  # SQL-format changesets
changelog/<version>-<description>.xml  # XML-format changesets
```

Every changeset must include `id`, `author`, and `comment` attributes.

## Migration File Template (Flyway SQL)

```sql
-- Migration: V<version>__<description>.sql
-- Author: <name>
-- Date: <YYYY-MM-DD>
-- Description: <one-line description of the change>
-- Rollback: <how to reverse — or link to undo script>

-- ============================================================
-- Forward migration
-- ============================================================

<DDL or DML statements here>

-- ============================================================
-- Validation query (run manually to confirm success)
-- ============================================================
-- SELECT COUNT(*) FROM information_schema.columns
-- WHERE table_name = '<table>' AND column_name = '<col>';
```

## CI Integration

```yaml
# GitHub Actions — run migrations on PR and deploy
name: Schema Migration

on:
  push:
    paths:
      - 'db/migrations/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Flyway migrations (dry-run)
        run: |
          flyway \
            -url="${{ secrets.DB_URL }}" \
            -user="${{ secrets.DB_USER }}" \
            -password="${{ secrets.DB_PASSWORD }}" \
            -locations=filesystem:db/migrations \
            migrate -dryRunOutput=/tmp/dryrun.sql

      - name: Run Flyway migrations (apply)
        if: github.ref == 'refs/heads/main'
        run: |
          flyway \
            -url="${{ secrets.DB_URL }}" \
            -user="${{ secrets.DB_USER }}" \
            -password="${{ secrets.DB_PASSWORD }}" \
            -locations=filesystem:db/migrations \
            migrate
```

## Rollback Strategy

| Scenario | Approach |
|---|---|
| Additive change (new column, new table) | Deploy new migration to remove addition |
| Data transformation | Prepare a compensating migration with the inverse transform |
| Breaking change (drop column/table) | Use expand-contract pattern — never drop before all code migrated |
| Flyway Teams | Use `U<version>__undo.sql` undo scripts |
| Emergency | Restore from pre-migration database snapshot |

## Expand-Contract Pattern

For zero-downtime schema changes:

1. **Expand** — add the new column or table. Keep the old structure.
2. **Migrate** — backfill existing data, update application to write to both.
3. **Contract** — once all application versions use the new structure, remove the old.

Each phase is a separate migration file deployed independently across releases.

## Checklist Before Applying a Migration

- [ ] Migration script reviewed by a second team member
- [ ] Tested against a staging environment with production-sized data
- [ ] Row counts and spot checks documented
- [ ] Rollback script prepared and tested
- [ ] Maintenance window communicated (for breaking or large-table changes)
- [ ] Monitoring in place to detect anomalies after apply
