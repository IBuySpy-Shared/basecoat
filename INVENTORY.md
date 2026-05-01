# Inventory

This catalog helps teams discover what exists in Base Coat and when to use it.

## Instructions

| File                                         | Use For                                               | Keywords                                                           |
| -------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| `instructions/agent-behavior.instructions.md` | anti-loop detection and agent behavioral guardrails | agent, behavior, loop, guardrail, anti-pattern |
| `instructions/agents.instructions.md`        | agent authoring standards | agents, authoring, frontmatter, design |
| `instructions/architecture.instructions.md`  | architecture, API, and design-diagram guidance | architecture, api, design, diagram, adr |
| `instructions/azure.instructions.md`         | Azure application and service guidance                | azure, managed identity, key vault, app service                    |
| `instructions/backend.instructions.md`       | API, services, data access, backend guardrails        | backend, api, refactor, service, reliability                       |
| `instructions/bicep.instructions.md`         | Bicep authoring, parameters, and deployment hygiene   | bicep, bicepparam, module, symbolic name                           |
| `instructions/config.instructions.md`        | config file safety and secrets prevention | config, secrets, safety, environment |
| `instructions/development.instructions.md`   | shared standards for backend-dev, frontend-dev, middleware-dev, data-tier agents | development, code style, error handling, security, logging, testing, collaboration |
| `instructions/documentation.instructions.md` | docs updates and operational notes                    | docs, readme, changelog, migration, usage                          |
| `instructions/drift-monitor.instructions.md` | detect and prevent configuration drift across environments | drift, monitor, config, environment, consistency |
| `instructions/error-kb.instructions.md`      | error knowledge base and resolution pattern guidance | error, knowledge-base, resolution, troubleshooting |
| `instructions/frontend.instructions.md`      | UI, accessibility, responsiveness, frontend changes   | frontend, ui, css, accessibility, react                            |
| `instructions/governance.instructions.md`    | repository-wide AI governance rules | governance, rules, compliance, standards |
| `instructions/mcp.instructions.md`           | MCP server/tool governance and safe integration rules | mcp, tools, server, governance, allowlist                          |
| `instructions/model-routing.instructions.md` | cost-aware model selection and fleet dispatch | model, routing, cost, fleet, dispatch, tier |
| `instructions/naming.instructions.md`        | consistent naming across code and infrastructure      | naming, convention, style, files, resources                        |
| `instructions/nextjs-react19.instructions.md` | Next.js and React 19 patterns and conventions | nextjs, react, react19, ssr, server-components |
| `instructions/npm-workspaces.instructions.md` | npm workspaces and monorepo conventions | npm, workspaces, monorepo, packages |
| `instructions/output-style.instructions.md`  | agent output formatting and style guidance | output, style, formatting, markdown |
| `instructions/plan-first.instructions.md`    | plan-first workflow for agents — think before coding | plan, workflow, think, design, before-coding |
| `instructions/process.instructions.md`       | delivery lifecycle, sprint, triage, and release process | process, sprint, triage, release, delivery |
| `instructions/quality.instructions.md`       | PR review, security, performance, and coverage gates | quality, review, security, performance, coverage |
| `instructions/reliability.instructions.md`   | resilience, failure modes, observability              | reliability, retry, timeout, logging, resilience                   |
| `instructions/security.instructions.md`      | secure coding, auth boundaries, secret handling       | security, auth, secrets, validation, unsafe                        |
| `instructions/session-hygiene.instructions.md` | clean session context management for agents | session, hygiene, context, cleanup, state |
| `instructions/tailwind-v4.instructions.md`   | Tailwind CSS v4 patterns and migration | tailwind, css, v4, utility, design-system |
| `instructions/terraform.instructions.md`     | Terraform authoring for Azure and shared IaC          | terraform, azurerm, modules, providers, state                      |
| `instructions/testing.instructions.md`       | test expectations with positive and negative coverage | tests, unit test, integration test, regression, positive, negative |
| `instructions/token-economics.instructions.md` | token budget awareness and cost-conscious model usage | token, economics, budget, cost, model, optimization |
| `instructions/tool-minimization.instructions.md` | reduce unnecessary tool calls for efficiency | tool, minimization, efficiency, calls, overhead |
| `instructions/ux.instructions.md`            | UX, accessibility, and design-system guidance | ux, accessibility, design, wcag |
| `instructions/verification.instructions.md`  | verification-driven development — test-first workflow | verification, tdd, test-first, validation |

## Skills

