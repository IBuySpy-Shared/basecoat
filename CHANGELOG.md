# Changelog

All notable changes to this repository should be recorded in this file.

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
