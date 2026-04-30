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

foreach ($file in $files) {
    $lines = Get-Content $file.FullName -TotalCount 20
    if ($lines.Count -eq 0 -or $lines[0] -ne '---') {
        throw "Missing frontmatter start in $($file.FullName)"
    }

    if (-not ($lines | Select-String -Pattern '^description:' -Quiet)) {
        throw "Missing description in frontmatter for $($file.FullName)"
    }

    if (($file.Name -eq 'SKILL.md' -or $file.Name -like '*.agent.md') -and -not ($lines | Select-String -Pattern '^name:' -Quiet)) {
        throw "Missing name in frontmatter for $($file.FullName)"
    }
}

Write-Host 'Base Coat validation passed'