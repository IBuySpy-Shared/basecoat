---
title: .NET Modernization Decision Tree
---

# .NET Modernization Decision Tree

Use this guide to select the right upgrade strategy for your application.

---

## Interactive Decision Tree

```
START: "Should we upgrade our .NET application?"
│
├─ Question 1: "Is the application currently .NET Framework 4.x or .NET Core 3.1?"
│  ├─ NO → "Already on recent version. Consider minor version upgrades."
│  │        (Go to: Version Selection below)
│  │
│  └─ YES → Continue to Question 2
│
├─ Question 2: "Is the application internal-only with no external API contracts?"
│  ├─ NO → Continue to Question 3
│  │
│  └─ YES → "Big-Bang might be viable"
│           Continue to Question 4
│
├─ Question 3: "How many projects do you have?"
│  ├─ <5 projects → "Big-Bang might work if isolated"
│  │               Continue to Question 4
│  │
│  ├─ 5-15 projects → "Phased or Incremental recommended"
│  │                 Continue to Question 5
│  │
│  └─ >15 projects → "Incremental strongly recommended"
│                   Go to: Incremental Path below
│
├─ Question 4: "Do you have >80% test coverage and current performance baselines?"
│  ├─ NO → "Establish baselines first. Defer upgrade."
│  │       Go to: Preparation Phase below
│  │
│  └─ YES → "Ready for Big-Bang or Phased"
│           Continue to Question 5
│
├─ Question 5: "Is your application a microservices architecture?"
│  ├─ YES → Go to: Phased Path below
│  │
│  └─ NO → Continue to Question 6
│
├─ Question 6: "Do you have multiple independent teams managing different parts?"
│  ├─ YES → "Phased or Incremental recommended"
│  │        Continue to Question 7
│  │
│  └─ NO → "Big-Bang or Phased possible"
│           Continue to Question 7
│
├─ Question 7: "What is your deployment frequency?"
│  ├─ Daily/Weekly → "Phased or Incremental (easier rollouts)"
│  │               Go to: Phased Path or Incremental Path
│  │
│  └─ Monthly/Quarterly → "Any strategy works"
│                        Ask Question 8
│
├─ Question 8: "What is your uptime requirement?"
│  ├─ <99.5% (few hours downtime acceptable) → "Any strategy works"
│  │                                           Go to: Big-Bang Path
│  │
│  ├─ 99.5%-99.95% (high availability) → "Phased or Incremental (zero-downtime)"
│  │                                     Go to: Phased Path
│  │
│  └─ >99.95% (critical uptime) → "Incremental only (safest)"
│                                Go to: Incremental Path
│
└─ END: Strategy selected
```

---

## Strategy Paths

### Path A: Big-Bang Strategy

**Recommended For:**
- Internal-only applications
- <5 projects
- Single team
- >80% test coverage
- 1-3 week timeline acceptable
- Lower uptime requirements

**Go/No-Go Gates:**
1. "Can all projects be upgraded simultaneously?" → YES required
2. "Do all projects have comprehensive test coverage?" → YES required
3. "Can we tolerate <1 hour downtime?" → YES required
4. "Are dependencies compatible with .NET 8?" → YES required

**If ALL Yes → Proceed with Big-Bang**

**If ANY No:**
```
Gate 1 No → "Projects have external dependencies" 
          → Consider Phased Path

Gate 2 No → "Insufficient test coverage"
          → Go to: Preparation Phase

Gate 3 No → "Uptime critical"
          → Use Phased or Incremental Path

Gate 4 No → "Dependency incompatibility"
          → Use dotnet-dependency-analysis instruction
          → Plan alternatives
          → Use Phased Path for staged migration
```

**Big-Bang Execution Plan:**
1. Week 1: Assess & plan
   - Inventory dependencies
   - Identify breaking changes
   - Establish test baselines
   
2. Week 2: Execute upgrade
   - Update all projects simultaneously
   - Resolve breaking changes
   - Update configuration
   
3. Week 3: Test & deploy
   - Run full test suite
   - Performance validation
   - Production deployment

---

### Path B: Phased Strategy

**Recommended For:**
- Microservices architecture
- 5-15 projects
- Multiple teams
- Some external integrations
- 2-8 week timeline
- High availability requirements
- Want to validate per phase

**Project Prioritization:**
```
Priority 1: Core dependencies (no dependencies on other projects)
Priority 2: Utilities & shared libraries (depend on Priority 1)
Priority 3: Business logic services (depend on Priority 2)
Priority 4: User-facing services (depend on Priority 3)
Priority 5: External integrations (high risk, last)
```

**Go/No-Go Gates (per phase):**
1. "Previous phase fully deployed and stable?" → YES required
2. "All phase tests passing?" → YES required
3. "Performance within baselines?" → YES required
4. "No critical production issues?" → YES required

**If ANY No:**
```
Gate 1 No → "Previous phase not stable"
          → Delay or rollback previous phase
          → Investigate root cause
          → Re-plan current phase

Gate 2 No → "Phase tests failing"
          → Review breaking changes for this phase
          → Fix code, re-run tests
          → Escalate if blocker found

Gate 3 No → "Performance regression detected"
          → Profile and identify hotspot
          → Optimize or defer change
          → Document for post-phase review

Gate 4 No → "Production issues"
          → Pause phased upgrade
          → Fix issues
          → Resume upgrade after stabilization
```

**Phased Execution Example (Microservices):**

Phase 1 (Week 1): Shared libraries
- Upgrade: Shared.Core, Shared.Utils
- Test: Unit & integration
- Deploy: Internal NuGet feed

Phase 2 (Week 2-3): Foundation services
- Upgrade: Service.Auth, Service.Config
- Test: Full suite + integration with Phase 1
- Deploy: Canary (10%) → 100%

Phase 3 (Week 4-5): Core services
- Upgrade: Service.User, Service.Order
- Test: Full suite + cross-service integration
- Deploy: Canary → 100%

Phase 4 (Week 6-7): Client services
- Upgrade: Service.API, Service.Web
- Test: Full suite + E2E tests
- Deploy: Canary → 100%

Phase 5 (Week 8): Integration & monitoring
- Full integration testing (all services)
- Performance comparison (old vs new)
- Monitoring validation
- Post-upgrade support

---

### Path C: Incremental Strategy

**Recommended For:**
- Large monoliths (10+ projects)
- Complex dependency graphs
- Multiple teams with async workflows
- 4-12 week timeline
- Critical uptime requirements
- Minimal parallelization

**Project Prioritization Matrix:**

| Priority | Type | Dependencies | Complexity | Timeline |
|----------|------|--------------|-----------|----------|
| 1 | Utility library | None | Low | Week 1 |
| 2 | Data access | Depends on 1 | High | Week 2-3 |
| 3 | Business logic | Depends on 2 | High | Week 3-4 |
| 4 | Services | Depends on 3 | Medium | Week 4-5 |
| 5 | UI/API | Depends on 4 | Medium | Week 5-6 |
| 6 | Integration | All | High | Week 6-7 |

**Go/No-Go Gates (per project):**
1. "Project builds without errors?" → YES required
2. "All unit tests passing?" → YES required
3. "Integration tests passing?" → YES required
4. "Performance baseline met?" → YES required
5. "No breaking changes issues?" → YES required

**If ANY No:** Stop, fix, re-test before moving to next project.

**Incremental Execution:**

Each project goes through:
```
1. Upgrade (.csproj, frameworks)
2. Dependencies (NuGet update)
3. Code fixes (breaking changes)
4. Testing (unit → integration → performance)
5. Code review (peer review)
6. Deployment (merge to main, deploy)
7. Monitoring (verify in production)
```

After all projects upgraded:
```
8. Full system integration testing (all upgraded)
9. End-to-end tests (critical user workflows)
10. Performance comparison (old vs new)
11. Rollback preparation (keep old version ready)
12. Production deployment (phased rollout)
```

---

## Preparation Phase

**If you answered NO to Question 4 above:**

### Task 1: Establish Test Coverage
```
Current state: <80% coverage?

Action:
1. Identify coverage gaps (use code coverage tool)
2. Add missing unit tests (focus on critical paths)
3. Add integration tests (database, external APIs)
4. Target: ≥85% code coverage

Timeline: 2-4 weeks
```

### Task 2: Establish Performance Baselines
```
Current state: No performance metrics?

Action:
1. Set up monitoring (response time, memory, CPU)
2. Load test (sustained and spike scenarios)
3. Document baseline (p50, p95, p99 latency)
4. Profile application (identify hotspots)

Timeline: 1-2 weeks
```

### Task 3: Stabilize Application
```
Current state: Known production issues?

Action:
1. Fix critical bugs
2. Close old technical debt
3. Update documentation
4. Prepare team for upgrade

Timeline: 1-4 weeks
```

### Return to Decision Tree
Once preparation complete, restart at Question 1.

---

## Version Selection

**If your application is already on .NET 5/6/7:**

```
Question: "Should we jump to .NET 8/10 now or wait?"

├─ ".NET 8 is LTS (long-term support)"
│  └─ Recommended: Upgrade to .NET 8 (widely supported until Nov 2026)
│
└─ ".NET 9/10 may have newer features"
   ├─ .NET 9 (STS, short-term support, 18 months)
   │ └─ Only if: Need new features, can re-upgrade to .NET 10 in 6 months
   │
   └─ .NET 10 (LTS, long-term support, 3 years from release)
      └─ Best choice: Wait for .NET 10 LTS when released
```

**Recommended Upgrade Path:**
- If on .NET 5: Upgrade to .NET 8 (LTS)
- If on .NET 6: Consider minor version upgrade OR go to .NET 8
- If on .NET 7: Upgrade to .NET 8 (LTS) within 6 months
- If on .NET 8: Stay until .NET 10 LTS released, then plan upgrade

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: "Upgrade + Refactor Simultaneously"

```
Decision: Upgrade AND refactor code at same time

Problem:
- Can't isolate upgrade issues
- Refactoring breaks introduce new bugs
- Hard to identify root cause

Solution:
- Upgrade first (framework, dependencies)
- Test thoroughly (validate upgrade works)
- THEN refactor (separate task)
```

### ❌ Anti-Pattern 2: "Skip Testing Phase"

```
Decision: "We'll test in production"

Problem:
- Issues only appear under load
- Can't rollback quickly
- Customer impact = business impact

Solution:
- Establish baselines PRE-upgrade
- Run full test suite during upgrade
- Performance validate in staging
- Only then deploy to production
```

### ❌ Anti-Pattern 3: "Ignore Breaking Changes"

```
Decision: "Just upgrade and see what breaks"

Problem:
- Breakage often cascades
- Some breaking changes are subtle
- Hard to debug after-the-fact

Solution:
- Read breaking changes reference BEFORE upgrade
- Plan for known breaking changes upfront
- Test against each breaking change category
- Resolve systematically (one category at a time)
```

### ❌ Anti-Pattern 4: "Upgrade Without Rollback Plan"

```
Decision: "If it breaks, we'll just fix it"

Problem:
- No rollback = potential long downtime
- Customer frustration increases over time
- Can't make quick decision to revert

Solution:
- Test rollback procedure (at least once)
- Keep previous version deployable
- Have RTO (recovery time) target
- Plan A/B deployment if needed
```

---

## Escalation Paths

**If you're blocked on strategy selection:**

1. **Dependency Issue** → Use `dotnet-dependency-analysis` instruction
2. **Test Coverage Gap** → Go to Preparation Phase
3. **Architecture Question** → Ask `.NET Modernization Advisor` agent
4. **Risk Uncertainty** → Document risk, get stakeholder approval
5. **Timeline Pressure** → Re-prioritize, use Phased/Incremental
6. **Other** → File issue in repository for team discussion

---

## Quick Reference

| Scenario | Recommended | Why |
|----------|-------------|-----|
| Internal web app, 3 projects, >80% coverage | Big-Bang | Simple, direct |
| E-commerce site, 8 microservices | Phased | Validate per service |
| Enterprise LOB app, 15+ projects, complex | Incremental | Lowest risk |
| API with limited tests | Defer | Establish baselines first |
| Already on .NET 5 | Upgrade to .NET 8 | LTS version stability |
| Critical uptime >99.95% | Incremental | Zero-downtime guarantee |

---

## Decision Confirmation Checklist

**Before proceeding with your selected strategy:**

- [ ] Strategy selected: ________________
- [ ] Timeline agreed: ________________
- [ ] Team capacity confirmed
- [ ] Test coverage at acceptable level (>80%)
- [ ] Performance baselines established
- [ ] Rollback procedure prepared
- [ ] Monitoring/alerting configured
- [ ] Stakeholder approval obtained
- [ ] Communication plan ready
- [ ] Go/No-Go gates documented

**Confirmed by:**
- Architecture Lead: __________ Date: ____
- Engineering Lead: __________ Date: ____
- Product Owner: __________ Date: ____

**Proceed to:** `dotnet-upgrade-planning` instruction for detailed execution planning.
