---
description: "Use when building or reviewing Electron desktop apps. Covers webPreferences, IPC, packaging, code signing, auto-update, and credential storage."
applyTo: "**/electron/**,**/main.{js,ts},**/preload.{js,ts},**/forge.config.*,**/electron-builder.*"
---

# Electron Desktop App Standards

Use this instruction for any work on Electron apps: new features, security audits, packaging,
signing, or agent-driven reviews. Desktop apps have a fundamentally different attack surface than
web apps — apply these guardrails in every conversation that touches Electron code.

## webPreferences Baseline

Every `BrowserWindow` must be created with explicit, safe `webPreferences`.

- Set `contextIsolation: true` — always. This is the primary defence against renderer-to-main
  privilege escalation.
- Set `nodeIntegration: false` — always. Node.js APIs must never be directly accessible from
  renderer JavaScript.
- Set `sandbox: true` wherever the renderer does not require native modules. Sandbox reduces
  blast radius from renderer compromise.
- Never set `enableRemoteModule: true`; the `remote` module is deprecated and dangerous.
- Never set `webSecurity: false` except in isolated automated test environments with no user
  data. Never in production builds.
- Validate `webPreferences` in CI using `electron-security-policy` or a custom audit step.

### Review Lens — webPreferences

- Does every `new BrowserWindow()` call set `contextIsolation`, `nodeIntegration`, and `sandbox`
  explicitly?
- Is `enableRemoteModule` absent or explicitly `false`?
- Are `webSecurity` overrides documented, time-limited, and absent in release builds?

## Preload Scripts and IPC

The preload script is the only safe bridge between renderer and main process.

- Use `contextBridge.exposeInMainWorld` to expose a narrow, typed API surface — expose only the
  functions the renderer actually needs.
- Never expose `ipcRenderer` itself to the renderer. Wrapping it in a typed facade prevents
  channel name injection and unexpected message routing.
- Validate channel names in the main-process `ipcMain.handle` handler — maintain an allowlist
  of permitted channel strings and reject unknown channels.
- Never pass raw Node objects, `require`, `process`, or `global` references through
  `contextBridge`.
- Preload scripts must live inside the app bundle — never load preload scripts from a
  user-writable path.

### Review Lens — Preload + IPC

- Is every exposed function the minimum required surface?
- Are channel names validated server-side (main process)?
- Is `ipcRenderer` wrapped rather than directly exposed?
- Are preload paths resolved relative to `__dirname` inside the bundle?

## Process Spawning

Main-process code that spawns child processes carries OS-level risk.

- Never pass `{ shell: true }` to `child_process.spawn` when any part of the command or
  arguments originates from user input or renderer messages — `shell: true` enables shell
  injection.
- Resolve binary paths explicitly using `path.resolve` or the platform-specific binary
  discovery — never interpolate user input directly into the command string.
- Validate and sanitise every argument received via IPC before passing it to a spawned process.
- Prefer `execFile` over `exec` when a single binary with arguments is needed — `execFile`
  does not invoke a shell.
- Log spawned-process exit codes and stderr for auditability.

### Review Lens — Process Spawning

- Does any `spawn` / `exec` call include `shell: true` with user-controlled input?
- Are binary paths hard-coded or resolved from trusted locations?
- Are arguments validated before being forwarded to child processes?

## Renderer Trust Boundary

Treat the renderer like an untrusted browser tab, not a trusted server component.

- Never store secrets, access tokens, API keys, or PATs in `localStorage`, `sessionStorage`,
  or `IndexedDB` in the renderer — even temporarily.
- Renderer state is volatile and may be inspected by devtools or a compromised dependency.
- If the renderer needs a secret to make an authenticated request, proxy the request through
  the main process via IPC instead of passing the secret to the renderer.
- Treat all data received from the renderer via IPC as untrusted user input — validate, parse,
  and sanitise before acting on it in the main process.
- Apply `Content-Security-Policy` via `webContents.session.webRequest.onHeadersReceived` or
  through the `meta` tag in local HTML — restrict `script-src` to `'self'` and eliminate
  `'unsafe-inline'` and `'unsafe-eval'`.

### Review Lens — Renderer Trust Boundary

- Does any renderer code write tokens, credentials, or PII to browser storage?
- Are IPC payloads validated in the main process before use?
- Is CSP applied and restrictive enough to block inline scripts?

