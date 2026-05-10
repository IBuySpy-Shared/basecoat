# Agent Taxonomy

Agents are classified across three dimensions:

## Dimensions

### Model (LLM capability tier)

| Tier | Use Case | Examples |
|------|----------|----------|
| **reasoning** | Complex multi-step analysis, architecture decisions, multi-file changes | solution-architect, legacy-modernization |
| **balanced** | General implementation, code review, standard workflows | backend-dev, frontend-dev, devops-engineer |
| **fast** | High-volume triage, simple transforms, boilerplate generation | issue-triage, new-customization, merge-coordinator |

### Task (SDLC phase)

| Phase | Purpose | Examples |
|-------|---------|----------|
| **plan** | Architecture, design, strategy, requirements | solution-architect, api-designer, product-manager |
| **build** | Code generation, implementation, refactoring | backend-dev, frontend-dev, middleware-dev |
| **test** | Quality assurance, security, chaos engineering | code-review, chaos-engineer, security-analyst |
| **deploy** | CI/CD, release, infrastructure provisioning | devops-engineer, infrastructure-deploy, release-manager |
| **operate** | Monitoring, incident response, SRE, observability | sre-engineer, incident-responder, performance-analyst |

### Type (interaction pattern)

| Pattern | Behavior | Examples |
|---------|----------|----------|
| **autonomous** | Runs end-to-end without human input | self-healing-ci, issue-triage, merge-coordinator |
| **collaborative** | Human-in-the-loop, produces artifacts for review | code-review, solution-architect, tech-writer |
| **reactive** | Triggered by events (CI failure, alert, PR) | incident-responder, self-healing-ci, guardrail |

## Registry

<!-- Each agent is tagged with [model, task, type] -->

| Agent | Model | Task | Type |
|-------|-------|------|------|
| agent-designer | balanced | build | collaborative |
| agentops | balanced | operate | collaborative |
| api-designer | reasoning | plan | collaborative |
| app-inventory | balanced | plan | autonomous |
| backend-dev | balanced | build | collaborative |
| chaos-engineer | balanced | test | autonomous |
| code-review | balanced | test | collaborative |
| config-auditor | fast | operate | reactive |
| containerization-planner | reasoning | plan | collaborative |
| data-tier | balanced | build | collaborative |
| dataops | balanced | deploy | collaborative |
| dependency-lifecycle | fast | operate | autonomous |
| devops-engineer | balanced | deploy | collaborative |
| exploratory-charter | balanced | test | collaborative |
| feedback-loop | fast | operate | reactive |
| frontend-dev | balanced | build | collaborative |
| github-security-posture | balanced | operate | collaborative |
| guardrail | fast | test | reactive |
| incident-responder | reasoning | operate | reactive |
| infrastructure-deploy | balanced | deploy | autonomous |
| issue-triage | fast | plan | autonomous |
| legacy-modernization | reasoning | build | collaborative |
| llmops | balanced | deploy | collaborative |
| manual-test-strategy | balanced | test | collaborative |
| mcp-developer | balanced | build | collaborative |
| memory-curator | fast | operate | autonomous |
| merge-coordinator | fast | deploy | autonomous |
| middleware-dev | balanced | build | collaborative |
| mlops | balanced | deploy | collaborative |
| new-customization | fast | build | autonomous |
| performance-analyst | balanced | test | collaborative |
| policy-as-code-compliance | reasoning | deploy | collaborative |
| product-manager | reasoning | plan | collaborative |
| project-onboarding | balanced | plan | autonomous |
| prompt-coach | balanced | build | collaborative |
| prompt-engineer | balanced | build | collaborative |
| release-impact-advisor | balanced | deploy | collaborative |
| release-manager | balanced | deploy | collaborative |
| retro-facilitator | balanced | plan | collaborative |
| rollout-basecoat | balanced | deploy | autonomous |
| security-analyst | reasoning | test | collaborative |
| self-healing-ci | fast | deploy | reactive |
| solution-architect | reasoning | plan | collaborative |
| sprint-planner | balanced | plan | collaborative |
| sre-engineer | balanced | operate | reactive |
| strategy-to-automation | reasoning | plan | collaborative |
| tech-writer | balanced | build | collaborative |
| ux-designer | balanced | plan | collaborative |

