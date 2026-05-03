# Business Impact Analysis (BIA) Template

Use this template to identify critical business processes, assess the impact of disruption, and derive Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO).

## Instructions

1. Complete the BIA metadata.
2. Inventory all in-scope business processes and supporting systems.
3. For each process, assess impact across all four categories using the impact scale.
4. Derive the Maximum Tolerable Downtime (MTD) and set RTO ≤ MTD.
5. Determine RPO based on acceptable data loss.
6. Assign a criticality tier based on the composite impact and MTD.

### Impact Scale

| Score | Financial | Regulatory | Reputational | Operational |
|---|---|---|---|---|
| 1 — Negligible | < $1 K/hr loss | No obligation | Internal notice only | Minor workflow delays |
| 2 — Minor | $1 K–$10 K/hr | Reporting risk | Limited media coverage | Single team impacted |
| 3 — Moderate | $10 K–$100 K/hr | Potential violation | Public coverage possible | Multiple teams impacted |
| 4 — Significant | $100 K–$1 M/hr | Confirmed violation | Brand damage | Core operations impacted |
| 5 — Critical | > $1 M/hr | Regulatory action | Existential risk | All operations impacted |

---

## BIA Metadata

**Organization / Service:** _[name]_
**Analysis Date:** _[YYYY-MM-DD]_
**Analyst(s):** _[names or roles]_
**Review Cycle:** _[annual / semi-annual]_
**Next Review:** _[YYYY-MM-DD]_
**Regulatory Frameworks in Scope:** _[ISO 22301 / NIST SP 800-34 / SOC 2 / HIPAA / other]_

---

## Process Inventory

List all in-scope processes and supporting systems.

| Process ID | Process Name | Owner | Supporting Systems | Dependencies |
|---|---|---|---|---|
| P-001 | | | | |
| P-002 | | | | |
| P-003 | | | | |

---

## Impact Assessment

Complete one row per process.

| Process ID | Financial Impact (1–5) | Regulatory Impact (1–5) | Reputational Impact (1–5) | Operational Impact (1–5) | Composite Score | MTD | RTO Target | RPO Target | Criticality Tier |
|---|---|---|---|---|---|---|---|---|---|
| P-001 | | | | | | | | | |
| P-002 | | | | | | | | | |
| P-003 | | | | | | | | | |

**Composite Score** = maximum of the four impact scores (not average).

### Criticality Tier Assignment

| Tier | Composite Score | MTD | Description |
|---|---|---|---|
| Tier 1 — Mission Critical | 5 | ≤ 15 minutes | Complete loss has immediate, irreversible business impact |
| Tier 2 — Business Critical | 4 | ≤ 4 hours | Loss significantly impairs operations within hours |
| Tier 3 — Operational | 3 | ≤ 24 hours | Loss disrupts operations but workarounds exist |
| Tier 4 — Deferrable | 1–2 | ≤ 72 hours | Loss creates inconvenience; recovery can be deferred |

---

## Dependency Map

Document external and internal dependencies for Tier 1 and Tier 2 processes.

| Process ID | Dependency Name | Type | Owner | Failure Consequence | Alternate |
|---|---|---|---|---|---|
| | | Internal / External | | | |

---

## BIA Summary

| Tier | Process Count | Services |
|---|---|---|
| Tier 1 — Mission Critical | | |
| Tier 2 — Business Critical | | |
| Tier 3 — Operational | | |
| Tier 4 — Deferrable | | |

**Highest RTO required (tightest):** _[e.g., 15 minutes for P-001]_
**Highest RPO required (tightest):** _[e.g., 0 data loss for P-001]_

---

## Recommended Next Steps

- [ ] Validate RTO/RPO targets with infrastructure capabilities (`rto-rpo-worksheet.md`)
- [ ] Author or update BCP/DRP master document (`bcp-drp-master.md`)
- [ ] Write DR runbooks for all Tier 1 and Tier 2 processes (`dr-runbook.md`)
- [ ] Schedule DR test exercise (`dr-test-exercise.md`)
- [ ] File GitHub Issues for all gaps where current capabilities do not meet targets

---

## References

- ISO 22301:2019 — Clause 8.2 Business Impact Analysis
- NIST SP 800-34 Rev. 1 — Section 2.2 BIA
