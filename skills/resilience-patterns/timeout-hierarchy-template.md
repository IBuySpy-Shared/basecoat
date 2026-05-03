# Timeout Hierarchy Template

**Reviewer:**
**Date:**
**Service:**

## Timeout Budget

Assign timeout budgets from outermost to innermost layer. Each inner layer MUST have a shorter timeout than its caller so the outer layer does not time out before the inner layer has a chance to return an error.

| Layer | Component | Configured Timeout | p99 Latency (baseline) | Budget Remaining | Notes |
|---|---|---|---|---|---|
| External client (browser/mobile) | | s | s | s | |
| API Gateway / load balancer | | s | s | s | |
| Application service | | s | s | s | |
| Downstream microservice | | s | s | s | |
| Cache | | ms | ms | ms | |
| Database query | | s | ms | s | |
| External third-party API | | s | s | s | |

## Validation Rules

- [ ] No call site has an unbounded timeout (relies on OS or library default)
- [ ] Each inner layer timeout < outer layer timeout
- [ ] `(retries × per-attempt-timeout) < outer caller timeout` — no retry amplification
- [ ] Database queries have per-query timeouts, not only connection-level timeouts
- [ ] Background jobs have separate, larger timeout budgets than interactive paths

## Retry Policy Interaction

For each retried call site, verify the total retry budget:

| Call Site | Timeout per Attempt | Max Retries | Total Budget | Outer Caller Timeout | Safe? |
|---|---|---|---|---|---|
| < name > | s | N | total=N×s | s | Yes / No |

## Anti-Patterns Detected

| Pattern | Description | Fix |
|---|---|---|
| No timeout | < call site > has no explicit timeout | Set to 2× p99 latency |
| Inner ≥ outer | < inner > timeout ≥ < outer > timeout | Reduce inner to ≤ 80% of outer |
| Retry amplification | retries × timeout > outer budget | Reduce retry count or per-attempt timeout |
