# Load Shedding Configuration Template

**Reviewer:**
**Date:**
**Service:**

## Rate Limiting

| Consumer Scope | Limit | Window | Enforcement Point | Notes |
|---|---|---|---|---|
| Per API key | req/s | 1 s | API Gateway / service | |
| Per user ID | req/min | 1 min | Application layer | |
| Per IP (unauthenticated) | req/min | 1 min | API Gateway | |
| Global service limit | req/s | 1 s | Load balancer | |

Rate limiting validation:

- [ ] Limits are enforced server-side — client-side enforcement alone is NOT sufficient
- [ ] 429 response includes `Retry-After` header with recommended backoff value
- [ ] Rate limit counters are backed by a shared store (Redis / database), not in-memory only
- [ ] Rate limit metrics are tracked per consumer and alert on sustained limit-hitting
- [ ] Rate limits are applied per consumer (API key, user, IP), not only as a global counter

## Request Queue and Concurrency Limits

| Component | Max Concurrent Requests | Max Queue Depth | Overflow Action |
|---|---|---|---|
| < Service A > | | | Reject with 503 |
| < Service B > | | | Reject with 503 |

Queue validation:

- [ ] Maximum concurrency or queue depth is defined — no unbounded queuing
- [ ] Overflow returns 503 immediately (< 5 ms) — not after a long wait
- [ ] Queue depth metric is tracked and alerts at 80% saturation

## Request Prioritization

Define priority tiers for load shedding under saturation:

| Priority | Request Type | Example Paths | Shed Last? |
|---|---|---|---|
| P0 — Never shed | Health checks, admin operations | `/health`, `/metrics`, `/admin` | Always serve |
| P1 — Shed last | Authenticated user-facing requests | `/api/v1/orders`, `/api/v1/checkout` | Shed after P2/P3 exhausted |
| P2 — Shed early | Background sync, webhooks | `/api/v1/sync`, `/webhooks` | Shed before P1 |
| P3 — Shed first | Analytics, non-critical reporting | `/api/v1/reports` | Shed first |

## Backpressure

- [ ] Service propagates backpressure to upstream callers via 503 + `Retry-After`
- [ ] Service does not silently queue and delay requests under load
- [ ] Load shedding behavior is tested under synthetic load in staging

## Validation

- [ ] Load test confirms shed requests return in < 5 ms
- [ ] P0 requests are never rejected under any realistic load scenario
- [ ] Rate limit and queue depth metrics are visible on the service dashboard
