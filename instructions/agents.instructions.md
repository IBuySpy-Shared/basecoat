---
description: "Use when creating, updating, or reviewing agent definitions. Covers naming, structure, required sections, skill pairing, multi-agent coordination, model selection, and testing."
applyTo: "agents/**/*.agent.md"
---

# Agent Authoring Standards

Use this instruction as the definitive guide for creating, modifying, or reviewing any agent in the basecoat framework.

## File Naming

- All agent files live in the `agents/` directory at the repository root.
- Use **kebab-case** with the `.agent.md` suffix: `backend-dev.agent.md`, `security-analyst.agent.md`.
- The file name must match the `name` field in the YAML frontmatter.
- Choose names that describe the **role**, not the task: `release-manager` (role) over `cut-release` (task).

## YAML Frontmatter

Every agent file must start with a YAML frontmatter block containing these fields:

```yaml
---
name: kebab-case-agent-name
description: "One-sentence description of the agent's purpose. Start with the role noun and state when to invoke it."
tools: [read_file, write_file, list_dir, run_terminal_command, create_github_issue]
---
```

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | Must match the filename (without `.agent.md`). |
| `description` | Yes | One sentence. Begin with the role, end with trigger guidance ("Use when …"). |
| `tools` | Yes | Array of tool identifiers the agent needs. Follow least-privilege — include only tools the agent actually uses. |

## Required Sections Checklist

Every agent file must contain the following sections in order. Omitting a section is a review-blocking finding.

1. **Title** — H1 heading: `# <Role> Agent`.
2. **Purpose** — One to two sentences immediately below the title stating what the agent does and why it exists.
3. **Inputs** — Bulleted list of the information the agent expects before it begins work.
4. **Workflow** — Numbered step-by-step process. Each step starts with a bolded verb phrase. The final step must reference issue filing.
5. **Domain sections** — One or more H2 sections covering the agent's domain-specific standards, checklists, or reference tables (e.g., API Design Principles, OWASP Top 10 Review).
6. **GitHub Issue Filing** — Standard `gh issue create` template with labeled trigger conditions table. Agents must file issues inline — deferral is never acceptable.
7. **Model** — Recommended and minimum model with rationale (see Model Selection Guide below).
8. **Output Format** — What the agent delivers: code, reports, filed issues, or structured artifacts. Must include reference to issue numbers in deliverables.

## Agent-to-Skill Pairing

Each agent may have a companion skill directory under `skills/<agent-name>/` containing templates, checklists, and reference materials.

- The skill directory name **must** match the agent's `name` field (e.g., agent `backend-dev` pairs with `skills/backend-dev/`).
- If an agent references a template or checklist, it must exist in the paired skill directory. Do not reference files that do not exist.
- Shared resources used by multiple agents belong in a skill directory named after the domain, not a specific agent (e.g., `skills/security/` for security templates used by both `security-analyst` and `backend-dev`).
- When creating a new agent, create its skill directory at the same time if the agent references any templates or checklists.

## Multi-Agent Coordination

### Handoff Protocols

When agents collaborate on a shared workflow (e.g., PR review, feature delivery), follow these rules:

1. **Explicit tagging** — An agent hands off by @-mentioning the next agent in a review comment or output, stating the reason for handoff.
2. **Contract-first** — The agent that defines a shared interface (API contract, schema, message format) owns it. Other agents consume the contract and must not unilaterally change it.
3. **Conflict resolution** — When two agents disagree on a shared surface, the agent closest to the risk owns the decision: `security-analyst` for security, `performance-analyst` for performance, `backend-dev` for API contracts.
4. **No scope leakage** — Agents must not perform work outside their stated purpose. If a `frontend-dev` agent discovers a backend bug, it files an issue and tags `backend-dev` — it does not fix the backend code.
5. **Parallel by default** — Agents with non-overlapping scopes review and act in parallel. Sequential ordering is required only when one agent's output is a prerequisite for another.

### @-Mention Conventions

- Use the agent's `name` field as the handle: `@backend-dev`, `@security-analyst`.
- When tagging, include a one-line reason: `@security-analyst — this PR adds a new public endpoint that accepts user input; security review required.`
- Agents that are tagged must respond. Silence is not an acceptable acknowledgment.

## Model Selection Guide

Choose the model based on the agent's primary workload. Document the choice in the agent's **Model** section.

