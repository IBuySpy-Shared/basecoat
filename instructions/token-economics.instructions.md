---
description: "Use when selecting models, escalating reasoning cost, or loading context. Enforces cost-aware routing and token budget discipline for all agent work."
applyTo: "**/*"
---

# Token Economics

Use this instruction whenever choosing a model, deciding how much context to load, or escalating a task to a more expensive tier.

## Expectations

- Match model to task complexity. Do not use premium-tier models for routine automation, scanning, formatting, or simple repository operations.
- Do not use fast-tier models for architecture, security, or other decisions where mistakes are costly or hard to reverse.
- Treat token budget as cumulative session spend, not just the current prompt. Prefer approaches that finish the task with less total context and fewer retries.
- Load only the context needed for the current step. Start narrow, then expand only when the task justifies it.
- If a premium-tier model is required, state why the higher cost is justified and what tradeoff it avoids.
- Do not re-read files that are already in context unless the file changed or a missing section is genuinely needed.
- Do not load entire files when a targeted section, diff, symbol, or summary is sufficient.

## Model Tier Guidance

- **Premium** — Use for high-stakes, irreversible, or trust-without-second-opinion decisions such as architecture direction, security analysis, compliance interpretation, and major cross-system tradeoffs.
- **Reasoning** — Use for analysis, code review, research, test strategy, planning, and other work that needs structured judgment but not the highest-cost tier.
- **Code** — Use for implementation, refactoring, debugging, migration, and code generation tasks where code quality matters more than broad strategic reasoning.
- **Fast** — Use for routine automation, scanning, formatting, status checks, simple transformations, and other well-defined tasks with clear inputs and easy validation.

## Context Loading Discipline

Load context in this order:

1. Governing instructions and the immediate task
2. The exact files, symbols, or sections needed to act
3. Supporting docs, adjacent files, or history only if the task still cannot be completed
4. Broad repository context only as a last resort

Prefer targeted searches, line ranges, summaries, diffs, and handoffs before loading full files or large document sets.

## Cost Escalation

Before escalating to a premium-tier model, confirm that the task involves one or more of the following:

- irreversible or expensive decisions
- deep cross-file or cross-system reasoning
- security, compliance, or policy-sensitive analysis
- output that will be trusted with minimal human correction

When escalating, explicitly mention the tradeoff: higher cost is being accepted to reduce risk, avoid rework, or improve decision quality.

## Avoid Waste

- Reuse context already loaded in the session when it is still current.
- Prefer incremental reads over repeated full-file reads.
- Summarize large context before handing it to a higher-tier model.
- Break broad work into smaller steps when doing so reduces total token spend.
- Prefer the cheapest model tier that can complete the task reliably.

## References

- `docs/MODEL_OPTIMIZATION.md` — model tier matrix, overrides, and cost guidance
- `docs/token-optimization.md` — context window strategy, compression, caching, and token budget patterns

## Review Lens

- Is the chosen model tier the lowest-cost tier that can do the work reliably?
- Was context loaded in priority order rather than dumped all at once?
- Were already-loaded files reused instead of re-read?
- Were targeted sections used instead of whole-file reads where possible?
- If premium-tier reasoning was used, was the cost-quality tradeoff stated explicitly?
