# Token Optimization & Context Handling

Strategies for managing token budgets, compressing context, and handing off state between agents in a multi-agent system. Companion to [`MODEL_OPTIMIZATION.md`](MODEL_OPTIMIZATION.md) (model selection) and [`MULTI_AGENT_WORKFLOWS.md`](MULTI_AGENT_WORKFLOWS.md) (branch coordination).

> **Tracking:** Issue [#42](https://github.com/IBuySpy-Shared/basecoat/issues/42)

---

## 1. Context Window Management Strategies

Every model has a finite context window. Treating it as unlimited leads to degraded output quality, truncated responses, and wasted spend.

### Know Your Limits

| Model | Context Window | Effective Limit | Notes |
|-------|---------------|-----------------|-------|
| claude-opus-4.6 | 200K tokens | ~160K usable | Reserve 20% for output generation |
| claude-sonnet-4.6 | 200K tokens | ~160K usable | Same reservation applies |
| gpt-5.3-codex | 200K tokens | ~160K usable | Code-optimized; large inputs degrade non-code reasoning |
| claude-haiku-4.5 | 200K tokens | ~160K usable | Fast but quality drops sharply past ~80K input |
| gpt-5.4-mini | 128K tokens | ~100K usable | Budget model; keep inputs under 60K for reliable output |

**Rule of thumb:** Reserve 20% of the context window for output. If you need 40K tokens of output, you have 160K minus 40K = 120K for input.

### Layered Context Loading

Load context in priority order rather than dumping everything at once:

1. **System instructions** — governance rules, role definition (~1–2K tokens)
2. **Task-specific instructions** — the immediate objective (~0.5–1K tokens)
3. **Critical reference files** — only files the agent must read to complete the task
4. **Supporting context** — examples, history, related docs (load only if budget remains)

Stop loading when you reach 60% of the effective limit. The remaining 40% covers agent reasoning and output.

---

## 2. Token Budget Allocation per Agent Role

Align token budgets with the model tier from [`MODEL_OPTIMIZATION.md`](MODEL_OPTIMIZATION.md):

| Agent Role | Model Tier | Recommended Input Budget | Max Output Budget | Rationale |
|------------|-----------|--------------------------|-------------------|-----------|
| architect | Premium | 80K | 40K | Deep reasoning needs room for chain-of-thought |
| security_analyst | Premium | 80K | 40K | Must analyze full code paths without truncation |
| reviewer / code-review | Reasoning | 60K | 20K | Diffs + context; output is structured comments |
| researcher | Reasoning | 80K | 30K | May ingest large docs; output is synthesis |
| backend-dev / frontend-dev | Code | 60K | 40K | Code generation needs generous output budget |
| sprint-planner | Reasoning | 40K | 20K | Structured decomposition, not large inputs |
| merge-coordinator | Fast | 20K | 10K | Small diffs, merge commands, status checks |
| config-auditor / watchdog | Fast | 30K | 5K | Scan-and-report; output is a short checklist |

### Budget Enforcement Pattern

```javascript
function enforceTokenBudget(prompt, maxInputTokens) {
  const estimated = estimateTokens(prompt);
  if (estimated > maxInputTokens) {
    return compressContext(prompt, maxInputTokens);
  }
  return prompt;
}
```

---

## 3. Prompt Compression Techniques

When context exceeds the budget, compress — don't truncate blindly.

### 3.1 Summarization

Replace large blocks with concise summaries. Use a fast-tier model (Haiku) to generate summaries before passing them to a higher-tier model.

```
Before (2,400 tokens):
  Full git diff of 15 files with 200 changed lines

After (400 tokens):
  "Summary: 15 files changed across src/auth/ and src/api/.
   Key changes: JWT validation refactored, rate-limit middleware added,
   3 new API routes (/users, /sessions, /tokens). No deletions."
```

**Cost:** One Haiku summarization call (~0.02¢) can save 2,000 tokens on a Sonnet call (~0.6¢).

### 3.2 Selective Inclusion

Only include what the agent needs for its specific task:

| Agent Task | Include | Exclude |
|-----------|---------|---------|
| Code review | Changed files, diff hunks, test results | Unrelated source files, full history |
| Architecture | Interface definitions, dependency graph | Implementation bodies, test fixtures |
| Security scan | Auth code, input handling, config | UI components, styling, docs |
| Sprint planning | Issue list, velocity data, blockers | Source code, CI logs |

### 3.3 Truncation with Markers

When you must truncate, leave breadcrumbs so the agent knows context was removed:

```
[FILE: src/auth/jwt.ts — 340 lines, showing lines 1-50 and 280-340]
[TRUNCATED: lines 51-279 contain helper functions — request full file if needed]
```

### 3.4 Reference by Pointer

Instead of inlining large files, reference them:

```
For the full API schema, see: docs/api-schema.yaml (420 lines, ~8K tokens)
Key endpoints relevant to this task: POST /auth/login, DELETE /auth/session
```

---

## 4. Context Handoff Between Agents

When one agent's output becomes another agent's input, transfer only what matters.

### What to Pass

| Data | Pass? | Format |
|------|-------|--------|
| Task result / deliverable | ✅ Always | Full output |
| Decision rationale | ✅ Always | 2–3 sentence summary |
| Files created or modified | ✅ Always | File paths + brief description |
| Unresolved issues or blockers | ✅ Always | Structured list |
| Error messages encountered | ✅ If relevant | Exact error text |
| Full conversation history | ❌ Never | Summarize instead |
| Intermediate reasoning steps | ❌ Never | Only pass conclusions |
| Unchanged reference files | ❌ Never | Agent can load its own |

### Handoff Template

```markdown
## Agent Handoff: {source-role} → {target-role}

### Completed
- {what was done, 1-2 lines each}

### Artifacts
- `path/to/file.ts` — {what it contains}
- `path/to/test.ts` — {test coverage summary}

### Decisions Made
- {decision}: {rationale in one line}

### Open Items
- {anything the next agent must address}

### Context Files Needed
- {only files the next agent should load}
```

**Target size:** Handoff documents should be 500–1,500 tokens. If yours exceeds 2K tokens, compress further.

### Pipeline Example

```
Architect (Opus, ~80K input)
  → produces: design doc + handoff (1.2K tokens)

Backend-Dev (Codex, ~60K input)
  → receives: handoff + design doc + relevant source files
  → produces: implementation + handoff (800 tokens)

Reviewer (Sonnet, ~60K input)
  → receives: handoff + diff + test results
  → produces: review comments + approval/rejection
```

---

## 5. Caching Strategies for Repeated Context

Avoid re-reading and re-tokenizing the same content across agent invocations.

### System Prompt Caching

Most providers cache system prompts across calls with identical prefixes. Structure prompts so the stable prefix (governance rules, role definition) stays constant:

```
[CACHED — identical across all calls for this agent role]
  System instructions (governance.instructions.md)
  Role definition (agent .md file)

[VARIABLE — changes per invocation]
  Task-specific context
  File contents
  Conversation history
```

**Savings:** Anthropic's prompt caching charges ~10% of normal input cost for cached tokens. A 3K-token system prompt called 50 times saves ~135K billable tokens.

### Cross-Agent Shared Context

When multiple agents need the same reference (e.g., a project spec), load it once and pass a summary to subsequent agents rather than having each agent re-read the full document.

### Stale Context Invalidation

Cache keys should include:
- File content hash (not just path — files change)
- Branch name (context differs across branches)
- Timestamp with TTL (default: 15 minutes for active sprint work)

---

## 6. Measurement and Monitoring

### Token Usage Tracking

Track per-agent, per-invocation:

| Metric | How to Capture | Why It Matters |
|--------|---------------|----------------|
| Input tokens | Provider API response | Cost attribution |
| Output tokens | Provider API response | Cost attribution + quality signal |
| Cache hit tokens | Provider API response (if available) | Caching effectiveness |
| Context utilization | Input tokens ÷ effective window | Over 80% = risk of quality degradation |
| Compression ratio | Original tokens ÷ compressed tokens | Compression effectiveness |

### Cost Estimation Formula

```
Per-invocation cost =
  (input_tokens × input_price_per_1M / 1,000,000)
  + (output_tokens × output_price_per_1M / 1,000,000)
  - (cached_tokens × cache_discount_per_1M / 1,000,000)
```

### Sprint-Level Budget

Estimate total sprint token usage:

```
Sprint budget = Σ (agent_invocations × avg_tokens_per_invocation × cost_per_token)
```

Example for a 10-issue sprint:
- 10 planning calls (Sonnet, ~40K input, ~10K output) ≈ 500K tokens
- 30 implementation calls (Codex, ~60K input, ~30K output) ≈ 2.7M tokens
- 20 review calls (Sonnet, ~40K input, ~10K output) ≈ 1M tokens
- 40 automation calls (Haiku, ~20K input, ~5K output) ≈ 1M tokens
- **Total: ~5.2M tokens per sprint**

### Alerts

Set thresholds to catch runaway usage:
- Single invocation exceeds 150K input tokens → warn
- Agent role exceeds 2× its average daily usage → investigate
- Sprint total exceeds budget by 20% → pause and review

---

## 7. Instruction File Sizing

Instruction files (`.instructions.md`, `.agent.md`) are loaded into every invocation. Oversized instructions waste budget on every call.

| File Type | Target Size | Max Size | Tokens (est.) |
|-----------|-------------|----------|---------------|
| `.instructions.md` | 1–3 KB | 5 KB | ~500–1,500 |
| `.agent.md` | 2–4 KB | 6 KB | ~800–2,000 |
| Governance instructions | 3–5 KB | 8 KB | ~1,200–2,500 |

### Sizing Guidelines

- **One concern per file.** Split multi-topic instructions into separate files.
- **Link, don't inline.** Reference detailed docs by path instead of copying content.
- **Prune examples.** One good example beats three redundant ones.
- **Audit quarterly.** Remove outdated rules that no longer apply.

---

## 8. Practical Examples with Token Counts

### Example A: Code Review — Well-Optimized

```
System prompt (governance + reviewer role):     1,800 tokens
Task instructions:                                 400 tokens
Diff (3 files, 120 lines changed):              2,200 tokens
Test results summary:                              300 tokens
───────────────────────────────────────────────
Total input:                                     4,700 tokens
Output (review comments):                        1,200 tokens
Model: claude-sonnet-4.6
Estimated cost:                                   ~$0.02
```

### Example B: Code Review — Unoptimized

```
System prompt (full governance + all instructions): 4,500 tokens
Full conversation history (15 turns):              12,000 tokens
All source files in the repo:                      45,000 tokens
Full CI log output:                                 8,000 tokens
───────────────────────────────────────────────
Total input:                                      69,500 tokens
Output (same review comments):                     1,200 tokens
Model: claude-sonnet-4.6
Estimated cost:                                    ~$0.23
```

**Savings: 91% cost reduction** by loading only what the agent needs.

### Example C: Architect → Backend-Dev Handoff

```
Architect output (full):                          8,000 tokens
Handoff document (compressed):                    1,200 tokens
Backend-dev loads: handoff + 3 source files:      6,400 tokens
───────────────────────────────────────────────
Backend-dev total input:                          7,600 tokens
Without handoff (re-reads everything):           35,000 tokens
Savings:                                            78%
```

---

## Related References

- [`MODEL_OPTIMIZATION.md`](MODEL_OPTIMIZATION.md) — Model tier matrix and cost considerations
- [`MULTI_AGENT_WORKFLOWS.md`](MULTI_AGENT_WORKFLOWS.md) — Branch coordination for parallel agents
- [`instructions/governance.instructions.md`](/instructions/governance.instructions.md) — Section 10: Token and Model Awareness
- Issue [#42](https://github.com/IBuySpy-Shared/basecoat/issues/42) — Tracking issue for token optimization
- Issue [#44](https://github.com/IBuySpy-Shared/basecoat/issues/44) — Token budget and cost attribution
