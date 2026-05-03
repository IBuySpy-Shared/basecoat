# Chaos Experiment Plan Template

## Experiment Metadata

- **Experiment name:**
- **Service:**
- **FMEA reference:** FM-___ (from `fmea-template.md`)
- **Owner:**
- **Date:**
- **Environment:** < production | staging | ephemeral >

---

## Hypothesis

_State what the system SHOULD do during the failure. A good hypothesis is testable and tied to user or operational impact._

> When < fault is injected >, the system should < expected behavior > and < expected safeguards > should activate within < timeframe >, resulting in < expected customer impact >.

---

## Steady State

Define the metrics and checks that prove the system is healthy before the experiment begins.

| Metric | Normal Range | Source |
|---|---|---|
| Error rate | < % | APM / gateway metrics |
| p99 latency | < ms | APM traces |
| Active users / requests/sec | ~ RPS | Load balancer metrics |
| < SLO indicator > | < threshold > | |

Steady-state verification command (if applicable):

```bash
# Example: verify health endpoint returns 200
curl -f https://<service-endpoint>/health && echo "Steady state confirmed"
```

---

## Fault Injection

| Parameter | Value |
|---|---|
| Fault type | < network latency | pod kill | dependency failure | CPU saturation | disk fill > |
| Target | < specific pod / service / instance > |
| Magnitude | < +500ms latency | 100% packet loss | N pods killed > |
| Duration | min |
| Injection tool | < tc / toxiproxy / chaos-mesh / LitmusChaos / manual > |

Injection command:

```bash
# Example: inject network latency with toxiproxy
toxiproxy-cli toxic add <proxy-name> --type latency --attribute latency=500
```

---

## Blast Radius

| Parameter | Value |
|---|---|
| Scope | < single pod | service slice | AZ | environment > |
| Maximum user-visible impact | < % requests affected > |
| Rollback mechanism | < remove toxic / restart pod / revert config > |
| Rollback time | < seconds > |

---

## Abort Conditions

Stop the experiment immediately if any of these thresholds are crossed:

| Condition | Threshold | Action |
|---|---|---|
| Error rate exceeds | % | Stop injection; execute rollback |
| p99 latency exceeds | ms for > 2 minutes | Stop injection; execute rollback |
| Error budget burn rate exceeds | × | Stop injection; execute rollback |
| Customer-visible outage (any Sev 1 trigger) | — | Stop immediately; declare incident |

---

## Observer Role

- **Primary observer:**
- **Responsibilities:** Capture timestamps, unexpected behaviors, and operator actions. Arm the rollback mechanism. Call abort if any condition is crossed.

---

## Results

| Observation | Expected | Actual |
|---|---|---|
| Safeguard triggered? | Yes | |
| Recovery time | < target > s | s |
| Customer impact | < expected > | |
| Alerts fired accurately? | Yes | |

**Resilience score (see `chaos-engineer` agent rubric):** / 25

---

## Findings and Follow-Up

| # | Finding | Severity | Recommended Fix | GitHub Issue | Owner |
|---|---|---|---|---|---|
| 1 | | | | # | |

---

## Next Experiment

Based on findings, the next recommended experiment is:

- **Failure mode:** < FM-___ >
- **Increased scope:** < next blast radius tier >
- **Prerequisite:** < action that must be completed first >
