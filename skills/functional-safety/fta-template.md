# Fault Tree Analysis (FTA) Template

Use this template to model top-level hazardous events as fault trees, identify minimal cut sets, and determine single points of failure in safety-critical software systems.

## Instructions

1. Complete the system metadata.
2. Define each top-level undesired event (TLE) to analyze.
3. For each TLE, build the fault tree by decomposing causes using AND/OR gates until you reach basic events.
4. Calculate or enumerate minimal cut sets.
5. Identify single points of failure (any minimal cut set with exactly one basic event).
6. Assign required actions for each critical minimal cut set and file GitHub Issues.

---

## FTA Notation

| Symbol | Name | Meaning |
|---|---|---|
| Rectangle | Top-level or intermediate event | An event that is caused by the events below it |
| Circle | Basic event | A primary failure requiring no further decomposition |
| Diamond | Undeveloped event | A cause not yet analyzed or not within scope |
| AND gate | AND | All input events must occur for the output to occur |
| OR gate | OR | Any single input event can cause the output |
| INHIBIT gate | Conditional AND | Output occurs only when input event occurs AND a condition is met |

---

## FTA Metadata

**System / Module:** _[name]_
**Standard:** _[IEC 61508 / DO-178C / ISO 26262 / IEC 62304 / EU AI Act Art. 9]_
**SIL / DAL / ASIL Target:** _[level]_
**Version / Commit:** _[version or SHA]_
**Analysis Date:** _[YYYY-MM-DD]_
**Analyst(s):** _[names or roles]_
**Review Authority:** _[name or role]_

---

## Top-Level Event Inventory

List all hazardous top-level events to be analyzed.

| TLE ID | Top-Level Event | Hazardous Consequence | Source (Hazard Analysis / FMEA ID) |
|---|---|---|---|
| TLE-001 | | | |
| TLE-002 | | | |

---

## Fault Tree: TLE-001 — _[Event Name]_

### Tree Description

_Describe the top-level event and the key causal pathways in plain language before presenting the structured decomposition._

### Structured Decomposition

Use indented text to represent the tree structure. Precede each node with its gate type.

```text
[TLE-001] <Top-level event name>
  OR
  ├── [IE-001] <Intermediate event 1>
  │     AND
  │     ├── [BE-001] <Basic event: Software module X returns invalid output>
  │     └── [BE-002] <Basic event: Watchdog timer fails to detect invalid output>
  └── [IE-002] <Intermediate event 2>
        OR
        ├── [BE-003] <Basic event: Input validation not applied to external sensor value>
        └── [BE-004] <Basic event: Sensor value within valid range but physically incorrect>
```

### Basic Events

| ID | Description | Failure Mode Source | Estimated Probability | Notes |
|---|---|---|---|---|
| BE-001 | | | | |
| BE-002 | | | | |
| BE-003 | | | | |
| BE-004 | | | | |

### Minimal Cut Sets

A **minimal cut set** is the smallest combination of basic events whose simultaneous occurrence causes the top-level event.

| Cut Set ID | Basic Events | Cut Set Size | Type | System Probability |
|---|---|---|---|---|
| CS-001 | BE-001, BE-002 | 2 | AND-pair | |
| CS-002 | BE-003 | 1 | Single point of failure | |
| CS-003 | BE-004 | 1 | Single point of failure | |

**Single points of failure (cut set size = 1):**

- CS-002: _[BE-003 — description]_
- CS-003: _[BE-004 — description]_

### Required Actions

| Cut Set | Required Action | Priority | Issue |
|---|---|---|---|
| CS-001 | Add diversity between X and watchdog; use independent hardware or software path | High | |
| CS-002 | Add input validation with fail-safe default; add redundant sensor or cross-check | Critical | |
| CS-003 | Add plausibility check against adjacent sensor; require two-of-three agreement | Critical | |

---

## FTA Summary

| TLE ID | Top-Level Event | Minimal Cut Sets | Single Points of Failure | Issues Filed |
|---|---|---|---|---|
| TLE-001 | | | | |
| TLE-002 | | | | |

**Total single points of failure across all fault trees:** _[N]_

---

## Common Cause Failure Analysis

Identify any basic events shared across multiple fault trees. Shared basic events increase system-level risk because one failure can trigger multiple TLEs simultaneously.

| Basic Event | Fault Trees Affected | Common Cause Type | Mitigation |
|---|---|---|---|
| | | Hardware / Software / Environment / Process | |

---

## References

- IEC 61508-7:2010 — Annex B Fault Tree Analysis
- IEC 61025 — Fault Tree Analysis
- ISO 26262-9:2018 — Clause 8 FTA
- `skills/functional-safety/software-fmea-template.md` — for failure mode enumeration
