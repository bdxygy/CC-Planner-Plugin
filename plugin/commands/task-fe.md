---
name: task-fe
description: Create organized frontend task lists from existing plans. Extracts tasks with full context, organizes by priority, and outputs task lists ready for seamless execution with /execute-fe.
argument-hint: [feature-topic]
allowed-tools:
  - AskUserQuestion
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - TodoWrite
---

# /task-fe

Create organized frontend task lists from existing project plans. Extracts implementation tasks with full context, organizes them by priority, and generates task lists ready for seamless execution with `/execute-fe`.

## When to Use

Use this command when:
- You have an existing plan in `.pland/[feature-topic]/`
- You need to break down frontend features into actionable tasks
- You want prioritized task lists before implementation
- You're preparing for a frontend TDD implementation sprint

## Execution Workflow

### 1. Load Plan and Feature Selection

First, identify the plan to extract tasks from:

```bash
# Check if plan directory exists
Glob ".pland/*/features.mdx"
```

**Use AskUserQuestion to ask:**
- Which feature-topic plan to extract tasks from?
- Extract tasks for entire frontend or specific features?
- Include dependencies between tasks?

### 2. Read Plan Files

Read the relevant plan files for task extraction:

```bash
# Read core plan files
Read .pland/[feature-topic]/features.mdx
Read .pland/[feature-topic]/frontend-architecture.mdx
Read .pland/[feature-topic]/frontend-testing-scenarios.mdx
Read .pland/[feature-topic]/project-context.mdx (optional)
```

### 3. Detect Frontend Platform

Auto-detect the frontend platform from existing codebase:

**Use Glob to detect:**
- **Android**: `app/src/main/**/*.kt`, `build.gradle` with Compose/XML
- **iOS/Swift**: `**/*.swift`, `*.xcodeproj`
- **Flutter**: `lib/**/*.dart`, `pubspec.yaml`
- **React Native**: `package.json` with react-native, `components/**`
- **Tauri/Electron**: `src/**`, web framework detection
- **Web**: `src/components/**`, framework detection

### 4. Extract and Categorize Tasks

Analyze plan files to extract frontend tasks. For each task identified:

**Task Information to Extract (Full Context):**
- **Task Name**: Clear, actionable description
- **Priority**: High, Medium, or Low
- **Component/Feature**: Which UI component or feature
- **File Location**: Suggested file path
- **Related Components**: Dependencies on other components
- **Test Requirements**: What tests need to be written
- **Implementation Notes**: Platform-specific considerations
- **Acceptance Criteria**: Definition of done
- **Estimated Effort**: Relative complexity (S/M/L)

### 5. Organize Tasks by Priority

Structure tasks into three priority levels:

#### HIGH Priority Tasks
- Core user flows and critical features
- Authentication and security components
- Key screens/views that block other features
- Foundation components (navigation, layouts)

#### MEDIUM Priority Tasks
- Secondary features and enhancements
- Non-blocking UI components
- State management setup
- Data fetching and display

#### LOW Priority Tasks
- Polish and optimizations
- Nice-to-have features
- Error handling improvements
- Accessibility enhancements

### 6. Generate Task List Output

Create a structured task list in one of these formats:

**Format 1: Markdown Task List (for human review)**
```markdown
# Frontend Tasks: [feature-topic]

## High Priority
- [ ] **Setup Navigation & Routing**
  - Component: AppNavigation
  - File: `src/navigation/AppNavigation.{ext}`
  - Tests: Navigation flow tests
  - Dependencies: None
  - Notes: Use platform-specific navigation (React Navigation, Jetpack Navigation, etc.)

- [ ] **Implement ProductList Screen**
  - Component: ProductList
  - File: `src/screens/ProductList.{ext}`
  - Tests: Loading state, empty state, error state, item rendering
  - Dependencies: ProductCard component
  - Acceptance: Displays 20 items, handles scroll, shows loading spinner

## Medium Priority
- [ ] **Create ProductCard Component**
  - Component: ProductCard
  - File: `src/components/ProductCard.{ext}`
  - Tests: Render product info, handle tap, display image
  - Dependencies: None
  - Notes: Reusable card component

## Low Priority
- [ ] **Add Skeleton Loading**
  - Component: SkeletonLoader
  - File: `src/components/SkeletonLoader.{ext}`
  - Tests: Matches layout dimensions
  - Dependencies: ProductList
```

