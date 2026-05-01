# The Story of Base Coat

**Generated:** 2026-05-01
**Scope:** Repository inception through v2.0.0+, covering 168 closed issues, 143 PRs, and the evolution from a simple scaffold to a full-SDLC agent framework.

---

## Chapter 1: The Scaffold (v0.1.0 — March 19, 2026)

Base Coat began as a modest idea: what if teams could share GitHub Copilot
customizations the way they share linting configs or CI templates?

The initial commit created the repository scaffold with:

- Sync scripts for PowerShell and Bash consumers
- Starter instructions, prompts, skills, and agent files
- An inventory file and version metadata

At this point, Base Coat was a **template** — a starting point for teams to copy
and customize. The core insight was already present: separate *instructions*
(ambient rules) from *agents* (workflows) from *skills* (knowledge packs).

---

## Chapter 2: Building the Foundation (v0.2.0–v0.4.2 — March 19, 2026)

In rapid succession, the foundation layers were added:

**v0.2.0** — YAML frontmatter for all assets, expanded instruction sets for security,
reliability, and documentation. The refactoring skill and bugfix prompt arrived.

**v0.3.0** — Enterprise packaging took shape: sample Azure, naming, Terraform, and
Bicep instructions; authoring skills for creating new skills and instructions;
GitHub Actions workflows for validation and release packaging; example consumer
workflows and starter IaC.

**v0.4.0** — MCP standards guidance, repository template standard with lock-based
bootstrap and drift enforcement, and CI validation for template assets.

**v0.4.1–v0.4.2** — Stabilization: fixing commit-message scanner tests and the
tag-triggered packaging workflow.

By the end of this phase, Base Coat had its distribution pipeline, its validation
infrastructure, and its governance model. But it only had a handful of agents.

---

## Chapter 3: The Agent Explosion (v0.5.0–v0.7.0 — March–April 2026)

### Sprint 1: Testing Agents (v0.5.0)

Three testing agents landed together: `manual-test-strategy`, `exploratory-charter`,
and `strategy-to-automation`. Each had a clear role in a pipeline — define manual
scope, run exploratory sessions, then convert findings to automation candidates.
The `manual-test-strategy` skill provided rubric, charter, checklist, and defect
templates.

### Sprint 2: The Dev Core Four (v0.6.0)

Issues #1–#8 defined the backbone: four development agents (`backend-dev`,
`frontend-dev`, `middleware-dev`, `data-tier`) with paired skills and a shared
`development.instructions.md`. Each agent was framework-agnostic, filed tech-debt
issues automatically, and followed structured templates for API specs, service
layers, component specs, schema designs, and migration scripts.

This sprint established the pattern that every subsequent agent would follow:
**agent + paired skill + ambient instruction**.

### Sprint 3: Architecture, Quality, and Process (v0.7.0)

The next wave expanded across disciplines:

