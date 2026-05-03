---
name: gitops
description: "Use when implementing GitOps workflows with Argo CD or Flux, designing desired-state reconciliation, structuring declarative infrastructure repositories, or setting up drift detection and automated remediation."
---

# GitOps Skill

Use this skill when the task involves GitOps workflows, desired-state reconciliation, declarative infrastructure repositories, or Argo CD / Flux configuration.

## When to Use

- Setting up a GitOps repository structure for Kubernetes or cloud infrastructure
- Configuring Argo CD Application or Flux HelmRelease resources
- Designing drift detection and automated remediation workflows
- Defining promotion pipelines between environments using pull requests
- Auditing a GitOps implementation for security, RBAC, or compliance gaps

## How to Invoke

Reference this skill by attaching `skills/gitops/SKILL.md` to your agent context, or instruct the agent:

> Use the gitops skill. Apply the repository structure template and reconciliation checklist to the GitOps workflow being designed.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `repo-structure-template.md` | Canonical GitOps repository layout for multi-environment Kubernetes deployments |
| `reconciliation-checklist.md` | Argo CD / Flux reconciliation checklist: controller setup, sync policies, drift alerts |
| `promotion-workflow-template.md` | Environment promotion workflow via pull requests with approval gates |

## Key Principles

| Principle | Description |
|---|---|
| Declarative configuration | All desired state is stored as YAML/HCL in git — no imperative commands |
| Single source of truth | Git is the only authoritative record; cluster state must converge to it |
| Continuous reconciliation | Controllers detect and correct drift automatically |
| Pull-based deployment | Controllers pull config from git; no push credentials granted to CI |
| Immutable image tags | Every deployment references a specific digest, not a mutable tag |
| Separation of concerns | Application source repo and GitOps config repo are separate |

## Agent Pairing

This skill pairs with the `gitops-engineer` agent. For CI/CD pipeline design, coordinate with the `devops-engineer` agent. For infrastructure-as-code design, coordinate with the `azure-landing-zone` or `infrastructure-deploy` agent.
