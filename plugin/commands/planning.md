---
description: Create a comprehensive project plan with features, architecture, and testing scenarios
argument-hint: [feature-topic]
allowed-tools: ["AskUserQuestion", "Read", "Write", "Glob", "Grep", "Bash", "mcp__plugin_context7_context7__resolve-library-id", "mcp__plugin_context7_context7__query-docs", "mcp__exa__get_code_context_exa", "mcp__exa__web_search_exa", "mcp__exa__deep_researcher_start", "mcp__exa__deep_researcher_check"]
---

# /planning

Create a comprehensive, implementation-ready project plan for a software application. Plans include project context, feature breakdown, frontend/backend architecture, and testing scenarios.

## When to Use

Use this command when:
- Starting a new project from scratch
- Adding new features to an existing project
- Restructuring or analyzing an existing project
- Need to establish architecture and testing strategy

## Planning Workflow

Follow this workflow to generate a complete plan:

### 0. Platform Detection (CRITICAL FIRST STEP)

**For existing projects:**
- Run codebase-scanner agent to detect platform automatically
- Detect platform-specific files and directories:
  - Android: `build.gradle`, `AndroidManifest.xml`, `app/`
  - iOS: `*.swift`, `*.xcodeproj`, `Info.plist`
  - Flutter: `pubspec.yaml`, `lib/main.dart`
  - React Native: `package.json` with "react-native", `android/`, `ios/`
  - Tauri: `src-tauri/`, `tauri.conf.json`
  - Electron: `package.json` with "electron", `main.js`

**For new projects:**
- Ask user which platform they're targeting
- Use AskUserQuestion to present platform options

**After platform detection:**
- Load the appropriate platform-specific skill:
  - Android → `android-patterns` skill
  - iOS/Swift → `ios-swift-patterns` skill
  - Flutter → `flutter-patterns` skill
  - React Native → `react-native-patterns` skill
  - Tauri → `tauri-patterns` skill
  - Electron → `electron-patterns` skill
  - Web → `architecture-patterns` skill

### 1. Establish Project Context

Ask the user to provide context:

**Use AskUserQuestion to ask:**
- Is this a new project or existing project?
- What is the main purpose of this application?
- Who are the target users?

**For existing projects:**
- Review codebase-scanner results
- Note detected platform, tech stack, and patterns
- Identify existing modules and integration points

**For new projects:**
- Ask about technology preferences (frameworks, runtime, database)
- Use Context7 for current documentation on chosen technologies
- Establish baseline architecture based on platform patterns

### 2. Feature Breakdown

Work with the user to define all features:

**Ask clarifying questions:**
- What are the core features this application needs?
- For existing projects: what existing features should remain unchanged?
- What new features need to be added?
- Are there feature dependencies or priorities?

**For each feature, document:**
- Purpose and user value
- Frontend responsibilities (UI, state, behavior)
- Backend responsibilities (API, logic, data)
- Impact on existing code (for brownfield)

**Ask specifically about:**
- Authentication/authorization requirements
- Data models and relationships
- External integrations
- Admin/management features

### 3. Frontend Architecture

Define the frontend structure based on detected platform:

**For each platform, use platform-specific patterns:**
- **Android**: Activities, Fragments, Composables, ViewModels, LiveData/StateFlow
- **iOS/Swift**: ViewControllers, SwiftUI Views, ObservableObjects, Combine/async-await
- **Flutter**: Widgets, BLoCs, Providers/Riverpod, StatefulWidget/StatelessWidget
- **React Native**: Components, Hooks, Navigation, Context/Redux/Zustand
- **Tauri**: Web components, invoke API, preload scripts
- **Electron**: Renderer process components, preload APIs, IPC

**Use AskUserQuestion to determine platform-specific choices:**
- **Android**: Jetpack Compose or XML? Kotlin or Java?
- **iOS**: SwiftUI or UIKit? Swift or Objective-C?
- **Flutter**: BLoC, Riverpod, or Provider?
- **React Native**: Navigation v5 or v6? Redux, Zustand, or Context?
- **Tauri/Electron**: Which web framework (React, Vue, Svelte)?

**Document:**
- Component/view/widget structure and module boundaries
- State management strategy and libraries (platform-appropriate)
- API client design and error handling
- Loading, error, and empty state patterns
- Platform-specific navigation patterns

**For technology-specific patterns:**
- Use loaded platform-specific skill as primary reference
- Use Context7 for current documentation on specific libraries
- Use Exa for code examples, tutorials, and latest best practices:
  - `get_code_context_exa` for framework code examples
  - `web_search_exa` for recent articles and patterns
  - `deep_researcher_start` for complex architecture research

### 4. Backend Architecture

Define the backend structure (if applicable):

**Platform-specific backend patterns:**
- **Android**: Repository pattern, Room database, Retrofit/OkHttp, Hilt DI
- **iOS**: Core Data or SwiftData, Codable, URLSession, Combine/async-await
- **Flutter**: Repository pattern, sqflite/drift, dio/http, get_it/service locator
- **React Native**: API services, AsyncStorage/Realm, axios/fetch
- **Tauri**: Rust services, Tauri commands, serde, tokio
- **Electron**: Main process services, IPC handlers, Node.js APIs

