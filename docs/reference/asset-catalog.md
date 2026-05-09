# Asset Catalog

Complete reference of all BaseCoat assets grouped by category. Counts reflect the current
repository state (79 agents · 57 skills · 64 instructions · 3 prompts).

## Agents

Agents are end-to-end task executors stored as `agents/<name>.agent.md`.

### Architecture & Design

| Agent | Description |
|---|---|
| `agent-designer` | Designs and authors Copilot agent definitions; covers skill composition and multi-agent coordination |
| `api-designer` | OpenAPI spec authoring, REST and GraphQL design, versioning strategy, breaking-change analysis |
| `data-architect` | Scalable data architectures, medallion layers, data governance, and analytics workflows |
| `domain-designer` | Domain-Driven Design agent for bounded context modeling, aggregate design, ubiquitous language |
| `ha-architect` | High-availability, resilience, and chaos testing strategies for distributed systems |
| `identity-architect` | Azure RBAC design, managed identity configuration, Entra ID app registrations |
| `solution-architect` | System design, C4 diagrams, ADRs, technology selection, and cross-cutting concerns |
| `ux-designer` | User journey mapping, wireframe specs, component design, and accessibility audits |

### Modernization & Migration

| Agent | Description |
|---|---|
| `app-inventory` | Scans legacy applications to discover dependencies, identify technology stacks, assess migration readiness |
| `containerization-planner` | Assesses containerization readiness, chooses deployment platforms (Docker/AKS/ACA) |
| `database-migration` | Plans and executes database migrations: schema evolution, replication, zero-downtime upgrades |
| `dotnet-modernization-advisor` | .NET modernization assessment, upgrade planning, and execution guidance |
| `entity-framework-migration` | Entity Framework Core migration planning and execution |
| `identity-migration` | Identity provider migration strategy and execution |
| `legacy-modernization` | Web Forms to Razor Pages migration using the strangler fig pattern |

### Azure & Cloud

| Agent | Description |
|---|---|
| `azure-landing-zone` | Scaffolds enterprise-scale landing zones following Microsoft ESLZ guidance |
| `finops-advisor` | Cloud cost governance, cost optimization, chargeback/showback models, and 12-Factor FinOps |
| `gitops-engineer` | GitOps workflows for Infrastructure-as-Code, declarative configuration, automated deployment |
| `infrastructure-deploy` | Orchestrates Azure infrastructure deployments using Bicep with parallel resource management |

### Security

| Agent | Description |
|---|---|
| `api-security` | API threat modeling, OWASP API Security Top 10 assessment, and remediation |
| `chaos-engineer` | Fault injection, game days, resilience scoring, and recovery validation |
| `config-auditor` | Scans repositories for committed or unprotected configuration files containing secrets |
| `container-security` | Container image and runtime security hardening |
| `github-security-posture` | GitHub org and repository policy auditor |
| `hardening-advisor` | Security hardening guidance for applications and infrastructure |
| `penetration-test` | Security assessments, vulnerability discovery, and remediation workflows |
| `policy-as-code-compliance` | Validates code and configuration against organizational rules and compliance frameworks |
| `secrets-manager` | Secrets lifecycle management and rotation |
| `security-analyst` | Vulnerability assessment, threat modeling, and secure coding review |
| `security-monitor` | Security monitoring and alerting strategy |
| `security-operations` | SOC playbook guidance for threat detection, incident response, and security operations |
| `supply-chain-security` | Artifact signing, SBOM generation, and provenance tracking |

### Development

| Agent | Description |
|---|---|
| `backend-dev` | APIs, services, and business logic; architecture patterns and data access |
| `frontend-dev` | UI components and applications; component-driven development and state management |
| `middleware-dev` | API gateways, message-passing, and integration layer design |
| `mcp-developer` | MCP server development for building Model Context Protocol servers and tools |
| `data-tier` | Schema design, migrations, query optimization, and data access patterns |

### Testing & Quality

| Agent | Description |
|---|---|
| `code-review` | Structured multi-step code review with findings prioritized by severity |
| `contract-testing` | Consumer-driven contracts, E2E testing strategy, and mutation testing |
| `e2e-test-strategy` | End-to-end testing orchestration, critical path identification, flakiness reduction |
| `exploratory-charter` | Time-boxed exploratory testing sessions with mission-driven charters |
| `guardrail` | Validates outputs against safety, quality, compliance, and formatting constraints |
| `manual-test-strategy` | Structured manual testing strategy for a feature or risk inventory |
| `performance-analyst` | Profiling, load testing, and optimization; evaluating application performance |
| `strategy-to-automation` | Converts manual test paths into automation candidates |

