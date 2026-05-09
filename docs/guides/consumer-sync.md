# Consumer Sync Guide

This guide covers syncing BaseCoat assets into a consumer repository and keeping them up to date.

## What gets synced

The sync script copies all distributable assets to `.github/base-coat/` in your repo:

- `agents/` — all agent definition files
- `skills/` — all skill directories
- `instructions/` — all instruction files
- `prompts/` — prompt templates
- `version.json` — version metadata

Files that are **not** synced: test scripts, CI workflows, internal tooling, `docs/`.

## Sync commands

=== "PowerShell"

    ```powershell
    # Sync latest release
    pwsh scripts/sync.ps1

    # Sync specific version
    pwsh scripts/sync.ps1 -Tag v3.25.0

    # Sync to custom target
    pwsh scripts/sync.ps1 -TargetDir .github/my-basecoat
    ```

=== "Shell"

    ```bash
    # Sync latest release
    bash scripts/sync.sh

    # Sync specific version
    bash scripts/sync.sh --tag v3.25.0
    ```

## Checking your version

```bash
cat .github/base-coat/version.json
```

## Automating upgrades

Add the callable drift-detection workflow to get automatic issue notifications when a new BaseCoat version is available. See [Getting Started](../getting-started.md#keep-it-up-to-date).

## Naming convention

BaseCoat uses two names intentionally:

| Name | Used for |
|---|---|
| `basecoat` | GitHub repo, internal scripts, environment variables (`BASECOAT_*`) |
| `base-coat` | Distributed artifact, sync target (`.github/base-coat/`), `version.json`, release archives |

See [ADR-001](../architecture/decisions/adr-001-naming-convention.md) for full details.
