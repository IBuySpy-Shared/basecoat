---
name: electron-apps
description: "Use when building desktop applications with Electron. Covers secure IPC patterns, preload isolation, CSP hardening, state management, performance optimization, native OS integration, packaging, and testing strategies for production-ready Electron apps."
compatibility: ["VS Code", "Cursor", "Windsurf", "Claude Code"]
metadata:
  category: "Desktop Development"
  tags: ["electron", "desktop", "ipc", "security", "preload", "packager"]
allowed-tools: ["bash", "node", "npm", "git"]
---

# Electron App Development

Use this skill when building secure, performant Electron desktop applications. Covers secure inter-process communication (IPC), preload-based security architecture, content security policies, state management patterns, native OS integration, and production deployment strategies.

## Workflow

1. **Architecture Design** — Choose a secure IPC pattern and plan process separation
2. **Security Hardening** — Implement preload isolation, CSP, and sandbox configuration
3. **State Management** — Select and configure persistent storage (electron-store, SQLite, or Realm)
4. **Native OS Integration** — Use native modules for OS dialogs, file access, and system notifications
5. **Performance Optimization** — Minimize memory footprint, implement lazy loading, enable v8 code caching
6. **Testing Strategy** — Unit test main + renderer, E2E test with Spectron/Playwright, mock native modules
7. **Packaging & Release** — Use electron-builder for multi-platform packaging, auto-update configuration

---

## IPC Security Patterns

### Secure Context Bridge (Preload Model)

**Main Process (main.ts):**
```typescript
import { app, BrowserWindow, ipcMain } from 'electron';

const mainWindow = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, 'preload.ts'),
    sandbox: true,
    nodeIntegration: false,
    contextIsolation: true,
  },
});

ipcMain.handle('file:read', async (event, filePath: string) => {
  // Validate filePath against allowlist
  if (!isAllowedPath(filePath)) {
    throw new Error('Access denied');
  }
  return fs.readFileSync(filePath, 'utf-8');
});
```

**Preload Process (preload.ts):**
```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  readFile: (filePath: string) =>
    ipcRenderer.invoke('file:read', filePath),
  onEvent: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
});
```

**Renderer Process (app.tsx):**
```typescript
declare global {
  interface Window {
    api: {
      readFile: (path: string) => Promise<string>;
      onEvent: (channel: string, cb: Function) => void;
    };
  }
}

// Usage
const content = await window.api.readFile('/app/config.json');
```

**Benefits:**
- Preload runs before renderer, with access to Node APIs
- Context isolation prevents renderer from tampering with bridge
- Validate all inputs in main process before executing
- No direct require('electron') in renderer

---

### Message Validation & Error Handling

```typescript
// main.ts
interface FileReadMessage {
  filePath: string;
  encoding?: 'utf-8' | 'ascii';
}

const validateFileReadMessage = (msg: unknown): msg is FileReadMessage => {
  if (typeof msg !== 'object' || msg === null) return false;
  const { filePath, encoding } = msg as Record<string, unknown>;
  return (
    typeof filePath === 'string' &&
    (!encoding || encoding === 'utf-8' || encoding === 'ascii') &&
    filePath.startsWith('/app/') // allowlist check
  );
};

ipcMain.handle('file:read', async (event, msg: unknown) => {
  try {
    if (!validateFileReadMessage(msg)) {
      throw new Error('Invalid message format');
    }
    return await fs.promises.readFile(msg.filePath, msg.encoding || 'utf-8');
  } catch (error) {
    console.error(`File read failed for ${(msg as any)?.filePath}:`, error);
    throw new Error('File access failed'); // Don't leak internal errors
  }
});
```

---

## Preload Isolation & Content Security Policy

### Preload Sandbox Configuration

```typescript
// main.ts - BrowserWindow configuration
const mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  webPreferences: {
    preload: path.join(__dirname, 'preload.ts'),
    nodeIntegration: false,           // Disable Node in renderer
    contextIsolation: true,           // Isolate context
    sandbox: true,                    // Run preload in sandbox
    enableRemoteModule: false,        // Disable remote module
    webSecurity: true,                // Enable web security
    allowRunningInsecureContent: false, // Block mixed content
    experimentalFeatures: false,      // Disable experimental APIs
  },
});
```

### Content Security Policy

```typescript
// main.ts - CSP headers
mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://api.example.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
    },
  });
});
```

### Disable Dangerous APIs

```typescript
// main.ts
mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
  const allowedPermissions = ['camera', 'microphone'];
  if (allowedPermissions.includes(permission)) {
    callback(true);
  } else {
    callback(false);
  }
});
```

---

## State Management

### Electron-Store (Simple Persistence)

```typescript
// src/store.ts
import Store from 'electron-store';

interface AppState {
  windowState: { x: number; y: number; width: number; height: number };
  userPreferences: { theme: 'light' | 'dark'; language: string };
  recentFiles: string[];
}

export const store = new Store<AppState>({
  defaults: {
    windowState: { x: 0, y: 0, width: 1200, height: 800 },
    userPreferences: { theme: 'light', language: 'en' },
    recentFiles: [],
  },
});

// Usage in main process
store.set('userPreferences.theme', 'dark');
const theme = store.get('userPreferences.theme'); // 'dark'
```

### SQLite for Complex Data

