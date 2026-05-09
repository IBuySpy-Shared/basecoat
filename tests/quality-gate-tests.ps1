#!/usr/bin/env pwsh
<#
.SYNOPSIS
    CI-blocking quality gate for BaseCoat guidance assets.

.DESCRIPTION
    Runs audit-assets.ps1 and fails if the average quality score falls below
    the minimum threshold (default 5.0 / 10). This is intentionally lenient
    to catch only severely degraded assets, not to enforce perfection.

    Also fails if any single asset scores 0.0 (completely empty or broken).

.PARAMETER MinAvgScore
    Minimum acceptable average score across all assets. Default: 5.0.

.PARAMETER MaxRedPct
    Maximum acceptable percentage of assets scoring below 6.0. Default: 50.
    (i.e., fail if more than half the library is red.)

.EXAMPLE
    pwsh tests/quality-gate-tests.ps1
    pwsh tests/quality-gate-tests.ps1 -MinAvgScore 6.0 -MaxRedPct 30
#>
param(
    [double]$MinAvgScore = 5.0,
    [int]$MaxRedPct = 50
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

$failures = @()
$testCount = 0

Write-Host "`nRunning asset quality gate tests..." -ForegroundColor Yellow
Write-Host "  Min avg score: $MinAvgScore / 10"
Write-Host "  Max red pct:   $MaxRedPct%"
Write-Host ""

# ---------------------------------------------------------------------------
# Collect scores from audit-assets.ps1
# ---------------------------------------------------------------------------
$jsonOutput = pwsh scripts/audit-assets.ps1 -Format json 2>$null
$data = ($jsonOutput -join "`n") | ConvertFrom-Json

$totalAssets = $data.totalAssets
$avgScore    = $data.avgScore
$redCount    = $data.red
$redPct      = if ($totalAssets -gt 0) { [math]::Round($redCount * 100 / $totalAssets, 1) } else { 0 }

Write-Host "  Assets audited:  $totalAssets"
Write-Host "  Average score:   $avgScore / 10"
Write-Host ("  Red (< 6.0):     {0} ({1}%)" -f $redCount, $redPct)

# ---------------------------------------------------------------------------
# Test 1: Average score above minimum
# ---------------------------------------------------------------------------
$testCount++
if ($avgScore -lt $MinAvgScore) {
    $failures += "Average quality score $avgScore is below minimum $MinAvgScore — library health is degraded"
    Write-Host "  FAIL: avg score $avgScore < $MinAvgScore" -ForegroundColor Red
} else {
    Write-Host "  PASS: avg score $avgScore >= $MinAvgScore" -ForegroundColor Green
}

# ---------------------------------------------------------------------------
# Test 2: Red percentage below max
# ---------------------------------------------------------------------------
$testCount++
if ($redPct -gt $MaxRedPct) {
    $failures += "$redPct% of assets score below 6.0 (max allowed: $MaxRedPct%) — too many weak assets"
    Write-Host "  FAIL: $redPct% red > $MaxRedPct% threshold" -ForegroundColor Red
} else {
    Write-Host "  PASS: $redPct% red <= $MaxRedPct% threshold" -ForegroundColor Green
}

# ---------------------------------------------------------------------------
# Test 3: No zero-score assets (completely broken files)
# ---------------------------------------------------------------------------
$testCount++
$zeroAssets = $data.assets | Where-Object { $_.Score -le 0.5 }
if ($zeroAssets) {
    $names = ($zeroAssets | Select-Object -ExpandProperty Name) -join ", "
    $failures += "Assets with score ≤ 0.5 (broken/empty): $names"
    Write-Host "  FAIL: $($zeroAssets.Count) asset(s) with score ≤ 0.5: $names" -ForegroundColor Red
} else {
    Write-Host "  PASS: no assets with score ≤ 0.5" -ForegroundColor Green
}

# ---------------------------------------------------------------------------
# Test 4: Category-level health — no category avg below 4.0
# ---------------------------------------------------------------------------
$testCount++
$catFails = @()
foreach ($cat in @("agent", "skill", "instruction")) {
    $catAssets = $data.assets | Where-Object { $_.Category -eq $cat }
    if ($catAssets.Count -eq 0) { continue }
    $catAvg = [math]::Round(($catAssets | Measure-Object -Property Score -Average).Average, 1)
    if ($catAvg -lt 4.0) {
        $catFails += "${cat}s avg $catAvg < 4.0"
    }
}
if ($catFails.Count -gt 0) {
    $failures += "Category-level health failure: $($catFails -join '; ')"
    Write-Host "  FAIL: $($catFails -join '; ')" -ForegroundColor Red
} else {
    Write-Host "  PASS: all category averages >= 4.0" -ForegroundColor Green
}

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
Write-Host ""
if ($failures.Count -eq 0) {
    Write-Host "Quality gate: PASSED ($testCount tests)" -ForegroundColor Green
} else {
    Write-Host "Quality gate: FAILED ($($failures.Count) of $testCount tests)" -ForegroundColor Red
    foreach ($f in $failures) {
        Write-Host "  - $f" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Run 'pwsh scripts/audit-assets.ps1 -Weak' to see weak assets." -ForegroundColor DarkGray
    exit 1
}
