---

name: observability
description: "Use when adding logs, metrics, traces, or alertable telemetry to apps, services, and distributed systems. USE FOR: instrument service with OpenTelemetry, add structured logging and trace IDs, define SLI or latency metrics, trace requests across queues and APIs, improve incident debugging telemetry. DO NOT USE FOR: pure UI redesign, business analytics reporting."
compatibility:
  editors:
    - vscode
  platforms:
    - github
metadata:
  category: "Uncategorized"
  tags: ["uncategorized"]
  maturity: "beta"
  audience: ["developers"]
allowed-tools: ["bash", "git", "grep", "find"]
---

# Observability Skill

Use this skill when a system needs meaningful logs, actionable metrics, and traces that explain user-facing behavior across services. It helps turn vague "something is slow" or "errors are increasing" symptoms into instrumented telemetry that operators and developers can query, alert on, and debug.

The typical input is an application, service boundary, incident symptom, or instrumentation gap. The expected output is guidance, code changes, or configuration that produces structured telemetry with clear signal names, dimensions, and correlation identifiers. Prefer practical instrumentation over dashboards-first work: define the questions you need to answer, then add the telemetry required to answer them.

## When to Use

- Adding observability to a new service before production rollout
- Improving poor incident triage where logs are noisy but not useful
- Standardizing metrics names, labels, and alert-friendly service-level indicators
- Tracing requests across APIs, queues, jobs, and downstream dependencies
- Correlating logs with trace IDs for faster root-cause analysis
- Reviewing whether existing telemetry returns enough context to debug failures
- Adopting OpenTelemetry across multiple services or languages

## Core Patterns

### Logs

Use structured logs with stable field names. Include severity, service name, environment, operation name, and correlation fields such as `trace_id` or `request_id`. Logs should describe state transitions and failures, not duplicate every implementation detail. A good log output lets responders answer what failed, where, and for whom.

### Metrics

Prefer a small set of high-value counters, histograms, and gauges. Track request volume, latency, error rate, saturation, queue depth, and retry behavior. Metric dimensions should stay low-cardinality; avoid labels that explode on user IDs or raw URLs. Metrics should produce alertable signals and support trend analysis over time.

### Traces

Create spans around externally meaningful work such as HTTP handlers, database calls, queue consumers, and third-party requests. Add attributes for route, dependency, status, and tenant-safe business context. Traces should return an end-to-end view of latency and causality, especially in distributed systems.

```python
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.sdk.trace import TracerProvider

trace.set_tracer_provider(TracerProvider())
FlaskInstrumentor().instrument_app(app)
tracer = trace.get_tracer("checkout-service")

@app.get("/checkout")
def checkout():
    with tracer.start_as_current_span("checkout") as span:
        span.set_attribute("http.route", "/checkout")
        span.set_attribute("app.feature", "cart")
        logger.info("checkout_started", extra={"trace_id": format(span.get_span_context().trace_id, 'x')})
        return {"status": "ok"}
```

## Inputs and Outputs

Common inputs include incident symptoms, service diagrams, existing logger or metrics code, runtime platforms, and telemetry backend constraints. Common outputs include instrumentation plans, naming conventions, example code, dashboard or alert recommendations, and validation steps for confirming the telemetry works in production.

## References

- [OTEL instrumentation guide](./otel-instrumentation.md)
