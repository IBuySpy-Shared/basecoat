<#
.SYNOPSIS
    Bootstrap a new BaseCoat environment — repo setup, memory layer, secrets check, validation.

.DESCRIPTION
    Idempotent four-phase setup for new BaseCoat adopters:
      Phase 1 — Repo setup      (fork detection, GitHub settings, gh aw extension)
      Phase 2 — Memory layer    (SQLite init, gitignore guard, optional shared memory sync)
      Phase 3 — Secrets check   (COPILOT_GITHUB_TOKEN, BASECOAT_SHARED_MEMORY_REPO)
      Phase 4 — Validation      (validate-basecoat.ps1 + run-tests.ps1)

.PARAMETER Silent
    Suppress interactive prompts. Suitable for CI use.

.PARAMETER SkipTests
    Skip Phase 4 test suite run (useful when bootstrapping in environments without all
    test dependencies installed).

.PARAMETER SharedMemoryRepo
    Override the shared org memory repo (e.g., 'MyOrg/basecoat-memory').
    Defaults to BASECOAT_SHARED_MEMORY_REPO environment variable if set.

.EXAMPLE
    pwsh scripts/bootstrap.ps1

.EXAMPLE
    pwsh scripts/bootstrap.ps1 -Silent -SkipTests

.EXAMPLE
    pwsh scripts/bootstrap.ps1 -SharedMemoryRepo "MyOrg/basecoat-memory"
#>

[CmdletBinding()]
param(
    [switch]$Silent,
    [switch]$SkipTests,
    [string]$SharedMemoryRepo = $env:BASECOAT_SHARED_MEMORY_REPO
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ── helpers ──────────────────────────────────────────────────────────────────

$script:errors   = [System.Collections.Generic.List[string]]::new()
$script:warnings = [System.Collections.Generic.List[string]]::new()
$script:checks   = [System.Collections.Generic.List[hashtable]]::new()

function Write-Header([string]$text) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
}

function Write-Check([string]$label, [bool]$ok, [string]$detail = "") {
    $icon   = if ($ok) { "✅" } else { "❌" }
    $color  = if ($ok) { "Green" } else { "Red" }
    $suffix = if ($detail) { "  ($detail)" } else { "" }
    Write-Host "  $icon  $label$suffix" -ForegroundColor $color
    $script:checks.Add(@{ label = $label; ok = $ok; detail = $detail })
}

function Write-Warn([string]$msg) {
    Write-Host "  ⚠️   $msg" -ForegroundColor Yellow
    $script:warnings.Add($msg)
}

function Write-Fail([string]$msg) {
    Write-Host "  ❌  $msg" -ForegroundColor Red
    $script:errors.Add($msg)
}

function Confirm-Step([string]$prompt) {
    if ($Silent) { return $true }
    $ans = Read-Host "$prompt [Y/n]"
    return ($ans -eq '' -or $ans -match '^[Yy]')
}

function Test-CommandExists([string]$cmd) {
    return $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

# ── repo root detection ───────────────────────────────────────────────────────

$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Error "Not inside a git repository. Run this script from within your BaseCoat repo."
    exit 1
}
Set-Location $repoRoot

Write-Host ""
Write-Host "  BaseCoat Bootstrap" -ForegroundColor White
Write-Host "  Repo: $repoRoot" -ForegroundColor DarkGray
Write-Host "  Mode: $(if ($Silent) { 'Silent' } else { 'Interactive' })" -ForegroundColor DarkGray

# ─────────────────────────────────────────────────────────────────────────────
# Phase 1 — Repo setup
# ─────────────────────────────────────────────────────────────────────────────

Write-Header "Phase 1 — Repo Setup"

# Detect fork vs origin
$remoteUrl = git remote get-url origin 2>$null
$isFork    = $false
if ($remoteUrl -match 'IBuySpy-Shared/basecoat') {
    Write-Check "Remote is upstream BaseCoat (not a fork)" $true "consider forking for org-specific customizations"
} else {
    $isFork = $true
    Write-Check "Repo is a fork/clone of BaseCoat" $true $remoteUrl
}

# gh CLI
if (Test-CommandExists 'gh') {
    $ghVersion = (gh --version 2>$null | Select-Object -First 1)
    Write-Check "GitHub CLI (gh) available" $true $ghVersion
} else {
    Write-Fail "GitHub CLI (gh) not found — install from https://cli.github.com"
}

# gh auth
$authStatus = gh auth status 2>&1 | Out-String
if ($authStatus -match 'Logged in') {
    Write-Check "gh auth: logged in" $true
} else {
    Write-Warn "gh auth: not logged in — run 'gh auth login'"
}