| File                                    | Use For                                                 | Keywords                                     |
| --------------------------------------- | ------------------------------------------------------- | -------------------------------------------- |
| `skills/agent-design/SKILL.md`          | agent, instruction, and skill authoring templates | agent, design, authoring, template |
| `skills/api-design/SKILL.md`            | OpenAPI spec, API governance, and versioning templates | api, openapi, governance, versioning |
| `skills/app-inventory/SKILL.md`         | legacy app inventory reports and complexity scoring | inventory, legacy, scanning, complexity |
| `skills/architecture/SKILL.md`          | ADR, C4 diagram, and tech selection templates | architecture, adr, c4, diagram, tech-selection |
| `skills/azure-container-apps/SKILL.md`  | deploy, scale, and manage containers on Azure Container Apps with managed identity, health probes, and traffic splitting | azure, container apps, aca, ingress, scale, revision, health probes, managed identity |
| `skills/azure-identity/SKILL.md`        | design RBAC hierarchies, managed identities, app registrations, conditional access, and workload identity federation | azure, identity, rbac, managed identity, entra, zero trust, oidc |
| `skills/azure-landing-zone/SKILL.md`    | enterprise-scale landing zone scaffolding with Bicep templates | azure, landing-zone, eslz, caf, bicep |
| `skills/azure-networking/SKILL.md`      | design Azure hub-spoke topologies, private endpoints, DNS zones, NSG rules, and firewall policies | azure, networking, hub-spoke, vnet, private endpoint, dns, nsg, firewall, cidr, udr |
| `skills/azure-policy/SKILL.md`          | author custom Azure Policy definitions, initiatives, remediation tasks, and compliance KQL queries | azure policy, governance, compliance, initiative, remediation, KQL, CIS, NIST, ISO 27001 |
| `skills/azure-waf-review/SKILL.md`      | assess Azure workloads against the five WAF pillars and produce scored findings with remediation templates | azure, well-architected, WAF, reliability, security, cost, performance, operations |
| `skills/backend-dev/SKILL.md`           | design and implement APIs, service layers, and data access repositories | backend, api, service, repository, error catalog                     |
| `skills/basecoat/SKILL.md`              | /basecoat router — discovery and delegation entry point | basecoat, router, discovery, delegation |
| `skills/code-review/SKILL.md`           | review changes for risk, regressions, and missing tests | review, bug risk, regression, findings       |
| `skills/create-instruction/SKILL.md`    | create a new instruction file for a domain              | create instruction, applyTo, frontmatter     |
| `skills/create-skill/SKILL.md`          | create a new reusable skill with proper frontmatter     | create skill, skill template, customization  |
| `skills/data-tier/SKILL.md`             | design schemas, write migrations, review queries, build data dictionaries | data, schema, migration, query, indexing                            |
| `skills/devops/SKILL.md`                | CI/CD pipeline, deployment, and rollback templates | devops, cicd, deployment, rollback, github-actions |
| `skills/documentation/SKILL.md`         | README, runbook, and ADR templates | documentation, readme, runbook, adr |
| `skills/environment-bootstrap/SKILL.md` | environment setup and bootstrap configuration | environment, bootstrap, setup, configuration |
| `skills/frontend-dev/SKILL.md`          | build accessible, responsive UI components and manage client state       | frontend, ui, component, accessibility, state management             |
| `skills/handoff/SKILL.md`               | structured agent-to-agent handoff protocols | handoff, agent, protocol, transition |
| `skills/human-in-the-loop/SKILL.md`     | human approval gates and intervention patterns | human, approval, gate, intervention, review |
| `skills/identity-migration/SKILL.md`    | identity and authentication migration patterns | identity, migration, auth, entra, modernization |
| `skills/manual-test-strategy/SKILL.md`  | define manual scope, produce charters, checklists, and handoff artifacts | manual testing, exploratory, charter, regression, defect, automation handoff |
| `skills/mcp-development/SKILL.md`       | MCP server, tool definition, and transport templates | mcp, server, tool, transport, integration |
| `skills/performance-profiling/SKILL.md` | isolate and measure slow code paths                     | profiling, performance, latency, hot path    |
| `skills/refactoring/SKILL.md`           | restructure code without changing behavior              | refactor, cleanup, simplify, extract, rename |
| `skills/security/SKILL.md`              | OWASP checklist, STRIDE threat model, and vulnerability templates | security, owasp, stride, threat-model, vulnerability |
| `skills/service-bus-migration/SKILL.md` | Azure Service Bus migration patterns and guidance | service-bus, migration, messaging, azure |
| `skills/sprint-management/SKILL.md`     | sprint planning, backlog grooming, and retrospective templates | sprint, planning, backlog, retrospective |
| `skills/sprint-retrospective/SKILL.md`  | repo history reconstruction and sprint retrospective templates | sprint, retrospective, history, metrics, tips |
| `skills/ux/SKILL.md`                    | user journey, wireframe, and accessibility audit templates | ux, journey, wireframe, accessibility, audit |

