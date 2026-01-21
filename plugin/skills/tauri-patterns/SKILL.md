---
name: Tauri Patterns
description: This skill should be used when the user asks to "plan a Tauri app", "design Tauri architecture", "create Tauri commands", mentions Tauri development, or refers to Rust backend, web frontend, or desktop app development. Provides comprehensive Tauri architecture patterns for building cross-platform desktop applications.
version: 0.1.0
---

# Tauri Patterns

Tauri enables building cross-platform desktop applications using web technologies for the frontend and Rust for the backend. This skill provides architecture patterns for building secure, performant, and maintainable Tauri applications.

## Core Tauri Principles

**Architecture:**

- **Frontend**: Web framework (React, Vue, Svelte, Solid) running in webview
- **Backend**: Rust for native operations and system access
- **IPC (Inter-Process Communication)**: Tauri invoke API for frontend-backend communication
- **Security**: Sandboxed webview with controlled IPC

**Architecture Guidelines:**

- Minimize IPC calls (batch when possible)
- Keep Rust backend focused on native operations
- Implement proper error handling across IPC boundary
- Use TypeScript for frontend type safety
- Follow Rust best practices (ownership, borrowing, error handling)

**Testability:**

- Frontend: Standard web testing (vitest, jest, testing-library)
- Rust: Unit tests for business logic, integration tests for commands
- E2E: Tests that invoke commands from frontend

## Tauri Architecture Layers

### Frontend Layer (Web)

**Responsibilities:**

- UI rendering and user interaction
- State management (Redux, Zustand, Solid stores)
- API invocation to Rust backend
- Business logic that doesn't require native access

**Structure:**

```
src/
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
  api/
    tauri.ts
    commands.ts
  types/
    index.ts
```

### Backend Layer (Rust)

**Responsibilities:**

- Native system operations (file, network, system)
- Business logic requiring native performance
- Data persistence
- System integration (tray, notifications, shortcuts)

**Structure:**

```
src-tauri/
  src/
    commands/
      file_commands.rs
      system_commands.rs
    services/
      file_service.rs
      config_service.rs
    models/
      file_item.rs
      app_config.rs
    utils/
      error.rs
      helpers.rs
    main.rs
  Cargo.toml
  tauri.conf.json
```

## IPC Communication Patterns

### Tauri Commands (Rust)

**Command definition:**

```rust
use tauri::State;

#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn write_file(path: String, content: String) -> Result<(), String> {
    std::fs::write(&path, content)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_system_info() -> Result<SystemInfo, String> {
    Ok(SystemInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
    })
}
```

**Register commands in main:**

```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_file,
            write_file,
            get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Command with State Management

**Shared state:**

```rust
use std::sync::Mutex;
use tauri::State;

struct AppState {
    file_cache: Mutex<Vec<FileItem>>,
    settings: Mutex<AppSettings>,
}

#[tauri::command]
async fn cache_files(
    files: Vec<FileItem>,
    state: State<'_, AppState>
) -> Result<(), String> {
    let mut cache = state.file_cache.lock()
        .map_err(|e| e.to_string())?;
    *cache = files;
    Ok(())
}

#[tauri::command]
async fn get_cached_files(
    state: State<'_, AppState>
) -> Result<Vec<FileItem>, String> {
    let cache = state.file_cache.lock()
        .map_err(|e| e.to_string())?;
    Ok(cache.clone())
}
```

### Frontend Invocation (TypeScript)

**Tauri API wrapper:**

```typescript
import { invoke } from '@tauri-apps/api/tauri';

export const fileApi = {
  readFile: (path: string): Promise<string> => {
    return invoke('read_file', { path });
  },

  writeFile: (path: string, content: string): Promise<void> => {
    return invoke('write_file', { path, content });
  },

  getSystemInfo: (): Promise<SystemInfo> => {
    return invoke('get_system_info');
  },
};
```

**Using in component (React example):**

```tsx
import { useState, useEffect } from 'react';
import { fileApi } from '../api/commands';

export const FileExplorer: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fileApi.readFile(path);
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX
  );
};
```

## Frontend State Management

### Zustand (Recommended)

**Store with Tauri integration:**

```typescript
import create from 'zustand';
import { fileApi } from '../api/commands';

interface FileStore {
  files: FileItem[];
  currentFile: string | null;
  loading: boolean;
  error: string | null;
  loadFiles: (path: string) => Promise<void>;
  loadFile: (path: string) => Promise<void>;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  currentFile: null,
  loading: false,
  error: null,

