---
description: "Use when planning or executing .NET upgrade testing, regression coverage, test data refresh, or CI/CD pipeline validation. Covers pre/post-upgrade testing, regression protection, test data updates, and CI/CD gate configuration."
applyTo: "**/*.{cs,csproj,sln,yml,yaml}"
---

# .NET Test Strategy

Use this instruction when preparing for or executing a .NET upgrade, validating changes against regression baselines, refreshing test data, or configuring CI/CD quality gates.

## Pre-Upgrade Testing

Before applying a .NET version upgrade or major dependency change:

- Capture a baseline by running the full test suite on the current version and recording pass/fail counts and key performance metrics.
- Identify tests that rely on deprecated or removed APIs and mark them for update before upgrading.
- Run `dotnet outdated` or `dotnet list package --outdated` to enumerate dependency drift and flag breaking-version boundaries.
- Verify compatibility of third-party NuGet packages against the target framework moniker (TFM) before committing to the upgrade.
- Run static analysis (`dotnet analyze`, Roslyn analyzers, or SonarQube) on the current code to establish a clean baseline so post-upgrade noise is attributable to the upgrade only.
- Document the pre-upgrade state: TFM, SDK version, runtime version, key package versions, and test counts.

## Post-Upgrade Testing

After applying the upgrade:

- Re-run the full test suite immediately. Every test that passed before the upgrade must pass after it.
- Compare post-upgrade results against the pre-upgrade baseline. Regressions are not acceptable without an explicit justification and a tracking issue.
- Validate framework-specific behavior changes: nullable reference types, default interface methods, reflection changes, `HttpClient` factory patterns, and serialization defaults (`System.Text.Json` vs `Newtonsoft.Json`).
- Run integration tests against real infrastructure (databases, message queues, external APIs) in a staging environment to catch runtime incompatibilities missed by unit tests.
- Profile startup time and memory allocation. A significant regression in either requires investigation before merging the upgrade.
- Verify that middleware pipelines, DI registrations, and hosted services start correctly under the new runtime.

## Regression Testing

- Maintain a regression suite that covers all previously filed bugs. Every bug fix must include a test that reproduces the defect and fails before the fix.
- Scope regression runs by change impact: run the full suite for framework upgrades, but scope to affected assemblies for isolated feature changes.
- Use test categories or traits to distinguish smoke, regression, integration, and performance tests:

  ```csharp
  [Trait("Category", "Regression")]
  [Trait("Bug", "1234")]
  public void Order_TotalShouldNotIncludeVoidedLines()
  {
      // Arrange
      var order = new OrderBuilder()
          .WithLineItem("SKU-A", quantity: 2, unitPrice: 10.00m)
          .WithVoidedLineItem("SKU-B", quantity: 1, unitPrice: 5.00m)
          .Build();

      // Act
      var total = order.CalculateTotal();

      // Assert
      Assert.Equal(20.00m, total);
  }
  ```

- Keep regression tests deterministic: no `Thread.Sleep`, no reliance on system clock without abstraction, no shared mutable state between tests.
- Parallelism is allowed within a test class only when fixtures guarantee isolation (`IClassFixture<T>` or `ICollectionFixture<T>` in xUnit).
- Gate regression results in CI: a single regression failure blocks merge.

## Test Data Updates

- Never use production data in test fixtures. Use anonymized or synthetically generated data sets.
- Version test data alongside the code that depends on it. If a schema migration changes column types or adds non-nullable columns, update test fixtures in the same PR.
- Use builder patterns or object mothers to construct test entities, keeping fixture construction out of individual test methods:

  ```csharp
  var order = new OrderBuilder()
      .WithCustomer("CUST-001")
      .WithLineItem("SKU-A", quantity: 2)
      .Build();
  ```

- For database integration tests, prefer in-memory providers (EF Core `UseInMemoryDatabase`) for unit-level isolation and a containerized real database (Testcontainers) for integration-level validation.
- After a schema migration, regenerate or update seed data scripts and validate that EF Core migrations apply cleanly from scratch on an empty database.
- Document the data contract: what each fixture represents, the range of values it exercises, and which edge cases it covers.

## CI/CD Validation

Configure CI/CD pipelines to enforce the following gates on every pull request:

### Required Checks

- **Build**: `dotnet build --no-incremental --warnaserror` — zero warnings policy.
- **Unit tests**: `dotnet test --filter "Category=Unit" --logger trx` — all unit tests pass.
- **Regression tests**: `dotnet test --filter "Category=Regression"` — no regressions.
- **Code coverage**: enforce minimum thresholds via `coverlet` with a runsettings file:

  ```xml
  <!-- coverlet.runsettings -->
  <RunSettings>
    <DataCollectionRunSettings>
      <DataCollectors>
        <DataCollector friendlyName="XPlat Code Coverage">
          <Configuration>
            <Threshold>80</Threshold>
            <ThresholdType>line</ThresholdType>
            <ThresholdStat>total</ThresholdStat>
          </Configuration>
        </DataCollector>
      </DataCollectors>
    </DataCollectionRunSettings>
  </RunSettings>
  ```

  Run with: `dotnet test --collect:"XPlat Code Coverage" --settings coverlet.runsettings`

- **Static analysis**: Roslyn analyzers run as part of the build; treat analyzer warnings as errors in CI.
- **Package vulnerability scan**: `dotnet list package --vulnerable --include-transitive` — block on known vulnerabilities.

### Workflow Structure

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.x'
      - run: dotnet restore
      - run: dotnet build --no-incremental --warnaserror
      - run: dotnet test --filter "Category!=Integration" --collect:"XPlat Code Coverage" --settings coverlet.runsettings
      - uses: codecov/codecov-action@v4

  integration-test:
    runs-on: ubuntu-latest
    needs: test
    services:
      sql:
        image: mcr.microsoft.com/mssql/server:2022-latest
        env:
          ACCEPT_EULA: Y
          SA_PASSWORD: ${{ secrets.SQL_SA_PASSWORD }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.x'
      - run: dotnet test --filter "Category=Integration"
```

### Environment Parity

- Run CI tests against the same .NET SDK version as production. Pin the SDK version in `global.json`.
- Use environment-specific configuration (`appsettings.Test.json`) to override connection strings and external service URLs with test doubles or containerized services.
- Promote artifacts that passed CI tests unchanged to staging and production. Never rebuild between environments.

## Minimum Checklist

- Pre-upgrade baseline captured (test counts, SDK/runtime version, package versions).
- Post-upgrade test suite green with no regressions.
- Regression suite covers all known bug fixes.
- Test data updated to match schema changes.
- CI gates enforce build, unit tests, regression tests, coverage, and vulnerability scan.
- `global.json` pins the SDK version used in CI and production.
