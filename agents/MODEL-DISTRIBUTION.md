# Model Distribution Matrix

Maps each agent and skill to the **specific model** best suited for its workload.
Use this guide when configuring `model:` overrides in agent YAML files or when
selecting models for skill invocations.

## Available Models

| Model | Tier | Strengths | Best For |
|-------|------|-----------|----------|
| Claude Opus 4.7 | reasoning | Deep analysis, multi-step plans, architecture | Complex design, security audits, modernization |
| Claude Sonnet 4.5 | balanced | Code gen, reviews, implementation | Standard dev work, most collaborative tasks |
| Claude Haiku 4.5 | fast | Speed, triage, simple transforms | High-volume routing, boilerplate, labeling |
| GPT-5.5 | reasoning | Broad knowledge, long-context reasoning | Strategy, cross-domain planning |
| GPT-5.4 | balanced | Code generation, structured output | Build tasks, API design, data modeling |
| GPT-5.4 mini | fast | Speed, cost efficiency | Triage, formatting, simple queries |
| GPT-5.2-Codex | balanced | Code-specialized, refactoring | Implementation, test generation |

## Agent → Model Assignment

### Reasoning Tier (Complex analysis, architecture, multi-file changes)

| Agent | Recommended Model | Rationale |
|-------|-------------------|-----------|
| api-designer | Claude Opus 4.7 | API contracts require careful consistency analysis |
| containerization-planner | GPT-5.5 | Broad infra knowledge + long-context planning |
| incident-responder | Claude Opus 4.7 | Real-time multi-signal correlation under pressure |
| legacy-modernization | Claude Opus 4.7 | Large codebase understanding, dependency graphs |
| policy-as-code-compliance | GPT-5.5 | Regulatory cross-referencing, policy reasoning |
| product-manager | GPT-5.5 | Strategy synthesis, stakeholder trade-offs |
| security-analyst | Claude Opus 4.7 | Vulnerability chain analysis, exploit reasoning |
| solution-architect | Claude Opus 4.7 | Multi-system design, trade-off evaluation |
| strategy-to-automation | GPT-5.5 | Business-to-technical translation, broad scope |

### Balanced Tier (Standard implementation, code generation, reviews)

| Agent | Recommended Model | Rationale |
|-------|-------------------|-----------|
| agent-designer | Claude Sonnet 4.5 | Structured YAML generation, prompt crafting |
| agentops | GPT-5.4 | Metrics pipelines, structured observability |
| app-inventory | GPT-5.4 | Catalog generation, structured scanning |
| backend-dev | GPT-5.2-Codex | Code-heavy implementation tasks |
| chaos-engineer | Claude Sonnet 4.5 | Creative failure scenario design |
| code-review | Claude Sonnet 4.5 | Nuanced code quality assessment |
| data-tier | GPT-5.2-Codex | Schema design, migration scripts |
| dataops | GPT-5.4 | Pipeline configuration, ETL patterns |
| devops-engineer | GPT-5.4 | YAML/IaC generation, workflow design |
| exploratory-charter | Claude Sonnet 4.5 | Test strategy requires creative reasoning |
| frontend-dev | GPT-5.2-Codex | Component implementation, styling |
| infrastructure-deploy | GPT-5.4 | IaC templates, cloud resource config |
| llmops | Claude Sonnet 4.5 | Model serving patterns, prompt management |
| manual-test-strategy | Claude Sonnet 4.5 | Human-readable test plans, risk analysis |
| mcp-developer | GPT-5.2-Codex | Protocol implementation, SDK code |
| middleware-dev | GPT-5.2-Codex | Integration code, middleware patterns |
| mlops | GPT-5.4 | Pipeline orchestration, model registry |
| performance-analyst | Claude Sonnet 4.5 | Profiling interpretation, bottleneck analysis |
| project-onboarding | GPT-5.4 | Structured checklists, file scanning |
| prompt-coach | Claude Sonnet 4.5 | Prompt quality evaluation, suggestions |
| prompt-engineer | Claude Sonnet 4.5 | Prompt crafting, iteration patterns |
| release-impact-advisor | GPT-5.4 | Change impact assessment, dependency scan |
| release-manager | GPT-5.4 | Version management, changelog generation |
| retro-facilitator | Claude Sonnet 4.5 | Synthesis of team feedback, themes |
| rollout-basecoat | GPT-5.4 | File sync operations, config management |
| sprint-planner | GPT-5.4 | Capacity estimation, task decomposition |
| sre-engineer | Claude Sonnet 4.5 | Alert interpretation, runbook reasoning |
| tech-writer | Claude Sonnet 4.5 | Prose quality, documentation structure |
| ux-designer | Claude Sonnet 4.5 | Design reasoning, accessibility awareness |

### Fast Tier (High-volume, simple transforms, triage)

