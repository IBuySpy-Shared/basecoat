---
name: resilience-patterns
description: "Use when reviewing or implementing circuit breakers, timeout hierarchies, bulkhead isolation, load shedding, or rate limiting in production code. Provides code-level checklists and configuration templates for graceful degradation."
---

# Resilience Patterns Skill

Use this skill when the task involves reviewing or implementing code-level resilience patterns: circuit breakers, timeout hierarchies, bulkhead isolation, load shedding, and rate limiting.

## When to Use

- Reviewing a service for missing or misconfigured circuit breakers
- Setting timeout values across a call chain
- Partitioning thread pools or connection pools with bulkheads
- Implementing load shedding and request prioritization
- Configuring server-side rate limiting with per-consumer limits
- Reviewing fallback and graceful degradation logic

## How to Invoke

Reference this skill by attaching `skills/resilience-patterns/SKILL.md` to your agent context, or instruct the agent:

> Use the resilience-patterns skill. Apply the circuit-breaker review checklist and the timeout hierarchy template to the service under review.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `circuit-breaker-review-checklist.md` | Per-call-site circuit breaker configuration review |
| `timeout-hierarchy-template.md` | Timeout budget assignment across service layers |
| `bulkhead-config-template.md` | Thread pool and connection pool partitioning design |
| `load-shedding-config-template.md` | Request prioritization and load shedding configuration |

## Workflow

1. Map all external call sites (HTTP, gRPC, DB, cache, queue) for the service.
2. Review each critical-path call site using `circuit-breaker-review-checklist.md`.
3. Validate the timeout hierarchy using `timeout-hierarchy-template.md`.
4. Verify bulkhead partitioning using `bulkhead-config-template.md`.
5. Review load shedding and rate limiting using `load-shedding-config-template.md`.
6. File GitHub issues for all Critical and High findings.

## Guardrails

- Do not accept implicit framework defaults for timeouts on critical-path calls.
- Do not allow a fallback to call another potentially-failing dependency — use static defaults or cache.
- Escalate missing circuit breakers on external critical-path calls to Critical severity.
- Do not recommend load shedding without also verifying that shed requests return immediately (< 5 ms).

## Agent Pairing

This skill is designed to be used alongside the `resilience-reviewer` agent. It is also compatible with `ha-architect` for topology-level resilience concerns and `sre-engineer` for SLO-aligned error budget policies.
