---
name: chaos-engineering
description: "Use when designing chaos experiments, running FMEA analysis, writing experiment plans, or organizing game day runsheets. Provides FMEA templates, experiment plan scaffolds, and game day runsheets for structured resilience validation."
---

# Chaos Engineering Skill

Use this skill when the task involves designing or executing chaos experiments, performing failure mode and effects analysis (FMEA), writing structured experiment plans, or organizing a game day.

## When to Use

- Performing a failure mode and effects analysis (FMEA) for a service or system
- Designing a new chaos experiment with hypothesis, steady state, and abort conditions
- Planning and facilitating a game day exercise
- Reviewing and scoring chaos experiment results
- Building a library of reusable experiment plans for a service

## How to Invoke

Reference this skill by attaching `skills/chaos-engineering/SKILL.md` to your agent context, or instruct the agent:

> Use the chaos-engineering skill. Apply the FMEA template and the experiment-plan-template to design the next chaos experiment for this service.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `fmea-template.md` | Failure Mode and Effects Analysis for a service or system |
| `experiment-plan-template.md` | Structured chaos experiment plan: hypothesis, steady state, blast radius, abort conditions |
| `game-day-runsheet-template.md` | Game day planning and facilitation runsheet |

## Workflow

1. Perform FMEA using `fmea-template.md` to identify high-risk failure modes.
2. Prioritize failure modes by risk priority number (RPN = Severity × Occurrence × Detectability).
3. Design a chaos experiment for each high-RPN failure mode using `experiment-plan-template.md`.
4. Order experiments from lowest to highest blast radius.
5. Plan a game day using `game-day-runsheet-template.md` when cross-team readiness validation is needed.
6. File GitHub issues for all resilience gaps discovered.

## Guardrails

- Do not execute an experiment without a documented hypothesis, steady state, and abort conditions.
- Do not increase blast radius unless the previous stage stayed within all abort thresholds.
- Do not run high-risk experiments when the service is outside SLO or the error budget is nearly exhausted (< 25% remaining).
- Always pre-stage rollback access before injecting any fault.

## Agent Pairing

This skill is designed to be used alongside the `chaos-engineer` agent. It is also compatible with `sre-engineer` for SLO-aligned experiment guardrails and `resilience-reviewer` for code-level pattern verification.
