# Changelog

All notable changes to this repository should be recorded in this file.

## Unreleased

## 3.20.0 - 2026-05-09

### Consumer Contribution Kit (#620, #621)

Closes the gap where consumer repos (those with `basecoat-enabled` topic) had no
documented, deliberate path to submit learnings back to basecoat memory.

#### scripts/submit-learning.ps1 — Active Push

New script for consumer repos. Validates the candidate against the four-point scope
policy (generic, durable, actionable, repo-scoped), writes a structured
YAML+Markdown file to `basecoat-memory/sweep-candidates/`, and optionally opens a
steward review PR with `-OpenPR`. Requires `MEMORY_REPO_TOKEN` env var.

#### .basecoat.yml.example — Sweep Config Template

Documented YAML config template for `basecoat-enabled` repos. Covers:
`learning_labels`, `days_back`, `team`, `contact`, `domain`, `auto_pr`.
Copy to `.basecoat.yml` at the repo root to customize sweep behavior.

#### docs/memory/CONTRIBUTING.md — Consumer Guide

End-to-end guide for repo owners: enlistment, passive label-based signals,
`.basecoat.yml` configuration, active push via `submit-learning.ps1`, scope
policy, and the steward feedback loop.

#### Improved Sweep Candidate Format

`sweep-enterprise-memory.ps1` now emits a structured YAML promotion block per
candidate with auto-guessed domain, subject key, Evidence URL, Does NOT apply to
section, and a four-point scope checklist. Stewards can copy-paste directly to
`memories/{domain}/{subject}.md` — no longer authoring from scratch.

## 3.19.0 - 2026-05-09

### Memory Lifecycle Completion

#### Memory Audit Script — scripts/audit-memories.ps1 (#607, #609, #610)

New script with four modes covering the full memory governance lifecycle:

- **`-Validate`** — checks all `basecoat-memory` memory files for frontmatter
  completeness, fact ≤ 300 chars, `domain:key` subject format, and scope policy
  markers (rejects project-specific technology names). CI-safe, exits 1 on violations.
- **`-Audit`** — scans for stale memories (configurable day threshold, default 180)
  and low-confidence (< 0.50) memories. With `-OpenPR`, moves stale memories to
  `deprecated/{domain}/` via a PR in `basecoat-memory`.
- **`-Update`** — appends new evidence to an existing memory, bumps `last_validated`,
  opens a PR.
- **`-Purge`** — moves a memory to `deprecated/{domain}/` with a deprecation note,
  opens a PR.

#### Memory Audit Workflow — .github/workflows/memory-audit.yml (#609)

Quarterly schedule (1 Jan/Apr/Jul/Oct) + `workflow_dispatch`. Runs `-Validate` on
every scheduled run and `-Audit` on demand. `-OpenPR` input triggers automated
deprecation PR creation for stale memories.

#### Loopback: High-Confidence Hot-Index Promotion (#608)

`contribute-memories.ps1` now detects memories with `confidence >= 0.90` after pushing
and emits a clear list of hot-index promotion candidates, closing the feedback loop
from session memory → shared memory → L2 hot cache.

#### Sprint-20 Memory Payload — docs/memory/sprint-20-memories.json (#611)

Eight valid basecoat-scoped patterns from sprints 15–20, structured for immediate
contribution via `contribute-memories.ps1`. Covers: CI quirks, git hygiene, agent/skill
authoring conventions, sprint workflow, task classification, memory scope policy, and
markdown lint patterns.

## 3.18.0 - 2026-05-09

### Memory Contribution Pipeline

#### Memory Contribution Script — scripts/contribute-memories.ps1 (#602)

New batch export script that reads a JSON array of session memory facts and creates
structured `memories/{domain}/{subject}.md` files in `{org}/basecoat-memory` via the
GitHub API, opening a single PR for steward review. Supports `-DryRun` and `-Force` flags.

#### sync-shared-memory.ps1: add -ExportFile mode (#601)

Added `-ExportFile` parameter. After using `-Export` to generate a template and editing
it, agents can use `-ExportFile /tmp/edit.md -Subject domain:key` to push the file to
`basecoat-memory` on a new branch and open a PR — completing the single-memory contribution
loop without manual `git` operations.

#### Memory Contribute Workflow — .github/workflows/memory-contribute.yml (#603)

New `workflow_dispatch` workflow for agent-triggered batch memory contribution. Accepts
a base64-encoded JSON payload of memory facts, calls `contribute-memories.ps1`, and
emits a job summary. Triggered at sprint end by the coding agent or manually by a steward.

#### Memory Contribution Process Documentation — docs/memory/PROCESS.md (#604)

New document covering the end-to-end pipeline: produce (store_memory) → export
(contribute-memories.ps1 / -ExportFile) → review (PR in basecoat-memory) → promote
(steward merges) → pull (sync-shared-memory.ps1). Includes memory domains taxonomy,
Memory Scope Policy, steward responsibilities, and a scripts/workflows reference.

#### Memory Scope Checklist in memory-index.instructions.md (#605)

Added a four-point checklist (repo-scoped, generic, durable, actionable) agents must
validate before calling `store_memory`. Added `contribute-memory` pattern bundle and
reference link to PROCESS.md. Closes the stale-memory scope-creep issue.

## 3.17.0 - 2026-05-09

### Instruction Trim Completion + Workflow Reliability

#### Fix Copilot Agent Assignment in issue-approve.yml (#596)

Corrected the assignee username from `copilot-swe-agent` to `Copilot` (the correct
GitHub Copilot coding agent username). Added post-assignment verification that re-fetches
the issue and checks the `assignees` list. Posts an honest success or failure comment
with manual instructions when assignment does not stick.

#### GitHub Secrets Operations Runbook (#583)

Created `docs/operations/GITHUB_SECRETS.md` documenting all 4 required repository
secrets (`COPILOT_GITHUB_TOKEN`, `GH_AW_GITHUB_TOKEN`, `GH_AW_GITHUB_MCP_SERVER_TOKEN`,
`STAGING_API_TOKEN`) with setup steps, required scopes, rotation schedules, and
troubleshooting guidance.

#### Instruction Modularization Batch 3 — 4 Instructions (#584)

Applied references/ extraction pattern to four large instruction files:

- **process.instructions.md** — condensed from 10.3 KB; references in
  `references/process/sprint-ceremonies.md`, `issue-and-pr-workflow.md`, `release-and-coordination.md`
- **secrets-management.instructions.md** — condensed from 9.9 KB; references in
  `references/secrets-management/classification-and-storage.md`, `rotation-and-scanning.md`, `emergency-and-compliance.md`
- **security-monitoring.instructions.md** — condensed from 8.8 KB; references in
  `references/security-monitoring/siem-and-alerts.md`, `detection-rules.md`, `incident-escalation.md`
- **observability.instructions.md** — condensed from 8.6 KB; references in
  `references/observability/tracing-and-logging.md`, `metrics-and-sampling.md`, `dashboards-and-compliance.md`

#### Instruction Modularization Batch 4 — 5 Instructions (#595)

Applied references/ extraction pattern to five large instruction files:

- **governance.instructions.md** — condensed from 10.9 KB; references in
  `references/governance/workflow-rules.md`, `agent-self-governance.md`, `guardrails-reference.md`
- **token-economics.instructions.md** — condensed from 8.0 KB; references in
  `references/token-economics/context-routing.md`, `turn-budget.md`
- **quality.instructions.md** — condensed from 7.8 KB; references in
  `references/quality/pr-review-checklist.md`, `agent-handoffs.md`
- **enterprise-configuration.instructions.md** — condensed from 10.8 KB; references in
  `references/enterprise-configuration/seat-management.md`, `metrics-api.md`, `security-and-checklist.md`
- **memory-index.instructions.md** — condensed from 11.2 KB; references in
  `references/memory-index/memory-algorithms.md`



