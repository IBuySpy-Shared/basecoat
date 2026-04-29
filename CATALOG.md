# Base Coat — Asset Catalog

> Machine-readable registry of all agents, skills, and instruction files.
> Generated from the `main` branch. Keep this file in sync when adding or removing assets.

---

## Agents

| Name | File | Description | Paired Skills | Model Recommendation |
|---|---|---|---|---|
| | **🔨 Development** | | | |
| backend-dev | `agents/backend-dev.agent.md` | APIs, service layers, business logic, and data access | backend-dev | GPT-4o / Claude Sonnet |
| frontend-dev | `agents/frontend-dev.agent.md` | UI components, responsive layouts, state, accessibility | frontend-dev | GPT-4o / Claude Sonnet |
| middleware-dev | `agents/middleware-dev.agent.md` | API gateways, integration layers, event-driven architectures | — | GPT-4o / Claude Sonnet |
| data-tier | `agents/data-tier.agent.md` | Schema design, migrations, query optimization, data access | data-tier | GPT-4o / Claude Sonnet |
| | **🏗️ Architecture** | | | |
| solution-architect | `agents/solution-architect.agent.md` | System design, C4 diagrams, ADRs, and technology selection | architecture | GPT-4o / Claude Sonnet |
| api-designer | `agents/api-designer.agent.md` | API design for OpenAPI, REST, GraphQL, and governance | api-design | GPT-4o / Claude Sonnet |
| ux-designer | `agents/ux-designer.agent.md` | Journey mapping, wireframes, and accessibility audits | ux | GPT-4o / Claude Sonnet |
| | **🔍 Quality** | | | |
| code-review | `agents/code-review.agent.md` | Structured multi-step code review workflow | code-review | GPT-4o / Claude Sonnet |
| security-analyst | `agents/security-analyst.agent.md` | Vulnerability assessment, threat modeling, secure code review | security | GPT-4o / Claude Sonnet |
| performance-analyst | `agents/performance-analyst.agent.md` | Profiling, load testing, and performance optimization | performance-profiling | GPT-4o / Claude Sonnet |
| config-auditor | `agents/config-auditor.agent.md` | Scans for committed or unprotected config secrets | security | GPT-4o / Claude Sonnet |
| manual-test-strategy | `agents/manual-test-strategy.agent.md` | Manual testing strategy with rubric, charter, checklist, and automation backlog | manual-test-strategy | GPT-4o / Claude Sonnet |
| exploratory-charter | `agents/exploratory-charter.agent.md` | Time-boxed exploratory testing charters with evidence capture | manual-test-strategy | GPT-4o / Claude Sonnet |
| strategy-to-automation | `agents/strategy-to-automation.agent.md` | Converts manual test paths into tiered automation candidates | manual-test-strategy | GPT-4o / Claude Sonnet |
| | **🚀 DevOps** | | | |
| devops-engineer | `agents/devops-engineer.agent.md` | CI/CD, IaC, deployment, rollback, and observability | devops | GPT-4o / Claude Sonnet |
| release-manager | `agents/release-manager.agent.md` | Versioned release workflow, changelog, tagging, and publishing | — | GPT-4o-mini / Claude Haiku |
| rollout-basecoat | `agents/rollout-basecoat.agent.md` | Enterprise Base Coat onboarding and rollout | — | GPT-4o-mini / Claude Haiku |
| | **📋 Process** | | | |
| sprint-planner | `agents/sprint-planner.agent.md` | Sprint goal-to-issues breakdown and wave planning | sprint-management | GPT-4o / Claude Sonnet |
| product-manager | `agents/product-manager.agent.md` | Requirements, user stories, acceptance criteria, roadmaps | sprint-management | GPT-4o / Claude Sonnet |
| issue-triage | `agents/issue-triage.agent.md` | Triage, classify, label, and prioritize GitHub issues | sprint-management | GPT-4o-mini / Claude Haiku |
| retro-facilitator | `agents/retro-facilitator.agent.md` | Sprint retrospective summary and improvement issue creation | sprint-management | GPT-4o / Claude Sonnet |
| project-onboarding | `agents/project-onboarding.agent.md` | Base Coat repository onboarding and setup | — | GPT-4o-mini / Claude Haiku |
| | **🧰 Meta** | | | |
| agent-designer | `agents/agent-designer.agent.md` | Designs and authors Copilot agent definitions | agent-design | GPT-4o / Claude Sonnet |
| prompt-engineer | `agents/prompt-engineer.agent.md` | Prompt and system-prompt optimization | — | GPT-4o / Claude Sonnet |
| mcp-developer | `agents/mcp-developer.agent.md` | MCP servers, tools, and integrations | mcp-development | GPT-4o / Claude Sonnet |
| tech-writer | `agents/tech-writer.agent.md` | Technical docs, runbooks, tutorials, and changelogs | documentation | GPT-4o / Claude Sonnet |
| new-customization | `agents/new-customization.agent.md` | Creates or updates Base Coat customization assets | create-skill, create-instruction | GPT-4o / Claude Sonnet |
| merge-coordinator | `agents/merge-coordinator.agent.md` | Parallel branch merge coordination | — | GPT-4o-mini / Claude Haiku |

---

## Skills

