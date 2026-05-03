---
name: cqrs-event-sourcing
description: "Use when implementing CQRS, event sourcing, event stores, projections, or event versioning. Covers command/query separation, event store design, read model projections, snapshot patterns, and event schema evolution."
---

# CQRS and Event Sourcing Skill

Use this skill when the task involves separating read and write models, storing state as an immutable event log, building read model projections, or managing event schema evolution.

## When to Use

- Separating command processing from query handling (CQRS)
- Designing an event store for an event-sourced aggregate
- Building read model projections from an event stream
- Evolving event schemas without breaking existing consumers
- Adding snapshot support to avoid replaying long event histories
- Designing a projection rebuild or catch-up strategy

## Workflow

1. **Confirm CQRS/ES is warranted** — verify that the use case has divergent read/write load, complex audit requirements, or temporal query needs. Do not apply CQRS/ES by default.
2. **Define commands and queries** — list all commands (state-changing intent) and queries (read-only). Use `templates/command-query-separation.md`.
3. **Design the event store** — specify event schema, partitioning, ordering guarantees, and storage backend. Use `templates/event-store-design.md`.
4. **Design projections** — for each read model, define the events it subscribes to, its schema, and its rebuild strategy. Use `templates/projection-template.md`.
5. **Plan event versioning** — define upcasting or version-forking strategy for schema evolution. Use `templates/event-versioning.md`.
6. **Define snapshot policy** — decide when to snapshot (e.g., every N events) and what the snapshot schema contains.
7. **Plan consistency model** — identify which queries require strong consistency and whether they must read from the write store directly.
8. **File issues for discovered gaps** — do not defer. See GitHub Issue Filing section.

## CQRS Separation Rules

| Concern | Write Side (Commands) | Read Side (Queries) |
|---|---|---|
| Input | Command object with intent | Query object with filter/paging |
| Handler | Loads aggregate, validates, raises events | Queries a read model (denormalized store) |
| Output | Domain events; no return data | DTO or read model record |
| Persistence | Event store (append-only) | Read store (relational, document, search) |
| Consistency | Immediate (within aggregate) | Eventually consistent |
| Scaling | Independently scalable | Independently scalable |

**Strict separation rules:**

- A command handler must never return data beyond an acknowledgement or correlation ID.
- A query handler must never mutate state.
- Commands and queries share no application service classes.

## Event Sourcing Patterns

### Aggregate Reconstitution

1. Load all events for the aggregate ID from the event store (or load the latest snapshot + subsequent events).
2. Apply each event to the aggregate's state using an `Apply(event)` method.
3. The aggregate root exposes only the post-reconstitution state — never the raw event list.

### Snapshot Strategy

- Take a snapshot after every N events (typical range: 50–200).
- Store snapshots in a separate table or stream alongside version numbers.
- On reconstitution: load the latest snapshot, then replay only events with version > snapshot version.

### Optimistic Concurrency

- Include an `expectedVersion` on every write command.
- Reject writes where `expectedVersion` does not match the current aggregate version.
- Expose a conflict resolution strategy (retry with reload, or surface to user).

## Event Store Design Principles

- Events are **immutable**. Never update or delete an event.
- Each event carries: `aggregateId`, `aggregateType`, `eventType`, `eventVersion`, `sequenceNumber`, `occurredAt`, `causationId`, `correlationId`, and `payload`.
- Use **per-aggregate streams** as the primary partition key. Global ordering across aggregates is not guaranteed.
- Event store writes must be **atomic within a stream** — either all events in a command are appended or none are.
- Support at-least-once delivery to projection consumers. Projections must be idempotent.

## Projection Design

- Each projection subscribes to one or more event types.
- Projections are rebuilt from scratch by replaying the event store. Design them to be rebuildable.
- Track the last processed event position (checkpoint) durably. Resume from checkpoint on restart.
- Separate projection rebuild from live event processing. Use a catch-up subscription pattern.
- Projections must handle **out-of-order events** gracefully when consuming from multiple streams.

## Event Versioning Strategies

| Strategy | When to Use | Trade-offs |
|---|---|---|
| **Upcasting** | Additive schema changes (new optional field) | Simple; single event type in code |
| **Version fork** | Breaking schema change (renamed/removed field) | Two event types in code; event store has both |
| **Event replacement** | Migrating old events at rest (rare) | Requires migration tooling; breaks immutability |
| **Weak schema** | Loosely coupled consumers (e.g., JSON) | Flexible but risks silent schema drift |

**Safe changes (non-breaking):**

- Adding a new optional field with a default value
- Adding a new event type alongside an existing one

**Breaking changes (require versioning):**

- Renaming or removing a field
- Changing a field's type
- Changing the semantic meaning of a field

## Templates in This Skill

| Template | Purpose |
|---|---|
| `templates/command-query-separation.md` | Documents all commands, queries, handlers, and consistency expectations |
| `templates/event-store-design.md` | Defines the event store schema, partitioning, and storage configuration |
| `templates/event-versioning.md` | Tracks event schema versions, migration strategy, and consumer impact |
| `templates/projection-template.md` | Defines a read model projection: events, schema, checkpoint, and rebuild strategy |

## Agent Pairing

This skill pairs with the `domain-designer` agent for DDD + CQRS workflows. The domain-designer identifies aggregates and domain events; this skill handles the implementation of CQRS separation and event sourcing infrastructure.

Hand off to `backend-dev` for command handler and projection implementation. Hand off to `data-tier` for event store schema and persistence design.

## Guardrails

- Do not apply CQRS/ES to simple CRUD applications — the operational complexity is not justified.
- Do not share a read model schema with the write model — they exist for different purposes and must evolve independently.
- Never expose raw event objects across context boundaries — publish integration events with a Published Language schema.
- Snapshot without also cleaning up the event store still requires the full event history for correctness — do not delete events unless you have a retention policy.
- Every projection must handle idempotent re-processing. Checkpointing is not optional.

## GitHub Issue Filing

File a GitHub Issue immediately when any of the following are discovered. Do not defer.

```bash
gh issue create \
  --title "[CQRS/ES] <short description>" \
  --label "architecture,cqrs,event-sourcing" \
  --body "## CQRS / Event Sourcing Finding

**Context:** <bounded context or service name>
**Category:** <missing idempotency | shared read-write model | missing snapshot policy | missing event versioning | command returning data | query mutating state>

### Description
<what was found and why it is a design or reliability risk>

### Recommended Fix
<concise recommendation>

### Acceptance Criteria
- [ ] <criterion 1>
- [ ] <criterion 2>

### Discovered During
<CQRS design | projection design | event versioning review>"
```

Trigger conditions:

| Finding | Labels |
|---|---|
| Command handler returning domain data | `architecture,cqrs,design` |
| Query handler mutating state | `architecture,cqrs,correctness` |
| Projection with no checkpoint persistence | `architecture,event-sourcing,reliability` |
| Event schema changed without versioning strategy | `architecture,event-sourcing,risk` |
| Aggregate event stream > 500 events with no snapshot policy | `architecture,event-sourcing,performance` |
| Raw domain events published across context boundaries | `architecture,event-sourcing,coupling` |
