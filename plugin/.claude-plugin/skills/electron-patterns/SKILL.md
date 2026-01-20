---
name: Electron Patterns
description: This skill should be used when the user asks to "plan an Electron app", "design Electron architecture", "create Electron main/renderer processes", mentions Electron development, or refers to IPC, main process, renderer process, or desktop app development. Provides comprehensive Electron architecture patterns for building cross-platform desktop applications.
version: 0.1.0
---

# Electron Patterns

Electron enables building cross-platform desktop applications using web technologies. This skill provides architecture patterns for building secure, performant, and maintainable Electron applications with proper separation between main and renderer processes.

## Core Electron Principles

**Architecture:**
- **Main Process**: Node.js environment, controls application lifecycle
- **Renderer Process**: Web environment (Chromium), displays UI
- **IPC (Inter-Process Communication)**: Communication between main and renderer
- **Security**: Sandbox renderer, limit Node.js integration

**Architecture Guidelines:**
- Minimize IPC calls (batch when possible)
- Keep main process focused on native operations
- Implement proper preload scripts for secure IPC
- Use contextBridge for exposed APIs
- Follow security best practices

**Testability:**
- Main process: Unit tests for business logic
- Renderer process: Standard web testing
- E2E: Tests with Playwright, Spectron, or custom

## Electron Architecture Layers

### Main Process Layer

**Responsibilities:**
- Application lifecycle management
- Window management
- Native system operations (file, system tray, notifications)
- Backend services and data persistence
- IPC handlers

**Structure:**
```
src/
  main/
    app/
      lifecycle.ts
      windows.ts
    ipc/
      handlers/
        fileHandlers.ts
        systemHandlers.ts
    services/
      fileService.ts
      configService.ts
    utils/
      error.ts
      logger.ts
    index.ts
```

### Preload Scripts

**Responsibilities:**
- Secure bridge between main and renderer
- Expose specific APIs via contextBridge
- Validate and sanitize all IPC communications

**Structure:**
```
src/
  preload/
    index.ts
    api/
      fileApi.ts
      systemApi.ts
```

### Renderer Process Layer

**Responsibilities:**
- UI rendering and user interaction
- State management
- Business logic that doesn't require Node.js
- Invoke exposed preload APIs

**Structure:**
```
src/
  renderer/
    components/
      common/
        Button.tsx
        Modal.tsx
      features/
        FileExplorer.tsx
        SettingsPanel.tsx
    pages/
      Home.tsx
      Settings.tsx
    stores/
      fileStore.ts
      settingsStore.ts
    types/
      preload.d.ts
```

## IPC Communication Patterns

### Main Process Handlers

**IPC handler setup:**
```typescript
import { ipcMain } from 'electron';

export const registerFileHandlers = () => {
  ipcMain.handle('file:read', async (event, path: string) => {
    try {
      const content = await fileService.readFile(path);
      return { success: true, data: content };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('file:write', async (event, path: string, content: string) => {
    try {
      await fileService.writeFile(path, content);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('file:list', async (event, path: string) => {
    try {
      const files = await fileService.listFiles(path);
      return { success: true, data: files };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
};
```

**Service layer:**
```typescript
import { promises as fs } from 'fs';
import path from 'path';

export const fileService = {
  async readFile(filePath: string): Promise<string> {
    const absolutePath = path.resolve(filePath);
    return await fs.readFile(absolutePath, 'utf-8');
  },

  async writeFile(filePath: string, content: string): Promise<void> {
    const absolutePath = path.resolve(filePath);
    const directory = path.dirname(absolutePath);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(absolutePath, content, 'utf-8');
  },

  async listFiles(dirPath: string): Promise<FileItem[]> {
    const absolutePath = path.resolve(dirPath);
    const entries = await fs.readdir(absolutePath, { withFileTypes: true });

    const files: FileItem[] = [];
    for (const entry of entries) {
      const fullPath = path.join(absolutePath, entry.name);
      const stats = await fs.stat(fullPath);
      files.push({
        name: entry.name,
        path: fullPath,
        isDirectory: entry.isDirectory(),
        size: stats.size,
      });
    }

    return files;
  },
};
```

### Preload Script

