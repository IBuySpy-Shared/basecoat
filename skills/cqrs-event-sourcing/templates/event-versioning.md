# Event Versioning — [Service or Bounded Context Name]

> Track event schema versions, evolution strategy, and consumer impact. Replace bracketed placeholders.

## Overview

| Field | Value |
|---|---|
| **Bounded Context** | [Context name] |
| **Date** | [YYYY-MM-DD] |
| **Author(s)** | [Names or team] |

---

## Event Schema Registry

> One section per event type. Add new versions as rows within each section.

### [EventType — e.g., OrderCreated]

| Version | Status | Introduced | Deprecated | Removed | Notes |
|---|---|---|---|---|---|
| v1 | Active | [Date] | — | — | Initial schema |
| v2 | Active | [Date] | — | — | Added `discountCode` (optional, nullable) |
| v1 | Deprecated | [Date] | [Date] | [Date] | Upcasted to v2 on read |

#### v1 Schema

```json
{
  "orderId": "string (UUID)",
  "customerId": "string (UUID)",
  "totalPrice": "number",
  "currency": "string (ISO 4217)",
  "occurredAt": "string (ISO 8601)"
}
```

#### v2 Schema

```json
{
  "orderId": "string (UUID)",
  "customerId": "string (UUID)",
  "totalPrice": "number",
  "currency": "string (ISO 4217)",
  "discountCode": "string | null",
  "occurredAt": "string (ISO 8601)"
}
```

**Migration strategy:** Upcast — when loading a v1 event, set `discountCode: null`.

---

### [AnotherEventType]

| Version | Status | Introduced | Deprecated | Removed | Notes |
|---|---|---|---|---|---|
| v1 | Active | [Date] | — | — | Initial schema |

---

## Versioning Strategies

### Upcasting (Preferred for Non-Breaking Changes)

Apply when: adding an optional field, renaming a field without removing it, or adding a new event type.

```
Stored Event (v1) → Upcast Function → In-Memory Event (v2)
```

- Implement an upcaster that transforms v1 events to v2 at read time.
- The aggregate and projections always see the latest version.
- The event store retains v1 events unchanged — history is preserved.
- No migration tooling required.

### Version Fork (Required for Breaking Changes)

Apply when: removing a field, changing a field's type, or changing the semantic meaning.

```
New commands → Write v2 events
Old v1 events remain in store → handled by v1 handler
v2 events → handled by v2 handler
```

- Both event versions coexist in the store.
- Projections must handle both versions until all v1 events have been retired.
- Remove v1 handling only after all v1 events have aged out of the retention window.

---

## Consumer Impact Matrix

> Track which projections and external consumers are affected by each version change.

| Event Type | Version Change | Affected Projections | Affected External Consumers | Coordination Required | Migration Deadline |
|---|---|---|---|---|---|
| `OrderCreated` | v1 → v2 (add `discountCode`) | `OrderSummaryProjection` | Payment context | No (additive) | — |
| `[EventType]` | [v1 → v2] | [Projections] | [Consumers] | [Yes/No] | [Date] |

---

## Safe vs. Breaking Change Reference

| Change Type | Safe? | Strategy |
|---|---|---|
| Add new optional field with default | ✅ Safe | Upcast |
| Add new event type | ✅ Safe | No migration needed |
| Rename field (keeping old field) | ✅ Safe | Upcast; populate both fields during transition |
| Remove field | ❌ Breaking | Version fork |
| Rename field (removing old field) | ❌ Breaking | Version fork |
| Change field type | ❌ Breaking | Version fork |
| Change semantic meaning of field | ❌ Breaking | Version fork + rename |
| Reorder fields (JSON) | ✅ Safe | No migration (if schema-agnostic deserialization) |

---

## Event Retirement Checklist

When retiring an old event version:

- [ ] All events of the old version are beyond the retention window
- [ ] No active projections subscribe to the old version
- [ ] No external consumers subscribe to the old version (confirmed via consumer registry)
- [ ] Upcast or version-fork handler removed from codebase
- [ ] Schema registry entry updated to `Removed` status
- [ ] Retirement recorded in this document with date

---

## Revision History

| Date | Author | Change |
|---|---|---|
| [YYYY-MM-DD] | [Name] | Initial draft |
