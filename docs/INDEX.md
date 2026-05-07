# Base Coat Documentation Index

> A complete map of all documentation in this repository.
> For asset inventory, see [INVENTORY.md](../INVENTORY.md).

## Core Framework

- [README.md](../README.md) — Getting started, installation, and overview
- [INVENTORY.md](../INVENTORY.md) — Full asset listing (agents, skills, instructions, prompts)
- [CHANGELOG.md](../CHANGELOG.md) — Release history
- [GOVERNANCE.md](GOVERNANCE.md) — Contribution policies and review standards
- [RELEASE_PROCESS.md](RELEASE_PROCESS.md) — How releases are cut and published
- [DISTRIBUTION.md](DISTRIBUTION.md) — Sync mechanism for consumer repos
- [HOOKS.md](HOOKS.md) — Git hooks and pre-commit validation

## Agent & Skill Ecosystem

- [AGENT_SKILL_MAP.md](AGENT_SKILL_MAP.md) — Agent-to-skill dependency map
- [AGENT_RUNTIME_ENFORCEMENT.md](AGENT_RUNTIME_ENFORCEMENT.md) — Runtime enforcement rules
- [AGENT_TELEMETRY.md](AGENT_TELEMETRY.md) — Telemetry and adoption metrics
- [AGENT_TESTING.md](AGENT_TESTING.md) — Agent testing strategy
- [AGENT_TESTING_HARNESS.md](AGENT_TESTING_HARNESS.md) — Test harness implementation
- [agent-handoffs.md](agent-handoffs.md) — Agent handoff protocols
- [MULTI_AGENT_WORKFLOWS.md](MULTI_AGENT_WORKFLOWS.md) — Multi-agent orchestration patterns
- [multi-agent-orchestration-patterns.md](multi-agent-orchestration-patterns.md) — LangGraph patterns
- [PROMPT_REGISTRY.md](PROMPT_REGISTRY.md) — Prompt catalog and registry
- [ASSET_REGISTRY.md](ASSET_REGISTRY.md) — Asset registry metadata

## Enterprise Guidance

- [ENTERPRISE_DOTNET_GUIDANCE.md](ENTERPRISE_DOTNET_GUIDANCE.md) — .NET modernization patterns
- [ENTERPRISE_IDENTITY_ACCESS.md](ENTERPRISE_IDENTITY_ACCESS.md) — Identity & access patterns
- [ENTERPRISE_KUBERNETES_PATTERNS.md](ENTERPRISE_KUBERNETES_PATTERNS.md) — AKS / K8s guidance
- [ENTERPRISE_RUNNERS.md](ENTERPRISE_RUNNERS.md) — Self-hosted runner setup
- [ENTERPRISE_SECURITY_HARDENING.md](ENTERPRISE_SECURITY_HARDENING.md) — Security hardening guide
- [enterprise-rollout.md](enterprise-rollout.md) — Enterprise rollout playbook
- [enterprise-setup.md](enterprise-setup.md) — Initial enterprise setup
- [repo-template-standard.md](repo-template-standard.md) — Repo template standards

## Architecture & AI Patterns

- [AI_ARCHITECTURE_PATTERNS.md](AI_ARCHITECTURE_PATTERNS.md) — AI system design patterns
- [RAG_PATTERNS.md](RAG_PATTERNS.md) — Retrieval-Augmented Generation patterns
- [LOCAL_MODELS.md](LOCAL_MODELS.md) — Local LLM deployment
- [LOCAL_EMBEDDINGS.md](LOCAL_EMBEDDINGS.md) — Local embeddings configuration
- [OFFLINE_AGENT_STACK.md](OFFLINE_AGENT_STACK.md) — Offline / air-gapped agent stack
- [MODEL_OPTIMIZATION.md](MODEL_OPTIMIZATION.md) — Model routing and optimization
- [token-optimization.md](token-optimization.md) — Token usage optimization
- [rate-limit-guidance.md](rate-limit-guidance.md) — Rate limit handling
- [SQLITE_MEMORY.md](SQLITE_MEMORY.md) — SQLite cross-session memory layer
- [pydantic-mcp-integration.md](pydantic-mcp-integration.md) — Pydantic + MCP integration
- [pydantic-validation-strategy.md](pydantic-validation-strategy.md) — Validation strategy
- [pydantic-typescript-client-generation.md](pydantic-typescript-client-generation.md) — Client generation

