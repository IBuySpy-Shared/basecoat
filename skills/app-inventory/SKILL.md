---

name: app-inventory
description: "Use when inventorying legacy applications to capture dependencies, service bindings, framework versions, and migration complexity. USE FOR: inventory a legacy application portfolio, scan app dependencies and connection strings, assess migration complexity for an app, create an application inventory report, map external service bindings before modernization. DO NOT USE FOR: rewriting application code, deploying workloads, designing the target-state architecture."
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

# App Inventory Skill

## Overview

The App Inventory Skill provides reusable templates and workflows for systematically inventorying
legacy application portfolios. It pairs with the `app-inventory` agent to produce audit-ready
output that feeds into migration planning, sprint estimation, and treatment-matrix decisions.

## When to Use This Skill

- Starting a migration factory or modernisation programme
- Onboarding a new application portfolio before sprint planning
- Producing evidence for an architecture review board
- Assessing the blast radius of a dependency upgrade

## Templates Included

| File | Purpose |
|------|---------|
| `inventory-report-template.md` | Markdown report for architecture reviews and stakeholders |
| `complexity-scoring-template.md` | Scoring worksheet to derive the migration complexity score |

## Workflow

### 1. Trigger a scan

Invoke the `app-inventory` agent and collect its JSON output. Save it alongside the repo
or attach it to the relevant GitHub issue.

### 2. Fill the complexity scoring template

Open `complexity-scoring-template.md` and rate each of the six dimensions. The weighted
total becomes the overall complexity score.

### 3. Populate the inventory report template

Use the structured scan output to fill `inventory-report-template.md`. This document
becomes the canonical record for that application in the ADR log.

### 4. Select a treatment path

Bring the complexity score and strategic-value rating to `docs/treatment-matrix.md` to
select Retire, Rehost, Replatform, Refactor, Rebuild, or Replace.

### 5. Hand off to downstream agents

- **Low complexity / Rehost**: pass to `containerization-planner`
- **Replatform**: pass to `legacy-modernization` + `config-auditor`
- **Refactor / Rebuild**: pass to `solution-architect` + `backend-dev`
- **Dependency upgrades**: pass to `dependency-lifecycle`

## Paired Agent

`agents/app-inventory.agent.md`

## Related Assets

- `docs/app-inventory.md` — conceptual guide and parameter reference
- `docs/treatment-matrix.md` — decision framework for app disposition
- `agents/legacy-modernization.agent.md` — executes the strangler-fig pattern
- `agents/dependency-lifecycle.agent.md` — manages discovered dependency upgrades
- `skills/service-bus-migration/SKILL.md` — messaging migration patterns
- `skills/identity-migration/SKILL.md` — authentication migration patterns
