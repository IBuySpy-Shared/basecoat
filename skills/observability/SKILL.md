---
name: observability
description: "Use when instrumenting services with OpenTelemetry, designing structured log schemas, defining distributed trace topologies, establishing metrics naming conventions, authoring dashboards as code, or implementing correlation ID propagation. Provides OTEL setup guides, log/span/metric templates, and a correlation ID pattern."
---

# Observability Skill

Use this skill when the task involves adding, reviewing, or standardizing observability instrumentation across one or more services.

## When to Use

- Setting up the OpenTelemetry SDK for a new service or language runtime
- Reviewing whether a service emits consistent structured logs, traces, and metrics
- Designing the span hierarchy for a distributed transaction or critical user journey
- Defining or auditing metric names against the OTEL semantic convention
- Propagating correlation IDs across HTTP, message queue, or gRPC service boundaries
- Producing or reviewing a dashboard definition that should be stored as code

## How to Invoke

Reference this skill by attaching `skills/observability/SKILL.md` to your agent context, or instruct the agent:

> Use the observability skill. Apply the OTEL setup guide for Node.js, fill in the span design template for the checkout flow, and validate metric names against the naming convention.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `otel-setup-guide.md` | Per-language OpenTelemetry SDK bootstrap with trace, metric, and log providers |
| `structured-log-schema-template.md` | JSON structured log schema with required and optional fields |
| `span-design-template.md` | Span naming, attribute, and parent-child relationship design template |
| `metrics-naming-convention.md` | Metric instrument types, naming rules, and cardinality guardrails |
| `dashboard-as-code-template.md` | Grafana / Azure Monitor Workbook dashboard definition template |
| `correlation-id-pattern.md` | W3C TraceContext correlation ID propagation pattern and code snippets |

## Standards Alignment

These templates align with:

- **CNCF OpenTelemetry** semantic conventions (stable and experimental)
- **W3C TraceContext** specification for distributed context propagation
- **Azure Monitor** OpenTelemetry distro integration
- **Google SRE** four golden signals (latency, traffic, errors, saturation)
- **AWS Well-Architected** and **Azure WAF** Operational Excellence pillar

## Agent Pairing

This skill is designed to be used alongside the `observability-engineer` agent. The agent drives the instrumentation workflow; this skill provides reference templates and naming standards.

For service-level reliability concerns (SLOs, error budgets), coordinate with the `sre-engineer` agent. For deployment pipeline observability gaps, route to the `devops-engineer` agent.
