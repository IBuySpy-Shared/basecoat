# Technical Specification: RCA Failure Process

## Context

Failure handling today is inconsistent across incidents, failed automations, and repeated hot-fix chains. We need a standard RCA process that is lightweight enough for weekly use and strict enough to prevent repeated failures.

## Scope

Define and adopt a repository-level RCA process that covers:

1. Triggering RCA for qualifying failures
2. Debate and decision capture for competing root-cause hypotheses and fixes
3. Required design and implementation artifacts
4. Closure criteria that tie corrective actions to measurable outcomes
5. Learning capture into shared memory workflow

## Out of Scope

1. Private security incident handling and vulnerability disclosure workflows
2. Organization-wide incident management tooling outside this repository
3. Replacing existing sprint retrospective workflow

## Debate: Options Considered

### Option A: Ad hoc retro comments only

- **Pros:** fastest to start, no process overhead
- **Cons:** weak traceability, no clear ownership, repeated failures likely

### Option B: Structured RCA issue workflow in this repo (chosen)

- **Pros:** auditable, actionable, integrates with current GitHub-native flow
- **Cons:** moderate authoring overhead, requires discipline and templates

### Option C: External incident tool with sync back to GitHub

- **Pros:** strongest incident feature set
- **Cons:** tool sprawl, identity/access overhead, weak local discoverability

## Decision

Choose **Option B**. Implement a GitHub-first RCA process with required sections, decision records, corrective action tracking, and memory contribution hooks.

## Process Design

### Trigger Conditions (RCA Required)

RCA is required when any of the following occur:

1. A production or deployment failure causes rollback, outage, or urgent hot-fix
2. The same failure pattern occurs 2+ times in 30 days
3. A high-severity CI/security control failure blocks releases
4. A sprint records a major operational regression with unresolved root cause

### RCA Lifecycle

1. **Detect & Stabilize**
   - Capture incident summary and immediate mitigation.
   - Create or link incident issue.
2. **Investigate**
   - Build timeline (what changed, when, by whom, impact window).
   - Enumerate root-cause hypotheses with evidence.
3. **Debate & Decide**
   - Compare candidate causes and corrective actions.
   - Record accepted decision with rationale and rejected alternatives.
4. **Design Corrective Actions**
   - Define prevention controls (tests, gates, runbooks, alerts, automation).
   - Assign owner and due date per action.
5. **Implement & Verify**
   - Land fixes and validations.
   - Confirm no recurrence signal in defined observation window.
6. **Close & Learn**
   - Close RCA with outcomes.
   - Contribute durable lessons to shared memory.

## Required RCA Record Format

Each RCA issue must include:

1. Incident summary and impact
2. Timeline
3. Root cause statement (primary and contributing factors)
4. Debate section with alternatives and tradeoffs
5. Final decision
6. Corrective action checklist with owners
7. Verification evidence
8. Learning candidate(s) for shared memory

## API and Interface Contracts

No runtime API changes. Process interfaces are GitHub artifacts:

1. RCA feature/incident issue body format
2. Linked PRs implementing corrective actions
3. Optional automation workflow checks for RCA completeness

## Security and Privacy Considerations

1. Do not publish exploit details or sensitive incident data in public issues.
2. Redirect vulnerability specifics to private security advisory workflows.
3. Sanitize logs and credentials before attaching evidence.

## Reliability and Failure Modes

Primary failure mode is process drift (incomplete RCA records). Mitigations:

1. Standard issue template/checklist
2. Label-based triage (`rca-required`, `incident`, `learning`)
3. Weekly check for open RCA items missing ownership

## Implementation Plan

1. Add an RCA issue template section to `docs/templates/ISSUE_TEMPLATE.md` or workflow issue forms.
2. Add `docs/operations/RCA_PROCESS.md` operational runbook derived from this spec.
3. Add lightweight governance check to flag incident issues missing required sections.
4. Wire close-out step to memory contribution workflow (`memory-contribute.yml` or `submit-learning.ps1`).

## Testing Strategy

1. Template validation: required sections present in sample RCA issue.
2. Process simulation: run one tabletop failure scenario and complete full RCA lifecycle.
3. Governance validation: check that missing required sections are detected by process checks.

## Rollout and Adoption Plan

1. Pilot on next qualifying failure or staged tabletop incident.
2. Require RCA for all trigger conditions after pilot.
3. Review process effectiveness each sprint retrospective.

## Observability and Operational Readiness

Track these metrics in sprint operations:

1. RCA completion rate for qualifying incidents
2. Median time to RCA closure
3. Recurrence rate for incidents with closed RCA
4. Number of promoted memory learnings per sprint

## Acceptance Criteria

1. A documented RCA workflow exists with explicit trigger rules and closure criteria.
2. RCA records include debate, decision, and corrective actions with ownership.
3. At least one completed RCA run demonstrates end-to-end traceability.
4. Durable learnings from RCA are submitted to shared memory contribution flow.

## Risks and Mitigations

1. **Risk:** process becomes performative paperwork.
   - **Mitigation:** enforce owner/action/outcome fields and recurrence tracking.
2. **Risk:** too much friction for minor failures.
   - **Mitigation:** strict trigger threshold; non-qualifying failures use lightweight retro notes.
3. **Risk:** sensitive details leak into public artifacts.
   - **Mitigation:** security redaction policy and private advisory handoff.

## Open Questions

1. Should RCA completion become a merge gate for high-risk workflow changes?
2. What recurrence window should be default for each failure class?
3. Should we auto-create RCA issues when rollback labels are applied?

## References

1. `docs/guides/prd-and-spec-guidance.md`
2. `docs/templates/ISSUE_TEMPLATE.md`
3. `docs/memory/PROCESS.md`
