# Base Coat Asset Catalog

This is the master index of all Base Coat assets, including 44 agents, 27 instructions, 21 skills, 3 prompts, and 23 documentation files. Use this catalog to navigate, discover, and understand the Base Coat framework's components.

## Agents (43)

Agents are autonomous AI workers that specialize in specific roles. Each agent is designed to perform a particular function within the software development lifecycle.

| Agent | Description |
|-------|-------------|
| [agent-designer](../agents/agent-designer.agent.md) | Designs Copilot agents and related assets. |
| [agentops](../agents/agentops.agent.md) | Manages agent versioning, rollout, and health. |
| [api-designer](../agents/api-designer.agent.md) | Designs and governs API contracts. |
| [backend-dev](../agents/backend-dev.agent.md) | Builds backend services and APIs. |
| [chaos-engineer](../agents/chaos-engineer.agent.md) | Runs resilience and fault-injection experiments. |
| [code-review](../agents/code-review.agent.md) | Performs structured, risk-focused code reviews. |
| [config-auditor](../agents/config-auditor.agent.md) | Finds unsafe or secret-bearing config files. |
| [data-pipeline](../agents/data-pipeline.agent.md) | Builds medallion lakehouse pipelines and ML workflows. |
| [data-tier](../agents/data-tier.agent.md) | Designs schemas, migrations, and queries. |
| [dataops](../agents/dataops.agent.md) | Manages data pipeline quality and governance. |
| [dependency-lifecycle](../agents/dependency-lifecycle.agent.md) | Tracks and upgrades dependencies safely. |
| [devops-engineer](../agents/devops-engineer.agent.md) | Designs CI/CD, IaC, and deployment workflows. |
| [exploratory-charter](../agents/exploratory-charter.agent.md) | Creates guided exploratory testing charters. |
| [feedback-loop](../agents/feedback-loop.agent.md) | Improves prompts from user feedback and results. |
| [frontend-dev](../agents/frontend-dev.agent.md) | Builds UI components and client apps. |
| [guardrail](../agents/guardrail.agent.md) | Validates outputs against safety and quality rules. |
| [incident-responder](../agents/incident-responder.agent.md) | Coordinates incident response and recovery. |
| [issue-triage](../agents/issue-triage.agent.md) | Classifies and prioritizes GitHub issues. |
| [llmops](../agents/llmops.agent.md) | Operates production LLM systems and cost. |
| [manual-test-strategy](../agents/manual-test-strategy.agent.md) | Creates manual testing and automation plans. |
| [mcp-developer](../agents/mcp-developer.agent.md) | Builds and reviews MCP servers and tools. |
| [memory-curator](../agents/memory-curator.agent.md) | Curates cross-session memory with SQLite. |
| [merge-coordinator](../agents/merge-coordinator.agent.md) | Coordinates safe parallel branch merges. |
| [middleware-dev](../agents/middleware-dev.agent.md) | Builds integration and middleware layers. |
| [mlops](../agents/mlops.agent.md) | Operates ML model lifecycle and deployments. |
| [new-customization](../agents/new-customization.agent.md) | Creates or updates customization assets. |
| [performance-analyst](../agents/performance-analyst.agent.md) | Profiles and optimizes application performance. |
| [policy-as-code-compliance](../agents/policy-as-code-compliance.agent.md) | Checks code against policy-as-code rules. |
| [product-manager](../agents/product-manager.agent.md) | Defines requirements, stories, and priorities. |
| [project-onboarding](../agents/project-onboarding.agent.md) | Sets up a new repo with Base Coat. |
| [prompt-coach](../agents/prompt-coach.agent.md) | Reviews and improves prompt quality. |
| [prompt-engineer](../agents/prompt-engineer.agent.md) | Optimizes system prompts and token usage. |
| [release-impact-advisor](../agents/release-impact-advisor.agent.md) | Assesses release risk and blast radius. |
| [release-manager](../agents/release-manager.agent.md) | Automates versioned releases and changelogs. |
| [retro-facilitator](../agents/retro-facilitator.agent.md) | Runs sprint retrospectives and action items. |
| [rollout-basecoat](../agents/rollout-basecoat.agent.md) | Onboards repos to Base Coat safely. |
| [security-analyst](../agents/security-analyst.agent.md) | Reviews code and dependencies for security issues. |
| [self-healing-ci](../agents/self-healing-ci.agent.md) | Diagnoses and remediates CI failures. |
| [solution-architect](../agents/solution-architect.agent.md) | Designs systems, diagrams, and ADRs. |
| [sprint-planner](../agents/sprint-planner.agent.md) | Breaks goals into sprint issues and waves. |
| [sre-engineer](../agents/sre-engineer.agent.md) | Improves reliability, SLOs, and incident response. |
| [strategy-to-automation](../agents/strategy-to-automation.agent.md) | Turns manual tests into automation candidates. |
| [tech-writer](../agents/tech-writer.agent.md) | Creates technical docs and docs-as-code. |
| [ux-designer](../agents/ux-designer.agent.md) | Designs journeys, wireframes, and accessibility. |

