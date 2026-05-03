---
name: dotnet-modernization
title: .NET Modernization — Framework Upgrade Guidance
description: Upgrade guidance for .NET framework migrations, covering breaking changes from .NET 6 to .NET 8 and .NET 8 to .NET 10, with code examples and remediation patterns
compatibility: ["agent:legacy-modernization", "agent:backend-dev"]
metadata:
  domain: modernization
  maturity: production
  audience: [backend-engineer, architect, tech-lead]
allowed-tools: [bash, powershell, dotnet, csharp]
---

# .NET Modernization Skill

Comprehensive upgrade guidance for teams migrating ASP.NET and .NET workloads across major framework versions. Covers breaking API changes, behavioral differences, removal of deprecated features, and remediation patterns with before/after code examples.

## Quick Navigation

**Upgrading from .NET 6 or .NET 8?** Start here:

1. Review [Breaking Changes](references/breaking-changes.md) for the complete catalog

## Overview

This skill is organized into focused references for efficient navigation:

- **[references/breaking-changes.md](references/breaking-changes.md)** — Breaking changes catalog for .NET 6→8 and .NET 8→10, with code examples and remediation guidance

## Upgrade Path Summary

| From | To | LTS? | Key Themes |
|------|-----|------|------------|
| .NET 6 | .NET 8 | Both LTS | Minimal API improvements, Blazor SSR, Rate Limiting, `IHostedService` consolidation |
| .NET 8 | .NET 10 | Both LTS | Native AOT expansion, LINQ improvements, `HttpClient` resilience, Blazor enhancements |

## Upgrade Checklist

- [ ] Run `dotnet-upgrade-assistant` to identify incompatible dependencies
- [ ] Review breaking changes catalog relevant to your workload
- [ ] Update `<TargetFramework>` in `.csproj` files
- [ ] Resolve compiler errors and warnings introduced by removed or changed APIs
- [ ] Run full test suite and fix regressions
- [ ] Validate NuGet packages support the target framework
- [ ] Check runtime behavior changes (JSON serialization, culture handling, etc.)
- [ ] Update Docker base images to target framework tag

## References

- [Microsoft .NET Breaking Changes Documentation](https://learn.microsoft.com/en-us/dotnet/core/compatibility/breaking-changes)
- [.NET Upgrade Assistant](https://learn.microsoft.com/en-us/dotnet/core/porting/upgrade-assistant-overview)
- [.NET 8 What's New](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8/overview)
- [.NET 10 What's New](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/overview)
