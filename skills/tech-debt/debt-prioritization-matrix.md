# Technical Debt Prioritization Matrix

Use this matrix to score and rank technical debt items so limited capacity is directed at the highest-impact remediation work.

## Scoring Dimensions

Score each item on a scale of 1–5 for each dimension. The priority score is a weighted sum.

| Dimension | Weight | Description |
|---|---|---|
| **Risk** | 30% | Probability and impact of the debt causing a production incident, security breach, or data loss |
| **Developer friction** | 25% | How much the debt slows down feature development, onboarding, or debugging |
| **Strategic alignment** | 20% | How much resolving the debt enables an upcoming product or platform goal |
| **Remediation cost** | 15% | How expensive it is to fix (inverse: lower cost → higher score) |
| **Spread** | 10% | How widely the debt is referenced or how many components it affects (broader → higher score) |

## Scoring Scale

| Score | Risk | Developer Friction | Strategic Alignment | Remediation Cost (inverse) | Spread |
|---|---|---|---|---|---|
| 5 | Imminent production or security risk | Blocks daily development | Directly enables the next major product goal | < 1 day to fix | > 10 files or components |
| 4 | Likely to cause an incident within the quarter | Significant slowdown for most developers | Enables an upcoming Q goal | 1–3 days | 5–10 files |
| 3 | Possible incident within the year | Moderate friction for some developers | Loosely related to a future goal | 3–5 days | 2–5 files |
| 2 | Unlikely unless conditions worsen | Minor annoyance, workaround exists | Little connection to strategic goals | 1–2 weeks | Single file |
| 1 | Negligible risk | No measurable impact on developers | No near-term strategic value | > 2 weeks | Isolated |

## Priority Score Formula

```
Priority Score = (Risk × 30) + (Developer Friction × 25) + (Strategic Alignment × 20)
              + (Remediation Cost × 15) + (Spread × 10)

Maximum possible score: 500
```

## Scoring Worksheet

| Debt Item | Risk (/5) | Friction (/5) | Strategic (/5) | Cost (/5) | Spread (/5) | Score (/500) |
|---|---|---|---|---|---|---|
| Legacy auth MD5 hashing | 5 | 2 | 3 | 4 | 3 | (5×30)+(2×25)+(3×20)+(4×15)+(3×10) = **350** |
| Missing order service tests | 4 | 4 | 4 | 3 | 2 | (4×30)+(4×25)+(4×20)+(3×15)+(2×10) = **345** |
| Lodash 3.x | 4 | 3 | 2 | 4 | 4 | **310** |
| Inline SQL strings | 2 | 4 | 2 | 3 | 4 | **265** |
| Outdated README | 1 | 2 | 1 | 5 | 2 | **175** |

## Triage Thresholds

| Score Range | Recommended Action |
|---|---|
| 400–500 | **Critical** — schedule for current sprint; do not defer |
| 300–399 | **High** — schedule for next 1–2 sprints |
| 200–299 | **Medium** — include in regular debt budget rotation |
| 100–199 | **Low** — backlog; revisit quarterly |
| < 100 | **Negligible** — document and monitor; do not schedule yet |

## Quarterly Debt Review Checklist

- [ ] All open debt items re-scored against current context
- [ ] Resolved items archived with resolution notes
- [ ] Top 5 items by score reviewed with team lead
- [ ] Debt budget for next quarter confirmed (default: 20% of sprint capacity)
- [ ] Items promoted to "Critical" receive a sprint target before the review closes
- [ ] Trends noted: is the register growing or shrinking?
