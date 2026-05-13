---

name: electron-apps
description: Use when building secure, production-ready Electron desktop apps with best practices for IPC, CSP, state management, testing, packaging, and updates.
applyTo: agent-electron-developer, agent-desktop-engineer
compatibility:
  editors:
    - vscode
  platforms:
    - github
metadata:
  category: "Uncategorized"
  tags: ["uncategorized"]
  maturity: "beta"
  audience: ["developers"]
allowed-tools: ["bash", "git", "grep", "find"]
---

# Electron Application Development

Use this skill to design, implement, and harden Electron applications that must balance desktop UX with browser-grade security boundaries. It is especially helpful when the input includes renderer features, native desktop integrations, preload APIs, update flows, packaging requirements, or multi-window coordination. The output should be a secure Electron architecture, reviewed IPC surface, and implementation guidance that returns production-ready patterns instead of ad hoc examples. This skill produces recommendations for process boundaries, BrowserWindow defaults, preload contracts, packaging, tests, and release automation.

## Quick Start

1. Set `nodeIntegration: false`, `sandbox: true`, `enableRemoteModule: false` in every `BrowserWindow`.
2. Use a preload script + `contextBridge.exposeInMainWorld` for all renderer↔main communication.
3. Add a strict CSP `<meta>` tag in every HTML file.
4. Package with Electron Forge; sign and notarize for production distribution.
5. Use `electron-updater` for auto-updates; always sign update artifacts.

## Reference Files

| File | Contents |
|------|----------|
| [`references/process-architecture.md`](references/process-architecture.md) | Main/renderer process model, IPC patterns, Content Security Policy |
| [`references/packaging-updates.md`](references/packaging-updates.md) | State management, Electron Forge packaging, macOS signing, auto-updates, performance tips |
| [`references/testing-security.md`](references/testing-security.md) | Unit tests (Jest), integration tests (WebdriverIO), full security checklist |

## Inputs and Outputs

Typical input includes app requirements, BrowserWindow options, preload interfaces, IPC requests, packaging targets, or security review findings. Expected output includes implementation steps, code examples, review notes, and a checklist that returns clear next actions for the main process, renderer, and build pipeline. A good response should explicitly call out what data enters from renderer input, what the preload layer exposes, what the main process returns, and what artifacts packaging produces.

## Secure Window Example

```ts
const mainWindow = new BrowserWindow({
  width: 1280,
  height: 800,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
    devTools: !app.isPackaged,
  },
})

ipcMain.handle('settings:load', async () => {
  return settingsStore.getAll()
})
```

Use patterns like this to keep privileged APIs in the main process, expose only minimal preload methods, and ensure every renderer request has a defined return value. When the input asks for file system access, secrets, or OS integration, route that work through audited IPC handlers instead of direct renderer access.

## Key Patterns

- **IPC**: `contextBridge.exposeInMainWorld` + `ipcMain.handle` — never expose raw Node APIs to renderer
- **State (single window)**: React Query over `window.api.*`
- **State (multi-window)**: `ipcMain` broadcast from main process
- **Never store secrets** in renderer or source — use `process.env` in main only
- **Testing**: validate preload contracts, IPC handlers, and packaged app behavior before release
- **Packaging**: sign installers, notarize macOS builds, and verify auto-update metadata before publishing