**Secure API exposure:**
```typescript
import { contextBridge, ipcRenderer } from 'electron';

// Define the exposed API schema
const electronAPI = {
  file: {
    read: (path: string) => ipcRenderer.invoke('file:read', path),
    write: (path: string, content: string) =>
      ipcRenderer.invoke('file:write', path, content),
    list: (path: string) => ipcRenderer.invoke('file:list', path),
  },

  system: {
    getPlatform: () => ipcRenderer.invoke('system:getPlatform'),
    getVersion: () => ipcRenderer.invoke('system:getVersion'),
  },

  dialog: {
    openFile: (options: any) => ipcRenderer.invoke('dialog:openFile', options),
    saveFile: (options: any) => ipcRenderer.invoke('dialog:saveFile', options),
  },

  events: {
    onFileChanged: (callback: (file: string) => void) => {
      ipcRenderer.on('file:changed', (_, file) => callback(file));
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel);
    },
  },
};

// Expose protected methods that allow the renderer to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
```

### Type Definitions

**Preload types:**
```typescript
// src/renderer/types/preload.d.ts
interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
}

interface ElectronAPI {
  file: {
    read: (path: string) => Promise<{ success: boolean; data?: string; error?: string }>;
    write: (path: string, content: string) => Promise<{ success: boolean; error?: string }>;
    list: (path: string) => Promise<{ success: boolean; data?: FileItem[]; error?: string }>;
  };
  system: {
    getPlatform: () => Promise<string>;
    getVersion: () => Promise<string>;
  };
  dialog: {
    openFile: (options: any) => Promise<any>;
    saveFile: (options: any) => Promise<any>;
  };
  events: {
    onFileChanged: (callback: (file: string) => void) => void;
    removeAllListeners: (channel: string) => void;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
```

## Renderer Process Patterns

### Using Exposed API

**Component with Electron API:**
```tsx
import { useState, useEffect } from 'react';
import { FileItem } from '../types/preload';

export const FileExplorer: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDirectory = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electronAPI.file.list(path);
      if (result.success && result.data) {
        setFiles(result.data);
      } else {
        setError(result.error || 'Failed to load directory');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX
  );
};
```

### State Management

**Zustand store with Electron API:**
```typescript
import create from 'zustand';
import { FileItem } from '../types/preload';

interface FileStore {
  files: FileItem[];
  currentPath: string;
  loading: boolean;
  error: string | null;
  loadDirectory: (path: string) => Promise<void>;
  readFile: (path: string) => Promise<void>;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  currentPath: '',
  loading: false,
  error: null,

  loadDirectory: async (path: string) => {
    set({ loading: true, error: null });
    try {
      const result = await window.electronAPI.file.list(path);
      if (result.success && result.data) {
        set({ files: result.data, currentPath: path, loading: false });
      } else {
        set({ error: result.error || 'Failed to load', loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  readFile: async (path: string) => {
    set({ loading: true, error: null });
    try {
      const result = await window.electronAPI.file.read(path);
      if (result.success && result.data) {
        set({ loading: false });
      } else {
        set({ error: result.error || 'Failed to read file', loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## Window Management

**Window creation and management:**
```typescript
import { BrowserWindow, app } from 'electron';

export class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map();

  createMainWindow() {
    const mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        sandbox: true,
        contextIsolation: true,
        nodeIntegration: false,
      },
      show: false, // Don't show until ready
    });

    mainWindow.loadFile('dist/index.html');

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });

    this.windows.set('main', mainWindow);
    return mainWindow;
  }

  getWindow(name: string): BrowserWindow | undefined {
    return this.windows.get(name);
  }

  closeAllWindows() {
    this.windows.forEach((window) => {
      if (!window.isDestroyed()) {
        window.close();
      }
    });
    this.windows.clear();
  }
}
```

## Application Lifecycle

**Main entry point:**
```typescript
import { app, BrowserWindow } from 'electron';
import { registerFileHandlers } from './ipc/handlers/fileHandlers';
import { registerSystemHandlers } from './ipc/handlers/systemHandlers';
import { WindowManager } from './app/windows';

const windowManager = new WindowManager();

