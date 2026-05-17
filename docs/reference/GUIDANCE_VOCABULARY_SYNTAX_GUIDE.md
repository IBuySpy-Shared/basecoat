# Guidance Vocabulary and Syntax Guide

This guide defines a shared language for BaseCoat assets so users can predict how agents, skills, instructions, and prompts behave before opening each file.

## Taxonomy (What each asset is for)

| Asset | Primary job | Scope |
|---|---|---|
| Agent (`agents/*.agent.md`) | Multi-step execution workflow | End-to-end task orchestration |
| Skill (`skills/*/SKILL.md`) | Reusable method or recipe | Focused capability and templates |
| Instruction (`instructions/*.instructions.md`) | Behavioral guardrail | Cross-cutting policy and standards |
| Prompt (`prompts/*.prompt.md`) | Fast entry point | User kickoff and intent shaping |

## Ontology (How concepts relate)

- **Intent**: user objective (for example, "close sprint", "triage broken build")
- **Capability**: reusable action pattern (skill)
- **Executor**: orchestrated operator (agent)
- **Constraint**: non-negotiable behavior rule (instruction)
- **Trigger phrase**: routing signal in descriptions (`USE FOR` / `DO NOT USE FOR`)

Relationship model:

1. Prompt captures intent.
2. Agent executes intent.
3. Agent invokes one or more skills.
4. Instructions constrain all outputs.

## Vocabulary Standard

Use consistent verbs and nouns:

- **Use** "triage", "classify", "validate", "escalate", "handoff", "closeout"
- **Avoid** ambiguous verbs like "handle", "deal with", "manage stuff"
- Prefer one canonical term per concept:
  - "closeout" (not mixed with "shutdown", "wrap-up", "finalization")
  - "burndown" (not mixed with "burn down charting" unless chart-specific)
  - "handoff" (not mixed with "transfer" for same behavior)

## Voice and Tone

- Start descriptions with **"Use when..."**
- Include **USE FOR** and **DO NOT USE FOR** trigger phrases in frontmatter descriptions.
- Use direct, procedural language:
  - "Do X, then Y"
  - "Escalate when Z"
- Avoid promotional language and vague claims.

## Syntax and Structure Rules

### Agent files

- Required top-level frontmatter fields:
  - `name`, `description`, `compatibility`, `metadata`, `allowed-tools`
- Strongly recommended:
  - `model`, `allowed_skills`, `task_phase`, `interaction_type`, `invocation_rules`, `visibility`
- Required body sections:
  - `## Inputs`, `## Workflow` (or `## Process`), `## Output` (or `## Results`)

### Skill files

- Required top-level frontmatter fields:
  - `name`, `description`, `compatibility`, `metadata`, `allowed-tools`
- Recommended:
  - `invocation_rules`, `visibility`
- Required companion file:
  - `eval.yaml` with 3 positive + 2 negative routing scenarios

### Markdown conventions

- Use `##` headings (no bold-as-heading lines)
- Keep tables for dense reference data
- Keep examples concrete and copy-paste friendly

### HTML companion artifact policy

Use HTML only when the content is spatial or interactive and markdown materially reduces clarity.

- Allowed examples: annotated diff viewers, dependency maps, sprint/release dashboards, interactive explainers.
- Do not replace the source-of-truth markdown workflow docs with HTML-only content.
- Every committed HTML artifact must have an adjacent text source (`.md`, `.yaml`, or `.json`) and an export path back to text.
- Treat HTML as a companion view, not the canonical governance record.

## Consistency rollout plan

1. Audit frontmatter semantics across agents and skills.
2. Normalize terms and triggers in descriptions.
3. Add missing invocation and visibility semantics.
4. Re-run routing eval coverage and quality audits.
5. Track drift with CI checks and periodic reports.