### Agent Compliance + Instruction Trim

#### Agent Compliance Sweep — All 74 Agents (#581)

Added `allowed_skills` frontmatter, `## Model` body section, and `## Governance`
to all agents that were missing them. Every agent now declares its default model,
model rationale, and governance policy.

- **Batch 1 (10 agents):** sprint-planner, release-manager, domain-designer,
  infrastructure-deploy, self-healing-ci, strategy-to-automation,
  legacy-modernization, dotnet-modernization-advisor, release-impact-advisor, feedback-loop
- **Batch 2 (12 agents):** api-security, secrets-manager, hardening-advisor,
  penetration-test, supply-chain-security, config-auditor, security-monitor,
  security-operations, ha-architect, resilience-reviewer, observability-engineer,
  production-readiness
- **Batch 3 (52 agents):** all remaining agents

Lightweight coordination agents (retro-facilitator, sprint-retrospective,
memory-curator, merge-coordinator, rollout-basecoat, project-onboarding,
new-customization, issue-triage) use `claude-haiku-4.5`.

#### Instruction Modularization Batch 2 — 3 Instructions (#582)

Applied references/ extraction pattern to three large instruction files:

- **data-science.instructions.md** — condensed from 13.3 KB to 3.5 KB; detail in
  `references/data-science/notebook-conventions.md`, `medallion-and-duckdb.md`,
  `feature-engineering-and-training.md`
- **data-workload-testing.instructions.md** — condensed from 11.6 KB to 2.3 KB; detail in
  `references/data-workload-testing/data-quality-tests.md`, `layer-test-patterns.md`
- **mutation-testing.instructions.md** — condensed from 11.5 KB to 2.4 KB; detail in
  `references/mutation-testing/mutation-tools-and-ci.md`, `survival-patterns-and-fixes.md`

#### PowerShell CI Test Job (#585)

Added `test` job to `.github/workflows/ci.yml` running `pwsh tests/run-tests.ps1`
on `ubuntu-latest` with artifact upload on failure.

#### Test Fix

Fixed `allowed_skills: []` empty-array validation bug in `tests/agent-integration-tests.ps1`
(PowerShell `return @()` is coerced to `$null` at call site; wrapped with `@(...)` and
added raw-line regex check).

## 3.15.0 - 2026-05-22

### Modularization Sweep + Repo Structure

#### Skill Modularization Batch 3 (6 skills)

Condensed 6 large SKILL.md files (all were 5.2–6.4 KB) to ≤5 KB overview files,
extracting detailed content into `references/` subdirectories per skill.

- **electron-apps** — `process-architecture.md`, `packaging-updates.md`, `testing-security.md`
- **database-migration** — `zero-downtime-patterns.md`, `schema-versioning.md`, `operations-checklist.md`
- **github-security-posture** — `org-checks.md`, `repo-checks.md`
- **contract-testing** — `pact-patterns.md`, `e2e-orchestration.md`
- **azure-waf-review** — `pillar-guide.md`, `workflow-guardrails.md`
- **copilot-usage-analytics** — `api-landscape-detail.md`, `cost-estimation-guide.md`

#### Instruction Modularization Batch 1 (3 instructions)

Applied the same references/ pattern to the three largest instruction files:

- **electron.instructions.md** — condensed from 15.2 KB to 4.2 KB; detail in `references/electron/ipc-security.md` and `csp-child-process.md`
- **nextjs-react19.instructions.md** — condensed from 14.2 KB to 2.4 KB; detail in `references/nextjs/server-components.md` and `app-router.md`
- **agents.instructions.md** — condensed from 14.1 KB to 6.5 KB; detail in `references/agents/skill-pairing.md` and `lifecycle.md`

#### Issue #578 — Internal/Distributable Separation

Added `distribute: false` frontmatter to repo-internal instruction files that should
not be synced to downstream repositories:

- `governance.instructions.md`
- `enterprise-configuration.instructions.md`
- `hrm-execution.instructions.md`
- `token-economics.instructions.md`
- `memory-index.instructions.md`

Sync scripts already honour this flag (validated by test suite). Documented policy
in `CONTRIBUTING.md` under "Asset Distribution". Closes #578.

## 3.14.0 - 2026-05-09

### HRM Formalization + Skill Batch 2 + Memory Intelligence

#### HRM Phase 2 Formal Layer Contracts (`instructions/hrm-execution.instructions.md`)

New instruction file formalizing the Human-Routing-Model Phase 2 adoption path from the TRM/HRM research doc:

- **L0–L4 scope table** — formal input/output contracts and scope constraints per layer
- **EscalationQuery type** — structured object (`intent`, `keywords`, `confidence`, `context_budget_remaining`, `originating_layer`, `reason`) passed between HRM layers
- **Two-dimensional routing matrix** — confidence × context completeness: four routing quadrants from fast path to full HRM traversal
- **Guidance signal catalogue** — 7 signals: `STAY_FAST_PATH`, `EXPAND_CONTEXT`, `ELEVATE_TO_L3`, `ELEVATE_TO_L4`, `TURN_BUDGET_AT_RISK`, `ESCALATE_SCOPE`, `CONFIDENCE_DRIFT`
- **Agent decomposition scope table** — Sprint → Wave → Issue → Task → Sub-task with "can resolve" and "must escalate" columns
- **Cross-layer dependency notation** — `[depends: subject@fact]` comment convention
- Updated `instructions/memory-index.instructions.md` and `instructions/token-economics.instructions.md` with 2D routing matrix references and cross-links

#### TRM Memory Intelligence (`instructions/memory-index.instructions.md`)

- **Pattern bundle Bayesian confidence updates** — `confidence(t) = confidence(t-1) + 0.05 × (outcome(t) - confidence(t-1))`, bounded [0.50, 0.99]; quarterly drift review for bundles drifting > 0.15 from authored value
- **Memory promotion heat scoring** — `heat(t) = 0.85 × heat(t-1) + 0.15 × relevance(t)` where relevance ∈ {1.0 applied, 0.5 loaded, 0.0 not loaded}; `[heat-score: <value>]` inline comment convention for L2 index entries; raw access-count thresholds replaced with heat thresholds

#### Large Skill Modularization Batch 2 (`skills/`)

Applied the `references/` pattern to the next 7 skills by size:

| Skill | Before | After | Reference Files |
|---|---|---|---|
| `identity-migration` | 12.5 KB | ≤5 KB | migration-patterns, azure-integration, testing-checklist |
| `basecoat` | 8.7 KB | ≤5 KB | authoring, governance |
| `tech-debt` | 7.8 KB | ≤5 KB | assessment, remediation |
| `dev-containers` | 7.8 KB | ≤5 KB | configuration, workflows |
| `api-security` | 7.6 KB | ≤5 KB | threat-model, controls |
| `ha-resilience` | 7.2 KB | ≤5 KB | patterns, testing |
| `azure-devops-rest` | 7.0 KB | ≤5 KB | pipelines, extensions |

Each `SKILL.md` is now a ≤5 KB overview + nav table; detailed content lives in `references/*.md`.

#### Dependency Hygiene

- Merged PR #577: esbuild, `@storybook/addon-essentials`, and `@storybook/react` bumps in `portal/ui`

## 3.13.0 - 2026-05-08

### TRM Intelligence + Skill Modularization + MCP Expansion

#### TRM Reflexion Instruction (`instructions/trm-reflexion.instructions.md`)

New instruction file implementing the TRM Phase 1 adoption path from the research doc:

- **Two-pass intent classification** — Pass 1 on L2 trigger map; Pass 2 only in the 0.30–0.79 confidence band; converges immediately at ≥ 0.80 or ≤ 0.30
- **Reflexion failure signal** — structured `REFLEXION` block injected into next pass on repeated misrouting; forces explicit failure reflection before reclassifying
- **Self-consistency cap** — k=3 maximum passes; Pass 3 uses majority vote across all three passes
- **Progress estimator** — exponential moving average `estimate(t) = estimate(t-1)×0.7 + observation(t)×0.3`; fires checkpoint when progress/turns_remaining < 0.6
- **HRM tier integration** — TRM confidence score surfaces alongside fast/full routing decision
- Updated `instructions/token-economics.instructions.md` and `instructions/memory-index.instructions.md` with cross-references to `trm-reflexion.instructions.md`

