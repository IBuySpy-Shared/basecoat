---
name: dev-containers
description: "Use when creating devcontainer.json configurations, selecting Dev Container features, configuring GitHub Codespaces, or standardizing developer environments. Provides container templates, feature references, and Codespaces configuration guides."
---

# Dev Containers Skill

Use this skill when the task involves creating or improving development container environments — including devcontainer.json templates, VS Code Dev Container features, and GitHub Codespaces configuration.

## When to Use

- Creating a new `devcontainer.json` for a repository
- Adding Dev Container features for languages, tools, or runtimes
- Configuring Codespaces machine types, secrets, and dotfiles
- Standardizing developer environments across a team
- Debugging a broken or slow dev container startup

## How to Invoke

Reference this skill by attaching `skills/dev-containers/SKILL.md` to your agent context, or instruct the agent:

> Use the dev-containers skill. Apply the devcontainer template and feature reference to create a reproducible developer environment.

## Templates in This Skill

| Template | Purpose |
|---|---|
| `devcontainer-template.md` | Annotated devcontainer.json templates for common stacks (Node.js, Python, .NET, Java) |
| `codespaces-config-guide.md` | Codespaces configuration: machine types, secrets, prebuilds, and dotfiles integration |

## Key Concepts

| Concept | Description |
|---|---|
| `devcontainer.json` | Declarative config file that describes the development environment |
| Dev Container Features | Pre-built, versioned tool installers (e.g., `ghcr.io/devcontainers/features/node`) |
| Prebuilds | Pre-built container images to reduce Codespaces startup time |
| Lifecycle scripts | `onCreateCommand`, `postCreateCommand`, `postStartCommand` for environment setup |
| Secrets | Repository-level Codespaces secrets injected as environment variables |

## Agent Pairing

This skill supports any agent that produces or reviews development environment configuration. Coordinate with the `devops-engineer` agent for CI/CD container alignment and with the `backend-dev` or `frontend-dev` agents for stack-specific tooling requirements.
