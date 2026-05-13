---

name: data-tier
description: "Use when designing schemas, writing migrations, reviewing queries, or defining repository and indexing patterns for an application's data layer. USE FOR: design a relational schema, write migration with rollback support, review SQL for N+1 or missing indexes, build a data dictionary, define repository or data access patterns. DO NOT USE FOR: business UI copywriting, infrastructure-only deployment tasks, debugging frontend CSS."
compatibility:
  editors:
    - vscode
  platforms:
    - github
metadata:
  category: "Uncategorized"
  tags: ["uncategorized"]
  maturity: "beta"
  audience: ["developers"]
allowed-tools: ["bash", "git", "grep", "find"]
---

# Data Tier Skill

Use this skill when the task involves schema design, database migrations, query review, indexing strategy, or data access pattern definition.

## When to Use

- Designing a new schema or extending an existing one
- Writing a migration with rollback support
- Reviewing queries for N+1 risk, missing indexes, or unbounded result sets
- Building a data dictionary for a domain
- Establishing the repository or data access layer for a service

## How to Invoke

Reference this skill by attaching `skills/data-tier/SKILL.md` to your agent context, or instruct the agent:

> Use the data-tier skill. Apply the schema design template, migration template, and query review checklist to the data work being done.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `schema-design-template.md` | Schema design document: entities, attributes, relationships, constraints, and indexes |
| `migration-template.md` | Migration scaffold with up/down blocks, rollback plan, and zero-downtime notes |
| `query-review-checklist.md` | Query review checklist: N+1 check, index usage, pagination, explain plan guidance |
| `data-dictionary-template.md` | Data dictionary: table, column, type, nullable, description, and example values |

## Agent Pairing

This skill is designed to be used alongside the `data-tier` agent. The agent drives the workflow; this skill provides the reference templates and review checklists.

The data tier persists domain entities defined by the `backend-dev` agent. Changes to schema require coordination with the `backend-dev` agent to keep repository patterns aligned.
