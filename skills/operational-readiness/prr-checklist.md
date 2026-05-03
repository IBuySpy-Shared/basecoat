# Production Readiness Review (PRR) Checklist

Use this checklist to evaluate whether a service meets the minimum bar for production launch. Complete every section and record the result for each item before the gate decision.

## Instructions

1. Fill in the service and review metadata at the top.
2. Mark each item **Pass**, **Fail**, or **N/A** with a brief note.
3. Any **Fail** on a Required item blocks launch.
4. Carry all **Fail** items forward as GitHub Issues before closing the review.

---

## Review Metadata

**Service:** _[service name]_
**Version / Commit:** _[version or SHA]_
**Review Date:** _[YYYY-MM-DD]_
**Reviewer(s):** _[names or roles]_
**Launch Target Date:** _[YYYY-MM-DD]_

---

## Section 1 — Deployment Readiness

| # | Item | Required | Result | Notes |
|---|---|---|---|---|
| 1.1 | Deployment automation tested end-to-end in staging | ✅ | | |
| 1.2 | Rollback procedure documented and rehearsed | ✅ | | |
| 1.3 | Database migrations are reversible (forward + backward) | ✅ | | |
| 1.4 | Feature flags configured for incremental rollout | Recommended | | |
| 1.5 | Canary or blue/green deployment plan in place | Recommended | | |
| 1.6 | Health checks passing on staging for ≥ 24 hours | ✅ | | |
| 1.7 | Deployment runbook reviewed by someone other than the author | ✅ | | |

## Section 2 — Security and Compliance

| # | Item | Required | Result | Notes |
|---|---|---|---|---|
| 2.1 | SAST scan completed with no critical or high findings open | ✅ | | |
| 2.2 | DAST or penetration test completed (or scheduled within 30 days of launch) | ✅ | | |
| 2.3 | No hardcoded secrets, tokens, or credentials in source or config | ✅ | | |
| 2.4 | Dependency audit completed; no critical CVEs unaddressed | ✅ | | |
| 2.5 | Data privacy impact assessment completed (if PII handled) | ✅ | | |
| 2.6 | Applicable compliance checklist completed (SOC 2, HIPAA, PCI-DSS) | Context | | |
| 2.7 | Access controls and least-privilege roles verified | ✅ | | |
| 2.8 | Secrets management solution validated (vault, managed identity, or equivalent) | ✅ | | |

## Section 3 — Performance and Scalability

| # | Item | Required | Result | Notes |
|---|---|---|---|---|
| 3.1 | Load test completed at projected peak load × 2 | ✅ | | |
| 3.2 | p99 latency and error rate within SLO targets under load | ✅ | | |
| 3.3 | Database query performance validated (no N+1, missing indexes) | ✅ | | |
| 3.4 | Cache strategy documented and cache hit rate baseline established | Recommended | | |
| 3.5 | Auto-scaling policies configured and tested | ✅ | | |
| 3.6 | Resource limits and requests set for all containers | ✅ | | |
| 3.7 | CDN or edge caching configured for static assets (if applicable) | Context | | |

## Section 4 — Observability

| # | Item | Required | Result | Notes |
|---|---|---|---|---|
| 4.1 | Structured logging configured and shipping to central store | ✅ | | |
| 4.2 | Key business and technical metrics available in dashboards | ✅ | | |
| 4.3 | Alerting rules configured for critical failure modes | ✅ | | |
| 4.4 | Distributed tracing enabled (if microservices or multi-hop calls) | Recommended | | |
| 4.5 | Error budget and SLO dashboard created | ✅ | | |
| 4.6 | Synthetic monitoring or uptime checks scheduled | Recommended | | |
| 4.7 | Log-based alerting for security events (auth failures, permission errors) | ✅ | | |

## Section 5 — Incident Response

| # | Item | Required | Result | Notes |
|---|---|---|---|---|
| 5.1 | On-call rotation established with at least two trained responders | ✅ | | |
| 5.2 | Runbooks written for the top three most likely failure modes | ✅ | | |
| 5.3 | Escalation procedures documented (L1 → L2 → engineering manager) | ✅ | | |
| 5.4 | War room / incident bridge communications channel defined | ✅ | | |
| 5.5 | PagerDuty (or equivalent) service configured and tested | ✅ | | |
| 5.6 | Post-mortem process and template shared with the team | ✅ | | |

## Section 6 — Reliability and Recovery

| # | Item | Required | Result | Notes |
|---|---|---|---|---|
| 6.1 | SLOs defined and baselined for at least one user journey | ✅ | | |
| 6.2 | Backup and restore procedure documented and tested | ✅ | | |
| 6.3 | Disaster recovery plan exists and covers this service | ✅ | | |
| 6.4 | RTO and RPO targets defined and validated through DR test | ✅ | | |
| 6.5 | Circuit breakers or fallback paths implemented for critical dependencies | Recommended | | |
| 6.6 | Graceful degradation tested (upstream dependency outage scenario) | Recommended | | |

## Section 7 — Documentation

| # | Item | Required | Result | Notes |
|---|---|---|---|---|
| 7.1 | Architecture diagram current and reviewed | ✅ | | |
| 7.2 | API documentation complete and published | ✅ | | |
| 7.3 | Operational runbooks written for critical paths | ✅ | | |
| 7.4 | Known issues and workarounds documented | ✅ | | |
| 7.5 | Team trained on runbooks and incident response procedures | ✅ | | |
| 7.6 | Change log or release notes prepared | Recommended | | |

---

## PRR Summary

| Section | Required Items | Passed | Failed | N/A |
|---|---|---|---|---|
| Deployment | 5 | | | |
| Security | 7 | | | |
| Performance | 4 | | | |
| Observability | 4 | | | |
| Incident Response | 6 | | | |
| Reliability | 4 | | | |
| Documentation | 5 | | | |
| **Total** | **35** | | | |

## Blocking Issues

_List all Failed Required items here. Each must have a linked GitHub Issue before the review is complete._

| Issue | Item | Owner | Target Resolution |
|---|---|---|---|
| | | | |

---

## References

- Google SRE Book, Ch. 32 — Production Readiness Reviews
- NIST SP 800-34 — Contingency Planning Guide for Federal Information Systems
