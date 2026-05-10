$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

Write-Host 'Running A/B experiment harness smoke test...'

$outputDir = Join-Path $repoRoot 'test-results'
pwsh scripts\run-experiment.ps1 -Experiment 'code-review-improvement' -OutputDir $outputDir | Out-Null

$jsonPath = Join-Path $outputDir 'code-review-improvement-ab-report.json'
$mdPath = Join-Path $outputDir 'code-review-improvement-ab-report.md'

if (-not (Test-Path $jsonPath)) {
    throw 'A/B experiment test failed: JSON report not created'
}
if (-not (Test-Path $mdPath)) {
    throw 'A/B experiment test failed: Markdown report not created'
}

$report = Get-Content $jsonPath -Raw | ConvertFrom-Json
if (-not $report.summary -or -not $report.cases -or $report.cases.Count -lt 1) {
    throw 'A/B experiment test failed: malformed report output'
}

Write-Host "A/B experiment harness smoke test passed (winner=$($report.summary.overallWinner))" -ForegroundColor Green
