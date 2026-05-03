# Command / Query Separation — [Service or Bounded Context Name]

> Document all commands and queries for a bounded context or service. Replace bracketed placeholders.

## Overview

| Field | Value |
|---|---|
| **Bounded Context** | [Context name] |
| **Service** | [Service name] |
| **Date** | [YYYY-MM-DD] |
| **Author(s)** | [Names or team] |

---

## Commands

> Commands express intent to change state. They do not return domain data.

| Command | Handler Class | Aggregate Loaded | Pre-conditions | Domain Events Raised | Consistency | Notes |
|---|---|---|---|---|---|---|
| `CreateOrder` | `CreateOrderHandler` | `Order` | Customer exists; cart not empty | `OrderCreated` | Immediate (within aggregate) | Idempotent on duplicate order ID |
| `AddItem` | `AddItemHandler` | `Order` | Order is in PENDING state | `ItemAdded` | Immediate | Price captured at command time |
| `ConfirmOrder` | `ConfirmOrderHandler` | `Order` | At least 1 item; payment reserved | `OrderConfirmed` | Immediate | Triggers saga in Payment context |
| `[Command]` | `[Handler]` | `[Aggregate]` | [Pre-conditions] | `[Events]` | [Consistency] | [Notes] |

### Command Schema Template

```json
{
  "commandType": "CreateOrder",
  "commandId": "<uuid — idempotency key>",
  "causationId": "<id of the event or request that caused this command>",
  "correlationId": "<trace correlation id>",
  "issuedAt": "<ISO 8601>",
  "issuedBy": "<user or service identity>",
  "payload": {
    "<field>": "<value>"
  }
}
```

---

## Queries

> Queries read state without side effects. They must never mutate data.

| Query | Handler Class | Read Model | Filter Fields | Paging | Consistency | Notes |
|---|---|---|---|---|---|---|
| `GetOrderById` | `GetOrderByIdHandler` | `OrderSummaryView` | `orderId` | No | Eventual | Returns from read store |
| `ListOrdersByCustomer` | `ListOrdersByCustomerHandler` | `OrderListView` | `customerId`, `status`, `dateRange` | Yes (cursor) | Eventual | Sorted by `createdAt` desc |
| `GetOrderAuditLog` | `GetOrderAuditLogHandler` | Event store | `orderId` | Yes (offset) | Strong | Reads directly from event store |
| `[Query]` | `[Handler]` | `[Read Model]` | [Filters] | [Paging] | [Consistency] | [Notes] |

### Query Response Schema Template

```json
{
  "queryType": "GetOrderById",
  "correlationId": "<trace correlation id>",
  "executedAt": "<ISO 8601>",
  "data": {
    "<field>": "<value>"
  },
  "paging": {
    "cursor": "<opaque cursor or null>",
    "hasMore": false
  }
}
```

---

## Consistency Expectations

| Operation | Model | Consistency Level | Rationale |
|---|---|---|---|
| Place order | Write (event store) | Immediate | Business invariant must be enforced atomically |
| View order status | Read model | Eventual (< 500 ms typical) | Acceptable lag for read-heavy dashboard |
| Audit log | Event store | Strong | Compliance requirement for exact event sequence |

---

## Shared Kernel Contracts

> List commands or events shared across bounded contexts via a Published Language or Open Host Service.

| Contract | Direction | Format | Version | Consumers |
|---|---|---|---|---|
| `OrderConfirmed` integration event | Outbound | Avro / `orders.v1` Kafka topic | v1 | Payment context, Fulfillment context |
| `PaymentReserved` integration event | Inbound | Avro / `payments.v1` Kafka topic | v1 | Order context |

---

## Revision History

| Date | Author | Change |
|---|---|---|
| [YYYY-MM-DD] | [Name] | Initial draft |
