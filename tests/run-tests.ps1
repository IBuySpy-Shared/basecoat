$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

function Assert-PathExists {
    param(
        [string]$Path,
        [string]$Message
    )

    if (-not (Test-Path $Path)) {
        throw $Message
    }
}

function Assert-Equal {
    param(
        [string]$Actual,
        [string]$Expected,
        [string]$Message
    )

    if ($Actual -ne $Expected) {
        throw "$Message. Expected '$Expected', got '$Actual'."
    }
}

Write-Host 'Running validate-basecoat.ps1...'
./scripts/validate-basecoat.ps1

Write-Host 'Running package-basecoat.ps1...'
./scripts/package-basecoat.ps1

$version = (Get-Content version.json -Raw | ConvertFrom-Json).version
Assert-PathExists -Path "dist/base-coat-$version.zip" -Message 'Packaging test failed: zip artifact missing'
Assert-PathExists -Path "dist/base-coat-$version.tar.gz" -Message 'Packaging test failed: tar.gz artifact missing'
Assert-PathExists -Path 'dist/SHA256SUMS.txt' -Message 'Packaging test failed: SHA256SUMS.txt missing'

$checksums = Get-Content 'dist/SHA256SUMS.txt' -Raw
if ($checksums -notmatch "base-coat-$version.zip" -or $checksums -notmatch "base-coat-$version.tar.gz") {
    throw 'Packaging test failed: checksum file missing expected artifact names'
}

Write-Host 'Running install-git-hooks.ps1...'
./scripts/install-git-hooks.ps1
$hooksPath = (git config --get core.hooksPath)
Assert-Equal -Actual $hooksPath -Expected '.githooks' -Message 'Hook installation test failed'

Write-Host 'Running commit message scanner negative test...'
$tempRepo = Join-Path ([System.IO.Path]::GetTempPath()) ("basecoat-test-" + [System.Guid]::NewGuid().ToString())

try {
    New-Item -ItemType Directory -Path $tempRepo | Out-Null
    Push-Location $tempRepo
    git init | Out-Null
    git config user.name 'basecoat-test'
    git config user.email 'basecoat-test@example.com'
    Set-Content -Path 'test.txt' -Value 'hello'
    git add test.txt
    git commit -m 'safe commit message' | Out-Null
    Set-Content -Path 'test.txt' -Value 'updated'
    git add test.txt
    git commit -m '-----BEGIN PRIVATE KEY-----' | Out-Null

    $scanScript = Join-Path $repoRoot 'scripts/scan-commit-messages.sh'
    if (Get-Command bash -ErrorAction SilentlyContinue) {
        $output = & bash $scanScript 'HEAD~1..HEAD' 2>&1
        if ($LASTEXITCODE -eq 0) {
            throw 'Commit message scanner test failed: expected failure for sensitive commit message'
        }

        $global:LASTEXITCODE = 0
    }
    else {
        Write-Host 'Skipping commit message scanner execution test: bash not available in environment.'
    }
}
finally {
    Pop-Location
    if (Test-Path $tempRepo) {
        Remove-Item -Path $tempRepo -Recurse -Force
    }
}

Write-Host 'Running sync process tests...'
& pwsh -NoProfile -File (Join-Path $PSScriptRoot 'sync-tests.ps1')
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Sync process tests failed' -ForegroundColor Red
    exit 1
}

Write-Host 'Running adoption scanner tests...'
& pwsh -NoProfile -File (Join-Path $PSScriptRoot 'adoption-scanner-tests.ps1')
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Adoption scanner tests failed' -ForegroundColor Red
    exit 1
}

Write-Host 'Running workflow guardrails tests...'
& pwsh -NoProfile -File (Join-Path $PSScriptRoot 'workflow-guardrails-tests.ps1')
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Workflow guardrails tests failed' -ForegroundColor Red
    exit 1
}

Write-Host 'Running data workload tests...'
& pwsh -NoProfile -File (Join-Path $PSScriptRoot 'data-workload-tests.ps1')
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Data workload tests failed' -ForegroundColor Red
    exit 1
}

Write-Host 'All PowerShell tests passed'
exit 0