# .NET Modernization Architecture Guide

This guide covers the three-stage modernization journey for legacy .NET applications — from
assessment through migration to optimization — alongside a decision matrix, real-world scenarios,
and timeline estimates. Use it alongside `docs/treatment-matrix.md` and `docs/app-inventory.md`
for a complete end-to-end workflow.

---

## Stage 1 — Assessment

Before writing a single line of new code, understand what you are migrating.

### What to capture

| Artifact | Tool / Source |
| --- | --- |
| Framework version and EOL status | `dotnet --info`, project file `<TargetFramework>` |
| NuGet dependency graph | `dotnet list package`, `app-inventory` agent |
| Complexity score (1–100) | Base Coat `app-inventory` agent |
| Test coverage baseline | `dotnet test --collect:"Code Coverage"` |
| External integration points | `config-auditor` agent, `web.config` scan |
| Authentication model | `legacy-modernization` agent assessment phase |

### Key questions

- Is the application on an unsupported framework (e.g., .NET Framework 4.x with no LTS path)?
- Does it use Web Forms, WCF, Remoting, or other components with no direct equivalent in .NET 8+?
- What is the cyclomatic complexity distribution across the codebase?
- Are there COM interop, P/Invoke, or platform-specific Windows dependencies?
- What is the current test coverage percentage and what gaps exist?

### Stage 1 exit criteria

- Complexity score recorded and agreed by team and architect
- Dependency inventory committed to the ADR log
- Treatment path selected from the decision matrix (see below)
- Migration scope and wave plan drafted

---

## Stage 2 — Migration

Execute the migration incrementally using the strangler fig pattern. Never attempt a
big-bang rewrite unless the complexity score is below 20 and the application surface
area is small.

### Wave structure

```text
Wave 0  — Infrastructure  : CI/CD pipeline, containerization, secrets management
Wave 1  — Core services   : Domain models, repositories, shared utilities
Wave 2  — API surface     : Controllers, Minimal API endpoints, gRPC contracts
Wave 3  — Presentation    : Razor Pages / Blazor components replacing Web Forms
Wave 4  — Integrations    : Replace WCF, Remoting, MSMQ with modern equivalents
Wave N  — Retire legacy   : Remove old framework shims and compatibility layers
```

Run each wave as a separate sprint, validate parity before starting the next wave, and
keep the old code path live until the new path is fully verified in production.

### Framework upgrade path

```text
.NET Framework 4.x
      │
      ▼
.NET Framework 4.8 (bridge — supports .NET Standard 2.0 libraries)
      │
      ▼
.NET 6 LTS (first cross-platform target; migrate class libraries here)
      │
      ▼
.NET 8 LTS (current LTS, recommended target for new projects)
      │
      ▼
.NET 10 LTS (next LTS, available late 2025)
```

### Compatibility shims to plan for

| Legacy component | Modern replacement | Effort |
| --- | --- | --- |
| `System.Web.HttpContext` | `Microsoft.AspNetCore.Http.IHttpContextAccessor` | Low |
| `Global.asax` lifecycle | ASP.NET Core middleware pipeline | Medium |
| Web Forms `.aspx` / `.ascx` | Razor Pages or Blazor components | High |
| WCF service endpoints | ASP.NET Core gRPC or Minimal API | High |
| `System.Web.SessionState` | `IDistributedCache` (Redis / SQL) | Medium |
| `System.Web.Security.Membership` | ASP.NET Core Identity + Entra ID | High |
| MSMQ / System.Messaging | Azure Service Bus or RabbitMQ | Medium |
| `System.Drawing` (GDI+) | `SkiaSharp` or `ImageSharp` | Low–Medium |

### Stage 2 exit criteria

- All migrated paths covered by integration tests with parity assertions
- Performance baselines met or exceeded on the new stack
- Feature flags used for any dual-path routing during rollout
- Legacy code-behind removed or clearly marked for retirement in Wave N

---

## Stage 3 — Optimization

After migration, take advantage of the modern runtime and platform capabilities.

### Performance

- Enable Native AOT compilation for latency-sensitive APIs (requires trimming compatibility)
- Adopt `System.Text.Json` source generators to eliminate reflection overhead
- Profile with `dotnet-trace` and `dotnet-counters` before and after each wave
- Replace synchronous database calls with `async`/`await` throughout the call stack
- Use `Span<T>` / `Memory<T>` to reduce allocations in hot paths

