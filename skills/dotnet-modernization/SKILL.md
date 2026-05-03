---
name: dotnet-modernization
description: "Use when assessing, planning, or executing a .NET modernization or migration. Covers complexity scoring, dependency analysis, wave planning, API replacement tables, and execution checklists for .NET Framework to modern .NET upgrades."
---

# .NET Modernization Skill

Use this skill when the task involves migrating or modernizing a .NET application — from .NET Framework to .NET 8 / .NET 9, from legacy SDK-style projects to current SDK format, or from outdated packages to actively supported equivalents.

## When to Use

- Running a compatibility assessment on an existing .NET Framework or early .NET Core solution
- Grouping projects into migration waves ordered by dependency and complexity
- Identifying removed APIs, unsupported packages, or Windows-only blockers
- Converting `packages.config` projects to SDK-style `<PackageReference>` format
- Replacing deprecated APIs (`BinaryFormatter`, `AppDomain`, `System.Web`, WCF) with modern alternatives
- Establishing per-wave acceptance criteria and rollback procedures

## How to Invoke

Reference this skill by attaching `skills/dotnet-modernization/SKILL.md` to your agent context, or instruct the agent:

> Use the dotnet-modernization skill. Apply the complexity scoring matrix and API replacement table to every project in the solution before proposing a wave plan.

## Three-Stage Workflow

### Stage 1 — Assessment

1. List every `.csproj` and its current `TargetFramework`; note whether it uses SDK-style or legacy format.
2. Run `dotnet-upgrade-assistant analyze` (or inspect project files manually) to surface API removals and package incompatibilities.
3. Score each project using the **Complexity Scoring Matrix** below.
4. Build a dependency graph (Mermaid `graph TD`) showing project-to-project and key package-to-project edges.
5. Identify circular dependencies and flag them as blockers.
6. Produce an **Assessment Report** listing every project with its score, blockers, and Wave assignment.

### Stage 2 — Planning

1. Order waves by dependency depth: projects with zero inbound dependencies go in Wave 1.
2. Select the migration strategy for each wave:
   - **In-place**: retarget the existing branch — fastest, highest risk.
   - **Parallel-track**: create a modernization branch — safer, requires merge coordination.
   - **Strangler-fig**: add a new project alongside the legacy one — lowest risk, highest effort.
3. For each wave document: projects included, strategy, estimated effort, acceptance criteria, and rollback procedure.
4. Schedule a compatibility shim review for every `#if NETFRAMEWORK` block and `System.Web` reference.

### Stage 3 — Execution

1. Convert legacy `.csproj` to SDK-style format; remove `packages.config`.
2. Retarget `<TargetFramework>` to the chosen version; run `dotnet build` and fix all errors before continuing.
3. Apply API replacements from the table below; prefer first-party alternatives.
4. Update NuGet packages: `dotnet list package --outdated --include-transitive`; address each item.
5. Run `dotnet test`; a wave is complete only when all tests pass with no new warnings.
6. Remove legacy artifacts (`Web.config` transforms, `Global.asax`, `packages.config`) once the wave is validated in all environments.

## Complexity Scoring Matrix

Score each project on the following factors (1 = low, 5 = high); sum scores and divide by factor count for the project's average complexity.

| Factor | 1 | 3 | 5 |
|---|---|---|---|
| Lines of code | < 2,000 | 2,000–20,000 | > 20,000 |
| Direct package dependencies | < 10 | 10–30 | > 30 |
| Test coverage | > 80 % | 40–80 % | < 40 % |
| Coupling (projects referenced) | 0–1 | 2–5 | > 5 |
| Windows-specific APIs | None | Isolated | Pervasive |
| `System.Web` usage | None | Moderate | Heavy |

**Wave assignment guide**:

| Average Score | Suggested Wave |
|---|---|
| 1.0–2.0 | Wave 1 (quick wins) |
| 2.1–3.5 | Wave 2 |
| 3.6–4.5 | Wave 3 |
| 4.6–5.0 | Wave 4+ (architect review required) |

## API Replacement Table

| Legacy API | Modern Replacement | Notes |
|---|---|---|
| `System.Web.HttpContext` | `Microsoft.AspNetCore.Http.HttpContext` | Requires ASP.NET Core migration |
| `System.Web.UI` (Web Forms) | Razor Pages or Blazor | Full rewrite; use strangler-fig |
| `AppDomain.CreateDomain` | `AssemblyLoadContext` | Drop-in for plugin isolation scenarios |
| `BinaryFormatter` | `System.Text.Json` / `MessagePack` | Security-critical; must be replaced |
| `System.Runtime.Remoting` | gRPC or SignalR | No direct equivalent |
| WCF `ServiceHost` | `CoreWCF.ServiceHost` | Drop-in for server; client uses `System.ServiceModel` |
| `System.Drawing` (GDI+) | `ImageSharp` / `SkiaSharp` | Cross-platform safe |
| `Microsoft.VisualBasic` helpers | Idiomatic C# equivalents | Inline the logic |
| COM interop (general) | `CsWin32` source generator | Evaluate extraction to Windows-only service first |
| `Thread.Abort` | `CancellationToken` + cooperative cancellation | `ThreadAbortException` no longer thrown |
| `ConfigurationManager` | `IConfiguration` / `Microsoft.Extensions.Configuration` | Supports JSON, env vars, Key Vault |
| Full-trust `CAS` demands | Remove — not enforced | .NET no longer supports CAS |
| `System.Security.Permissions` | Review and remove | Most types throw `PlatformNotSupportedException` |

## Effort Estimation Guide

| Average Project Complexity | Estimated Effort per Project |
|---|---|
| 1.0–2.0 | 0.5–1 day |
| 2.1–3.0 | 2–4 days |
| 3.1–4.0 | 1–2 weeks |
| 4.1–5.0 | 2–4 weeks + architect review |

## Guardrails

- Do not retarget the entire solution in a single commit — migrate one wave at a time.
- Never remove a legacy project or `packages.config` before the wave is validated in all environments.
- Do not introduce new `#if NETFRAMEWORK` blocks during migration — resolve them instead.
- Flag `BinaryFormatter` as a security blocker; do not defer its replacement.
- If test coverage drops below 20 % on any project, pause the wave and file a risk issue before proceeding.

## Agent Pairing

This skill is designed to be used alongside the `dotnet-modernization-advisor` agent. The agent drives the three-stage workflow; this skill provides the scoring matrices, API replacement tables, effort estimates, and execution checklists.

For architecture decisions arising during planning (e.g., WCF-to-gRPC strategy, plugin isolation via `AssemblyLoadContext`), hand off to the `solution-architect` agent. For security-sensitive replacements (e.g., `BinaryFormatter`), involve the `security-analyst` agent.
