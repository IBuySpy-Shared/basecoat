---
name: tech-debt
description: "Use when registering, prioritizing, or amortizing technical debt. Provides a debt register template, prioritization matrix, and debt budget guidelines for systematic debt management."
---

# Tech Debt Skill

Use this skill when the task involves cataloging technical debt, prioritizing debt items for remediation, setting a debt budget, or tracking amortization across sprints.

## When to Use

- Filing a new technical debt item after a sprint
- Prioritizing a debt backlog for the next planning cycle
- Defining a debt budget as a percentage of sprint capacity
- Reviewing the debt register for items that have grown into blocking risks
- Tracking debt reduction progress against a team goal

## How to Invoke

Reference this skill by attaching `skills/tech-debt/SKILL.md` to your agent context, or instruct the agent:

> Use the tech-debt skill. Apply the debt register template and prioritization matrix to catalog and rank the debt items found.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `debt-register-template.md` | Structured register for cataloging and tracking technical debt items |
| `debt-prioritization-matrix.md` | Scoring rubric for ranking debt items by risk, cost, and strategic value |

## Debt Budget Guidelines

- Reserve 20% of sprint capacity for debt remediation by default.
- Increase to 30% when the debt register contains critical or high-severity items.
- Reduce to 10% temporarily only when an urgent deadline is agreed by the team with a written plan to restore the budget in the following sprint.
- Never reduce the debt budget to zero — this creates compounding interest.

## Agent Pairing

This skill supports the `code-review` agent (debt identification during review), the `sprint-planner` agent (budget allocation), and the `retro-facilitator` agent (debt review during retrospectives). Coordinate with the `solution-architect` agent when debt items require architectural decisions.