### Observability

```csharp
// Register OpenTelemetry with OTLP exporter in Program.cs
builder.Services.AddOpenTelemetry()
    .WithTracing(t => t
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddSqlClientInstrumentation()
        .AddOtlpExporter())
    .WithMetrics(m => m
        .AddAspNetCoreInstrumentation()
        .AddRuntimeInstrumentation()
        .AddOtlpExporter());
```

### Security hardening

- Enable `dotnet publish` trimming and ReadyToRun for reduced attack surface
- Replace `web.config` transforms with Azure App Configuration and Key Vault references
- Adopt managed identity and remove all connection-string secrets from source
- Apply `dotnet outdated` and Dependabot to keep NuGet graph current

### Stage 3 exit criteria

- OpenTelemetry traces and metrics flowing to the observability stack
- Secrets management migrated to Key Vault with managed identity
- Dependency scan clean (0 critical/high CVEs on the `dotnet list package --vulnerable` report)
- Performance regression suite passing with ≤ 5 % latency increase versus baseline

---

## Decision Matrix

Select a modernization strategy based on complexity score and framework gap.

```text
                        Framework Gap
                    Small           Large
                 (4.8 → .NET 8)  (4.x → .NET 8)
               ┌──────────────┬──────────────┐
          Low  │  In-place     │  Replatform  │
Complexity     │  upgrade      │  + shims     │
  Score   ─────┼──────────────┼──────────────┤
         High  │  Strangler    │  Rebuild or  │
               │  fig waves    │  Replace     │
               └──────────────┴──────────────┘
```

### Strategy descriptions

**In-place upgrade** — Complexity ≤ 40, small framework gap

- Use the .NET Upgrade Assistant CLI to automate project file and API changes
- Minimal wave structure; often completed in a single sprint
- Suitable for class libraries, console apps, and simple web APIs

**Replatform with shims** — Complexity ≤ 40, large framework gap

- Introduce `Microsoft.Windows.Compatibility` and `System.Web` adapters
- Migrate runtime target without rewriting business logic
- Defer Web Forms replacement to a later optimization cycle

**Strangler fig waves** — Complexity 41–70, any framework gap

- Route traffic to new .NET 8 endpoints while keeping legacy live
- Extract services sprint by sprint, retiring the legacy path each wave
- Recommended for applications with active user bases and low downtime tolerance

**Rebuild or Replace** — Complexity > 70, large framework gap

- Complexity score above 70 with deep Web Forms or WCF dependency warrants a greenfield build
- Preserve business logic specifications, not code
- Consider commercial COTS products before committing to a full rebuild

### .NET Upgrade Assistant quick reference

```bash
# Install the tool
dotnet tool install -g upgrade-assistant

# Analyze the solution
upgrade-assistant analyze MySolution.sln

# Run the upgrade in interactive mode
upgrade-assistant upgrade MySolution.sln --target-tfm-support LTS
```

---

## Real-World Scenarios

### Scenario A — Internal Line-of-Business Web Forms App

### Profile (Scenario A)

- 80 Web Forms pages, 45 000 lines of C#
- .NET Framework 4.6, no unit tests
- SQL Server via raw `SqlCommand`, no ORM
- Used by 200 internal users, no SLA

**Complexity score**: 68 — High

**Recommended strategy**: Strangler fig waves over 6–8 sprints

### Wave plan

| Wave | Sprint | Scope |
| --- | --- | --- |
| 0 | 1 | Containerize on .NET 4.8, add CI pipeline, establish performance baseline |
| 1 | 2–3 | Migrate data access to Dapper; introduce repository pattern |
| 2 | 4–5 | Replace authentication with ASP.NET Core Identity + Entra ID |
| 3 | 6–7 | Migrate top 20 high-traffic pages to Razor Pages |
| 4 | 8–9 | Migrate remaining pages; retire Web Forms handler |
| N | 10 | Remove compatibility shims, enable trimming, close ADR |

---

### Scenario B — Public-Facing E-Commerce Site

### Profile (Scenario B)

- ASP.NET MVC 5 on .NET Framework 4.7.2
- 15 NuGet packages, 3 critical CVEs, Newtonsoft.Json heavily used
- Entity Framework 6 with 200+ migrations
- 50 000 daily active users, 99.9 % uptime SLA

