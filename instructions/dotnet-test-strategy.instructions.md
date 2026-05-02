---
description: Testing methodology and validation strategy for .NET framework upgrades
applyTo: "**/*.csproj"
---

# .NET Test Strategy

Use this instruction to establish testing baselines, design regression tests, and validate .NET upgrades.

## Phase 1: Pre-Upgrade Testing Baseline

### 1. Establish Current State Metrics

Execute and record all metrics:

```powershell
# Unit tests
$unitResults = dotnet test --filter Category=Unit --logger "console;verbosity=quiet" --collect:"XPlat Code Coverage"
# Record: Total passed, failed, skipped, coverage %

# Integration tests
$integResults = dotnet test --filter Category=Integration --logger "console;verbosity=quiet"
# Record: Total passed, failed, skipped, duration

# E2E tests
$e2eResults = dotnet test --filter Category=E2E --logger "console;verbosity=quiet"
# Record: Total passed, failed, skipped, duration, critical scenarios

# Performance baseline
$sw = [System.Diagnostics.Stopwatch]::StartNew()
Invoke-WebRequest "http://localhost:5000/api/health" | Out-Null
$sw.Stop()
Write-Host "Baseline API response: $($sw.ElapsedMilliseconds)ms"

# Memory baseline
$proc = Get-Process aspnetcore -ErrorAction SilentlyContinue
if ($proc) {
    Write-Host "Baseline memory: $($proc.WorkingSet64 / 1MB)MB"
}
```

### 2. Create Baseline Document

Create file: `TEST_BASELINE_PRE_UPGRADE.md`

```markdown
# Pre-Upgrade Test Baseline

**Date:** [YYYY-MM-DD]
**Framework:** .NET Core 3.1 / .NET 5 / .NET Framework 4.8
**Baseline Source:** Commit [HASH]

## Test Execution Results

### Unit Tests
- Total Tests: 1,247
- Passed: 1,247 ✅
- Failed: 0
- Skipped: 0
- Code Coverage: 87%
- Duration: 45 seconds

### Integration Tests
- Total Tests: 156
- Passed: 156 ✅
- Failed: 0
- Skipped: 0
- Duration: 2 minutes 15 seconds
- Database: SQL Server 2019
- Status: All database operations working

### E2E Tests
- Total Tests: 42
- Passed: 42 ✅
- Failed: 0
- Skipped: 0
- Duration: 3 minutes 20 seconds
- Critical Scenarios: [list 3-5 key user flows]

### Performance Metrics (Load Test)
- API Response Time (p50): 45ms
- API Response Time (p95): 120ms
- API Response Time (p99): 250ms
- Throughput: 500 requests/sec
- Memory (idle): 256MB
- Memory (100 concurrent users): 512MB
- CPU (average): 25%
- GC pause time: <50ms

### Browser Compatibility
- Chrome (latest): ✅
- Firefox (latest): ✅
- Safari (latest): ✅
- Edge (latest): ✅

## Test Data

- Test database size: [n] MB
- Test data records: [n]
- Seed time: [n] seconds

## Known Issues (if any)
- [Issue 1]: [Description] (will be addressed in upgrade)

## Sign-Off
- QA Lead: __________  Date: ________
- Dev Lead: __________  Date: ________
```

### 3. Set Acceptance Criteria

Define what "success" looks like post-upgrade:

```markdown
# Post-Upgrade Success Criteria

## Functional Criteria
- [ ] All pre-upgrade tests pass (unit, integration, E2E)
- [ ] No new test failures introduced
- [ ] Code coverage maintained (≥85%)
- [ ] No compilation warnings (CS warnings)

## Performance Criteria
- [ ] API response time within ±10% of baseline
  - Baseline p50: 45ms → Post-upgrade: 40-50ms ✅
- [ ] Memory usage within ±15% of baseline
  - Baseline: 256MB → Post-upgrade: 218-295MB ✅
- [ ] Throughput stable or improved
  - Baseline: 500 req/sec → Post-upgrade: ≥450 req/sec ✅
- [ ] No unexpected GC pauses

## Security Criteria
- [ ] All vulnerabilities (critical/high) resolved
- [ ] No new security warnings from analysis tools
- [ ] CORS, CSP headers unchanged or improved

## Deployment Criteria
- [ ] Application starts successfully
- [ ] Health check endpoints respond
- [ ] Graceful shutdown works
- [ ] Logging functional at all levels
```

---

## Phase 2: Test Coverage Analysis

### 1. Identify Coverage Gaps

```powershell
# Generate detailed coverage report
dotnet test /p:CollectCoverageMetrics=true

# Analyze by category
dotnet list test --filter Category=Unit
dotnet list test --filter Category=Integration
dotnet list test --filter Category=E2E

# Find untested code
# (Use IDE or code coverage tools)
```

### 2. Coverage Target Matrix

| Test Type | Current % | Target % | Gap | Plan |
|-----------|-----------|----------|-----|------|
| Unit Tests | 87% | 90% | 3% | Add missing cases |
| Integration | 62% | 65% | 3% | Test DB layer |
| E2E | 45% | 50% | 5% | Add user workflow |
| **Overall** | **72%** | **75%** | **3%** | — |

### 3. Add Missing Tests (Before Upgrade)

```csharp
// Identify and add tests for uncovered branches
// Use code coverage report to guide

[TestFixture]
public class MissingCoverageTests {
    [Test]
    public void ExceptionHandling_WhenDatabaseDown_RetryLogic() {
        // Test case that was missing
        var mock = new Mock<IDatabase>();
        mock.Setup(d => d.Connect())
            .Throws<TimeoutException>()
            .Throws<TimeoutException>()
            .Returns(true);  // Succeeds on 3rd retry
        
        var svc = new DataService(mock.Object);
        var result = svc.GetData();
        
        Assert.NotNull(result);
        mock.Verify(d => d.Connect(), Times.Exactly(3));
    }
}
```

---

## Phase 3: Regression Test Strategy

### 1. Categorize Tests by Risk

**High-Risk Categories** (must-pass):
- Authentication/Authorization
- Payment processing
- Data persistence
- Critical business logic

**Medium-Risk Categories** (important):
- UI workflows
- Reporting
- Integration points
- Caching

**Low-Risk Categories** (nice-to-have):
- Admin features
- Logging
- Non-critical utilities

### 2. Test Execution Plan

**Pre-Upgrade (Establish baseline):**
```
1. Run all unit tests → Baseline: 1,247 passed
2. Run all integration tests → Baseline: 156 passed
3. Run critical E2E tests → Baseline: 30 of 42 critical passed
4. Collect performance metrics
5. Document in TEST_BASELINE_PRE_UPGRADE.md
```

**During Upgrade (Per project/phase):**
```
1. Update project to .NET 8
2. Update dependencies
3. Resolve breaking changes
4. Run unit tests for that project
   ✅ Expected: All pass
   ❌ If fails: Review breaking changes, fix code
5. Run integration tests
   ✅ Expected: All pass
   ❌ If fails: Review database/API changes
```

**Post-Upgrade (Comprehensive validation):**
```
1. Run ALL unit tests → Expected: 1,247 passed
2. Run ALL integration tests → Expected: 156 passed
3. Run ALL E2E tests → Expected: 42 passed (vs 30 baseline)
4. Verify performance → Expected: Within ±10%
5. Run security scans → Expected: 0 critical/high
6. Load test → Expected: Throughput ≥450 req/sec
7. Browser compatibility → Expected: All green
8. Document results in TEST_RESULTS_POST_UPGRADE.md
```

### 3. Automated Regression Testing

```csharp
// Create test suite that runs on every commit
[TestFixture]
public class RegressionTests {
    private MyDbContext _context;
    
    [SetUp]
    public void Setup() {
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseInMemoryDatabase("TestDb")
            .Options;
        _context = new MyDbContext(options);
    }
    
    [Test]
    public void CriticalFeature_UserRegistration_Works() {
        // Test: User can register
        var user = new User { Email = "test@example.com", Name = "Test" };
        _context.Users.Add(user);
        _context.SaveChanges();
        
        var saved = _context.Users.FirstOrDefault(u => u.Email == "test@example.com");
        Assert.NotNull(saved);
        Assert.AreEqual("Test", saved.Name);
    }
    
    [Test]
    public void CriticalFeature_UserLogin_Works() {
        // Test: User can login
        _context.Users.Add(new User { Email = "test@example.com", Name = "Test" });
        _context.SaveChanges();
        
        var user = _context.Users.FirstOrDefault(u => u.Email == "test@example.com");
        Assert.NotNull(user);
    }
    
    [Test]
    public void CriticalFeature_OrderProcessing_Works() {
        // Test: Orders process correctly
        var user = new User { Email = "test@example.com" };
        _context.Users.Add(user);
        _context.SaveChanges();
        
        var order = new Order { UserId = user.Id, Total = 99.99m };
        _context.Orders.Add(order);
        _context.SaveChanges();
        
        var saved = _context.Orders.Include(o => o.User).FirstOrDefault();
        Assert.NotNull(saved.User);
        Assert.AreEqual(99.99m, saved.Total);
    }
}
```

