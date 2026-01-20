# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is `architect-planner`, a Claude Code plugin for generating comprehensive, implementation-ready project plans for multi-platform software development (Android, iOS, Flutter, React Native, Tauri, Electron, Web). The plugin follows Test-Driven Development (TDD) methodology and supports automatic platform detection.

**Plugin version:** 0.0.5

## Architecture

### Plugin Structure

```
plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest (version, author, metadata)
├── commands/                 # 14 slash commands
├── skills/                   # 8 skills for platform/architecture patterns
└── agents/                   # Autonomous agents
```

### Commands (Frontmatter Pattern)

All command files use YAML frontmatter with these required fields:
- `description`: What the command does
- `argument-hint`: Command arguments (e.g., `[plan-name]`)
- `allowed-tools`: List of tools the command can use

**Key Commands:**
- `/planning` - Create project plans with auto platform detection
- `/execute-fe` - Frontend TDD implementation (tests FIRST, then code)
- `/execute-be` - Backend TDD implementation (isolated unit tests)
- `/task-fe` / `/task-be` - Generate task lists from plans (YAML + MDX output)
- `/validate-plan` - Quality checks before execution
- `/revise-planning` - Edit plan sections with cross-file propagation
- `/rules-plan` - Define project-specific rules stored in `.pland/rules.mdx`

### Skills (Progressive Disclosure)

Skills are organized by platform and provide architecture patterns. Each skill is loaded dynamically based on detected platform:
- `android-patterns` - Jetpack Compose/XML, MVVM, Hilt, Room
- `ios-swift-patterns` - SwiftUI/UIKit, Combine, Core Data
- `flutter-patterns` - BLoC/Riverpod/Provider, Repository pattern
- `react-native-patterns` - Hooks, Navigation, Redux/Zustand
- `tauri-patterns` - Rust commands, IPC, web integration
- `electron-patterns` - Main/renderer processes, IPC, security
- `architecture-patterns` - Web application patterns (React, Vue, etc.)
- `planning-methodology` - Project planning best practices

### Agent

- `codebase-scanner` - Analyzes existing codebases for platform detection, architecture patterns, and feature discovery. Uses Glob/Grep/Read to detect platforms by scanning for platform-specific files (build.gradle, pubspec.yaml, etc.)

## Plan Storage (`.pland` Directory)

Plans are stored as `.mdx` files under `.pland/[plan-name]/`:

```
.pland/
├── rules.mdx                      # Global project rules (from /rules-plan)
└── [plan-name]/
    ├── project-context.mdx         # Overview, tech stack, constraints
    ├── features.mdx                # Feature list with responsibilities
    ├── frontend-architecture.mdx   # Components, state, APIs
    ├── backend-architecture.mdx    # Modules, endpoints, contracts
    ├── frontend-testing-scenarios.mdx  # User-centric test scenarios
    ├── backend-testing-cases.mdx   # Business logic test cases
    ├── validation-report.mdx       # Quality check results (from /validate-plan)
    ├── frontend-tasks.mdx          # Human-readable task list
    ├── frontend-tasks.yaml         # Machine-readable with dependencies
    ├── backend-tasks.mdx           # Human-readable task list
    └── backend-tasks.yaml          # Machine-readable with dependencies
```

### Task List Format (YAML)

Task lists from `/task-fe` and `/task-be` include dependency tracking:
- `id`: Task identifier (fe-XXX or be-XXX)
- `priority`: High/Medium/Low
- `blockedBy`: Array of task IDs this task depends on
- `blockedByTransitive`: All transitive dependencies
- `dependencyChain`: Direct dependency chain
- `blocks`: Tasks that depend on this one
- `dependencySummary.foundation`: Tasks with no dependencies (start here)
- `dependencySummary.blocked`: Tasks with dependencies

## Cross-File Propagation

The `/revise-planning` command intelligently propagates changes:

**Frontend revisions affect:**
- `features.mdx` (feature responsibilities)
- `frontend-architecture.mdx` (components, state, APIs)
- `frontend-testing-scenarios.mdx` (test scenarios)
- `project-context.mdx` (tech stack/dependencies, if exists)

**Backend revisions affect:**
- `features.mdx` (feature responsibilities)
- `backend-architecture.mdx` (modules, endpoints, contracts)
- `backend-testing-cases.mdx` (test cases)
- `project-context.mdx` (tech stack/dependencies, if exists)

## MCP Tools Usage

**Context7** (for official API documentation):
- `mcp__plugin_context7_context7__resolve-library-id` - Get library ID from package name
- `mcp__plugin_context7_context7__query-docs` - Query documentation

**Exa** (for code examples and web research):
- `mcp__exa__get_code_context_exa` - Real-world code examples
- `mcp__exa__web_search_exa` - Latest tutorials and patterns
- `mcp__exa__deep_researcher_start` - Complex research questions

## Workflow Integration

**Execute commands** (`/execute-fe`, `/execute-be`) check for `validation-report.mdx` before starting implementation. If missing, they recommend running `/validate-plan` first.

**After plan revisions**, use `/revise-task-fe` and `/revise-task-be` to regenerate task lists from the updated plan. These commands delete old task files and create new ones with recalculated dependencies.

## File Format Conventions

- **Plan files**: `.mdx` (Markdown with JSX/YAML frontmatter)
- **Task lists**: Both `.mdx` (human-readable) and `.yaml` (machine-readable, token-efficient)
- **Validation reports**: `.mdx`

## Platform Detection

Commands use Glob patterns to detect platforms:
- **Android**: `build.gradle`, `AndroidManifest.xml`, `app/`
- **iOS**: `*.swift`, `*.xcodeproj`, `Info.plist`, `Podfile`
- **Flutter**: `pubspec.yaml`, `lib/main.dart`
- **React Native**: `package.json` with "react-native", `android/`, `ios/`
- **Tauri**: `src-tauri/`, `tauri.conf.json`, `Cargo.toml`
- **Electron**: `package.json` with "electron", `main.js`
- **Web**: `package.json`, `src/`, `index.html`

## Version Bumping

When making changes, update version in both files:
- `plugin/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

Commit with descriptive message listing key changes.
