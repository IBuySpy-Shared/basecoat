# SLO Definition Template

## Service Details

- **Service name:**
- **Owner team:**
- **Reviewed by:**
- **Date:**
- **SLO version:** 1.0

---

## SLI and SLO Definitions

For each critical user journey or API endpoint, define one or more SLIs and the corresponding SLO target.

### SLI 1: Availability

| Field | Value |
|---|---|
| SLI definition | Percentage of HTTP requests that return a non-5xx response |
| Data source | Application metrics / APM / load balancer access log |
| SLO target | 99.9% over a 30-day rolling window |
| Error budget | 43.2 minutes / 30 days |
| Alert threshold | Page at 80% budget consumed within window |

### SLI 2: Latency

| Field | Value |
|---|---|
| SLI definition | Percentage of requests completing under 300 ms at p95 |
| Data source | APM traces / histogram metric |
| SLO target | 99% of requests under 300 ms at p95 over a 24-hour rolling window |
| Error budget | 14.4 minutes / day |
| Alert threshold | Alert at 2× p99 baseline sustained for 5 minutes |

### SLI 3: (add as needed)

| Field | Value |
|---|---|
| SLI definition | |
| Data source | |
| SLO target | |
| Error budget | |
| Alert threshold | |

---

## Burn-Rate Alert Thresholds

Set multi-window burn-rate alerts to catch both fast burns and slow burns:

| Window | Burn Rate Threshold | Alert Action |
|---|---|---|
| 1 hour | > 14× | Page immediately (fast burn — 2% budget in 1 h) |
| 6 hours | > 6× | Page immediately (medium burn — 5% in 6 h) |
| 1 day | > 3× | Ticket (slow burn — 10% in 1 day) |
| 3 days | > 1× | Ticket (sustained over-burn) |

---

## SLO Review Cadence

- **Weekly:** Review dashboard; escalate if burn rate > 1×.
- **Monthly:** Full SLO report; compare against error budget policy thresholds.
- **Quarterly:** Re-evaluate SLO targets against user expectations and growth.

---

## Dashboard and Monitoring Links

- SLO dashboard: ___
- Alert runbook: ___
- Error budget policy: `skills/sre/error-budget-policy.md`
