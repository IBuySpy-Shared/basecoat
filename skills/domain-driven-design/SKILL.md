---
name: domain-driven-design
description: "Use when decomposing domains into bounded contexts, designing aggregates, mapping context relationships, or facilitating event storming. Provides templates for bounded context maps, aggregate design, and domain glossaries."
---

# Domain-Driven Design Skill

Use this skill when the task involves domain decomposition, service boundary definition, aggregate modeling, or establishing a ubiquitous language with stakeholders.

## When to Use

- Decomposing a monolith or greenfield system into bounded contexts
- Identifying aggregate roots, entities, value objects, and invariants
- Mapping relationships between bounded contexts (ACL, Open Host, Published Language)
- Building a shared domain glossary (ubiquitous language) with the team
- Facilitating event storming to discover domain events, commands, and policies

## Workflow

1. **Scope the domain** — identify the core domain, supporting subdomains, and generic subdomains. Confirm which bounded context you are working within.
2. **Run or review event storming output** — list domain events (orange), commands (blue), aggregates (yellow), policies (purple), and external systems (pink) on a timeline.
3. **Draw bounded context boundaries** — group cohesive domain concepts. Each bounded context owns its own model and ubiquitous language. Use `templates/bounded-context-map.md`.
4. **Map context relationships** — for each context-to-context integration, choose a relationship pattern (Customer/Supplier, Conformist, Anti-Corruption Layer, Open Host Service, Published Language, Separate Ways). Document in the bounded context map.
5. **Design aggregates** — for each bounded context, identify aggregate roots, their invariants, and consistency boundaries. Use `templates/aggregate-design.md`.
6. **Build the domain glossary** — document every significant term in the bounded context's ubiquitous language. Use `templates/domain-glossary.md`.
7. **Review for model health** — check for bloated aggregates, missing invariants, inconsistent language, and context boundaries that cross team ownership.
8. **File issues for discovered gaps** — do not defer. See GitHub Issue Filing section.

## Context Mapping Patterns

| Pattern | Relationship | When to Use |
|---|---|---|
| **Customer/Supplier** | Upstream/downstream teams with negotiated contracts | Teams in the same org with dependency |
| **Conformist** | Downstream adopts upstream model as-is | No leverage to negotiate; upstream team is unresponsive |
| **Anti-Corruption Layer (ACL)** | Downstream translates upstream model into its own | Upstream model is a poor fit; protects domain integrity |
| **Open Host Service (OHS)** | Upstream exposes a published API for multiple consumers | Upstream serves many downstream contexts |
| **Published Language** | Shared schema or format (JSON, Protobuf, XML) via OHS | Standard interchange format between contexts |
| **Separate Ways** | No integration between contexts | Contexts are truly independent; duplication is acceptable |
| **Partnership** | Two contexts evolve together | Teams are tightly coupled and deploy together |

## Aggregate Design Principles

- An aggregate is a cluster of domain objects treated as a single unit of consistency.
- Every aggregate has exactly one **aggregate root** — the only entry point from outside.
- Aggregates enforce **invariants** (business rules that must always be true) within their boundary.
- Keep aggregates small. If an aggregate frequently loads data it doesn't need for a given operation, it may be too large.
- Reference other aggregates by **identity only** — never hold a direct object reference across aggregate boundaries.
- Apply the **eventual consistency rule**: updates across aggregates are eventually consistent via domain events, not immediate strong consistency.
- Command the aggregate root; it raises domain events consumed by other aggregates or contexts.

## Event Storming Facilitation Guide

Run a session with domain experts and developers:

1. **Unstructured exploration** — everyone writes domain events on orange stickies (past tense: "OrderPlaced", "PaymentFailed"). No structure yet.
2. **Timeline ordering** — place events on a horizontal timeline. Identify conflicts and gaps.
3. **Commands** — add blue stickies for commands that trigger each event ("PlaceOrder" → "OrderPlaced").
4. **Aggregates** — group commands and events by the aggregate that handles them (yellow stickies).
5. **Policies** — add purple stickies for business rules that react to events ("When PaymentFailed, then SendNotification").
6. **Bounded contexts** — draw boundaries around cohesive clusters. Assign a team and ubiquitous language to each.
7. **External systems** — mark third-party systems with pink stickies at the boundary.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `templates/bounded-context-map.md` | Documents all bounded contexts, their responsibilities, and integration relationships |
| `templates/aggregate-design.md` | Defines an aggregate root, its entities, value objects, invariants, and domain events |
| `templates/domain-glossary.md` | Captures the ubiquitous language: terms, definitions, context scope, and anti-patterns |

## Agent Pairing

This skill pairs with the `domain-designer` agent for full DDD methodology workflows. Hand off to `solution-architect` for C4 diagrams after context boundaries are established. Hand off to `backend-dev` for aggregate implementation and to `data-tier` for persistence strategy.

For CQRS and event sourcing implementation, use the `cqrs-event-sourcing` skill.

## Guardrails

- Do not conflate bounded contexts with microservices — a single service may contain multiple contexts, or a context may span multiple services.
- Do not model every noun as an aggregate — most entities are part of an aggregate, not roots.
- Ubiquitous language is context-scoped: the same word can mean different things in different contexts; document both.
- Avoid the anaemic domain model anti-pattern: aggregates must contain behaviour, not just data.

## GitHub Issue Filing

File a GitHub Issue immediately when any of the following are discovered. Do not defer.

```bash
gh issue create \
  --title "[DDD] <short description>" \
  --label "architecture,ddd" \
  --body "## DDD Finding

**Context:** <bounded context name>
**Category:** <bloated aggregate | missing ACL | inconsistent language | wrong context boundary | missing invariant>

### Description
<what was found and why it is a design risk>

### Recommended Fix
<concise recommendation>

### Acceptance Criteria
- [ ] <criterion 1>
- [ ] <criterion 2>

### Discovered During
<event storming | context mapping | aggregate design>"
```

Trigger conditions:

| Finding | Labels |
|---|---|
| Aggregate root too large (> 5–7 entities) | `architecture,ddd,design` |
| Cross-aggregate object reference (not identity) | `architecture,ddd,correctness` |
| Bounded context boundary crosses team ownership | `architecture,ddd,governance` |
| Domain term used inconsistently across contexts | `architecture,ddd,ubiquitous-language` |
| Missing Anti-Corruption Layer on legacy integration | `architecture,ddd,risk` |
