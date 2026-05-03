---
name: business-continuity
description: "BCP/DRP planning templates including BIA, RTO/RPO worksheets, DR tests, and runbooks aligned to ISO 22301 and NIST SP 800-34."
---

# Business Continuity Skill

Use this skill when a team needs to create, review, or validate business continuity and disaster recovery documentation. The templates guide structured analysis from business impact through recovery validation.

## When to Use

- Conducting a Business Impact Analysis (BIA) for a service or product line
- Authoring or reviewing a BCP/DRP master document
- Defining RTO/RPO targets and validating that infrastructure can meet them
- Planning and documenting a DR test exercise (tabletop, functional, or full-interruption)
- Writing recovery runbooks for catastrophic failure scenarios
- Preparing for an ISO 22301, SOC 2, or NIST SP 800-34 audit

## How to Invoke

Reference this skill by attaching `skills/business-continuity/SKILL.md` to your agent context, or instruct the agent:

> Use the business-continuity skill. Start with the BIA template, then derive RTO/RPO targets using the worksheet.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `bia-template.md` | Business Impact Analysis — identifies critical processes, assesses disruption impact, and derives RTO/RPO requirements |
| `bcp-drp-master.md` | BCP/DRP Master Document — canonical continuity and recovery plan covering strategies, roles, and procedures |
| `rto-rpo-worksheet.md` | RTO/RPO Worksheet — validates infrastructure recovery capabilities against business-derived time objectives |
| `dr-test-exercise.md` | DR Test Exercise Template — structures tabletop, functional, and full-interruption test planning and results capture |
| `dr-runbook.md` | Disaster Recovery Runbook — step-by-step recovery procedures for catastrophic failure scenarios |

## Agent Pairing

This skill is designed to be used alongside the `business-continuity` agent. The agent drives the planning workflow; this skill provides the structured templates.

Pair with `production-readiness` agent when validating that the BCP/DRP is referenced in a PRR gate record. Pair with `incident-responder` for active continuity events. Pair with `sre-engineer` when aligning DR targets to SLO definitions.

## Standards Reference

- ISO 22301 — Business Continuity Management Systems
- NIST SP 800-34 — Contingency Planning Guide for Federal Information Systems
- NIST SP 800-53 — CP controls family (Contingency Planning)
- SOC 2 Trust Service Criteria — Availability
