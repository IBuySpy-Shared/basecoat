# Software FMEA Template

Use this template to systematically enumerate failure modes for every safety-relevant software function, assess their risk, calculate Risk Priority Numbers (RPN), and identify required corrective actions.

## Instructions

1. Complete the system metadata.
2. List every safety-relevant software function in scope.
3. For each function, enumerate all plausible failure modes.
4. Rate each failure mode for Severity, Occurrence, and Detection on the 1–10 scales below.
5. Calculate RPN = Severity × Occurrence × Detection.
6. Assign a required action for every RPN ≥ 25 and file a GitHub Issue for every RPN ≥ 50.
7. Re-evaluate after implementing corrective actions to confirm RPN reduction.

---

## Rating Scales

### Severity (S)

| Score | Effect |
|---|---|
| 1–2 | No safety impact; minor cosmetic or performance degradation |
| 3–4 | Minor function degradation; user notices but workaround available |
| 5–6 | Partial loss of safety function; degraded mode operation possible |
| 7–8 | Complete loss of safety function; uncontrolled hazardous state possible |
| 9 | Hazardous effect without warning; potential for serious injury |
| 10 | Catastrophic effect; potential for loss of life or critical infrastructure |

### Occurrence (O)

| Score | Likelihood |
|---|---|
| 1 | Failure is virtually impossible (< 1 in 1,000,000 operations) |
| 2–3 | Remote likelihood (1 in 100,000 to 1 in 10,000 operations) |
| 4–6 | Occasional occurrence (1 in 1,000 to 1 in 100 operations) |
| 7–8 | Frequent occurrence (1 in 50 to 1 in 10 operations) |
| 9–10 | Almost certain (> 1 in 10 operations) |

### Detection (D)

| Score | Detectability |
|---|---|
| 1–2 | Almost certain to detect before reaching the end user |
| 3–4 | Likely to detect through testing or monitoring |
| 5–6 | Moderate detection probability; may reach limited users |
| 7–8 | Low detection probability; likely to reach users undetected |
| 9–10 | Undetectable; failure will reach users or safety boundary |

---

## FMEA Metadata

**System / Module:** _[name]_
**Standard:** _[IEC 61508 / DO-178C / ISO 26262 / IEC 62304 / EU AI Act Art. 9]_
**SIL / DAL / ASIL Target:** _[level]_
**Version / Commit:** _[version or SHA]_
**Analysis Date:** _[YYYY-MM-DD]_
**Analyst(s):** _[names or roles]_
**Review Authority:** _[name or role]_

---

## Function Inventory

List all safety-relevant software functions in scope before completing the FMEA table.

| Function ID | Function Name | Description | Safety-Relevance |
|---|---|---|---|
| F-001 | | | |
| F-002 | | | |

---

## FMEA Table

| ID | Function | Failure Mode | Cause | Effect on System | Current Controls | S | O | D | RPN | Priority | Required Action | Issue |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FM-001 | F-001 | | | | | | | | | | | |
| FM-002 | F-001 | | | | | | | | | | | |
| FM-003 | F-002 | | | | | | | | | | | |

**Priority classification:**

| RPN | Priority |
|---|---|
| > 100 | 🔴 Critical — block release |
| 50–100 | 🟠 High — mitigate this cycle |
| 25–49 | 🟡 Medium — plan improvement |
| < 25 | 🟢 Low — document and accept |

---

## Post-Mitigation Re-evaluation

After implementing corrective actions, re-evaluate each RPN ≥ 25 item.

| ID | Original RPN | Action Implemented | New S | New O | New D | New RPN | Acceptable |
|---|---|---|---|---|---|---|---|
| FM-001 | | | | | | | Yes / No |

---

## FMEA Summary

| Priority | Count | Issues Filed |
|---|---|---|
| 🔴 Critical (RPN > 100) | | |
| 🟠 High (RPN 50–100) | | |
| 🟡 Medium (RPN 25–49) | | |
| 🟢 Low (RPN < 25) | | |
| **Total** | | |

**Highest RPN item:** FM-_[ID]_ — _[failure mode]_ — RPN: _[value]_

---

## References

- IEC 61508-3:2010 — Annex C Software Failure Mode Effects Analysis
- ISO 26262-9:2018 — Analysis techniques for dependent failures and safety analyses
- `skills/functional-safety/fta-template.md` — for top-level hazardous event analysis
