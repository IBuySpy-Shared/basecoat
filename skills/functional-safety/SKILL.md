---
name: functional-safety
description: "Use when performing safety-critical system analysis including Software FMEA, Fault Tree Analysis (FTA), safety requirement traceability, and defensive programming reviews. Supports IEC 61508, DO-178C, ISO 26262, IEC 62304, and EU AI Act Article 9."
---

# Functional Safety Skill

Use this skill when a system requires formal safety analysis to meet a functional safety standard or to ensure that software failures cannot cause harm to people, critical infrastructure, or regulated processes.

## When to Use

- Performing a Software FMEA for a safety-relevant module or subsystem
- Constructing a Fault Tree Analysis for a hazardous top-level event
- Validating that every safety requirement traces to an implementation and a test
- Reviewing a codebase for compliance with defensive programming requirements at a specific SIL or DAL
- Preparing for an IEC 61508, DO-178C, ISO 26262, IEC 62304, or EU AI Act Art. 9 audit or certification

## How to Invoke

Reference this skill by attaching `skills/functional-safety/SKILL.md` to your agent context, or instruct the agent:

> Use the functional-safety skill. Start with the Software FMEA template for the identified safety-relevant functions.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `software-fmea-template.md` | Software FMEA — enumerates failure modes, calculates RPN, and identifies required mitigations |
| `fta-template.md` | Fault Tree Analysis — models top-level hazardous events to minimal cut sets and single points of failure |
| `safety-requirements-traceability.md` | Safety requirement traceability matrix from standard clause to implementation to verification |
| `defensive-programming-checklist.md` | SIL/DAL-tiered defensive programming compliance checklist for safety-critical code |

## Agent Pairing

This skill is designed to be used alongside the `safety-analyst` agent. The agent drives the analysis workflow; this skill provides the structured templates and checklists.

Pair with `security-analyst` when the safety analysis scope overlaps with cybersecurity (e.g., IEC 62443 for industrial systems or EU AI Act Art. 15 robustness for AI). Pair with `production-readiness` agent when safety analysis outputs must feed into the PRR gate.

## Standards Reference

- IEC 61508 — Functional Safety of Electrical/Electronic/Programmable Electronic Safety-related Systems
- IEC 62304 — Medical Device Software — Software Life Cycle Processes
- ISO 26262 — Road Vehicles — Functional Safety
- DO-178C — Software Considerations in Airborne Systems and Equipment Certification
- MISRA C:2012 / MISRA C++:2023 — Guidelines for the use of C/C++ in critical systems
- EU AI Act, Article 9 — Risk management system for high-risk AI systems
