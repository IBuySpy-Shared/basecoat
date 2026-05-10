# Asset Versioning (Phase 1)

BaseCoat is still release-versioned (`version.json`) at the library level.  
Phase 1 adds **optional per-asset versions** for observability and drift reporting.

## Field definition

Supported assets may include this frontmatter field:

```yaml
version: 1.2.3
```

Rules:

- Optional
- SemVer format only: `X.Y.Z`
- Supported on:
  - `agents/*.agent.md`
  - `instructions/*.instructions.md`
  - `prompts/*.prompt.md`
  - `skills/*/SKILL.md`

## Effective version

- If `version` exists, it is the asset's effective version.
- If omitted, effective version inherits library `version.json`.

## Manifest

`asset-manifest.json` tracks each asset path, type, SHA, and effective version.
This file is generated via:

```powershell
pwsh scripts/generate-asset-manifest.ps1
```