---

## Phase 4: Data Validation

### 1. Pre-Upgrade Data Snapshot

```powershell
# Export current database schema and sample data
# (For comparison post-upgrade)

# Export schema
$query = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"
sqlcmd -S "Server=localhost" -d "MyDatabase" -Q $query | Out-File "schema_pre_upgrade.txt"

# Export sample records (first 100 of each table)
# Use EF or SQL to export
```

### 2. Data Migration Testing

```csharp
[TestFixture]
public class DataMigrationTests {
    [Test]
    public void DataMigration_OldSchema_MigratesSuccessfully() {
        // Test: Old database schema upgrades without data loss
        
        // 1. Create old schema
        // 2. Insert test data
        // 3. Run EF migration
        // 4. Verify data integrity
        
        var context = new MyDbContext(options);
        var migrationsApplied = context.Database.GetAppliedMigrations().Count();
        Assert.Greater(migrationsApplied, 0);
        
        var users = context.Users.Count();
        Assert.AreEqual(expected: 100, actual: users);
    }
    
    [Test]
    public void DataMigration_Rollback_Works() {
        // Test: Can rollback if needed
        var context = new MyDbContext(options);
        
        // Current state should be latest migration
        var latest = context.Database.GetAppliedMigrations().Last();
        Assert.AreEqual("Migration_NET8_Latest", latest);
    }
}
```

### 3. Post-Upgrade Data Validation

```markdown
# Data Validation Checklist

- [ ] Record count matches pre-upgrade: [n] records
- [ ] Foreign keys intact (no orphaned records)
- [ ] Data types correct (dates, decimals, strings)
- [ ] No NULL values where NOT NULL constraint
- [ ] Indexes rebuilt successfully
- [ ] Calculated/derived fields correct
- [ ] No data corruption detected
- [ ] Query performance acceptable
```

---

## Phase 5: Performance Testing

### 1. Baseline Performance Metrics

```powershell
# Load test: Generate sustained traffic
# Tools: JMeter, k6, or ApacheBench

# Example: Simple load test
1..100 | ForEach-Object {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    Invoke-WebRequest "http://localhost:5000/api/users" -ErrorAction SilentlyContinue | Out-Null
    $sw.Stop()
    [PSCustomObject]@{
        Request = $_
        Time_ms = $sw.ElapsedMilliseconds
    }
} | Export-Csv "baseline_performance.csv" -NoTypeInformation
```

### 2. Performance Acceptance Criteria

```markdown
# Performance Targets (Post-Upgrade)

| Metric | Pre-Upgrade | Target | Pass |
|--------|-------------|--------|------|
| API Response (p50) | 45ms | 40-50ms | ✅ |
| API Response (p99) | 250ms | <275ms | ✅ |
| Throughput | 500 req/s | ≥450 req/s | ✅ |
| Memory (idle) | 256MB | <295MB | ✅ |
| Memory (load) | 512MB | <590MB | ✅ |
| GC pause time | <50ms | <60ms | ✅ |
| Startup time | 5s | <6s | ✅ |
```

### 3. Regression Detection

```csharp
// Automated performance regression test
[Test]
[Performance]
public void Performance_ApiResponse_WithinBaseline() {
    var measurements = new List<int>();
    
    for (int i = 0; i < 100; i++) {
        var sw = System.Diagnostics.Stopwatch.StartNew();
        var response = MakeApiCall();
        sw.Stop();
        measurements.Add((int)sw.ElapsedMilliseconds);
    }
    
    var p50 = measurements.OrderBy(x => x).Skip(50).First();
    var p99 = measurements.OrderBy(x => x).Skip(99).First();
    
    Assert.Less(p50, 50);  // Baseline 45ms +10%
    Assert.Less(p99, 275); // Baseline 250ms +10%
}
```

---

## Phase 6: Security Testing

### 1. Vulnerability Scanning

