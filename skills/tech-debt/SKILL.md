---
name: tech-debt
description: "Use when inventorying, scoring, budgeting, or reducing technical debt with RICE prioritization, debt registers, amortization tracking, and governance rules."
compatibility: ["VS Code", "Cursor", "Windsurf", "Claude Code"]
metadata:
  category: "Engineering"
  tags: ["technical-debt", "prioritization", "rice", "budgeting", "tracking", "amortization"]
  maturity: "beta"
  audience: ["developers", "engineering-leads"]
allowed-tools: ["search/codebase"]
---

# Technical Debt Management

Use this skill when a team needs to inventory debt, compare competing cleanup work, or decide how much sprint capacity to reserve for remediation. It helps turn vague concerns into explicit inputs, a ranked backlog, and measurable outputs that leaders can review. The skill produces a debt register, a prioritization view, a budget recommendation, and a remediation cadence that can be used in planning conversations.

## Triggers

- A repo has known cleanup items but no shared debt register.
- Stakeholders ask which debt item should be fixed first.
- Sprint planning needs a debt budget alongside feature work.
- Teams need a consistent way to score debt with reach, impact, confidence, and effort.
- Quarterly reviews need evidence of whether debt is shrinking or growing.

## Inputs

Typical input includes architecture notes, incident history, defect trends, flaky tests, dependency audit results, performance findings, or a plain list of suspected debt items. Useful input fields are ID, category, description, reach, impact, confidence, effort, owner, status, and target sprint.

## Outputs

This skill returns or produces a prioritized debt register, RICE-based ranking, sprint budget guidance, and an amortization summary. The output should make tradeoffs explicit so teams can justify why an item is deferred, scheduled now, or escalated.

## Reference Files

| File | Contents |
|---|---|
| [`references/assessment.md`](references/assessment.md) | Debt register template, debt categories, RICE scoring rubric, visualization templates |
| [`references/remediation.md`](references/remediation.md) | Budget framework, amortization tracking, governance rules, quarterly review checklist |

## Core Concepts

- **Debt Register** — centralized register with ID, category, effort, impact, RICE score, status, and owner
- **RICE Score** = (Reach × Impact × Confidence) / Effort — higher score = higher priority
- **Budget allocation** — 5–30% of sprint capacity reserved for debt, scaled by team maturity
- **Amortization target** — net debt reduction ≥ 30 SP/quarter

## Key Rules

- Adding debt is a **conscious choice** — requires tech lead approval and remediation plan
- Never let debt backlog exceed 6 months of capacity
- No new features on top of P1 debt (causes instability)

## Example Debt Register

```yaml
debt-items:
  - id: TD-002
    category: Test Gap
    description: Add payment processor integration tests
    reach: 3
    impact: 5
    confidence: 1.0
    effort: 5
    rice-score: 3.0
    priority: P1
    owner: "@payments-team"
    target-sprint: S12
  - id: TD-001
    category: Legacy Code
    description: Refactor auth microservice
    reach: 4
    impact: 4
    confidence: 0.75
    effort: 8
    rice-score: 1.5
    priority: P2
    owner: "@platform-team"
    target-sprint: S13
```

## Recommended Workflow

1. Collect candidate debt items from incidents, review comments, bugs, and dependency scans.
2. Normalize the input into a shared register with owners and status.
3. Score each item with RICE so the team can compare impact against effort.
4. Reserve debt budget in sprint planning and track what the team actually completes.
5. Review quarterly whether completed work exceeds newly added debt.

## Related

- Agent: `sprint-planner` (for sprint scheduling)
- References: Martin Fowler's Technical Debt Quadrant, RICE framework
