# architect-planner

Generate comprehensive, implementation-ready end-to-end application plans for software projects across all major platforms.

## Overview

`architect-planner` helps you create detailed project plans covering features, frontend/backend architecture, and testing strategies. Plans are output as structured `.mdx` files organized under `.pland/[plan-name]/`.

**Multi-Platform Support:**
- **Mobile**: Android (Kotlin/Java), iOS (Swift/SwiftUI/UIKit), Flutter, React Native
- **Desktop**: Tauri (Rust + Web), Electron (Node.js + Web)
- **Web**: React, Vue, Svelte, and modern web frameworks

The plugin automatically detects your platform and loads the appropriate architecture patterns.

## Commands

### `/planning`
Create a new project plan interactively with **automatic platform detection**. Generates:
- Project context (new vs. existing analysis with platform detection)
- Feature breakdown (existing + new features)
- Platform-specific frontend architecture
- Platform-specific backend architecture (if applicable)
- Testing scenarios (platform-appropriate testing frameworks)

**Platform Auto-Detection:**
- Scans for platform-specific files (build.gradle, pubspec.yaml, package.json, etc.)
- Automatically loads the appropriate platform-specific skill
- Provides platform-specific architecture recommendations

### `/execute-fe`
Implement **frontend** features from a plan using **Test-Driven Development**.

**TDD Workflow:**
- **RED**: Write failing frontend test first
- **GREEN**: Implement minimal UI to pass the test
- **REFACTOR**: Improve component while tests stay green

**Features:**
- Platform-specific test frameworks (Espresso, XCTest, flutter_test, Jest, etc.)
- Tests generated FIRST, then implementation
- Interactive test verification at each phase
- Split TODO tracking for frontend work

### `/execute-be`
Implement **backend** features from a plan using **Test-Driven Development**.

**TDD Workflow:**
- **RED**: Write failing unit test (isolated, no HTTP/database)
- **GREEN**: Implement minimal business logic to pass the test
- **REFACTOR**: Improve code while tests stay green

**Features:**
- Isolated unit tests (mock all external dependencies)
- Platform-specific test frameworks (Vitest, pytest, JUnit, etc.)
- Tests generated FIRST, then implementation
- Interactive test verification at each phase
- Split TODO tracking for backend work

### `/revise-planning`
Edit specific sections of existing plans. Supports section-level modifications.

### `/rules-plan`
Define project-specific rules that guide `/planning` and `/revise-planning` decisions.

**Features:**
- Architecture rules and patterns
- Technology constraints (required/forbidden)
- Coding standards and conventions
- Security and performance requirements
- Testing and documentation standards
- Stored in `.pland/rules.mdx`

### `/list-plans`
List all available project plans in the `.pland` directory.

**Features:**
- Shows plan names and overview
- Displays plan completeness (required files)
- Shows tech stack and last modified date
- Identifies incomplete plans

### `/delete-plan`
Delete a project plan directory with confirmation.

**Features:**
- Shows what will be deleted before removal
- Confirmation prompt prevents accidents
- Removes entire plan directory
- Verification after deletion

### `/validate-plan`
Validate a plan's quality. Checks:
- Structure validation
- Cross-section consistency
- Testing completeness
- Technical feasibility

### `/validate-ui`
Validate **implemented UI** against modern design standards:

**Four Principles:**
1. **Modern** - Modern design patterns and current framework syntax
2. **Aesthetic** - Design consistency, visual hierarchy, layout quality, polish
3. **Borderless** - No visible borders, uses shadows/spacing instead
4. **Responsive** - Mobile-first, adaptive breakpoints, touch-friendly

**Features:**
- Code analysis (not visual inspection)
- Detailed violation reports with file locations
- Platform-specific validation rules
- Interactive fixing with user confirmation
- Fix suggestions and code examples

### `/task-fe`
Create organized **frontend** task lists from existing plans.

**Features:**
- Extracts tasks from `.pland/[plan-name]/` plans
- Full context: file locations, components, tests, dependencies
- Organized by priority (High/Medium/Low)
- Seamless integration with `/execute-fe`
- Outputs both `.mdx` (human) and `.yaml` (token-efficient) formats

### `/task-be`
Create organized **backend** task lists from existing plans.

**Features:**
- Extracts tasks from `.pland/[plan-name]/` plans
- Full context: file locations, services, tests, dependencies
- Organized by priority (High/Medium/Low)
- Seamless integration with `/execute-be`
- Outputs both `.mdx` (human) and `.yaml` (token-efficient) formats

### `/revise-task-fe`
Regenerate **frontend** task lists after revising a plan with `/revise-plan`.

**Features:**
- Removes existing task files and regenerates from revised plan
- Auto-recalculates all task IDs, priorities, and dependencies
- Use when plan has changed and tasks need to be updated
- Outputs both `.mdx` (human) and `.yaml` (token-efficient) formats

### `/revise-task-be`
Regenerate **backend** task lists after revising a plan with `/revise-plan`.

**Features:**
- Removes existing task files and regenerates from revised plan
- Auto-recalculates all task IDs, priorities, and dependencies
- Use when plan has changed and tasks need to be updated
- Outputs both `.mdx` (human) and `.yaml` (token-efficient) formats

## Skills

### Core Planning Skills

