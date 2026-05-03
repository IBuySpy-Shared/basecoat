# CIS Kubernetes Benchmark Checklist

**Benchmark version:** CIS Kubernetes Benchmark v1.9
**Reviewer:**
**Date:**
**Cluster / Namespace:**

## Scoring Key

- ✅ Pass — control is satisfied
- ❌ Fail (L1) — CIS Level 1: blocking finding
- ⚠️ Fail (L2) — CIS Level 2: advisory finding
- N/A — not applicable to this target

---

## Section 1: Control Plane Components

| ID | Control | Status | Notes |
|---|---|---|---|
| 1.1.1 | Ensure API server pod spec file permissions are 600 or more restrictive | | |
| 1.1.2 | Ensure API server pod spec file ownership is root:root | | |
| 1.2.1 | Ensure `--anonymous-auth` is set to false | | |
| 1.2.2 | Ensure `--basic-auth-file` is not set | | |
| 1.2.5 | Ensure `--kubelet-certificate-authority` is set | | |
| 1.2.6 | Ensure `--authorization-mode` is not set to AlwaysAllow | | |
| 1.2.7 | Ensure `--authorization-mode` includes Node | | |
| 1.2.8 | Ensure `--authorization-mode` includes RBAC | | |
| 1.2.9 | Ensure admission control plugin `EventRateLimit` is set | | |
| 1.2.10 | Ensure admission control plugin `AlwaysAdmit` is not set | | |
| 1.2.13 | Ensure admission control plugin `ServiceAccount` is set | | |
| 1.2.14 | Ensure admission control plugin `NamespaceLifecycle` is set | | |
| 1.2.15 | Ensure admission control plugin `PodSecurity` is set | | |
| 1.2.24 | Ensure `--service-account-lookup` is set to true | | |
| 1.2.25 | Ensure `--service-account-key-file` is set | | |
| 1.2.31 | Ensure `--etcd-cafile` is set | | |
| 1.2.32 | Ensure `--encryption-provider-config` is set | | |
| 1.3.1 | Ensure `--terminated-pod-gc-threshold` is set | | |
| 1.3.2 | Ensure profiling is disabled on controller manager | | |
| 1.4.1 | Ensure profiling is disabled on scheduler | | |

## Section 2: etcd

| ID | Control | Status | Notes |
|---|---|---|---|
| 2.1 | Ensure `--cert-file` and `--key-file` are set | | |
| 2.2 | Ensure `--client-cert-auth` is set to true | | |
| 2.3 | Ensure `--auto-tls` is not set to true | | |
| 2.4 | Ensure `--peer-cert-file` and `--peer-key-file` are set | | |
| 2.5 | Ensure `--peer-client-cert-auth` is set to true | | |
| 2.6 | Ensure `--peer-auto-tls` is not set to true | | |
| 2.7 | Ensure etcd key-value store is not exposed publicly | | |

## Section 4: Worker Nodes

| ID | Control | Status | Notes |
|---|---|---|---|
| 4.1.1 | Ensure kubelet service file permissions are 600 | | |
| 4.2.1 | Ensure `--anonymous-auth` is set to false on kubelet | | |
| 4.2.2 | Ensure `--authorization-mode` is not AlwaysAllow on kubelet | | |
| 4.2.6 | Ensure `--protect-kernel-defaults` is set to true | | |
| 4.2.7 | Ensure `--make-iptables-util-chains` is set to true | | |
| 4.2.10 | Ensure `--rotate-certificates` is set to true | | |

## Section 5: Policies

| ID | Control | Status | Notes |
|---|---|---|---|
| 5.1.1 | Ensure that the cluster-admin role is only used where required | | |
| 5.1.2 | Minimize access to secrets | | |
| 5.1.3 | Minimize wildcard use in Roles and ClusterRoles | | |
| 5.1.5 | Ensure that default service accounts are not bound to active cluster roles | | |
| 5.1.6 | Ensure that Service Account Tokens are not automounted | | |
| 5.2.1 | Ensure that admission controller enforces PodSecurity baseline | | |
| 5.2.2 | Minimize privileged containers | | |
| 5.2.3 | Minimize containers wishing to share the host process ID namespace | | |
| 5.2.4 | Minimize containers wishing to share the host IPC namespace | | |
| 5.2.5 | Minimize containers wishing to share the host network namespace | | |
| 5.2.6 | Minimize use of containers with `allowPrivilegeEscalation` | | |
| 5.2.7 | Minimize root containers | | |
| 5.2.8 | Minimize containers with NET_RAW capability | | |
| 5.2.9 | Minimize containers with added capabilities | | |
| 5.2.10 | Minimize containers with root capabilities | | |
| 5.3.1 | Ensure that CNI in use supports NetworkPolicies | | |
| 5.3.2 | Ensure that all Namespaces have NetworkPolicies | | |
| 5.4.1 | Prefer using Secrets as files over Secrets as environment variables | | |
| 5.4.2 | Ensure external secret management is used | | |
| 5.7.1 | Create administrative boundaries between resources using namespaces | | |
| 5.7.4 | The default namespace should not be used | | |

## Summary

| Level | Pass | Fail | N/A | Score |
|---|---|---|---|---|
| Level 1 | | | | % |
| Level 2 | | | | % |
| Overall | | | | % |

## Findings Requiring Immediate Action (L1 Fails)

| ID | Control | Recommended Fix |
|---|---|---|
| | | |
