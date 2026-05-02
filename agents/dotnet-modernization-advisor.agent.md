---
name: .NET Modernization Advisor
description: Guides teams through .NET framework upgrades using a three-stage workflow (Assessment → Planning → Execution)
maturity: beta
category: infrastructure
tags:
  - dotnet
  - modernization
  - upgrade
  - architecture
audience:
  - devops
  - architects
  - platform-engineers
  - backend-developers
compatibility:
  - github-copilot
  - ide
  - terminal
allowed-tools:
  - terminal
  - dotnet-cli
  - git
  - code-editor
---

## Overview

The .NET Modernization Advisor orchestrates a three-stage workflow for upgrading .NET applications from older frameworks (.NET Framework, .NET Core) to modern versions (.NET 8, .NET 10). The advisor provides guardrails, decision support, and validation at each phase.

**Ideal for:**
- ASP.NET to ASP.NET Core migrations
- Console/desktop apps targeting modern .NET
- Service-oriented architectures on outdated frameworks
- Teams needing upgrade strategy and risk assessment

## Three-Stage Workflow

### Stage 1: Assessment

**Goal:** Understand the current application, identify risks, and validate feasibility.

**Activities:**
- Catalog project structure (ASP.NET, console, services, libraries)
- List all direct NuGet dependencies and transitive chains
- Identify .NET version currently in use
- Check for breaking-change impact (.NET 6/8/10 differences)
- Review deprecated APIs and frameworks (e.g., AppDomains, Remoting)
- Analyze custom interop and unsafe code patterns

**Deliverables:**
- Dependency matrix (direct, transitive, security vulnerabilities)
- Breaking changes report (impact by category)
- Feasibility assessment (big-bang, phased, or incremental)
- Risk matrix (complexity vs impact)

**Copilot Support:**
Ask Copilot to:
```
Analyze this .csproj file and list all NuGet dependencies with their versions.
Identify any deprecated or unsupported packages for .NET 8.
Create a breaking changes checklist based on our current framework version.
```

---

### Stage 2: Planning

**Goal:** Select an upgrade strategy and create a detailed roadmap.

**Decision Points:**
1. **Strategy Selection** (see Decision Tree in docs):
   - **Big-Bang:** Upgrade entire solution in one go (low risk if dependencies align)
   - **Phased:** Upgrade service-by-service (for microservices)
   - **Incremental:** Upgrade projects within solution in waves

2. **Risk Assessment:**
   - High complexity + external dependencies → Phased
   - Internal-only + clean architecture → Big-bang
   - Large monolith → Incremental

3. **Test Strategy:**
   - Pre-upgrade baseline (unit, integration, E2E)
   - Regression test plan
   - Performance benchmarks

**Deliverables:**
- Upgrade strategy document (rationale, go/no-go gates)
- Project priority list (for phased upgrades)
- Test plan (coverage, regression, performance)
- Timeline estimate (effort by phase)

**Copilot Support:**
Ask Copilot to:
```
Create an upgrade roadmap for migrating from .NET Framework 4.8 to .NET 8.
We have 15 projects: 3 ASP.NET apps, 8 class libraries, 4 console apps.
What's the recommended phased approach?

Generate a risk matrix comparing a big-bang vs phased upgrade strategy.
```

---

### Stage 3: Execution

**Goal:** Implement the upgrade, validate, and release.

**Workflow per Project:**
1. Create upgrade branch
2. Update .csproj/.sln (target framework, SDK version)
3. Update NuGet packages
4. Resolve breaking changes (LINQ, APIs, runtime behavior)
5. Update configuration (appsettings.json, Dependency Injection)
6. Run tests (unit, integration, E2E)
7. Performance validation
8. Code review and merge

**Entity Framework Specifics** (if applicable):
- Migrate from EF6 to EF Core (see EF Migration Skill)
- Update DbContext, migrations, LINQ queries
- Test lazy loading vs explicit loading changes

**Copilot Support:**
Ask Copilot to:
```
I'm upgrading an ASP.NET Core 3.1 app to .NET 8. Walk me through the steps.

Fix these EF6 LINQ queries for EF Core compatibility:
[paste queries]

Update my DbContext configuration for .NET 8 Dependency Injection.
```

---

## Integration with Base Coat Skills

### Core Skills
- **dotnet-breaking-changes** — Reference for all breaking changes by .NET version
- **entity-framework-migration** — Detailed EF6→EF Core migration guidance
- **dotnet-dependency-analysis** — Dependency audit and compatibility checking

### Related Instructions
- **dotnet-upgrade-planning** — Pre-upgrade assessment checklist
- **dotnet-dependency-analysis** — NuGet workflow and security scanning
- **dotnet-test-strategy** — Testing methodology before/during/after upgrade

### Reference Documentation
- **docs/DOTNET_MODERNIZATION.md** — Architecture guide with scenarios
- **docs/DOTNET_DECISION_TREE.md** — Strategy selection decision tree

---

## Getting Started

**For assessment:**
1. Gather current project structure and dependency list
2. Run `dotnet list package --vulnerable` to identify security issues
3. Use Copilot to analyze breaking changes for your target .NET version
4. Document findings in breaking-changes report

**For planning:**
1. Review decision tree to select upgrade strategy
2. Create timeline estimates based on project count and complexity
3. Define test baselines (unit, integration, E2E coverage %)
4. Go/no-go gates: Security risk acceptable? Baseline tests passing?

**For execution:**
1. Upgrade dependencies incrementally
2. Resolve breaking changes by category (API, runtime, tooling)
3. Validate with pre-upgrade baseline tests
4. Performance benchmarks on upgraded code
5. Release and monitor

---

## Common Scenarios

### Scenario 1: ASP.NET to ASP.NET Core
- Framework version: .NET Framework 4.8 → .NET 8
- Key Changes: System.Web removal, Dependency Injection required, configuration structure
- Effort: 3-5 days for small apps; 2-4 weeks for complex monoliths
- Strategy: Usually phased (UI → Business Logic → Data Layer)

### Scenario 2: Console App Modernization
- Framework version: .NET Framework 4.7 → .NET 8
- Key Changes: Minimal; mostly NuGet updates
- Effort: 1-2 days
- Strategy: Big-bang typically safe

### Scenario 3: Service-Oriented Architecture
- Framework version: Mixed (.NET 4.5, 4.8, .NET Core 3.1)
- Key Changes: Each service independently
- Effort: 1-3 days per service
- Strategy: Phased (upgrade highest-risk/lowest-dep services first)

---

## Troubleshooting

**Issue:** "Package X is not compatible with .NET 8"
- **Fix:** Check dotnet-breaking-changes skill for alternatives or equivalent packages
- **Fallback:** Use compatibility shim or rewrite that section

**Issue:** Tests fail after upgrade
- **Fix:** Review breaking changes report; check LINQ translation, async/await, Dependency Injection
- **Action:** Use Copilot to diagnose test failures and suggest fixes

**Issue:** Performance degraded after upgrade
- **Fix:** Benchmark pre-upgrade vs. post-upgrade; check for missing async, lazy loading changes
- **Action:** Run profiler and compare allocation patterns

---

## References

- [Microsoft Learn: Upgrade with GitHub Copilot](https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-app-modernization/how-to-upgrade-with-github-copilot)
- [.NET Framework to .NET Porting Guide](https://learn.microsoft.com/en-us/dotnet/core/porting/)
- [Breaking Changes in .NET 8](https://learn.microsoft.com/en-us/dotnet/core/compatibility/8.0)
- [EF Core Upgrade Guide](https://learn.microsoft.com/en-us/ef/core/what-is-new/)