| Agent Role | Recommended Model | Minimum Model | Rationale |
|---|---|---|---|
| Code-heavy (backend-dev, frontend-dev, data-tier) | gpt-5.3-codex | gpt-5.4-mini | Code-optimized for implementation, refactoring, and test generation. |
| Analysis / review (security-analyst, code-review, performance-analyst) | gpt-5.3-codex | gpt-5.4-mini | Pattern recognition across large diffs and dependency trees. |
| Architecture / design (solution-architect, api-designer) | gpt-5.3-codex | gpt-5.4-mini | Broad reasoning for trade-off analysis and system design. |
| Planning / coordination (sprint-planner, release-manager) | gpt-5.4-mini | gpt-5.4-mini | Lower token demand; primarily structured output and list management. |

- Always state the **Recommended** model, the **Minimum** model, and a one-line **Rationale**.
- If a task requires extended context (e.g., reviewing an entire codebase), prefer models with larger context windows and note the requirement.

## Token Budget Management

Agents operate within finite context windows. Follow these rules to stay within budget:

- **Scope inputs narrowly.** Request only the files, diffs, or artifacts the agent needs — not the entire repository.
- **Summarize large inputs.** If an input exceeds 30 % of the model's context window, summarize or chunk it before passing it to the agent.
- **Structured output only.** Agents must return structured, concise output (Markdown tables, checklists, code blocks). Avoid prose-heavy responses.
- **Chunked workflows.** For large audits or reviews, split the work into file-group batches and process sequentially rather than loading everything at once.
- **Reference, don't inline.** When citing templates or checklists, reference the file path (`skills/security/owasp-checklist.md`) rather than inlining the full content.

## Testing and Validation

Before merging a new or modified agent, verify the following:

1. **Frontmatter valid** — YAML parses without errors. `name` matches filename. `description` is a single sentence. `tools` is a valid array.
2. **All required sections present** — Walk the Required Sections Checklist above. Every section exists and is non-empty.
3. **Skill references resolve** — Every template or checklist path referenced in the agent file exists on disk.
4. **Issue filing template works** — Copy the `gh issue create` block, substitute sample values, and confirm it produces a valid command.
5. **Workflow is executable** — Each numbered step is actionable and unambiguous. A different person (or agent) should be able to follow the workflow without external context.
6. **Model section complete** — Recommended model, minimum model, and rationale are all present.
7. **No orphaned agents** — If the agent replaces or deprecates an existing agent, the old file is removed and any references are updated.
8. **Dry-run the agent** — Execute the agent against a representative input and confirm it produces output matching the Output Format section.

## Versioning and Deprecation

- Agent files are versioned through Git history. There is no in-file version number.
- **Breaking changes** (renamed fields, removed sections, changed workflow steps) require a changelog entry and a notice in the PR description.
- **Deprecating an agent:** Add a `> [!WARNING] This agent is deprecated. Use <replacement-agent> instead.` callout at the top of the file, below the frontmatter. Keep the file for two sprints, then delete it.
- **Renaming an agent:** Create the new file, deprecate the old file, and update all cross-references (instructions, other agents, skill directories) in the same PR.
- When deleting an agent, also delete its paired skill directory if no other agent references those skills.

## Example: Well-Structured Agent

Below is a minimal but complete agent skeleton that satisfies all requirements:

```markdown
---
name: example-agent
description: "Example agent for demonstrating structure. Use when creating a new agent from scratch."
tools: [read_file, write_file, list_dir, run_terminal_command, create_github_issue]
---

# Example Agent

Purpose: demonstrate the required structure and conventions for a basecoat agent.

## Inputs

- Feature description or user story
- Relevant existing files or documentation

## Workflow

1. **Gather context** — read the inputs and identify the scope of work.
2. **Execute the task** — perform the domain-specific work.
3. **Validate output** — confirm the result meets acceptance criteria.
4. **File issues** — create GitHub Issues for any discovered problems.

## Domain Standards

- Domain-specific rules, checklists, or reference tables go here.

## GitHub Issue Filing

File a GitHub Issue immediately when problems are discovered.

| Finding | Labels |
|---|---|
| Discovered defect or debt | `tech-debt,example` |

## Model

**Recommended:** gpt-5.3-codex
**Rationale:** Code-optimized model suitable for implementation tasks.
**Minimum:** gpt-5.4-mini

## Output Format

- Deliver code or artifacts with inline comments.
- Reference filed issue numbers in output.
- Provide a summary of work completed and issues filed.
```

Use this skeleton as a starting point. Expand the Domain Standards section to match the agent's area of expertise. Refer to `agents/backend-dev.agent.md` and `agents/security-analyst.agent.md` for examples of fully fleshed-out agents.
