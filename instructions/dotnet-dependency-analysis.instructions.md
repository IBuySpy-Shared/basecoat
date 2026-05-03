---
description: "Use when managing NuGet packages, auditing transitive dependencies, running security scans, or maintaining .NET compatibility matrices."
applyTo: "**/*.{csproj,fsproj,vbproj,sln,props,targets}", "**/NuGet.Config", "**/packages.lock.json", "**/Directory.Packages.props"
---

# .NET Dependency Analysis Standards

Use this instruction when adding, updating, or auditing NuGet packages and dependency trees in .NET projects.

## NuGet Workflow

- Use Central Package Management (`Directory.Packages.props`) for multi-project solutions to enforce version consistency.
- Pin exact versions in production; avoid floating version ranges (`*`, `1.x`) outside development tooling.
- Commit `packages.lock.json` and enable lock-file restore (`RestorePackagesWithLockFile=true`) so CI detects unexpected resolution changes.
- Run `dotnet restore --locked-mode` in CI pipelines to enforce the pinned lock file.
- Prefer `dotnet add package <name> --version <x.y.z>` over hand-editing project files to avoid accidental range syntax.
- Separate runtime dependencies from development/test dependencies using `<PackageReference>` conditions or dedicated test project files.

## Transitive Dependencies

- Run `dotnet list package --include-transitive` regularly to surface indirect references.
- Explicitly pin transitive packages only when their version causes a known conflict or vulnerability — document the reason with an inline comment in the project file.
- Avoid accidental version downgrades caused by transitive resolution; verify the resolved version in the lock file after any upgrade.
- Use `dotnet nuget why <package>` (SDK 8+) or `dotnet-depends` to trace why a transitive package is included before overriding it.
- Remove orphaned `<PackageReference>` overrides when the initiating direct dependency is removed.

## Security Scanning

- Run `dotnet list package --vulnerable` before every release and as a CI gate.
- Treat any **Critical** or **High** severity advisory as a blocker; do not merge until a patched version is available or a documented exception is approved.
- Integrate `dotnet list package --vulnerable --include-transitive` so indirect vulnerabilities are also caught.
- Use GitHub Dependabot or Renovate to automate vulnerability PRs; do not rely solely on manual audits.
- Pin a maximum retry window for applying security patches: **Critical** ≤ 24 h, **High** ≤ 72 h, **Medium** ≤ sprint cycle.
- Store advisory exceptions in a `nuget-security-exceptions.md` file at the repo root with justification and expiry date.

## Compatibility Matrix

- Document the target framework monikers (TFMs) supported by each shared library (e.g., `net8.0`, `net9.0`, `netstandard2.1`).
- Validate multi-targeting builds with `dotnet build -p:TargetFrameworks="net8.0;net9.0"` before publishing.
- Check `<SupportedOSPlatform>` and `<RequiresPreviewFeatures>` attributes when upgrading to a new TFM to avoid runtime surprises.
- Use the .NET Compatibility Analyzer (`Microsoft.DotNet.Compatibility`) in CI to detect breaking API changes between TFMs.
- Maintain a compatibility table in the project README when a library targets more than one TFM or runtime.
- Confirm NuGet packages consumed by shared libraries carry compatible TFM support before upgrading the minimum target.

## Review Lens

- Are all direct dependency versions pinned and reflected in the lock file?
- Has `dotnet list package --vulnerable --include-transitive` been run with no unresolved advisories?
- Are transitive overrides documented with a reason?
- Does the compatibility matrix reflect the TFMs tested in CI?
- Are security-exception entries time-bounded and approved?