**`planning-methodology`**
Best practices for project planning, including discovery techniques, feature breakdown methods, and documentation structure.

**`architecture-patterns`**
Web application patterns: component boundaries, state management, system layering, and testability.

### Platform-Specific Skills

**`android-patterns`**
Android development patterns covering:
- Jetpack Compose (modern) and XML layouts (classic)
- MVVM architecture with ViewModels, LiveData/StateFlow
- Hilt dependency injection
- Room database and Retrofit networking
- Testing with JUnit, Espresso, and Compose UI tests

**`ios-swift-patterns`**
iOS development patterns covering:
- SwiftUI (modern) and UIKit (traditional)
- MVVM with Combine and async/await
- Core Data and SwiftData
- URLSession networking
- Testing with XCTest and XCUITest

**`flutter-patterns`**
Flutter cross-platform patterns covering:
- Widgets and composables
- BLoC, Riverpod, and Provider state management
- Repository pattern and dependency injection
- Navigation and routing
- Testing with flutter_test and integration tests

**`react-native-patterns`**
React Native patterns covering:
- Functional components with hooks
- Navigation, Redux, Zustand
- API integration and state management
- Platform-specific code handling
- Testing with Jest, React Native Testing Library, and Detox

**`tauri-patterns`**
Tauri desktop application patterns covering:
- Rust backend with Tauri commands
- Web frontend integration
- IPC communication (invoke API)
- Security best practices (sandbox, preload scripts)
- Testing Rust and web components

**`electron-patterns`**
Electron desktop application patterns covering:
- Main process vs. Renderer process architecture
- IPC communication with contextBridge
- Preload scripts and security
- System integration (tray, notifications, dialogs)
- Testing with Spectron and Playwright

All skills use Context7 for technology-specific documentation.

## Agent

### `codebase-scanner`
Autonomously scans existing codebases with **multi-platform detection**:

**Features:**
- Detects platform from project structure (Android, iOS, Flutter, React Native, Tauri, Electron, Web)
- Identifies UI frameworks (Jetpack Compose, SwiftUI, React, etc.)
- Analyzes state management patterns (LiveData, Combine, BLoC, Redux, etc.)
- Provides platform-specific architecture recommendations
- Suggests appropriate platform-specific skill to load

**Trigger**: Hybrid (can be explicitly invoked or proactively suggested)
**Tools**: Read, Glob, Grep, Bash

## Output Structure

Plans are organized as:
```
.pland/
├── rules.mdx (created by /rules-plan - applies to all plans)
└── [plan-name]/
    ├── project-context.mdx
    ├── features.mdx
    ├── frontend-architecture.mdx
    ├── backend-architecture.mdx
    ├── frontend-testing-scenarios.mdx
    ├── backend-testing-cases.mdx
    ├── frontend-tasks.mdx (generated by /task-fe)
    ├── frontend-tasks.yaml (generated by /task-fe)
    ├── backend-tasks.mdx (generated by /task-be)
    └── backend-tasks.yaml (generated by /task-be)
```

## Usage

1. (Optional) Run `/rules-plan` to define project-specific rules
2. Run `/planning` to start a new plan
3. The plugin auto-detects your platform from existing files
4. Answer interactive questions about your project
5. The appropriate platform-specific skill is automatically loaded
6. Rules are loaded and applied (if `.pland/rules.mdx` exists)
7. Review generated `.mdx` files in `.pland/`
8. Run `/validate-plan` to check quality
9. Use `/revise-planning` to make changes (rules are checked during revisions)
10. Run `/task-fe` to create frontend task lists
11. Run `/task-be` to create backend task lists
12. Run `/execute-fe` to implement frontend using TDD
13. Run `/execute-be` to implement backend using TDD
14. Run `/validate-ui` to validate UI implementation quality

**After plan revisions:**
- After running `/revise-planning`, use `/revise-task-fe` and `/revise-task-be` to regenerate task lists

## Platform Detection

The plugin automatically detects platforms by scanning for:

| Platform | Detection Files |
|----------|-----------------|
| Android | `build.gradle`, `AndroidManifest.xml`, `app/` |
| iOS | `*.swift`, `*.xcodeproj`, `Info.plist`, `Podfile` |
| Flutter | `pubspec.yaml`, `lib/main.dart` |
| React Native | `package.json` (react-native), `android/`, `ios/` |
| Tauri | `src-tauri/`, `tauri.conf.json`, `Cargo.toml` |
| Electron | `package.json` (electron), `main.js` |
| Web | `package.json`, `src/`, `index.html` |

## TDD Approach

Both `/execute-fe` and `/execute-be` follow strict Test-Driven Development:

### Red-Green-Refactor Cycle

1. **RED** - Write a failing test first
2. **GREEN** - Write minimal implementation to pass
3. **REFACTOR** - Improve code while keeping tests green

### Key Principles

- Tests written FIRST, before implementation
- Interactive verification at each phase
- Platform-specific testing frameworks
- Isolated unit tests (backend)
- User-centric scenarios (frontend)

### Split TODO Tracking

Frontend and backend have separate TODO lists:
- `/execute-fe` manages frontend implementation progress
- `/execute-be` manages backend implementation progress
- Independent execution - no dependencies between commands

## Requirements

- Claude Code with plugin support
- Context7 MCP server for technology documentation

## License

MIT
