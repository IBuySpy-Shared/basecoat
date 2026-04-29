$ErrorActionPreference = 'Stop'

$sourceRepo = if ($env:BASECOAT_REPO) { $env:BASECOAT_REPO } else { 'https://github.com/YOUR-ORG/basecoat.git' }
$sourceRef = if ($env:BASECOAT_REF) { $env:BASECOAT_REF } else { 'main' }
$targetDir = if ($env:BASECOAT_TARGET_DIR) { $env:BASECOAT_TARGET_DIR } else { '.github/base-coat' }

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'git is required'
}

$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    throw 'Run this inside a git repository'
}

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid().ToString())
$sourcePath = Join-Path $tempRoot 'source'

try {
    New-Item -ItemType Directory -Path $tempRoot | Out-Null
    git clone --depth 1 --branch $sourceRef $sourceRepo $sourcePath | Out-Null

    $fullTargetDir = Join-Path $repoRoot $targetDir
    New-Item -ItemType Directory -Force -Path $fullTargetDir | Out-Null

    foreach ($item in @('README.md', 'CHANGELOG.md', 'INVENTORY.md', 'version.json', 'instructions', 'skills', 'prompts', 'agents')) {
        $destination = Join-Path $fullTargetDir $item
        if (Test-Path $destination) {
            Remove-Item -Path $destination -Recurse -Force
        }

        Copy-Item -Path (Join-Path $sourcePath $item) -Destination $destination -Recurse -Force
    }

    # Copy Copilot-discoverable directories to their standard paths
    $githubDir = Join-Path $repoRoot '.github'
    foreach ($copilotDir in @('agents', 'instructions', 'prompts')) {
        $source = Join-Path $fullTargetDir $copilotDir
        $dest = Join-Path $githubDir $copilotDir
        if (Test-Path $source) {
            if (Test-Path $dest) {
                Remove-Item -Path $dest -Recurse -Force
            }
            Copy-Item -Path $source -Destination $dest -Recurse -Force
        }
    }

    Write-Host "Base Coat synced into $targetDir"
}
finally {
    if (Test-Path $tempRoot) {
        Remove-Item -Path $tempRoot -Recurse -Force
    }
}