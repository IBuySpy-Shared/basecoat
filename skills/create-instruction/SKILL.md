---
name: create-instruction
description: "Use when creating a new instruction file for a domain, language, or workflow. Covers frontmatter, applyTo patterns, naming, and writing practical guardrails."
license: MIT
compatibility: "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code."
metadata:
  category: meta
  keywords: "instruction, create, frontmatter, applyTo, workflow, guardrails"
  model-tier: standard
allowed-tools: "search/codebase read_file write_file"
---

# Create An Instruction

Use this skill when adding a new `*.instructions.md` file to the shared standards set.

## Workflow

1. Identify the domain and whether it should always apply or target specific file patterns.
2. Write frontmatter with a strong description and a deliberate `applyTo` glob.
3. Add practical expectations, not generic prose.
4. Include a short review lens to guide quality checks.
5. Validate that the instruction does not overlap confusingly with an existing one.
6. Update inventory or docs so the instruction can be found.

## Guardrails

- Avoid `applyTo: "**"` unless the instruction truly applies to nearly all work.
- Prefer concrete verbs such as validate, document, retry, pin, or secure.
- Keep the instruction focused on one problem space.

## Starter Assets

- Template: `templates/instruction.template.md`
