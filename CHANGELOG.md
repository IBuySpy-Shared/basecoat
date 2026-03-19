# Changelog

All notable changes to this repository should be recorded in this file.

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
