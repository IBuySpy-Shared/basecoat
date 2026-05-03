$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$failures = @()
$testCount = 0

function Assert-SyncPathExists {
    param(
        [string]$Path,
        [string]$Message
    )

    if (-not (Test-Path $Path)) {
        throw $Message
    }
}

function Assert-SyncPathNotExists {
    param(
        [string]$Path,
        [string]$Message
    )

    if (Test-Path $Path) {
        throw $Message
    }
}

Write-Host 'Starting sync process tests...' -ForegroundColor Cyan

# ============================================================================
# Helper: create a consumer repo and run sync.ps1 against it
# ============================================================================
function New-ConsumerRepo {
    param(
        [switch]$WithGitHubDir
    )

    $tempRepo = Join-Path ([System.IO.Path]::GetTempPath()) ("basecoat-sync-test-" + [System.Guid]::NewGuid().ToString())
    New-Item -ItemType Directory -Path $tempRepo | Out-Null

    Push-Location $tempRepo
    git init | Out-Null
    git config user.name 'basecoat-test'
    git config user.email 'basecoat-test@example.com'
    Set-Content -Path 'README.md' -Value '# Consumer Repo'
    git add README.md
    git commit -m 'initial commit' | Out-Null

    if ($WithGitHubDir) {
        New-Item -ItemType Directory -Force -Path (Join-Path $tempRepo '.github') | Out-Null
    }

    Pop-Location
    return $tempRepo
}

function Invoke-SyncToConsumer {
    param(
        [string]$ConsumerPath
    )

    Push-Location $ConsumerPath
    try {
        $branch = git -C $repoRoot rev-parse --abbrev-ref HEAD
        if ($branch -eq 'HEAD') {
            # Detached HEAD state (common in CI) — use the full commit SHA instead
            $branch = git -C $repoRoot rev-parse HEAD
        }
        $env:BASECOAT_REPO = "file://$repoRoot"
        $env:BASECOAT_REF = $branch
        & pwsh -NoProfile -File (Join-Path $repoRoot 'sync.ps1')
    }
    finally {
        Remove-Item Env:\BASECOAT_REPO -ErrorAction SilentlyContinue
        Remove-Item Env:\BASECOAT_REF -ErrorAction SilentlyContinue
        Pop-Location
    }
}

# ============================================================================
# Test 1: Sync populates .github/ Copilot-discoverable directories
# ============================================================================
Write-Host "`nTest 1: Sync populates .github/ Copilot-discoverable directories" -ForegroundColor Yellow

