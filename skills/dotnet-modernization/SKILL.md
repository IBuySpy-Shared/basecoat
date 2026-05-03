---
name: dotnet-modernization
description: Comprehensive guidance for upgrading .NET applications through assessment, planning, and execution phases
maturity: beta
category: infrastructure
tags:
  - dotnet
  - upgrade
  - modernization
  - framework-migration
audience:
  - backend-developers
  - devops
  - architects
  - platform-engineers
compatibility:
  - github-copilot
  - ide
  - terminal
  - cli
allowed-tools:
  - terminal
  - dotnet-cli
  - git
  - text-editor
---

## Three-Stage .NET Upgrade Workflow

This skill guides you through a structured approach to modernizing .NET applications from legacy frameworks to current versions (.NET 8, .NET 10).

---

## Stage 1: Assessment

### 1.1 Project Inventory

Create a comprehensive inventory of all projects in your solution:

```powershell
# List all projects and their target frameworks
dotnet sln list

# Show detailed project information
Get-ChildItem -Recurse -Filter "*.csproj" | ForEach-Object {
    [xml]$proj = Get-Content $_.FullName
    [PSCustomObject]@{
        Project = $_.Name
        Path = $_.DirectoryName
        TargetFramework = $proj.Project.PropertyGroup.TargetFramework
    }
}
```

**Checklist:**
- [ ] Total number of projects: ___
- [ ] Project types: ASP.NET, Console, Library, Tests, etc.
- [ ] Current framework versions: .NET Framework 4.x, .NET Core 3.1, .NET 5/6/7, etc.
- [ ] Entry points: Executable projects, startup logic

### 1.2 Dependency Analysis

Analyze all NuGet dependencies for compatibility issues:

```powershell
# List all packages with known vulnerabilities
dotnet list package --vulnerable

# Check for deprecated packages
dotnet list package --outdated

# Export dependency tree
dotnet list package --format json > dependencies.json
```

Ask Copilot:
```
Analyze this dependency list and identify packages that may not support .NET 8:
[paste output from dotnet list package]

Which packages have community-provided .NET Core equivalents?
What's the recommended migration path for [deprecated package]?
```

**Checklist:**
- [ ] All direct dependencies identified
- [ ] Transitive dependency conflicts resolved
- [ ] Security vulnerabilities assessed
- [ ] Community alternatives identified for deprecated packages

### 1.3 Breaking Changes Assessment

Identify breaking changes between your current and target .NET version:

**See:** `references/breaking-changes.md` for detailed catalog

Common categories:
- **API Changes:** Removed or obsolete namespaces/types
- **Runtime Behavior:** Threading, async, garbage collection changes
- **Framework Removal:** System.Web, Remoting, AppDomains
- **Configuration:** appsettings.json structure, Dependency Injection
- **Data Access:** EF6 → EF Core differences (if applicable)

Ask Copilot:
```
What breaking changes do I need to address when upgrading from .NET Core 3.1 to .NET 8?
Highlight: ASP.NET, Entity Framework, and data access patterns.

Which breaking changes are likely to affect this code snippet?
[paste code sample]
```

**Checklist:**
- [ ] Breaking changes by category documented
- [ ] Code samples identified for each category
- [ ] Mitigation strategies per breaking change understood

### 1.4 Feasibility Report

Document your assessment findings:

```markdown
# .NET Upgrade Assessment Report

## Current State
- Solution: [name]
- Projects: [count] ([ASP.NET], [libraries], [consoles], [tests])
- Current Framework: [.NET Framework 4.8, .NET Core 3.1, etc.]
- Target Framework: [.NET 8, .NET 10]

## Dependency Status
- Total direct dependencies: [n]
- Compatible with target: [n] ([%])
- Incompatible: [n] (see list below)
- Vulnerable packages: [n] (see list below)

## Breaking Changes Impact (by complexity)
- Low complexity: [count] items
- Medium complexity: [count] items
- High complexity: [count] items (see detailed analysis)

## Recommendation
- Strategy: Big-bang / Phased / Incremental
- Estimated effort: [days]
- Risk level: Low / Medium / High
- Go/no-go decision: Proceed / Schedule for later / Escalate

## Next Steps
1. [specific action]
2. [specific action]
```

---

## Stage 2: Planning

### 2.1 Strategy Selection

See `DOTNET_DECISION_TREE.md` for detailed decision flowchart.

**Big-Bang Strategy:**
- **When:** All dependencies align, internal-only projects, no external constraints
- **Pros:** Simple, one-time effort, clear success criteria
- **Cons:** All tests fail simultaneously, harder to isolate issues
- **Timeline:** 1-3 weeks for most applications

