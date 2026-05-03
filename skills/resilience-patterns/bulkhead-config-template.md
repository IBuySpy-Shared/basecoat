# Bulkhead Configuration Template

**Reviewer:**
**Date:**
**Service:**

## Purpose

Bulkheads partition resource pools so that a failure or degradation in one downstream dependency cannot exhaust shared resources and cascade to other, unaffected paths.

---

## Thread Pool Partitions

Define a separate thread pool for each distinct downstream dependency or workload type.

| Pool Name | Downstream / Purpose | Max Threads | Queue Depth | Overflow Action | Metrics Emitted |
|---|---|---|---|---|---|
| `payment-pool` | Payment service HTTP calls | 20 | 10 | Reject (503) | pool_utilization, rejection_count |
| `db-oltp-pool` | Database (user-facing queries) | 50 | 20 | Reject (503) | |
| `db-batch-pool` | Database (batch jobs) | 10 | 100 | Queue | |
| `cache-pool` | Cache read/write operations | 50 | 50 | Reject (503) | |
| `background-pool` | Non-critical background work | 10 | 500 | Queue | |

## Connection Pool Partitions

Define separate connection pools for each data store or external service.

| Pool Name | Target | Min Connections | Max Connections | Idle Timeout | Metrics Emitted |
|---|---|---|---|---|---|
| `db-app-pool` | Application database | 5 | 50 | 30 s | pool_size, idle_count, wait_time |
| `db-report-pool` | Reporting replica | 2 | 10 | 60 s | |
| `redis-pool` | Cache cluster | 5 | 20 | 30 s | |

## Semaphore Limits (for async / non-thread-pool calls)

| Semaphore Name | Purpose | Max Concurrent Permits |
|---|---|---|
| `cache-miss-fetch` | Limit concurrent cache-miss DB fetches | 20 |
| `external-api` | Limit concurrent third-party API calls | 10 |

## Sizing Guidelines

- Set thread pool size based on: `expected_peak_RPS × p99_latency_seconds × safety_factor (1.25)`.
- Never share a pool between a critical-path operation and a background or batch operation.
- Queue depth should be small for real-time pools (10–20) to fail fast; larger for batch pools.

## Validation Checklist

- [ ] Each downstream dependency has its own pool — no shared global pool
- [ ] Pool size is calculated from peak concurrency, not set arbitrarily
- [ ] Pool exhaustion emits metrics and alerts at 80% utilization
- [ ] Overflow returns immediately (< 5 ms) with a 503 response
- [ ] Batch and OLTP workloads use separate database connection pools
- [ ] Load test confirms that one saturated pool does not degrade unrelated paths
