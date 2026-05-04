# Changelog

All notable changes to this repository should be recorded in this file.

## Unreleased

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
