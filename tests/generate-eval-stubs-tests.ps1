#!/usr/bin/env pwsh

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$scriptPath = Join-Path $repoRoot 'scripts/generate-eval-stubs.ps1'

$scriptContent = Get-Content $scriptPath -Raw
$marker = "# Resolve skills directory relative to the script's repo root"
$markerIndex = $scriptContent.IndexOf($marker)
if ($markerIndex -lt 0) {
    throw 'Could not isolate generate-eval-stubs.ps1 helper functions for testing'
}

$functionSection = $scriptContent.Substring(0, $markerIndex)
. ([scriptblock]::Create($functionSection))

Write-Host 'Running generate-eval-stubs tests...'

$yaml = Build-EvalYaml -SkillName 'demo-skill' -UseForItems @() -DoNotUseForItems @('Use a different skill')
$defaultPositiveCount = ([regex]::Matches($yaml, 'input: "Help me with demo-skill"')).Count
if ($defaultPositiveCount -ne 3) {
    throw "Expected 3 default positive scenarios, found $defaultPositiveCount"
}

$yamlWithFallbackNegative = Build-EvalYaml -SkillName 'demo-skill' -UseForItems @('Help me with demo-skill') -DoNotUseForItems @('Use a different skill')
if ($yamlWithFallbackNegative -notmatch 'input: "Tell me a joke about programming"') {
    throw 'Expected fallback negative scenario to use the shared default constant'
}

Write-Host 'generate-eval-stubs tests passed'
