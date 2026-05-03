# Service Maturity Scorecard

Use this scorecard to measure a service's operational maturity before launch or as a periodic health check. Score each dimension independently and produce an overall maturity tier.

## Instructions

1. Score each capability item from **0** (not present) to **3** (fully automated and monitored).
2. Sum the scores within each dimension to get a dimension score.
3. Divide total score by maximum possible score to derive the maturity percentage.
4. Map the percentage to the maturity tier table.
5. Identify the lowest-scoring dimensions for targeted improvement.

### Scoring Scale

| Score | Meaning |
|---|---|
| 0 | Not implemented |
| 1 | Partially implemented or manual |
| 2 | Implemented but not fully automated or monitored |
| 3 | Fully automated, monitored, and tested |

---

## Scorecard Metadata

**Service:** _[service name]_
**Assessment Date:** _[YYYY-MM-DD]_
**Assessor(s):** _[names or roles]_
**Previous Score:** _[% or N/A]_

---

## Dimension 1 — Deployment and Release (max 18)

| # | Capability | Score (0–3) | Notes |
|---|---|---|---|
| 1.1 | Deployment pipeline fully automated | | |
| 1.2 | Rollback procedure automated and tested | | |
| 1.3 | Feature flag infrastructure in place | | |
| 1.4 | Canary or progressive rollout supported | | |
| 1.5 | Database migration strategy (forward/backward) | | |
| 1.6 | Deployment frequency tracked | | |
| **Dimension 1 Total** | | **/18** | |

## Dimension 2 — Observability (max 18)

| # | Capability | Score (0–3) | Notes |
|---|---|---|---|
| 2.1 | Structured logging to central store | | |
| 2.2 | Service dashboards for key metrics | | |
| 2.3 | Alerting on SLO burn rate | | |
| 2.4 | Distributed tracing enabled | | |
| 2.5 | Synthetic monitoring / uptime checks | | |
| 2.6 | Error budget dashboard | | |
| **Dimension 2 Total** | | **/18** | |

## Dimension 3 — Reliability and Recovery (max 18)

| # | Capability | Score (0–3) | Notes |
|---|---|---|---|
| 3.1 | SLOs defined and baselined | | |
| 3.2 | Backup and restore procedure tested | | |
| 3.3 | Disaster recovery plan and RTO/RPO targets | | |
| 3.4 | Circuit breakers or fallback patterns | | |
| 3.5 | Graceful degradation validated | | |
| 3.6 | Chaos experiments conducted | | |
| **Dimension 3 Total** | | **/18** | |

## Dimension 4 — Security and Compliance (max 18)

| # | Capability | Score (0–3) | Notes |
|---|---|---|---|
| 4.1 | SAST integrated in CI pipeline | | |
| 4.2 | Dependency vulnerability scanning automated | | |
| 4.3 | Secrets management solution in use | | |
| 4.4 | Least-privilege access controls enforced | | |
| 4.5 | Security incident response runbook | | |
| 4.6 | Compliance controls validated | | |
| **Dimension 4 Total** | | **/18** | |

## Dimension 5 — Incident Response (max 18)

| # | Capability | Score (0–3) | Notes |
|---|---|---|---|
| 5.1 | On-call rotation with trained responders | | |
| 5.2 | Runbooks for top failure modes | | |
| 5.3 | Escalation path documented and tested | | |
| 5.4 | Post-mortem process in use | | |
| 5.5 | MTTD and MTTR tracked | | |
| 5.6 | Incident simulation or game day conducted | | |
| **Dimension 5 Total** | | **/18** | |

---

## Overall Score

| Metric | Value |
|---|---|
| Total Score | _[sum of all dimensions]_ / 90 |
| Maturity Percentage | _[total / 90 × 100]_ % |

## Maturity Tier

| Tier | Score Range | Description |
|---|---|---|
| 🔴 Tier 1 — Initial | 0–39% | Ad hoc, high operational risk. Launch not recommended. |
| 🟠 Tier 2 — Managed | 40–59% | Basic controls in place. Launch with conditions and mitigations. |
| 🟡 Tier 3 — Defined | 60–74% | Consistently applied practices. Launch acceptable for low-criticality services. |
| 🟢 Tier 4 — Optimizing | 75–89% | Automated, measured, and continuously improved. Recommended for production launch. |
| 🔵 Tier 5 — Excellent | 90–100% | Best-in-class operational practices. Full production readiness. |

**Service Tier:** _[tier based on score]_

---

## Improvement Targets

_List the three lowest-scoring capabilities and define improvement actions._

| Capability | Current Score | Target Score | Action | Owner | Due Date |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |
