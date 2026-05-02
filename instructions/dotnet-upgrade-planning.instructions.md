---
description: Pre-upgrade assessment and strategy selection for .NET framework modernization
applyTo: "**/.csproj"
---

# .NET Upgrade Planning

Use this instruction to assess your application's readiness for a .NET framework upgrade and select the appropriate upgrade strategy.

## Phase 1: Pre-Upgrade Assessment

### 1. Project Inventory

Execute:
```powershell
# List all projects
dotnet sln list

# Show frameworks
Get-ChildItem -Recurse -Filter "*.csproj" | ForEach-Object {
    $name = $_.Name
    $framework = Select-String -Path $_.FullName -Pattern '<TargetFramework>' | 
                 ForEach-Object { $_.Line -replace '.*<TargetFramework>(.*)</TargetFramework>.*', '$1' }
    "$name : $framework"
}
```

**Record:**
- [ ] Total projects: ___
- [ ] ASP.NET / Web apps: ___
- [ ] Console / Desktop apps: ___
- [ ] Libraries: ___
- [ ] Test projects: ___

### 2. Dependency Analysis

Execute:
```powershell
# Check for vulnerable packages
dotnet list package --vulnerable

# Show all packages
dotnet list package

# Export for analysis
dotnet list package --format json > dependencies.json
```

**Record:**
- [ ] Total direct dependencies: ___
- [ ] Vulnerable packages: ___
- [ ] Deprecated packages: ___
- [ ] NuGet packages requiring .NET 8+ : ___

### 3. Breaking Changes Impact

Review: `dotnet-modernization/references/breaking-changes.md`

**High-impact patterns to check:**
```csharp
// System.Web usage (will be removed)
using System.Web;
var ctx = HttpContext.Current;

// AppDomains (removed)
AppDomain.CreateDomain("child");

// Entity Framework 6 (migrate to EF Core)
public DbSet<User> Users { get; set; }  // Old pattern

// Serialization changes
[DataContract] public class MyClass { }
```

**Record:**
- [ ] System.Web usage found: YES / NO
- [ ] AppDomain usage found: YES / NO
- [ ] Entity Framework 6 usage found: YES / NO
- [ ] Custom serialization found: YES / NO

### 4. Architecture Review

Answer these questions:

| Question | Answer | Impact |
|----------|--------|--------|
| Are all projects internal-only (no external APIs)? | YES / NO | Affects strategy complexity |
| Are projects loosely coupled? | YES / NO | Affects parallelization |
| Is there comprehensive test coverage (80%+)? | YES / NO | Affects validation confidence |
| Are services deployable independently? | YES / NO | Affects phased upgrade feasibility |
| Is there active monitoring in production? | YES / NO | Affects risk post-deployment |

---

## Phase 2: Strategy Selection

### Decision Framework

**Choose ONE strategy:**

#### Strategy A: Big-Bang Upgrade
**When:**
- ✓ All projects internal-only
- ✓ No external API contracts
- ✓ <5 projects total
- ✓ Comprehensive test coverage
- ✓ Single team managing upgrade

**Timeline:** 1-3 weeks

**Effort Estimate:** [Projects] × 3-5 days

**Risk Level:** 🟡 Medium (all tests fail simultaneously)

#### Strategy B: Phased Upgrade
**When:**
- ✓ Microservices architecture
- ✓ Some external integrations
- ✓ Multiple teams
- ✓ Need to validate per phase
- ✓ Can deploy incrementally

**Timeline:** 2-8 weeks

**Effort Estimate:** (Phases × 1-2 weeks) + integration testing

**Risk Level:** 🟢 Low (isolate issues per phase)

#### Strategy C: Incremental Upgrade
**When:**
- ✓ Large monolith (10+ projects)
- ✓ Mixed-ownership teams
- ✓ Complex dependency graph
- ✓ Can't test all projects simultaneously
- ✓ Need to prioritize high-impact items

**Timeline:** 4-12 weeks

**Effort Estimate:** (Projects / 3) × 2-3 weeks

**Risk Level:** 🟢 Low (per-project isolation)

### Go/No-Go Decision Gate 1: Strategy Viability

**PASS if:**
- [ ] Strategy selected and documented
- [ ] Team agrees with approach
- [ ] Prerequisites met (test coverage, monitoring, etc.)
- [ ] Estimated timeline acceptable

**If NO on any:**
- Escalate to stakeholders
- Adjust strategy or defer upgrade

---

## Phase 3: Project Prioritization (for Phased/Incremental)

### Priority Matrix

Create table:

| Project | Type | Dependents | Complexity | Risk | Priority | Est. Effort |
|---------|------|-----------|-----------|------|----------|------------|
| Lib.Core | Library | 8 | Low | Low | 1 | 3d |
| Lib.Data | Library | 5 | High | Medium | 2 | 5d |
| Service.API | ASP.NET | 2 | Medium | Medium | 3 | 7d |
| App.UI | Console | 0 | Low | Low | 4 | 2d |

**Prioritization Rules:**
1. **Lowest dependencies first** (no blockers)
2. **Lowest complexity second** (easier to validate)
3. **Highest reusability third** (blocks others)

### Go/No-Go Decision Gate 2: Priority & Capacity

**PASS if:**
- [ ] Projects prioritized with rationale
- [ ] Estimated effort fits timeline
- [ ] Team capacity allocated
- [ ] Parallel work planned (if applicable)

**If NO on any:**
- Negotiate timeline
- Adjust capacity/team allocation
- Reduce scope

---

## Phase 4: Test Baseline Establishment

### Current State Baseline

Execute and record:

```powershell
# Unit tests
dotnet test --filter Category=Unit --logger "console;verbosity=quiet"
# Record: Total tests passed, coverage %

# Integration tests
dotnet test --filter Category=Integration --logger "console;verbosity=quiet"
# Record: Total tests passed

# E2E tests
dotnet test --filter Category=E2E --logger "console;verbosity=quiet"
# Record: Total tests passed, scenario count

# Performance baseline (sample)
Measure-Command { Invoke-WebRequest "http://localhost:5000/api/health" } | 
    Select-Object TotalMilliseconds
# Record: Baseline response time (ms)
```

### Baseline Documentation

Create file: `UPGRADE_BASELINE.md`

```markdown
# .NET Upgrade Baseline

**Date:** [date]
**Baseline Source:** .NET Framework 4.8 / .NET Core 3.1 / [version]
**Target Framework:** .NET 8 / .NET 10

## Test Results

### Unit Tests
- Total: 1,247
- Passed: 1,247
- Coverage: 87%

### Integration Tests
- Total: 156
- Passed: 156
- Duration: 45 seconds

### E2E Tests
- Total: 42
- Passed: 42
- Duration: 120 seconds

### Performance Baseline
- API response time (p50): 45ms
- API response time (p99): 180ms
- Memory (idle): 256MB
- Memory (under load): 512MB
```

### Go/No-Go Decision Gate 3: Test Readiness

**PASS if:**
- [ ] All test categories baseline established
- [ ] Coverage ≥80% (unit), ≥60% (integration)
- [ ] Performance metrics captured
- [ ] Team confident in test harness

**If NO on any:**
- Run more tests, improve coverage
- Establish performance instrumentation
- Defer upgrade until ready

---

## Phase 5: Risk & Mitigation Planning

### Risk Matrix

Assess each risk:

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Database migration failure | Low | High | Test migrations in staging first |
| Performance regression | Medium | High | Establish baseline, profile after |
| Third-party API breaking | Low | Medium | Contact vendors, test integrations |
| Data corruption | Low | Critical | Backup, test rollback procedure |
| Rollback requirement | Low | High | Keep old version deployable |

### Mitigation Checklist

- [ ] Database backups tested
- [ ] Rollback procedure documented and tested
- [ ] Staging environment mirrors production
- [ ] Monitoring alerts configured
- [ ] On-call team assigned for go-live
- [ ] Communication plan to stakeholders

### Go/No-Go Decision Gate 4: Risk Acceptance

**PASS if:**
- [ ] All risks identified and assessed
- [ ] Mitigations documented
- [ ] Stakeholders approve risk level
- [ ] Team confident in rollback

**If NO on any:**
- Document risk waiver, get approval
- Or defer upgrade

---

## Phase 6: Timeline & Milestone Planning

### Sample Timeline (Big-Bang, 5 Projects)

| Week | Phase | Activities | Gate |
|------|-------|-----------|------|
| 1 | Prep | Upgrade dependencies, resolve breaking changes | All tests pass |
| 2 | Execution | Code updates, configuration changes | Feature parity |
| 3 | Testing | Regression testing, performance validation | Baseline met |
| 4 | Deployment | Staging deployment, user acceptance | Approval |
| 5 | Production | Production deployment, monitoring | Go/no-go |

### Sample Timeline (Phased, Microservices)

| Week | Phase | Services | Gate |
|------|-------|----------|------|
| 1 | Phase 1 | lib-core → lib-data | All tests pass |
| 2-3 | Phase 2 | service-api-1, service-api-2 | Integration tests |
| 4-5 | Phase 3 | service-web, service-worker | End-to-end tests |
| 6 | Integration | All services together | Cross-service validation |
| 7 | Production | Deploy to production | Monitor |

---

## Final Go/No-Go Decision

**Date:** _________

Review all gates:
- [ ] Strategy selected and viable
- [ ] Priorities defined and capacity allocated
- [ ] Test baselines established
- [ ] Risks mitigated and accepted
- [ ] Timeline agreed upon
- [ ] Stakeholder sign-off obtained

**Decision:** ✅ **APPROVED** / ❌ **DEFER** / ⚠️ **CONDITIONAL**

**Approvers:**
- Architecture: __________________
- Product: __________________
- Ops/DevOps: __________________

**Conditional approval notes (if applicable):**

---

## Escalation Path

If **NO** on any gate:

1. Document specific blocker
2. Propose workaround or mitigation
3. Get stakeholder decision (proceed / defer / re-scope)
4. Update this plan accordingly

**Escalation contact:** __________________

---

## Proceed to Execution

Once approved, start Phase 1 of the upgrade using:
- **Skill:** `dotnet-modernization` (three-stage workflow)
- **Instruction:** `dotnet-dependency-analysis` (dependency workflow)
- **Instruction:** `dotnet-test-strategy` (testing methodology)