**Complexity score**: 44 — Medium-High

**Recommended strategy**: Strangler fig with feature flags; zero-downtime deployment

### Key migration decisions

- Migrate `Newtonsoft.Json` callsites to `System.Text.Json` incrementally
- Upgrade EF6 migrations to EF Core; run shadow database during transition
- Use Azure Front Door traffic splitting (10 % → 50 % → 100 %) for new endpoints
- Maintain rollback path for every wave until the wave is fully retired

---

### Scenario C — WCF Back-End Services

### Profile (Scenario C)

- 12 WCF services (`BasicHttpBinding`, `NetTcpBinding`)
- Consumed by 3 internal .NET Framework clients and 1 Java client
- Complex message contracts with custom serialization

**Complexity score**: 55 — High

**Recommended strategy**: Replace WCF with ASP.NET Core gRPC (internal) + REST (Java client)

### Migration path

```text
WCF service
    │
    ├─► ASP.NET Core Minimal API  (external / REST consumers)
    │
    └─► ASP.NET Core gRPC         (internal .NET consumers)
```

Use `CoreWCF` as a bridge during the transition to unblock client teams while the new
endpoints are built and validated.

---

### Scenario D — Microservices Modernization

### Profile (Scenario D)

- 6 independent ASP.NET Web API 2 services on .NET Framework 4.8
- Each service has full integration-test coverage
- Deployed to IIS, no containers

**Complexity score**: 22 — Low-Moderate

**Recommended strategy**: In-place upgrade service by service

### Key steps per service

1. Run `.NET Upgrade Assistant analyze` and review the report
2. Convert project file to SDK style (`dotnet migrate` or manual)
3. Update `<TargetFramework>` to `net8.0`
4. Replace `WebApiConfig` with `Program.cs` Minimal API or controller registration
5. Containerize with `dotnet publish` and a multi-stage Dockerfile
6. Deploy to Azure Container Apps; retire IIS host

---

## Timeline Estimates

Estimates assume a two-developer team with one part-time architect. Adjust for team size,
risk tolerance, and available test coverage.

| Scenario type | Complexity score | Estimated duration | Sprints (2-week) |
| --- | --- | --- | --- |
| In-place upgrade, library or API | 1–20 | 1–2 months | 2–4 |
| In-place upgrade, MVC web app | 21–40 | 2–3 months | 4–6 |
| Strangler fig, Web API services | 21–40 | 2–4 months | 4–8 |
| Strangler fig, MVC + partial Web Forms | 41–55 | 4–6 months | 8–12 |
| Strangler fig, heavy Web Forms app | 56–70 | 6–9 months | 12–18 |
| Rebuild, Web Forms + WCF monolith | 71–85 | 9–15 months | 18–30 |
| Replace with COTS | 86–100 | 12–24 months | 24–48 |

### Key timeline risk factors

- **Test coverage below 20 %** adds 20–40 % to migration time (manual regression increases)
- **COM interop or P/Invoke** adds 1–3 sprints per integration point
- **External API contracts locked by partners** adds negotiation and versioning overhead
- **No CI/CD pipeline** adds one Wave 0 sprint before migration can begin
- **Distributed team across time zones** multiplies review cycles by 1.3–1.5×

### Velocity reference

```text
Typical per-sprint output (2 developers, full focus):

  Simple page / endpoint migration     : 8–15 pages or endpoints
  Data access layer refactor           : 3–5 repository classes
  Authentication module replacement    : 1 per sprint (high risk, needs UAT)
  WCF → gRPC / REST service port       : 2–4 service contracts
  Performance optimisation pass        : 1 service or subsystem
```

---

## Related Assets

| Asset | Purpose |
| --- | --- |
| `docs/treatment-matrix.md` | Application disposition decision framework (Retire / Rehost / Refactor / Rebuild) |
| `docs/app-inventory.md` | How to run the inventory scan and interpret complexity scores |
| `agents/legacy-modernization.agent.md` | Strangler fig migration workflow automation |
| `agents/app-inventory.agent.md` | Automated dependency and complexity scanning |
| `agents/dependency-lifecycle.agent.md` | NuGet upgrade path and vulnerability remediation |
| `agents/devops-engineer.agent.md` | CI/CD pipeline and containerization setup |
| `skills/identity-migration/SKILL.md` | ASP.NET Membership → ASP.NET Core Identity migration |
