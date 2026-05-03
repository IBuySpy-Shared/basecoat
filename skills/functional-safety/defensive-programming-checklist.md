# Defensive Programming Checklist

Use this checklist to audit safety-critical code for compliance with defensive programming requirements at the applicable Safety Integrity Level (SIL) or Development Assurance Level (DAL).

## Instructions

1. Complete the metadata section.
2. Mark each item as **Pass**, **Fail**, or **N/A** with a note.
3. A **Fail** on any Required item for the applicable SIL/DAL is a safety gap.
4. File a GitHub Issue for every Failed Required item.
5. Re-evaluate after corrective actions are implemented.

### Requirement Tiers by SIL/DAL

| Tier | Meaning |
|---|---|
| All SIL | Required at SIL 1, 2, 3, and 4 (and DAL D, C, B, A) |
| SIL 2+ | Required at SIL 2, 3, 4 (DAL C, B, A) |
| SIL 3+ | Required at SIL 3 and 4 (DAL B, A) |
| SIL 4 / DAL A | Required only at the highest level |
| Recommended | Best practice; not normatively required at the stated level |

---

## Checklist Metadata

**System / Module:** _[name]_
**Language(s):** _[e.g., C, C++, Python, Rust]_
**Standard:** _[IEC 61508 / DO-178C / ISO 26262 / IEC 62304 / EU AI Act Art. 9]_
**SIL / DAL / ASIL Target:** _[level]_
**Files / Modules in Scope:** _[list or link]_
**Reviewer:** _[name or role]_
**Review Date:** _[YYYY-MM-DD]_

---

## Section 1 — Input Validation

| # | Requirement | SIL/DAL | Result | Notes | Issue |
|---|---|---|---|---|---|
| 1.1 | All inputs to safety-relevant functions are range-checked before use | All SIL | | | |
| 1.2 | Invalid inputs cause a defined fail-safe response, not undefined behavior | All SIL | | | |
| 1.3 | External sensor or network inputs validated for plausibility (not just range) | SIL 2+ | | | |
| 1.4 | Input validation is independent of the main function logic (not bypassed by flags) | SIL 2+ | | | |
| 1.5 | Two-channel or cross-check validation used for Tier 1 safety inputs | SIL 3+ | | | |

## Section 2 — Output and Actuator Control

| # | Requirement | SIL/DAL | Result | Notes | Issue |
|---|---|---|---|---|---|
| 2.1 | All outputs to safety-relevant actuators checked for range before transmission | All SIL | | | |
| 2.2 | Output command cannot be issued from more than one code path simultaneously | All SIL | | | |
| 2.3 | Output held at last-known-safe value on communication timeout | SIL 2+ | | | |
| 2.4 | Actuator feedback compared to commanded output (closed-loop verification) | SIL 3+ | | | |

## Section 3 — Error and Exception Handling

| # | Requirement | SIL/DAL | Result | Notes | Issue |
|---|---|---|---|---|---|
| 3.1 | All error paths lead to a defined safe state, not undefined behavior | All SIL | | | |
| 3.2 | No unhandled exceptions or panics in safety-relevant code paths | All SIL | | | |
| 3.3 | Error codes checked at every call site (no ignored return values) | All SIL | | | |
| 3.4 | Error logging does not mask or delay safety-relevant error handling | All SIL | | | |
| 3.5 | Recovery from transient errors bounded in time (no infinite retry) | SIL 2+ | | | |

## Section 4 — Memory and Resource Safety

| # | Requirement | SIL/DAL | Result | Notes | Issue |
|---|---|---|---|---|---|
| 4.1 | No dynamic memory allocation in safety-relevant code paths (or bounded allocator) | SIL 2+ | | | |
| 4.2 | All array accesses bounds-checked | All SIL | | | |
| 4.3 | No use-after-free, double-free, or dangling pointer conditions | All SIL | | | |
| 4.4 | Stack depth statically analyzed and bounded | SIL 2+ | | | |
| 4.5 | Memory integrity checks (ECC or CRC) applied to safety-critical data structures | SIL 3+ | | | |

## Section 5 — Control Flow Integrity

| # | Requirement | SIL/DAL | Result | Notes | Issue |
|---|---|---|---|---|---|
| 5.1 | No unreachable code in safety-relevant functions | All SIL | | | |
| 5.2 | No unintended fall-through in switch/case statements | All SIL | | | |
| 5.3 | Recursive functions prohibited in safety-relevant code (or bounded depth proven) | SIL 2+ | | | |
| 5.4 | Control flow monitoring (program counter check or sequence counter) | SIL 3+ | | | |
| 5.5 | Cyclomatic complexity of safety functions ≤ 10 (or justified exception documented) | SIL 2+ | | | |

## Section 6 — Timing and Concurrency

| # | Requirement | SIL/DAL | Result | Notes | Issue |
|---|---|---|---|---|---|
| 6.1 | Worst-case execution time (WCET) analyzed for all safety-relevant tasks | SIL 2+ | | | |
| 6.2 | Watchdog timer or heartbeat mechanism implemented for safety-relevant tasks | SIL 2+ | | | |
| 6.3 | Shared safety-relevant data protected against concurrent access (mutex, atomic) | All SIL | | | |
| 6.4 | Deadlock-free design verified (lock ordering or lock-free design) | SIL 2+ | | | |
| 6.5 | Task scheduling analyzed for priority inversion in safety-relevant tasks | SIL 3+ | | | |

## Section 7 — Independence and Partitioning

| # | Requirement | SIL/DAL | Result | Notes | Issue |
|---|---|---|---|---|---|
| 7.1 | Safety functions are isolated from quality-of-service or non-safety functions | SIL 2+ | | | |
| 7.2 | Safety-relevant data not shared with non-safety code without a protection layer | SIL 2+ | | | |
| 7.3 | Diverse redundancy implemented for critical safety calculations | SIL 3+ | | | |
| 7.4 | Independence between redundant channels verified (no common code or data path) | SIL 3+ | | | |

## Section 8 — Static Analysis and Coding Standards

| # | Requirement | SIL/DAL | Result | Notes | Issue |
|---|---|---|---|---|---|
| 8.1 | Static analysis tool applied to safety-relevant modules | SIL 2+ | | | |
| 8.2 | MISRA C/C++ or equivalent coding standard applied (all mandatory rules) | SIL 2+ | | | |
| 8.3 | No compiler warnings suppressed without documented justification | All SIL | | | |
| 8.4 | Code coverage at statement level ≥ 100% for safety-relevant functions | SIL 2+ | | | |
| 8.5 | MC/DC structural coverage achieved for safety-relevant decision logic | SIL 3+ / DAL A–B | | | |

---

## Summary

| Section | Required Items (at target SIL/DAL) | Passed | Failed | N/A |
|---|---|---|---|---|
| 1. Input Validation | | | | |
| 2. Output and Actuator Control | | | | |
| 3. Error and Exception Handling | | | | |
| 4. Memory and Resource Safety | | | | |
| 5. Control Flow Integrity | | | | |
| 6. Timing and Concurrency | | | | |
| 7. Independence and Partitioning | | | | |
| 8. Static Analysis and Coding Standards | | | | |
| **Total** | | | | |

## Blocking Findings

| Finding | Section | Requirement | Issue |
|---|---|---|---|
| | | | |

---

## References

- IEC 61508-3:2010 — Annex A and B Software techniques
- MISRA C:2012 — Guidelines for the Use of the C Language in Critical Systems
- DO-178C — Section 6 Software Verification
- ISO 26262-6:2018 — Clause 8 Software unit design and implementation
- `skills/functional-safety/software-fmea-template.md`
