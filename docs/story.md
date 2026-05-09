# The Story of BaseCoat

How a simple idea — *what if teams could share Copilot customizations the way they share
linting configs?* — became an enterprise framework with 200+ assets, automated quality
gates, a fleet execution model, and a live metrics dashboard.

---

## Origin (March 2026)

BaseCoat began as a modest scaffold: sync scripts for PowerShell and Bash, a handful of
instruction files, and a version file. The core insight was already present in v0.1.0 —
separate **instructions** (ambient rules) from **agents** (workflows) from **skills**
(knowledge packs). That separation is still the foundation today.

The name comes from the idea of applying a base coat before the custom work goes on top:
a shared standard that every developer inherits, without anyone having to configure it
manually.

---

## How the Guidance Was Developed

### Sprints 1–3: Build by doing

Each asset started life as a real need. The `backend-dev` agent didn't exist because
someone designed it on a whiteboard — it was written because a dev needed a consistent
API scaffolding workflow. The `governance.instructions.md` was written because security
rules were being duplicated across 12 agent files.

The rule from the start: **no asset without a use case**. Every agent, skill, and
instruction in BaseCoat was written to solve a problem that had already surfaced.

### The agent + skill + instruction pattern

Sprint 2 established the pattern that every subsequent agent follows:

```
agent file       → defines who does the work and the workflow
paired skill     → provides templates and reference material
ambient instructions → enforce cross-cutting standards regardless of agent
```

This was tested empirically: agents without paired skills produced inconsistent output.
Agents without ambient instructions duplicated security rules and missed governance
standards. The three-part pattern eliminated both failure modes.

### Quality gates (v1.0.0+)

From v1.0.0, every PR runs `validate-basecoat.ps1`:

- Required frontmatter fields (`name`, `description`, `applyTo`)
- `## Inputs`, `## Workflow`, and an output section for every agent
- `## Process` and output section for every skill
- Average asset score ≥ 5.0/10; no asset scoring 0

These gates caught real regressions. In the period between v0.7.0 and v1.0.0, 23 assets
failed the quality gate before they shipped — and were improved before merge.

---

## How Guidance Was Tested

### CI as the test harness

The primary test vehicle is `tests/run-tests.ps1`, which runs on every PR:

| Test | What it checks |
|---|---|
| Frontmatter validation | Required fields, correct format |
| Agent structure | Inputs, Workflow, Output sections |
| Skill structure | Process section, SKILL.md presence |
| Coherence check | Scope overlap, orphaned files |
| Markdown lint | MD036, MD031, MD040, MD047 |

### Sprint retros as the feedback loop

Every sprint included a retro pass — issues opened for any guidance that produced
unexpected output, any instruction that conflicted with another, or any agent that
stalled on a real task.

The `detect-repeat-fixes.ps1` script identifies patterns where the same type of fix
is applied more than twice. When that happens, it's evidence that a rule is missing or
unclear — and a new instruction or agent update follows.

### Real session data

Instructions like `token-economics`, `session-hygiene`, and `agent-routing` were
written specifically because patterns appeared in real Copilot sessions — sessions
where context was exhausted prematurely, or where 6 agents were dispatched when 2
would have done the job. The guidance was drafted, tested in a session, and revised
based on what actually changed behavior.

---

## How Guidance Was Hardened

### The impeccable audit cycle

Periodically the docs site undergoes a design quality audit using the `teach-impeccable`
skill. This surfaces UX issues in the public-facing documentation — broken links, missing
navigation, visual inconsistencies. Issues from these audits are filed and resolved in
dedicated PRs.

### The coherence check

`scripts/check-coherence.ps1` detects when two instructions have identical `applyTo`
scope, when skills are listed in `allowed_skills` but don't exist, and when agents
reference instructions that don't exist. This has caught ~30 latent consistency issues
across major version bumps.

### Rate limit hardening

Sprint 24 hit enterprise Copilot rate limits from over-aggressive fleet dispatch.
The failure produced `docs/guides/rate-limit-guidance.md` — a documented standard
for concurrency limits (3 safe, 4 risky, 5+ = 429), wave patterns, and recovery
procedures. The agent-routing configuration was updated to enforce these limits by
default.

### ADR-driven decisions

Contested decisions are captured as Architecture Decision Records. The first,
[ADR-001](architecture/decisions/adr-001-naming-convention.md), documented why
`basecoat` (repo name), `BaseCoat` (product name), and `base-coat` (artifact name)
coexist — a question that came up in every consumer onboarding conversation.

---

## Version History at a Glance

| Version range | Theme | Key additions |
|---|---|---|
| v0.1–v0.4 | Scaffold | Sync scripts, initial assets, CI, packaging |
| v0.5–v0.9 | Agent explosion | 28 agents across all disciplines |
| v1.0–v1.9 | Quality gates | Validation CI, coherence checks, scoring |
| v2.0–v2.9 | Router + metadata | `/basecoat` router, `basecoat-metadata.json` |
| v3.0–v3.25 | Enterprise scale | Fleet dispatch, memory system, 200+ assets, GH Pages |

The full changelog is at [Changelog](changelog.md).
The detailed narrative through v2.1.0 is preserved in the
[project archive](https://github.com/IBuySpy-Shared/basecoat/blob/main/docs/archive/repo_history/2026-05-01-story-of-basecoat.md).

---

## Principles That Emerged

These weren't designed up front. They appeared through iteration:

1. **No asset without a use case** — Every file in BaseCoat solves a problem that surfaced in a real session.
2. **Gate before ship** — Validation CI catches regressions before they reach consumers.
3. **Retro before retire** — Repeated failures become documentation, not just closed issues.
4. **One router, many specialists** — Users shouldn't need to memorize asset names; the router handles discovery.
5. **Foundation, not framework** — BaseCoat sets the floor, not the ceiling. Consumer customization is expected.
