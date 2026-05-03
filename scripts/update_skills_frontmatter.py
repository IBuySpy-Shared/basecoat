#!/usr/bin/env python3
"""Update SKILL.md files to comply with Agent Skills specification."""

import os
import re

SKILLS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "skills")

MAPPING = {
    "agent-design": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "meta", "keywords": "agent, design, scaffold, template, instruction, copilot", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "api-design": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "architecture", "keywords": "api, openapi, rest, graphql, spec, versioning, governance", "model-tier": "premium"},
        "allowed-tools": "search/codebase web/fetch",
    },
    "api-security": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "quality", "keywords": "api, security, authentication, authorization, rate-limiting, owasp", "model-tier": "premium"},
        "allowed-tools": "search/codebase web/fetch",
    },
    "app-inventory": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "architecture", "keywords": "inventory, legacy, migration, dependencies, assessment, modernization", "model-tier": "standard"},
        "allowed-tools": "search/codebase read_file",
    },
    "architecture": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "architecture", "keywords": "architecture, c4, adr, system-design, technology, risk", "model-tier": "premium"},
        "allowed-tools": "search/codebase",
    },
    "azure-container-apps": {
        "license": "MIT",
        "compatibility": "Requires Azure CLI and Docker. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "devops", "keywords": "azure, container-apps, aca, dapr, kubernetes, serverless, containers", "model-tier": "standard"},
        "allowed-tools": "search/codebase run_terminal_command",
    },
    "azure-devops-rest": {
        "license": "MIT",
        "compatibility": "Requires Azure DevOps access. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "devops", "keywords": "azure-devops, rest-api, pipelines, work-items, authentication, pat", "model-tier": "standard"},
        "allowed-tools": "search/codebase web/fetch",
    },
    "azure-identity": {
        "license": "MIT",
        "compatibility": "Requires Azure CLI. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "architecture", "keywords": "azure, identity, rbac, managed-identity, entra, zero-trust, pim", "model-tier": "premium"},
        "allowed-tools": "search/codebase web/fetch",
    },
    "azure-landing-zone": {
        "license": "MIT",
        "compatibility": "Requires Azure CLI and Bicep CLI. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "architecture", "keywords": "azure, landing-zone, eslz, caf, bicep, policy, management-groups", "model-tier": "premium"},
        "allowed-tools": "search/codebase",
    },
    "azure-networking": {
        "license": "MIT",
        "compatibility": "Requires Azure CLI. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "architecture", "keywords": "azure, networking, vnet, hub-spoke, private-endpoint, dns, firewall", "model-tier": "premium"},
        "allowed-tools": "search/codebase",
    },
    "azure-policy": {
        "license": "MIT",
        "compatibility": "Requires Azure CLI. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "devops", "keywords": "azure, policy, compliance, governance, bicep, regulatory, cis, nist", "model-tier": "premium"},
        "allowed-tools": "search/codebase web/fetch",
    },
    "azure-waf-review": {
        "license": "MIT",
        "compatibility": "Requires Azure CLI. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "quality", "keywords": "azure, waf, well-architected, reliability, security, cost, performance", "model-tier": "premium"},
        "allowed-tools": "search/codebase",
    },
    "backend-dev": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "development", "keywords": "backend, api, rest, graphql, service, repository-pattern, error-handling", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "basecoat": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "meta", "keywords": "router, discovery, delegation, basecoat, agents, skills", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "code-review": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "quality", "keywords": "review, pull-request, diff, code-quality, bugs, security", "model-tier": "premium"},
        "allowed-tools": "search/codebase",
    },
    "contract-testing": {
        "license": "MIT",
        "compatibility": "Requires Docker. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "quality", "keywords": "contract, testing, pact, consumer-driven, integration, mutation", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "copilot-cli-usage-analytics": {
        "license": "MIT",
        "compatibility": "Requires GitHub Copilot CLI. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "meta", "keywords": "copilot, cli, analytics, usage, cost, session, model", "model-tier": "standard"},
        "allowed-tools": "web/fetch",
    },
    "copilot-usage-analytics": {
        "license": "MIT",
        "compatibility": "Requires GitHub Copilot CLI access. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "meta", "keywords": "copilot, usage, analytics, cost, model-routing, api, telemetry", "model-tier": "standard"},
        "allowed-tools": "web/fetch",
    },
    "create-instruction": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "meta", "keywords": "instruction, create, frontmatter, applyTo, workflow, guardrails", "model-tier": "standard"},
        "allowed-tools": "search/codebase read_file write_file",
    },
    "create-skill": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "meta", "keywords": "skill, create, template, scaffold, frontmatter, workflow", "model-tier": "standard"},
        "allowed-tools": "search/codebase read_file write_file",
    },
    "data-tier": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "development", "keywords": "data, database, schema, migration, query, repository, sql", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "devops": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "devops", "keywords": "devops, ci-cd, pipeline, deployment, iac, observability, rollback", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "documentation": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "meta", "keywords": "documentation, readme, adr, runbook, docs-as-code, technical-writing", "model-tier": "standard"},
        "allowed-tools": "search/codebase read_file write_file",
    },
    "domain-driven-design": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "architecture", "keywords": "ddd, domain, bounded-context, aggregate, event-sourcing, cqrs, microservices", "model-tier": "premium"},
        "allowed-tools": "search/codebase",
    },
    "electron-apps": {
        "license": "MIT",
        "compatibility": "Requires Node.js and Electron. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "development", "keywords": "electron, desktop, ipc, csp, packaging, auto-update, security", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "environment-bootstrap": {
        "license": "MIT",
        "compatibility": "Requires Azure CLI and Terraform. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "devops", "keywords": "environment, bootstrap, oidc, azure, terraform, key-vault, ci-cd", "model-tier": "standard"},
        "allowed-tools": "search/codebase run_terminal_command",
    },
    "frontend-dev": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "development", "keywords": "frontend, ui, components, accessibility, state-management, responsive", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "github-security-posture": {
        "license": "MIT",
        "compatibility": "Requires GitHub CLI or API access. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "quality", "keywords": "github, security, posture, branch-protection, dependabot, secret-scanning, codeowners", "model-tier": "premium"},
        "allowed-tools": "search/codebase web/fetch",
    },
    "ha-resilience": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "architecture", "keywords": "ha, resilience, multi-az, circuit-breaker, chaos, sre, availability", "model-tier": "premium"},
        "allowed-tools": "search/codebase",
    },
    "handoff": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "meta", "keywords": "handoff, context, session, transfer, continuity, state", "model-tier": "standard"},
        "allowed-tools": "read_file write_file",
    },
    "human-in-the-loop": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "meta", "keywords": "human-in-the-loop, approval, escalation, confirmation, oversight, gate", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "identity-migration": {
        "license": "MIT",
        "compatibility": "Requires Azure CLI and .NET SDK. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "development", "keywords": "identity, migration, aspnet, entra, claims, authentication, roles", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "manual-test-strategy": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "quality", "keywords": "manual-testing, exploratory, regression, test-strategy, automation, charter", "model-tier": "premium"},
        "allowed-tools": "search/codebase",
    },
    "mcp-development": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "development", "keywords": "mcp, model-context-protocol, server, tools, transport, integration", "model-tier": "standard"},
        "allowed-tools": "search/codebase read_file write_file",
    },
    "observability": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "devops", "keywords": "observability, telemetry, tracing, metrics, logging, instrumentation", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "penetration-testing": {
        "license": "MIT",
        "compatibility": "Requires penetration testing tools. Works with VS Code Copilot and Claude Code.",
        "metadata": {"category": "quality", "keywords": "pentest, penetration-testing, owasp, exploitation, vulnerability, reporting", "model-tier": "premium"},
        "allowed-tools": "search/codebase web/fetch run_terminal_command",
    },
    "performance-profiling": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "quality", "keywords": "performance, profiling, latency, benchmark, optimization, bottleneck", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "production-readiness": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "devops", "keywords": "production, readiness, prr, bcdr, disaster-recovery, fmea, slo", "model-tier": "premium"},
        "allowed-tools": "search/codebase",
    },
    "refactoring": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "development", "keywords": "refactoring, simplification, code-quality, behavior-preservation, structure", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "security": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "quality", "keywords": "security, owasp, threat-modeling, stride, vulnerability, cve, dependency-audit", "model-tier": "premium"},
        "allowed-tools": "search/codebase web/fetch",
    },
    "security-operations": {
        "license": "MIT",
        "compatibility": "Requires SIEM and cloud CLI access. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "quality", "keywords": "security-operations, siem, threat-detection, secrets, audit-logging, incident-response", "model-tier": "premium"},
        "allowed-tools": "search/codebase web/fetch",
    },
    "service-bus-migration": {
        "license": "MIT",
        "compatibility": "Requires Azure CLI and .NET SDK. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "development", "keywords": "service-bus, migration, msmq, azure, messaging, resilience, serialization", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "sprint-management": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "process", "keywords": "sprint, planning, retrospective, backlog, agile, scrum, ceremony", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "sprint-retrospective": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "process", "keywords": "retrospective, sprint, metrics, timeline, history, improvements", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
    "supply-chain-security": {
        "license": "MIT",
        "compatibility": "Requires Docker and artifact signing tools. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "devops", "keywords": "supply-chain, sbom, signing, provenance, vulnerability, scanning, slsa", "model-tier": "premium"},
        "allowed-tools": "search/codebase web/fetch run_terminal_command",
    },
    "ux": {
        "license": "MIT",
        "compatibility": "Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code.",
        "metadata": {"category": "architecture", "keywords": "ux, user-experience, journey-mapping, wireframe, accessibility, wcag, components", "model-tier": "standard"},
        "allowed-tools": "search/codebase",
    },
}

