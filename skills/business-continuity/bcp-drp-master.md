# BCP/DRP Master Document

This is the canonical Business Continuity Plan (BCP) and Disaster Recovery Plan (DRP) template for a service or organization. It consolidates strategies, roles, procedures, and governance into a single reference document.

## Instructions

1. Complete all sections. Mark any section **N/A** only with an explicit rationale.
2. Review and re-approve this document at least annually or after any major architectural change.
3. Link all supporting runbooks, worksheets, and test reports from this document.
4. Store a printed or offline copy accessible during an infrastructure outage.

---

## Document Metadata

**Document Title:** Business Continuity and Disaster Recovery Plan
**Service / Organization:** _[name]_
**Document Owner:** _[name and role]_
**Version:** _[X.Y]_
**Last Updated:** _[YYYY-MM-DD]_
**Next Review:** _[YYYY-MM-DD]_
**Approval Authority:** _[name and role]_
**Regulatory Frameworks:** _[ISO 22301 / NIST SP 800-34 / SOC 2 / HIPAA / other]_
**Classification:** _[Internal / Confidential / Restricted]_

---

## 1. Purpose and Scope

### 1.1 Purpose

This document defines the strategies, procedures, and responsibilities required to maintain critical business operations during and after a disruptive event, and to recover IT systems to meet defined recovery time and recovery point objectives.

### 1.2 Scope

**In Scope:**

- _[List services, systems, and processes covered]_

**Out of Scope:**

- _[List explicitly excluded services or processes]_

### 1.3 Objectives

| Objective | Target |
|---|---|
| Minimum critical service availability | _[e.g., ≥ 99.9% per month]_ |
| RTO for Tier 1 services | _[e.g., 15 minutes]_ |
| RPO for Tier 1 services | _[e.g., 0 data loss]_ |
| Annual DR test completion | _[e.g., 100% of Tier 1 services]_ |

---

## 2. Roles and Responsibilities

| Role | Responsibilities | Primary Contact | Backup Contact |
|---|---|---|---|
| BCP/DRP Coordinator | Activates the plan; coordinates all response activities | | |
| Incident Commander | Technical decision authority during active event | | |
| Communications Lead | Internal and external status communications | | |
| Infrastructure Lead | Cloud, network, and data recovery operations | | |
| Application Lead | Service-level recovery and smoke testing | | |
| Security Lead | Security incident coordination; data integrity validation | | |
| Executive Sponsor | Business decisions; customer and regulatory communication | | |

---

## 3. Disruption Scenarios

### Scenario Classification

| Scenario | Tier 1 Impact | Tier 2 Impact | Typical Duration | Primary Response |
|---|---|---|---|---|
| Single availability zone failure | Yes | Yes | Minutes to hours | Automatic failover |
| Regional cloud provider outage | Yes | Yes | Hours to days | Cross-region failover |
| Ransomware / security incident | Yes | Yes | Hours to weeks | Incident response + DR |
| Data corruption | Yes | Yes | Hours to days | Restore from backup |
| Key person unavailability | Context | Context | Days to weeks | Runbook-based coverage |
| Supply chain / dependency outage | Context | Yes | Hours to days | Fallback paths |
| Physical facility loss | Context | Context | Days | Remote work + cloud |

### Scenario-Specific Responses

#### Scenario 1: Regional Cloud Provider Outage

1. Declare business continuity event.
2. Activate cross-region failover runbook (see DR Runbook).
3. Redirect DNS to secondary region.
4. Verify Tier 1 service health in secondary region.
5. Communicate status to stakeholders.
6. Monitor for primary region restoration.
7. Plan controlled failback.

#### Scenario 2: Ransomware or Security Incident

1. Isolate affected systems immediately.
2. Activate incident response plan (see `incident-responder` agent).
3. Assess scope of encryption or data exfiltration.
4. Engage security team and legal counsel.
5. Restore from last known-good backup (after forensic snapshot).
6. Communicate with regulators if required.

---

## 4. Recovery Strategies

| Service / Process | Tier | RTO Target | RPO Target | Recovery Strategy | Runbook Reference |
|---|---|---|---|---|---|
| | Tier 1 | | | Active-active / Active-passive / Backup-restore | |
| | Tier 2 | | | | |
| | Tier 3 | | | | |

---

## 5. Communication Plan

### Activation Trigger

The BCP/DRP is activated when any of the following conditions are met:

- Tier 1 service unavailable for > _[X]_ minutes without imminent resolution
- Confirmed data loss or corruption affecting Tier 1 or Tier 2 data
- Security incident with potential for extended outage
- Declared by BCP/DRP Coordinator or executive sponsor

### Notification Sequence

| # | Recipient | Method | Timing |
|---|---|---|---|
| 1 | On-call engineer | PagerDuty / phone | Immediately |
| 2 | Incident commander | Slack + phone | Within 5 minutes |
| 3 | Engineering leadership | Slack + email | Within 15 minutes |
| 4 | Executive sponsor | Phone | Tier 1 only; within 15 minutes |
| 5 | Customers / partners | Status page + email | Within 30 minutes |
| 6 | Regulators | Email | If legally required |

### Status Update Cadence

- First update: within 30 minutes of activation
- Subsequent updates: every 30 minutes during active event
- Resolution notice: within 1 hour of service restoration

---

## 6. Data Backup and Retention

| Data Asset | Backup Method | Frequency | Retention | Restore Tested |
|---|---|---|---|---|
| | | | | Yes / No |

---

## 7. Testing and Maintenance

| Activity | Frequency | Last Completed | Next Scheduled |
|---|---|---|---|
| Tabletop exercise | Quarterly | | |
| Functional DR test (Tier 2+) | Semi-annually | | |
| Full-interruption DR test (Tier 1) | Annually | | |
| BIA review | Annually | | |
| Document review and approval | Annually | | |
| Contact list validation | Quarterly | | |

---

## 8. Document History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | | | Initial release |

---

## References

- BIA: `skills/business-continuity/bia-template.md`
- RTO/RPO Worksheet: `skills/business-continuity/rto-rpo-worksheet.md`
- DR Runbooks: `skills/business-continuity/dr-runbook.md`
- DR Test Reports: `skills/business-continuity/dr-test-exercise.md`
- ISO 22301:2019 — Business Continuity Management Systems
- NIST SP 800-34 Rev. 1 — Contingency Planning Guide