```powershell
# Scan dependencies
dotnet list package --vulnerable

# OWASP scanning (if integrated)
# Other security tools: Snyk, GitHub Security Advisories

# Record findings:
# - Critical: [count]
# - High: [count]
# - Medium: [count]
# - Low: [count]
```

### 2. Security Test Cases

```csharp
[TestFixture]
public class SecurityTests {
    [Test]
    public void Security_SQLInjection_Prevented() {
        // Test: SQL injection attacks blocked
        var maliciousInput = "1' OR '1'='1";
        var result = _context.Users.Where(u => u.Id.ToString() == maliciousInput).ToList();
        Assert.IsEmpty(result);
    }
    
    [Test]
    public void Security_XSS_Prevented() {
        // Test: XSS attacks prevented
        var xssPayload = "<script>alert('XSS')</script>";
        var user = new User { Name = xssPayload };
        _context.Users.Add(user);
        _context.SaveChanges();
        
        var saved = _context.Users.FirstOrDefault();
        // Framework should encode this on output
        Assert.NotNull(saved);
    }
    
    [Test]
    public void Security_CORS_Configured() {
        // Test: CORS headers correct
        // Verify in middleware configuration
    }
}
```

---

## Phase 7: Post-Upgrade Reporting

### Create Results Document

Create file: `TEST_RESULTS_POST_UPGRADE.md`

```markdown
# Post-Upgrade Test Results

**Date:** [YYYY-MM-DD]
**Framework:** .NET 8 / .NET 10
**Commit:** [HASH]

## Executive Summary
✅ **PASSED** - All tests passing, performance stable, ready for production.

## Test Results

### Unit Tests
- Total: 1,247
- Passed: 1,247 ✅
- Failed: 0
- Coverage: 88% (↑1% from baseline)

### Integration Tests
- Total: 156
- Passed: 156 ✅
- Failed: 0

### E2E Tests
- Total: 42
- Passed: 42 ✅
- Failed: 0

### Performance Comparison
| Metric | Baseline | Post-Upgrade | Δ | Status |
|--------|----------|--------------|---|--------|
| p50 | 45ms | 43ms | -5% | ✅ |
| p99 | 250ms | 235ms | -6% | ✅ |
| Throughput | 500 req/s | 520 req/s | +4% | ✅ |
| Memory | 256MB | 265MB | +3.5% | ✅ |

### Security Status
- Vulnerabilities: 0 critical, 0 high ✅
- Dependency audit: All green ✅

## Deployment Readiness
- [ ] All acceptance criteria met
- [ ] Performance within tolerance
- [ ] Security validated
- [ ] Data integrity confirmed
- [ ] Approved for production deployment

## Approval Sign-Off
- QA Lead: __________  Date: ________
- Engineering Lead: __________  Date: ________
- Product Owner: __________  Date: ________
```

---

## Testing Checklist

Before declaring "Ready for Production":

### Functional Testing
- [ ] Unit tests: 100% pass rate
- [ ] Integration tests: 100% pass rate
- [ ] E2E tests: All critical paths passing
- [ ] Manual smoke test: Core workflows functional
- [ ] Data integrity: No data loss/corruption

### Performance Testing
- [ ] Response time: Within ±10% baseline
- [ ] Throughput: ≥90% of baseline
- [ ] Memory: Within ±15% baseline
- [ ] Load test: Stable under sustained traffic
- [ ] Spike test: Handles traffic spikes

### Security Testing
- [ ] Vulnerability scan: 0 critical/high
- [ ] OWASP top 10: All addressed
- [ ] Dependency audit: All clear
- [ ] Secrets scanning: No exposed credentials

### Deployment Readiness
- [ ] Rollback procedure tested
- [ ] Health checks working
- [ ] Monitoring alerts configured
- [ ] Logging functional
- [ ] Graceful shutdown tested

---

## Next Steps

1. ✅ Establish pre-upgrade baseline (Phase 1)
2. ✅ Analyze and improve coverage (Phase 2)
3. ✅ Design regression test suite (Phase 3)
4. ✅ Validate data migration (Phase 4)
5. ✅ Run performance tests (Phase 5)
6. ✅ Execute security tests (Phase 6)
7. ✅ Generate post-upgrade report (Phase 7)
8. ➡️ Get sign-off for production deployment

**Questions?** Use the `.NET Modernization Advisor` agent for guidance.
