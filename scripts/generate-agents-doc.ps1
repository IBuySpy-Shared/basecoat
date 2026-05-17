#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Regenerates docs/agents/AGENTS.md from agents/*.agent.md frontmatter.

.DESCRIPTION
    Reads all agent files, extracts frontmatter name and description, then writes
    a markdown catalog with the current agent count and table rows.

.EXAMPLE
    pwsh scripts/generate-agents-doc.ps1
#>

param(
    [string]$OutputPath = (Join-Path $PSScriptRoot ".." "docs" "agents" "AGENTS.md")
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$agentsDir = Join-Path $repoRoot "agents"

if (-not (Test-Path $agentsDir)) {
    throw "Agents directory not found: $agentsDir"
}

$agentRows = @()

Get-ChildItem -Path $agentsDir -Filter "*.agent.md" -File | Sort-Object Name | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -notmatch '(?ms)^---\s*\r?\n(.*?)\r?\n---') {
        return
    }

    $frontmatter = $Matches[1]
    $defaultName = $_.Name -replace '\.agent\.md$', ''
    $name = if ($frontmatter -match '(?m)^name:\s*(.+)\s*$') { $Matches[1].Trim().Trim('"') } else { $defaultName }
    $description = if ($frontmatter -match '(?m)^description:\s*(.+)\s*$') { $Matches[1].Trim().Trim('"') } else { "No description" }

    $description = $description -replace '\|', '\|'
    $description = $description -replace '\s+', ' '
    if ($description.Length -gt 220) {
        $description = $description.Substring(0, 217) + '...'
    }

    $agentRows += [ordered]@{
        Name        = $name
        FileName    = $_.Name
        Description = $description
    }
}

$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('# Agents')
[void]$sb.AppendLine()
[void]$sb.AppendLine('This file lists all available agents in the BaseCoat framework.')
[void]$sb.AppendLine()
[void]$sb.AppendLine("> **$($agentRows.Count) agents** available")
[void]$sb.AppendLine()
[void]$sb.AppendLine('| Agent | Description |')
[void]$sb.AppendLine('|---|---|')

foreach ($row in $agentRows) {
    $url = "https://github.com/IBuySpy-Shared/basecoat/blob/main/agents/$($row.FileName)"
    [void]$sb.AppendLine("| [$($row.Name)]($url) | $($row.Description) |")
}

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

Set-Content -Path $OutputPath -Value $sb.ToString().TrimEnd() -Encoding utf8

Write-Host "Agents doc written: $OutputPath"
Write-Host "Agents documented: $($agentRows.Count)"