**Phased Strategy:**
- **When:** Microservices, dependency trees, external integrations
- **Pros:** Incremental progress, isolate issues, rollback capability per phase
- **Cons:** More planning, coordination across teams
- **Timeline:** 2-8 weeks depending on service count

**Incremental Strategy:**
- **When:** Large monoliths, mixed frameworks
- **Pros:** Lowest risk, easiest to test per project
- **Cons:** Longest timeline, coordination challenges
- **Timeline:** 4-12 weeks depending on project count

Ask Copilot:
```
We have 15 projects: 3 ASP.NET apps, 8 libraries, 4 console apps.
Recommend an upgrade strategy (big-bang vs. phased vs. incremental).
Consider dependencies and risk.

Estimate effort for each phase.
```

### 2.2 Project Priority Matrix

For phased/incremental upgrades, prioritize projects:

```markdown
## Project Priority

| Project | Type | Dependencies | Complexity | Risk | Priority |
|---------|------|--------------|-----------|------|----------|
| Lib.Core | Library | None | Low | Low | 1 |
| Lib.Data | Library | Lib.Core | Medium | Medium | 2 |
| Service.API | ASP.NET | Lib.Data, Lib.Core | High | Medium | 3 |
| App.UI | Console | Lib.Core | Low | Low | 4 |
```

**Prioritization Rules:**
1. **High Priority:** Low dependencies, low complexity, high usage
2. **Medium Priority:** Medium dependencies, medium complexity
3. **Low Priority:** Complex, rare usage, many dependents

### 2.3 Test Baseline Strategy

Establish pre-upgrade testing baseline:

```powershell
# Run all tests and capture coverage
dotnet test --logger "console;verbosity=detailed" --collect:"XPlat Code Coverage"

# Generate coverage report
reportgenerator -reports:"coverage.cobertura.xml" -targetdir:"coverage-report"
```

**Test Categories:**
- **Unit Tests:** Fast, isolated, high coverage (target: 80%+)
- **Integration Tests:** Database, API, moderate coverage (target: 60%+)
- **E2E Tests:** Full workflow, critical paths only (target: key scenarios)
- **Performance Tests:** Baseline metrics (CPU, memory, response time)

**Baseline Documentation:**
```markdown
## Pre-Upgrade Test Baseline

- Unit Tests: [count] passed, coverage [%]
- Integration Tests: [count] passed
- E2E Tests: [count] passed
- Performance Baseline:
  - API response time (p50/p95/p99): [ms]
  - Memory usage: [MB]
  - CPU usage: [%]
```

### 2.4 Timeline & Milestones

Create a project timeline:

```markdown
## Upgrade Timeline

| Phase | Projects | Effort | Start | End | Dependencies |
|-------|----------|--------|-------|-----|--------------|
| Phase 1 | Lib.Core | 3d | Day 1 | Day 3 | None |
| Phase 2 | Lib.Data | 5d | Day 4 | Day 8 | Phase 1 complete |
| Phase 3 | Service.API | 7d | Day 9 | Day 15 | Phase 2 complete |
| Phase 4 | App.UI | 2d | Day 16 | Day 17 | Phase 3 complete |
| Phase 5 | Testing, Release | 3d | Day 18 | Day 20 | All complete |
```

---

## Stage 3: Execution

### 3.1 Per-Project Upgrade Workflow

For each project in priority order:

**Step 1: Create Branch**
```bash
git checkout -b feat/dotnet8-upgrade-<project-name>
```

**Step 2: Update Project File**
```xml
<!-- In .csproj, change TargetFramework -->
<PropertyGroup>
  <TargetFramework>net8.0</TargetFramework>  <!-- or net10.0, etc. -->
  <LangVersion>latest</LangVersion>
  <Nullable>enable</Nullable>
</PropertyGroup>
```

**Step 3: Update NuGet Packages**
```powershell
# List outdated packages
dotnet list package --outdated

# Update packages
dotnet package update

# Or selective update
dotnet add package PackageName --version 8.0.0
```

**Step 4: Resolve Breaking Changes**

By category (see `references/breaking-changes.md`):
- API Changes: Update namespaces, use new APIs
- Runtime Changes: Review async/await, threading
- Configuration: Update appsettings structure
- Data Access: EF6→EF Core migration (see related skill)

Ask Copilot:
```
Fix these compilation errors after upgrading to .NET 8:
[paste errors]

Update this code for .NET 8 breaking changes:
[paste code snippet]
```

**Step 5: Update Configuration**

```json
// appsettings.json structure may have changed
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;"
  }
}
```

Update Dependency Injection registration:
```csharp
// Program.cs (ASP.NET 6+) vs Startup.cs (older)
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IMyService, MyService>();
var app = builder.Build();
```

