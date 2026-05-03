# Supply-Chain Hardening Checklist

**Reviewer:**
**Date:**
**Repository / Service:**
**CI Platform:** < GitHub Actions | Azure DevOps | Jenkins | other >

## Scoring Key

- ✅ Pass — control is satisfied
- ❌ Fail (Critical) — blocking; fix before next deployment
- ⚠️ Fail (High) — fix before next release
- 📋 Fail (Medium) — fix within sprint
- N/A — not applicable

---

## Container Image Security

| ID | Control | Status | Notes |
|---|---|---|---|
| IMG-1 | All container images in production are signed (Cosign / Notary) | | |
| IMG-2 | Image signatures are verified at deploy time (admission controller / policy) | | |
| IMG-3 | Base images are pinned by digest (`FROM image@sha256:...`), not by mutable tag | | |
| IMG-4 | Base images are sourced from approved registries only | | |
| IMG-5 | Images are scanned for CVEs before promotion to production | | |
| IMG-6 | Critical and High CVE findings block the deployment pipeline | | |
| IMG-7 | SBOM (CycloneDX or SPDX) is generated and stored with each build artifact | | |
| IMG-8 | Image provenance attestation is generated and stored (SLSA provenance) | | |

## Dependency Management

| ID | Control | Status | Notes |
|---|---|---|---|
| DEP-1 | All dependencies are pinned with a lockfile (`package-lock.json`, `go.sum`, `Pipfile.lock`, etc.) | | |
| DEP-2 | No floating version ranges (e.g., `^1.x`, `~2.x`) in direct dependency declarations | | |
| DEP-3 | Dependency updates are reviewed and approved via PR | | |
| DEP-4 | Dependabot or equivalent automated vulnerability scanning is enabled | | |
| DEP-5 | Known vulnerable transitive dependencies are addressed within SLA | | |
| DEP-6 | Dependency manifest checksums are verified during CI builds | | |

## CI/CD Pipeline Integrity

| ID | Control | Status | Notes |
|---|---|---|---|
| CI-1 | Third-party GitHub Actions are pinned to a full commit SHA (not a tag) | | |
| CI-2 | CI pipeline runs with minimum required permissions (not `permissions: write-all`) | | |
| CI-3 | Secrets are stored in the platform secret store, not in pipeline YAML | | |
| CI-4 | Build artifacts are stored in a content-addressed, immutable registry | | |
| CI-5 | Only signed and verified artifacts are promoted to production | | |
| CI-6 | Pipeline configuration is reviewed in PR before merging to default branch | | |
| CI-7 | Build environment is ephemeral (no persistent, mutable build agents) | | |
| CI-8 | Branch protection enforces PR review before merge to production branch | | |

## SLSA and Provenance

| ID | Control | Status | Notes |
|---|---|---|---|
| SLSA-1 | Build provenance is generated (SLSA level 2 or higher) | | |
| SLSA-2 | Provenance is verified before deployment (admission controller or policy gate) | | |
| SLSA-3 | Build is reproducible or hermetic (same inputs → same outputs) | | |
| SLSA-4 | Builder identity is verified (workload identity or OIDC token) | | |

## Summary

| Category | Pass | Fail | N/A | Score |
|---|---|---|---|---|
| Container Images | | | | % |
| Dependencies | | | | % |
| CI/CD Pipeline | | | | % |
| SLSA / Provenance | | | | % |
| Overall | | | | % |

## Critical Findings Requiring Immediate Action

| ID | Control | Recommended Fix |
|---|---|---|
| | | |
