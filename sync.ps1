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

    foreach ($item in @('README.md', 'CHANGELOG.md', 'INVENTORY.md', 'version.json', 'basecoat-metadata.json', 'instructions', 'skills', 'prompts', 'agents', 'docs')) {
        $destination = Join-Path $fullTargetDir $item
        if (Test-Path $destination) {
            Remove-Item -Path $destination -Recurse -Force
        }

        Copy-Item -Path (Join-Path $sourcePath $item) -Destination $destination -Recurse -Force
    }

    # Remove agent taxonomy subdirs from staging — they contain only index
    # READMEs with relative links that break outside the source repo
    foreach ($taxDir in @('models', 'orchestrator', 'tasks', 'types')) {
        $taxPath = Join-Path $fullTargetDir "agents/$taxDir"
        if (Test-Path $taxPath) {
            Remove-Item -Path $taxPath -Recurse -Force
        }
    }

    # Copy Copilot-discoverable directories to their standard paths
    # Only copy flat agent/instruction/prompt/skill files — not taxonomy subdirs
    $githubDir = Join-Path $repoRoot '.github'
    New-Item -ItemType Directory -Force -Path $githubDir | Out-Null
    foreach ($copilotDir in @('instructions', 'prompts', 'skills')) {
        $source = Join-Path $fullTargetDir $copilotDir
        $dest = Join-Path $githubDir $copilotDir
        if (Test-Path $source) {
            if (Test-Path $dest) {
                Remove-Item -Path $dest -Recurse -Force
            }
            Copy-Item -Path $source -Destination $dest -Recurse -Force
        }
    }

    # Also copy skills to .agents/skills/ for cross-client interop (Agent Skills spec)
    $skillsSource = Join-Path $fullTargetDir 'skills'
    $agentSkillsDest = Join-Path $repoRoot '.agents' 'skills'
    if (Test-Path $skillsSource) {
        New-Item -ItemType Directory -Force -Path (Join-Path $repoRoot '.agents') | Out-Null
        if (Test-Path $agentSkillsDest) {
            Remove-Item -Path $agentSkillsDest -Recurse -Force
        }
        Copy-Item -Path $skillsSource -Destination $agentSkillsDest -Recurse -Force
    }

    # Agents: copy only *.agent.md files (skip taxonomy subdirs like models/, tasks/, types/)
    $agentSource = Join-Path $fullTargetDir 'agents'
    $agentDest = Join-Path $githubDir 'agents'
    if (Test-Path $agentSource) {
        if (Test-Path $agentDest) {
            Remove-Item -Path $agentDest -Recurse -Force
        }
        New-Item -ItemType Directory -Force -Path $agentDest | Out-Null
        Get-ChildItem -Path $agentSource -Filter '*.agent.md' | ForEach-Object {
            Copy-Item -Path $_.FullName -Destination $agentDest -Force
        }
    }

    Write-Host "Base Coat synced into $targetDir"
}
finally {
    if (Test-Path $tempRoot) {
        Remove-Item -Path $tempRoot -Recurse -Force
    }
}