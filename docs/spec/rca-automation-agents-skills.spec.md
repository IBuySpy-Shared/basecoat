# Technical Specification: RCA Automation with Agents and Skills

## Context

The RCA process is now defined, but execution is still manual. We need an automation layer that drives RCA quality and completion using a purpose-built agent and skill.

## Scope

Design an RCA automation feature composed of:

1. An **RCA facilitator agent** that orchestrates RCA lifecycle steps
2. An **RCA skill** that enforces structure, debate quality, and action tracking
3. GitHub issue/label integration for incident-to-RCA flow
4. Verification and learning-export hooks to shared memory processes

## Out of Scope

1. Replacing human ownership/approval of incident decisions
2. Building a standalone incident management platform
3. Full remediation implementation by the RCA automation itself

## Debate: Options Considered

### Option A: Skill-only automation

- **Pros:** easier rollout, minimal orchestration complexity
- **Cons:** weak lifecycle control, no persistent RCA state machine

### Option B: Agent-only automation

- **Pros:** strong orchestration and ownership of multi-step workflows
- **Cons:** lower reusability of structured RCA reasoning blocks across contexts

### Option C: Agent + Skill composition (chosen)

- **Pros:** best separation of concerns; agent handles workflow orchestration, skill handles structured RCA reasoning/checklists
- **Cons:** higher initial implementation effort

## Decision

Choose **Option C**. Implement a composable architecture where an RCA facilitator agent invokes an RCA skill for standardized analysis and output quality gates.

## Architecture Overview

### RCA Facilitator Agent Responsibilities

1. Detect or receive RCA trigger events (label/workflow/manual dispatch)
2. Create/maintain RCA issue state
3. Drive lifecycle transitions (Investigate -> Debate -> Decide -> Actions -> Verify -> Close)
4. Validate that required fields are complete before each transition
5. Ensure linkage to corrective-action issues/PRs

### RCA Skill Responsibilities

1. Produce structured RCA sections from incident context
2. Generate evidence-backed hypothesis debate
3. Produce decision record with rejected alternatives and rationale
4. Output corrective-action checklist with owners and verification criteria
5. Emit memory-candidate entries for shared memory contribution

## Data Model and Storage Changes

No new external datastore required. Use GitHub-native artifacts:

1. RCA issue body as canonical state record
2. Labels for workflow state (`rca-required`, `rca-in-progress`, `rca-verified`, `learning`)
3. Linked issues/PRs for action items and implementation evidence

## API and Interface Contracts

1. **Agent trigger contract**
   - Inputs: incident issue URL/ID, failure context, trigger class
   - Output: updated RCA issue sections and state labels
2. **Skill contract**
   - Inputs: incident summary, timeline evidence, prior failures, constraints
   - Output: structured RCA markdown blocks
3. **Workflow contract**
   - Trigger by label or manual dispatch
   - Post status summary comments and transition checklist results

## Security and Privacy Considerations

1. Redact credentials and sensitive operational details in generated RCA content.
2. If security-sensitive, route details to private advisory path and keep public RCA abstracted.
3. Maintain explicit review gates for any automated closure action.

## Reliability and Failure Modes

Failure modes and mitigations:

1. **Hallucinated root cause** -> require evidence citations for accepted cause.
2. **Premature closure** -> enforce verification checklist and owner approvals.
3. **Action drift** -> block close when action items lack owner/state.
4. **Template bypass** -> agent re-opens and rehydrates missing sections.

## Implementation Plan

1. Create agent definition: `agents/rca-facilitator.agent.md`.
2. Create skill definition: `skills/rca/SKILL.md`.
3. Add RCA issue template fields in issue templates/forms.
4. Add workflow wiring for RCA triggers and status checks.
5. Add docs: `docs/operations/RCA_AUTOMATION.md` with runbook and examples.

## Testing Strategy

1. Unit-test structured output sections from the skill prompt scaffolding.
2. Integration-test agent lifecycle transitions with synthetic incidents.
3. Validate failure-path behavior (missing evidence, unresolved actions, security-sensitive cases).
4. Run one tabletop simulation from incident trigger to verified closure.

## Rollout, Migration, and Rollback Plan

1. Phase 1: advisory mode (agent comments only, no state enforcement).
2. Phase 2: enforcement mode for selected labels/workflows.
3. Phase 3: default RCA automation for all qualifying failures.
4. Rollback: disable workflow triggers and keep manual RCA process active.

## Observability and Operational Readiness

Track:

1. RCA issue completeness score at creation/update
2. Time in each RCA lifecycle state
3. Action closure rate before RCA close
4. Repeat-failure rate after RCA verification
5. Learning export success rate to shared memory

## Acceptance Criteria

1. RCA facilitator agent and RCA skill are both specified with clear boundaries.
2. Automated flow can take an incident from trigger to verified RCA draft.
3. Closure is blocked when required sections/evidence/actions are incomplete.
4. Learning candidates are generated in a format consumable by shared memory contribution.

## Risks and Mitigations

1. **Risk:** over-automation reduces critical thinking.
   - **Mitigation:** require explicit human decision sign-off.
2. **Risk:** high operational friction.
   - **Mitigation:** phased rollout and advisory-first mode.
3. **Risk:** noisy triggers.
   - **Mitigation:** strict trigger rules and deduplication window.

## Open Questions

1. Should RCA automation live in lock workflow style or standard workflow?
2. Which trigger event should be canonical (label, workflow_run failure, or manual dispatch)?
3. Do we enforce RCA completion before merge for high-risk fixes?

## References

1. `docs/spec/rca-failure-process.spec.md`
2. `docs/guides/prd-and-spec-guidance.md`
3. `docs/templates/ISSUE_TEMPLATE.md`
4. `docs/memory/PROCESS.md`