#### Large Skill Modularization (`skills/`)

Applied the `references/` pattern (proven in `service-bus-migration`) to the top 5 skills by size:

| Skill | Before | After | Reference Files |
|---|---|---|---|
| `cqrs-event-sourcing` | 19.7 KB | 2.8 KB | command-side, event-sourcing, read-side, sagas-operations |
| `e2e-testing` | 14.1 KB | 1.9 KB | playwright-patterns, cypress-patterns, ci-integration |
| `penetration-testing` | 13.7 KB | 2.5 KB | test-cases, exploitation, reporting |
| `gitops` | 9.5 KB | 2.0 KB | flux-argocd, multi-cluster-secrets |
| `twelve-factor` | 9.5 KB | 2.4 KB | factors-1-6, factors-7-12 |

Each SKILL.md is now a ≤5KB overview with a navigation table; all detail lives in `references/*.md` (≤5KB each).

#### MCP Asset Search Tools (`mcp/basecoat-metrics/src/index.ts`)

Three new tools added to the `basecoat-metrics` MCP server:

- **`search-skills`** — fuzzy (case-insensitive substring) search across all skills by name or description; requires `REPO_DIR`
- **`search-agents`** — same for agents
- **`get-asset-details`** — returns full file content of any skill or agent by relative path; path traversal protection included
- `REPO_DIR` env var documented in `mcp/basecoat-metrics/README.md`; pre-wired in `.vscode/mcp.json` via `${workspaceFolder}`
- `tests/mcp-tests.ps1` updated to validate all three new tools and `REPO_DIR` support

#### Dependency Update Advisor (`agents/`, `.github/workflows/`)

New agentic workflow for automated Dependabot PR triage:

- **`agents/dependency-update-advisor.agent.md`** — defines the full workflow: semver bump detection, breaking change lookup, impact surface analysis, CVE context, structured comment posting
- **`.github/workflows/dependency-update-advisor.yml`** — GitHub Actions workflow triggered on `pull_request: opened` for Dependabot PRs; posts a `🔍 Dependency Update Risk Assessment` comment with risk level (LOW/MEDIUM/HIGH), breaking change detection from release notes, test focus suggestions, and CVE context

## 3.12.0 - 2026-05-08

### MCP Deployment Infra, Enterprise Memory Sweep, Portal Consolidation

#### MCP Server Deployment (`mcp/basecoat-metrics/`, `infra/mcp/`, `.github/workflows/`)

Full production deployment stack for the `basecoat-metrics` MCP server:

- **`mcp/basecoat-metrics/Dockerfile`** — multi-stage `node:22-alpine` build, non-root `mcp` user, `HEALTHCHECK`, port 8080
- **`mcp/basecoat-metrics/src/index.ts`** — added `StreamableHTTPServerTransport`; HTTP mode when `MCP_TRANSPORT=http` or `NODE_ENV=production`; stdio stays default for local dev
- **`infra/mcp/main.bicep`** — Azure Container Apps + Log Analytics Workspace; scales to zero; HTTPS auto-TLS; liveness + readiness probes; HTTP scaling rule
- **`infra/mcp/README.md`** — one-time setup, service principal creation, manual deploy steps, parameter table
- **`.github/workflows/mcp-build.yml`** — PR gate: `npm ci` → `tsc` → Docker build smoke test → `az bicep build` lint; triggers on `mcp/**` and `infra/mcp/**`
- **`.github/workflows/mcp-deploy.yml`** — on merge to `main`: build + push to GHCR → Bicep deploy → smoke-test `/health`; requires `AZURE_CREDENTIALS` and `MCP_RESOURCE_GROUP` secrets
- **`.vscode/mcp.json`** — local stdio + remote HTTP entries for the deployed Azure Container Apps FQDN

#### Enterprise Memory Sweep (`scripts/`, `docs/memory/`, `.github/workflows/`)

Zero-maintenance enterprise repo enlistment and weekly memory extraction:

- **`docs/memory/enlistment.md`** — repo opt-in via `basecoat-enabled` GitHub topic; optional `.basecoat.yml` per-repo config; `MEMORY_REPO_TOKEN` setup guide
- **`scripts/sweep-enterprise-memory.ps1`** — discovers `basecoat-enabled` repos via GitHub API, extracts PR/issue/CHANGELOG signals, writes dated candidate files
- **`.github/workflows/memory-sweep.yml`** — weekly sweep (Monday 06:00 UTC); writes to `{org}/basecoat-memory` (separate repo), opens PR there for human review; two-token pattern: `GITHUB_TOKEN` for reads, `MEMORY_REPO_TOKEN` for writes

#### Portal Consolidation (`portal/`)

- Moved `portal-ui/` → `portal/ui/` via `git mv` (full history preserved)
- `portal/README.md` rewritten as monorepo index documenting `frontend/`, `backend/`, `ui/`, `prompts/`
- `@basecoat/portal-ui` npm package name unchanged; only the path moved

#### Test Coverage (`tests/`)

- **`tests/mcp-tests.ps1`** — 8 check groups covering MCP file structure, IaC, workflows, `.vscode/mcp.json`, Dockerfile hardening, HTTP transport, Bicep outputs, secret references
- **`tests/run-tests.ps1`** — MCP tests wired in after data-workload tests



### Docs Reorganization, Memory Design Docs, Architecture Diagrams

#### Docs Reorganization (`docs/`)

Complete restructuring of 155+ files into an 8-section taxonomy for navigability:

- **`docs/architecture/`** — execution hierarchy, multi-agent orchestration, AI patterns
- **`docs/guides/`** — enterprise setup, rollout, governance, hooks, rate-limit
- **`docs/reference/`** — CLI, label taxonomy, asset registry, INVENTORY, prompt registry
- **`docs/agents/`** — agent testing, skill map, telemetry, handoffs, runtime enforcement
- **`docs/memory/`** — SQLite memory, shared memory, token optimization, local models
- **`docs/operations/`** — release process, runbooks, cost optimization, DR, blocked issues
- **`docs/integrations/`** — MCP, RAG, pydantic, Azure-specific, portal, app inventory
- **`docs/archive/`** — wave summaries, staging reports, sprint deliverables
- Updated `docs/INDEX.md` with full 8-section taxonomy and diagram links
- Updated `README.md` all broken doc links to new paths
- Updated `sync.ps1` to find `INVENTORY.md` at new `docs/reference/` location

#### Memory Design Documentation (`docs/memory/`)

Three new authoritative docs for the BaseCoat memory model:

- **`MEMORY_DESIGN.md`** — full L0–L4 hierarchy, retrieval cost, promotion ladder, turn budget, failure protocols, SQLite schema, fork guidance
- **`LEARNING_MODEL.md`** — Routine/Familiar/Novel knowledge taxonomy, TRM/HRM research context, adopter warm-up path, pattern bundle lifecycle, anti-patterns
- **`SHARED_MEMORY_GUIDE.md`** — full setup walkthrough, writing good entries, contribution flow, sync script usage, maintenance cadence

#### Architecture Diagrams (`docs/diagrams/`)

10 new Excalidraw diagrams providing visual reference for architecture and process flows:

**Architecture (5):**
- `execution-hierarchy.excalidraw` — 5-layer execution stack from user intent to output
- `multi-agent-orchestration.excalidraw` — LangGraph StateGraph fan-out/fan-in pattern
- `asset-taxonomy.excalidraw` — four primitive asset types and their relationships
- `memory-lookup-hierarchy.excalidraw` — L0–L4 memory layer lookup and retrieval cost
- `two-tier-memory-model.excalidraw` — personal vs shared memory tiers

