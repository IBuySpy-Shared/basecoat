# Conflict Resolution Pattern Template

## Service / Data Domain

- **Service:**
- **Data domain:**
- **Reviewed by:**
- **Date:**

---

## Conflict Scenario

_Describe the specific write conflict scenario this pattern is designed to resolve._

**Scenario:** Two concurrent writes update the same record from different nodes/services. Which write wins and why?

---

## Pattern Selected

**Pattern:** < Last-Write-Wins (LWW) | MVCC | CRDT | Optimistic Locking | Application-Merge >

**Justification:**

_State why this pattern is appropriate for the data domain's semantics._

---

## Pattern Details

### Last-Write-Wins (LWW)

| Parameter | Value |
|---|---|
| Timestamp source | < database server clock | logical clock | vector clock > |
| Clock skew risk | < acknowledged and acceptable | mitigated by NTP / Hybrid Logical Clocks > |
| Silent data loss acceptable? | Yes / No — if No, use a different pattern |

### CRDT (if selected)

| Parameter | Value |
|---|---|
| CRDT type | < G-Counter | PN-Counter | OR-Set | LWW-Element-Set | other > |
| Convergence proof | < link to reference or library > |
| Data types supported | < limited to CRDT-compatible types > |

### Optimistic Locking (if selected)

| Parameter | Value |
|---|---|
| Version field name | `version` / `etag` / `updated_at` |
| Conflict response | < 409 Conflict — client retries > |
| Max retry attempts | N |
| Retry backoff | < exponential / linear > |

### Application-Merge (if selected)

| Parameter | Value |
|---|---|
| Merge function location | < service layer / database trigger / CDC consumer > |
| Merge logic description | |
| Edge cases tested | < list tested scenarios > |

---

## Conflict Detection and Observability

- [ ] Conflict events emit a metric (`conflict_count` by entity type)
- [ ] Dashboard tracks conflict rate and alerts on unexpected spikes
- [ ] Conflict log captures both pre-merge values for audit purposes

---

## Test Plan

| Scenario | Expected Behavior | Tested? |
|---|---|---|
| Concurrent writes from two clients | < pattern-specific resolution > | Yes / No |
| Write during network partition | < expected convergence behavior > | Yes / No |
| High-frequency concurrent writes | < no data corruption or lock contention > | Yes / No |

---

## Validation

- [ ] Conflict resolution logic is covered by unit tests with deterministic scenarios
- [ ] Integration test exercises concurrent writes under realistic load
- [ ] No silent data loss occurs for the selected pattern in any tested scenario
