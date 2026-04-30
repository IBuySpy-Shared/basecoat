$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$failures = @()
$testCount = 0

# Helper function to extract frontmatter from a file
function Get-Frontmatter {
    param([string]$Path)
    
    $content = Get-Content $Path -Raw
    if ($content -match '^---\r?\n([\s\S]+?)\r?\n---\r?\n') {
        return $matches[1]
    }
    return $null
}

# Helper function to get content after frontmatter
function Get-ContentAfterFrontmatter {
    param([string]$Path)
    
    $content = Get-Content $Path -Raw
    if ($content -match '^---\r?\n[\s\S]+?\r?\n---\r?\n([\s\S]*)$') {
        return $matches[1]
    }
    return $content
}

# Helper function to extract YAML field value
function Get-YamlField {
    param(
        [string]$Content,
        [string]$FieldName
    )
    
    # Remove carriage returns for consistent line splitting
    $content = $content -replace "`r", ""
    $lines = $content -split "`n"
    
    foreach ($line in $lines) {
        if ($line -match "^$([regex]::Escape($FieldName))\s*:\s*(.+)$") {
            $value = $matches[1].Trim()
            # Remove surrounding quotes if present
            $value = $value -replace '^[`"](.+)[`"]$', '$1'
            return $value
        }
    }
    return $null
}

Write-Host 'Starting agent integration tests...' -ForegroundColor Cyan

# ============================================================================
# Test 1: Agent frontmatter validation (description required)
# ============================================================================
Write-Host "`nTest 1: Agent frontmatter validation" -ForegroundColor Yellow

$agentFiles = Get-ChildItem agents -Filter '*.agent.md' -File
foreach ($file in $agentFiles) {
    $testCount++
    $frontmatter = Get-Frontmatter $file.FullName
    
    if ($null -eq $frontmatter) {
        $failures += "$($file.Name): Missing YAML frontmatter"
        continue
    }
    
    $description = Get-YamlField $frontmatter 'description'
    
    if ($null -eq $description -or [string]::IsNullOrWhiteSpace($description)) {
        $failures += "$($file.Name): Missing or empty 'description' field in frontmatter"
    }
}

Write-Host "  Checked $($agentFiles.Count) agent files for frontmatter" -ForegroundColor Green

# ============================================================================
# Test 2: Agent required sections (Inputs, Workflow/Process, Output/Report)
# ============================================================================
Write-Host "`nTest 2: Agent required sections validation" -ForegroundColor Yellow

foreach ($file in $agentFiles) {
    $testCount++
    $content = Get-ContentAfterFrontmatter $file.FullName
    
    # Check for ## Inputs section (case-insensitive)
    if ($content -inotmatch '##\s+inputs\b') {
        $failures += "$($file.Name): Missing '## Inputs' section"
    }
    
    # Check for ## Workflow or ## Process (case-insensitive)
    if ($content -inotmatch '##\s+workflow\b' -and $content -inotmatch '##\s+process\b') {
        $failures += "$($file.Name): Missing '## Workflow' or '## Process' section"
    }
    
    # Check for output-like sections (## Output, ## Expected Output, ## Report, ## Results, etc.)
    # This catches any heading with output, report, or results in it
    if ($content -inotmatch '##.*\b(output|report|results)\b') {
        $failures += "$($file.Name): Missing output section (## Output, ## Expected Output, ## Report, etc.)"
    }
}

Write-Host "  Checked $($agentFiles.Count) agent files for required sections" -ForegroundColor Green

# ============================================================================
# Test 3: Instruction file frontmatter validation
# ============================================================================
Write-Host "`nTest 3: Instruction frontmatter validation" -ForegroundColor Yellow

$instructionFiles = Get-ChildItem instructions -Filter '*.instructions.md' -File
foreach ($file in $instructionFiles) {
    $testCount++
    $frontmatter = Get-Frontmatter $file.FullName
    
    if ($null -eq $frontmatter) {
        $failures += "$($file.Name): Missing YAML frontmatter"
        continue
    }
    
    $description = Get-YamlField $frontmatter 'description'
    $applyTo = Get-YamlField $frontmatter 'applyTo'
    
    if ($null -eq $description -or [string]::IsNullOrWhiteSpace($description)) {
        $failures += "$($file.Name): Missing or empty 'description' field in frontmatter"
    }
    
    if ($null -eq $applyTo -or [string]::IsNullOrWhiteSpace($applyTo)) {
        $failures += "$($file.Name): Missing or empty 'applyTo' field in frontmatter"
    }
}

Write-Host "  Checked $($instructionFiles.Count) instruction files for frontmatter" -ForegroundColor Green

# ============================================================================
# Test 4: Skill directory and SKILL.md frontmatter validation
# ============================================================================
Write-Host "`nTest 4: Skill frontmatter validation" -ForegroundColor Yellow

$skillDirs = Get-ChildItem skills -Directory
$skillCount = 0

foreach ($dir in $skillDirs) {
    $skillMd = Join-Path $dir.FullName 'SKILL.md'
    
    if (-not (Test-Path $skillMd)) {
        $testCount++
        $failures += "$($dir.Name): Missing SKILL.md file"
        continue
    }
    
    $testCount++
    $skillCount++
    $frontmatter = Get-Frontmatter $skillMd
    
    if ($null -eq $frontmatter) {
        $failures += "$($dir.Name)/SKILL.md: Missing YAML frontmatter"
        continue
    }
    
    $name = Get-YamlField $frontmatter 'name'
    $description = Get-YamlField $frontmatter 'description'
    
    if ($null -eq $name -or [string]::IsNullOrWhiteSpace($name)) {
        $failures += "$($dir.Name)/SKILL.md: Missing or empty 'name' field in frontmatter"
    }
    
    if ($null -eq $description -or [string]::IsNullOrWhiteSpace($description)) {
        $failures += "$($dir.Name)/SKILL.md: Missing or empty 'description' field in frontmatter"
    }
}

Write-Host "  Checked $skillCount skill directories for SKILL.md and frontmatter" -ForegroundColor Green

# ============================================================================
# Test 5: Prompt file frontmatter validation
# ============================================================================
Write-Host "`nTest 5: Prompt frontmatter validation" -ForegroundColor Yellow

$promptFiles = Get-ChildItem prompts -Filter '*.prompt.md' -File -ErrorAction SilentlyContinue
$promptCount = 0

foreach ($file in $promptFiles) {
    $testCount++
    $promptCount++
    $frontmatter = Get-Frontmatter $file.FullName
    
    if ($null -eq $frontmatter) {
        $failures += "$($file.Name): Missing YAML frontmatter"
    } else {
        $description = Get-YamlField $frontmatter 'description'
        if ($null -eq $description -or [string]::IsNullOrWhiteSpace($description)) {
            $failures += "$($file.Name): Missing or empty 'description' field in frontmatter"
        }
    }
}

if ($promptCount -gt 0) {
    Write-Host "  Checked $promptCount prompt files for frontmatter" -ForegroundColor Green
} else {
    Write-Host "  No prompt files found" -ForegroundColor Green
}

# ============================================================================
# Summary
# ============================================================================
Write-Host "`n`n================================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

if ($failures.Count -gt 0) {
    Write-Host "`nFAILED: $($failures.Count) issues found" -ForegroundColor Red
    $failures | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host "`nTotal checks performed: $testCount" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nAll integration tests passed ($testCount checks)" -ForegroundColor Green
