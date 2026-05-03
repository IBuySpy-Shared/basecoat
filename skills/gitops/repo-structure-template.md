# GitOps Repository Structure Template

Use this template as the canonical layout for a GitOps repository managing multi-environment Kubernetes deployments.

## Directory Layout

```
gitops-repo/
├── README.md                         # Overview, bootstrap instructions
├── clusters/
│   ├── production/
│   │   ├── kustomization.yaml        # Root kustomization for production
│   │   ├── apps/                     # Application HelmReleases / manifests
│   │   ├── infrastructure/           # Platform components (ingress, monitoring)
│   │   └── config/                   # Environment-specific ConfigMaps, Secrets refs
│   ├── staging/
│   │   ├── kustomization.yaml
│   │   ├── apps/
│   │   ├── infrastructure/
│   │   └── config/
│   └── development/
│       ├── kustomization.yaml
│       ├── apps/
│       └── infrastructure/
├── base/
│   ├── apps/
│   │   └── <app-name>/
│   │       ├── kustomization.yaml
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       └── hpa.yaml
│   └── infrastructure/
│       ├── ingress-nginx/
│       ├── cert-manager/
│       └── prometheus/
├── helm-releases/
│   ├── <app-name>/
│   │   ├── Chart.yaml
│   │   ├── values.yaml               # Default values
│   │   ├── values-staging.yaml
│   │   └── values-production.yaml
├── policies/
│   ├── rbac.yaml
│   ├── network-policies.yaml
│   └── resource-quotas.yaml
└── docs/
    ├── BOOTSTRAP.md
    ├── PROMOTION.md
    └── TROUBLESHOOTING.md
```

## Naming Conventions

| Object | Convention | Example |
|---|---|---|
| Namespace | `<team>-<environment>` | `platform-production` |
| HelmRelease name | `<app>-<environment>` | `api-gateway-production` |
| Kustomization name | `<cluster>-<layer>` | `production-apps` |
| Secret name | `<app>-<purpose>` | `api-gateway-tls` |

## Flux Bootstrap Example

```bash
# Bootstrap Flux onto a cluster, pointing it to this repository
flux bootstrap github \
  --owner=<org> \
  --repository=<gitops-repo> \
  --branch=main \
  --path=clusters/production \
  --personal=false \
  --components-extra=image-reflector-controller,image-automation-controller
```

## Argo CD App-of-Apps Root Example

```yaml
# clusters/production/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - apps/
  - infrastructure/
  - config/

commonLabels:
  environment: production
  managed-by: argocd
```

## Security Considerations

- Grant the GitOps controller read-only access to the repository (deploy keys, not personal tokens)
- Use separate repositories for application source and deployment configuration
- Store secrets using Sealed Secrets, External Secrets Operator, or a vault reference — never plain-text in git
- Enable audit logging on the GitOps controller to track who triggered what sync
- Use Argo CD AppProjects or Flux `ServiceAccount` scoping to restrict which namespaces a team can deploy to
