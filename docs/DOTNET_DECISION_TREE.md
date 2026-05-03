# .NET Strategy Decision Tree

Use this decision tree to select the right modernization strategy for a .NET application.
Run the [App Inventory Agent](../agents/app-inventory.agent.md) first to gather the inputs
needed by the entry questions.

---

## Entry Questions

Answer these questions before stepping through the decision tree. Collect answers from the
App Inventory output, solution files, and stakeholder interviews.

| # | Question | Where to find the answer |
|---|----------|--------------------------|
| E1 | What is the current .NET version / target framework moniker? | `.csproj` `<TargetFramework>` or `web.config` `<compilation targetFramework>` |
| E2 | What is the application type? | Project SDK, `packages.config`, presence of `Global.asax` / `.aspx` files |
| E3 | What is the complexity score (0–100)? | App Inventory Agent output |
| E4 | What is the strategic value? (Low / Medium / High) | Stakeholder interview / `docs/treatment-matrix.md` |
| E5 | Are there hard Windows-only dependencies? (COM interop, P/Invoke, Windows Registry, WCF) | App Inventory dependency scan |
| E6 | Does the application require cross-platform deployment? | Infrastructure or DevOps requirements |
| E7 | Is the team familiar with ASP.NET Core / modern .NET? | Team self-assessment (Low / Moderate / High) |
| E8 | Is test coverage ≥ 30 %? | Code coverage report or App Inventory output |

---

## Decision Flow

```
START: What is the current target framework? (E1)
│
├── .NET 8 or later (net8.0 / net9.0) ─────────────────────────────────────────────────────┐
│   └── Is the application type cloud-native / greenfield?                                  │
│       ├── YES → ✅ No migration needed. Focus on feature delivery.                        │
│       └── NO  → Review architecture patterns in docs/AI_ARCHITECTURE_PATTERNS.md.        │
│                                                                                           │
├── .NET 5 / 6 / 7 (net5.0 / net6.0 / net7.0) ─────────────────────────────────────────┐  │
│   └── Is the version still in support? (Check endoflife.date/dotnet)                  │  │
│       ├── YES (.NET 6 LTS) → Minor upgrade to .NET 8 in-place. ─────────────────────────┘
│       └── NO  (.NET 5 / 7) → Upgrade to .NET 8 LTS. Apply STRATEGY A.               │
│                                                                                        │
├── .NET Core 1.x / 2.x / 3.x (netcoreapp*) ────────────────────────────────────────────┤
│   └── Apply STRATEGY A (in-place framework upgrade to .NET 8).                        │
│                                                                                        │
└── .NET Framework (net4xx / net35 / net20) ────────────────────────────────────────────┤
    │                                                                                    │
    └── What is the application type? (E2)                                              │
        │                                                                               │
        ├── ASP.NET Web Forms (.aspx / Global.asax) ─────────────────────────────────┐ │
        │   └── Can the UI be rewritten incrementally?                               │ │
        │       ├── YES → Apply STRATEGY C (strangler-fig to Razor Pages / Blazor). ─┘ │
        │       └── NO  → Apply STRATEGY D (full rebuild).                             │
        │                                                                               │
        ├── ASP.NET MVC (System.Web.Mvc) ───────────────────────────────────────────┐  │
        │   └── Are there Windows-only dependencies? (E5)                           │  │
        │       ├── NO  → Apply STRATEGY B (port to ASP.NET Core MVC).             ─┘  │
        │       └── YES → Resolve or wrap dependencies first (see GO/NO-GO GATE 2).    │
        │                                                                               │
        ├── WCF Service ─────────────────────────────────────────────────────────────┐ │
        │   └── Are consumers able to adopt REST or gRPC?                           │ │
        │       ├── YES → Apply STRATEGY B (migrate to minimal APIs / gRPC).        ─┘ │
        │       └── NO  → Apply STRATEGY E (CoreWCF in-place port).                   │
        │                                                                               │
        ├── Windows Forms / WPF ──────────────────────────────────────────────────────┐ │
        │   └── Is cross-platform deployment required? (E6)                          │ │
        │       ├── NO  → Apply STRATEGY A (retarget to .NET 8 Windows).            ─┘ │
        │       └── YES → Apply STRATEGY D (rebuild with Blazor / MAUI / web UI).     │
        │                                                                               │
        ├── Console App / Background Service ───────────────────────────────────────┐  │
        │   └── Apply STRATEGY A (straightforward retarget to .NET 8).             ─┘  │
        │                                                                               │
        └── Class Library / NuGet Package ──────────────────────────────────────────┐  │
            └── Does the library use any Windows-only APIs? (E5)                    │  │
                ├── NO  → Apply STRATEGY A (multi-target net8.0 + net4xx).          ─┘  │
                └── YES → Evaluate API surface; extract platform-neutral contracts.     │
                                                                                        │
```

