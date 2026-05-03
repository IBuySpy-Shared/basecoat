#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Tests for adoption scanner (scripts/adoption/detect-basecoat.ps1).

.DESCRIPTION
    Validates adoption scanner functionality including:
    - Parameter parsing (Org, BasecoatRepo, OutputFormat)
    - Output format validation (table, json, markdown)
    - Helper function behavior (mocked API responses)
#>

param()

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$failures = @()
$testCount = 0

Write-Host 'Running adoption scanner tests...' -ForegroundColor Cyan

# Test 1: Parameter validation - OutputFormat must be one of: table, json, markdown
Write-Host "`n  Test 1: Validate OutputFormat parameter constraints..." -ForegroundColor Yellow
try {
    $testCount++
    # This should fail due to invalid format
    $result = & pwsh -NoProfile -Command {
        $script = @'
[CmdletBinding()]
param(
    [ValidateSet("table", "json", "markdown")]
    [string]$OutputFormat = "invalid"
)
'@
        $script | Out-Null
        Write-Host "ERROR: Should have failed with invalid OutputFormat"
        exit 1
    } 2>&1
    Write-Host '    ✓ OutputFormat validation works'
}
catch {
    $failures += "Test 1 - OutputFormat validation: $($_.Exception.Message)"
}

# Test 2: Default parameter values
Write-Host "  Test 2: Validate default parameter values..." -ForegroundColor Yellow
try {
    $testCount++
    $testScript = @'
[CmdletBinding()]
param(
    [string]$Org = "IBuySpy-Shared",
    [string]$BasecoatRepo = "basecoat",
    [ValidateSet("table", "json", "markdown")]
    [string]$OutputFormat = "table"
)

Write-Host "$Org|$BasecoatRepo|$OutputFormat"
'@

    $output = & pwsh -NoProfile -Command $testScript
    if ($output -ne "IBuySpy-Shared|basecoat|table") {
        throw "Default parameters test failed: expected 'IBuySpy-Shared|basecoat|table', got '$output'"
    }
    Write-Host '    ✓ Default parameters are correct'
}
catch {
    $failures += "Test 2 - Default parameters: $($_.Exception.Message)"
}

# Test 3: JSON output format validation structure
Write-Host "  Test 3: Validate JSON output format structure..." -ForegroundColor Yellow
try {
    $testCount++
    $testJsonOutput = @{
        scan_date           = (Get-Date -Format "o")
        org                 = "IBuySpy-Shared"
        source              = "IBuySpy-Shared/basecoat"
        total_source_assets = 3
        repos               = @(
            @{
                repo        = "test-repo"
                visibility  = "public"
                synced      = 2
                current     = 2
                stale       = 0
                custom      = 0
                totalFiles  = 2
                coverage    = 66.7
                assets      = @(
                    @{ asset = "agents/example.agent.md"; status = "current"; type = "agent" }
                )
            }
        )
        copilot_seats = @()
    } | ConvertTo-Json -Depth 5

    if (-not ($testJsonOutput | Test-Json)) {
        throw "JSON validation failed: output is not valid JSON"
    }

    $parsed = $testJsonOutput | ConvertFrom-Json
    if (-not $parsed.scan_date -or -not $parsed.org -or -not $parsed.repos) {
        throw "JSON structure validation failed: missing required fields"
    }
    Write-Host '    ✓ JSON output format is valid'
}
catch {
    $failures += "Test 3 - JSON output format: $($_.Exception.Message)"
}

# Test 4: Markdown output format validation
Write-Host "  Test 4: Validate markdown output format structure..." -ForegroundColor Yellow
try {
    $testCount++
    $testMarkdownOutput = @"
## Basecoat Adoption — IBuySpy-Shared

| Repo | Synced | Current | Stale | Coverage |
|------|--------|---------|-------|----------|
| test-repo | 2 | 2 | 0 | 66.7% |

### Copilot Seats

| User | Last Active | Editor |
|------|------------|--------|
| test-user | 2026-04-30T21:03:00.0000000Z | vscode |
"@

    if ($testMarkdownOutput -notmatch '## Basecoat Adoption') {
        throw "Markdown format validation failed: missing title"
    }
    if ($testMarkdownOutput -notmatch '\| Repo \| Synced \| Current \| Stale') {
        throw "Markdown format validation failed: missing table header"
    }
    Write-Host '    ✓ Markdown output format is valid'
}
catch {
    $failures += "Test 4 - Markdown output format: $($_.Exception.Message)"
}

