---
name: database-migration
description: "Use when planning or executing database migrations: zero-downtime schema evolution, expand-contract patterns, blue-green DB deployments, and rollback strategies. Provides migration runbook, validation checklist, and rollback templates."
---

# Database Migration Skill

Use this skill when the task involves schema migrations, data platform moves, zero-downtime upgrades, or blue-green database deployments.

## When to Use

- Planning a schema migration with zero-downtime requirements
- Executing an expand-contract migration across multiple releases
- Designing a blue-green database deployment strategy
- Reviewing a migration for data loss or rollback risk
- Writing a pre/post migration validation checklist

## How to Invoke

Reference this skill by attaching `skills/database-migration/SKILL.md` to your agent context, or instruct the agent:

> Use the database-migration skill. Apply the migration runbook template and validation checklist to the migration being planned.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `migration-runbook-template.md` | Step-by-step runbook for executing a migration with rollback procedures |
| `expand-contract-guide.md` | Expand-contract pattern walkthrough for zero-downtime schema changes |
| `validation-checklist.md` | Pre- and post-migration data integrity and performance validation checklist |

## Key Patterns

| Pattern | Use Case |
|---|---|
| Expand-contract | Rename columns, change types, restructure tables without downtime |
| Dual-write | Migrate data stores with zero read downtime |
| Blue-green DB | Full environment swap with instant rollback capability |
| Shadow table | Validate new schema in parallel before cutting over |
| CDC-based migration | Continuous replication for large-table zero-downtime moves |

## Agent Pairing

This skill pairs with the `database-migration` agent (for migration planning) and the `data-tier` agent (for schema design). Coordinate with the `devops-engineer` agent when migration steps must be integrated into CI/CD pipelines.
