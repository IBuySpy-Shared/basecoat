---
description: NuGet dependency analysis and compatibility checking for .NET upgrades
applyTo: "**/*.csproj"
---

# .NET Dependency Analysis

Use this instruction to analyze NuGet package dependencies for compatibility with your target .NET version.

## Phase 1: Dependency Audit

### 1. Generate Dependency Report

Execute these commands:

```powershell
# List all packages with vulnerability status
dotnet list package --vulnerable

# Show all packages (organized by project)
dotnet list package

# Export as JSON for analysis
dotnet list package --format json | Out-File "dependencies.json" -Encoding UTF8

# Show outdated packages
dotnet list package --outdated

# Export for Excel/CSV analysis
dotnet list package --format json > dependencies-full.json
Get-Content dependencies-full.json | ConvertFrom-Json | 
    Select-Object -ExpandProperty projects | 
    ForEach-Object { $_.frameworks | 
    ForEach-Object { $_.topLevelPackages } } | 
    Export-Csv -Path "packages.csv" -NoTypeInformation
```

### 2. Inventory Direct Dependencies

Create table in your planning document:

```markdown
# Direct Dependencies Inventory

| Project | Package | Version | Latest | Target Compat | Notes |
|---------|---------|---------|--------|---------------|-------|
| Lib.Core | Newtonsoft.Json | 12.0.3 | 13.0.1 | ✅ Yes | |
| Lib.Core | NLog | 4.7.0 | 5.0.5 | ⚠️ Check | |
| Service.API | EntityFramework | 6.4.4 | (deprecated) | ❌ No | Migrate to EF Core |
| Service.API | Microsoft.AspNetCore | 3.1.0 | 8.0.0 | ✅ Yes | |
```

**For each package, determine:**
- ✅ **Compatible:** Supports .NET 8/10 natively
- ⚠️ **Verify:** Check compatibility matrix before upgrading
- ❌ **Incompatible:** No .NET 8/10 support, need alternative
- 🔄 **Deprecated:** Package no longer maintained, find replacement

### 3. Check NuGet Package Compatibility

For each package:

**Option A: NuGet.org (Web)**
1. Visit https://www.nuget.org/packages/[PackageName]
2. Check "Supported Frameworks" section
3. Look for `net8.0`, `net10.0`, or `netstandard2.1`+

**Option B: Command Line**
```powershell
# Show detailed package info
dotnet package search Newtonsoft.Json --format json | ConvertFrom-Json

# Show specific version details
dotnet add package Newtonsoft.Json --version 13.0.1 --dry-run
```

**Option C: Use Copilot**
```
Is [PackageName] [CurrentVersion] compatible with .NET 8?
What's the recommended version for .NET 8 support?
```

---

## Phase 2: Transitive Dependency Analysis

### Identifying Transitive Conflicts

```powershell
# Show dependency tree
dotnet list package --include-transitive

# Filter to problematic packages
dotnet list package --format json | ConvertFrom-Json | 
    Select-Object -ExpandProperty projects | 
    ForEach-Object {
        $project = $_.projectPath
        Write-Host "Project: $project"
        $_.frameworks | ForEach-Object {
            $_.transitivePackages | 
            Where-Object { $_.latestVersion -ne $_.requestedVersion } |
            Select-Object id, requestedVersion, latestVersion
        }
    }
```

### Conflict Resolution

**Example Conflict:**
```
Service.API
  → Package.A v1.0 requires Dependency.X v2.0
  → Package.B v1.0 requires Dependency.X v3.0
  
Resolution: Update one package to compatible range
  Option 1: Upgrade Package.A to v2.0+ (if supports .NET 8)
  Option 2: Downgrade Package.B to compatible version
  Option 3: Use dependency pinning in csproj
```

**Pinning Dependencies (if necessary):**
```xml
<!-- .csproj -->
<ItemGroup>
  <!-- Pin to specific version -->
  <PackageReference Include="Newtonsoft.Json" Version="13.0.1" />
  
  <!-- Or allow patch updates only -->
  <PackageReference Include="NLog" Version="5.0.*" />
  
  <!-- Exclude certain versions -->
  <PackageReference Include="SomePackage" Version="2.0.0">
    <ExcludedVersions>2.0.1,2.0.2</ExcludedVersions>
  </PackageReference>
</ItemGroup>
```

