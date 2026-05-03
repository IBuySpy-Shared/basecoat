---
name: hardening
description: "Use when reviewing Dockerfiles, Kubernetes manifests, database configurations, Linux hosts, or supply-chain artifacts against CIS Benchmarks, DISA STIGs, or NIST SP 800-190 controls. Provides scored checklists and a hardening report template."
---

# Hardening Skill

Use this skill when the task involves reviewing platform configurations against security benchmark controls or producing a hardening report for containers, Kubernetes, databases, Linux, or supply-chain artifacts.

## When to Use

- Reviewing a Dockerfile or container image against CIS Docker Benchmark
- Auditing Kubernetes manifests or cluster configuration against CIS Kubernetes Benchmark
- Assessing database server configuration against CIS Database Benchmark
- Reviewing Linux host configuration against CIS Linux Benchmark or DISA STIG
- Checking supply-chain artifacts (SBOM, image signatures, CI pipeline) for hardening gaps
- Producing a scored hardening report for a compliance audit

## How to Invoke

Reference this skill by attaching `skills/hardening/SKILL.md` to your agent context, or instruct the agent:

> Use the hardening skill. Apply the relevant CIS checklist and populate the hardening-report-template.md with scored findings.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `cis-container-checklist.md` | CIS Docker Benchmark checklist for Dockerfiles and container images |
| `cis-kubernetes-checklist.md` | CIS Kubernetes Benchmark checklist for manifests and cluster config |
| `database-hardening-checklist.md` | Database hardening checklist covering auth, encryption, audit, and least privilege |
| `linux-hardening-checklist.md` | Linux/OS hardening checklist: SSH, sysctl, auditd, services, and patching |
| `supply-chain-hardening-checklist.md` | Supply-chain hardening: image signing, SBOM, dependency pinning, CI integrity |
| `hardening-report-template.md` | Scored hardening report with per-control findings and remediation roadmap |

## Workflow

1. Identify the target scope (container, Kubernetes, database, Linux, supply chain).
2. Run the corresponding checklist(s), marking each control Pass / Fail / N/A.
3. Classify each Fail finding by CIS Level or STIG category.
4. Populate `hardening-report-template.md` with findings.
5. File GitHub issues for all Critical and High findings before delivering the report.

## Guardrails

- Do not mark a control as Pass without verifying it against the actual configuration or file content.
- Do not skip Level 1 controls — they represent minimum baseline security.
- Always record the benchmark version and date of review in the report header.
- Escalate CAT I / CIS Level 1 findings to Critical severity and block deployment when found.

## Agent Pairing

This skill is designed to be used alongside the `hardening-advisor` agent. It is also compatible with `security-analyst` for vulnerability and compliance audits.
