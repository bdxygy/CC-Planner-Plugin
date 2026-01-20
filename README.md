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
    ├── validation-report.mdx (generated by /validate-plan)
    ├── frontend-tasks.mdx (generated by /task-fe)
    ├── frontend-tasks.yaml (generated by /task-fe)
    ├── backend-tasks.mdx (generated by /task-be)
    └── backend-tasks.yaml (generated by /task-be)
```

## Usage

### Quick Start Workflow

For new projects, follow this complete workflow:

```
1. /rules-plan (optional)    → Define project rules and constraints
2. /planning [plan-name]      → Create comprehensive project plan
3. /validate-plan [plan-name] → Validate plan quality
4. /task-fe [plan-name]       → Generate frontend task lists
5. /task-be [plan-name]       → Generate backend task lists
6. /execute-fe [plan-name]    → Implement frontend with TDD
7. /execute-be [plan-name]    → Implement backend with TDD
8. /validate-ui               → Validate UI implementation quality
```

### Complete Workflow Guide

#### Phase 1: Setup & Planning

**1. Define Project Rules (Optional)**
```bash
/rules-plan
```
- Establish coding standards, architecture patterns, technology constraints
- Define security, performance, and testing requirements
- Rules stored in `.pland/rules.mdx` (applies globally)
- *Skip this step if you don't need custom rules*

**2. Create Project Plan**
```bash
/planning [plan-name]
```
- Platform auto-detection (Android, iOS, Flutter, React Native, Tauri, Electron, Web)
- Interactive questions about your project
- Generates 6 plan files: project-context, features, architectures, testing scenarios
- Output: `.pland/[plan-name]/` directory with all `.mdx` files

**3. Validate Plan**
```bash
/validate-plan [plan-name]
```
- Checks structure, consistency, testing completeness, technical feasibility
- Saves report to `.pland/[plan-name]/validation-report.mdx`
- Catch issues before implementation
- *Required before execution - both execute commands check for this*

#### Phase 2: Task Generation

**4. Generate Frontend Tasks**
```bash
/task-fe [plan-name]
```
- Creates organized task lists from frontend plan
- Auto-detects dependencies and calculates priority
- Outputs: `frontend-tasks.mdx` (human-readable) + `frontend-tasks.yaml` (machine-readable)

**5. Generate Backend Tasks**
```bash
/task-be [plan-name]
```
- Creates organized task lists from backend plan
- Auto-detects dependencies and calculates priority
- Outputs: `backend-tasks.mdx` (human-readable) + `backend-tasks.yaml` (machine-readable)

#### Phase 3: Implementation

**6. Implement Frontend (TDD)**
```bash
/execute-fe [plan-name]
```
- Loads task list or plan directly
- Checks for validation report (recommends `/validate-plan` if missing)
- Follows Red-Green-Refactor TDD cycle
- Platform-specific test frameworks (Espresso, XCTest, flutter_test, Jest, etc.)
- Tests written FIRST, then implementation

**7. Implement Backend (TDD)**
```bash
/execute-be [plan-name]
```
- Loads task list or plan directly
- Checks for validation report (recommends `/validate-plan` if missing)
- Follows Red-Green-Refactor TDD cycle
- Isolated unit tests (no HTTP, no database)
- Platform-specific test frameworks (Vitest, pytest, JUnit, etc.)
- Tests written FIRST, then implementation

#### Phase 4: Quality Assurance

**8. Validate UI**
```bash
/validate-ui
```
- Validates implemented UI against modern design standards
- Four principles: Modern, Aesthetic, Borderless, Responsive
- Code analysis with detailed violation reports
- Run after frontend implementation is complete

### Revision Workflow

When plans need to be updated:

**1. Revise the Plan**
```bash
/revise-planning [plan-name] [section]
```
- Edit specific sections with intelligent cross-file propagation
- Frontend changes affect: features, architecture, testing scenarios
- Backend changes affect: features, architecture, testing cases
- Rules (if exist) are validated during revisions

**2. Regenerate Task Lists**
```bash
/revise-task-fe [plan-name]
/revise-task-be [plan-name]
```
- Removes old task files and regenerates from revised plan
- Auto-recalculates all dependencies and priorities
- *Required after plan revisions to keep tasks in sync*

**3. Re-validate (Optional)**
```bash
/validate-plan [plan-name]
```
- Check updated plan quality
- Ensure revisions didn't introduce issues

### Plan Management

**List All Plans**
```bash
/list-plans
```
- Shows all available plans with status
- Displays plan completeness and tech stack
- Identifies incomplete plans

**Delete a Plan**
```bash
/delete-plan [plan-name]
```
- Safely deletes plan directory with confirmation
- Shows what will be deleted before removal

### Command Reference Summary

| Command | Purpose | Output |
|---------|---------|--------|
| `/rules-plan` | Define project rules | `.pland/rules.mdx` |
| `/planning` | Create project plan | `.pland/[plan-name]/*.mdx` |
| `/validate-plan` | Validate plan quality | `.pland/[plan-name]/validation-report.mdx` |
| `/revise-planning` | Edit plan sections | Updates plan files |
| `/task-fe` | Generate frontend tasks | `frontend-tasks.mdx` + `.yaml` |
| `/task-be` | Generate backend tasks | `backend-tasks.mdx` + `.yaml` |
| `/revise-task-fe` | Regenerate frontend tasks | `frontend-tasks.mdx` + `.yaml` |
| `/revise-task-be` | Regenerate backend tasks | `backend-tasks.mdx` + `.yaml` |
| `/execute-fe` | Implement frontend (TDD) | Code + Tests |
| `/execute-be` | Implement backend (TDD) | Code + Tests |
| `/validate-ui` | Validate UI quality | Violation reports |
| `/list-plans` | List all plans | Summary display |
| `/delete-plan` | Delete a plan | Directory removed |

### File Structure

```
.pland/
├── rules.mdx (global project rules)
└── [plan-name]/
    ├── project-context.mdx
    ├── features.mdx
    ├── frontend-architecture.mdx
    ├── backend-architecture.mdx
    ├── frontend-testing-scenarios.mdx
    ├── backend-testing-cases.mdx
    ├── validation-report.mdx (from /validate-plan)
    ├── frontend-tasks.mdx (from /task-fe)
    ├── frontend-tasks.yaml (from /task-fe)
    ├── backend-tasks.mdx (from /task-be)
    └── backend-tasks.yaml (from /task-be)
```

### Best Practices

1. **Always validate before executing** - Both `/execute-fe` and `/execute-be` check for `validation-report.mdx`
2. **Regenerate tasks after revisions** - Use `/revise-task-fe` and `/revise-task-be` after `/revise-planning`
3. **Define rules early** - Run `/rules-plan` before `/planning` for consistent architecture
4. **Follow TDD strictly** - Tests FIRST, then implementation
5. **Validate UI when done** - Run `/validate-ui` after frontend implementation is complete
6. **Use /list-plans** - Check what plans exist before creating new ones
7. **Clean up with /delete-plan** - Remove plans that are no longer needed

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
- Exa MCP server for code examples, web search, and deep research

## License

MIT