### CI/CD & DevOps

| Agent | Description |
|---|---|
| `agentops` | Agent versioning, rollout, health monitoring, rollback, and operational governance |
| `dependency-lifecycle` | Manages dependency updates, tracks breaking changes, plans upgrade paths |
| `dependency-update-advisor` | Reviews Dependabot PRs with structured risk assessment comments |
| `devops-engineer` | CI/CD pipelines, infrastructure as code, container strategy, environment management |
| `release-impact-advisor` | Release readiness assessment, change impact analysis, blast radius estimation |
| `release-manager` | Automated versioned release workflow from merged PRs to GitHub releases |
| `self-healing-ci` | CI failure analysis, log parsing, pipeline remediation, and retry strategies |
| `sre-engineer` | SLOs, error budgets, incident response, chaos engineering for site reliability |

### Memory & Knowledge

| Agent | Description |
|---|---|
| `feedback-loop` | Continuous learning through user feedback collection and prompt effectiveness tracking |
| `memory-curator` | Extracts, deduplicates, validates, and retrieves cross-session knowledge |
| `memory-promoter` | Analyzes session transcripts to identify high-value patterns for promotion to BaseCoat memory |
| `prompt-coach` | Interactive prompt optimization coach; reviews and scores prompt quality |
| `prompt-engineer` | System prompt engineering; designing prompts, optimizing few-shot examples |

### Delivery & Planning

| Agent | Description |
|---|---|
| `incident-responder` | Structured incident response: classification, mitigation coordination, post-mortem |
| `issue-triage` | GitHub issue classification, priority assignment (P0-P3), label management |
| `merge-coordinator` | Parallel branch merge coordination into a target branch |
| `product-manager` | Requirements gathering, user stories, acceptance criteria, roadmap planning |
| `production-readiness` | Ensures applications meet operational requirements before release |
| `project-onboarding` | Single-invocation new repo setup with BaseCoat integration |
| `retro-facilitator` | End-of-sprint retrospective from closed issues and merged PRs |
| `rollout-basecoat` | Onboards a repository to BaseCoat in an enterprise setting with pinned versioning |
| `sprint-planner` | Goal-to-issues decomposition and wave dependency mapping |
| `sprint-retrospective` | Reconstructs repository history for sprint retrospectives |

### BaseCoat Authoring

| Agent | Description |
|---|---|
| `guidance-author` | Drafts new BaseCoat guidance assets (instructions, skills, agents, prompts) |
| `guidance-reviewer` | Validates a BaseCoat guidance draft before committing |
| `new-customization` | Creates or updates customization assets such as instructions, skills, prompts, or agents |

### Data & ML

| Agent | Description |
|---|---|
| `chaos-engineer` | Fault injection and resilience validation for distributed systems |
| `data-integrity` | Data integrity validation and constraint enforcement |
| `data-pipeline` | Medallion lakehouse architecture, data quality, ML pipeline orchestration |
| `dataops` | Data quality, lineage, governance, orchestration, and data contracts |
| `llmops` | Prompt deployment pipelines, model gateway configuration, inference monitoring |
| `mlops` | Model lifecycle, experiment tracking, model registry, deployment automation, drift detection |
| `observability-engineer` | Observability strategy including metrics, traces, logs, and alerting |

---

## Skills

Skills are reusable domain capabilities stored as `skills/<name>/SKILL.md`.

### Azure

| Skill | Description |
|---|---|
| `azure-container-apps` | Azure Container Apps deployment patterns |
| `azure-devops-rest` | Azure DevOps REST API integration |
| `azure-identity` | Azure managed identity and Entra ID configuration |
| `azure-landing-zone` | Enterprise-scale landing zone scaffolding |
| `azure-linux-app-service` | Azure App Service for Linux deployment and configuration |
| `azure-networking` | Azure virtual networks, NSGs, private endpoints |
| `azure-policy` | Azure Policy definition and assignment |
| `azure-waf-review` | Azure Well-Architected Framework review automation |

### Modernization

| Skill | Description |
|---|---|
| `app-inventory` | Application inventory and dependency discovery |
| `cross-stack-modernization` | Cross-technology stack modernization patterns |
| `dotnet-modernization` | .NET upgrade and modernization execution |
| `entity-framework-migration` | EF Core migration generation and validation |
| `identity-migration` | Identity provider migration execution |

### Development Domains

