#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Detects basecoat asset adoption across organization repositories.

.DESCRIPTION
    Scans all repos in the org for synced basecoat assets (agents, instructions,
    prompts, skills). Reports which repos have which assets, version drift vs.
    basecoat main, and active Copilot seat data.

.PARAMETER Org
    GitHub organization to scan. Defaults to IBuySpy-Shared.

.PARAMETER BasecoatRepo
    The basecoat source repository. Defaults to basecoat.

.PARAMETER OutputFormat
    Output format: 'table' (default), 'json', or 'markdown'.

.EXAMPLE
    ./detect-basecoat.ps1
    ./detect-basecoat.ps1 -Org "MyOrg" -OutputFormat json
#>
[CmdletBinding()]
param(
    [string]$Org = "IBuySpy-Shared",
    [string]$BasecoatRepo = "basecoat",
    [ValidateSet("table", "json", "markdown")]
    [string]$OutputFormat = "table"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Helpers ---

function Invoke-GhApi {
    param([string]$Endpoint)
    $result = gh api $Endpoint 2>&1
    if ($LASTEXITCODE -ne 0) { return $null }
    return $result | ConvertFrom-Json
}

function Get-FileSha {
    param([string]$Owner, [string]$Repo, [string]$Path)
    $data = Invoke-GhApi "/repos/$Owner/$Repo/contents/$Path"
    if ($data) { return $data.sha }
    return $null
}

# --- Main ---

Write-Host "`n=== Basecoat Adoption Scanner ===" -ForegroundColor Cyan
Write-Host "Org: $Org | Source: $Org/$BasecoatRepo`n"

# 1. Get all repos in org (excluding basecoat itself)
Write-Host "Scanning repositories..." -ForegroundColor Yellow
$repos = gh repo list $Org --json name,visibility --limit 100 2>&1 | ConvertFrom-Json
$targetRepos = $repos | Where-Object { $_.name -ne $BasecoatRepo }

if (-not $targetRepos -or $targetRepos.Count -eq 0) {
    Write-Host "No target repositories found in $Org (excluding $BasecoatRepo)." -ForegroundColor Red
    exit 0
}

Write-Host "Found $($targetRepos.Count) target repo(s)`n"

# 2. Get basecoat source asset manifest (agents, instructions, prompts)
Write-Host "Building basecoat source manifest..." -ForegroundColor Yellow
$sourceAssets = @{}

# Agents
$agentFiles = gh api "/repos/$Org/$BasecoatRepo/contents/agents" 2>&1 | ConvertFrom-Json
if ($agentFiles) {
    foreach ($f in $agentFiles | Where-Object { $_.name -match '\.agent\.md$' }) {
        $sourceAssets["agents/$($f.name)"] = @{
            sha      = $f.sha
            type     = "agent"
            syncPath = ".github/agents/$($f.name)"
        }
    }
}

# Instructions
$instrFiles = gh api "/repos/$Org/$BasecoatRepo/contents/instructions" 2>&1 | ConvertFrom-Json
if ($instrFiles) {
    foreach ($f in $instrFiles | Where-Object { $_.name -match '\.instructions\.md$' }) {
        $sourceAssets["instructions/$($f.name)"] = @{
            sha      = $f.sha
            type     = "instruction"
            syncPath = ".github/instructions/$($f.name)"
        }
    }
}

# Prompts
$promptFiles = gh api "/repos/$Org/$BasecoatRepo/contents/prompts" 2>&1 | ConvertFrom-Json
if ($promptFiles) {
    foreach ($f in $promptFiles | Where-Object { $_.name -match '\.prompt\.md$' }) {
        $sourceAssets["prompts/$($f.name)"] = @{
            sha      = $f.sha
            type     = "prompt"
            syncPath = ".github/prompts/$($f.name)"
        }
    }
}

Write-Host "Source manifest: $($sourceAssets.Count) assets (agents, instructions, prompts)`n"

# 3. Scan each repo for synced assets (optimized: list .github dirs first, then SHA-check matches)
Write-Host "Scanning target repos for basecoat assets..." -ForegroundColor Yellow
$adoptionReport = @()

# Build lookup of basecoat filenames → source info
$filenameLookup = @{}
foreach ($asset in $sourceAssets.GetEnumerator()) {
    $filename = Split-Path $asset.Value.syncPath -Leaf
    $filenameLookup[$filename] = $asset
}

foreach ($repo in $targetRepos) {
    $repoName = $repo.name
    $repoAssets = @()
    $currentCount = 0
    $staleCount = 0

    # List .github/agents, .github/instructions, .github/prompts in one pass
    $syncDirs = @(".github/agents", ".github/instructions", ".github/prompts")
    $foundFiles = @()

    foreach ($dir in $syncDirs) {
        $listing = Invoke-GhApi "/repos/$Org/$repoName/contents/$dir"
        if ($listing) {
            foreach ($f in $listing) {
                $foundFiles += @{ name = $f.name; sha = $f.sha; path = "$dir/$($f.name)" }
            }
        }
    }

    # Match found files against basecoat source manifest
    foreach ($f in $foundFiles) {
        $match = $filenameLookup[$f.name]
        if ($match) {
            if ($f.sha -eq $match.Value.sha) {
                $currentCount++
                $repoAssets += @{ asset = $match.Key; status = "current"; type = $match.Value.type }
            }
            else {
                $staleCount++
                $repoAssets += @{ asset = $match.Key; status = "stale"; type = $match.Value.type }
            }
        }
    }

    $totalSynced = $currentCount + $staleCount
    if ($totalSynced -gt 0 -or $foundFiles.Count -gt 0) {
        $nonBasecoat = $foundFiles.Count - $totalSynced
        $adoptionReport += @{
            repo        = $repoName
            visibility  = $repo.visibility
            synced      = $totalSynced
            current     = $currentCount
            stale       = $staleCount
            custom      = $nonBasecoat
            totalFiles  = $foundFiles.Count
            coverage    = if ($sourceAssets.Count -gt 0) { [math]::Round(($totalSynced / $sourceAssets.Count) * 100, 1) } else { 0 }
            assets      = $repoAssets
        }
    }
}

# 4. Get Copilot seat data
Write-Host "`nFetching Copilot seat data..." -ForegroundColor Yellow
$seats = Invoke-GhApi "/orgs/$Org/copilot/billing/seats"
$seatInfo = @()
if ($seats -and $seats.seats) {
    foreach ($s in $seats.seats) {
        $seatInfo += @{
            login           = $s.assignee.login
            last_activity   = $s.last_activity_at
            editor          = $s.last_activity_editor
            created         = $s.created_at
        }
    }
}

# 5. Output results
Write-Host "`n=== Adoption Report ===" -ForegroundColor Cyan

if ($adoptionReport.Count -eq 0) {
    Write-Host "No basecoat assets detected in any target repositories." -ForegroundColor Yellow
    Write-Host "  Tip: Run sync.ps1 or sync.sh to deploy assets to consumer repos.`n"
}

switch ($OutputFormat) {
    "json" {
        @{
            scan_date  = (Get-Date -Format "o")
            org        = $Org
            source     = "$Org/$BasecoatRepo"
            total_source_assets = $sourceAssets.Count
            repos      = $adoptionReport
            copilot_seats = $seatInfo
        } | ConvertTo-Json -Depth 5
    }
    "markdown" {
        Write-Host "`n## Basecoat Adoption — $Org`n"
        Write-Host "| Repo | Synced | Current | Stale | Coverage |"
        Write-Host "|------|--------|---------|-------|----------|"
        foreach ($r in $adoptionReport) {
            $staleFlag = if ($r.stale -gt 0) { " ⚠️" } else { "" }
            Write-Host "| $($r.repo) | $($r.synced) | $($r.current) | $($r.stale)$staleFlag | $($r.coverage)% |"
        }
        if ($seatInfo.Count -gt 0) {
            Write-Host "`n### Copilot Seats`n"
            Write-Host "| User | Last Active | Editor |"
            Write-Host "|------|------------|--------|"
            foreach ($s in $seatInfo) {
                Write-Host "| $($s.login) | $($s.last_activity) | $($s.editor) |"
            }
        }
    }
    default {
        # Table format
        foreach ($r in $adoptionReport) {
            $staleFlag = if ($r.stale -gt 0) { " (⚠️ $($r.stale) stale)" } else { "" }
            $customFlag = if ($r.custom -gt 0) { " + $($r.custom) custom" } else { "" }
            Write-Host "  $($r.repo) — $($r.synced)/$($sourceAssets.Count) basecoat assets ($($r.coverage)%)$staleFlag$customFlag" -ForegroundColor Green
            foreach ($a in $r.assets) {
                $icon = if ($a.status -eq "current") { "✓" } else { "⟳" }
                $color = if ($a.status -eq "current") { "Gray" } else { "DarkYellow" }
                Write-Host "    $icon $($a.asset) [$($a.status)]" -ForegroundColor $color
            }
        }
        if ($seatInfo.Count -gt 0) {
            Write-Host "`n  Copilot Seats:" -ForegroundColor Cyan
            foreach ($s in $seatInfo) {
                Write-Host "    $($s.login) — last active: $($s.last_activity) ($($s.editor))"
            }
        }
    }
}

Write-Host "`n=== Scan Complete ===" -ForegroundColor Cyan
