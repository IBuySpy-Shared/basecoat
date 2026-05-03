---
name: high-availability
description: "Use when designing or reviewing high-availability topologies, selecting active-active vs active-passive patterns, configuring replication, or producing HA templates and runbooks for distributed services."
---

# High-Availability Skill

Use this skill when the task involves designing an HA topology, selecting a replication strategy, evaluating RTO/RPO targets, or producing an HA infrastructure template.

## When to Use

- Designing a new service that requires multi-AZ or multi-region availability
- Reviewing an existing deployment for single points of failure
- Selecting between active-active and active-passive topologies
- Configuring database or cache replication with defined RPO
- Producing a disaster recovery runbook or failover test plan

## How to Invoke

Reference this skill by attaching `skills/high-availability/SKILL.md` to your agent context, or instruct the agent:

> Use the high-availability skill. Apply the HA topology decision framework, replication strategy guide, and HA runbook template to the service being designed or reviewed.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `ha-topology-template.md` | HA design document: tier selection, active/passive decision, replication strategy, RTO/RPO targets |
| `failover-runbook-template.md` | Step-by-step failover and recovery runbook for a service |
| `replication-config-template.md` | Replication configuration record: topology, lag thresholds, quorum settings |

## Workflow

1. Classify the service against the four HA tiers (Tier 0–3) based on SLA and criticality.
2. Select the HA pattern using the active-active vs. active-passive decision matrix.
3. Define the replication strategy (synchronous, asynchronous CDC, or event-sourced) and document the RPO impact.
4. Specify quorum settings for distributed-state components (replica count, consensus algorithm).
5. Populate the `ha-topology-template.md` with the agreed design.
6. Author or update the `failover-runbook-template.md` and schedule a failover drill.

## Guardrails

- Do not recommend active-active for strongly-consistent data tiers without explicitly documenting the conflict-resolution strategy.
- Do not recommend Tier 3 (multi-region) without a corresponding cost and complexity analysis.
- Always tie RTO/RPO targets to measurable health check and failover automation — not manual procedures.
- Refer database replication configuration to the `data-integrity` skill for ACID and consistency review.

## Agent Pairing

This skill is designed to be used alongside the `ha-architect` agent. The agent drives the workflow; this skill provides the decision frameworks, templates, and runbook scaffolds.