---

## Strategies

### Strategy A — In-Place Framework Upgrade

Retarget the existing project to .NET 8 with minimal code changes.

**Applies to:** .NET Core 2.x / 3.x, .NET 5 / 6 / 7, Windows Forms, WPF, Console Apps, Class Libraries

**Steps**

1. Run `dotnet-upgrade-assistant upgrade` to get an automated assessment.
2. Change `<TargetFramework>` in each `.csproj` to `net8.0`.
3. Update all NuGet packages to versions that support `net8.0`.
4. Fix compile-time breaking changes (consult the .NET upgrade guide for the target version).
5. Run the full test suite; address failures before proceeding.
6. Enable Nullable Reference Types (`<Nullable>enable</Nullable>`) — fix or suppress warnings.
7. Validate with smoke tests and performance benchmarks.

**Base Coat agents:** `backend-dev`, `devops-engineer`

---

### Strategy B — Port to ASP.NET Core

Migrate an ASP.NET MVC or Web API project from `System.Web` to ASP.NET Core.

**Applies to:** ASP.NET MVC (4.x), ASP.NET Web API, WCF services with REST-capable consumers

**Steps**

1. Create a new ASP.NET Core project (same solution, new project file targeting `net8.0`).
2. Copy controller logic; replace `System.Web` dependencies with ASP.NET Core equivalents.
3. Migrate authentication: `FormsAuthentication` / `MembershipProvider` → ASP.NET Core Identity or Entra ID (see `skills/identity-migration/`).
4. Migrate HTTP modules and handlers to middleware.
5. Replace `System.Configuration.ConfigurationManager` with `IConfiguration` / Azure App Configuration.
6. Move static files under `wwwroot`; update bundling/minification pipeline.
7. Replace MSMQ with Azure Service Bus where applicable (see `skills/service-bus-migration/`).
8. Run both projects in parallel with traffic mirroring until feature parity is confirmed.

**Base Coat agents:** `legacy-modernization`, `backend-dev`, `identity-architect`
**Base Coat skills:** `identity-migration`, `service-bus-migration`

---

### Strategy C — Strangler Fig to Razor Pages or Blazor

Incrementally replace Web Forms pages with Razor Pages or Blazor components, routing traffic
to new pages as they become ready.

**Applies to:** ASP.NET Web Forms with moderate-to-high complexity and high strategic value

**Steps**

1. Invoke the `legacy-modernization` agent to produce a wave-based migration plan.
2. Create an ASP.NET Core host project alongside the legacy Web Forms application.
3. Implement a reverse-proxy or URL-rewrite rule to route completed routes to the new host.
4. For each wave: implement the Razor Page / Blazor equivalent, migrate business logic to
   injectable services, verify parity, and retire the legacy `.aspx` file.
5. Migrate shared components last: master pages → `_Layout.cshtml`, user controls →
   Razor partial views or Blazor components.
6. Apply Strategy B steps for authentication, configuration, and messaging.

**Base Coat agents:** `legacy-modernization`, `frontend-dev`, `backend-dev`
**Base Coat skills:** `identity-migration`, `service-bus-migration`, `architecture`

---

### Strategy D — Full Rebuild

Rewrite the application from scratch against a modern .NET stack, preserving business logic.

**Applies to:** Web Forms with complexity score > 70, untestable codebases, or applications
requiring a fundamentally different UI paradigm (e.g., mobile-first, cross-platform)

**Steps**

1. Extract and document business rules with the `app-inventory` agent.
2. Author a PRD and technical spec (`docs/prd-and-spec-guidance.md`) before writing a line of code.
3. Design the new architecture using the `solution-architect` agent (C4 model, ADRs).
4. Build the new application with acceptance tests derived from the legacy specification.
5. Run both systems in parallel with production traffic mirroring for 4–8 weeks.
6. Perform a staged cutover; retire the legacy system once stability is confirmed.

**Base Coat agents:** `solution-architect`, `product-manager`, `backend-dev`, `frontend-dev`
**Base Coat skills:** `architecture`, `backend-dev`, `frontend-dev`

---

### Strategy E — CoreWCF In-Place Port

Adopt the CoreWCF open-source library to run WCF services on .NET 8 without rewriting
the service contract.

**Applies to:** WCF services where consumers cannot adopt REST or gRPC in the near term

**Steps**

1. Replace `System.ServiceModel` NuGet references with `CoreWCF.Http` or `CoreWCF.NetTcp`.
2. Retarget the project to `net8.0`.
3. Replace the `ServiceHost` configuration with `WebApplication` + `CoreWCF` middleware.
4. Validate WSDL contract parity with existing consumers.
5. Plan a phased migration of consumers to REST or gRPC; document a sunset timeline for SOAP.