app.whenReady().then(() => {
  // Register IPC handlers
  registerFileHandlers();
  registerSystemHandlers();

  // Create main window
  windowManager.createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  windowManager.closeAllWindows();
});
```

## System Integration

### System Tray

**Setup tray icon:**
```typescript
import { Tray, Menu, nativeImage } from 'electron';
import path from 'path';

export const createTray = (window: BrowserWindow): Tray => {
  const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  icon.resize({ width: 16, height: 16 });

  const tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => window.show() },
    { label: 'Quit', click: () => { app.quit(); } },
  ]);

  tray.setToolTip('My Electron App');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      window.show();
    }
  });

  return tray;
};
```

### Native Dialogs

**Dialog handlers:**
```typescript
import { dialog, BrowserWindow } from 'electron';

export const registerDialogHandlers = () => {
  ipcMain.handle('dialog:openFile', async (event, options) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) throw new Error('Window not found');

    const result = await dialog.showOpenDialog(window, {
      properties: ['openFile'],
      filters: options.filters || [],
    });

    if (result.canceled) {
      return { canceled: true };
    }

    return { canceled: false, filePaths: result.filePaths };
  });

  ipcMain.handle('dialog:saveFile', async (event, options) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) throw new Error('Window not found');

    const result = await dialog.showSaveDialog(window, {
      defaultPath: options.defaultPath,
      filters: options.filters || [],
    });

    if (result.canceled) {
      return { canceled: true };
    }

    return { canceled: false, filePath: result.filePath };
  });
};
```

### Notifications

**Notification handler:**
```typescript
import { Notification } from 'electron';

export const registerNotificationHandlers = () => {
  ipcMain.handle('notification:show', async (event, options) => {
    const notification = new Notification({
      title: options.title,
      body: options.body,
      icon: options.icon,
    });

    notification.show();

    return { success: true };
  });
};
```

## Security Best Practices

**Electron security configuration:**
```typescript
const mainWindow = new BrowserWindow({
  webPreferences: {
    // Enable sandbox
    sandbox: true,

    // Enable context isolation
    contextIsolation: true,

    // Disable node integration
    nodeIntegration: false,

    // Use preload script
    preload: path.join(__dirname, '../preload/index.js'),

    // Content Security Policy
    additionalArguments: [
      '--disable-web-security', // Only for development
    ],
  },
});
```

**CSP in renderer HTML:**
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';">
```

## Testing Scenarios

### Frontend Testing Scenarios (User-Centric)

**Happy Path:**
- User opens app → Main window displays correctly
- User selects file → File content loads and displays
- User saves file → File writes successfully
- User uses tray → Window shows/hides correctly
- User changes settings → Settings persist and apply

**Edge Cases:**
- Empty file → Empty state displays correctly
- Large file → Handles without blocking UI
- Special characters in path → Path handles correctly
- Rapid file operations → No race conditions
- Permission denied → Error message displays

**Failure States:**
- File not found → User-friendly error message
- Permission denied → Error with suggestion
- Invalid file type → Error message
- IPC timeout → Timeout error with retry

### Backend Testing Cases (Logic-Driven)

**IPC Handler Tests:**
- Valid input → Returns correct result
- Invalid input → Returns appropriate error
- Edge cases → Handles boundary conditions
- Concurrent calls → Thread-safe execution
- Sanitization → Input validation works

**Service Tests:**
- File operations → Read/write works correctly
- Path handling → Handles various path formats
- Error conditions → Proper error propagation
- Caching → Cache strategy works

## Context7 Integration

For Electron-specific documentation:
- Use Context7 for Electron API reference
- Query Context7 for latest Electron patterns
- Reference Context7 for Node.js best practices
- Check Context7 for web frontend framework patterns
- Query Context7 for desktop application patterns

## Best Practices

**DO:**
- Enable context isolation and sandbox
- Use preload scripts for secure IPC
- Implement proper CSP headers
- Minimize IPC calls (batch when possible)
- Use TypeScript for type safety
- Handle all error cases
- Test on all target platforms

**DON'T:**
- Disable security features for convenience
- Expose entire Node.js API to renderer
- Ignore platform differences (Windows/macOS/Linux)
- Skip error handling in IPC handlers
- Use remote module (deprecated)
- Block main thread with heavy operations