| Agent | Recommended Model | Rationale |
|-------|-------------------|-----------|
| config-auditor | GPT-5.4 mini | Pattern matching against known rules |
| dependency-lifecycle | Haiku 4.5 | Version comparison, changelog scanning |
| feedback-loop | GPT-5.4 mini | Signal routing, threshold checks |
| guardrail | Haiku 4.5 | Fast policy enforcement, binary pass/fail |
| issue-triage | Haiku 4.5 | Label classification, routing |
| memory-curator | GPT-5.4 mini | Deduplication, relevance scoring |
| merge-coordinator | Haiku 4.5 | Status checks, merge sequencing |
| new-customization | GPT-5.4 mini | Template expansion, scaffolding |
| self-healing-ci | Haiku 4.5 | Error pattern matching, retry logic |

## Skill → Model Assignment

### Complex Skills (Reasoning tier)

| Skill | Recommended Model | Rationale |
|-------|-------------------|-----------|
| architecture | Claude Opus 4.7 | System design decisions, trade-offs |
| azure-landing-zone | Claude Opus 4.7 | Enterprise-scale IaC, compliance patterns |
| azure-waf-review | GPT-5.5 | WAF pillar cross-referencing, broad assessment |
| identity-migration | Claude Opus 4.7 | Auth flow mapping, security-sensitive migration |
| security | Claude Opus 4.7 | Threat modeling, vulnerability analysis |
| service-bus-migration | GPT-5.5 | Messaging pattern translation, state handling |

### Standard Skills (Balanced tier)

| Skill | Recommended Model | Rationale |
|-------|-------------------|-----------|
| agent-design | Claude Sonnet 4.5 | Structured agent spec creation |
| api-design | GPT-5.4 | OpenAPI spec generation, contract design |
| app-inventory | GPT-5.4 | Structured scanning and catalog generation |
| azure-container-apps | GPT-5.4 | Container config, Bicep/ARM templates |
| azure-identity | Claude Sonnet 4.5 | Entra ID reasoning, auth patterns |
| azure-networking | GPT-5.4 | VNet/NSG config, IP planning |
| azure-policy | GPT-5.4 | Policy definition JSON, compliance rules |
| backend-dev | GPT-5.2-Codex | Implementation patterns, code scaffolds |
| basecoat | Claude Sonnet 4.5 | Meta-skill: understands our own conventions |
| code-review | Claude Sonnet 4.5 | Nuanced feedback on code quality |
| data-tier | GPT-5.2-Codex | Schema scripts, migration generation |
| devops | GPT-5.4 | Pipeline YAML, workflow templates |
| documentation | Claude Sonnet 4.5 | Prose quality, clear explanations |
| environment-bootstrap | GPT-5.4 | Setup scripts, dependency resolution |
| frontend-dev | GPT-5.2-Codex | Component code, CSS, frameworks |
| handoff | Claude Sonnet 4.5 | Context summarization between agents |
| human-in-the-loop | Claude Sonnet 4.5 | Decision framing, option presentation |
| manual-test-strategy | Claude Sonnet 4.5 | Test scenario reasoning |
| mcp-development | GPT-5.2-Codex | Protocol implementation code |
| performance-profiling | Claude Sonnet 4.5 | Bottleneck interpretation |
| refactoring | GPT-5.2-Codex | Code transformation, pattern application |
| sprint-management | GPT-5.4 | Structured planning, velocity calc |
| ux | Claude Sonnet 4.5 | Design feedback, accessibility |

### Lightweight Skills (Fast tier)

| Skill | Recommended Model | Rationale |
|-------|-------------------|-----------|
| create-instruction | GPT-5.4 mini | Template-based file generation |
| create-skill | GPT-5.4 mini | Scaffold from templates |

## Distribution Summary

| Model | Agents | Skills | Total |
|-------|--------|--------|-------|
| Claude Opus 4.7 | 5 | 4 | 9 |
| Claude Sonnet 4.5 | 15 | 13 | 28 |
| Claude Haiku 4.5 | 5 | 0 | 5 |
| GPT-5.5 | 4 | 2 | 6 |
| GPT-5.4 | 14 | 8 | 22 |
| GPT-5.4 mini | 4 | 2 | 6 |
| GPT-5.2-Codex | 6 | 6 | 12 |
| **Total** | **49** | **31** | **80** |

## Selection Heuristics

When choosing a model for a new agent or skill:

1. **Needs multi-step reasoning or architecture?** → Opus 4.7 or GPT-5.5
2. **Generates code as primary output?** → GPT-5.2-Codex
3. **Produces structured config/YAML/IaC?** → GPT-5.4
4. **Requires nuanced judgment (reviews, prose)?** → Sonnet 4.5
5. **High-volume, simple classification?** → Haiku 4.5 or GPT-5.4 mini
6. **Latency-critical (CI gates, triage)?** → Haiku 4.5

## Cost Optimization Notes

- **Batch non-urgent work** on fast-tier models where possible
- **Use reasoning models sparingly** — only when the task genuinely benefits
- **Fallback chains**: If Opus times out, retry on Sonnet (graceful degradation)
- **Cache model outputs** for repeated patterns (e.g., same triage rules)
- **Monitor token usage** per agent to spot over-provisioned model assignments
