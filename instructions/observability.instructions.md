---
description: "Use when adding, reviewing, or changing observability instrumentation in any service. Enforces OpenTelemetry SDK setup, structured log schema, distributed tracing conventions, metrics naming, correlation ID propagation, and dashboard-as-code standards."
applyTo: "**/*"
---

# Observability Standards

Use this instruction for any change that touches logging, metrics, tracing, or monitoring configuration.

## OpenTelemetry SDK

- **Always** initialize the OTEL SDK through a dedicated bootstrap module that runs before any application code. See `skills/observability/otel-setup-guide.md` for per-language setup.
- Set `service.name`, `service.version`, and `deployment.environment` as resource attributes at SDK initialization. Do not hard-code these values — read them from environment variables.
- Route all telemetry through the **OTEL Collector** in non-local environments. Never configure the SDK to export directly to a backend (Azure Monitor, Datadog, Prometheus) from application code in production.
- Enable **auto-instrumentation** libraries for HTTP clients/servers, databases, and message queues before writing manual spans.
- Call `sdk.shutdown()` on process exit to flush remaining telemetry.

## Structured Logging

- Emit logs as **single-line JSON** in all non-local environments.
- Every log line must include `timestamp` (ISO 8601 UTC), `level`, `service`, `version`, `environment`, and `message`.
- Inject `trace_id` and `span_id` from the active OTEL span context into every log line. Use `"` for the full W3C 32-char trace ID and 16-char span ID.
- Use `WARN` for expected, recoverable conditions. Use `ERROR` only for unexpected faults requiring operator action.
- Never log credentials, tokens, secrets, PII (names, email addresses, identifiers), or sensitive business data.
- Attach structured `error` objects to `ERROR`/`FATAL` log lines — do not concatenate the error into the `message` string.
- Follow the schema in `skills/observability/structured-log-schema-template.md`.

## Distributed Tracing

- Name root spans using the `<HTTP method> <route template>` pattern (e.g., `POST /orders/{id}`). Never use path parameters — use route templates.
- Extract incoming W3C `traceparent` and `tracestate` headers before creating the root span. Never start a new trace root when a parent context is present.
- Propagate context across every service boundary: HTTP headers, message queue application properties, and gRPC metadata.
- Set span status to `ERROR` and call `span.recordException(error)` on failure. Do not swallow exceptions inside a span scope.
- Use OTEL semantic convention attribute names for HTTP, database, messaging, and RPC operations. Reference `https://opentelemetry.io/docs/specs/semconv/`.
- Sanitize `db.statement` attributes — remove all parameter values before recording.
- Never include PII in span attribute values.
- See `skills/observability/span-design-template.md` for span hierarchy design.

## Metrics

- Use the instrument type that matches the measurement: Counter for monotonic totals, Histogram for distributions, UpDownCounter for values that increase and decrease, ObservableGauge for polled snapshots.
- Name metrics using `<namespace>.<subsystem>.<name>` dot-separated lowercase pattern. Set the unit descriptor separately — do not embed units in the metric name.
- Use only OTEL semantic convention attribute names as metric labels. If no convention exists, use `<domain>.<noun>` dot-notation.
- Never use unbounded values (user IDs, request IDs, freeform strings) as metric attribute values — they destroy backend cardinality.
- Expose Histogram metrics for every operation where latency or size matters. Do not use gauges to track percentiles.
- Follow the naming rules in `skills/observability/metrics-naming-convention.md`.

## Correlation ID Propagation

- Use **W3C TraceContext** (`traceparent`, `tracestate`) as the sole correlation mechanism when all services use OTEL. Do not add a proprietary `X-Correlation-Id` header alongside TraceContext.
- When a legacy service requires a proprietary correlation header, extract the trace ID from `traceparent` at the integration boundary and inject it as `X-Correlation-Id`. Never use `X-Correlation-Id` as the canonical identifier.
- Do not forward internal `traceparent` across external or partner API boundaries. Create a new root span at the integration edge.
- See `skills/observability/correlation-id-pattern.md` for implementation patterns.

## Dashboards

- Every service must have a dashboard covering the four golden signals: request rate, error rate, latency (p50/p95/p99), and saturation.
- Dashboard definitions must be stored as code in `dashboards/` within the service repository.
- Deploy dashboards via CI — never export-and-commit raw JSON from the UI.
- Define template variables for `environment` and `interval` so dashboards work across all deployments.
- See `skills/observability/dashboard-as-code-template.md` for the Grafana JSON and Azure Monitor Workbook templates.

## Review Lens

- Does the change add or modify a service without OTEL SDK initialization?
- Are log lines emitted as JSON with `trace_id` and `span_id`?
- Are outbound HTTP calls and message publishes injecting W3C TraceContext?
- Do new metrics use correct instrument types and naming conventions?
- Are unbounded cardinality values (user IDs, request IDs) absent from metric labels?
- Are new dashboards committed as code and included in the PR?
- Is there any PII, credential, or secret in log or span output?