## Credential Storage

Desktop apps have access to OS-provided credential stores — use them.

- Use `keytar` (cross-platform) or Electron's built-in `safeStorage` API to store secrets.
  `safeStorage` encrypts with OS keychain on macOS, DPAPI on Windows, and Secret Service on
  Linux.
- Never write secrets to `app.getPath('userData')` in plaintext — JSON config files, SQLite
  databases, and log files in user data are accessible to any process running as the same user.
- Never bundle secrets in `app.asar` — the archive is trivially extractable.
- Never store secrets in environment variables passed to the renderer process.
- On first-run credential setup, prompt the user and store via `safeStorage.encryptString`
  immediately — do not cache in memory longer than necessary.

### Review Lens — Credential Storage

- Are any secrets written to disk in plaintext?
- Is `safeStorage` or `keytar` used for all persistent credentials?
- Is the user data directory free of unencrypted secrets?

## Auto-Update

Auto-update is a privileged code-execution pathway — secure it accordingly.

- Use `electron-updater` (electron-builder) or Squirrel with a signed update feed.
- Serve update metadata (`latest.yml` / `RELEASES`) and artifacts over HTTPS only — never
  HTTP.
- Sign every update artifact (see Code Signing section). `electron-updater` verifies the
  signature before applying; do not disable this check.
- Pin the update server URL as a build-time constant — never derive it from runtime config or
  a remote-fetched value that could be tampered with.
- Test rollback: ensure that a corrupt or signature-failed update does not leave the app in a
  broken state.

### Review Lens — Auto-Update

- Is the update feed served over HTTPS?
- Are all update artifacts signed and is signature verification enabled?
- Is the update server URL a hard-coded constant rather than a runtime-configurable value?

## Code Signing

Unsigned Electron apps trigger OS security warnings and are uninstallable on hardened endpoints.

**Windows (Authenticode):**

- Sign with an EV or OV code signing certificate via `signtool.exe`.
- Use `electron-builder`'s `win.certificateFile` / `win.certificatePassword` configuration
  pointing to a certificate stored in CI secrets — never committed to source control.
- Fail the CI build if `signtool` returns a non-zero exit code.

**macOS (Notarization):**

- Sign with a Developer ID Application certificate via `codesign`.
- Notarize using `notarytool` (recommended) or `altool` and staple the notarization ticket
  with `stapler`.
- Enable hardened runtime (`--options runtime`) and entitlements — do not add unnecessary
  entitlements.
- Fail the CI build if notarization returns an error.

**CI Guardrail:**

- Add a post-build step that verifies signatures before the artifact is uploaded:
  - Windows: `signtool verify /pa /v dist/<app>.exe`
  - macOS: `codesign --verify --deep --strict dist/<app>.app`
- Block the release pipeline if verification fails.

### Review Lens — Code Signing

- Is the CI pipeline configured to sign every release build?
- Are signing credentials stored as CI secrets — not in source control?
- Does the pipeline fail if signing or notarization fails?
- Is hardened runtime enabled on macOS?

## Packaging Hygiene

What ships in `app.asar` defines the attack surface of the installed app.

- Exclude `.env*` files, source maps (`*.map`), and dev-only dependencies from the asar.
  Configure `electron-builder`'s `files` array or Forge's `packagerConfig.ignore` to enforce
  this.
- Exclude test files, fixtures, and CI scripts from production builds.
- Verify `app.asar` contents in CI: extract the archive with `asar extract` and assert that
  no `.env*`, `*.map`, or `node_modules/.bin/` files are present.
- Produce a SHA-256 manifest of the build artifacts as part of the release pipeline and attach
  it to the GitHub release as a `.sha256` file for downstream integrity verification.
- Never include native binaries (`*.dll`, `*.dylib`, `*.so`) that were not signed as part of
  the app bundle.

### Review Lens — Packaging

- Are `.env*` files excluded from the asar?
- Are source maps excluded from production builds?
- Is there a CI step that extracts and inspects asar contents?
- Is a SHA-256 artifact manifest produced and published with each release?

## Desktop Apps and `security.instructions.md`

This instruction extends `security.instructions.md` for the Electron surface. All general
security guardrails still apply — in particular browser storage rules (no tokens in
`localStorage`), secrets management, and input validation at trust boundaries.
See [`security.instructions.md`](security.instructions.md) for the full baseline.