| Skill | Description |
|---|---|
| `agent-design` | Copilot agent definition authoring |
| `api-design` | OpenAPI/REST/GraphQL API specification authoring |
| `api-security` | API security assessment and hardening |
| `backend-dev` | Backend service and API development patterns |
| `code-review` | Structured code review workflow |
| `contract-testing` | Consumer-driven contract test generation |
| `cqrs-event-sourcing` | CQRS and event sourcing implementation patterns |
| `data-tier` | Data schema design and access patterns |
| `database-migration` | Database migration planning and execution |
| `domain-driven-design` | Bounded context and aggregate modeling |
| `e2e-testing` | End-to-end test strategy and implementation |
| `electron-apps` | Electron desktop application security patterns |
| `frontend-dev` | Frontend component and state management patterns |
| `manual-test-strategy` | Manual test plan and exploratory charter creation |
| `mcp-development` | Model Context Protocol server development |
| `performance-profiling` | Application profiling and load testing |
| `refactoring` | Safe refactoring techniques and patterns |

### DevOps & Operations

| Skill | Description |
|---|---|
| `basecoat` | BaseCoat sync, version management, and asset authoring |
| `create-instruction` | Creates new instruction files following BaseCoat conventions |
| `create-skill` | Creates new skill directories following BaseCoat conventions |
| `dev-containers` | Dev container configuration and optimization |
| `devops` | CI/CD pipeline design and implementation |
| `environment-bootstrap` | Environment provisioning and bootstrap automation |
| `gitops` | GitOps workflow implementation with declarative configuration |
| `ha-resilience` | High-availability and resilience pattern implementation |
| `handoff` | Session and task handoff documentation |
| `human-in-the-loop` | Human review checkpoints and escalation workflows |
| `observability` | Metrics, tracing, logging, and alerting setup |
| `production-readiness` | Pre-release operational readiness validation |
| `sprint-management` | Sprint planning, issue decomposition, and wave mapping |
| `sprint-retrospective` | Sprint retrospective generation from repository history |
| `supply-chain-security` | SBOM, artifact signing, and provenance |
| `tech-debt` | Technical debt identification and remediation planning |
| `twelve-factor` | Twelve-factor app compliance review |

### Security

| Skill | Description |
|---|---|
| `github-security-posture` | GitHub organization and repository security posture audit |
| `penetration-testing` | Security assessment and penetration testing execution |
| `security` | General security review and hardening |
| `security-operations` | SOC playbook and threat response guidance |

### Memory & Intelligence

| Skill | Description |
|---|---|
| `architecture` | Architectural decision recording and system design |
| `copilot-cli-usage-analytics` | Copilot CLI usage analytics collection and reporting |
| `copilot-usage-analytics` | GitHub Copilot usage metrics and adoption reporting |
| `documentation` | Technical documentation authoring and review |
| `ux` | User experience design and accessibility patterns |

---

## Instructions

Instructions are Copilot behavior rules stored as `instructions/<name>.instructions.md`,
applied automatically based on `applyTo` glob patterns.

### Governance & Safety

| Instruction | Description |
|---|---|
| `governance` | **Read first.** Governance rules for all AI agents in this repository |
| `ai-verification` | Risk-tiered verification protocol for reviewing or accepting AI-generated code |
| `config` | Safety rules for creating, modifying, or staging configuration files |
| `output-style` | Keeps agent responses concise while preserving clarity and full-fidelity detail |
| `plan-first` | Enforces planning before execution for multi-step or cross-file tasks |
| `tool-minimization` | Selective tool enablement to reduce surface area during agent execution |
| `verification` | Requires explicit success criteria before planning, implementing, or reviewing |

### Agent Behavior

| Instruction | Description |
|---|---|
| `agent-behavior` | Prevents infinite retry loops, edit thrashing, and repeated failed actions |
| `agents` | Naming, structure, required sections, skill pairing, and multi-agent coordination |
| `model-routing` | Cost-aware model routing for sub-agent dispatch and model selection |
| `session-hygiene` | Long-running session management, task switching, and handoff coordination |
| `token-economics` | Cost-aware context loading; model escalation cost control |

### Architecture & Design

| Instruction | Description |
|---|---|
| `architecture` | Architectural decisions, API design, system diagrams, and cross-cutting standards |
| `naming` | Repository, file, type, variable, test, infrastructure, and Azure resource naming |
| `hrm-execution` | Formal layer contracts, two-dimensional routing matrix, and guidance signals |
| `trm-reflexion` | TRM Reflexion loop for intent classification and turn budget estimation |

### Development