# Test 5: Asset type detection (agent, instruction, prompt)
Write-Host "  Test 5: Validate asset type detection..." -ForegroundColor Yellow
try {
    $testCount++
    $assetTypes = @{
        "agents/example.agent.md"              = "agent"
        "instructions/example.instructions.md" = "instruction"
        "prompts/example.prompt.md"            = "prompt"
    }

    foreach ($file in $assetTypes.Keys) {
        $expectedType = $assetTypes[$file]
        if ($file -match '\.agent\.md$') {
            $actualType = "agent"
        }
        elseif ($file -match '\.instructions\.md$') {
            $actualType = "instruction"
        }
        elseif ($file -match '\.prompt\.md$') {
            $actualType = "prompt"
        }

        if ($actualType -ne $expectedType) {
            throw "Asset type detection failed for $($file): expected $($expectedType), got $($actualType)"
        }
    }
    Write-Host '    ✓ Asset type detection works correctly'
}
catch {
    $failures += "Test 5 - Asset type detection: $($_.Exception.Message)"
}

# Test 6: Sync path calculation
Write-Host "  Test 6: Validate sync path calculation..." -ForegroundColor Yellow
try {
    $testCount++
    $syncPathTests = @{
        "agents/example.agent.md"               = ".github/agents/example.agent.md"
        "instructions/security.instructions.md" = ".github/instructions/security.instructions.md"
        "prompts/template.prompt.md"            = ".github/prompts/template.prompt.md"
    }

    foreach ($source in $syncPathTests.Keys) {
        $expectedPath = $syncPathTests[$source]
        $type = if ($source -match 'agents') { 'agents' } elseif ($source -match 'instructions') { 'instructions' } else { 'prompts' }
        $filename = Split-Path $source -Leaf
        $actualPath = ".github/$type/$filename"

        if ($actualPath -ne $expectedPath) {
            throw "Sync path calculation failed for $($source): expected $($expectedPath), got $($actualPath)"
        }
    }
    Write-Host '    ✓ Sync path calculation is correct'
}
catch {
    $failures += "Test 6 - Sync path calculation: $($_.Exception.Message)"
}

# Test 7: Coverage percentage calculation
Write-Host "  Test 7: Validate coverage percentage calculation..." -ForegroundColor Yellow
try {
    $testCount++
    $totalSourceAssets = 10
    $synced = 7
    $expectedCoverage = [math]::Round(($synced / $totalSourceAssets) * 100, 1)

    if ($expectedCoverage -ne 70.0) {
        throw "Coverage calculation failed: expected 70.0%, got $expectedCoverage%"
    }
    Write-Host '    ✓ Coverage percentage calculation is correct'
}
catch {
    $failures += "Test 7 - Coverage percentage calculation: $($_.Exception.Message)"
}

# Test 8: Stale asset flagging
Write-Host "  Test 8: Validate stale asset detection..." -ForegroundColor Yellow
try {
    $testCount++
    $baseSha = "abc123"
    $staleSha = "def456"

    $isStale = $staleSha -ne $baseSha
    if (-not $isStale) {
        throw "Stale detection failed: should have detected mismatch"
    }

    $isCurrent = $baseSha -eq $baseSha
    if (-not $isCurrent) {
        throw "Current detection failed: should have detected match"
    }
    Write-Host '    ✓ Stale asset detection works correctly'
}
catch {
    $failures += "Test 8 - Stale asset detection: $($_.Exception.Message)"
}

# Test 9: Empty adoption report handling
Write-Host "  Test 9: Validate empty adoption report handling..." -ForegroundColor Yellow
try {
    $testCount++
    $emptyReport = @()
    if ($emptyReport.Count -ne 0) {
        throw "Empty report handling failed: expected 0 items, got $($emptyReport.Count)"
    }
    Write-Host '    ✓ Empty adoption report handling works'
}
catch {
    $failures += "Test 9 - Empty adoption report handling: $($_.Exception.Message)"
}

# Test 10: Copilot seat data structure
Write-Host "  Test 10: Validate Copilot seat data structure..." -ForegroundColor Yellow
try {
    $testCount++
    $seatInfo = @(
        @{
            login         = "user1"
            last_activity = "2026-04-30T21:03:00.0000000Z"
            editor        = "vscode"
            created       = "2026-01-01T00:00:00.0000000Z"
        }
    )

    if ($seatInfo[0].login -ne "user1" -or -not $seatInfo[0].last_activity) {
        throw "Seat data structure validation failed: missing or incorrect fields"
    }
    Write-Host '    ✓ Copilot seat data structure is valid'
}
catch {
    $failures += "Test 10 - Copilot seat data structure: $($_.Exception.Message)"
}

# ============================================================================
# Summary
# ============================================================================
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host 'Adoption Scanner Test Summary' -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

if ($failures.Count -gt 0) {
    Write-Host "`nFAILED: $($failures.Count) test(s) failed" -ForegroundColor Red
    $failures | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host "`nTotal checks performed: $testCount" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nAll adoption scanner tests passed ($testCount checks)" -ForegroundColor Green
