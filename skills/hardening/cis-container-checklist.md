# CIS Docker Benchmark Checklist

**Benchmark version:** CIS Docker Benchmark v1.6
**Reviewer:**
**Date:**
**Target:** < image name or Dockerfile path >

## Scoring Key

- ✅ Pass — control is satisfied
- ❌ Fail (L1) — CIS Level 1: blocking finding
- ⚠️ Fail (L2) — CIS Level 2: advisory finding
- N/A — not applicable to this target

---

## Section 1: Host Configuration

| ID | Control | Status | Notes |
|---|---|---|---|
| 1.1 | Docker daemon is not run as root unless required | | |
| 1.2 | Docker daemon is audited | | |

## Section 2: Docker Daemon Configuration

| ID | Control | Status | Notes |
|---|---|---|---|
| 2.1 | Restrict network traffic between containers (--icc=false) | | |
| 2.2 | Set the logging level to at least `info` | | |
| 2.3 | Allow Docker to make changes to iptables | | |
| 2.4 | Do not use insecure registries | | |
| 2.5 | Do not use the `aufs` storage driver | | |
| 2.6 | Configure TLS authentication for Docker daemon | | |
| 2.7 | Set default `ulimit` as appropriate | | |
| 2.8 | Enable user namespace support | | |
| 2.14 | Enable live restore | | |
| 2.17 | Do not use the legacy registry | | |

## Section 4: Container Images and Build Files

| ID | Control | Status | Notes |
|---|---|---|---|
| 4.1 | Create a user for the container — do not run as root | | |
| 4.2 | Use trusted base images for containers | | |
| 4.3 | Do not install unnecessary packages | | |
| 4.4 | Scan and rebuild images to include security patches | | |
| 4.5 | Enable `CONTENT_TRUST` for Docker | | |
| 4.6 | Add `HEALTHCHECK` to container images | | |
| 4.7 | Do not use `update` instructions alone in Dockerfiles | | |
| 4.8 | Remove `setuid` and `setgid` permissions from images | | |
| 4.9 | Use `COPY` instead of `ADD` | | |
| 4.10 | Do not store secrets in Dockerfiles | | |
| 4.11 | Install verified packages only | | |

## Section 5: Container Runtime

| ID | Control | Status | Notes |
|---|---|---|---|
| 5.1 | Do not disable AppArmor Profile | | |
| 5.2 | Do not disable SELinux security options | | |
| 5.3 | Do not use `--privileged` flag | | |
| 5.4 | Do not mount sensitive host system directories | | |
| 5.5 | Do not run SSH in containers | | |
| 5.6 | Do not map privileged ports within containers | | |
| 5.7 | Do not share the host's network namespace | | |
| 5.8 | Memory usage for container should be limited | | |
| 5.9 | Do not share the host's process namespace | | |
| 5.10 | Do not share the host's IPC namespace | | |
| 5.11 | Do not directly expose host devices to containers | | |
| 5.12 | Override default `ulimit` only if needed | | |
| 5.13 | Do not share the host's UTS namespace | | |
| 5.14 | Do not disable default seccomp profile | | |
| 5.15 | Do not use `--privileged` for Docker exec | | |
| 5.20 | Do not share the host's user namespaces | | |
| 5.21 | Do not mount the Docker socket inside any containers | | |
| 5.25 | Use read-only filesystem for containers | | |
| 5.28 | Use PIDs cgroup limit | | |

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
