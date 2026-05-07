$ErrorActionPreference = 'Stop'

$rootDir = if ($args.Count -gt 0) { $args[0] } else { (Get-Location).Path }
Set-Location $rootDir

$required = @('README.md', 'CHANGELOG.md', 'INVENTORY.md', 'version.json', 'sync.sh', 'sync.ps1', 'instructions', 'skills', 'prompts', 'agents')
foreach ($item in $required) {
    if (-not (Test-Path $item)) {
        throw "Missing required path: $item"
    }
}

$files = Get-ChildItem instructions, prompts, agents, skills -Recurse -File | Where-Object {
    $_.Name -eq 'SKILL.md' -or $_.Name -eq 'AGENT.md' -or $_.Name -like '*.instructions.md' -or $_.Name -like '*.prompt.md' -or $_.Name -like '*.agent.md'
}

# Also scan .agents/skills/ for cross-client Agent Skills interop (if present)
if (Test-Path '.agents/skills') {
    $files += Get-ChildItem '.agents/skills' -Recurse -File | Where-Object {
        $_.Name -eq 'SKILL.md'
    }
}

$errors = 0
$warnings = 0

foreach ($file in $files) {
    $lines = Get-Content $file.FullName -TotalCount 50
    if ($lines.Count -eq 0 -or $lines[0] -ne '---') {
        Write-Host "ERROR: Missing frontmatter start in $($file.FullName)" -ForegroundColor Red
        $errors++
        continue
    }

    # Common: all assets require description
    if (-not ($lines | Select-String -Pattern '^description:' -Quiet)) {
        Write-Host "ERROR: $($file.Name) missing 'description' in frontmatter" -ForegroundColor Red
        $errors++
    }

    # Agents and Skills require name
    if (($file.Name -eq 'SKILL.md' -or $file.Name -like '*.agent.md') -and -not ($lines | Select-String -Pattern '^name:' -Quiet)) {
        Write-Host "ERROR: $($file.Name) missing 'name' in frontmatter" -ForegroundColor Red
        $errors++
    }

    # Instructions require applyTo
    if ($file.Name -like '*.instructions.md' -and -not ($lines | Select-String -Pattern '^applyTo:' -Quiet)) {
        Write-Host "ERROR: $($file.Name) missing 'applyTo' in frontmatter" -ForegroundColor Red
        $errors++
    }

    # Agent Skills spec: SKILL.md and .agent.md should have compatibility, metadata, allowed-tools
    if ($file.Name -eq 'SKILL.md' -or $file.Name -like '*.agent.md') {
        # Check for spec compliance (optional but encouraged)
        if (-not ($lines | Select-String -Pattern '^compatibility:' -Quiet)) {
            Write-Host "WARNING: $($file.FullName) missing 'compatibility' in Agent Skills spec" -ForegroundColor Yellow
            $warnings++
        }
        if (-not ($lines | Select-String -Pattern '^metadata:' -Quiet)) {
            Write-Host "WARNING: $($file.FullName) missing 'metadata' in Agent Skills spec" -ForegroundColor Yellow
            $warnings++
        }
        if (-not ($lines | Select-String -Pattern '^allowed-tools:' -Quiet)) {
            Write-Host "WARNING: $($file.FullName) missing 'allowed-tools' in Agent Skills spec" -ForegroundColor Yellow
            $warnings++
        }

        # Validate skill name format (lowercase, hyphens/numbers only)
        $skillName = $lines | Select-String -Pattern '^name:\s*"?([a-z0-9\-]+)"?' | ForEach-Object { $_.Matches.Groups[1].Value.Trim() }
        if ($skillName -and -not ($skillName -match '^[a-z0-9\-]{1,64}$')) {
            Write-Host "ERROR: $($file.Name) skill name '$skillName' is invalid (must be lowercase alphanumeric with hyphens, max 64 chars)" -ForegroundColor Red
            $errors++
        }

        # Check that skill directory name matches skill name
        if ($file.Name -eq 'SKILL.md') {
            $dirName = Split-Path -Leaf (Split-Path $file.FullName)
            if ($skillName -and $dirName -ne $skillName) {
                Write-Host "ERROR: $($file.FullName) skill name '$skillName' does not match directory name '$dirName'" -ForegroundColor Red
                $errors++
            }
        }

        # Validate description length
        $descLine = $lines | Select-String -Pattern '^description:\s*'
        if ($descLine) {
            $descContent = $lines | Select-String -Pattern '^description:' | ForEach-Object { $_ -replace 'description:\s*' }
            if ($descContent.Length -lt 1 -or $descContent.Length -gt 1024) {
                Write-Host "ERROR: $($file.Name) description must be 1-1024 characters (found {$($descContent.Length)})" -ForegroundColor Red
                $errors++
            }
        }
    }
}

if ($errors -gt 0) {
    throw "Validation failed with $errors error(s)"
}

if ($warnings -gt 0) {
    Write-Host "Base Coat validation passed with $warnings warning(s)" -ForegroundColor Yellow
} else {
    Write-Host 'Base Coat validation passed' -ForegroundColor Green
}