**Format 2: JSON Task List (for /execute-fe integration)**
```json
{
  "featureTopic": "e-commerce",
  "platform": "flutter",
  "tasks": {
    "high": [
      {
        "id": "fe-001",
        "name": "Setup Navigation & Routing",
        "component": "AppNavigation",
        "file": "lib/navigation/app_navigation.dart",
        "tests": ["Navigation flow tests", "Deep linking tests"],
        "dependencies": [],
        "acceptanceCriteria": ["Can navigate between screens", "Deep links work"],
        "estimatedEffort": "M",
        "implementationNotes": "Use GoRouter for routing"
      }
    ],
    "medium": [
      {
        "id": "fe-002",
        "name": "Create ProductCard Component",
        "component": "ProductCard",
        "file": "lib/components/product_card.dart",
        "tests": ["Render product info", "Handle tap", "Display image"],
        "dependencies": [],
        "acceptanceCriteria": ["Shows name, price, image", "Clickable", "Loading placeholder"],
        "estimatedEffort": "S",
        "implementationNotes": "Use Hero animation for image"
      }
    ],
    "low": [
      {
        "id": "fe-003",
        "name": "Add Skeleton Loading",
        "component": "SkeletonLoader",
        "file": "lib/components/skeleton_loader.dart",
        "tests": ["Matches layout dimensions"],
        "dependencies": ["ProductList"],
        "acceptanceCriteria": ["Animates shimmer effect", "Matches content layout"],
        "estimatedEffort": "S",
        "implementationNotes": "Use Shimmer package"
      }
    ]
  }
}
```

### 7. Write Task List File

Save the task list to the plan directory:

```bash
# Save task list to .pland/[feature-topic]/frontend-tasks.md
Write .pland/[feature-topic]/frontend-tasks.md
```

Or save as JSON for programmatic access:

```bash
# Save JSON task list to .pland/[feature-topic]/frontend-tasks.json
Write .pland/[feature-topic]/frontend-tasks.json
```

### 8. Display Task Summary

Present a summary to the user:

```
Frontend Tasks Extracted: e-commerce

Platform: Flutter
Total Tasks: 24

Priority Breakdown:
  🔴 High:   8 tasks  (Core features, navigation, auth)
  🟡 Medium: 12 tasks (Components, state, data)
  🟢 Low:    4 tasks  (Polish, optimization)

Task List Saved: .pland/e-commerce/frontend-tasks.md

Next Steps:
- Review task list: cat .pland/e-commerce/frontend-tasks.md
- Execute with TDD: /execute-fe e-commerce
- Start with high priority tasks
```

## Task Extraction Patterns

### From features.mdx
Extract feature descriptions and break down into UI tasks:
- Each user story → screen/view task
- Each requirement → component task
- Each acceptance criterion → test requirement

### From frontend-architecture.mdx
Extract implementation details:
- Component hierarchy → component tasks
- State management → state setup tasks
- Navigation structure → routing tasks
- API integration → data fetching tasks

### From frontend-testing-scenarios.mdx
Extract test requirements:
- Each scenario → test case
- Edge cases → additional test tasks
- User flows → integration test tasks

## Platform-Specific Task Examples

### Android Tasks
```markdown
## High Priority
- [ ] **Setup Jetpack Compose Navigation**
  - Component: MainActivity, NavHost
  - File: `app/src/main/java/com/example/navigation/NavGraph.kt`
  - Tests: Navigation tests, deep link tests
  - Notes: Use Compose Navigation with Hilt

- [ ] **Implement ProductList Composable**
  - Component: ProductList
  - File: `app/src/main/java/com/example/screens/ProductList.kt`
  - Tests: Compose UI test, LazyColumn rendering
  - Dependencies: ProductCard
```