# gh aw extension
$awVersion = gh extension list 2>$null | Select-String 'gh-aw'
if ($awVersion) {
    Write-Check "gh aw extension installed" $true ($awVersion.ToString().Trim())
} else {
    Write-Warn "gh aw extension not installed — agentic workflows won't compile"
    if (Confirm-Step "  Install gh aw now?") {
        gh extension install github/gh-aw
        Write-Check "gh aw extension installed" $true "just installed"
    }
}

# GitHub Actions enabled (best-effort check via API)
try {
    $actionsStatus = gh api "repos/{owner}/{repo}/actions/permissions" --jq '.enabled' 2>$null
    if ($actionsStatus -eq 'true') {
        Write-Check "GitHub Actions enabled" $true
    } else {
        Write-Warn "GitHub Actions may be disabled — check Settings → Actions → General"
    }
} catch {
    Write-Warn "Could not verify Actions status (may need repo write access)"
}

# ─────────────────────────────────────────────────────────────────────────────
# Phase 2 — Memory layer
# ─────────────────────────────────────────────────────────────────────────────

Write-Header "Phase 2 — Memory Layer"

# .gitignore guard
$gitignorePath = Join-Path $repoRoot '.gitignore'
$requiredPatterns = @('*.db', '*.sqlite', '.memory/', '.copilot/session-state/')
$gitignoreContent = if (Test-Path $gitignorePath) { Get-Content $gitignorePath -Raw } else { '' }

$missingPatterns = @($requiredPatterns | Where-Object { $gitignoreContent -notmatch [regex]::Escape($_) })
if ($missingPatterns.Count -eq 0) {
    Write-Check ".gitignore protects memory stores" $true
} else {
    Write-Warn ".gitignore missing patterns: $($missingPatterns -join ', ')"
    if (Confirm-Step "  Add missing .gitignore patterns now?") {
        $additions = "`n# BaseCoat memory stores — org-private, never commit`n"
        $additions += $missingPatterns -join "`n"
        $additions += "`n"
        Add-Content -Path $gitignorePath -Value $additions
        Write-Check ".gitignore updated" $true
    }
}

# .memory/ directory
$memoryDir = Join-Path $repoRoot '.memory'
if (-not (Test-Path $memoryDir)) {
    New-Item -ItemType Directory -Path $memoryDir | Out-Null
    New-Item -ItemType File -Path (Join-Path $memoryDir '.gitkeep') | Out-Null
    Write-Check ".memory/ directory created" $true
} else {
    Write-Check ".memory/ directory exists" $true
}

# Shared memory sync (optional)
if ($SharedMemoryRepo) {
    Write-Host "  Shared memory repo: $SharedMemoryRepo" -ForegroundColor DarkGray
    $syncScript = Join-Path $repoRoot 'scripts' 'sync-shared-memory.ps1'
    if (Test-Path $syncScript) {
        if (Confirm-Step "  Sync shared org memory now?") {
            try {
                & $syncScript -SharedMemoryRepo $SharedMemoryRepo
                Write-Check "Shared memory synced" $true $SharedMemoryRepo
            } catch {
                Write-Warn "Shared memory sync failed: $_"
            }
        }
    } else {
        Write-Warn "sync-shared-memory.ps1 not found — skipping shared memory sync"
    }
} else {
    Write-Host "  Shared memory: not configured (set BASECOAT_SHARED_MEMORY_REPO to enable)" -ForegroundColor DarkGray
}

# ─────────────────────────────────────────────────────────────────────────────
# Phase 3 — Secrets / config checklist
# ─────────────────────────────────────────────────────────────────────────────

Write-Header "Phase 3 — Secrets & Config"

# COPILOT_GITHUB_TOKEN
try {
    $secrets = gh secret list 2>$null | Out-String
    if ($secrets -match 'COPILOT_GITHUB_TOKEN') {
        Write-Check "COPILOT_GITHUB_TOKEN repo secret present" $true "required for agentic workflows"
    } else {
        Write-Warn "COPILOT_GITHUB_TOKEN not set — agentic workflows won't run"
        Write-Host "  → Create a fine-grained PAT with 'Copilot Requests: Read'" -ForegroundColor DarkGray
        Write-Host "    https://github.com/settings/personal-access-tokens/new" -ForegroundColor DarkGray
        Write-Host "    Then: gh secret set COPILOT_GITHUB_TOKEN" -ForegroundColor DarkGray
    }
} catch {
    Write-Warn "Could not check repo secrets (needs repo admin access)"
}

