---
name: data-integrity
description: "Use when assessing ACID compliance, selecting eventual consistency strategies, defining conflict resolution patterns, or verifying backup integrity in distributed or multi-database systems."
---

# Data Integrity Skill

Use this skill when the task involves reviewing or designing data integrity controls in distributed systems — including ACID transactions, eventual consistency patterns, conflict resolution, backup verification, and replication health.

## When to Use

- Reviewing a multi-step write path for atomicity and rollback coverage
- Selecting the appropriate consistency level for a new data domain
- Evaluating conflict resolution strategy for an eventually-consistent store
- Auditing backup configuration and testing restore procedures
- Designing a replication health monitoring and alerting plan
- Investigating a data loss or data divergence incident

## How to Invoke

Reference this skill by attaching `skills/data-integrity/SKILL.md` to your agent context, or instruct the agent:

> Use the data-integrity skill. Apply the ACID review checklist, consistency strategy matrix, and backup verification checklist to the system being assessed.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `acid-review-checklist.md` | ACID compliance review for each write path |
| `consistency-strategy-template.md` | Consistency level selection and documentation per data domain |
| `conflict-resolution-template.md` | Conflict resolution pattern documentation and test plan |
| `backup-verification-checklist.md` | Backup and restore verification checklist |

## Workflow

1. Map all data domains and their write paths.
2. Review each write path for ACID compliance using `acid-review-checklist.md`.
3. Select and document the consistency strategy for each domain using `consistency-strategy-template.md`.
4. Document and validate the conflict resolution pattern using `conflict-resolution-template.md`.
5. Audit backup configuration and test results using `backup-verification-checklist.md`.
6. File GitHub issues for all Critical and High gaps found.

## Guardrails

- Do not accept "eventual consistency" as a default — explicitly document convergence guarantees and compensating transactions.
- Do not mark a backup as verified without a successful restore test result.
- Escalate any multi-step write path without transaction or saga compensation to Critical severity.
- Refer HA replication topology design to the `high-availability` skill.

## Agent Pairing

This skill is designed to be used alongside the `data-integrity` agent. It is also compatible with `data-tier` for relational schema and migration concerns.