**Process (5):**
- `intent-routing.excalidraw` — fast-path vs deep-reasoning routing decision
- `turn-budget-protocol.excalidraw` — token budget enforcement and graceful degradation
- `memory-promotion-flow.excalidraw` — pattern promotion and demotion ladder
- `agentic-workflow-lifecycle.excalidraw` — PR trigger → filter → agent → safe output
- `bootstrap-flow.excalidraw` — 4-phase bootstrap script flow

All diagrams indexed at `docs/diagrams/README.md`.

## 3.10.0 - 2026-05-08

### Bootstrap, Agentic Workflows Tier 1-2, Azure Instructions, Shared Org Memory

#### Bootstrap (`scripts/bootstrap.ps1`)

New idempotent 4-phase setup script for new BaseCoat adopters:

- **Phase 1 — Repo setup**: fork/clone detection, `gh` CLI check, `gh aw` extension install prompt, GitHub Actions status verification
- **Phase 2 — Memory layer**: `.gitignore` guard for SQLite/session-state files, `.memory/` directory init, optional shared org memory sync
- **Phase 3 — Secrets checklist**: `COPILOT_GITHUB_TOKEN` presence check, `BASECOAT_SHARED_MEMORY_REPO` config, `version.json` readability
- **Phase 4 — Validation**: runs `validate-basecoat.ps1` + `tests/run-tests.ps1`; actionable error list on failure
- Flags: `-Silent` (CI use), `-SkipTests`, `-SharedMemoryRepo`

#### Agentic Workflows — Tier 2 (`.github/workflows/`)

New `security-analyst.md` + compiled `security-analyst.lock.yml`:

- Triggers on `pull_request: [opened, synchronize]`
- Performs OWASP Top 10 spot check scoped to PR diff, secret scan, dependency risk assessment
- Posts a severity-ranked findings table only when issues are found — no noise on clean PRs
- Completes the Tier 1+2 agentic workflow set: `issue-triage`, `retro-facilitator`, `self-healing-ci`, `code-review-agent`, `release-impact-advisor`, `security-analyst`

#### Azure Instructions

- **`instructions/azure-service-connector.instructions.md`**: managed identity authentication (system/user-assigned), Key Vault references for secrets, Bicep `Microsoft.ServiceLinker/linkers` patterns, standard environment variable names, connection validation
- **`instructions/azure-app-configuration.instructions.md`**: key naming hierarchy (`{service}/{component}/{key}` + labels), feature flags with safe defaults, dynamic refresh with sentinel key, `disableLocalAuth`, purge protection, private endpoints, SDK usage pattern (.NET example)

#### Shared Org Memory Repo

- Created `IBuySpy-Shared/basecoat-memory` private repo — the shared L2s/L3s memory tier for the org
- Seeded from `docs/templates/basecoat-memory/`: README, CONTRIBUTING, hot-index, validate-memory CI workflow
- Sync via `scripts/sync-shared-memory.ps1 -SharedMemoryRepo IBuySpy-Shared/basecoat-memory`

## 3.9.0 - 2026-05-07

### Adaptive Execution Hierarchy + Memory Fast-Path Routing

#### Execution Hierarchy (`docs/execution-hierarchy.md`)

New reference document defining the 5-layer execution stack for all BaseCoat agents:

- **Layer 0** — System instructions (host/provider, immutable)
- **Layer 1** — BaseCoat guardrails as structural circuit breakers (governance, security, agent-behavior); fire at fixed checkpoints regardless of fast/full path — cannot be routed around
- **Layer 2** — Intent classification using L2 memory index (zero extra context cost); routes to fast path or full path based on confidence score
- **Layer 3a Fast Path** — Pattern bundle loaded for known intents (confidence ≥ 0.80); pre-scoped context + pre-validated turn budget
- **Layer 3b Full Path** — Layered context load for novel/low-confidence tasks; L2 → L3 episodic → L4 semantic
- **Layer 5** — Post-execution learning: reinforce successful novel patterns to memory; log failure patterns on stuck tasks

Pattern bundle catalog: 9 known BaseCoat patterns with turn budgets and confidence lifecycle (degrades on overruns, retires below 0.50).

#### Memory Lookup Hierarchy (`instructions/memory-index.instructions.md`)

New L2 hot-cache instruction file — loads at session start to prime fast recall:

- L0–L4 tier map with retrieval cost per tier
- Promotion ladder: `store_memory` accessed 3× → L2 index; 5 sessions → L1 instruction rule; >50% sessions → L0 frontmatter
- Pinned patterns exempt from decay (security, governance)
- Trigger map organized by domain (CI, testing, portal, git, assets, turn budget)
- Episodic retrieval SQL shortcuts for L3 queries

#### Turn Budget and Learning Cost (`instructions/token-economics.instructions.md`)

- Classify tasks as **Routine** (≤3 turns), **Familiar** (≤5 turns), or **Novel** (estimate N) before starting
- **Failure protocol**: after 5 turns with no measurable forward progress → `store_memory` failure pattern, change approach before escalating model tier
- **Success protocol**: novel solution + tests pass → `store_memory`; skip for boilerplate
- **80/50 early-warning rule**: at 80% turn budget with <50% progress → pause and reassess
- Intent-first context loading replaces static layered order

#### Memory Schema Extensions (`docs/SQLITE_MEMORY.md`)

- Added columns: `tier` (l0–l4), `heat` (cold/warm/hot), `pinned`, `promotion_count`, `last_promoted_at`
- Heat thresholds: cold (0–2 accesses), warm (3–9), hot (10+)
- Pinned flag exempts memories from decay and demotion

#### Memory Curator Agent (`agents/memory-curator.agent.md`)

- L0–L4 lookup hierarchy with retrieval cost per tier
- Promotion protocol (myelination): access frequency drives tier promotion
- Heat-based proactive injection: hot memories injected at session start when domain matches
- Resolution order for SessionStart and PostToolUse failure paths

#### Plan-First Workflow (`instructions/plan-first.instructions.md`)

- Phase 0 (Intent Classification) added before Explore phase
- Fast-path tasks skip directly to Plan using bundle context
- Guardrails still fire at structural checkpoints on all paths

## 3.8.0 - 2026-05-07

### Sprint 11 — GitHub Agentic Workflows + Portal Scan Trigger

#### Agentic Workflows (`gh aw`)

Five BaseCoat agents converted to GitHub Agentic Workflows that run automatically
inside GitHub Actions. Each workflow is a `.md` source file compiled to a
`.lock.yml` with the `gh aw` framework's defense-in-depth security model
(read-only agent job → threat detection → safe-output execution).