## Instructions (27)

Instructions provide behavioral guidance to agents and AI systems. They establish conventions, patterns, and standards for specific domains and workflows.

| Instruction | Description |
|-------------|-------------|
| [agent-behavior](../instructions/agent-behavior.instructions.md) | Prevents retry loops and edit thrashing. |
| [agents](../instructions/agents.instructions.md) | Guides agent file structure and conventions. |
| [architecture](../instructions/architecture.instructions.md) | Guides architectural decisions and diagrams. |
| [azure](../instructions/azure.instructions.md) | Covers safe Azure service and SDK usage. |
| [backend](../instructions/backend.instructions.md) | Covers backend APIs, services, and data access. |
| [bicep](../instructions/bicep.instructions.md) | Guides Azure Bicep authoring and validation. |
| [config](../instructions/config.instructions.md) | Protects config files and secrets. |
| [development](../instructions/development.instructions.md) | Shared dev standards for code, tests, and security. |
| [documentation](../instructions/documentation.instructions.md) | Guides docs for workflow and contract changes. |
| [error-kb](../instructions/error-kb.instructions.md) | Builds and maintains an error knowledge base. |
| [frontend](../instructions/frontend.instructions.md) | Covers UI, styling, state, and accessibility. |
| [governance](../instructions/governance.instructions.md) | Repository-wide AI agent governance rules. |
| [mcp](../instructions/mcp.instructions.md) | Guides MCP server and tool usage. |
| [naming](../instructions/naming.instructions.md) | Defines naming conventions across assets. |
| [output-style](../instructions/output-style.instructions.md) | Keeps responses concise and clear. |
| [plan-first](../instructions/plan-first.instructions.md) | Forces explore-plan-implement-verify workflow. |
| [process](../instructions/process.instructions.md) | Covers planning, triage, PRs, and releases. |
| [quality](../instructions/quality.instructions.md) | Sets review, security, performance, and coverage gates. |
| [reliability](../instructions/reliability.instructions.md) | Guides resilient code and failure handling. |
| [security](../instructions/security.instructions.md) | Covers auth, secrets, and secure coding. |
| [session-hygiene](../instructions/session-hygiene.instructions.md) | Helps manage long-running Copilot sessions. |
| [terraform](../instructions/terraform.instructions.md) | Guides safe Terraform for Azure infrastructure. |
| [testing](../instructions/testing.instructions.md) | Covers regression-safe test authoring and review. |
| [token-economics](../instructions/token-economics.instructions.md) | Encourages cost-aware model and context use. |
| [tool-minimization](../instructions/tool-minimization.instructions.md) | Minimizes tool access and MCP noise. |
| [ux](../instructions/ux.instructions.md) | Guides UX, accessibility, and journey mapping. |
| [verification](../instructions/verification.instructions.md) | Requires explicit success criteria and evidence. |

## Skills (21)

Skills are reusable, task-specific modules that extend agent capabilities. Each skill encapsulates specialized knowledge and workflows.