## Prompts

| File                            | Use For                                              | Keywords                              |
| ------------------------------- | ---------------------------------------------------- | ------------------------------------- |
| `prompts/architect.prompt.md`   | break down a system or feature before implementation | architecture, design, tradeoffs, plan |
| `prompts/code-review.prompt.md` | initiate a focused code review workflow              | review, pull request, findings        |
| `prompts/bugfix.prompt.md`      | investigate and fix a bug at the root cause          | bugfix, incident, regression, failure |

## Agents

| File                                | Use For                                        | Keywords                                  |
| ----------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| `agents/agent-designer.agent.md`        | design and author Copilot agent definitions | agent, design, authoring, copilot |
| `agents/agentops.agent.md`          | manage agent lifecycle, versioning, rollout health, rollback, and retirement | agent, operations, versioning, canary, blue-green, rollback, telemetry |
| `agents/api-designer.agent.md`      | API design for OpenAPI, REST, GraphQL, and governance | agent, api, openapi, rest, graphql, versioning |
| `agents/app-inventory.agent.md` | scan legacy apps for project files, NuGet/npm/maven packages, connection strings, external services, framework versions, and migration complexity scores | agent, inventory, legacy, migration, dependencies, csproj, packages, scanning |
| `agents/azure-landing-zone.agent.md` | scaffold enterprise-scale Azure landing zones following CAF/ESLZ | agent, azure, landing-zone, eslz, caf, bicep, terraform, management-groups, hub-networking, policy |
| `agents/backend-dev.agent.md`           | design and implement APIs, service layers, and data access patterns    | agent, backend, api, service, rest, graphql, repository, error handling |
| `agents/chaos-engineer.agent.md`    | fault injection, game days, resilience scoring, and recovery validation | agent, chaos, resilience, fault-injection, game-day |
| `agents/code-review.agent.md`       | multi-step repository review process           | agent, review, repo scan, risk            |
| `agents/config-auditor.agent.md`    | scan for committed or unprotected config secrets | agent, config, secrets, audit, security |
| `agents/containerization-planner.agent.md` | containerization readiness assessment and deployment configuration | agent, container, docker, kubernetes, migration |
| `agents/data-tier.agent.md`             | design schemas, write migrations, optimize queries, and define data access | agent, data, schema, migration, query, indexing, repository         |
| `agents/dataops.agent.md`           | data quality, lineage, governance, orchestration, and drift detection | agent, data, quality, lineage, governance, pipeline |
| `agents/dependency-lifecycle.agent.md` | dependency updates, breaking changes, upgrade paths, and migration guides | agent, dependency, update, upgrade, breaking-change |
| `agents/devops-engineer.agent.md`   | CI/CD, IaC, deployment, rollback, and observability | agent, devops, cicd, iac, deployment, observability |
| `agents/exploratory-charter.agent.md`   | generate time-boxed exploratory sessions with scope, evidence capture, and GitHub Issue filing              | agent, exploratory, charter, session, findings |
| `agents/feedback-loop.agent.md`     | user feedback collection, prompt effectiveness tracking, and A/B testing | agent, feedback, effectiveness, tracking, a-b-testing |
| `agents/frontend-dev.agent.md`          | build accessible component-driven UIs with Core Web Vitals targets     | agent, frontend, ui, component, accessibility, wcag, state, performance |
| `agents/guardrail.agent.md`         | validate outputs against safety, quality, compliance, and formatting rules before delivery | agent, guardrail, validation, safety, compliance, quality |
| `agents/identity-architect.agent.md` | Azure RBAC, managed identities, Entra ID app registrations, conditional access, and workload identity federation | agent, identity, rbac, entra, managed-identity, zero-trust |
| `agents/incident-responder.agent.md` | incident classification, mitigation, communications, and post-incident learning | agent, incident, response, mitigation, postmortem |
| `agents/infrastructure-deploy.agent.md` | Azure infrastructure deployments using Bicep with rollback strategies | agent, infrastructure, deploy, bicep, azure |
| `agents/issue-triage.agent.md`      | triage, classify, label, and prioritize GitHub issues | agent, triage, issues, labels, prioritization |
| `agents/legacy-modernization.agent.md` | guide Web Forms to Razor Pages migration using the strangler fig pattern for incremental modernization | agent, legacy, modernization, web forms, razor pages, strangler fig, migration |
| `agents/llmops.agent.md`            | prompt deployment pipelines, model gateway configuration, and inference monitoring | agent, llm, inference, gateway, prompt-deployment |
| `agents/manual-test-strategy.agent.md`  | produce a full manual test strategy with rubric, charter, checklist, defect template, and automation backlog | agent, manual testing, strategy, exploratory, automation candidate |
| `agents/mcp-developer.agent.md`     | MCP servers, tools, and integrations | agent, mcp, tools, server, integration |
| `agents/memory-curator.agent.md`    | cross-session knowledge extraction, deduplication, and retrieval | agent, memory, knowledge, cross-session, curation |
| `agents/merge-coordinator.agent.md` | merge multiple feature branches into a target without interactive git editor hangs | agent, merge, conflict, parallel, branches, rebase, no-edit |
| `agents/middleware-dev.agent.md`        | design integration layers, message contracts, and resilience patterns   | agent, middleware, integration, message, event-driven, circuit breaker, retry |
| `agents/mlops.agent.md`             | model lifecycle, experiment tracking, deployment automation, and drift monitoring | agent, mlops, model, experiment, deployment, drift |
| `agents/new-customization.agent.md` | choose and create the right customization type | agent, customization, instruction, prompt |
| `agents/performance-analyst.agent.md` | profiling, load testing, and performance optimization | agent, performance, profiling, load-test, optimization |
| `agents/policy-as-code-compliance.agent.md` | validate policy-as-code rules, automated compliance checks, exceptions, and audit-ready evidence | agent, compliance, policy-as-code, governance, audit, exceptions |
| `agents/product-manager.agent.md`   | requirements, user stories, acceptance criteria, roadmaps | agent, product, requirements, stories, roadmap |
| `agents/project-onboarding.agent.md` | Base Coat repository onboarding and setup | agent, onboarding, bootstrap, setup |
| `agents/prompt-coach.agent.md` | iteratively score, critique, and improve prompts through coaching and revision comparison | agent, prompt, coaching, scoring, critique, token efficiency, iteration |
| `agents/prompt-engineer.agent.md`   | prompt and system-prompt optimization | agent, prompt, optimization, system-prompt |
| `agents/release-impact-advisor.agent.md` | release readiness assessment, blast radius analysis, and rollback planning | agent, release, impact, readiness, rollback |
| `agents/release-manager.agent.md`   | versioned release workflow, changelog, tagging, and publishing | agent, release, version, changelog, tag |
| `agents/retro-facilitator.agent.md` | sprint retrospective summary and improvement issue creation | agent, retro, sprint, retrospective, improvement |
| `agents/rollout-basecoat.agent.md`  | onboard a repo to a pinned Base Coat release   | agent, rollout, bootstrap, enterprise     |
| `agents/security-analyst.agent.md`  | vulnerability assessment, threat modeling, secure code review | agent, security, vulnerability, threat-model |
| `agents/self-healing-ci.agent.md`   | CI failure analysis, log parsing, flaky test detection, and pipeline remediation | agent, ci, failure, flaky-test, remediation |
| `agents/solution-architect.agent.md` | system design, C4 diagrams, ADRs, and technology selection | agent, architecture, c4, adr, design |
| `agents/sprint-planner.agent.md`    | sprint goal-to-issues breakdown and wave planning | agent, sprint, planning, issues, waves |
| `agents/sprint-retrospective.agent.md` | reconstruct repo history for sprint retrospectives with metrics and tips | agent, sprint, retrospective, history, metrics |
| `agents/sre-engineer.agent.md`      | SLOs, error budgets, incident response, chaos engineering, and toil reduction | agent, sre, slo, error-budget, toil |
| `agents/strategy-to-automation.agent.md`| convert manual paths into tiered automation candidates and file GitHub Issues for every one                | agent, automation, smoke, regression, integration, candidate |
| `agents/tech-writer.agent.md`       | technical docs, runbooks, tutorials, and changelogs | agent, docs, runbook, tutorial, changelog |
| `agents/ux-designer.agent.md`       | journey mapping, wireframes, and accessibility audits | agent, ux, journey, wireframe, accessibility |