---

## Phase 3: Security Vulnerability Assessment

### 1. Scan for Vulnerabilities

```powershell
# Official vulnerability check
dotnet list package --vulnerable

# Enhanced reporting
dotnet list package --vulnerable --format json | ConvertFrom-Json | 
    Select-Object -ExpandProperty projects | 
    ForEach-Object {
        $_.vulnerabilities | Where-Object { $_ } | 
        ForEach-Object { 
            Write-Host "VULNERABILITY: $($_.advisoryUrl)"
            Write-Host "Severity: $($_.severity)"
            Write-Host "Affected: $($_.packageId) $($_.vulnerableVersionRange)"
        }
    }
```

### 2. Prioritize Vulnerabilities

**By Severity:**

| Severity | CVSS | Action | Timeline |
|----------|------|--------|----------|
| Critical | 9.0-10.0 | Update immediately | Before upgrade |
| High | 7.0-8.9 | Update before production | During upgrade |
| Medium | 4.0-6.9 | Plan update | Within 30 days |
| Low | 0.0-3.9 | Monitor | Within 90 days |

**Example Action Plan:**
```markdown
# Security Vulns to Address

1. ❌ Critical: Newtonsoft.Json 12.0.3 (CVE-2023-XXXXX)
   - Action: Upgrade to 13.0.1 before upgrade
   - Timeline: Immediate
   
2. ⚠️ High: NLog 4.7.0 (CVE-2023-YYYYY)
   - Action: Upgrade to 5.0.5 during upgrade
   - Timeline: Week 1-2
   
3. ℹ️ Medium: SomeLib 1.0.0 (CVE-2023-ZZZZZ)
   - Action: Plan for next release
   - Timeline: 30 days post-upgrade
```

### 3. Validate Fixes

```powershell
# After updating packages, re-scan
dotnet list package --vulnerable

# Verify zero critical/high vulns
dotnet list package --vulnerable | 
    Where-Object { $_ -match "Critical|High" } | 
    Measure-Object

# Should output 0
```

---

## Phase 4: Package Update Strategy

### Update Execution Order

**Recommended Order:**
1. Security updates first (critical vulns)
2. Build/test infrastructure packages
3. Core dependencies (logging, serialization)
4. Domain-specific packages
5. Testing/development packages

### Update Commands

```powershell
# For a single project
cd path/to/project
dotnet add package Newtonsoft.Json --version 13.0.1

# For entire solution
dotnet package update

# With preview versions (if needed)
dotnet add package Newtonsoft.Json --version 14.0.0-preview --prerelease

# Restore after updates
dotnet restore
```

### Validation After Update

```powershell
# Check updated packages
dotnet list package --outdated

# Verify no vulnerabilities introduced
dotnet list package --vulnerable

# Build solution
dotnet build

# Run tests
dotnet test --no-build

# Check for breaking changes in logs
dotnet build /p:TreatWarningsAsErrors=true
```

---

## Phase 5: Alternative Package Analysis

### Finding Replacements for Deprecated Packages

**Example: Entity Framework 6 → EF Core**

| Problem Package | Issues | Replacement | Migration |
|-----------------|--------|-------------|-----------|
| EntityFramework | No .NET Core support | Microsoft.EntityFrameworkCore | Medium effort |
| Castle.Core | May have issues | Microsoft.CSharp | Minimal |
| log4net | Limited .NET support | Serilog / NLog / Microsoft.Logging | Medium effort |

### Evaluation Criteria

For each potential replacement, assess:

```markdown
# Evaluating Replacement: [Package]

## Compatibility
- [ ] Supports .NET 8/10 natively
- [ ] Available on NuGet
- [ ] Recent version (updated within 6 months)

## Feature Parity
- [ ] Has all features of old package
- [ ] API similar (easy migration)
- [ ] Documentation available

## Community & Support
- [ ] Active maintenance (latest commit < 3 months)
- [ ] Large user base (10k+ downloads/week)
- [ ] GitHub issues < 50 and resolving quickly
- [ ] Commercial support available (if needed)

## License
- [ ] Compatible with your project license (MIT, Apache, Commercial)
- [ ] No GPL/AGPL if proprietary code

## Size
- [ ] Adds reasonable dependency weight
- [ ] No unnecessary large transitive dependencies
```

