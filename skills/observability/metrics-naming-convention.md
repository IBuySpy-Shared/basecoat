# Metrics Naming Convention

Use this reference when defining, reviewing, or auditing metric names across services. Every metric must pass these rules before being shipped to production.

---

## Instrument Type Reference

Choose the instrument type that matches the measurement's nature. Using the wrong type produces misleading aggregations.

| Instrument | OTEL API | Use For | Do NOT Use For |
|---|---|---|---|
| **Counter** | `meter.createCounter()` | Values that only increase (requests, errors, bytes sent) | Values that can decrease |
| **UpDownCounter** | `meter.createUpDownCounter()` | Values that increase and decrease (active connections, queue depth, cache size) | Monotonically increasing values |
| **Histogram** | `meter.createHistogram()` | Duration, size, or any distribution where percentiles matter | Simple totals |
| **ObservableGauge** | `meter.createObservableGauge()` | Point-in-time snapshots polled on each collection (CPU %, memory used) | Event-driven measurements |
| **ObservableCounter** | `meter.createObservableCounter()` | Monotonically increasing values read from an external system | Values emitted by your own code per-operation |

---

## Naming Rules

### Pattern

```
<namespace>.<subsystem>.<name>[.<unit>]
```

All segments are **lowercase snake_case**. Dots separate namespaces. Units are appended as a suffix when not captured in the metric descriptor.

### Required Rules

1. **Lowercase and snake_case** — `http_server_request_count` not `HTTPServerRequestCount`.
2. **Dot-separated namespaces** — `http.server.request.count` not `httpServerRequestCount`.
3. **No units in the base name** — use the `unit` descriptor field instead.
4. **No service name in the metric name** — use resource attributes (`service.name`) for service-level filtering, not the metric name.
5. **Plural nouns for counters** — `request.count`, not `request`.
6. **Use OTEL semantic convention names first** — check `https://opentelemetry.io/docs/specs/semconv/` before inventing a name.

### Unit Conventions

| Unit | Descriptor value |
|---|---|
| Seconds | `s` |
| Milliseconds | `ms` |
| Bytes | `By` |
| Kibibytes | `KiBy` |
| Requests | `{requests}` |
| Connections | `{connections}` |
| Operations | `{operations}` |
| Percent | `1` (ratio 0–1) |
| Dimensionless count | `{<noun>}` |

---

## Standard Metric Catalog

These are the required baseline metrics for every HTTP service. Add domain-specific metrics beyond this baseline.

### HTTP Server Metrics

| Metric name | Instrument | Unit | Description |
|---|---|---|---|
| `http.server.request.count` | Counter | `{requests}` | Total inbound HTTP requests |
| `http.server.error.count` | Counter | `{requests}` | Requests resulting in 5xx response |
| `http.server.request.duration` | Histogram | `s` | Request processing duration (p50/p95/p99) |
| `http.server.active_requests` | UpDownCounter | `{requests}` | Currently in-flight requests |

Recommended histogram buckets (seconds): `[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]`

### HTTP Client Metrics

| Metric name | Instrument | Unit | Description |
|---|---|---|---|
| `http.client.request.count` | Counter | `{requests}` | Total outbound HTTP requests |
| `http.client.error.count` | Counter | `{requests}` | Outbound requests with 5xx or network error |
| `http.client.request.duration` | Histogram | `s` | Outbound request round-trip duration |

### Messaging Metrics

| Metric name | Instrument | Unit | Description |
|---|---|---|---|
| `messaging.publish.count` | Counter | `{messages}` | Messages successfully published |
| `messaging.consume.count` | Counter | `{messages}` | Messages successfully consumed |
| `messaging.queue.depth` | ObservableGauge | `{messages}` | Current depth of the message queue |
| `messaging.process.duration` | Histogram | `s` | Time to process a single message |

### Database Metrics

| Metric name | Instrument | Unit | Description |
|---|---|---|---|
| `db.client.connections.active` | UpDownCounter | `{connections}` | Active database connections |
| `db.client.connections.idle` | UpDownCounter | `{connections}` | Idle database connections |
| `db.client.operation.duration` | Histogram | `s` | Database operation duration |

### Runtime / Process Metrics

| Metric name | Instrument | Unit | Description |
|---|---|---|---|
| `process.cpu.utilization` | ObservableGauge | `1` | CPU utilization ratio (0–1) |
| `process.memory.heap.used` | ObservableGauge | `By` | Heap memory currently in use |
| `runtime.gc.duration` | Histogram | `s` | Garbage collection pause duration |

---

## Attribute (Label) Cardinality Rules

High-cardinality attributes destroy metrics backends. These rules are non-negotiable.

### Allowed Attributes

| Attribute | Allowed values | Notes |
|---|---|---|
| `http.method` | `GET`, `POST`, `PUT`, `DELETE`, `PATCH` | OTEL semantic convention |
| `http.route` | `/orders/{id}`, `/users` | Route template, NOT actual path with IDs |
| `http.status_code` | `200`, `201`, `400`, `404`, `500` | Status code integer |
| `deployment.environment` | `development`, `staging`, `production` | From resource attribute |
| `db.system` | `postgresql`, `mysql`, `redis`, `sqlserver` | OTEL semantic convention |
| `messaging.system` | `servicebus`, `rabbitmq`, `kafka` | OTEL semantic convention |

### Forbidden Attributes

| Attribute | Reason |
|---|---|
| `user.id` | Unbounded cardinality |
| `request.id` / `trace.id` | Unbounded cardinality |
| `order.id` | Unbounded cardinality |
| Freeform strings from user input | Unbounded cardinality |
| Paths with embedded IDs (e.g., `/orders/12345`) | Use route template instead |

---

## Metric Definition Template

Fill in this table when defining a new metric:

| Field | Value |
|---|---|
| **Name** | `<namespace.subsystem.name>` |
| **Instrument type** | `Counter / UpDownCounter / Histogram / ObservableGauge` |
| **Unit** | `s / By / {requests} / 1` |
| **Description** | One sentence describing what is measured |
| **Attributes** | List of attribute keys with allowed value sets |
| **SLI link** | Related SLI definition (if applicable) |
| **Alert threshold** | Suggested alert expression (if applicable) |

---

## Validation Checklist

- [ ] Metric name follows `<namespace>.<subsystem>.<name>` dot-separated lowercase pattern
- [ ] Instrument type matches measurement semantics (counter for monotonic, histogram for distributions)
- [ ] Unit descriptor set in metric definition, not embedded in the name
- [ ] No service name embedded in the metric name
- [ ] All label attribute keys are from the allowed list or bounded enumeration
- [ ] No user ID, request ID, or unbounded string as a label value
- [ ] OTEL semantic convention checked — existing convention name used if available