```typescript
// src/database.ts
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(app.getPath('userData'), 'app.db');
export const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Expose via IPC
ipcMain.handle('db:query', async (event, sql: string, params: any[]) => {
  try {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  } catch (error) {
    throw new Error(`Query failed: ${(error as Error).message}`);
  }
});
```

---

## Native OS Integration

### File Dialogs

```typescript
import { dialog } from 'electron';

ipcMain.handle('file:openDialog', async (event, options: any) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'JSON', extensions: ['json'] }],
    ...options,
  });
  return result.filePaths;
});

// Renderer
const files = await window.api.openFileDialog();
```

### System Notifications

```typescript
import { Notification } from 'electron';

const notify = (title: string, options?: any) => {
  new Notification({
    title,
    icon: path.join(__dirname, 'assets/icon.png'),
    ...options,
  }).show();
};

// Usage
ipcMain.handle('notify', (event, title: string, message: string) => {
  notify(title, { body: message });
});
```

### Global Shortcuts

```typescript
import { globalShortcut } from 'electron';

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Shift+X', () => {
    mainWindow.webContents.send('shortcut:devtools-toggle');
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
```

---

## Performance Optimization

### Memory Management

```typescript
// Monitor memory and unload unused modules
setInterval(() => {
  const memory = process.getProcessMemoryInfo();
  if (memory.heapUsed > 512 * 1024 * 1024) { // 512MB threshold
    mainWindow.webContents.session.clearCache();
    console.log('Cache cleared due to memory pressure');
  }
}, 60000);

// Enable garbage collection in renderer
mainWindow.webContents.session.enableSpellChecker = false; // Disable if not needed
```

### Lazy Loading Modules

```typescript
// Load native modules only when needed
let sqliteModule: any;
const getSqlite = async () => {
  if (!sqliteModule) {
    sqliteModule = await import('better-sqlite3');
  }
  return sqliteModule;
};

ipcMain.handle('db:init', async () => {
  const sqlite = await getSqlite();
  // ... use sqlite
});
```

### V8 Code Caching

```typescript
// main.ts
mainWindow.webContents.session.setCodeCachePath(
  path.join(app.getPath('userData'), '.code-cache')
);
```

---

## Testing Strategy

### Unit Testing (Main Process)

```typescript
// src/__tests__/ipc.test.ts
import { ipcMain } from 'electron';
import { describe, it, expect, beforeEach } from 'vitest';

describe('IPC Handlers', () => {
  beforeEach(() => {
    ipcMain.removeAllListeners();
  });

  it('should validate file paths', async () => {
    // Mock main process handler
    const mockHandler = vi.fn(async (event, filePath) => {
      if (!filePath.startsWith('/app/')) {
        throw new Error('Access denied');
      }
      return `File: ${filePath}`;
    });

    ipcMain.handle('file:read', mockHandler);
    expect(() => mockHandler({}, '/etc/passwd')).toThrow('Access denied');
    expect(mockHandler({}, '/app/config.json')).resolves.toBe('File: /app/config.json');
  });
});
```

### E2E Testing with Playwright

```typescript
// e2e/app.spec.ts
import { test, expect } from '@playwright/test';
import { electronApp, firstWindow } from 'playwright-electron';

test('should open and display window', async () => {
  const app = await electronApp.launch({ args: ['.'] });
  const window = await app.firstWindow();

  expect(await window.title()).toContain('My App');
  expect(await window.textContent('h1')).toContain('Welcome');

  await app.close();
});

test('should read files via IPC', async () => {
  const app = await electronApp.launch({ args: ['.'] });
  const window = await app.firstWindow();

  const content = await window.evaluate(async () => {
    return await (window as any).api.readFile('/app/data.json');
  });

  expect(content).toContain('"key":');
  await app.close();
});
```

---

## Packaging & Release

### Electron-Builder Configuration

```json
{
  "build": {
    "appId": "com.example.myapp",
    "productName": "My App",
    "directories": {
      "output": "dist",
      "buildResources": "assets"
    },
    "files": [
      "dist/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "win": {
      "target": ["nsis", "portable"],
      "certificateFile": "path/to/cert.pfx",
      "certificatePassword": "${env.CERT_PASS}"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    },
    "publish": {
      "provider": "github",
      "owner": "your-org",
      "repo": "my-app",
      "token": "${env.GH_TOKEN}"
    }
  }
}
```

### Auto-Update Configuration

```typescript
// main.ts
import { autoUpdater } from 'electron-updater';

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: 'Restart to apply the update?',
      buttons: ['Restart', 'Later'],
    }).then(({ response }) => {
      if (response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
});
```

---

## Security Checklist

- [ ] Disable `nodeIntegration` and enable `contextIsolation`
- [ ] Use preload script for all API exposure
- [ ] Validate all IPC messages in main process
- [ ] Set CSP headers blocking inline scripts and eval
- [ ] Disable `enableRemoteModule` and `allowRunningInsecureContent`
- [ ] Use allowlist for file paths and URLs
- [ ] Sign all native modules and executable
- [ ] Test with automated security scanner (e.g., SQLMap for query injection)
- [ ] Keep Electron and dependencies updated
- [ ] Run in sandbox mode by default

---

## Non-Goals

- Wallet/blockchain integration (use dedicated libraries)
- Full feature parity with web version (desktop has different UX patterns)
- Building cross-platform from one config (some platform-specific logic needed)
