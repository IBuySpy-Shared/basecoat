---
name: sre
description: "Use when defining SLOs, managing error budgets, authoring post-mortems, tracking toil, or writing on-call policies for production services. Provides SLO templates, error budget policy, post-mortem format, toil register, and on-call policy."
---

# SRE Skill

Use this skill when the task involves defining or reviewing SLOs, managing error budgets, authoring blameless post-mortems, tracking and reducing toil, or establishing on-call policies.

## When to Use

- Defining SLIs and SLOs for a new or existing service
- Calculating error budgets and burn-rate thresholds
- Writing or improving an error budget policy
- Authoring a blameless post-mortem after an incident
- Inventorying and prioritizing toil for automation
- Establishing or reviewing an on-call rotation policy

## How to Invoke

Reference this skill by attaching `skills/sre/SKILL.md` to your agent context, or instruct the agent:

> Use the sre skill. Apply the SLO template, error budget policy, and post-mortem template to the service reliability task being performed.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `slo-template.md` | SLI/SLO definition document with targets, windows, and burn-rate thresholds |
| `error-budget-policy.md` | Error budget policy defining enforcement actions at each consumption tier |
| `post-mortem-template.md` | Blameless post-mortem template for Sev 1 and Sev 2 incidents |
| `toil-register-template.md` | Toil register for inventorying, scoring, and tracking toil reduction |
| `on-call-policy-template.md` | On-call policy defining rotation, escalation, and well-being requirements |

## Workflow

1. Identify the service's critical user journeys to define SLIs using `slo-template.md`.
2. Set SLO targets and calculate error budgets.
3. Author or update the error budget policy using `error-budget-policy.md`.
4. After any Sev 1 or Sev 2 incident, run a blameless post-mortem using `post-mortem-template.md`.
5. Inventory toil using `toil-register-template.md` and prioritize automation.
6. Review on-call policy using `on-call-policy-template.md` for team well-being and coverage.

## Guardrails

- SLOs must be measurable from production telemetry — no vanity metrics.
- Error budget policies must have explicit enforcement actions — not just advisory guidance.
- Post-mortems must identify systemic contributing factors, not individual blame.
- Toil that exceeds 50% of team time must trigger an escalation action.
- On-call policies must include explicit well-being protections: max shifts per week and recovery time.

## Agent Pairing

This skill is designed to be used alongside the `sre-engineer` agent. It is also compatible with `chaos-engineer` for experiment-to-SLO coordination and `incident-responder` for live incident workflows.