### Ask Copilot for Recommendations

```
Our project uses [Package] which doesn't support .NET 8.
What are the recommended replacements?

Compare these options:
1. [Option A]
2. [Option B]
3. [Option C]

Which has best migration path for [our use case]?
```

---

## Phase 6: Dependency Lock File Management

### Generate Lock File (Optional)

```powershell
# Create reproducible builds
dotnet restore --lock-file --lock-file-format nuget.lock.json

# Lock file prevents transitive dependency surprises
# Useful for production builds
```

### Use Cases

**When to use lock files:**
- Production deployments (ensure reproducibility)
- CI/CD pipelines
- Team collaboration (consistent package versions)

**When not to use:**
- Local development (want latest updates)
- Early-stage projects (still exploring dependencies)

---

## Phase 7: Documentation & Sign-Off

### Dependency Report Template

Create file: `DEPENDENCY_ANALYSIS.md`

```markdown
# Dependency Analysis Report

**Date:** [date]
**Target Framework:** .NET 8 / .NET 10

## Summary
- Total direct dependencies: [n]
- Compatible: [n] ✅
- Requires update: [n] ⚠️
- Incompatible/deprecated: [n] ❌

## Security Status
- Vulnerabilities found: [n]
- Critical: [n]
- High: [n]
- Medium: [n]

## Action Items

### Immediate (Week 1)
- Update [Package] from X to Y (security)
- Replace [Deprecated] with [Alternative]

### Before Production (Week 2-3)
- Update [Package] from X to Y (compatibility)

### Non-blocking (Month 1)
- Monitor [Package] for updates
- Plan replacement for [Legacy]

## Testing Plan
- [ ] All tests pass post-update
- [ ] Performance benchmarks stable
- [ ] No new runtime errors
- [ ] Security scan shows 0 critical/high

## Sign-Off
- Engineering: __________
- Security: __________
```

### Checklist Before Proceeding

- [ ] All direct dependencies inventoried
- [ ] Transitive conflicts resolved
- [ ] Vulnerabilities addressed (critical/high)
- [ ] Replacements identified for incompatible packages
- [ ] Update strategy documented
- [ ] Testing plan in place
- [ ] Team reviewed and approved

---

## Common Issues & Solutions

### Issue: "Package version not compatible"

**Problem:** Update failed due to version constraint
```
The 'Newtonsoft.Json' package with version '14.0.0' cannot be added 
because it would have a conflict with constraint: Newtonsoft.Json (= 12.0.0)
```

**Solution:**
```powershell
# Remove old, add new
dotnet remove package Newtonsoft.Json
dotnet add package Newtonsoft.Json --version 14.0.0

# Or update in .csproj directly
# <PackageReference Include="Newtonsoft.Json" Version="14.0.0" />
```

### Issue: "Transitive dependency conflict"

**Problem:** Two packages require conflicting versions of a dependency

**Solution:**
```csharp
// Use package version override (rarely needed)
// Better: Update one of the dependent packages
// dotnet add package PackageA --version [compatible-version]
```

### Issue: "Performance regression after update"

**Problem:** Code slower after package update

**Solution:**
1. Identify performance impact (benchmarking)
2. Revert specific package: `dotnet add package PackageX --version [old-version]`
3. Test with older version
4. Report to package maintainer if regression confirmed
5. Wait for fix or find alternative

---

## Next Steps

1. ✅ Run audit and generate report (Phase 1)
2. ✅ Identify all conflicts and resolutions (Phase 2)
3. ✅ Scan for security vulnerabilities (Phase 3)
4. ✅ Update packages incrementally (Phase 4)
5. ✅ Document alternatives for incompatible packages (Phase 5)
6. ✅ Generate and review report (Phase 7)
7. ➡️ Proceed to `dotnet-upgrade-planning` for strategy selection

**Questions?** Use the `.NET Modernization Advisor` agent to guide this process.