## Usage

Select agents by filtering on any dimension:

```bash
# Find all autonomous deploy agents
grep -E "autonomous.*deploy|deploy.*autonomous" docs/agents/TAXONOMY.md

# Find reasoning-tier agents for planning
grep -E "reasoning.*plan" docs/agents/TAXONOMY.md
```

All agents are flat files at `agents/<name>.agent.md`. Browse the registry table
above to filter by model tier, task phase, or interaction type.

## Model Tier Detail

### Reasoning-Tier Agents

Require advanced reasoning capabilities (opus-class models). Use for complex
multi-step analysis, architecture decisions, and cross-cutting concerns.

Agents: api-designer, containerization-planner, incident-responder,
legacy-modernization, policy-as-code-compliance, product-manager,
security-analyst, solution-architect, strategy-to-automation

### Balanced-Tier Agents

General-purpose agents suitable for sonnet-class models. Handle standard
implementation, review, and workflow tasks.

Agents: agent-designer, agentops, app-inventory, backend-dev, chaos-engineer,
code-review, data-tier, dataops, devops-engineer, exploratory-charter,
frontend-dev, llmops, manual-test-strategy, mcp-developer, middleware-dev,
mlops, performance-analyst, project-onboarding, prompt-coach, prompt-engineer,
release-impact-advisor, release-manager, retro-facilitator, rollout-basecoat,
sprint-planner, sre-engineer, tech-writer, ux-designer

### Fast-Tier Agents

Lightweight agents suitable for haiku-class models. Handle high-volume triage,
simple transforms, and event responses.

Agents: config-auditor, dependency-lifecycle, feedback-loop, guardrail,
issue-triage, memory-curator, merge-coordinator, new-customization, self-healing-ci

## Task Phase Detail

### Plan Phase

Architecture, design, strategy, and requirements gathering.

Agents: api-designer, app-inventory, containerization-planner, issue-triage,
product-manager, project-onboarding, retro-facilitator, solution-architect,
sprint-planner, strategy-to-automation, ux-designer

### Build Phase

Code generation, implementation, and refactoring.

Agents: agent-designer, backend-dev, data-tier, frontend-dev, legacy-modernization,
mcp-developer, middleware-dev, new-customization, prompt-coach, prompt-engineer,
tech-writer

### Test Phase

Quality assurance, security analysis, and chaos engineering.

Agents: chaos-engineer, code-review, exploratory-charter, guardrail,
manual-test-strategy, performance-analyst, security-analyst

### Deploy Phase

CI/CD, release management, and infrastructure provisioning.

Agents: dataops, devops-engineer, infrastructure-deploy, llmops, merge-coordinator,
mlops, policy-as-code-compliance, release-impact-advisor, release-manager,
rollout-basecoat, self-healing-ci

### Operate Phase

Monitoring, incident response, SRE, and observability.

Agents: agentops, config-auditor, dependency-lifecycle, feedback-loop,
incident-responder, memory-curator, sre-engineer

## Interaction Type Detail

### Autonomous Agents

Run end-to-end without human input. Suitable for CI/CD pipelines and background
automation.

Agents: app-inventory, chaos-engineer, dependency-lifecycle, infrastructure-deploy,
issue-triage, memory-curator, merge-coordinator, new-customization,
project-onboarding, rollout-basecoat

### Collaborative Agents

Human-in-the-loop agents that produce artifacts for review and iteration.

Agents: agent-designer, agentops, api-designer, backend-dev, code-review,
containerization-planner, data-tier, dataops, devops-engineer, exploratory-charter,
frontend-dev, legacy-modernization, llmops, manual-test-strategy, mcp-developer,
middleware-dev, mlops, performance-analyst, policy-as-code-compliance,
product-manager, prompt-coach, prompt-engineer, release-impact-advisor,
release-manager, retro-facilitator, security-analyst, solution-architect,
sprint-planner, strategy-to-automation, tech-writer, ux-designer

### Reactive Agents

Event-driven agents triggered by CI failures, alerts, PRs, or system events.

Agents: config-auditor, feedback-loop, guardrail, incident-responder,
self-healing-ci, sre-engineer
