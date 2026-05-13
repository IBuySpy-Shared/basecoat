---
name: gitops
description: "Use when designing or reviewing GitOps workflows with Flux or ArgoCD, declarative delivery, drift reconciliation, and secrets management across clusters. USE FOR: set up Flux or ArgoCD workflow, structure multi-environment cluster config, handle Kubernetes drift reconciliation, choose GitOps secrets pattern, review pull-based deployment practices. DO NOT USE FOR: manual kubectl runbooks, non-Kubernetes CI pipelines, imperative server configuration."
compatibility:
  editors:
    - vscode
  platforms:
    - github
metadata:
  category: "infrastructure"
  keywords: "gitops, flux, argocd, kubernetes, desired-state, declarative"
  model-tier: "premium"
allowed-tools: "search/codebase bash kubectl"
---

# GitOps

GitOps uses Git as the single source of truth for infrastructure and application state.
The operator continuously reconciles actual cluster state with declared desired state.

## Quick Navigation

| Reference | Contents |
|---|---|
| [references/flux-argocd.md](references/flux-argocd.md) | Flux and ArgoCD installation, configuration, multi-environment promotion |
| [references/multi-cluster-secrets.md](references/multi-cluster-secrets.md) | Multi-cluster topology, secrets management (ESO, Sealed Secrets, Kyverno), reconciliation monitoring |

## Core Principles

1. **Declarative** — define desired state in Git, not imperative commands
2. **Versioned & Immutable** — all changes tracked in Git history
3. **Pulled, not Pushed** — operators pull from Git; CI/CD does not push to clusters
4. **Continuously Reconciled** — operator detects drift and auto-corrects

## Workflow

```text
Developer → commits manifests to Git
           ↓
GitOps Operator (Flux/ArgoCD) detects change
           ↓
Pulls manifests → applies to cluster (kubectl apply)
           ↓
Continuously checks: actual state == desired state?
           ↓ (if drift detected)
Auto-reconciles
```

## Best Practices

- Separate config by environment — use directory structure (`clusters/prod/`, `clusters/staging/`)
- Never use `latest` image tags — pin explicit versions
- Require PR approval before merging to main (cluster config changes are production changes)
- Never run `kubectl apply` manually — commit the manifest and let the operator apply it
- Alert if the GitOps operator falls out of sync for more than 5 minutes
