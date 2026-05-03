# Consistency Strategy Template

## Service / Data Domain

- **Service:**
- **Data domain:** (e.g., user profile, order, inventory, notification)
- **Reviewed by:**
- **Date:**

---

## Consistency Requirements

| Requirement | Value | Rationale |
|---|---|---|
| Required consistency level | < Strong / Causal / Read-your-writes / Eventual > | |
| Acceptable read staleness | < 0 / seconds / minutes / hours > | |
| Acceptable write conflict risk | < None / Low / High > | |
| Business invariants that must always hold | | |

---

## Consistency Level Selection

**Selected level:** < Strong | Causal | Read-your-writes | Eventual >

**Justification:**

_State the specific reason this consistency level is appropriate for this domain (SLA, business invariant, or technical constraint)._

**Conflict risk if selected level is weaker than Strong:**

_Describe what could go wrong if writes diverge and how the system handles it._

---

## Convergence Guarantee (for Eventual Consistency)

| Check | Answer |
|---|---|
| Is convergence mathematically guaranteed? (CRDT / proven merge function) | Yes / No |
| Conflict detection instrumented with metrics? | Yes / No |
| Maximum divergence window (SLA) | seconds / minutes |
| Compensating transaction or reconciliation job defined? | Yes / No |
| Reconciliation job SLA | runs every ___ minutes |

---

## Read Consistency

| Read Pattern | Consistency Required | Implementation |
|---|---|---|
| User reads their own writes | Read-your-writes | < sticky session / primary read / bounded staleness > |
| Cross-service read after write | < Causal / Eventual > | < CDC lag / sync call / event wait > |
| Analytics / reporting read | Eventual | < replica / OLAP snapshot > |

---

## Tooling

| Tool | Role |
|---|---|
| < Database > | Primary store with < isolation level > |
| < Cache > | Read cache with < TTL / event-invalidated > |
| < CDC / message bus > | Async propagation with < at-least-once / exactly-once > |

---

## Validation

- [ ] Write path tested under concurrent load to expose race conditions
- [ ] Conflict detection metrics are visible on dashboard
- [ ] Compensating transaction or reconciliation job is tested
- [ ] Consistency level is documented in the service's architecture decision record (ADR)
