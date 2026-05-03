# devcontainer.json Templates

Use these templates as starting points for common technology stacks. Customize features and lifecycle scripts to match the project's requirements.

## Node.js / TypeScript

```json
{
  "name": "Node.js",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm",

  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "GitHub.copilot",
        "ms-vscode.vscode-typescript-next"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    }
  },

  "postCreateCommand": "npm install",
  "forwardPorts": [3000],
  "remoteEnv": {
    "NODE_ENV": "development"
  }
}
```

## Python

```json
{
  "name": "Python",
  "image": "mcr.microsoft.com/devcontainers/python:1-3.12-bookworm",

  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "ms-python.python",
        "ms-python.vscode-pylance",
        "ms-python.black-formatter",
        "GitHub.copilot"
      ],
      "settings": {
        "python.defaultInterpreterPath": "/usr/local/bin/python",
        "editor.formatOnSave": true,
        "[python]": {
          "editor.defaultFormatter": "ms-python.black-formatter"
        }
      }
    }
  },

  "postCreateCommand": "pip install -r requirements.txt",
  "forwardPorts": [8000]
}
```

## .NET

```json
{
  "name": ".NET",
  "image": "mcr.microsoft.com/devcontainers/dotnet:1-8.0-bookworm",

  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/azure-cli:1": {}
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "ms-dotnettools.csdevkit",
        "ms-dotnettools.csharp",
        "GitHub.copilot"
      ],
      "settings": {
        "editor.formatOnSave": true
      }
    }
  },

  "postCreateCommand": "dotnet restore",
  "forwardPorts": [5000, 5001]
}
```

## Java (Spring Boot)

```json
{
  "name": "Java",
  "image": "mcr.microsoft.com/devcontainers/java:1-21-bookworm",

  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/java:1": {
      "version": "21",
      "jdkDistro": "ms"
    }
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "vscjava.vscode-java-pack",
        "vscjava.vscode-spring-boot-dashboard",
        "GitHub.copilot"
      ]
    }
  },

  "postCreateCommand": "./mvnw dependency:resolve",
  "forwardPorts": [8080]
}
```

## Lifecycle Script Reference

| Script | When it runs | Use for |
|---|---|---|
| `initializeCommand` | Before container is created | Host-side setup |
| `onCreateCommand` | Once after container is created | One-time setup (installs) |
| `updateContentCommand` | On each content update | Dependency sync |
| `postCreateCommand` | After `updateContentCommand` | Final setup steps |
| `postStartCommand` | After container starts | Start background services |
| `postAttachCommand` | After VS Code attaches | Editor-specific setup |

## Commonly Used Features

| Feature | Registry Path |
|---|---|
| GitHub CLI | `ghcr.io/devcontainers/features/github-cli:1` |
| Docker-in-Docker | `ghcr.io/devcontainers/features/docker-in-docker:2` |
| Node.js | `ghcr.io/devcontainers/features/node:1` |
| Python | `ghcr.io/devcontainers/features/python:1` |
| Azure CLI | `ghcr.io/devcontainers/features/azure-cli:1` |
| kubectl + Helm | `ghcr.io/devcontainers/features/kubectl-helm-minikube:1` |
| Terraform | `ghcr.io/devcontainers-contrib/features/terraform-asdf:2` |
| PowerShell | `ghcr.io/devcontainers/features/powershell:1` |
