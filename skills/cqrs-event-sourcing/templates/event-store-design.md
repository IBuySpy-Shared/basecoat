# Event Store Design — [Service or Bounded Context Name]

> Define the event store schema, partitioning strategy, and storage configuration. Replace bracketed placeholders.

## Overview

| Field | Value |
|---|---|
| **Bounded Context** | [Context name] |
| **Storage Backend** | [e.g., PostgreSQL, EventStoreDB, Azure Cosmos DB, Kafka] |
| **Date** | [YYYY-MM-DD] |
| **Author(s)** | [Names or team] |

---

## Event Envelope Schema

Every event stored in the event store carries the following envelope fields. The `payload` is the event-type-specific body.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | UUID | Yes | Globally unique event ID |
| `aggregateId` | string | Yes | ID of the aggregate this event belongs to |
| `aggregateType` | string | Yes | Aggregate type name — e.g., `Order`, `Customer` |
| `eventType` | string | Yes | Event class name — e.g., `OrderCreated`, `ItemAdded` |
| `eventVersion` | integer | Yes | Schema version of the event payload — starts at 1 |
| `sequenceNumber` | long | Yes | Position within the aggregate's stream — monotonically increasing |
| `globalPosition` | long | Yes | Global append position across all streams (for catch-up subscriptions) |
| `occurredAt` | ISO 8601 | Yes | When the event occurred (domain time) |
| `recordedAt` | ISO 8601 | Yes | When the event was stored (wall-clock time) |
| `causationId` | UUID | Yes | ID of the command that caused this event |
| `correlationId` | UUID | Yes | Trace correlation ID for distributed tracing |
| `issuedBy` | string | Yes | User or service identity that issued the originating command |
| `payload` | JSON/binary | Yes | Event-type-specific data — see individual event schemas |
| `metadata` | JSON | No | Optional additional context (e.g., tenant ID, environment) |

---

## Partitioning Strategy

| Aspect | Decision | Rationale |
|---|---|---|
| **Primary partition** | Per aggregate stream (`aggregateId`) | Guarantees ordering within a single aggregate's event history |
| **Cross-aggregate ordering** | Not guaranteed | Aggregates are independent consistency boundaries |
| **Global ordering** | Provided by `globalPosition` | Required for catch-up subscriptions and cross-stream projections |
| **Hot partition mitigation** | [Describe strategy — e.g., shard key hashing, tenant-level partitioning] | [Rationale] |

---

## Storage Configuration

### Database Schema (Relational)

```sql
CREATE TABLE events (
    id               UUID         NOT NULL DEFAULT gen_random_uuid(),
    aggregate_id     VARCHAR(255) NOT NULL,
    aggregate_type   VARCHAR(100) NOT NULL,
    event_type       VARCHAR(100) NOT NULL,
    event_version    INTEGER      NOT NULL DEFAULT 1,
    sequence_number  BIGINT       NOT NULL,
    global_position  BIGINT       GENERATED ALWAYS AS IDENTITY,
    occurred_at      TIMESTAMPTZ  NOT NULL,
    recorded_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    causation_id     UUID         NOT NULL,
    correlation_id   UUID         NOT NULL,
    issued_by        VARCHAR(255) NOT NULL,
    payload          JSONB        NOT NULL,
    metadata         JSONB,

    PRIMARY KEY (id),
    UNIQUE (aggregate_id, sequence_number)  -- optimistic concurrency check
);

CREATE INDEX idx_events_aggregate ON events (aggregate_id, sequence_number);
CREATE INDEX idx_events_global    ON events (global_position);
CREATE INDEX idx_events_type      ON events (event_type);

CREATE TABLE snapshots (
    aggregate_id     VARCHAR(255) NOT NULL,
    aggregate_type   VARCHAR(100) NOT NULL,
    sequence_number  BIGINT       NOT NULL,
    snapshot_version INTEGER      NOT NULL DEFAULT 1,
    captured_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    payload          JSONB        NOT NULL,

    PRIMARY KEY (aggregate_id)
);
```

### Snapshot Policy

| Aggregate | Snapshot Frequency | Snapshot Store | Notes |
|---|---|---|---|
| `Order` | Every 50 events | `snapshots` table | Rebuild from snapshot + delta |
| `[Aggregate]` | [Every N events] | [Store] | [Notes] |

---

## Write Path

1. Load the current aggregate by replaying events (or loading snapshot + delta).
2. Execute the command and collect raised domain events.
3. Append events to the aggregate's stream with `expectedVersion = currentVersion` (optimistic concurrency).
4. Reject if the actual version does not match — surface a `ConcurrencyException`.
5. Publish integration events to the message broker (outbox pattern recommended).

---

## Read Path — Catch-up Subscription

1. Consumer registers with `fromPosition: <last processed global position>`.
2. Event store streams all events from that position (catch-up).
3. Consumer switches to live mode once caught up.
4. Consumer persists checkpoint (last processed `globalPosition`) after each batch.

---

## Retention and Archival

| Policy | Value | Rationale |
|---|---|---|
| **Retention** | [Indefinite / N years] | [Compliance or business requirement] |
| **Archival** | [Cold storage after N months] | [Cost management] |
| **Deletion** | [GDPR right-to-erasure approach — e.g., encrypt payload with per-user key, then delete key] | [Compliance] |

---

## Capacity Estimates

| Metric | Estimate | Notes |
|---|---|---|
| Events per day | [N] | [Source of estimate] |
| Average event payload size | [bytes] | [Source of estimate] |
| Storage growth per month | [GB] | [Calculated from above] |
| Read throughput (peak) | [events/s] | [Source of estimate] |
| Write throughput (peak) | [events/s] | [Source of estimate] |

---

## Revision History

| Date | Author | Change |
|---|---|---|
| [YYYY-MM-DD] | [Name] | Initial draft |
