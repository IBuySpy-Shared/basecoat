# Structured Log Schema Template

Use this template to define a consistent JSON structured logging schema across services. Fill in the service-specific fields and add domain attributes as needed.

---

## Required Fields

Every log line **must** include these fields:

| Field | Type | Example | Notes |
|---|---|---|---|
| `timestamp` | string (ISO 8601 UTC) | `"2025-10-01T14:32:01.123Z"` | Millisecond precision. Always UTC. |
| `level` | string | `"INFO"` | One of: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` |
| `service` | string | `"checkout-api"` | Matches `service.name` OTEL resource attribute |
| `version` | string | `"1.4.2"` | Matches `service.version` OTEL resource attribute |
| `environment` | string | `"production"` | Matches `deployment.environment` OTEL resource attribute |
| `message` | string | `"Order created successfully"` | Human-readable. No PII. No dynamic keys embedded in the string. |

---

## Trace Context Fields

Include these fields **when a trace is active** (i.e., within a span context):

| Field | Type | Example | Notes |
|---|---|---|---|
| `trace_id` | string | `"4bf92f3577b34da6a3ce929d0e0e4736"` | W3C 32-char hex trace ID |
| `span_id` | string | `"00f067aa0ba902b7"` | W3C 16-char hex span ID |
| `trace_flags` | string | `"01"` | W3C trace flags (sampled = `"01"`) |

---

## Error Fields

Include the `error` object **when** `level` is `ERROR` or `FATAL`:

```json
{
  "error": {
    "type": "ValidationError",
    "message": "Required field 'amount' is missing",
    "stack": "ValidationError: Required field...\n  at validate (orders.js:42)"
  }
}
```

| Field | Type | Notes |
|---|---|---|
| `error.type` | string | Exception class name or error code |
| `error.message` | string | Concise error description. No PII. |
| `error.stack` | string | Stack trace. Omit in high-volume DEBUG paths to reduce log size. |

---

## Optional Domain Attributes

Add service-specific attributes under a top-level `attributes` object:

```json
{
  "attributes": {
    "http.method": "POST",
    "http.route": "/orders/{id}",
    "http.status_code": 201,
    "order.id": "ord_8f2a3c",
    "user.tenant_id": "tenant_acme"
  }
}
```

Rules:

- Use dot-notation keys matching OTEL semantic conventions where an attribute already exists (e.g., `http.method`, `db.system`).
- Use `<domain>.<noun>` for custom attributes (e.g., `order.id`, `payment.provider`).
- Never include `user.id`, `user.email`, or other personal identifiers unless explicitly required and protected by access controls.

---

## Complete Example Log Line

```json
{
  "timestamp": "2025-10-01T14:32:01.123Z",
  "level": "INFO",
  "service": "checkout-api",
  "version": "1.4.2",
  "environment": "production",
  "message": "Order created successfully",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "trace_flags": "01",
  "attributes": {
    "http.method": "POST",
    "http.route": "/orders",
    "http.status_code": 201,
    "order.id": "ord_8f2a3c"
  }
}
```

---

## Error Log Example

```json
{
  "timestamp": "2025-10-01T14:32:05.456Z",
  "level": "ERROR",
  "service": "checkout-api",
  "version": "1.4.2",
  "environment": "production",
  "message": "Payment gateway returned unexpected error",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "b3c4d5e6f7a8b9c0",
  "trace_flags": "01",
  "error": {
    "type": "PaymentGatewayError",
    "message": "Gateway timeout after 30 s",
    "stack": "PaymentGatewayError: Gateway timeout...\n  at PaymentClient.charge (payment.js:88)"
  },
  "attributes": {
    "payment.provider": "stripe",
    "order.id": "ord_8f2a3c"
  }
}
```

---

## Validation Checklist

- [ ] All required fields present in every log line
- [ ] `trace_id` and `span_id` injected from active OTEL span context
- [ ] No PII in `message`, `error.message`, or `attributes`
- [ ] `level` uses only allowed enum values
- [ ] JSON is valid and emitted as a single line (no pretty-print in production)
- [ ] `error` object present for every ERROR/FATAL log
- [ ] Custom attribute keys use dot-notation consistent with OTEL semantic conventions
