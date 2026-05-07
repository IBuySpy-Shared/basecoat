# @basecoat/copilot-cli-plugin

> Foundation for the `/basecoat` command in GitHub Copilot CLI — implements agent delegation from natural language input.

## Purpose

This plugin provides the core scaffolding for routing `/basecoat <agent> <task>` CLI commands to the appropriate Base Coat agent. It is the foundation described in [GitHub issue #477](https://github.com/IBuySpy-Shared/basecoat/issues/477).

## Quick Start

```bash
npm install
npm run build
npm test
```

## Architecture

The plugin is composed of four modules, each implemented in a separate issue:

| Module | Path | Issue | Responsibility |
|---|---|---|---|
| **Parser** | `src/parser/` | [#479](https://github.com/IBuySpy-Shared/basecoat/issues/479) | Parses raw CLI input into a `BasecoatCommand` |
| **Registry** | `src/registry/` | [#482](https://github.com/IBuySpy-Shared/basecoat/issues/482) | Loads and caches the agent registry |
| **Context** | `src/context/` | [#481](https://github.com/IBuySpy-Shared/basecoat/issues/481) | Builds invocation context (env, user, session) |
| **Delegation** | `src/delegation/` | [#483](https://github.com/IBuySpy-Shared/basecoat/issues/483) | Delegates the command to the resolved agent |

### Data flow

```
rawInput → Parser → BasecoatCommand
                          ↓
Registry ──────→ AgentEntry (resolved)
                          ↓
Context ────────→ InvocationContext
                          ↓
Delegation ─────→ DelegationResult
```

## Related Issues

- [#477](https://github.com/IBuySpy-Shared/basecoat/issues/477) — Plugin scaffold (this PR)
- [#479](https://github.com/IBuySpy-Shared/basecoat/issues/479) — Implement parser
- [#481](https://github.com/IBuySpy-Shared/basecoat/issues/481) — Implement context builder
- [#482](https://github.com/IBuySpy-Shared/basecoat/issues/482) — Implement agent registry
- [#483](https://github.com/IBuySpy-Shared/basecoat/issues/483) — Implement delegation
