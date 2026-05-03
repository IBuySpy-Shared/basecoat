# Span Design Template

Use this template to design the distributed tracing topology for a single operation, feature, or critical user journey. Complete one template per logical transaction boundary.

---

## Operation Summary

| Field | Value |
|---|---|
| **Operation name** | `<e.g., Place Order>` |
| **Service owner** | `<e.g., checkout-api>` |
| **Trigger** | `<HTTP POST /orders \| message queue order.requested \| scheduled job>` |
| **SLO target** | `<e.g., p95 < 500 ms, error rate < 0.1%>` |

---

## Root Span

The root span is created at the entry point of the operation (inbound HTTP request, queue consumer, scheduled trigger).

| Field | Value |
|---|---|
| **Span name** | `<HTTP method + route template, e.g., POST /orders>` |
| **Kind** | `SERVER` |
| **Creates new trace?** | `Yes (no incoming traceparent) / No (propagates parent)` |

### Required Attributes

| Attribute key | Type | Example value | Semantic convention |
|---|---|---|---|
| `http.method` | string | `"POST"` | OTEL HTTP |
| `http.route` | string | `"/orders"` | OTEL HTTP |
| `http.status_code` | int | `201` | OTEL HTTP |
| `http.url` | string | `"https://api.example.com/orders"` | OTEL HTTP |
| `net.peer.ip` | string | `"10.0.0.5"` | OTEL Network |

---

## Child Spans

Add one row per downstream call or significant internal operation. Nest children under their logical parent.

| Span name | Kind | Parent span | Service | Key attributes |
|---|---|---|---|---|
| `<db.query: INSERT orders>` | CLIENT | Root | `checkout-api` | `db.system=postgresql`, `db.name=orders`, `db.operation=INSERT` |
| `<grpc: payment.Charge>` | CLIENT | Root | `payment-svc` | `rpc.system=grpc`, `rpc.service=payment.PaymentService`, `rpc.method=Charge` |
| `<messaging: publish order.confirmed>` | PRODUCER | Root | `checkout-api` | `messaging.system=servicebus`, `messaging.destination=order.confirmed` |
| `<validate: inventory check>` | INTERNAL | Root | `checkout-api` | `inventory.sku=ABC123`, `inventory.quantity_requested=2` |

---

## Span Attribute Standards

- Use **OTEL semantic convention** attribute names whenever one exists (see `https://opentelemetry.io/docs/specs/semconv/`).
- Use `<domain>.<noun>` for custom attributes not covered by OTEL (e.g., `order.id`, `payment.provider`).
- Never include PII (user email, address, full name) as span attributes.
- Sanitize `db.statement` — remove parameter values before recording.

---

## Error Handling

When a span operation fails:

1. Set span status to `ERROR` using `span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })`.
2. Call `span.recordException(error)` to attach the exception event with type, message, and stack.
3. **Do not** catch the exception inside the span scope and swallow it — let it propagate after recording.

```typescript
// Node.js example
const span = tracer.startSpan('payment.charge');
try {
  await paymentClient.charge(orderId, amount);
  span.setStatus({ code: SpanStatusCode.OK });
} catch (err) {
  span.recordException(err);
  span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
  throw err;
} finally {
  span.end();
}
```

---

## Context Propagation

| Boundary type | Propagation mechanism |
|---|---|
| HTTP outbound | Inject W3C `traceparent` and `tracestate` headers |
| HTTP inbound | Extract W3C headers before creating root span |
| Azure Service Bus / RabbitMQ | Inject into message `ApplicationProperties` / headers |
| gRPC | Inject via gRPC metadata (automatic with OTEL gRPC instrumentation) |
| Background job (same process) | Pass `Context` object explicitly; do not rely on implicit active context |
| Cross-thread async | Propagate context explicitly into async callbacks and thread pools |

---

## Sampling Strategy

| Environment | Strategy | Target rate |
|---|---|---|
| Development | Always-on (`AlwaysOnSampler`) | 100% |
| Staging | Probability (`TraceIdRatioBased`) | 20% |
| Production | Tail-based (OTEL Collector filter) | < 5% steady-state; 100% on error |

---

## Span Design Checklist

- [ ] Root span name follows `<HTTP method> <route template>` convention
- [ ] All downstream calls have a corresponding CLIENT or PRODUCER child span
- [ ] OTEL semantic convention attribute keys used for HTTP, DB, messaging, and RPC spans
- [ ] No PII in span attribute values
- [ ] `db.statement` sanitized of parameter values
- [ ] Error spans call `recordException` and set status to `ERROR`
- [ ] Outbound calls inject W3C TraceContext headers
- [ ] Inbound entry points extract W3C TraceContext headers before span creation
- [ ] Sampling strategy defined per environment
