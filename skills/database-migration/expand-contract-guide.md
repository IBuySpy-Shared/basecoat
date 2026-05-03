# Expand-Contract Pattern Guide

The expand-contract (also called parallel-change) pattern allows breaking schema changes to be deployed without downtime by splitting the change across multiple releases.

## When to Use

- Renaming a column or table
- Changing a column's data type
- Splitting or merging columns
- Moving data from one table to another
- Any change that would break existing application code if applied atomically

## The Three Phases

### Phase 1: Expand

Add the new structure alongside the old. The old structure is unchanged.

```sql
-- Add new column (backward-compatible addition)
ALTER TABLE orders ADD COLUMN customer_reference VARCHAR(100);

-- Populate new column from old column
UPDATE orders SET customer_reference = customer_id::VARCHAR
WHERE customer_reference IS NULL;
```

**Application changes in this release:**
- Write to both old and new columns/tables
- Read from the old column only (safe fallback)

**Deploy and verify**: Both columns coexist. Existing application code is unaffected.

### Phase 2: Migrate

All application code switches to the new structure. The old structure is still present as a safety net.

```sql
-- Backfill any remaining rows missed between Phase 1 deploy and Phase 2 deploy
UPDATE orders SET customer_reference = customer_id::VARCHAR
WHERE customer_reference IS NULL;
```

**Application changes in this release:**
- Read from the new column
- Still write to both columns during the transition window

**Deploy and verify**: All reads use the new column. Confirm no errors in application logs.

### Phase 3: Contract

Remove the old structure once all application versions reading from it have been retired.

```sql
-- Safe to drop only after all app instances use the new column
ALTER TABLE orders DROP COLUMN customer_id;
```

**Application changes in this release:**
- Remove all writes to the old column

**Deploy and verify**: Old column gone. Monitor for any unexpected errors.

## Phase Timeline

| Phase | Release | Schema State | App Reads | App Writes |
|---|---|---|---|---|
| Expand | v1.5.0 | old + new columns | old | old + new |
| Migrate | v1.6.0 | old + new columns | new | old + new |
| Contract | v1.7.0 | new column only | new | new only |

Minimum one sprint between each phase is recommended. Never rush to Phase 3.

## Column Rename Checklist

- [ ] Phase 1 — new column added, backfill applied, dual-write in application
- [ ] Phase 1 — deployed to all environments, no errors for ≥ 24 h
- [ ] Phase 2 — all reads switched to new column
- [ ] Phase 2 — deployed and monitored for ≥ 24 h
- [ ] Phase 3 — old column removed
- [ ] Phase 3 — search codebase for any remaining references to old column name
- [ ] Documentation and schema diagrams updated

## Blue-Green Database Deployment

Use blue-green when a full environment swap with instant rollback is required.

```
[Load Balancer]
      │
      ├──► [Blue DB] (current production)
      │
      └──► [Green DB] (new version — receives replicated writes)
```

Steps:

1. Provision the green database with the new schema.
2. Replicate data from blue to green continuously (CDC or log shipping).
3. Run validation suite against green while blue handles traffic.
4. Switch load balancer to green (seconds of cutover).
5. Monitor green for 30–60 min.
6. Keep blue in read-only standby for the rollback window (typically 24 h).
7. Decommission blue after rollback window closes.

## Common Mistakes to Avoid

| Mistake | Risk | Prevention |
|---|---|---|
| Skipping Phase 2 validation | Silent data loss if reads switch before backfill | Verify null counts before deploying Phase 2 |
| Rushing Phase 3 | Breaking older app versions still in production | Confirm all instances updated before Phase 3 |
| No rollback tested | Cannot recover if Phase 3 causes errors | Test rollback in staging before Phase 3 deploy |
| Large table backfill in-transaction | Table lock, replication lag | Use batched backfill outside transaction |