- **`issue-triage`** — fires on `issues: opened`; classifies issue type, applies
  priority labels (`P0`–`P3`), and posts a triage summary comment (#562)
- **`retro-facilitator`** — `schedule: weekly`; analyzes closed issues and merged
  PRs for the past 7 days and creates a structured Went Well / Improve / Action
  Items retrospective issue (#563)
- **`self-healing-ci`** — fires on `workflow_run: failed`; fetches failed job logs
  and posts a root-cause diagnosis with remediation steps (#564)
- **`release-impact-advisor`** — fires on `pull_request: opened`; assesses blast
  radius, rollback complexity, and risks for the PR diff (#566)
- **`code-review-agent`** — fires on `pull_request: [opened, synchronize]`; reviews
  the diff for bugs, security vulnerabilities, and logic errors with
  high signal-to-noise ratio (#567)

#### Portal — Scan Trigger

- **Trigger Scan button** in `RepositoryDetail` — POST `/api/v1/repositories/:id/scans`,
  disabled while running, error banner on failure (#565)
- **`useScanPoller` hook** — polls `GET /api/v1/scans/:id` every 3s until
  `completed` or `failed`; auto-refreshes scan history table (#565)
- **Scan running badge** — visual indicator while polling is active (#565)
- **Backend stub runner** — scan transitions `running → completed` via 5s timeout,
  enabling end-to-end demo without a live scanner (#565)
- **20 tests** — 6 `useScanPoller` unit tests + 14 `RepositoryDetail` tests (#565)

#### Documentation

- **`docs/agentic-workflows.md`** — `COPILOT_GITHUB_TOKEN` PAT setup guide,
  workflow authoring instructions, security model overview, allowed-expressions
  reference

#### Security

- Bump `path-to-regexp` 8.3.0 → 8.4.2 in `/mcp` (#559)

## 3.7.0 - 2026-05-07

### Sprint 10 — Portal UX, Docker Deployment, and Plugin Docs

#### Portal Frontend

- **Dashboard charts** — recharts `ScanBarChart` (scans per repo) and `ScanStatusPie` (pass/fail distribution) with summary cards for total repos, total scans, pass rate (#548)
- **Repository detail page** — `RepositoryDetail.tsx` with scan history table, status badges, and back navigation; 7 unit tests (#549)
- **Repositories list** — `Repositories.tsx` list page with repo name, scan count, and last-scan status (#549)

#### Docker Deployment

- **Multi-stage Dockerfiles** — `portal/backend/Dockerfile` (node:20-alpine, `USER node`) and `portal/frontend/Dockerfile` (Vite build + nginx:alpine runtime) (#550)
- **docker-compose.yml** — Full stack: `postgres:16` + `backend:3000` + `frontend:8080` with health checks and env-var injection (#550)
- **nginx SPA routing** — `portal/frontend/nginx.conf` with `/api` proxy pass and `try_files` fallback for React Router (#550)
- **`.env.example`** — Documented all required environment variables (#550)
- **Portal quickstart** — `portal/README.md` with Docker Compose and manual dev-server setup instructions (#550)

#### CLI Plugin Docs

- **Plugin README** — End-user documentation for `@basecoat/copilot-cli-plugin`: install, config, API, and troubleshooting (#551)
- **npm publish config** — Added `files`, `publishConfig`, `keywords`, `repository`, and `engines` to `plugins/copilot-cli-plugin/package.json` (#551)
- **`.npmignore`** — Excludes test files, source maps, and dev configs from published package (#551)

#### CI / Agent Quality

- **Sync test robustness** — `Invoke-SyncToConsumer` now creates a temp named branch for `git clone` instead of using detached-HEAD ref; works in all CI states (PR merge commits, tag checkouts, shallow clones)
- **Agent output sections** — Fixed `## Key Outputs` → `## Output` in `api-security`, `database-migration`, `e2e-test-strategy`, and `gitops-engineer` agents to satisfy word-boundary CI validation
- **CRLF fix** — `skills/azure-container-apps/SKILL.md` converted to LF

#### Security Updates (Dependabot)

- Bump `vite` 5.4.21 → 8.0.11 in `/portal/frontend` (#532)
- Bump `tar` and `sqlite3` in `/portal/backend` (#528)
- Bump `@tootallnate/once` and `sqlite3` in `/portal/backend` (#527)
- Bump `hono` 4.12.8 → 4.12.18 in `/mcp` (#518)
- Bump `@hono/node-server` 1.19.11 → 1.19.14 in `/mcp` (#517)
- Bump `ip-address` and `express-rate-limit` in `/mcp` (#516)
- Bump `minimatch`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` in `/portal-ui` (#514)



## 3.6.0 - 2026-05-07

### Sprint 9 — Plugin Wiring, Portal API, Auth, and Frontend Data

#### Copilot CLI Plugin

- **invoke() wired end-to-end** — `parseCommand → buildContext → findAgent → delegate`, never throws, returns structured `DelegationResult` (#533)
- **CLI binary** — `src/cli.ts` + `bin/basecoat` npm binary with `--help`, `--version`, exit codes (#536)
- **Integration tests** — 7 plugin e2e tests covering success, agent-not-found, parse errors, streaming, config override (#538)

#### Portal Backend

- **REST API** — 6 endpoints: `GET/POST /api/v1/repositories`, `GET /api/v1/repositories/:id`, `POST/GET /api/v1/repositories/:id/scans`, `GET /api/v1/scans/:id` with `{ data }` envelope (#534)
- **GitHub OAuth + JWT** — passport-github2 strategy, `requireAuth` middleware, `/auth/github`, `/auth/github/callback`, `/auth/logout`, `GET /api/v1/me` (#535)
- **Auth on API routes** — repositories and scans routes now require valid JWT (#538)
- **Integration tests** — 12 portal API tests covering auth middleware and full CRUD flow (#538)

#### Portal Frontend

- **GitHub OAuth flow** — Login page, AuthCallback (`?token=` param), JWT in localStorage (#537)
- **Protected routes** — `ProtectedRoute` wraps all authenticated pages, redirects to `/login` (#537)
- **Live data** — Dashboard fetches real `/api/v1/repositories` with loading spinner and error banner (#537)
- **Axios interceptor** — Bearer token on all requests, auto-logout on 401 (#537)
- **Logout** — Sidebar logout clears JWT and redirects to `/login`; Header shows real username (#537)

## 3.5.0 - 2026-05-09

### Sprint 8 — Copilot CLI Plugin and Portal Scaffold

#### Copilot CLI Plugin (`plugins/copilot-cli-plugin/`)

- **Agent registry design** — JSON Schema Draft 7, 73-agent registry, TTL-cached loader, fuzzy search (#478, #482)
- **Plugin scaffold** — `BasecoatPlugin` class, TypeScript interfaces, ESLint/Prettier/Jest setup (#477)
- **Command parser** — `/basecoat <agent-id> <task> [--flags]` with validation, quoted strings, 40 tests (#479)
- **Context builder** — OS/shell detection, ISO 8601 timestamp, `InvocationContext` assembly, 17 tests (#481)
- **Delegation engine** — `Promise.race` timeout, exponential backoff retry, streaming chunks, 83 total tests (#483)

#### Portal Backend (`portal/backend/`)

- **Express scaffold** — TypeScript, Sequelize, Winston logger, request logger, error handler, `GET /health` (#485)
- **Data models** — User, Repository, Scan, ScanResult, AuditLog with associations and 5 Sequelize migrations (#486)

#### Portal Frontend (`portal/frontend/`)

- **React scaffold** — React 18 + Vite 5 + TypeScript + Tailwind CSS + Zustand + React Router v6 (#487)
- Dashboard with stat cards, searchable Agents page, sidebar navigation, Axios API client

## 3.4.0 - 2026-05-08

### Repository Structure Cleanup

- **`docs/portal/`** — 21 portal/IAM/accessibility/security docs moved out of repo root and `docs/` (#501)
- **`docs/wireframes/`** — 6 Excalidraw wireframe files relocated from repo root (#501)
- **`portal/prompts/`** — 5 portal-specific prompts moved out of `prompts/` sync path (#503)
- **`docs/INDEX.md`** — New repo-wide documentation map covering all 60+ docs by topic (#502)
- **`docs/PORTAL_INDEX.md`** — Former `docs/INDEX.md` (portal infrastructure index) preserved (#502)
- **`scripts/generate-inventory.ps1`** — New script to validate asset counts against INVENTORY.md and README.md (#505)

### INVENTORY.md Completion

- Added 21 missing agent entries (73 total, up from 52)
- Added 22 missing skill entries (55 total, up from 33)
- All counts verified: 73 agents · 55 skills · 56 instructions · 8 prompts

## 3.3.0 - 2026-05-08

### Deployable MCP Server

- **`mcp/` server** — standalone Node.js MCP server exposing Base Coat assets as tools
- **Docker + Azure Container Apps** deployment support with `Dockerfile` and deployment guide
- **`docs/mcp-deployment.md`** — step-by-step deployment guide for Docker and ACA
- **`examples/mcp/basecoat.mcp.json`** — reference MCP client configuration

### Squad Workflow Automation

- **`.github/agents/squad.agent.md`** — squad coordination agent for GitHub issue management
- **4 GitHub Actions workflows**: `squad-heartbeat`, `squad-issue-assign`, `squad-triage`, `sync-squad-labels`
- **`.copilot/mcp-config.json`** — MCP configuration for squad integration

### Consumer Smoke Tests

- **`tests/run-consumer-smoke.ps1`** — Windows smoke test script for release artifact validation
- **`tests/run-consumer-smoke.sh`** — Unix smoke test script for CI/CD pipeline use

### CI Hardening

- **16 agent files** fixed with missing required `## Inputs`, `## Workflow`, `## Output` sections
- **`actions/upload-artifact`** upgraded from deprecated v3 → v4 in performance baseline check
- **`.markdownlintignore`** — excludes third-party agent files from markdown lint CI
- **`version-consistency`** now reliably enforced across all PR branches

## 3.2.0 - 2026-05-07

### Wave 3 Portal Design Acceleration — Design Validation & Implementation Readiness

This release delivers the complete Wave 3 Days 2-3 outputs: formal validation sign-offs,
implementation scaffolding, and Go/No-Go approval for Sprint 7 (May 11 kickoff).

#### Architecture & API Sign-Offs
- **Architecture Review** — Formal APPROVED status with 11 documented risks and mitigations
- **API Contract Sign-Off** — Binding contracts for 28+ endpoints (OAuth 2.0, RBAC matrix, rate limiting, multi-tenancy audit trail)

#### Security
- **Security Risk Mitigation Roadmap** — OWASP Top 10, STRIDE (20 threats), SOC 2, GDPR mapped to 4-week sprint delivery plan

#### Implementation Scaffolding
- **@basecoat/portal-ui v0.1.0** — React component library (5 production components, 96.99% test coverage, WCAG 2.1 AA)
- **Performance Testing Framework** — 5 k6 load test scripts + Prometheus/Grafana monitoring + GitHub Actions CI/CD integration; baselines: <500ms p95 at 100 users
- **Pydantic v2 Schemas** — Complete artifact schema definitions (Agent, Skill, Instruction, Prompt, CustomInstruction + CompatibilityEnum/MaturityEnum)

#### Documentation
- Wave 3 deliverables manifest and staging infrastructure deployment documentation
- Staging cost estimate: $250-315/month (AWS multi-AZ)
- Final deployment readiness report — **✅ GO for Sprint 7 May 11 kickoff**

## 3.1.0 - 2026-05-07

### Monolith AI Guidance & Production Sync

- Instruction sets for monolith decomposition, C++, runtime debugging, and AI verification
- Automated production sync workflow (publish-to-production CI/CD)

## 3.0.0 - 2026-05-04

### Major Release: Enterprise-Scale Ecosystem Complete

This major release represents the completion of the full enterprise customization framework for GitHub Copilot. 

#### Highlights
- **73 Production Agents** — End-to-end coverage for DevOps, security, architecture, data, and development workflows
- **55 Reusable Skills** — Modular, composable patterns for integration, infrastructure, and service patterns
- **52 Instruction Sets** — Language-specific, framework-specific, and discipline-specific guidance
- **3 Prompt Templates** — VS Code routing, model selection, and multi-turn conversation patterns
- **53 Enterprise Documentation** — Architecture guidance, migration playbooks, governance frameworks
- **100% Validation Coverage** — All assets validated, indexed, and cross-referenced
- **Rate-Limit Protected** — Exponential backoff strategy for GitHub API and LLM inference
- **Zero Regression Testing** — Complete sprint delivery with maintained code quality

#### New Assets (Post-v2.9.0)
- `agents/cloud-agent-auto-approval.agent.md` — GitHub Actions workflow automation for Copilot cloud agent (#383)
- Comprehensive rate-limit guidance and exponential backoff utilities (#446)
- Multi-agent orchestration patterns research and implementation (#450)
- Untools integration framework evaluation (#444)
- Pydantic schema validation investigation (#448)
- 4-agent concurrency wave batching (#451)
- Test failure propagation hardening (#403)
- Agent Skills spec validation warnings reduced 127 → 0 (#402)

#### Documentation Updates
- `CONTRIBUTING.md` — Updated with rate-limit discipline, GitHub Actions auto-approval, issue labeling standards
- `docs/LABEL_TAXONOMY.md` — Formalized taxonomy (7 categories, 11.4 KB)
- `scripts/validate-basecoat.ps1` — Enhanced validation with optional frontmatter recognition
- `tests/run-tests.ps1` — Improved error propagation and coverage tracking
- `docs/ENTERPRISE_*.md` — 10 comprehensive enterprise guides (networking, database, DNS, observability, DR, SLA/SLO, .NET, identity, security, Kubernetes)

#### Infrastructure & Automation
- `.github/workflows/issue-approve.yml` — Concurrency group for max 4 concurrent cloud agents
- `.github/workflows/auto-approve-cloud-agent-workflows.yml` — Auto-approval workflow for cloud agent PRs
- `scripts/bootstrap-fabric-workspace.ps1 & .sh` — Cross-platform Fabric automation (21 KB combined)
- Fabric notebooks deployment patterns with medallion architecture
- Service principal bootstrap with OIDC federation

#### Quality Metrics (Post-Sprint Delivery)
- **Test Coverage**: 100% maintained throughout all 3 sprints
- **Regressions**: 0 introduced
- **Rate-Limit Errors**: 0 (exponential backoff strategy successful)
- **Validation Warnings**: 127 → 0 (Sprint 5)
- **Open Issues**: 0 (all 31 sprint issues closed)
- **Open PRs**: 0 (all feature work merged)

### Statistics
- **Lines Added**: ~12,000+ across all sprints
- **Issues Closed**: 31 (Sprints 5-7 complete)
- **Commits**: 40+ conventional-format commits
- **Releases**: 3 published (v2.1.0, v2.2.0, v2.3.0) during sprint execution
- **Assets**: 73 agents + 55 skills + 52 instructions + 3 prompts + 53 docs

### Breaking Changes
None — v3.0.0 maintains backward compatibility with v2.x patterns.

## 2.7.0 - 2026-05-02

### Added
- `docs/BLOCKED_ISSUES.md` — Known limitations, prerequisites, and workarounds for API constraints (#283, #282)
- `docs/AGENT_SKILL_MAP.md` — Complete index of agents and skills by discipline, with quick-reference guide
- Complete Tier 2B ecosystem work: Supply chain security agents, OpenTelemetry instrumentation guidance
- Skill refactoring guidance for modular `references/` subdirectory pattern (Phase 2 #330)
- All 59 agents now fully documented with cross-references and adoption guidance

### Fixed
- Documented GitHub API limitations blocking per-model billing data collection (#283)
- Documented enterprise prerequisite for Copilot usage metrics (#282)



### Added
- `skills/electron-apps/SKILL.md` — Electron app development patterns: IPC, CSP, state management, testing, packaging, auto-updates (#346)
- `instructions/fabric-notebooks.instructions.md` — Medallion architecture for Fabric notebooks, lakehouse integration, CI/CD automation, governance (#377)
- `agents/security-operations.agent.md` — SOC playbook, threat detection, incident response, secrets rotation, audit logging (#360)
- `agents/penetration-test.agent.md` — Penetration testing workflows, OWASP Testing Guide alignment, finding templates (#364)
- `agents/production-readiness.agent.md` — PRR gates, business continuity planning, disaster recovery, FMEA analysis (#363)
- `agents/ha-architect.agent.md` — High availability patterns, resilience review, SRE/chaos engineering (#362)
- `agents/contract-testing.agent.md` — Consumer-driven contracts, Pact, mutation testing, integration test orchestration (#361)
- `agents/data-architect.agent.md` — Medallion architecture, data governance, ETL/ELT patterns, performance optimization (#365)
- `agents/database-migration.agent.md` — Zero-downtime migrations, schema evolution, dual-write strategies (#365)
- `agents/gitops-engineer.agent.md` — Argo CD, Flux v2, drift detection, disaster recovery patterns (#365)
- All supporting skills for Tier 1B security, operations, and data agents
- Agent Skills spec validator integration (Phase 2 #327)
- Cross-client interop sync paths for `.agents/skills/` (Phase 2 #329)

### Fixed
- Agent Skills spec frontmatter adoption for all 59 agents (100% coverage)



### Added
- `agents/data-pipeline.agent.md` — orchestrates data ingestion, transformation, quality validation workflows (#379)
- `agents/github-security-posture.agent.md` — analyzes org/repo security settings, permissions, branch protections, secret scanning (#381)
- `agents/vs-code-handoff.agent.md` — seamless skill/agent handoff workflows between VS Code Copilot and other tools (#382)
- Cloud agent coordination workflows with auto-approval and self-merge for continuous delivery (#379-382)

## 2.4.0 - 2026-05-01

### Added
- `model` and `tools` frontmatter fields to all 3 prompt files for VS Code routing (#321)
- Browser storage threat model section in `security.instructions.md` (#344)
- Security headers section in `nextjs-react19.instructions.md` with CSP baseline (#344)
- `instructions/rest-client-resilience.instructions.md` — timeouts, retries, 429 handling, semaphores, structured failure logging (#347)
- `skills/azure-devops-rest/SKILL.md` — auth, PAT scopes, pagination, throttling, endpoint taxonomy (#345)

## 2.3.0 - 2026-05-01

### Added
- `instructions/terraform-init.instructions.md` — always use `-reconfigure` in bootstrap and CI/CD (#353)
- `instructions/bootstrap-autodetect.instructions.md` — auto-detect values via param → env → CLI cascade, no prompts (#348)
- `instructions/bootstrap-github-secrets.instructions.md` — auto-push secrets/variables via `gh` CLI (#350)
- `instructions/ci-firewall.instructions.md` — single-job runner IP firewall pattern with guaranteed cleanup (#351)
- `instructions/bootstrap-structure.instructions.md` — decomposed, idempotent, documented bootstrap scripts (#349)
- `instructions/rbac-authentication.instructions.md` — RBAC-only Azure auth, disable shared keys/SAS/access policies (#352)

## 2.2.0 - 2026-05-01

### Fixed
- **CRITICAL**: Skill invocation self-contradiction in `agents.instructions.md` — clarified that omitting `allowed_skills` inherits all skills, and the `## Allowed Skills` section filters when present
- Branch naming conflict between governance and process instructions — `process.instructions.md` now defers to governance (`feat/<issue>-desc` pattern)
- Model routing table in `agents.instructions.md` aligned with `model-routing.instructions.md` (claude-sonnet-4.6 for standard tier)
- `azure/login@v1` → `@v2` in environment-bootstrap skill
- BinaryFormatter (RCE vector) replaced with System.Text.Json in service-bus-migration skill
- ClientSecret patterns in identity-migration skill now include security warnings and use env vars
- ADR path standardized to `docs/adr/` in architecture.instructions.md
- Self-merge policy clarified — permitted when repo policy allows
- 4 agent name mismatches fixed (Title Case → kebab-case): app-inventory, containerization-planner, infrastructure-deploy, legacy-modernization
- 3 agents with fictional tools replaced with real platform tools: legacy-modernization, infrastructure-deploy, release-impact-advisor

### Added
- `AGENTS.md` — root-level file listing all 50 agents for cross-tool AI agent discovery
- `context: fork` frontmatter added to 6 large skills (>5KB) for efficient VS Code context management
- Domain-specific sections added to 3 stub agents: code-review (review checklist), new-customization (decision tree), rollout-basecoat (distribution channels)

## 2.1.1 - 2026-05-01

### Fixed
- Sync scripts no longer copy agent taxonomy subdirs (`models/`, `orchestrator/`, `tasks/`, `types/`) to consumer repos — these contained only index READMEs with broken relative links
- `.github/agents/` Copilot discovery path now receives only flat `*.agent.md` files (no subdirs)
- Package Base Coat workflow no longer skips jobs on tag push — `validate-basecoat.yml` now accepts a `concurrency_group` input to prevent collisions with simultaneous push-to-main validate runs

### Changed
- `docs/GOALS.md` — updated for v2.1.0 (agent counts, model frontmatter, process discipline)
- `docs/repo_history/2026-05-01-story-of-basecoat.md` — added Chapter 8 (Sprint 6, v2.1.0, post-release fixes)

## 2.1.0 - 2026-05-01

### Added
- `agents/sprint-retrospective.agent.md` — new agent for generating structured sprint retrospectives with metrics, timelines, and actionable tips
- `skills/sprint-retrospective/SKILL.md` — companion skill with document templates, metrics formulas, and tips taxonomy
- `docs/GOALS.md` — 8 primary project goals, non-goals, and success criteria
- `docs/repo_history/2026-05-01-story-of-basecoat.md` — 7-chapter narrative of repo evolution
- `model` field added to all 50 agent YAML frontmatter blocks for VS Code model routing (27 claude-sonnet-4.6, 16 gpt-5.3-codex, 3 claude-haiku-4.5, 2 claude-sonnet-4-5, 1 claude-sonnet-4, 1 default)

### Fixed
- `sync.ps1` / `sync.sh` now copy `skills/` to `.github/skills/` for VS Code auto-discovery (was missing — 33 skills were invisible to VS Code)
- `sync.ps1` / `sync.sh` now sync `docs/` to consumer repos (fixes broken guardrail doc references)
- Removed premature CATALOG/INVENTORY entries referencing uncommitted files

### Changed
- `CATALOG.md` — added 15 agents, 7 skills, 15 instructions
- `INVENTORY.md` — complete rewrite with all 51 agents, 34 skills, 34 instructions
- `README.md` — updated asset counts (50→51 agents, 33→34 skills, 32→34 instructions)
- `PRODUCT.md` — updated 6 stale count references
- `PHILOSOPHY.md` — updated agent count

## 2.0.0 - 2026-04-28

### Added
- `/basecoat` router skill (`skills/basecoat/SKILL.md`) — single entry point with dual-mode UX: discovery (`/basecoat`) and delegation (`/basecoat [discipline] [prompt]`)
- `basecoat-metadata.json` — machine-readable registry of all 28 agents with categories, keywords, aliases, argument hints, and paired skills
- `PRODUCT.md` — project identity document defining audience, principles, and architecture
- `PHILOSOPHY.md` — explains the agents + skills + instructions design and how they compose
- Categorized agent table in `CATALOG.md` with emoji groupings (🔨🏗️🔍🚀📋🧰)
- `argumentHint` field for all 28 agents in metadata registry
- `basecoat-ghcp.zip` release artifact for 1-step GitHub Copilot installation
- Quick Start section in README with manual copy and sync script install methods

### Changed
- `sync.ps1` and `sync.sh` now distribute `basecoat-metadata.json` to consuming repos
- `package-basecoat.yml` workflow produces GHCP ZIP alongside existing artifacts

## 1.0.0 - 2026-04-28

### Added
- 28 agents covering full SDLC: development, architecture, quality, DevOps, process, meta
- 19 skills with templates and knowledge packs
- 19 instruction files for ambient governance
- 3 reusable prompts and 6 guardrails
- CI workflow with frontmatter validation and CATALOG sync checks
- Post-deploy smoke tests
- Enterprise setup guide and token optimization docs
- `CATALOG.md` machine-readable asset registry

### Fixed
- CI `grep` treating `---` as option flag (#94)
- Package workflow uploading directories (#95)
- PRD gate too aggressive for framework repos (#96)
- merge-coordinator.agent.md missing newline after frontmatter (#98)

## 0.7.0 - 2026-04-26

- Added `agents/sprint-planner.agent.md`: goal-to-issues decomposition with wave dependency mapping, agent assignment recommendations, acceptance criteria generation, and sprint board output
- Added `agents/project-onboarding.agent.md`: single-invocation new repo setup — creates repo, syncs Basecoat at pinned version, places sync scripts, configures .gitignore and issue templates, logs Sprint 1 issue, and scaffolds README
- Added `agents/release-manager.agent.md`: automated versioned release workflow — reads merged PRs, bumps version.json (semver), writes CHANGELOG entry, creates git tag, and publishes GitHub release; supports dry-run and PR-or-direct mode
- Added `agents/retro-facilitator.agent.md`: end-of-sprint retrospective — collects sprint artifacts, computes metrics, identifies patterns (Went Well / Improve / Action Items), files generic Basecoat improvement issues, and persists retro doc via PR
- Added `docs/MODEL_OPTIMIZATION.md`: model-per-role recommendations with tier matrix (Premium / Reasoning / Code / Fast), when-to-override guidance, cost considerations, and consumer configuration patterns
- Added `docs/RELEASE_PROCESS.md`: step-by-step release guide covering version artifact sync, semver rules, manual and agent-driven release processes, tag immutability policy, rollback procedure, and CI integration table
- Updated all 15 `agents/*.agent.md` files: added `## Model` section to every agent with recommended model, rationale, and minimum viable model
- Updated `instructions/governance.instructions.md`: Section 10 implemented — model selection guidance, token budget awareness rules, and cost attribution pattern (replaces stub)
- Fixed `README.md`: sync consumption pattern moved to top with Quick Start section, anti-pattern callout, and environment variables table

## 0.6.0 - 2026-03-19

- Added `agents/backend-dev.agent.md`: designs and implements REST/GraphQL APIs, service layers, and data access patterns; files GitHub Issues with `tech-debt,backend` labels for N+1 risk, missing validation, unhandled error paths, hardcoded values, and missing auth
- Added `agents/frontend-dev.agent.md`: builds component-driven UIs with WCAG 2.1 AA accessibility, responsive layouts, and Core Web Vitals targets; files GitHub Issues with `tech-debt,frontend,accessibility` labels for missing ARIA, hardcoded colors, non-semantic markup, missing loading states, and inline styles
- Added `agents/middleware-dev.agent.md`: designs integration layers, message contracts, API gateways, and event-driven architectures with circuit breaker, retry, DLQ, and idempotency patterns; files GitHub Issues with `tech-debt,middleware,reliability` labels
- Added `agents/data-tier.agent.md`: designs schemas, writes reversible migrations, optimizes queries, and establishes data access patterns; files GitHub Issues with `tech-debt,data,performance` labels for N+1 queries, missing indexes, SELECT *, missing rollbacks, and hardcoded IDs
- Added `skills/backend-dev/SKILL.md`: skill overview, invocation guide, and template index
- Added `skills/backend-dev/api-spec-template.md`: OpenAPI 3.x-compatible API spec skeleton with example paths, components, pagination, and error schemas
- Added `skills/backend-dev/service-template.md`: service layer scaffold with dependency injection, structured error types, logging stubs, and testing expectations
- Added `skills/backend-dev/error-catalog-template.md`: structured error catalog with codes, messages, HTTP status codes, and resolution hints
- Added `skills/backend-dev/repository-pattern-template.md`: data access repository pattern boilerplate with parameterized queries, pagination, and soft delete support
- Added `skills/frontend-dev/SKILL.md`: skill overview, invocation guide, and template index
- Added `skills/frontend-dev/component-spec-template.md`: component specification covering props, events, slots, all UI states, accessibility requirements, and test plan
- Added `skills/frontend-dev/accessibility-checklist.md`: WCAG 2.1 AA checklist organized by perceivable, operable, understandable, and robust principles with issue-filing guidance
- Added `skills/frontend-dev/state-management-template.md`: state structure template covering local state, shared state, async lifecycle phases, error state, and derived state
- Added `skills/data-tier/SKILL.md`: skill overview, invocation guide, and template index
- Added `skills/data-tier/schema-design-template.md`: schema design document covering entities, columns, constraints, indexes, relationships, and ERD scaffold
- Added `skills/data-tier/migration-template.md`: migration scaffold with up/down blocks, pre-migration checklist, rollback plan, and zero-downtime strategies
- Added `skills/data-tier/query-review-checklist.md`: query review covering N+1 detection, index usage, pagination, SELECT * checks, and explain plan interpretation
- Added `skills/data-tier/data-dictionary-template.md`: data dictionary template covering table, column, type, nullable, description, and example values
- Added `instructions/development.instructions.md`: shared standards for all four dev core agents covering code style, error handling, security, logging, testing, issue filing, and agent collaboration handoff order

## 0.5.0 - 2026-03-19

- Added `agents/manual-test-strategy.agent.md`: produces decision rubric, exploratory charter, regression checklist, defect template, and automation backlog; files GitHub Issues for all automation candidates
- Added `agents/exploratory-charter.agent.md`: generates time-boxed exploratory sessions with mission, scope, evidence capture, and triage routing; files GitHub Issues for automation-worthy findings
- Added `agents/strategy-to-automation.agent.md`: converts manual paths into tiered automation candidates (smoke, regression, integration, agent spec); files a GitHub Issue for every candidate without exception
- Added `skills/manual-test-strategy/SKILL.md`: skill description, when to use, and agent invocation guide
- Added `skills/manual-test-strategy/rubric-template.md`: decision rubric template for manual-only, automate-now, and hybrid classification with risk scoring matrix
- Added `skills/manual-test-strategy/charter-template.md`: exploratory charter template with mission, time box, scope, evidence log, and triage routing
- Added `skills/manual-test-strategy/checklist-template.md`: regression checklist template with automation candidate flagging
- Added `skills/manual-test-strategy/defect-template.md`: defect evidence template with reproduction steps, impact, diagnostic context, and automation handoff section
- Updated `instructions/testing.instructions.md`: added Manual Test Strategy section referencing all three agents, the skill, the decision rubric, and automation handoff expectations

## 0.4.2 - 2026-03-19

- Fixed Windows PowerShell test runner to clear expected nonzero scanner exit codes
- Stabilized the tag-triggered packaging workflow so release validation can complete on both runners

## 0.4.1 - 2026-03-19

- Fixed commit-message scanner negative tests to scan the actual latest sensitive commit
- Stabilized GitHub Actions validation for packaging and release workflows

## 0.4.0 - 2026-03-19

- Added MCP standards guidance for server allowlisting, tool safety, and governance
- Added repository template standard for lock-based bootstrap and drift enforcement
- Added a sample repository template with bootstrap and enforcement workflows
- Added CI validation for the sample repository template assets
- Fixed PowerShell packaging and hook-install scripts to remove duplicated execution blocks

## 0.3.0 - 2026-03-19

- Added sample Azure, naming, Terraform, and Bicep instruction files
- Added authoring skills for creating new skills and instructions
- Added sample workflow agents for customization creation and repo rollout
- Added enterprise packaging and validation scripts for PowerShell and bash
- Added GitHub Actions workflows for validation and release packaging
- Added example consumer workflows and starter IaC examples for Azure with Bicep and Terraform

## 0.2.0 - 2026-03-19

- Added YAML frontmatter to starter customization files for better discovery and validity
- Expanded instructions with common best-practice sets for security, reliability, and documentation
- Added a refactoring skill and a bugfix prompt
- Updated inventory and README to reflect the broader base set

## 0.1.0 - 2026-03-19

- Initial repository scaffold
- Added sync scripts for PowerShell and bash consumers
- Added starter instructions, prompts, skills, and agent files
- Added inventory and version metadata