| Instruction | Description |
|---|---|
| `backend` | APIs, services, workers, integrations, and data access layer best practices |
| `development` | Shared conventions when using backend-dev, frontend-dev, middleware-dev agents |
| `frontend` | UI, client-side state, styling, forms, and interaction best practices |
| `nextjs-react19` | Next.js and React 19: Server Components, App Router, streaming, forms |
| `npm-workspaces` | npm workspaces and monorepo management setup and best practices |
| `python` | Python conventions for data science and ML pipelines |
| `cpp` | Memory safety, concurrency, and undefined behavior for C++ and native code |
| `electron` | Secure Electron desktop application patterns |
| `tailwind-v4` | Tailwind CSS v4 patterns and CSS-first configuration |
| `monolith` | Context management for large monolith codebases with tightly coupled modules |

### Azure & Cloud

| Instruction | Description |
|---|---|
| `azure` | Azure services, Azure SDK integrations, and deployment configuration |
| `azure-app-configuration` | Azure App Configuration for feature flags and centralized settings |
| `azure-service-connector` | Azure Service Connector for App Service, Container Apps, AKS |
| `bicep` | Bicep file authoring: symbolic names, parameters, and module patterns |
| `bootstrap-autodetect` | Bootstrap scripts that auto-detect values from existing infrastructure |
| `bootstrap-github-secrets` | Bootstrap scripts provisioning identity or infrastructure for GitHub Actions |
| `bootstrap-structure` | Bootstrap script decomposition, idempotency, and documentation |
| `ci-firewall` | GitHub Actions workflows accessing firewalled Azure resources |
| `rbac-authentication` | RBAC-only authentication enforcement — no shared keys or connection strings |
| `terraform` | Terraform for Azure: provider pinning and shared infrastructure patterns |
| `terraform-init` | Running `terraform init` in bootstrap scripts and CI/CD pipelines |
| `drift-monitor` | Infrastructure-as-Code drift detection and remediation strategies |

### Security

| Instruction | Description |
|---|---|
| `security` | Authentication, authorization, secrets, input handling, and security-sensitive changes |
| `secrets-management` | Secrets lifecycle, rotation, and storage governance |
| `security-monitoring` | Security monitoring, alerting, and incident detection |
| `workflow-integrity` | GitHub Actions security: script injection, credential exposure prevention |
| `workflow-file-integrity` | Silent GitHub Actions workflow file corruption prevention and checksum validation |

### Testing & Quality

| Instruction | Description |
|---|---|
| `testing` | Common testing best practices for regression, unit, integration tests |
| `quality` | PR review, security posture, performance measurement, and coverage enforcement |
| `data-workload-testing` | Medallion data patterns, data quality validation, and contract testing |
| `dotnet-dependency-analysis` | .NET dependency compatibility and remediation analysis |
| `dotnet-test-strategy` | .NET modernization test strategy and regression-gate guidance |
| `dotnet-upgrade-planning` | .NET upgrade planning checklist and phased execution |
| `mutation-testing` | Mutation testing strategy and tooling integration |

### Data & ML

| Instruction | Description |
|---|---|
| `data-science` | Data science and ML conventions: Jupyter, pandas, scikit-learn |
| `fabric-notebooks` | Microsoft Fabric notebooks with CI/CD, lakehouse integration, and governance |
| `observability` | Metrics, traces, logs, and alerting configuration guidance |

### Reliability

| Instruction | Description |
|---|---|
| `reliability` | Uptime, retries, background work, and dependency failure handling |
| `rest-client-resilience` | HTTP client resilience: timeouts, retries, circuit breakers |
| `runtime-debugging` | Debugging with crash dumps, logs, memory state, and production diagnostics |
| `error-kb` | Building and consulting an error knowledge base for agent failure classification |

### Memory & Knowledge

| Instruction | Description |
|---|---|
| `memory-index` | L2 memory index loaded at session start to prime fast pattern recall |
| `enterprise-configuration` | GitHub Copilot policy configuration, usage metrics, and seat management |
| `documentation` | Documentation standards for setup, workflows, public contracts, and runbooks |
| `process` | Sprint planning, issue triage, PR management, and release evaluation |

---

## Prompts

Prompts are structured templates stored as `prompts/<name>.prompt.md`.

| Prompt | Description |
|---|---|
| `architect` | Break down a feature or system change into options, tradeoffs, and execution steps before editing code |
| `bugfix` | Root-cause analysis, minimal safe fix, and validation for a bug, regression, or production failure |
| `code-review` | Risk-focused code review of a diff, branch, or set of files; returns findings, open questions, summary |
