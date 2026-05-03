# GitOps Environment Promotion Workflow

Use this template to define how changes are promoted from development through staging to production using pull requests.

## Promotion Model

```
[developer branch] ──PR──► development ──PR──► staging ──PR──► production
                                ▲                  ▲               ▲
                            Auto-merge         Manual           Manual +
                             on CI pass        approval         approval gate
```

## Environment Definitions

| Environment | Branch / Path | Auto-Deploy | Required Approvals | Promotion Gate |
|---|---|---|---|---|
| Development | `clusters/development` | Yes — on merge to `main` | 0 | CI pass |
| Staging | `clusters/staging` | No | 1 (team) | CI pass + dev stable for 24 h |
| Production | `clusters/production` | No | 2 (team lead + release manager) | Staging stable for 48 h |

## Promotion Pull Request Checklist

Before opening a promotion PR from staging to production:

- [ ] Staging environment stable for ≥ 48 h with no new errors
- [ ] All integration and smoke tests passing in staging
- [ ] Performance benchmarks within acceptable range
- [ ] Security scan (image scan, policy check) clean
- [ ] Database migrations applied and validated (if applicable)
- [ ] Rollback procedure reviewed and confirmed
- [ ] Stakeholders notified of deployment window
- [ ] On-call engineer confirmed available during deployment window

## Promotion PR Template

```markdown
## Promotion: staging → production

**Service**: <service-name>
**Image tag**: <tag>
**Staging deployed**: <date>

### Changes

<!-- Summarize what changed since the last production promotion -->

### Validation Evidence

- [ ] Staging smoke tests: passing
- [ ] Error rate in staging: <X>%
- [ ] p95 latency in staging: <X> ms
- [ ] Security scan: clean

### Rollback Plan

<!-- How to roll back if issues are detected in production -->
Revert this PR. Argo CD / Flux will reconcile within <X> minutes.

### Checklist

- [ ] Staging stable for ≥ 48 h
- [ ] Rollback tested
- [ ] On-call notified
```

## Automated Validation Gates

```yaml
# .github/workflows/gitops-pr-validation.yml
name: GitOps PR Validation

on:
  pull_request:
    paths:
      - 'clusters/**'
      - 'helm-releases/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate Kubernetes manifests
        run: |
          kustomize build clusters/${{ env.TARGET_ENV }} | \
            kubeval --strict --kubernetes-version 1.28.0

      - name: Validate Helm templates
        run: |
          helm template helm-releases/ --validate

      - name: Policy check (Kyverno)
        run: |
          kyverno apply policies/ --resource <(kustomize build clusters/${{ env.TARGET_ENV }})
```
