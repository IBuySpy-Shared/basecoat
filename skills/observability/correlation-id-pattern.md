# Correlation ID Propagation Pattern

Use this pattern to implement end-to-end trace context propagation across service boundaries. The **W3C TraceContext** standard (`traceparent` / `tracestate` headers) is the primary mechanism. Proprietary `X-Correlation-Id` headers are a legacy fallback only.

---

## Decision: TraceContext vs. Proprietary Correlation ID

| Scenario | Recommended approach |
|---|---|
| All services use OpenTelemetry | W3C `traceparent` only. No additional header needed. |
| Mix of OTEL and non-OTEL services | W3C `traceparent` as primary; extract `traceparent` trace ID as `correlation.id` span attribute and log field for non-OTEL consumers |
| Legacy service that cannot parse `traceparent` | Generate a `X-Correlation-Id` UUID at the edge; propagate it as a span attribute and log field alongside `traceparent` |
| Inter-domain (third-party or partner API) | Do not forward internal `traceparent` externally. Create a new root span at the integration boundary. |

---

## HTTP Context Propagation

### Injecting Context (Outbound Call)

OpenTelemetry SDK handles injection automatically when using auto-instrumentation. For manual HTTP clients:

**Node.js**

```typescript
import { context, propagation } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

const headers: Record<string, string> = {};
propagation.inject(context.active(), headers);

await fetch('https://payment-svc/charge', { headers });
```

**Python**

```python
from opentelemetry import context, propagate

headers = {}
propagate.inject(headers)

httpx.post('https://payment-svc/charge', headers=headers)
```

**.NET**

```csharp
var request = new HttpRequestMessage(HttpMethod.Post, "https://payment-svc/charge");
// HttpClient with AddOpenTelemetry() auto-injects traceparent
await httpClient.SendAsync(request);
```

---

### Extracting Context (Inbound Request)

Auto-instrumentation handles extraction for HTTP frameworks. For manual extraction:

**Node.js**

```typescript
import { context, propagation } from '@opentelemetry/api';

function handleRequest(req: Request) {
  const parentContext = propagation.extract(context.active(), req.headers);
  return context.with(parentContext, () => {
    const span = tracer.startSpan('POST /orders');
    // ... handle request
    span.end();
  });
}
```

**Python**

```python
from opentelemetry import context, propagate

def handle_request(request):
    parent_context = propagate.extract(dict(request.headers))
    token = context.attach(parent_context)
    try:
        span = tracer.start_span('POST /orders')
        # ... handle request
        span.end()
    finally:
        context.detach(token)
```

---

## Message Queue Context Propagation

### Azure Service Bus

**Publishing (inject context into message)**

```typescript
import { propagation, context } from '@opentelemetry/api';

const carrier: Record<string, string> = {};
propagation.inject(context.active(), carrier);

const message = {
  body: { orderId: 'ord_123' },
  applicationProperties: { ...carrier },
};

await sender.sendMessages(message);
```

**Consuming (extract context from message)**

```typescript
const receivedMsg = await receiver.receiveMessages(1);
const carrier = receivedMsg[0].applicationProperties as Record<string, string>;
const parentContext = propagation.extract(context.active(), carrier);

context.with(parentContext, () => {
  const span = tracer.startSpan('order.process');
  // ... process message
  span.end();
});
```

### RabbitMQ / AMQP

Inject into `headers` field of the AMQP message properties. Extract from `headers` on the consumer side using the same propagation API.

---

## Legacy `X-Correlation-Id` Interoperability

When a legacy service requires a proprietary correlation header:

1. At the **edge gateway** or **entry service**, read `traceparent` and extract the trace ID.
2. Inject the trace ID as `X-Correlation-Id` so legacy services can log it.
3. On the return path, do not attempt to reconstruct a span from `X-Correlation-Id` — the trace ID from `traceparent` is the authoritative identifier.

```typescript
// Edge middleware: bridge traceparent → X-Correlation-Id for legacy downstream
app.use((req, res, next) => {
  const traceparent = req.headers['traceparent'];
  if (traceparent && !req.headers['x-correlation-id']) {
    // W3C format: 00-<traceId>-<spanId>-<flags>
    const traceId = traceparent.split('-')[1];
    req.headers['x-correlation-id'] = traceId;
  }
  next();
});
```

---

## Logging the Correlation ID

Inject the active trace ID into every structured log line so logs and traces are joinable in the backend:

**Node.js (Pino + OTEL)**

```typescript
import { context, trace } from '@opentelemetry/api';

function getTraceContext() {
  const span = trace.getActiveSpan();
  if (!span) return {};
  const { traceId, spanId, traceFlags } = span.spanContext();
  return { trace_id: traceId, span_id: spanId, trace_flags: traceFlags.toString(16).padStart(2, '0') };
}

logger.info({ ...getTraceContext(), message: 'Order created', 'order.id': orderId });
```

**Python (structlog + OTEL)**

```python
from opentelemetry import trace

def get_trace_context() -> dict:
    span = trace.get_current_span()
    ctx = span.get_span_context()
    if ctx.is_valid:
        return {
            "trace_id": format(ctx.trace_id, '032x'),
            "span_id": format(ctx.span_id, '016x'),
        }
    return {}

logger.info("Order created", **get_trace_context(), order_id=order_id)
```

---

## Validation Checklist

- [ ] Outbound HTTP requests carry `traceparent` header (confirmed via network capture or Collector debug)
- [ ] Inbound HTTP requests extract `traceparent` before creating spans (child spans show parent in trace UI)
- [ ] Message queue messages carry trace context in `applicationProperties` or `headers`
- [ ] Structured logs include `trace_id` and `span_id` matching the active OTEL span
- [ ] No proprietary `X-Correlation-Id` used when all participants support W3C TraceContext
- [ ] Context is NOT forwarded across external/partner API boundaries (new root span created instead)
- [ ] `context.with()` / context manager used for async boundaries to avoid context leaking
