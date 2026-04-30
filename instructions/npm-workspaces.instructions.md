---
description: "npm workspaces and monorepo patterns for multi-package projects"
applyTo: "**/package.json,**/turbo.json,**/pnpm-workspace.yaml"
---

# npm Workspaces Instruction

## Overview

This instruction guides Copilot to generate correct npm workspaces configuration
and monorepo patterns for multi-package JavaScript/TypeScript projects.

## Workspace Setup

### Root package.json

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "dev": "turbo run dev --parallel"
  }
}
```

### Directory Structure

```text
my-monorepo/
├── package.json          (root — private, defines workspaces)
├── turbo.json            (task orchestration)
├── packages/
│   ├── ui/               (shared component library)
│   ├── config/           (shared configs — tsconfig, eslint)
│   └── utils/            (shared utilities)
└── apps/
    ├── web/              (Next.js frontend)
    └── api/              (Express backend)
```

## Cross-Workspace Dependencies

Reference workspace packages using the `workspace:` protocol:

```json
{
  "name": "@myorg/web",
  "dependencies": {
    "@myorg/ui": "workspace:*",
    "@myorg/utils": "workspace:^1.0.0"
  }
}
```

## Turborepo Integration

### turbo.json Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**", "test/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Task Dependencies

- `^build` — run `build` in all dependency packages first
- `dependsOn: ["build"]` — run own `build` before this task
- `persistent: true` — long-running tasks (dev servers)

## Shared Configuration Packages

### Shared TypeScript Config

```json
{
  "name": "@myorg/tsconfig",
  "files": [
    "base.json",
    "nextjs.json",
    "node.json"
  ]
}
```

Usage in workspace packages:

```json
{
  "extends": "@myorg/tsconfig/nextjs.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

### Shared ESLint Config

```json
{
  "name": "@myorg/eslint-config",
  "main": "index.js",
  "dependencies": {
    "eslint-config-next": "^14.0.0",
    "eslint-config-prettier": "^9.0.0"
  }
}
```

## Workspace Scripts

### Running Commands in Specific Workspaces

```bash
# Run in a specific workspace
npm run build --workspace=@myorg/web

# Run in multiple workspaces
npm run test --workspace=@myorg/ui --workspace=@myorg/utils

# Run across all workspaces
npm run lint --workspaces

# Install a dependency in a specific workspace
npm install zod --workspace=@myorg/api
```

## Publishing Packages

### Changeset Configuration

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [["@myorg/ui", "@myorg/utils"]],
  "access": "restricted",
  "baseBranch": "main"
}
```

### Publishing Workflow

```bash
# Create a changeset
npx changeset

# Version packages (updates package.json and CHANGELOG)
npx changeset version

# Publish to registry
npx changeset publish
```

## Hoisting Strategies

### Default Hoisting

npm hoists shared dependencies to the root `node_modules`. Override with:

```json
{
  "workspaces": {
    "packages": ["packages/*"],
    "nohoist": ["**/react", "**/react-dom"]
  }
}
```

### When to Avoid Hoisting

- Packages with native binaries (different platforms)
- Conflicting peer dependency versions
- Bundlers that need local resolution (webpack, esbuild)

## CI Optimization for Monorepos

### Caching with Turborepo

```yaml
- name: Cache turbo build
  uses: actions/cache@v4
  with:
    path: .turbo
    key: turbo-${{ runner.os }}-${{ hashFiles('**/turbo.json') }}-${{ github.sha }}
    restore-keys: |
      turbo-${{ runner.os }}-${{ hashFiles('**/turbo.json') }}-
      turbo-${{ runner.os }}-
```

### Filtering Affected Packages

```bash
# Only build packages affected by changes
npx turbo run build --filter=...[origin/main]

# Build a specific package and its dependencies
npx turbo run build --filter=@myorg/web...
```

### Parallel CI Matrix

```yaml
strategy:
  matrix:
    package: [ui, utils, web, api]
steps:
  - run: npx turbo run test --filter=@myorg/${{ matrix.package }}
```

## Anti-Patterns

- Do not install dependencies in workspace subdirectories directly (use `--workspace` flag)
- Do not use relative paths for cross-workspace imports (use package names)
- Do not duplicate shared configs across workspaces (extract to a config package)
- Do not run `npm install` in individual workspace directories
- Do not skip `private: true` on the root package.json

## Best Practices

- Keep the root package.json minimal (only workspace tooling)
- Use `workspace:*` for internal dependencies to always use latest
- Define shared TypeScript and ESLint configs as workspace packages
- Use Turborepo or Nx for task orchestration and caching
- Set up changesets for versioning and publishing workflows
- Filter CI runs to only affected packages for faster builds
