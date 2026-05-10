$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

function Assert-PathExists {
    param(
        [string]$Path,
        [string]$Message
    )
    if (-not (Test-Path $Path)) {
        throw $Message
    }
}

Write-Host 'Running behavioral evaluation smoke test...'

$caseFile = Join-Path $repoRoot 'tests\evals\smoke.behavior.json'
$outputDir = Join-Path $repoRoot 'test-results'
$summaryFile = Join-Path $outputDir 'eval-summary.md'

pwsh scripts\eval-assets.ps1 -CaseFile $caseFile -OutputDir $outputDir -SummaryFile $summaryFile | Out-Null

$jsonPath = Join-Path $outputDir 'eval-agents.json'
Assert-PathExists -Path $jsonPath -Message 'Behavioral eval did not create eval-agents.json'
Assert-PathExists -Path $summaryFile -Message 'Behavioral eval did not create eval-summary.md'

$report = Get-Content $jsonPath -Raw | ConvertFrom-Json
if (-not $report.case_count -or $report.case_count -lt 1) {
    throw 'Behavioral eval report has no cases'
}

if ($report.avg_score -lt 0 -or $report.avg_score -gt 10) {
    throw "Behavioral eval avg_score out of range: $($report.avg_score)"
}

Write-Host "Behavioral evaluation smoke test passed (avg=$($report.avg_score))" -ForegroundColor Green
