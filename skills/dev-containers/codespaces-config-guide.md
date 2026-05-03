# GitHub Codespaces Configuration Guide

A reference for configuring GitHub Codespaces to deliver fast, consistent, and secure developer environments.

## Machine Types

Select the machine type in `.devcontainer/devcontainer.json` or through repository settings:

| Machine | vCPU | RAM | Disk | Recommended Use |
|---|---|---|---|---|
| 2-core | 2 | 8 GB | 32 GB | Documentation, simple scripts |
| 4-core | 4 | 16 GB | 32 GB | Most web applications |
| 8-core | 8 | 32 GB | 64 GB | Build-heavy workloads, monorepos |
| 16-core | 16 | 64 GB | 128 GB | Machine learning, data processing |
| 32-core | 32 | 128 GB | 128 GB | High-performance compute |

```json
// devcontainer.json — set the default machine type for this repo
{
  "hostRequirements": {
    "cpus": 4,
    "memory": "16gb",
    "storage": "32gb"
  }
}
```

## Codespaces Secrets

Store sensitive values as Codespaces secrets — never as environment variables in `devcontainer.json`.

Configure secrets at:
- **User level**: `github.com/settings/codespaces`
- **Repository level**: `github.com/<org>/<repo>/settings/secrets/codespaces`

Reference secrets in `devcontainer.json`:

```json
{
  "remoteEnv": {
    "MY_API_KEY": "${localEnv:MY_API_KEY}"
  }
}
```

## Prebuilds

Prebuilds build the container image ahead of time to reduce Codespace start time.

Enable via: **Repository Settings → Codespaces → Set up prebuild**

Best practices:
- Trigger prebuilds on push to `main`
- Select the largest machine type used in the repo for the prebuild
- Cache `node_modules`, pip packages, or Maven dependencies in `onCreateCommand`

```json
// Optimize postCreateCommand to leverage prebuild cache
{
  "onCreateCommand": "npm ci --prefer-offline"
}
```

## Dotfiles Integration

Users can configure Codespaces to clone their personal dotfiles repository and run an install script.

```json
// devcontainer.json can suggest, but cannot override, user dotfiles settings
// Recommend team members configure: github.com/settings/codespaces → Dotfiles
```

Document the recommended dotfiles repository in `docs/DEVELOPER_SETUP.md`.

## Port Forwarding

```json
{
  "forwardPorts": [3000, 5432, 6379],
  "portsAttributes": {
    "3000": {
      "label": "App",
      "onAutoForward": "openBrowser"
    },
    "5432": {
      "label": "PostgreSQL",
      "onAutoForward": "silent"
    }
  }
}
```

## Codespaces Policy (Organization Level)

Configure at `github.com/organizations/<org>/settings/codespaces`:

| Policy | Recommended Setting |
|---|---|
| Access | Selected repositories only |
| Idle timeout | 30 minutes |
| Retention period | 30 days |
| Maximum machine type | 8-core (unless ML workloads required) |
| Trusted repository | Require organization membership |

## Checklist — New Repository Codespaces Setup

- [ ] `.devcontainer/devcontainer.json` created and committed
- [ ] Required features listed with pinned major versions
- [ ] `postCreateCommand` installs all dependencies
- [ ] Required ports listed in `forwardPorts`
- [ ] Codespaces secrets documented in `docs/DEVELOPER_SETUP.md`
- [ ] Prebuild configured for `main` branch
- [ ] Machine type set to minimum required for the stack
- [ ] Tested end-to-end: new Codespace → run application
