# Circuit Breaker Review Checklist

**Reviewer:**
**Date:**
**Service:**

## Scoring Key

- ✅ Pass — configured correctly
- ❌ Fail (Critical) — call site is unprotected or misconfigured in a blocking way
- ⚠️ Fail (High) — significant risk of cascading failure
- N/A — not applicable (non-critical-path call)

---

## Per-Call-Site Review

Repeat this section for each external call site on the critical path.

### Call Site: < Name >

**Downstream dependency:** < service / DB / cache >
**Criticality:** < Critical-path | Non-critical | Background >
**Framework / library used:** < Resilience4j | Polly | Hystrix | Custom | None >

| ID | Check | Status | Notes |
|---|---|---|---|
| CB-1 | Circuit breaker is explicitly configured — not relying on framework defaults | | |
| CB-2 | Failure threshold is set based on expected p99 error rate (not arbitrary 100%) | | |
| CB-3 | Timeout is set to 2× the p99 latency of the downstream under normal conditions | | |
| CB-4 | Half-open state permits only one probe request before fully re-closing | | |
| CB-5 | State transitions emit metrics (open, close, half-open events are observable) | | |
| CB-6 | A fallback is defined and tested when the breaker is open | | |
| CB-7 | Fallback does NOT call another potentially-failing dependency | | |
| CB-8 | Retry policy respects the outer caller's timeout budget (no retry amplification) | | |

**Configuration:**

```yaml
failure_threshold: %
timeout: s
half_open_probe_count: 1
fallback: < static value | cache | feature-flag-disabled >
metrics_emitted: yes / no
```

---

## Summary

| Call Site | Status | Critical Findings |
|---|---|---|
| < name > | ✅ / ❌ / ⚠️ | |

## Critical Findings

| ID | Call Site | Description | Recommended Fix |
|---|---|---|---|
| | | | |