**Step 6: Run Tests**
```powershell
# Full test suite
dotnet test

# With coverage
dotnet test /p:CollectCoverageMetrics=true

# Specific test category
dotnet test --filter Category=Integration
```

**Step 7: Performance Validation**
```powershell
# Compare baseline metrics
# - Response time
# - Memory allocation
# - GC behavior
# - CPU usage

# Document any regressions
```

**Step 8: Code Review & Merge**
- Verify tests pass
- Check performance baseline
- Code review for breaking change fixes
- Merge to main and verify CI/CD

### 3.2 Entity Framework Migration (if applicable)

See `entity-framework-migration` skill for detailed guidance:

```csharp
// Key changes: EF6 → EF Core
// 1. DbContext configuration
// 2. Migration generation
// 3. Lazy loading → Explicit loading
// 4. LINQ translation
```

### 3.3 Validation Checklist

After each project upgrade:

- [ ] Project compiles without errors
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (or manually verified)
- [ ] Performance metrics within tolerance (±10%)
- [ ] No security warnings
- [ ] Code review approved
- [ ] Merged to main branch

---

## Common Patterns & Anti-Patterns

### ✓ Good Practices

1. **Test Early, Test Often**
   - Run tests after every breaking change fix
   - Validate performance baseline immediately

2. **Upgrade Dependencies First**
   - Update NuGet packages before changing code
   - Compile often to catch issues early

3. **Isolate Changes**
   - One breaking change category at a time
   - Separate commits for clarity

4. **Document As You Go**
   - Record tricky migrations
   - Create reusable snippets

### ✗ Anti-Patterns

1. **Big-Bang Code Refactoring**
   - Don't refactor while upgrading
   - Separate concerns: upgrade first, refactor later

2. **Skipping Tests**
   - Every stage needs test validation
   - Baseline comparison is mandatory

3. **Ignoring Performance**
   - .NET 8 can regress if async/await patterns change
   - Benchmark before considering "done"

4. **Phased Without Compatibility**
   - Ensure old/new versions can coexist
   - Version mismatch can hide bugs

---

## Troubleshooting

### Compilation Errors

**Problem:** "Type X not found"
```
Solution: Check if namespace moved or type was removed.
Use Copilot: "This type worked in .NET Framework 4.8 but not .NET 8. What's the replacement?"
```

**Problem:** "Assembly version mismatch"
```
Solution: NuGet transitive dependency conflict.
Run: dotnet list package --framework net8.0
Review: binding redirects (legacy) or AssemblyBinding in app.config
```

### Test Failures

**Problem:** Tests fail after upgrade
```
1. Run a single failing test with verbose output
2. Check for breaking changes in that category
3. Use Copilot to compare old vs. new API usage
4. Update test or code accordingly
```

**Problem:** Async/await deadlocks
```
Solution: .NET 5+ changed SynchronizationContext behavior.
Action: Review ConfigureAwait(false) usage
Verify: No .Wait() or .Result on Tasks (blocking)
```

### Performance Regressions

**Problem:** App slower after upgrade
```
1. Measure baseline (response time, memory, GC)
2. Profile: dotnet trace, PerfView, or IDE profiler
3. Check: Async patterns, collection allocations, GC pressure
4. Compare: Pre-upgrade vs. post-upgrade traces
5. Optimize: Address hotspots (may be unrelated to upgrade)
```

---

## Additional Resources

### Related Skills
- **dotnet-breaking-changes** — Detailed catalog of breaking changes by .NET version
- **entity-framework-migration** — EF6 to EF Core migration workflow
- **dotnet-dependency-analysis** — NuGet audit and security scanning

### Related Instructions
- **dotnet-upgrade-planning** — Pre-assessment checklist
- **dotnet-dependency-analysis** — Dependency workflow
- **dotnet-test-strategy** — Testing methodology

### External References
- [Microsoft Upgrade with Copilot Guide](https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-app-modernization/how-to-upgrade-with-github-copilot)
- [.NET Framework to .NET Porting](https://learn.microsoft.com/en-us/dotnet/core/porting/)
- [.NET Breaking Changes](https://learn.microsoft.com/en-us/dotnet/core/compatibility/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)

---

## Next Steps

1. **Run Assessment** → Use Stage 1 checklist to inventory and analyze
2. **Create Plan** → Use Strategy Selection and Timeline templates
3. **Execute Phased** → Follow per-project workflow
4. **Validate** → Compare post-upgrade baselines
5. **Release** → Tag and deploy with monitoring

**Questions?** Use the `dotnet-modernization-advisor` agent to orchestrate this workflow.
