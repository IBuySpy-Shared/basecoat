# Projection Design — [Projection Name]

> Define a read model projection: the events it subscribes to, its schema, checkpoint strategy, and rebuild approach.
> Replace bracketed placeholders with project-specific content.

## Overview

| Field | Value |
|---|---|
| **Projection Name** | [e.g., OrderSummaryProjection] |
| **Read Model** | [e.g., OrderSummaryView table in orders_read_db] |
| **Bounded Context** | [Context name] |
| **Purpose** | [One sentence describing what this projection provides and who consumes it] |
| **Date** | [YYYY-MM-DD] |
| **Author(s)** | [Names or team] |

---

## Event Subscriptions

> Events this projection subscribes to. Projections must handle all listed events idempotently.

| Event Type | Event Version(s) | Source Stream | Handler Method | Notes |
|---|---|---|---|---|
| `OrderCreated` | v1, v2 | `order-*` aggregate streams | `on_order_created()` | Creates the read model record |
| `ItemAdded` | v1 | `order-*` aggregate streams | `on_item_added()` | Updates item count and total |
| `OrderConfirmed` | v1 | `order-*` aggregate streams | `on_order_confirmed()` | Updates status to CONFIRMED |
| `OrderCancelled` | v1 | `order-*` aggregate streams | `on_order_cancelled()` | Marks record as CANCELLED |
| `[EventType]` | [versions] | [stream] | `[handler]` | [Notes] |

---

## Read Model Schema

> The denormalized schema optimized for query access patterns.

```sql
CREATE TABLE order_summary_view (
    order_id         UUID         NOT NULL,
    customer_id      UUID         NOT NULL,
    customer_name    VARCHAR(255),
    status           VARCHAR(50)  NOT NULL,
    item_count       INTEGER      NOT NULL DEFAULT 0,
    total_price      DECIMAL(12,2),
    currency         CHAR(3),
    created_at       TIMESTAMPTZ  NOT NULL,
    confirmed_at     TIMESTAMPTZ,
    last_updated_at  TIMESTAMPTZ  NOT NULL,
    event_sequence   BIGINT       NOT NULL,  -- for idempotency checks

    PRIMARY KEY (order_id)
);

CREATE INDEX idx_osv_customer ON order_summary_view (customer_id, created_at DESC);
CREATE INDEX idx_osv_status   ON order_summary_view (status, created_at DESC);
```

---

## Query Access Patterns

| Query | Filters | Sort | Notes |
|---|---|---|---|
| Get order by ID | `order_id` | — | Primary key lookup |
| List orders for customer | `customer_id` | `created_at DESC` | Paged; cursor-based |
| List orders by status | `status` | `created_at DESC` | Admin / ops view |
| [Query] | [filters] | [sort] | [Notes] |

---

## Checkpoint Strategy

| Aspect | Value | Notes |
|---|---|---|
| **Checkpoint store** | [e.g., `projection_checkpoints` table, Redis key] | Persisted durably |
| **Checkpoint key** | `order_summary_projection` | Unique per projection |
| **Checkpoint value** | `globalPosition` from last processed event | Long / Int64 |
| **Checkpoint frequency** | After every batch of [N] events | Balance durability vs. throughput |
| **Resume on restart** | Yes — load checkpoint on startup and resume from that position | |

```sql
CREATE TABLE projection_checkpoints (
    projection_name  VARCHAR(100) NOT NULL,
    global_position  BIGINT       NOT NULL,
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    PRIMARY KEY (projection_name)
);
```

---

## Idempotency

Each event handler must be idempotent. The recommended approach:

1. Include `event_sequence` (the event's `globalPosition`) in the read model row.
2. Before applying an event, check: `IF event.globalPosition <= current.event_sequence THEN SKIP`.
3. Use a database upsert (`INSERT ... ON CONFLICT DO UPDATE`) to ensure atomicity.

---

## Rebuild Strategy

Projections must be rebuildable from scratch. Steps:

1. Rename or truncate the existing read model table (do not drop — keep for rollback).
2. Reset the projection checkpoint to `globalPosition = 0`.
3. Start the projection consumer — it will replay all events from the beginning.
4. Once caught up, redirect live traffic to the new table.
5. Drop the old table after validation.

**Estimated rebuild time:** [Duration based on total event count and replay throughput]

---

## Consistency and Lag

| Aspect | Value |
|---|---|
| **Consistency model** | Eventual |
| **Expected lag (p99)** | [e.g., < 500 ms under normal load] |
| **Acceptable lag for use cases** | [Describe which queries tolerate lag and which require strong consistency] |
| **Strong consistency fallback** | [e.g., "Audit log queries read directly from the event store"] |

---

## Alerting

| Condition | Alert | Severity |
|---|---|---|
| Projection lag > [threshold] | `projection.lag_seconds{name="order_summary"}` | Warning |
| Projection consumer stopped | No checkpoint update in > [N] minutes | Critical |
| Unhandled event type encountered | Log + alert | Warning |

---

## Revision History

| Date | Author | Change |
|---|---|---|
| [YYYY-MM-DD] | [Name] | Initial draft |