## Documentation Assets

| File                                      | Use For                                                         | Keywords                                 |
| ----------------------------------------- | --------------------------------------------------------------- | ---------------------------------------- |
| `docs/documentation-heading-scaffolds.md` | shared heading templates for common documentation types         | docs, headings, template, scaffold       |
| `docs/prd-and-spec-guidance.md`           | guidance and templates for PRDs and technical specs             | prd, spec, requirements, design          |
| `docs/repo-template-standard.md`          | standard for bootstrapping and enforcing Base Coat in templates | template, governance, drift, enforcement |
| `docs/MULTI_AGENT_WORKFLOWS.md`           | structure parallel agent sprints to minimize merge conflicts; branch naming; merge order; fresh clone principle | multi-agent, parallel, sprint, merge, conflict, branch |
| `docs/app-inventory.md`                   | conceptual guide for legacy app scanning: parameters, complexity scoring, output formats, and downstream integration | inventory, legacy, scanning, dependencies, complexity, migration |
| `docs/treatment-matrix.md`                | decision framework mapping complexity scores and strategic value to Retire/Rehost/Replatform/Refactor/Rebuild/Replace treatment paths | treatment, migration, retire, rehost, replatform, refactor, rebuild, replace |

## Operational Assets

| File                                                                       | Use For                                                     | Keywords                               |
| -------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------- |
| `scripts/validate-basecoat.sh`                                             | local and CI validation on macOS and Linux                  | validate, bash, ci, frontmatter        |
| `scripts/validate-basecoat.ps1`                                            | local and CI validation on Windows                          | validate, powershell, ci, frontmatter  |
| `scripts/install-git-hooks.sh`                                             | configure local git hooks for guardrail enforcement         | hooks, git, security, pre-commit       |
| `scripts/install-git-hooks.ps1`                                            | configure local git hooks for guardrail enforcement         | hooks, git, security, pre-commit       |
| `scripts/scan-commit-messages.sh`                                          | scan commit messages for secrets and PII patterns           | commit-msg, security, secrets, pii     |
| `.githooks/commit-msg`                                                     | block commits when message contains sensitive data          | hook, commit-msg, security, pii        |
| `scripts/package-basecoat.sh`                                              | create release artifacts on macOS and Linux                 | package, tar.gz, zip, checksum         |
| `scripts/package-basecoat.ps1`                                             | create release artifacts on Windows                         | package, zip, checksum, powershell     |
| `.github/workflows/validate-basecoat.yml`                                  | validate repo structure on push and pull request            | workflow, ci, validation               |
| `.github/workflows/validate-repo-template-sample.yml`                      | validate sample repository template assets and contracts    | workflow, template, governance, ci     |
| `.github/workflows/prd-spec-gate.yml`                                      | enforce PRD/spec references on risky or large pull requests | workflow, prd, spec, governance        |
| `.github/workflows/package-basecoat.yml`                                   | package and publish release artifacts                       | workflow, release, package, artifact   |
| `.github/PULL_REQUEST_TEMPLATE.md`                                         | pull request template with PRD/spec reference fields        | pull request, template, prd, spec      |
| `examples/workflows/bootstrap-from-release.yml`                            | install a pinned Base Coat release into a new repo          | workflow, bootstrap, pinned release    |
| `examples/workflows/validate-basecoat-consumer.yml`                        | validate a consumer repo keeps Base Coat present            | workflow, consumer, drift, validation  |
| `examples/repo-template/.github/base-coat.lock.json`                       | lock file contract for template-based Base Coat pinning     | template, lock, pinned version         |
| `examples/repo-template/.github/workflows/bootstrap-basecoat-template.yml` | bootstrap Base Coat in a new repo from lock file            | template, bootstrap, release, checksum |
| `examples/repo-template/.github/workflows/enforce-basecoat-template.yml`   | enforce lock/version consistency and block unsafe drift     | template, enforcement, drift, policy   |

## Test Assets

| File                  | Use For                                                                                      | Keywords                           |
| --------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------- |
| `tests/run-tests.ps1` | smoke tests for validation, packaging, hooks, and commit-message scanning on Windows         | test, powershell, smoke, packaging |
| `tests/run-tests.sh`  | smoke tests for validation, packaging, hooks, and commit-message scanning on macOS and Linux | test, bash, smoke, packaging       |
| `tests/README.md`     | test suite scope and execution commands                                                      | tests, docs, usage                 |
