---
name: ha-resilience
title: High-Availability & Resilience Design Patterns
description: Use when designing multi-AZ/region resilience with circuit breakers, retries, chaos testing, and SRE practices
compatibility:
  editors:
    - vscode
  platforms:
    - github
metadata:
  domain: infrastructure
  maturity: production
  audience: [architect, sre, devops-engineer]
allowed-tools: [terraform, kubernetes, python, bash, docker]
---

## HA & Resilience Skill

Use this skill when designing and testing highly available, fault-tolerant systems. The typical input is a workload architecture, an SLO target, dependency failure modes, and recovery objectives such as RTO and RPO. The output should produce resilient design guidance, concrete pattern choices, and validation steps that reduce blast radius and improve recovery behavior. It returns practical recommendations for retries, failover, health checks, steady-state assumptions, and operational guardrails.

## When to Use

- Services that must survive instance, zone, or regional failures
- APIs that depend on flaky downstream systems and need retries or circuit breakers
- Platforms that need health probes, failover rules, chaos testing, or error-budget guardrails

## Inputs and Outputs

- **Input**: service topology, dependency map, traffic profile, SLOs, and expected failure scenarios
- **Input**: platform constraints such as Kubernetes, cloud networking, load balancers, and deployment model
- **Output**: recommended resilience patterns, configuration examples, and test scenarios
- **Output**: a design review summary that produces next steps for implementation and operational readiness

## Reference Files

| File | Contents |
|------|----------|
| [`references/patterns.md`](references/patterns.md) | Multi-region active-active (Terraform), circuit breaker (Go), retry + jitter (Python), bulkhead pattern, error budget tracking |
| [`references/testing.md`](references/testing.md) | Chaos test script, test scenarios, k6 load testing, SLO validation checklist |

## Core Patterns

| Pattern | Use Case | Key Rule |
|---------|---------|---------|
| Circuit Breaker | Prevent cascade failures | Opens after N failures; half-open after timeout |
| Retry + Jitter | Transient faults | Exponential backoff + random jitter; cap at max_delay |
| Bulkhead | Dependency isolation | Separate thread pools per downstream dependency |
| Multi-region | Regional outages | Route53 health check + failover; read replica in secondary |
| Error Budget | Deployment safety | Block deployments when burn rate > 3× |

## SLO Quick Reference

- 99.9% availability = 43.8 min/month downtime budget
- 99.95% = 21.9 min/month
- 99.99% = 4.4 min/month

## Example Configuration

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 20
  failureThreshold: 3
```

Use probes like these to ensure traffic only reaches healthy replicas and to produce clear restart signals when a workload stops making progress. Pair them with retry budgets, circuit breakers, and regional failover so the output architecture returns graceful degradation instead of cascading failure.

## References

- [AWS Well-Architected Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/)
- [Chaos Engineering Principles](https://principlesofchaos.org/)
- [Release It! (Nygard)](https://pragprog.com/titles/mnee2/release-it-second-edition/)
