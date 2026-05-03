# OpenTelemetry SDK Setup Guide

Use this guide to bootstrap OpenTelemetry in a new service. Complete all three signal providers (traces, metrics, logs) in a single initialization block before any other application code runs.

---

## Prerequisites

- OTEL Collector deployed and reachable at `http://otel-collector:4317` (gRPC) or `http://otel-collector:4318` (HTTP/protobuf)
- Environment variables available:
  - `OTEL_SERVICE_NAME` — matches the logical service name (e.g., `checkout-api`)
  - `OTEL_SERVICE_VERSION` — semantic version string (e.g., `1.4.2`)
  - `OTEL_EXPORTER_OTLP_ENDPOINT` — Collector endpoint URL
  - `DEPLOYMENT_ENV` — `development`, `staging`, or `production`

---

## Node.js (TypeScript / JavaScript)

### Packages

```bash
npm install @opentelemetry/sdk-node \
            @opentelemetry/auto-instrumentations-node \
            @opentelemetry/exporter-trace-otlp-grpc \
            @opentelemetry/exporter-metrics-otlp-grpc \
            @opentelemetry/sdk-metrics \
            @opentelemetry/resources \
            @opentelemetry/semantic-conventions
```

### Bootstrap (`instrumentation.ts`)

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT } from '@opentelemetry/semantic-conventions';

const resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? 'unknown-service',
  [SEMRESATTRS_SERVICE_VERSION]: process.env.OTEL_SERVICE_VERSION ?? '0.0.0',
  [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.DEPLOYMENT_ENV ?? 'development',
});

const sdk = new NodeSDK({
  resource,
  traceExporter: new OTLPTraceExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
    exportIntervalMillis: 30_000,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown().finally(() => process.exit(0));
});
```

### Entrypoint

```typescript
// Must be the very first import in the process entry point
import './instrumentation';
import { startServer } from './server';

startServer();
```

---

## Python

### Packages

```bash
pip install opentelemetry-sdk \
            opentelemetry-exporter-otlp-proto-grpc \
            opentelemetry-instrumentation-fastapi \
            opentelemetry-instrumentation-httpx \
            opentelemetry-instrumentation-sqlalchemy
```

### Bootstrap (`instrumentation.py`)

```python
import os
from opentelemetry import trace, metrics
from opentelemetry.sdk.resources import Resource, SERVICE_NAME, SERVICE_VERSION
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter

_resource = Resource.create({
    SERVICE_NAME: os.environ.get("OTEL_SERVICE_NAME", "unknown-service"),
    SERVICE_VERSION: os.environ.get("OTEL_SERVICE_VERSION", "0.0.0"),
    "deployment.environment": os.environ.get("DEPLOYMENT_ENV", "development"),
})

# Traces
tracer_provider = TracerProvider(resource=_resource)
tracer_provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter())
)
trace.set_tracer_provider(tracer_provider)

# Metrics
metric_reader = PeriodicExportingMetricReader(
    OTLPMetricExporter(), export_interval_millis=30_000
)
meter_provider = MeterProvider(resource=_resource, metric_readers=[metric_reader])
metrics.set_meter_provider(meter_provider)
```

### Entrypoint (FastAPI example)

```python
import instrumentation  # noqa: F401 — must be first
from fastapi import FastAPI
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

app = FastAPI()
FastAPIInstrumentor.instrument_app(app)
```

---

## .NET (C#)

### Packages

```bash
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Http
dotnet add package OpenTelemetry.Instrumentation.EntityFrameworkCore
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
```

### Bootstrap (`Program.cs`)

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource =>
        resource.AddService(
            serviceName: builder.Configuration["OTEL_SERVICE_NAME"] ?? "unknown-service",
            serviceVersion: builder.Configuration["OTEL_SERVICE_VERSION"] ?? "0.0.0"
        )
        .AddAttributes(new Dictionary<string, object>
        {
            ["deployment.environment"] = builder.Environment.EnvironmentName.ToLowerInvariant()
        })
    )
    .WithTracing(tracing =>
        tracing
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddEntityFrameworkCoreInstrumentation()
            .AddOtlpExporter()
    )
    .WithMetrics(metrics =>
        metrics
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddRuntimeInstrumentation()
            .AddOtlpExporter()
    );
```

---

## Go

### Packages

```bash
go get go.opentelemetry.io/otel \
       go.opentelemetry.io/otel/sdk/trace \
       go.opentelemetry.io/otel/sdk/metric \
       go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc \
       go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc \
       go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp
```

### Bootstrap (`instrumentation.go`)

```go
package instrumentation

import (
    "context"
    "os"

    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
    "go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
    "go.opentelemetry.io/otel/sdk/metric"
    "go.opentelemetry.io/otel/sdk/resource"
    sdktrace "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
)

func Setup(ctx context.Context) (shutdown func(context.Context) error) {
    res := resource.NewWithAttributes(
        semconv.SchemaURL,
        semconv.ServiceName(envOrDefault("OTEL_SERVICE_NAME", "unknown-service")),
        semconv.ServiceVersion(envOrDefault("OTEL_SERVICE_VERSION", "0.0.0")),
        semconv.DeploymentEnvironment(envOrDefault("DEPLOYMENT_ENV", "development")),
    )

    traceExporter, _ := otlptracegrpc.New(ctx)
    tp := sdktrace.NewTracerProvider(
        sdktrace.WithBatcher(traceExporter),
        sdktrace.WithResource(res),
    )
    otel.SetTracerProvider(tp)

    metricExporter, _ := otlpmetricgrpc.New(ctx)
    mp := metric.NewMeterProvider(
        metric.WithReader(metric.NewPeriodicReader(metricExporter)),
        metric.WithResource(res),
    )
    otel.SetMeterProvider(mp)

    return func(ctx context.Context) error {
        _ = tp.Shutdown(ctx)
        return mp.Shutdown(ctx)
    }
}

func envOrDefault(key, defaultVal string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return defaultVal
}
```

---

## Java (Spring Boot)

### Dependencies (`pom.xml`)

```xml
<dependency>
  <groupId>io.opentelemetry.instrumentation</groupId>
  <artifactId>opentelemetry-spring-boot-starter</artifactId>
  <version>2.5.0</version>
</dependency>
```

### Configuration (`application.yml`)

```yaml
otel:
  service:
    name: ${OTEL_SERVICE_NAME:unknown-service}
  exporter:
    otlp:
      endpoint: ${OTEL_EXPORTER_OTLP_ENDPOINT:http://otel-collector:4317}
  metrics:
    exporter: otlp
  traces:
    exporter: otlp
  logs:
    exporter: otlp
```

---

## OTEL Collector Configuration

Minimal `otel-collector-config.yaml` for local development:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 5s
  resourcedetection:
    detectors: [env, system]

exporters:
  debug:
    verbosity: detailed
  # Replace with your backend exporter (azuremonitor, prometheus, jaeger, etc.)

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [debug]
    metrics:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [debug]
    logs:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [debug]
```

---

## Validation Checklist

After bootstrapping, verify:

- [ ] Service emits spans visible in the Collector debug output or backend UI
- [ ] `service.name`, `service.version`, and `deployment.environment` appear on every span
- [ ] HTTP client and server spans are auto-instrumented without manual code
- [ ] Metrics visible in backend within two export intervals (default: 60 s)
- [ ] `trace_id` and `span_id` appear in structured log output
- [ ] Collector-to-backend pipeline confirmed (not direct SDK-to-backend)
- [ ] SDK shutdown called on process exit to flush remaining telemetry