### iOS/Swift Tasks
```markdown
## High Priority
- [ ] **Setup SwiftUI Navigation**
  - Component: AppRootView
  - File: `Sources/Navigation/AppRootView.swift`
  - Tests: Navigation tests
  - Notes: Use NavigationStack for iOS 16+

- [ ] **Implement ProductList View**
  - Component: ProductList
  - File: `Sources/Screens/ProductList.swift`
  - Tests: Snapshot tests, preview tests
  - Dependencies: ProductCard
```

### Flutter Tasks
```markdown
## High Priority
- [ ] **Setup GoRouter Navigation**
  - Component: AppRouter
  - File: `lib/router/app_router.dart`
  - Tests: Router tests, route matching
  - Notes: Define all routes, implement deep linking

- [ ] **Implement ProductList Screen**
  - Component: ProductList
  - File: `lib/screens/product_list.dart`
  - Tests: Widget tests, golden tests
  - Dependencies: ProductCard, BLoC provider
```

### React Native Tasks
```markdown
## High Priority
- [ ] **Setup React Navigation**
  - Component: NavigationContainer
  - File: `src/navigation/AppNavigator.tsx`
  - Tests: Navigation tests
  - Notes: Use React Navigation v6 with Stack Navigator

- [ ] **Implement ProductList Screen**
  - Component: ProductList
  - File: `src/screens/ProductList.tsx`
  - Tests: Component tests with React Native Testing Library
  - Dependencies: ProductCard, useProducts hook
```

### Web (React) Tasks
```markdown
## High Priority
- [ ] **Setup React Router**
  - Component: BrowserRouter, Routes
  - File: `src/router/AppRouter.tsx`
  - Tests: Routing tests
  - Notes: Define lazy-loaded routes

- [ ] **Implement ProductList Page**
  - Component: ProductList
  - File: `src/pages/ProductList.tsx`
  - Tests: Component tests with React Testing Library
  - Dependencies: ProductCard, useQuery hook
```

## Seamless Integration with /execute-fe

The generated task list integrates seamlessly with `/execute-fe`:

**Option 1: Direct Reference**
```bash
# /execute-fe reads the task list automatically
/execute-fe e-commerce
# Loads: .pland/e-commerce/frontend-tasks.json
# Executes tasks by priority (high → medium → low)
```

**Option 2: Manual Selection**
```bash
# User selects specific tasks to execute
/execute-fe e-commerce
# Asks: Which tasks to execute?
# Options: High only, All, Select specific
```

**Option 3: TODO List Sync**
```bash
# /task-fe creates TodoWrite entries
# /execute-fe picks up the same TODOs
# No duplication, seamless handoff
```

## Output Summary

After task extraction, provide:

```
Frontend Task List Created

Feature Topic: [feature-topic]
Platform: [detected platform]

Tasks Generated: [total]
  High Priority:   [count] 🔴
  Medium Priority: [count] 🟡
  Low Priority:    [count] 🟢

Output Files:
- .pland/[topic]/frontend-tasks.md (human-readable)
- .pland/[topic]/frontend-tasks.json (machine-readable)

Integration:
- Run /execute-fe [topic] to execute tasks with TDD
- Tasks organized by priority for optimal implementation
- Full context included for each task

Next Steps:
1. Review task list: cat .pland/[topic]/frontend-tasks.md
2. Adjust priorities if needed
3. Execute: /execute-fe [topic]
```

## Related Commands

- `/execute-fe` - Execute frontend tasks using TDD
- `/task-be` - Create backend task lists
- `/planning` - Create a new plan
- `/revise-planning` - Edit existing plans

## Notes

- Tasks extracted from existing plans only
- Full context included: file locations, tests, dependencies
- Organized by priority for focused implementation
- Seamless integration with /execute-fe
- Platform-specific task patterns applied automatically