$consumer = $null
try {
    $consumer = New-ConsumerRepo -WithGitHubDir
    Invoke-SyncToConsumer -ConsumerPath $consumer

    $testCount++
    Assert-SyncPathExists -Path (Join-Path $consumer '.github/agents') `
        -Message 'Sync test failed: .github/agents/ not created'

    $testCount++
    $agentCount = (Get-ChildItem (Join-Path $consumer '.github/agents') -Filter '*.agent.md' -File).Count
    if ($agentCount -eq 0) {
        throw 'Sync test failed: .github/agents/ contains no agent files'
    }

    $testCount++
    Assert-SyncPathExists -Path (Join-Path $consumer '.github/instructions') `
        -Message 'Sync test failed: .github/instructions/ not created'

    $testCount++
    $instrCount = (Get-ChildItem (Join-Path $consumer '.github/instructions') -Filter '*.instructions.md' -File).Count
    if ($instrCount -eq 0) {
        throw 'Sync test failed: .github/instructions/ contains no instruction files'
    }

    $testCount++
    Assert-SyncPathExists -Path (Join-Path $consumer '.github/prompts') `
        -Message 'Sync test failed: .github/prompts/ not created'

    $testCount++
    $promptCount = (Get-ChildItem (Join-Path $consumer '.github/prompts') -Filter '*.prompt.md' -File).Count
    if ($promptCount -eq 0) {
        throw 'Sync test failed: .github/prompts/ contains no prompt files'
    }

    Write-Host "  Passed: agents($agentCount), instructions($instrCount), prompts($promptCount) synced" -ForegroundColor Green
}
catch {
    $failures += $_.Exception.Message
}
finally {
    if ($consumer -and (Test-Path $consumer)) {
        Remove-Item -Path $consumer -Recurse -Force
    }
}

# ============================================================================
# Test 2: Sync populates base-coat target directory with metadata
# ============================================================================
Write-Host "`nTest 2: Sync populates base-coat target directory with metadata" -ForegroundColor Yellow

$consumer = $null
try {
    $consumer = New-ConsumerRepo -WithGitHubDir
    Invoke-SyncToConsumer -ConsumerPath $consumer

    $targetDir = Join-Path $consumer '.github/base-coat'

    foreach ($item in @('README.md', 'CHANGELOG.md', 'version.json', 'basecoat-metadata.json')) {
        $testCount++
        Assert-SyncPathExists -Path (Join-Path $targetDir $item) `
            -Message "Sync test failed: $item not found in target directory"
    }

    foreach ($dir in @('agents', 'instructions', 'prompts', 'skills')) {
        $testCount++
        Assert-SyncPathExists -Path (Join-Path $targetDir $dir) `
            -Message "Sync test failed: $dir/ not found in target directory"
    }

    Write-Host "  Passed: target directory contains expected metadata and asset directories" -ForegroundColor Green
}
catch {
    $failures += $_.Exception.Message
}
finally {
    if ($consumer -and (Test-Path $consumer)) {
        Remove-Item -Path $consumer -Recurse -Force
    }
}

# ============================================================================
# Test 3: Non-distributed files are NOT copied
# ============================================================================
Write-Host "`nTest 3: Non-distributed files are NOT copied" -ForegroundColor Yellow

$consumer = $null
try {
    $consumer = New-ConsumerRepo -WithGitHubDir
    Invoke-SyncToConsumer -ConsumerPath $consumer

    $targetDir = Join-Path $consumer '.github/base-coat'

    foreach ($excluded in @('tests', 'scripts', 'sync.ps1', 'sync.sh', '.github', '.gitignore', '.gitleaks.toml')) {
        $testCount++
        Assert-SyncPathNotExists -Path (Join-Path $targetDir $excluded) `
            -Message "Sync test failed: non-distributed item '$excluded' was copied to target"
    }

    Write-Host "  Passed: non-distributed files excluded from sync" -ForegroundColor Green
}
catch {
    $failures += $_.Exception.Message
}
finally {
    if ($consumer -and (Test-Path $consumer)) {
        Remove-Item -Path $consumer -Recurse -Force
    }
}

# ============================================================================
# Test 4: Sync works when .github/ does not pre-exist (issue #249 edge case)
# ============================================================================
Write-Host "`nTest 4: Sync works when .github/ does not pre-exist (issue #249)" -ForegroundColor Yellow

$consumer = $null
try {
    $consumer = New-ConsumerRepo  # no -WithGitHubDir flag

    $testCount++
    Assert-SyncPathNotExists -Path (Join-Path $consumer '.github') `
        -Message 'Sync test precondition failed: .github/ should not exist before sync'

    Invoke-SyncToConsumer -ConsumerPath $consumer

    $testCount++
    Assert-SyncPathExists -Path (Join-Path $consumer '.github/agents') `
        -Message 'Sync test failed: .github/agents/ not created when .github/ was missing'

    $testCount++
    Assert-SyncPathExists -Path (Join-Path $consumer '.github/instructions') `
        -Message 'Sync test failed: .github/instructions/ not created when .github/ was missing'

    $testCount++
    Assert-SyncPathExists -Path (Join-Path $consumer '.github/prompts') `
        -Message 'Sync test failed: .github/prompts/ not created when .github/ was missing'

    $testCount++
    Assert-SyncPathExists -Path (Join-Path $consumer '.github/base-coat/version.json') `
        -Message 'Sync test failed: target directory not populated when .github/ was missing'

    Write-Host "  Passed: sync succeeds even without pre-existing .github/" -ForegroundColor Green
}
catch {
    $failures += $_.Exception.Message
}
finally {
    if ($consumer -and (Test-Path $consumer)) {
        Remove-Item -Path $consumer -Recurse -Force
    }
}

# ============================================================================
# Summary
# ============================================================================
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host 'Sync Test Summary' -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

if ($failures.Count -gt 0) {
    Write-Host "`nFAILED: $($failures.Count) issues found" -ForegroundColor Red
    $failures | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host "`nTotal checks performed: $testCount" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nAll sync tests passed ($testCount checks)" -ForegroundColor Green
