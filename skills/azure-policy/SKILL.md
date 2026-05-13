---

name: azure-policy
description: "Use when authoring Azure Policy definitions, initiatives, remediation tasks, and compliance reporting assets. USE FOR: write an Azure Policy to require tags, create a policy initiative for CIS controls, build a DeployIfNotExists remediation, generate a KQL compliance dashboard query, restrict allowed VM SKUs. DO NOT USE FOR: application business logic, Azure RBAC role selection, packet capture troubleshooting."
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

# Azure Policy & Governance Skill

Use this skill when the task involves designing or implementing Azure governance controls through custom policy definitions, policy initiatives, remediation automation, or compliance reporting.

## When to Use

- Authoring a new custom Azure Policy definition (deny, audit, modify, or DeployIfNotExists)
- Bundling related policy definitions into a policy initiative (policy set)
- Designing remediation task templates for DeployIfNotExists policies
- Generating Azure Resource Graph or KQL queries for compliance dashboards
- Mapping organizational controls to regulatory frameworks (CIS Benchmarks, NIST 800-53, ISO 27001)
- Enforcing governance requirements such as mandatory tagging, allowed regions, approved SKUs, or encryption at rest

## How to Invoke

Reference this skill by attaching `skills/azure-policy/SKILL.md` to your agent context, or instruct the agent:

> Use the azure-policy skill. Apply the policy-definition-template to author a deny policy for unapproved VM SKUs, then bundle it into the initiative-definition-template and add a compliance KQL query.

## Workflow

1. **Identify governance requirements** — determine the control objective (tagging, region restriction, SKU allowlist, encryption, diagnostic settings, etc.) and the appropriate policy effect (`Deny`, `Audit`, `AuditIfNotExists`, `Modify`, or `DeployIfNotExists`).
2. **Author the policy definition** — use `policy-definition-template.md` to produce a well-formed JSON definition with `policyRule`, `parameters`, display metadata, and framework mapping annotations.
3. **Bundle into an initiative** — use `initiative-definition-template.md` to group related definitions into a policy set with shared parameters and assignment defaults.
4. **Produce remediation tasks** — for `DeployIfNotExists` policies, use `remediation-task-template.md` to define the deployment template, managed identity scope, and remediation trigger conditions.
5. **Generate compliance queries** — use `compliance-report-template.md` to produce Azure Resource Graph and KQL queries that surface non-compliant resources, trend over time, and map findings to framework controls.
6. **Map to regulatory frameworks** — annotate each policy definition with the applicable CIS Benchmark, NIST 800-53, or ISO 27001 control identifiers so compliance evidence is traceable.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `policy-definition-template.md` | Custom Azure Policy definition JSON with effect types, parameters, and framework mappings |
| `initiative-definition-template.md` | Policy initiative (set) definition with grouped definitions and shared parameter sets |
| `remediation-task-template.md` | DeployIfNotExists remediation task with deployment template and managed identity configuration |
| `compliance-report-template.md` | Azure Resource Graph and KQL queries for compliance dashboards and regulatory reporting |

## Guardrails

- Always include a `displayName`, `description`, `category`, and `version` in policy metadata — anonymous or undocumented policies cannot be audited.
- Prefer `Audit` or `AuditIfNotExists` over `Deny` for the first deployment of a new control; escalate to `Deny` after a burn-in period.
- `DeployIfNotExists` policies require a managed identity with the minimum necessary role assignment — do not grant `Owner` or `Contributor` at the subscription scope unless explicitly justified.
- Parameter names must be stable across versions — renaming a parameter is a breaking change for existing assignments.
- Every policy definition must include at least one framework mapping annotation (`CIS`, `NIST_800_53`, or `ISO_27001`) to enable compliance reporting.
- Do not use `enforcementMode: DoNotEnforce` in production assignments without a documented review date and owner.

## Agent Pairing

This skill is designed to be used alongside the `policy-as-code-compliance` agent, which drives validation, exception management, and audit-ready reporting. The agent executes the governance workflow; this skill provides the reference templates and authoring standards.

For IaC-level enforcement, pair with the `devops-engineer` agent using `skills/devops/` templates to integrate policy assignments into CI/CD pipelines. For Bicep-authored assignments, refer to `instructions/bicep.instructions.md`.
