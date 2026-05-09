---
description: "Use when deciding which agent tier to invoke for a task. Provides cost-aware, security-conscious agent routing to avoid mismatches between task requirements and agent capabilities."
applyTo: "**/*"
---

# Agent-Tier Routing for Copilot Workflows

Route every task to the appropriate agent tier before dispatching. Tier selection affects
cost, latency, security posture, and session stability.

## Agent Tier Map

| Tier | Invocation | Scope | Best For |
|------|-----------|-------|----------|
| **Cloud Agent** | GitHub issue `/approve` | Async, repo-scoped | Long tasks, PR gates, compliance scans, irreversible ops |
| **CLI Fleet** | Background agents in session | Session-parallel | Fan-out of Γëñ5 independent subtasks, sprint execution |
| **CLI Main** | Main conversation | Interactive, high-reasoning | Planning, design debate, iterative debugging |
| **Local LLM** | Ollama / LM Studio | On-device, no egress | PII, secrets, regulated data, air-gapped environments |

## Enforced Rules (Non-Negotiable)

These rules override all other routing signals:

- **PII, secrets, or regulated data** ΓåÆ Local LLM only. No cloud egress permitted.
- **Irreversible operations** (force push, bulk delete, production deploy) ΓåÆ Cloud Agent only. A PR gate is required before execution.
- **Regulated or air-gapped environments** ΓåÆ Local LLM only. No external network calls.

## Routing Decision Matrix

Use the first matching row:

| Signal | Tier |
|--------|------|
| Security audit / compliance scan | Cloud Agent |
| Parallel independent subtasks (Γëñ5) | CLI Fleet |
| Interactive design debate / planning | CLI Main |
| Long async task, no session dependency | Cloud Agent |
| High-frequency, low-stakes edits | Local LLM |
| Sprint execution with phase dependencies | CLI Fleet |
| PR review / code analysis | Cloud Agent |
| Iterative debugging with immediate feedback | CLI Main |

When multiple rows match, apply the enforced rules first, then prefer the tier with the
lowest cost that satisfies the latency and security requirements.

## Tier Capabilities and Constraints

### Cloud Agent (Copilot Coding Agent)

- Triggered by posting `/approve` on a GitHub issue (see repository conventions).
- Runs asynchronously; does not require an open session.
- Has access to the full repository via a checked-out workspace.
- PR gate is mandatory for irreversible operations ΓÇö the agent opens a PR, a human merges.
- Not suitable for tasks that require back-and-forth interaction.

### CLI Fleet (Background Agents)

- Launched as parallel `task` sub-agents from the main conversation.
- Cap at **2–3 concurrent general-purpose agents** (enterprise quota limit). See [Fleet Parallelism Limits](#fleet-parallelism-limits).
- Each agent is stateless ΓÇö provide complete context in the dispatch prompt.
- Use for workloads that decompose into independent, bounded subtasks.
- Coordinate phase dependencies in the main conversation; fleet agents do not coordinate with each other.

### CLI Main Conversation

- The primary interactive surface ΓÇö high-reasoning, conversational, human-in-the-loop.
- Use for tasks that require judgment calls, ambiguity resolution, or iterative refinement.
- **Session timeout risk after ~15 minutes of inactivity** ΓÇö do not use for long-running unattended tasks.
- Dispatches fleet agents and interprets their results; it is the orchestration layer.

### Local LLM (Ollama / LM Studio)

- Runs fully on-device with zero data egress.
- Mandatory for any input containing PII, credentials, or data governed by compliance policy.
- Lower reasoning capability than cloud models ΓÇö scope tasks accordingly.
- No tool access beyond what the local runtime provides.

## Fleet Dispatch Patterns

### Pattern 1: Fan-out independent subtasks

```text
task(agent_type: "general-purpose", model: "claude-haiku-4.5",
     prompt: "Implement <bounded subtask A> in <file>. Context: ...")
task(agent_type: "general-purpose", model: "claude-haiku-4.5",
     prompt: "Implement <bounded subtask B> in <file>. Context: ...")
```

Dispatch all independent agents in **one turn** to avoid paying orchestration overhead
for each launch.

### Pattern 2: Phase-gated sprint

```text
Phase 1 ΓåÆ dispatch fleet agents for independent tasks
Phase 2 ΓåÆ collect results in CLI Main, resolve conflicts
Phase 3 ΓåÆ dispatch Cloud Agent via /approve for final PR merge
```

### Pattern 3: Escalate to Cloud Agent after local draft

```text
1. Draft and iterate with CLI Main or Local LLM
2. Push branch
3. Post /approve on tracking issue ΓåÆ Cloud Agent opens or updates PR
```


## Fleet Parallelism Limits

Each background general-purpose agent consumes model API capacity continuously for its
entire lifetime. Running too many concurrently saturates the enterprise quota and causes
HTTP 429 `user_global_rate_limited` errors across the entire session.

**Hard limits:**

- Maximum **2–3 concurrent background general-purpose agents** at any time (enterprise quota limit).
- Long-running agents (deploys, workflow triggers, builds > 5 minutes): dispatch **alone or in pairs**.
- Short tasks (PR merges, file edits, lint fixes): prefer **Haiku / fast model** to reduce token burn and quota pressure.

**Wave batching pattern:**

Dispatch work in waves. Wait for wave N to complete before launching wave N+1:

```text
Wave 1: dispatch agents A, B, C → wait for all three to complete
Wave 2: dispatch agents D, E, F → wait for all three to complete
Wave 3: dispatch agents G, H, I → wait for completion
```

Do not launch wave N+1 until wave N is fully complete. Staggering launches does not
reduce quota pressure — in-flight agents are billed from dispatch to completion.

**429 recovery:**

If a `user_global_rate_limited` (HTTP 429) error is returned:

1. Wait **60 seconds** before retrying.
2. Retry only the **failed agent(s)** — do not re-dispatch the entire wave.
3. Reduce wave size for subsequent waves if 429 errors recur.

**Model preference by task type:**

| Task type | Recommended model |
|---|---|
| PR merge, file edit, lint fix | `claude-haiku-4.5` (fast tier) |
| Code generation, refactoring | `claude-sonnet-4.5` |
| Architecture, complex reasoning | `claude-opus-4.5` |
| Deploy, build, workflow trigger | Dispatch alone; any model |

The `max_fleet_agents` key in `.github/base-coat/agent-routing.json` configures the
per-session fleet ceiling (default: 4).
## Anti-Patterns

| Anti-Pattern | Risk | Fix |
|---|---|---|
| Dispatch 4+ fleet agents simultaneously | Enterprise 429 rate limit | Cap at 2–3; use wave batching |
| Send PII or proprietary code to cloud agents | Data egress violation | Route to Local LLM |
| Use CLI Main for tasks > 15 minutes | Session timeout loses progress | Delegate to Cloud Agent or CLI Fleet |
| Use Cloud Agent for interactive back-and-forth | Agent cannot respond in real time | Use CLI Main |
| Omit PR gate for irreversible operations | Unreviewed destructive change | Always require PR for force push / bulk delete / deploy |

## Related Routing Guidance

- [Model Routing](model-routing.instructions.md) ΓÇö which LLM tier (Opus / Sonnet / Haiku) within a chosen agent
- [Runner Routing](../docs/reference/guardrails/runner-routing.md) ΓÇö which CI runner for GitHub Actions jobs
- [Context Routing](references/token-economics/context-routing.md) ΓÇö which context tiers to load before dispatching
