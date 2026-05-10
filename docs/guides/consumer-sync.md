# Consumer Sync Guide

This guide covers syncing BaseCoat assets into a consumer repository and keeping them up to date.

## What gets synced

The sync script copies all distributable assets to `.github/base-coat/` in your repo:

- `agents/` — all agent definition files
- `skills/` — all skill directories
- `instructions/` — all instruction files
- `prompts/` — prompt templates
- `version.json` — version metadata
- `asset-manifest.json` — per-asset version/SHA manifest used for drift analysis

In addition, Copilot-discoverable directories (`instructions/`, `prompts/`, `skills/`) are
mirrored to `.github/` and skills are also mirrored to `.agents/skills/` for cross-client
interop.

Files that are **not** synced: test scripts, CI workflows, internal tooling, `docs/`.

## Environment variable reference

Both `sync.ps1` and `sync.sh` are configured exclusively through environment variables.
All variables are **optional** — the defaults work for the public release repo.

| Variable | Required | Default | Description |
|---|---|---|---|
| `BASECOAT_REPO` | No | `https://github.com/YOUR-ORG/basecoat.git` | Git clone URL of the BaseCoat source repository. Override this when using a private fork or an enterprise mirror. |
| `BASECOAT_REF` | No | `main` | Git ref (branch, tag, or SHA) to sync from. Pin to a release tag such as `v3.25.0` for a stable, reproducible sync. |
| `BASECOAT_TARGET_DIR` | No | `.github/base-coat` | Relative path inside the consumer repo where synced assets are staged. Change this only if your repo layout requires a non-standard location. |

## The `YOUR-ORG` placeholder

The default value of `BASECOAT_REPO` contains the literal string `YOUR-ORG`:

```text
https://github.com/YOUR-ORG/basecoat.git
```

This is a placeholder, not a runtime token. The scripts do **not** perform any
string substitution inside synced asset files — assets are copied verbatim.

The placeholder exists as a reminder that the public repo URL must be replaced
before the script is useful. You have two options:

1. **Set `BASECOAT_REPO`** (recommended) — supply the real URL via the environment
   variable without editing the script.
2. **Edit the script** — replace `YOUR-ORG` directly in `sync.ps1` or `sync.sh`
   if you commit a customised copy to your repo.

For the public release, the correct value is:

```text
https://github.com/IBuySpy-Shared/basecoat.git
```

For an enterprise fork, substitute your org name:

```text
https://github.com/MY-ENTERPRISE-ORG/basecoat.git
```

## Sync commands

=== "PowerShell"

    ```powershell
    # Sync latest release (from main)
    $env:BASECOAT_REPO = 'https://github.com/IBuySpy-Shared/basecoat.git'
    .\sync.ps1

    # Sync a specific version tag
    $env:BASECOAT_REPO = 'https://github.com/IBuySpy-Shared/basecoat.git'
    $env:BASECOAT_REF  = 'v3.25.0'
    .\sync.ps1

    # Sync to a custom target directory
    $env:BASECOAT_REPO       = 'https://github.com/IBuySpy-Shared/basecoat.git'
    $env:BASECOAT_TARGET_DIR = '.github/my-basecoat'
    .\sync.ps1
    ```

=== "Shell"

    ```bash
    # Sync latest release (from main)
    BASECOAT_REPO=https://github.com/IBuySpy-Shared/basecoat.git ./sync.sh

    # Sync a specific version tag
    BASECOAT_REPO=https://github.com/IBuySpy-Shared/basecoat.git \
    BASECOAT_REF=v3.25.0 ./sync.sh

    # Sync to a custom target directory
    BASECOAT_REPO=https://github.com/IBuySpy-Shared/basecoat.git \
    BASECOAT_TARGET_DIR=.github/my-basecoat ./sync.sh
    ```

## Checking your version

```bash
cat .github/base-coat/version.json
```

## Automating upgrades

Add the callable drift-detection workflow to get automatic issue notifications when a new BaseCoat version is available. See [Getting Started](../getting-started.md#keep-it-up-to-date).

## Copilot Space context

When a consumer repository needs BaseCoat guidance at inference time, reference the shared
Copilot Space with this exact tuple:

- **Owner**: `IBuySpy-Shared`
- **Name**: `base-coat`

Example reference:

```text
Copilot Space owner: IBuySpy-Shared
Copilot Space name: base-coat
```

## Naming convention

BaseCoat uses two names intentionally:

| Name | Used for |
|---|---|
| `basecoat` | GitHub repo, internal scripts, environment variables (`BASECOAT_*`) |
| `base-coat` | Distributed artifact, sync target (`.github/base-coat/`), `version.json`, release archives |

See [ADR-001](../architecture/decisions/adr-001-naming-convention.md) for full details.


## Rolling back to a prior version

If a BaseCoat release introduces a breaking change, you can revert to any prior tagged release
using the `rollback.ps1` / `rollback.sh` scripts included in the repo root.

=== "PowerShell"

    `powershell
    # Roll back to a specific tag (run from your consumer repo root)
    $env:BASECOAT_REPO = 'https://github.com/IBuySpy-Shared/basecoat.git'
    pwsh rollback.ps1 -Tag v3.25.0

    # See available tags and current version
    pwsh rollback.ps1
    `

=== "Bash"

    `ash
    # Roll back to a specific tag (run from your consumer repo root)
    BASECOAT_REPO=https://github.com/IBuySpy-Shared/basecoat.git bash rollback.sh v3.25.0

    # See available tags and current version
    BASECOAT_REPO=https://github.com/IBuySpy-Shared/basecoat.git bash rollback.sh
    `

After rollback, review and commit:

`ash
git add .github/base-coat/
git commit -m "chore: roll back BaseCoat to v3.25.0"
`

The rollback script reads your current version from `version.json`, clones the requested
tag, replaces `.github/base-coat/`, and reports a diff summary.

To stay pinned and suppress automated upgrades, set `BASECOAT_REF=v3.25.0` in your
sync workflow until you are ready to re-adopt the latest release.