**For platforms with backend API (web, Tauri, Electron):**
- Ask about module structure (layered, feature-based)
- What endpoints are needed for each feature?
- What validation is required?
- How will authentication/authorization work?

**Document:**
- Module and folder structure (platform-appropriate)
- Endpoint/command definitions with methods and paths
- Request/response contracts
- Validation and authentication requirements
- Error handling conventions

**For Bun + Hono specifically:**
- Use Context7 to query Hono routing patterns
- Use Exa `get_code_context_exa` for Hono code examples
- Use Exa `web_search_exa` for recent Hono best practices
- Query middleware patterns for validation/auth
- Query error handling best practices

### 5. Testing Scenarios

Define explicit testing for every feature based on platform:

**Platform-specific testing frameworks:**
- **Android**: JUnit, Espresso, UI Automator, Compose UI Tests
- **iOS**: XCTest, XCUITest, SwiftUI Preview tests
- **Flutter**: flutter_test, widget tests, integration tests, golden tests
- **React Native**: Jest, React Native Testing Library, Detox
- **Tauri**: Cargo test, web framework tests (vitest, jest)
- **Electron**: Spectron, Playwright, web framework tests

**For each feature, ask:**
- What are the happy path user flows?
- What edge cases should be handled?
- What failure states are possible?

**Document frontend testing scenarios:**
- User actions and expected outcomes
- Edge cases (empty states, boundary values, invalid input)
- Failure states (network errors, server errors, timeouts)
- Platform-specific scenarios (rotation, permissions, notifications)

**Document backend testing cases:**
- Business rules and validations
- Boundary conditions (min/max, empty, null)
- Failure modes (database errors, external API failures)
- Platform-specific error handling

### 6. Generate Documentation Files

Create `.mdx` files under `.pland/[feature-topic]/`:

**Required files:**
- `project-context.mdx` - Overview, tech stack, constraints
- `features.mdx` - Complete feature breakdown
- `frontend-architecture.mdx` - Components, state, APIs
- `backend-architecture.mdx` - Modules, endpoints, contracts
- `frontend-testing-scenarios.mdx` - User-centric test scenarios
- `backend-testing-cases.mdx` - Logic-driven test cases

**Each file should be:**
- Self-contained and independently readable
- Written in clear, concrete language
- Include specific examples and patterns
- Reference technology documentation where applicable

## Output Format

### Directory Structure

```
.pland/
└── [feature-topic]/
    ├── project-context.mdx
    ├── features.mdx
    ├── frontend-architecture.mdx
    ├── backend-architecture.mdx
    ├── frontend-testing-scenarios.mdx
    └── backend-testing-cases.mdx
```

### File Content Guidelines

**project-context.mdx:**
- Project overview and goals
- Target users and use cases
- Technology stack and versions
- Project constraints and assumptions
- For brownfield: existing architecture summary

**features.mdx:**
- Complete list of all features
- For each feature: purpose, responsibilities, testing
- Impact on existing code (if applicable)

**frontend-architecture.mdx:**
- Component structure and boundaries
- State management strategy
- API interaction patterns
- Error and loading state handling

**backend-architecture.mdx:**
- Module structure and layering
- API endpoints and contracts
- Validation and authentication
- Error handling conventions

**frontend-testing-scenarios.mdx:**
- Per-feature user scenarios
- Happy paths, edge cases, failure states

**backend-testing-cases.mdx:**
- Per-feature test cases
- Business rules, boundaries, failures

## Interactive Best Practices

- **Use AskUserQuestion extensively** for multi-option decisions
- **Offer Context7 lookups** when technology-specific questions arise
- **Use Exa for code examples and recent patterns:**
  - `get_code_context_exa` for real-world code samples
  - `web_search_exa` for latest blog posts and tutorials
  - `deep_researcher_start` for complex multi-source research
- **Confirm with user** before writing large sections
- **Show progress** by updating user on which section you're working on
- **Be concise but complete** - avoid filler, be concrete

## Example Usage

```bash
/planning user-authentication
```

This would create a plan at `.pland/user-authentication/` with all required files.

## Related Commands

- `/revise-planning` - Edit specific sections of existing plans
- `/validate-plan` - Check plan quality and completeness
- `/execute` - Implement from a plan

## Notes

- Plans are never overwritten - each feature-topic gets its own directory
- Use the planning-methodology skill for general planning guidance
- Use platform-specific skills for targeted architecture patterns:
  - `android-patterns` - Android development (Jetpack Compose + XML)
  - `ios-swift-patterns` - iOS development (SwiftUI + UIKit)
  - `flutter-patterns` - Flutter cross-platform development
  - `react-native-patterns` - React Native development
  - `tauri-patterns` - Tauri desktop applications
  - `electron-patterns` - Electron desktop applications
  - `architecture-patterns` - Web applications
- **Context7** for official package documentation (APIs, types, methods)
- **Exa** for code examples, tutorials, and latest best practices:
  - `get_code_context_exa` - Search for real-world code examples
  - `web_search_exa` - Find recent articles and blog posts
  - `deep_researcher_start` - Deep research for complex topics
- Platform auto-detection runs automatically for existing projects