  loadFiles: async (path: string) => {
    set({ loading: true, error: null });
    try {
      const files = await fileApi.readDirectory(path);
      set({ files, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  loadFile: async (path: string) => {
    set({ loading: true, error: null });
    try {
      const content = await fileApi.readFile(path);
      set({ currentFile: content, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## Rust Backend Patterns

### Service Layer

**File service:**

```rust
use std::path::Path;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileItem {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
}

pub struct FileService {
    base_path: String,
}

impl FileService {
    pub fn new(base_path: String) -> Self {
        Self { base_path }
    }

    pub fn read_directory(&self, path: &str) -> Result<Vec<FileItem>, String> {
        let full_path = Path::new(&self.base_path).join(path);
        let entries = std::fs::read_dir(full_path)
            .map_err(|e| e.to_string())?;

        let mut items = Vec::new();
        for entry in entries {
            let entry = entry.map_err(|e| e.to_string())?;
            let metadata = entry.metadata().map_err(|e| e.to_string())?;

            items.push(FileItem {
                name: entry.file_name().to_string_lossy().to_string(),
                path: entry.path().to_string_lossy().to_string(),
                is_dir: metadata.is_dir(),
                size: metadata.len(),
            });
        }

        Ok(items)
    }

    pub fn read_file(&self, path: &str) -> Result<String, String> {
        let full_path = Path::new(&self.base_path).join(path);
        std::fs::read_to_string(full_path).map_err(|e| e.to_string())
    }
}
```

**Command using service:**

```rust
use tauri::State;

pub struct AppState {
    file_service: std::sync::Arc<FileService>,
}

#[tauri::command]
async fn read_directory(
    path: String,
    state: State<'_, AppState>
) -> Result<Vec<FileItem>, String> {
    state.file_service.read_directory(&path)
}
```

### Error Handling

**Custom error type:**

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("File not found: {0}")]
    NotFound(String),

    #[error("Permission denied: {0}")]
    PermissionDenied(String),
}

// Convert to String for IPC
impl Into<String> for AppError {
    fn into(self) -> String {
        self.to_string()
    }
}
```

**Command with proper error:**

```rust
#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    let content = std::fs::read_to_string(&path)?;
    Ok(content)
}
```

## Tauri Configuration

### tauri.conf.json

**Basic configuration:**

```json
{
  "$schema": "..",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "package": {
    "productName": "MyApp",
    "version": "0.1.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "dialog": {
        "all": false,
        "open": true,
        "save": true
      }
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.example.myapp",
      "icon": ["icons/icon.ico", "icons/icon.png"]
    },
    "security": {
      "csp": "default-src 'self'"
    },
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "MyApp",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

### Allowlist Configuration

**Enable specific APIs:**

```json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "readDir": true,
        "scope": ["$HOME/*", "$HOME/Documents/*"]
      },
      "dialog": {
        "all": false,
        "open": true,
        "save": true
      },
      "notification": {
        "all": true
      },
      "globalShortcut": {
        "all": false,
        "register": true,
        "unregister": true
      }
    }
  }
}
```

## System Integration

### Tray Icon

**Setup tray in main:**

```rust
use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
};

fn create_system_tray() -> SystemTray {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let menu = SystemTrayMenu::new().add_item(quit);
    SystemTray::new().with_menu(menu)
}

fn main() {
    tauri::Builder::default()
        .system_tray(create_system_tray())
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Native Notifications

**Command for notifications:**

```rust
use tauri::api::notification::Notification;

#[tauri::command]
async fn show_notification(
    title: String,
    body: String,
    app: tauri::AppHandle
) -> Result<(), String> {
    Notification::new(&app.config().tauri.bundle.identifier)
        .title(&title)
        .body(&body)
        .show()
        .map_err(|e| e.to_string())
}
```

## Testing Scenarios

### Frontend Testing Scenarios (User-Centric)

**Happy Path:**

- User opens app → Main window displays correctly
- User selects file → File content loads and displays
- User saves file → File writes successfully
- User uses tray icon → Window shows/hides correctly
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
- Network operations timeout → Timeout error with retry

### Backend Testing Cases (Logic-Driven)

**Command Tests:**

- Valid input → Returns correct result
- Invalid input → Returns appropriate error
- Edge cases → Handles boundary conditions
- Concurrent calls → Thread-safe execution
- State changes → State updates correctly

**Service Tests:**

- File operations → Read/write works correctly
- Path handling → Handles various path formats
- Error conditions → Proper error propagation
- Caching → Cache strategy works

## Context7 Integration

For Tauri-specific documentation:

- Use Context7 for Tauri API reference
- Query Context7 for latest Tauri patterns
- Reference Context7 for Rust best practices
- Check Context7 for web frontend framework patterns
- Query Context7 for desktop application patterns

## Best Practices

**DO:**

- Minimize IPC calls (batch when possible)
- Use TypeScript for type-safe command invocation
- Implement proper error handling across boundary
- Follow Rust ownership and borrowing rules
- Use async/await for long-running operations
- Implement proper CSP (Content Security Policy)
- Test on all target platforms

**DON'T:**

- Block on main thread (use async commands)
- Expose entire filesystem (use scoped access)
- Ignore platform differences (handle Windows/macOS/Linux)
- Skip error handling in commands
- Forget to clean up resources
- Use insecure IPC (validate all inputs)
