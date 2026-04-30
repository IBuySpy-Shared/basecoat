---
description: "Base Coat repository context and conventions for GitHub Copilot"
applyTo: "**/*"
---

# Base Coat — Copilot Repository Context

Base Coat is an enterprise shared library of GitHub Copilot customization assets
including agents, skills, instruction files, prompt templates, and documentation.

## Repository Conventions

- **Agents**: Flat files at `agents/<name>.agent.md` with YAML frontmatter (name, description)
- **Instructions**: Files at `instructions/<name>.instructions.md` with frontmatter (description, applyTo)
- **Skills**: Directories at `skills/<name>/` containing SKILL.md with frontmatter
- **Prompts**: Files at `prompts/<name>.prompt.md` with YAML frontmatter
- **Docs**: Markdown files in `docs/` — no frontmatter required

## Markdown Standards

- Use `##` headings, never bold-as-heading (MD036)
- Blank lines before/after code fences (MD031)
- Files end with single newline (MD047)
- No trailing spaces, consistent list markers

## Branch and Commit Conventions

- Branches: `<type>/<issue-number>-<short-description>`
- Commits: `<type>(<scope>): <summary>` (conventional commits)
- Always include `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>` trailer

## Testing

- Structure validation: `pwsh scripts/validate-basecoat.ps1`
- Full test suite: `pwsh tests/run-tests.ps1`