- **Architecture agents** (#9–#16): `solution-architect`, `api-designer`,
  `ux-designer` with skills for ADRs, C4 diagrams, OpenAPI specs, and
  wireframes
- **Quality agents** (#17–#23): `code-review`, `security-analyst`,
  `performance-analyst` with OWASP checklists and STRIDE templates
- **DevOps and Meta agents** (#20, #24–#30): `devops-engineer`,
  `mcp-developer`, `agent-designer`, `prompt-engineer`
- **Process agents** (#31–#37): `product-manager`, `sprint-planner`,
  `tech-writer`, `issue-triage`

Model recommendations were added to every agent with a `## Model` section.
The governance instruction gained model selection guidance and token budget
awareness rules.

Sprint management agents like `sprint-planner`, `release-manager`,
`retro-facilitator`, and `project-onboarding` (#46–#50) closed the loop:
Base Coat could now plan its own sprints, cut its own releases, and onboard
new repos using its own agents.

---

## Chapter 4: The Router and v2.0.0 (April 28, 2026)

The v2.0.0 release marked Base Coat's transition from a collection of assets
to a **framework with a single entry point**.

Key additions:

- `/basecoat` router skill with dual-mode UX (discovery + delegation)
- `basecoat-metadata.json` — machine-readable registry of all agents
  with categories, keywords, aliases, and paired skills
- `PRODUCT.md` — project identity document
- `PHILOSOPHY.md` — why three primitives, how they compose
- `basecoat-ghcp.zip` release artifact for 1-step GitHub Copilot installation

PR #103 (`feat: /basecoat router skill + metadata registry`) was the keystone.
With the router, users no longer needed to memorize 28 agent names — they just
said `/basecoat backend` or `/basecoat security` and the router figured out the rest.

---

## Chapter 5: The Big Expansion (April 30, 2026)

The day after v2.0.0, a massive expansion sprint landed 40+ PRs in a single day.
This was Base Coat's most ambitious sprint, driven by parallel agent dispatch.

### Wave 1: New Instructions and Behavioral Patterns

PRs #149–#164 added 16 new instruction files and skills:

- `verification-driven-development` — test-first workflow enforcement
- `token-economics` — cost-aware model selection
- `session-hygiene` — clean context management
- `plan-first-workflow` — think before coding
- `agent-behavior` — anti-loop detection
- `parallel-agent-execution` — fleet-mode patterns
- `structured-handoff` — agent-to-agent protocols
- `human-in-the-loop` — approval gates
- `tool-minimization` — reduce tool call overhead
- `scoped-instructions` — targeted rule application
- `SQLite-persistent-memory` — cross-session knowledge
- `local-embeddings` — semantic code search
- `prompt-registry` — versioned prompt management

### Wave 2: Advanced Agents

PRs #165–#182 introduced a new generation of specialized agents:

- **Observability:** `sre-engineer`, `incident-responder`
- **Ops:** `agentops`, `dataops`, `mlops`, `llmops`
- **Security:** `guardrail`, `policy-as-code-compliance`, `chaos-engineer`
- **Knowledge:** `memory-curator`, `prompt-coach`
- **Architecture:** `ai-architecture-patterns`

### Wave 3: Enterprise Infrastructure

PRs #184–#196 built out enterprise tooling:

- `.github/copilot-instructions.md` for repo-level Copilot configuration
- Agent testing harness documentation
- Distribution and packaging guide
- Enterprise runner availability guide
- Telemetry and adoption tracking guide
- Adoption dashboard with bootstrap setup
- Degradation detection and alert filing

### Wave 4: Azure and Migration

PRs #209–#243 expanded cloud and modernization coverage:

- `infrastructure-deploy` agent
- `containerization-planner` agent
- `legacy-modernization` agent
- `app-inventory` agent with complexity scoring
- Azure skills: Container Apps, Landing Zone (ESLZ), WAF Review,
  Networking (hub-spoke), Policy & Governance, Identity & Entra ID
- Treatment matrix for migration decisions (Retire/Rehost/Replatform/Refactor/Rebuild/Replace)

### Wave 5: Runtime and Governance

PRs #244–#246 added structural governance:

- Agent taxonomy (organized by model, task, and type)
- Role-based skill scoping
- Runtime enforcement for agent tools, skill allow-lists, and model binding

---

## Chapter 6: Hygiene Sprint (April 30, 2026)

One of the most impressive demonstrations of Base Coat's own capabilities:
a single Copilot CLI session resolved 11 issues in 90 minutes using
fleet-mode parallel agents.

**The session:**

1. Listed 4 open hygiene issues
2. Dispatched 3 parallel sub-agents (sync bug #249, README fixes #251–#252)
3. Dispatched a dependent task (sync tests #250) after the fix landed
4. Ran a proactive code quality audit — discovered 7 more issues
5. Filed issues #260–#266, dispatched 4 more parallel agents
6. Merged 6 PRs, closed 2 as duplicates (scope overlap)
7. Resolved 2 triage-bot-filed issues (#271–#272)

**Zero human intervention** after the initial "start" command.

This session proved that Base Coat could maintain itself using its own
agents and patterns — the framework eating its own dogfood.

(Full write-up: [2026-04-30-sprint-hygiene.md](2026-04-30-sprint-hygiene.md))

---

## Chapter 7: Refinement and Open Frontiers (May 2026)

The latest PRs focus on refinement and closing gaps:

- **Copilot usage analytics skill** (PR #312) — per-session cost breakdown
- **Runner routing guardrail** (PR #313) — self-hosted vs GitHub-hosted decisions
- **Deployment cancellation pre-flight** (PR #314) — safety checks before deploy
- **Improved copilot-instructions** (PR #315) — session learnings baked in
- **Basecoat metrics MCP server** (PR #316) — programmatic access to adoption data

### Open Issues

Five issues remain open, pointing to Base Coat's next frontiers:

| Issue | Theme |
|---|---|
| #275 | Python / Data Science / Notebook instruction coverage |
| #276 | Sync scripts don't deliver `docs/` to consumer repos |
| #277 | Sprint-retrospective agent for on-demand repo history |
| #282 | Enterprise Copilot usage metrics policy enablement |
| #283 | Track GitHub API for per-model premium billing data |

---

## By the Numbers

| Metric | Value |
|---|---|
| Total issues filed | 173+ |
| Issues closed | 168 |
| Pull requests merged | 120+ |
| Agents | 49 |
| Skills | 31 |
| Instruction files | 32 |
| Prompts | 3 |
| Guardrails | 6+ |
| Releases | 3 major (v0.x, v1.0.0, v2.0.0) |
| Time from scaffold to v2.0.0 | ~5 weeks |
| Contributors | Human + AI agents (Copilot coding agent, Copilot CLI) |

---

## Themes and Patterns

### 1. Agents Build Agents

Base Coat is self-referential: `agent-designer` designs new agents,
`new-customization` creates skills and instructions, `sprint-planner` plans
the sprints that build Base Coat, and `release-manager` cuts the releases.

### 2. Parallel-First Development

The hygiene sprint proved that fleet-mode parallel agent dispatch — with
dependency-aware ordering and file-scope batching — can resolve 11 issues
in 90 minutes with zero human intervention.

### 3. Governance as Code

Instructions are the secret weapon. They are ambient (always active), composable
(layer multiple), and updatable (change one file, affect all agents). The
three-primitive architecture keeps governance separate from workflow.

### 4. Enterprise from Day One

Version pinning, SHA256 checksums, CI validation, secret scanning, Dependabot,
adoption metrics, and runner routing were not afterthoughts — they were built
into the distribution pipeline from v0.3.0 onward.

### 5. Azure-Native Cloud Patterns

A significant portion of the skill library targets Azure: Container Apps,
Landing Zones, WAF Review, Networking, Policy, Identity, and Bicep/Terraform
IaC patterns. This reflects the target audience (Microsoft enterprise teams)
while keeping the core framework cloud-agnostic.

---

## What's Next

Based on open issues and trajectory:

- **Python and Data Science coverage** — closing the gap for ML/notebook workflows
- **Sync script improvements** — delivering docs to consumers, not just agents
- **Sprint-retrospective agent** — automated repo history documentation (like this file)
- **Copilot metrics integration** — once enterprise policy and API access are enabled
- **Per-model cost optimization** — tracking and routing based on billing data
