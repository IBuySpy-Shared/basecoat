# ACID Review Checklist

**Reviewer:**
**Date:**
**Service / Component:**

## Scoring Key

- ✅ Pass — property is satisfied
- ❌ Fail (Critical) — blocking; multi-step writes have no rollback path
- ⚠️ Fail (High) — significant integrity risk
- N/A — not applicable

---

## Atomicity

| ID | Check | Status | Notes |
|---|---|---|---|
| A-1 | Every multi-step write executes within a database transaction (local ACID) or a saga with compensating transactions (distributed) | | |
| A-2 | Partial write failures trigger full rollback with no orphaned state | | |
| A-3 | Event-driven flows have compensating event definitions for each failure point | | |
| A-4 | Retry logic does not re-execute already-completed steps without idempotency protection | | |

## Consistency

| ID | Check | Status | Notes |
|---|---|---|---|
| C-1 | All foreign key, unique, and check constraints are enforced at commit time | | |
| C-2 | Application-level invariants (e.g., no negative balance) are validated before commit | | |
| C-3 | Deferred constraint checks do not allow invalid states to exist between statements in the same transaction | | |
| C-4 | Schema migrations enforce constraints on both old and new data before removing old paths | | |

## Isolation

| ID | Check | Status | Notes |
|---|---|---|---|
| I-1 | The isolation level is explicitly set per transaction — not relying on the database default | | |
| I-2 | `READ COMMITTED` is used for most OLTP transactions | | |
| I-3 | High-contention writes use `SELECT FOR UPDATE` or optimistic locking with a version field | | |
| I-4 | `SERIALIZABLE` or `REPEATABLE READ` is justified in comments where used (performance impact acknowledged) | | |
| I-5 | N+1 and phantom-read risks are documented for any `REPEATABLE READ` transaction | | |

## Durability

| ID | Check | Status | Notes |
|---|---|---|---|
| D-1 | `fsync` is enabled on all primary database nodes | | |
| D-2 | WAL / binlog archival is enabled and gap-free | | |
| D-3 | Write acknowledgement requires at least N/2+1 replicas to confirm (for replicated databases) | | |
| D-4 | Application does not cache or queue writes in a way that could silently lose them on restart | | |

## Distributed Transaction Patterns

| ID | Check | Status | Notes |
|---|---|---|---|
| DT-1 | 2PC (two-phase commit) is only used with a recovery coordinator — not as fire-and-forget | | |
| DT-2 | Sagas define an explicit compensating transaction for every forward step | | |
| DT-3 | Outbox pattern is used to reliably publish events after a local commit | | |
| DT-4 | CDC consumers are idempotent and handle duplicate events without side effects | | |

## Summary

| Property | Pass | Fail | N/A |
|---|---|---|---|
| Atomicity | | | |
| Consistency | | | |
| Isolation | | | |
| Durability | | | |
| Distributed | | | |

## Critical Findings

| ID | Description | Recommended Fix | Owner |
|---|---|---|---|
| | | | |
