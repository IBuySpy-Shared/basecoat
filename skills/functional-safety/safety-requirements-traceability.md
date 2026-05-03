# Safety Requirements Traceability Matrix

Use this template to establish and validate the complete traceability chain from safety standard clause through system requirements, software requirements, design, implementation, and verification for every safety-relevant requirement.

## Instructions

1. Complete the document metadata.
2. Enumerate all applicable safety requirements derived from the standard and the hazard analysis.
3. For each requirement, link to the design element, code module, and test case that implement and verify it.
4. Mark any chain where a link is missing as a gap and file a GitHub Issue.
5. Review this matrix at every baseline milestone.

---

## Traceability Metadata

**System / Module:** _[name]_
**Standard:** _[IEC 61508 / DO-178C / ISO 26262 / IEC 62304 / EU AI Act Art. 9]_
**SIL / DAL / ASIL Target:** _[level]_
**Version / Commit:** _[version or SHA]_
**Matrix Date:** _[YYYY-MM-DD]_
**Author(s):** _[names or roles]_
**Review Authority:** _[name or role]_

---

## Traceability Chain

A complete chain has entries at every level. A missing entry at any level is a traceability gap.

```text
Standard Clause → System Requirement → Software Requirement → Design Element → Implementation → Test Case → Test Result
```

---

## Requirements Traceability Matrix

| Req ID | Standard Clause | Requirement Statement | System Req Ref | Design Element | Implementation (file:line) | Test Case ID | Test Status | Gap | Issue |
|---|---|---|---|---|---|---|---|---|---|
| SR-001 | | | | | | | Pass / Fail / Not Run | None / Missing design / Missing impl / Missing test | |
| SR-002 | | | | | | | | | |
| SR-003 | | | | | | | | | |

---

## Gap Summary

| Gap Type | Count | Issues Filed |
|---|---|---|
| Missing design element (requirement not allocated to design) | | |
| Missing implementation (design not implemented) | | |
| Missing test case (requirement not tested) | | |
| Failed test (requirement not met) | | |
| Missing standard linkage (requirement not traceable to standard) | | |
| **Total gaps** | | |

---

## Orphan Analysis

### Orphan Tests

Test cases with no traceability to a safety requirement may indicate untargeted testing. List them here.

| Test Case ID | Description | Linked Requirement | Action |
|---|---|---|---|
| | | None | Delete or link to requirement |

### Orphan Design Elements

Design elements with no safety requirement traceability may indicate scope creep or missing requirements.

| Design Element | Description | Linked Requirement | Action |
|---|---|---|---|
| | | None | Review and link or remove |

---

## Verification Method Coverage

Confirm that all required verification methods are applied at the target SIL/DAL.

| Verification Method | Required at SIL/DAL | Applied | Coverage |
|---|---|---|---|
| Formal review / inspection | SIL 1+ | Yes / No | _[% of requirements reviewed]_ |
| Unit testing | SIL 1+ | Yes / No | _[% statement / branch coverage]_ |
| Integration testing | SIL 2+ | Yes / No | _[% of interfaces tested]_ |
| System / acceptance testing | SIL 1+ | Yes / No | _[% of safety requirements exercised]_ |
| Formal verification or model checking | SIL 3+ | Yes / No | _[% of critical functions formally verified]_ |
| Structural coverage (MC/DC) | DAL A / SIL 3+ | Yes / No | _[% MC/DC coverage achieved]_ |

---

## Traceability Completeness Summary

| Metric | Value |
|---|---|
| Total safety requirements | |
| Requirements with complete chain | |
| Requirements with gaps | |
| Traceability completeness | _[complete / total × 100]_ % |
| Test pass rate | _[passing / total tests × 100]_ % |

---

## References

- IEC 61508-3:2010 — Clause 7.2 and 7.3 Software requirements specification
- DO-178C — Section 5.5 Traceability
- ISO 26262-6:2018 — Clause 5.4 Traceability
- IEC 62304:2006+AMD1:2015 — Clause 5.1.1 Software development planning