# Fields to remove before inserting canonical spec fields.
# Includes spec fields being replaced (license/compatibility/metadata/allowed-tools),
# legacy non-spec fields (context, tags, title) that are not part of the Agent Skills spec.
LEGACY_LEGACY_KEYS_TO_STRIP = {"license", "compatibility", "metadata", "allowed-tools", "context", "tags", "title"}


def build_new_frontmatter(existing_lines, skill_name, fields):
    """Rebuild frontmatter preserving name/description, adding/replacing spec fields."""
    # Parse existing lines into key/value pairs, handling multi-line blocks
    parsed = []  # list of (key, raw_lines) tuples; raw_lines is list of strings
    i = 0
    while i < len(existing_lines):
        line = existing_lines[i]
        m = re.match(r'^(\S[^:]*?):\s*(.*)', line)
        if m:
            key = m.group(1)
            val = m.group(2)
            block_lines = [line]
            # Check if next lines are indented (sub-fields)
            j = i + 1
            while j < len(existing_lines) and existing_lines[j].startswith("  "):
                block_lines.append(existing_lines[j])
                j += 1
            parsed.append((key, block_lines))
            i = j
        else:
            i += 1

    # Build output lines: name, description, then new fields, skip old spec fields
    out = []
    for key, block_lines in parsed:
        if key in LEGACY_KEYS_TO_STRIP:
            continue
        out.extend(block_lines)

    # Now insert new fields after description
    insert_pos = None
    for idx, (key, _) in enumerate([(k, v) for k, v in parsed if k not in LEGACY_KEYS_TO_STRIP]):
        if key == "description":
            insert_pos = idx + 1
            break

    if insert_pos is None:
        insert_pos = len(out)

    new_field_lines = []
    f = fields
    new_field_lines.append(f"license: {f['license']}")
    new_field_lines.append(f'compatibility: "{f["compatibility"]}"')
    meta = f["metadata"]
    new_field_lines.append("metadata:")
    new_field_lines.append(f"  category: {meta['category']}")
    new_field_lines.append(f'  keywords: "{meta["keywords"]}"')
    new_field_lines.append(f"  model-tier: {meta['model-tier']}")
    new_field_lines.append(f'allowed-tools: "{f["allowed-tools"]}"')

    # Rebuild out list in correct order
    clean = []
    for key, block_lines in parsed:
        if key in LEGACY_KEYS_TO_STRIP:
            continue
        clean.extend(block_lines)
        if key == "description":
            clean.extend(new_field_lines)

    # If description not found, append at end
    if insert_pos is None or not any(k == "description" for k, _ in parsed if k not in LEGACY_KEYS_TO_STRIP):
        clean.extend(new_field_lines)

    return clean


def update_skill(skill_name):
    path = os.path.join(SKILLS_DIR, skill_name, "SKILL.md")
    if not os.path.exists(path):
        print(f"  SKIP (no SKILL.md): {skill_name}")
        return

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split into frontmatter and body
    if not content.startswith("---"):
        print(f"  SKIP (no frontmatter): {skill_name}")
        return

    # Find closing ---
    end = content.find("\n---", 3)
    if end == -1:
        print(f"  SKIP (no closing ---): {skill_name}")
        return

    fm_text = content[4:end]  # strip leading ---\n
    body = content[end + 4:]   # strip \n---

    fm_lines = fm_text.splitlines()

    if skill_name not in MAPPING:
        print(f"  SKIP (no mapping): {skill_name}")
        return

    new_lines = build_new_frontmatter(fm_lines, skill_name, MAPPING[skill_name])
    new_fm = "\n".join(new_lines)
    new_content = f"---\n{new_fm}\n---{body}"

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"  UPDATED: {skill_name}")


def main():
    skills = sorted(os.listdir(SKILLS_DIR))
    for skill in skills:
        skill_dir = os.path.join(SKILLS_DIR, skill)
        if os.path.isdir(skill_dir):
            update_skill(skill)


if __name__ == "__main__":
    main()
