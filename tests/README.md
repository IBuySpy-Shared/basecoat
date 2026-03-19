# Base Coat Tests

This directory contains smoke tests for the scaffolding repository.

## Scope

- Validate core repository structure and frontmatter checks
- Verify packaging scripts create release artifacts
- Verify git hook installation script configures `.githooks`
- Verify commit message scanner detects and rejects sensitive commit messages

## Run Tests

PowerShell:

```powershell
./tests/run-tests.ps1
```

Bash:

```bash
bash tests/run-tests.sh
```

Both test runners are designed to fail fast with clear messages.
