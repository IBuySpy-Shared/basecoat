# Technical Debt Register Template

Use this register to catalog, classify, and track technical debt items across the codebase.

## Register Metadata

| Field | Value |
|---|---|
| Repository | _org/repo_ |
| Last reviewed | _YYYY-MM-DD_ |
| Reviewed by | _Team name or names_ |
| Current debt budget | _20% of sprint capacity_ |
| Total open items | _N_ |
| Items resolved this quarter | _N_ |

## Debt Item Template

File one debt item per GitHub Issue labeled `tech-debt` with the following structure:

```markdown
## Debt Item: <short title>

**ID**: TD-<NNN>
**Severity**: Critical | High | Medium | Low
**Category**: Architecture | Code Quality | Security | Testing | Documentation | Dependency | Operational
**Component**: <affected module, service, or file>
**Opened**: YYYY-MM-DD
**Opened by**: @username
**Priority Score**: <see debt-prioritization-matrix.md>

### Description

<What is the debt? What workaround or suboptimal pattern exists today?>

### Why It Was Incurred

<Deliberate trade-off / time pressure / outdated dependency / design drift / unknown at the time>

### Impact

<What goes wrong because of this debt? Performance degradation / security risk / developer friction / reliability risk>

### Remediation

<What needs to change to resolve this debt? Include effort estimate.>

**Effort estimate**: _S (< 1 day) / M (1–3 days) / L (3–5 days) / XL (> 5 days)_

### Acceptance Criteria

- [ ] <What must be true for this item to be marked resolved?>
- [ ] Tests covering the affected area pass
- [ ] No regression introduced

### Amortization Notes

_Record each sprint in which work was done toward resolving this item._

| Sprint | Work Done | Remaining Effort |
|---|---|---|
| Sprint N | _Description_ | _M_ |
```

## Register Summary Table

Maintain this table in `docs/TECH_DEBT.md` or equivalent:

| ID | Title | Severity | Category | Component | Priority Score | Sprint Target | Status |
|---|---|---|---|---|---|---|---|
| TD-001 | Legacy auth flow uses MD5 hashing | Critical | Security | `auth/` | 92 | Sprint 12 | Open |
| TD-002 | No integration tests for order service | High | Testing | `orders/` | 74 | Sprint 13 | In Progress |
| TD-003 | Unmaintained dependency: lodash 3.x | High | Dependency | `frontend/` | 68 | Sprint 14 | Open |
| TD-004 | Inline SQL strings in repository layer | Medium | Code Quality | `data/` | 45 | Backlog | Open |

## Categories Reference

| Category | Examples |
|---|---|
| Architecture | Tight coupling, missing abstraction layers, monolith decomposition needed |
| Code Quality | Duplicated logic, dead code, long functions, poor naming |
| Security | Outdated auth patterns, missing input validation, exposed secrets |
| Testing | Missing unit/integration tests, flaky tests, no coverage for critical paths |
| Documentation | Missing ADRs, outdated READMEs, no runbooks |
| Dependency | Outdated packages, unresolved vulnerabilities, abandoned libraries |
| Operational | No health checks, missing alerts, manual deployment steps |
