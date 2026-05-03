---
name: data-architecture
description: "Use when designing data models, planning schema versioning, building ETL/ELT pipelines, or architecting data mesh and lakehouse patterns. Provides medallion layer templates, governance checklists, and pipeline design guides."
---

# Data Architecture Skill

Use this skill when the task involves data modeling, schema versioning, ETL/ELT design, data mesh topology, or lakehouse architecture.

## When to Use

- Designing a new data warehouse, data lake, or lakehouse
- Planning Flyway or Liquibase schema versioning workflows
- Architecting ETL or ELT pipelines with transformation layers
- Defining data mesh domain ownership and federated governance
- Establishing medallion layer (bronze/silver/gold) boundaries
- Evaluating data governance, quality, and lineage requirements

## How to Invoke

Reference this skill by attaching `skills/data-architecture/SKILL.md` to your agent context, or instruct the agent:

> Use the data-architecture skill. Apply the medallion layer template, schema versioning guide, and pipeline design checklist to the data work.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `medallion-layer-template.md` | Medallion architecture design document: bronze/silver/gold layer definitions, ownership, and SLAs |
| `schema-versioning-guide.md` | Flyway/Liquibase schema versioning patterns: naming conventions, rollback scripts, and CI integration |
| `pipeline-design-checklist.md` | ETL/ELT pipeline checklist: source connectivity, transformation rules, data quality gates, and monitoring |
| `data-mesh-topology-template.md` | Data mesh domain design: bounded contexts, data product contracts, and federated governance rules |

## Agent Pairing

This skill is designed to be used alongside the `data-architect` agent. The agent drives the architecture workflow; this skill provides the reference templates and patterns.

For operational data concerns (schemas, queries, migrations), coordinate with the `data-tier` agent. For pipeline orchestration and quality, coordinate with the `dataops` agent.