| Skill | Description |
|-------|-------------|
| [agent-design](../skills/agent-design/) | Designs Copilot agents and their files. |
| [api-design](../skills/api-design/) | Designs, reviews, and evolves API contracts. |
| [architecture](../skills/architecture/) | Designs systems and architecture decisions. |
| [backend-dev](../skills/backend-dev/) | Builds APIs, services, and data access. |
| [basecoat](../skills/basecoat/) | Routes requests to the right Base Coat agent. |
| [code-review](../skills/code-review/) | Reviews code and diffs for risks. |
| [create-instruction](../skills/create-instruction/) | Creates new instruction files. |
| [create-skill](../skills/create-skill/) | Creates new reusable skills. |
| [data-tier](../skills/data-tier/) | Designs schemas, migrations, and queries. |
| [devops](../skills/devops/) | Plans CI/CD, deployments, and observability. |
| [documentation](../skills/documentation/) | Writes and improves technical documentation. |
| [frontend-dev](../skills/frontend-dev/) | Builds UI components and responsive layouts. |
| [handoff](../skills/handoff/) | Structures session handoffs between agents. |
| [human-in-the-loop](../skills/human-in-the-loop/) | Adds human approval and escalation gates. |
| [manual-test-strategy](../skills/manual-test-strategy/) | Plans exploratory and manual testing. |
| [mcp-development](../skills/mcp-development/) | Builds MCP servers, tools, and transports. |
| [performance-profiling](../skills/performance-profiling/) | Profiles slow code paths and fixes regressions. |
| [refactoring](../skills/refactoring/) | Simplifies code without changing behavior. |
| [security](../skills/security/) | Performs security reviews and threat modeling. |
| [sprint-management](../skills/sprint-management/) | Plans sprints and retrospectives. |
| [ux](../skills/ux/) | Designs journeys, wireframes, and accessibility. |

## Prompts (3)

Prompts are reusable prompt templates that guide specific workflows and user interactions.

| Prompt | Description |
|--------|-------------|
| [architect](../prompts/architect.prompt.md) | Creates implementation plans before coding. |
| [bugfix](../prompts/bugfix.prompt.md) | Investigates bugs and proposes safe fixes. |
| [code-review](../prompts/code-review.prompt.md) | Runs a risk-focused code review. |

## Documentation (23)

Documentation files provide patterns, guidelines, specifications, and frameworks for extending and using Base Coat.

| Document | Description |
|----------|-------------|
| [AGENT_TELEMETRY.md](AGENT_TELEMETRY.md) | Agent observability and telemetry framework. |
| [AGENT_TESTING_HARNESS.md](AGENT_TESTING_HARNESS.md) | Harness for testing agent behavior. |
| [AGENT_TESTING.md](AGENT_TESTING.md) | Framework for behavioral agent testing. |
| [AI_ARCHITECTURE_PATTERNS.md](AI_ARCHITECTURE_PATTERNS.md) | Patterns for AI system architecture. |
| [CONFIG_PATTERN.md](CONFIG_PATTERN.md) | Pattern for safe local configuration. |
| [documentation-heading-scaffolds.md](documentation-heading-scaffolds.md) | Heading scaffolds for documentation. |
| [enterprise-rollout.md](enterprise-rollout.md) | Guide for enterprise rollout planning. |
| [enterprise-setup.md](enterprise-setup.md) | Guide for enterprise setup. |
| [GOVERNANCE.md](GOVERNANCE.md) | Reference for repository governance. |
| [HOOKS.md](HOOKS.md) | Specification for agent lifecycle hooks. |
| [LOCAL_EMBEDDINGS.md](LOCAL_EMBEDDINGS.md) | Guide to local embeddings usage. |
| [LOCAL_MODELS.md](LOCAL_MODELS.md) | Guide to local model usage. |
| [MODEL_OPTIMIZATION.md](MODEL_OPTIMIZATION.md) | Guide to optimizing agent model usage. |
| [MULTI_AGENT_WORKFLOWS.md](MULTI_AGENT_WORKFLOWS.md) | Guide to multi-agent workflows. |
| [OFFLINE_AGENT_STACK.md](OFFLINE_AGENT_STACK.md) | Guide to offline agent stack setup. |
| [prd-and-spec-guidance.md](prd-and-spec-guidance.md) | Guidance for PRDs and specs. |
| [PROMPT_REGISTRY.md](PROMPT_REGISTRY.md) | Specification for prompt registry. |
| [RAG_PATTERNS.md](RAG_PATTERNS.md) | Patterns for retrieval-augmented context. |
| [RELEASE_PROCESS.md](RELEASE_PROCESS.md) | Guide to the release process. |
| [repo-template-standard.md](repo-template-standard.md) | Standard for repository templates. |
| [SCOPED_INSTRUCTIONS.md](SCOPED_INSTRUCTIONS.md) | Guide to scoped instruction activation. |
| [SQLITE_MEMORY.md](SQLITE_MEMORY.md) | Specification for SQLite-backed memory. |
| [token-optimization.md](token-optimization.md) | Guide to token and context optimization. |