## MCP Server

- [mcp-deployment.md](mcp-deployment.md) — Deploying the Base Coat MCP server (Docker / ACA)

## Governance & Process

- [LABEL_TAXONOMY.md](LABEL_TAXONOMY.md) — GitHub label taxonomy
- [SCOPED_INSTRUCTIONS.md](SCOPED_INSTRUCTIONS.md) — Scoped instruction authoring guide
- [prd-and-spec-guidance.md](prd-and-spec-guidance.md) — PRD and spec gate guidance
- [RELEASE_METRICS.md](RELEASE_METRICS.md) — Release metrics and KPIs
- [TELEMETRY_ADOPTION.md](TELEMETRY_ADOPTION.md) — Adoption telemetry guide
- [GOALS.md](GOALS.md) — Project goals and OKRs
- [BLOCKED_ISSUES.md](BLOCKED_ISSUES.md) — Blocked issues tracking

## Security & Operations

- [OPERATIONAL_RUNBOOK.md](OPERATIONAL_RUNBOOK.md) — Runbook for common operations
- [DISASTER_RECOVERY.md](DISASTER_RECOVERY.md) — DR procedures
- [COST_OPTIMIZATION.md](COST_OPTIMIZATION.md) — Cost analysis and optimization
- [RBAC_ONLY_AUTHENTICATION_PATTERNS.md](RBAC_ONLY_AUTHENTICATION_PATTERNS.md) — RBAC auth patterns
- [APPLICATION_GATEWAY_ROUTING_GUIDANCE.md](APPLICATION_GATEWAY_ROUTING_GUIDANCE.md) — App Gateway routing

## .NET & Platform Guidance

- [DOTNET_DECISION_TREE.md](DOTNET_DECISION_TREE.md) — .NET version decision tree
- [DOTNET_MODERNIZATION.md](DOTNET_MODERNIZATION.md) — Modernization guide
- [AZURE_SQL_MIGRATION_GUIDANCE.md](AZURE_SQL_MIGRATION_GUIDANCE.md) — Azure SQL migration
- [WINDOWS_SERVER_AZURE_GUIDANCE.md](WINDOWS_SERVER_AZURE_GUIDANCE.md) — Windows Server on Azure
- [app-inventory.md](app-inventory.md) — Application inventory template
- [untools-integration.md](untools-integration.md) — UnTools integration guide

## Cleanup & Audit Reports

- [CLEANUP_AUDIT_INDEX.md](CLEANUP_AUDIT_INDEX.md) — Audit index
- [CLEANUP_AUDIT_SUMMARY.md](CLEANUP_AUDIT_SUMMARY.md) — Audit summary
- [CLEANUP_REPORT.md](CLEANUP_REPORT.md) — Cleanup findings report
- [INFRASTRUCTURE_DELIVERY_SUMMARY.md](INFRASTRUCTURE_DELIVERY_SUMMARY.md) — Infrastructure delivery summary
- [treatment-matrix.md](treatment-matrix.md) — Issue treatment matrix

## Portal (Solution-Specific)

> These documents cover the Basecoat Portal project and are not part of the core framework sync.

- [docs/portal/](portal/) — All portal design, API, IAM, accessibility, and security docs
- [docs/PORTAL_INDEX.md](PORTAL_INDEX.md) — Portal infrastructure documentation index
- [docs/wireframes/](wireframes/) — Excalidraw wireframe files
- [portal/prompts/](../portal/prompts/) — Portal-specific prompt templates

## Wave 3 Delivery Summaries

- [WAVE3_DAY1_SUMMARY.md](WAVE3_DAY1_SUMMARY.md) — Wave 3 Day 1 summary
- [concurrency-phase2.md](concurrency-phase2.md) — Concurrency Phase 2 design

## CLI Reference

- [CLI_COMMAND_REFERENCE.md](CLI_COMMAND_REFERENCE.md) — `/basecoat` CLI command reference

## Documentation Scaffolds

- [documentation-heading-scaffolds.md](documentation-heading-scaffolds.md) — Heading template scaffolds
- [CONFIG_PATTERN.md](CONFIG_PATTERN.md) — Configuration pattern reference