**Base Coat agents:** `backend-dev`, `middleware-dev`

---

## Go/No-Go Gates

Each gate must be passed before a strategy can proceed to production. Failing a gate blocks
the migration; address the blocker and reassess.

### Gate 1 — Business Continuity

| Check | Criteria | Blocker? |
|-------|----------|----------|
| Stakeholder sign-off | Product owner approves migration scope and timeline | Yes |
| Rollback plan documented | Tested rollback procedure exists for each wave | Yes |
| Parallel-run window agreed | Minimum 2-week overlap between legacy and new system | Recommended |
| Change freeze windows identified | Releases blocked around key business dates (e.g., quarter-end) | Yes |

### Gate 2 — Dependency Resolution

| Check | Criteria | Blocker? |
|-------|----------|----------|
| All NuGet packages support target framework | No package pinned to `net4xx`-only without a compatible alternative | Yes |
| COM / P/Invoke inventory complete | All native dependencies listed and wrapped or replaced | Yes |
| Third-party licenses reviewed | Migrating to a new package does not introduce license conflicts | Recommended |
| Windows-only API surface documented | Any OS specific call has an abstraction or fallback | Yes (if cross-platform required) |

### Gate 3 — Test Coverage Baseline

| Check | Criteria | Blocker? |
|-------|----------|----------|
| Functional parity test suite exists | Coverage of critical user journeys ≥ 30 % OR acceptance tests cover all P0 scenarios | Yes |
| Performance baseline established | Response times and throughput benchmarked on the legacy system | Recommended |
| Regression suite runs in CI | Tests run automatically on every PR before merge | Yes |

### Gate 4 — Security and Compliance

| Check | Criteria | Blocker? |
|-------|----------|----------|
| Authentication migration plan approved | Identity team has signed off on the identity migration approach | Yes |
| Secrets removed from source | No credentials in `.config`, `.csproj`, or `appsettings.json` | Yes |
| Dependency vulnerability scan clean | No known critical or high CVEs in updated dependency set | Yes |
| Compliance review complete | Data residency, retention, and audit requirements reviewed for new stack | Yes (regulated workloads) |

### Gate 5 — Team Readiness

| Check | Criteria | Blocker? |
|-------|----------|----------|
| ASP.NET Core / modern .NET training | Team familiarity score ≥ Moderate (E7) or training scheduled | Yes |
| Capacity allocated | Migration effort estimated and sprint capacity reserved | Yes |
| Architecture review complete | `solution-architect` agent has produced C4 diagrams and ADRs | Recommended |

---

## Quick-Reference Summary

| Current Stack | Strategy | Key Agent(s) |
|---|---|---|
| .NET 5 / 6 / 7 | A — In-place upgrade | `backend-dev` |
| .NET Core 1.x–3.x | A — In-place upgrade | `backend-dev` |
| .NET Framework, Console / Library | A — Retarget | `backend-dev` |
| .NET Framework, ASP.NET MVC | B — Port to ASP.NET Core | `legacy-modernization`, `backend-dev` |
| .NET Framework, WCF (consumers can adopt REST) | B — Migrate to minimal APIs / gRPC | `backend-dev`, `middleware-dev` |
| .NET Framework, WCF (consumers cannot change) | E — CoreWCF port | `backend-dev`, `middleware-dev` |
| .NET Framework, Web Forms (complexity ≤ 70) | C — Strangler fig | `legacy-modernization`, `frontend-dev` |
| .NET Framework, Web Forms (complexity > 70) | D — Full rebuild | `solution-architect`, `product-manager` |
| Windows Forms / WPF (stay Windows) | A — Retarget to net8.0-windows | `backend-dev` |
| Windows Forms / WPF (cross-platform required) | D — Rebuild (Blazor / MAUI) | `solution-architect`, `frontend-dev` |

---

## Related Documents

- [`docs/treatment-matrix.md`](treatment-matrix.md) — maps complexity score × strategic value to the 6Rs (Retire / Rehost / Replatform / Refactor / Rebuild / Replace)
- [`agents/legacy-modernization.agent.md`](../agents/legacy-modernization.agent.md) — step-by-step Web Forms → Razor Pages migration
- [`agents/app-inventory.agent.md`](../agents/app-inventory.agent.md) — scans codebases and produces complexity scores
- [`skills/identity-migration/SKILL.md`](../skills/identity-migration/SKILL.md) — ASP.NET Membership → ASP.NET Core Identity migration
- [`skills/service-bus-migration/SKILL.md`](../skills/service-bus-migration/SKILL.md) — MSMQ → Azure Service Bus migration
