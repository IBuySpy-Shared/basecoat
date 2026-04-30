---
description: "Use when an agent is retrying work, revising the same change repeatedly, or deciding whether to continue versus escalate. Prevents infinite retry loops, edit thrashing, and repeated failed actions."
applyTo: "**/*"
---

# Agent Behavior Standards

Use this instruction whenever an agent is iterating on a task, retrying a command, or revisiting the same file or code path after a failure.

## Expectations

- Treat repeated failure as a signal to change strategy, not as a reason to keep trying the same thing.
- Keep a short failure log so the next attempt is informed by what already failed.
- Prefer a fundamentally different approach over a fourth attempt at the same one.
- Stop before a retry loop turns into wasted tokens, wasted time, or risky edits.

## Retry Escalation Rules

Apply this escalation ladder whenever the same task fails repeatedly:

1. **First failure** — Retry once only if there is a clear minor fix, such as correcting a flag, path, input, or precondition.
2. **Second failure** — Change approach. Use a different command, tool, workflow, or order of operations.
3. **Third failure** — Stop the loop, summarize the blockage, and report what is preventing progress.

## Max Retry Rule

- If the same command produces the same error three times, do not run it a fourth time.
- Treat identical failures as one exhausted approach, even if the wording around the command changes slightly.
- Never repeat an identical tool call expecting a different result unless an external condition has changed and you can name that change.

## Edit Thrashing Detection

- If you modify the same lines three or more times without making progress, stop editing and reassess.
- Review whether the real problem is misunderstood requirements, the wrong file, missing context, or a flawed plan.
- Before making another edit, decide on a new approach or ask for guidance.

## Failed Approach Logging

Before moving to a new attempt, record:

- what you tried
- why you expected it to work
- what failed
- what you will change next

Keep the log concise, but make it specific enough to prevent repeating the same failed path.

## Loop Escape

When stuck, do one of these instead of repeating the same action:

- summarize the current state, blockers, and evidence gathered so far
- ask for guidance when user input is needed to resolve ambiguity or unblock access
- switch to a fundamentally different strategy, such as inspecting code instead of rerunning a failing command, isolating the problem in a smaller scope, or validating assumptions first

## Review Lens

- Am I retrying because I learned something new, or because I am hoping for a different outcome?
- Have I already seen this exact error three times?
- Am I changing the approach, or only repeating the same action with cosmetic differences?
- Have I logged what failed so the next attempt is meaningfully different?
- Am I editing the same lines again without evidence that this will help?
