# GitOps Reconciliation Checklist

Use this checklist when setting up or auditing an Argo CD or Flux deployment.

## Controller Installation

- [ ] Controller version pinned to a specific release (not `latest`)
- [ ] Controller deployed in a dedicated namespace (`argocd` / `flux-system`)
- [ ] Controller RBAC scoped to minimum required permissions
- [ ] Controller HA mode enabled for production clusters (≥ 2 replicas)
- [ ] Controller resource limits set (CPU, memory)

## Repository Connectivity

- [ ] Git credentials stored as a Kubernetes Secret (not in controller config)
- [ ] Deploy key or GitHub App credential used — not a personal access token
- [ ] Repository URL uses HTTPS with TLS or SSH — no plain HTTP
- [ ] Polling interval configured (Flux default: 1 min; Argo CD default: 3 min)
- [ ] Webhook receiver configured for immediate sync on push (optional but recommended)

## Sync Policies

- [ ] `automated.prune: true` enabled — removes resources not in git
- [ ] `automated.selfHeal: true` enabled — corrects manual cluster changes
- [ ] `syncOptions: [CreateNamespace=true]` set only where namespace creation is intentional
- [ ] `retry.limit` configured to prevent infinite sync loops
- [ ] `ignoreDifferences` rules documented for legitimate drift (e.g., HPA replica counts)

## Drift Detection and Alerting

- [ ] Out-of-sync alert configured and routed to on-call or team channel
- [ ] Sync failure alert configured with a distinct severity
- [ ] Health degraded alert configured for unhealthy resources
- [ ] Dashboard shows current sync status for all managed applications

## RBAC and Access Control

- [ ] Teams granted access via Argo CD AppProject or Flux `Kustomization` namespacing
- [ ] Admin access to the GitOps controller limited to platform team
- [ ] SSO configured for Argo CD UI access (OIDC/LDAP)
- [ ] `read-only` group defined for auditors and stakeholders

## Image Automation (optional)

- [ ] `ImageRepository` and `ImagePolicy` resources defined for automated image updates
- [ ] Automated image update commits signed or verified
- [ ] Image scanning integrated before update commits are accepted

## Disaster Recovery

- [ ] Bootstrap procedure documented in `docs/BOOTSTRAP.md`
- [ ] GitOps controller state is recoverable by re-running bootstrap against git
- [ ] Secret rotation procedure documented (sealed secrets / external secrets)
- [ ] Tested: full cluster rebuild from git completes within defined RTO
