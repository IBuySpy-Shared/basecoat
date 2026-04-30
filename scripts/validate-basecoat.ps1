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

$errors = 0

foreach ($file in $files) {
    $lines = Get-Content $file.FullName -TotalCount 20
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
}

if ($errors -gt 0) {
    throw "Validation failed with $errors error(s)"
}

Write-Host 'Base Coat validation passed'