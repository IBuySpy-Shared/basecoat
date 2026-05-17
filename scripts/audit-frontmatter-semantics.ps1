#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Audits frontmatter semantics coverage for agents and skills.

.DESCRIPTION
    Scans `agents/*.agent.md` and `skills/*/SKILL.md`, then reports coverage
    and missing counts for semantic metadata fields (including invocation and
    visibility semantics) to help drive consistency work.

.PARAMETER OutputDir
    Output directory for reports. Defaults to `test-results/audits/frontmatter`.
#>
param(
    [string]$OutputDir = 'test-results/audits/frontmatter'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path $PSScriptRoot -Parent
$outputPath = Join-Path $repoRoot $OutputDir
if (-not (Test-Path $outputPath)) {
    New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
}

function Get-Frontmatter {
    param([string]$FilePath)
    $content = Get-Content $FilePath -Raw
    if ($content -match '(?s)^---\s*\r?\n(.*?)\r?\n---') {
        return $Matches[1]
    }
    return ''
}

function Test-Field {
    param(
        [string]$Frontmatter,
        [string]$Field
    )
    return $Frontmatter -match "(?m)^$([regex]::Escape($Field))\s*:"
}

$assetSets = @(
    @{
        Category = 'agents'
        Files = @(Get-ChildItem (Join-Path $repoRoot 'agents') -Filter '*.agent.md' -File)
        Fields = @(
            'name', 'description', 'compatibility', 'metadata', 'allowed-tools',
            'model', 'allowed_skills', 'task_phase', 'interaction_type',
            'invocation_rules', 'visibility'
        )
    },
    @{
        Category = 'skills'
        Files = @(Get-ChildItem (Join-Path $repoRoot 'skills') -Directory | ForEach-Object {
            $skillPath = Join-Path $_.FullName 'SKILL.md'
            if (Test-Path $skillPath) { Get-Item $skillPath }
        })
        Fields = @(
            'name', 'description', 'compatibility', 'metadata', 'allowed-tools',
            'invocation_rules', 'visibility'
        )
    }
)

$reportRows = [System.Collections.Generic.List[object]]::new()

foreach ($set in $assetSets) {
    $total = $set.Files.Count
    foreach ($field in $set.Fields) {
        $present = 0
        foreach ($file in $set.Files) {
            $frontmatter = Get-Frontmatter -FilePath $file.FullName
            if ($frontmatter -and (Test-Field -Frontmatter $frontmatter -Field $field)) {
                $present++
            }
        }
        $missing = $total - $present
        $coverage = if ($total -gt 0) { [math]::Round(($present * 100.0) / $total, 1) } else { 0.0 }
        $reportRows.Add([pscustomobject]@{
            category = $set.Category
            field = $field
            total = $total
            present = $present
            missing = $missing
            coverage_pct = $coverage
        })
    }
}

$jsonFile = Join-Path $outputPath 'frontmatter-semantics.json'
$mdFile = Join-Path $outputPath 'frontmatter-semantics.md'

$reportRows | ConvertTo-Json -Depth 4 | Set-Content -Path $jsonFile -Encoding UTF8

$md = [System.Collections.Generic.List[string]]::new()
$md.Add('# Frontmatter Semantics Audit')
$md.Add('')
$md.Add('| Category | Field | Present | Missing | Coverage % |')
$md.Add('|---|---|---:|---:|---:|')
foreach ($row in $reportRows | Sort-Object category, field) {
    $md.Add("| $($row.category) | `$($row.field)` | $($row.present)/$($row.total) | $($row.missing) | $($row.coverage_pct) |")
}

$md | Set-Content -Path $mdFile -Encoding UTF8

Write-Host "Frontmatter semantics reports written to $OutputDir"
Write-Host "  - $jsonFile"
Write-Host "  - $mdFile"