# Portal deployment secrets (if portal deploy workflow is present)
$portalDeployWorkflow = Join-Path $repoRoot '.github\workflows\portal-deploy.yml'
if (Test-Path $portalDeployWorkflow) {
    try {
        $repoSlug = (gh repo view --json nameWithOwner --jq '.nameWithOwner' 2>$null).Trim()
        if (-not $repoSlug) {
            throw "Unable to resolve repository slug"
        }

        $repoSecretNames = @(
            gh secret list -R $repoSlug 2>$null |
                ForEach-Object { ($_ -split '\s+')[0] } |
                Where-Object { $_ }
        )
        $stagingSecretNames = @(
            gh secret list --env staging -R $repoSlug 2>$null |
                ForEach-Object { ($_ -split '\s+')[0] } |
                Where-Object { $_ }
        )

        $requiredPortalSecrets = @(
            'PORTAL_AZURE_CREDENTIALS',
            'GHCR_PULL_TOKEN'
        )

        foreach ($secretName in $requiredPortalSecrets) {
            if ($repoSecretNames -contains $secretName -or $stagingSecretNames -contains $secretName) {
                Write-Check "$secretName available for portal deploy" $true
            } else {
                Write-Fail "$secretName missing for portal deploy (set repo secret or staging environment secret)"
            }
        }

        Write-Host "  ℹ️   PORTAL_AZURE_CREDENTIALS must contain JSON keys: clientId, clientSecret, tenantId, subscriptionId" -ForegroundColor DarkGray
        Write-Host "  ℹ️   PORTAL_POSTGRES_ADMIN_PASSWORD is optional (Bicep can generate the PostgreSQL admin password)" -ForegroundColor DarkGray
    } catch {
        Write-Warn "Could not verify portal deployment secrets: $_"
    }
}

# BASECOAT_SHARED_MEMORY_REPO env var
if ($SharedMemoryRepo) {
    Write-Check "BASECOAT_SHARED_MEMORY_REPO configured" $true $SharedMemoryRepo
} else {
    Write-Host "  ℹ️   BASECOAT_SHARED_MEMORY_REPO not set (optional — needed for shared org memory)" -ForegroundColor DarkGray
}

# version.json readable
$versionFile = Join-Path $repoRoot 'version.json'
if (Test-Path $versionFile) {
    $version = (Get-Content $versionFile | ConvertFrom-Json).version
    Write-Check "version.json readable" $true "v$version"
} else {
    Write-Fail "version.json not found"
}

# ─────────────────────────────────────────────────────────────────────────────
# Phase 4 — Validation
# ─────────────────────────────────────────────────────────────────────────────

Write-Header "Phase 4 — Validation"

$validateScript = Join-Path $repoRoot 'scripts' 'validate-basecoat.ps1'
$testScript     = Join-Path $repoRoot 'tests'   'run-tests.ps1'

if (Test-Path $validateScript) {
    try {
        & $validateScript
        Write-Check "validate-basecoat.ps1 passed" $true
    } catch {
        Write-Fail "validate-basecoat.ps1 failed: $_"
    }
} else {
    Write-Warn "scripts/validate-basecoat.ps1 not found — skipping"
}

if (-not $SkipTests) {
    if (Test-Path $testScript) {
        try {
            & $testScript
            Write-Check "run-tests.ps1 passed" $true
        } catch {
            Write-Fail "run-tests.ps1 failed: $_"
        }
    } else {
        Write-Warn "tests/run-tests.ps1 not found — skipping"
    }
} else {
    Write-Host "  ⏭️   Tests skipped (-SkipTests)" -ForegroundColor DarkGray
}

# ─────────────────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────────────────

Write-Header "Bootstrap Summary"

$passed = @($script:checks | Where-Object { $_.ok }).Count
$failed = @($script:checks | Where-Object { -not $_.ok }).Count

Write-Host "  Checks passed : $passed" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "  Checks failed : $failed" -ForegroundColor Red
}
if ($script:warnings.Count -gt 0) {
    Write-Host "  Warnings      : $($script:warnings.Count)" -ForegroundColor Yellow
}

if ($script:errors.Count -eq 0 -and $failed -eq 0) {
    Write-Host ""
    Write-Host "  🎉  BaseCoat bootstrap complete!" -ForegroundColor Green
    Write-Host "  → Open VS Code and start using agents from the agents/ directory." -ForegroundColor DarkGray
    Write-Host "  → See docs/INDEX.md for the full documentation index." -ForegroundColor DarkGray
    Write-Host ""
    exit 0
} else {
    Write-Host ""
    Write-Host "  ⚠️   Bootstrap completed with issues. Resolve the items above before use." -ForegroundColor Yellow
    if ($script:errors.Count -gt 0) {
        Write-Host ""
        Write-Host "  Errors to fix:" -ForegroundColor Red
        $script:errors | ForEach-Object { Write-Host "    • $_" -ForegroundColor Red }
    }
    Write-Host ""
    exit 1
}