| Name | Directory | Templates Included | Paired Agents |
|---|---|---|---|
| **basecoat** | `skills/basecoat/` | *(router — discovery + delegation)* | **all agents** |
| agent-design | `skills/agent-design/` | `agent-template.md`, `instruction-template.md`, `skill-template.md` | agent-designer |
| api-design | `skills/api-design/` | `openapi-template.md`, `api-governance-checklist.md`, `breaking-change-checklist.md`, `versioning-decision-tree.md` | api-designer |
| architecture | `skills/architecture/` | `adr-template.md`, `c4-diagram-template.md`, `risk-register-template.md`, `tech-selection-matrix-template.md` | solution-architect |
| backend-dev | `skills/backend-dev/` | `api-spec-template.md`, `error-catalog-template.md`, `repository-pattern-template.md`, `service-template.md` | backend-dev |
| code-review | `skills/code-review/` | *(workflow only)* | code-review |
| create-instruction | `skills/create-instruction/` | *(workflow only)* | new-customization |
| create-skill | `skills/create-skill/` | *(workflow only)* | new-customization |
| data-tier | `skills/data-tier/` | `schema-design-template.md`, `migration-template.md`, `query-review-checklist.md`, `data-dictionary-template.md` | data-tier |
| devops | `skills/devops/` | `deployment-checklist.md`, `environment-promotion-template.md`, `github-actions-template.md`, `rollback-runbook-template.md` | devops-engineer |
| documentation | `skills/documentation/` | `readme-template.md`, `runbook-template.md`, `adr-template.md` | tech-writer |
| frontend-dev | `skills/frontend-dev/` | `component-spec-template.md`, `accessibility-checklist.md`, `state-management-template.md` | frontend-dev |
| manual-test-strategy | `skills/manual-test-strategy/` | `charter-template.md`, `checklist-template.md`, `defect-template.md`, `rubric-template.md` | manual-test-strategy, exploratory-charter, strategy-to-automation |
| mcp-development | `skills/mcp-development/` | `mcp-server-template.md`, `tool-definition-template.md`, `transport-config-template.md` | mcp-developer |
| performance-profiling | `skills/performance-profiling/` | *(workflow only)* | performance-analyst |
| refactoring | `skills/refactoring/` | *(workflow only)* | — |
| security | `skills/security/` | `owasp-checklist.md`, `stride-threat-model-template.md`, `vulnerability-report-template.md`, `dependency-audit-template.md` | security-analyst, config-auditor |
| sprint-management | `skills/sprint-management/` | `sprint-planning-template.md`, `backlog-grooming-template.md`, `retrospective-template.md` | sprint-planner, retro-facilitator, product-manager, issue-triage |
| ux | `skills/ux/` | `user-journey-template.md`, `wireframe-spec-template.md`, `component-spec-template.md`, `accessibility-audit-checklist.md` | ux-designer |

---

## Instruction Files

| Name | File | Scope |
|---|---|---|
| agents | `instructions/agents.instructions.md` | Agent authoring standards |
| architecture | `instructions/architecture.instructions.md` | Architecture, API, and design-diagram guidance |
| azure | `instructions/azure.instructions.md` | Azure service, SDK, and deployment guidance |
| backend | `instructions/backend.instructions.md` | Backend APIs, services, workers, and data access |
| bicep | `instructions/bicep.instructions.md` | Azure Bicep authoring and validation |
| config | `instructions/config.instructions.md` | Config file safety and secrets prevention |
| development | `instructions/development.instructions.md` | Shared dev standards for all dev-core agents |
| documentation | `instructions/documentation.instructions.md` | Documentation and change-note expectations |
| frontend | `instructions/frontend.instructions.md` | Frontend, UI, state management, and accessibility |
| governance | `instructions/governance.instructions.md` | Repository-wide AI governance rules |
| mcp | `instructions/mcp.instructions.md` | MCP server, tooling, and trust-boundary guidance |
| naming | `instructions/naming.instructions.md` | Naming conventions across repos, code, and infrastructure |
| process | `instructions/process.instructions.md` | Delivery lifecycle, sprint, triage, and release process |
| quality | `instructions/quality.instructions.md` | PR review, security, performance, and coverage gates |
| reliability | `instructions/reliability.instructions.md` | Retries, uptime, background work, and dependency failure |
| security | `instructions/security.instructions.md` | Secure coding, auth, authz, secrets, and input handling |
| terraform | `instructions/terraform.instructions.md` | Terraform guidance for Azure-oriented IaC |
| testing | `instructions/testing.instructions.md` | Testing best practices and validation expectations |
| ux | `instructions/ux.instructions.md` | UX, accessibility, and design-system guidance |

---

## Prompts

| Name | File | Description |
|---|---|---|
| architect | `prompts/architect.prompt.md` | Architecture planning and implementation starter |
| bugfix | `prompts/bugfix.prompt.md` | Root-cause analysis and minimal safe fix workflow |
| code-review | `prompts/code-review.prompt.md` | Risk-focused code review workflow |

---

## Guardrails

| Name | File | Purpose |
|---|---|---|
| caf-naming | `docs/guardrails/caf-naming.md` | CAF naming conventions for Azure resources |
| container-image-tags | `docs/guardrails/container-image-tags.md` | Container image tags must include Git SHA |
| db-deployment-concurrency | `docs/guardrails/db-deployment-concurrency.md` | Database deployment concurrency rules |
| env-example | `docs/guardrails/env-example.md` | `.env.example` required for every repo |
| oidc-federation | `docs/guardrails/oidc-federation.md` | GitHub Actions to Azure OIDC federation |
| secrets-in-workflows | `docs/guardrails/secrets-in-workflows.md` | No hardcoded secrets in workflow files |
