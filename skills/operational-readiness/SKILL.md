---
name: operational-readiness
description: "Use when assessing service launch readiness, running Production Readiness Reviews (PRR), scoring service maturity, or designing post-launch monitoring plans. Provides PRR checklists, maturity scorecards, launch gates, and monitoring plan templates."
---

# Operational Readiness Skill

Use this skill when preparing a service for production launch, conducting a PRR gate review, scoring service maturity against a defined rubric, or designing the post-launch monitoring strategy.

## When to Use

- Running a Production Readiness Review (PRR) before a new service launch
- Scoring a service against a maturity model to identify operational gaps
- Defining the launch-readiness gate criteria and approvers
- Designing a post-launch monitoring plan aligned to SLOs
- Performing a re-review after a major architectural change or incident

## How to Invoke

Reference this skill by attaching `skills/operational-readiness/SKILL.md` to your agent context, or instruct the agent:

> Use the operational-readiness skill. Apply the PRR checklist and service maturity scorecard to the service being reviewed.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `prr-checklist.md` | Production Readiness Review checklist covering deployment, security, performance, observability, incident response, and documentation |
| `service-maturity-scorecard.md` | Scored rubric for measuring service operational maturity across five dimensions |
| `launch-readiness-gate.md` | Formal launch gate template with decision record, approvers, conditions, and sign-off |
| `post-launch-monitoring-plan.md` | Post-launch monitoring plan template defining watch windows, escalation thresholds, and stabilization criteria |

## Agent Pairing

This skill is designed to be used alongside the `production-readiness` agent. The agent drives the PRR workflow; this skill provides the templates and scoring rubrics.

Pair with `sre-engineer` when defining SLOs, error budgets, or alerting rules as part of launch readiness. Pair with `chaos-engineer` when validating resilience and recovery procedures before launch.

## Standards Reference

- Google SRE Book, Chapter 32 — Production Readiness Reviews
- NIST SP 800-34 — Contingency Planning Guide
- ISO 20000-1 — IT Service Management
