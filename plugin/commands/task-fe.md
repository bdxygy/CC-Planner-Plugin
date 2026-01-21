---
description: Create organized frontend task lists from existing plans. Extracts tasks with full context, organizes by priority, and outputs task lists in JSONL format ready for seamless execution with /execute-fe.
argument-hint: [plan-name]
allowed-tools: ['AskUserQuestion', 'Read', 'Write', 'Glob', 'Grep', 'Bash', 'TodoWrite']
---

# /task-fe

Create organized frontend task lists from existing project plans. Extracts implementation tasks with full context, organizes them by priority, and generates task lists in **JSONL format** ready for seamless execution with `/execute-fe`.

This command uses the **Task Manager CLI** with efficient syntax:

```
task-manager.js [plan-name] frontend [command] [options...]
```

## When to Use

Use this command when:

- You have an existing plan in `.pland/[plan-name]/`
- You need to break down frontend features into actionable tasks
- You want prioritized task lists before implementation
- You're preparing for a frontend TDD implementation sprint

## Task Manager CLI

**Syntax:** `task-manager.js [plan-name] frontend [command] [options...]`

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `init`            | Initialize task file for this plan |
| `create`          | Create a new task                  |
| `update [taskId]` | Update an existing task            |
| `list`            | List tasks (with filters)          |
| `detail [taskId]` | Show task details                  |
| `chain [taskId]`  | Show dependency chain              |
| `remove [taskId]` | Delete a task                      |
| `status`          | Show progress dashboard            |
| `validate`        | Check for conflicts                |
| `template`        | List available templates           |

## Quick Start

```bash
# Initialize frontend tasks for myapp
node plugin/scripts/task-manager.js myapp frontend init --framework react

# Create a component using template
node plugin/scripts/task-manager.js myapp frontend create --template component --ComponentName Button --ext tsx

# List foundation tasks (ready to start)
node plugin/scripts/task-manager.js myapp frontend list --foundation

# Show progress dashboard
node plugin/scripts/task-manager.js myapp frontend status
```

## Execution Workflow

### 1. Load Plan and Detect Platform

First, identify the plan and detect the frontend platform:

```bash
# Check if plan directory exists
Glob ".pland/*/features.mdx"

# Detect platform using Glob
Glob "package.json"           # React/Next.js/Vue
Glob "pubspec.yaml"           # Flutter
Glob "app/build.gradle"       # Android
Glob "**/*.swift"             # iOS/Swift
```

### 2. Initialize Task File

```bash
node plugin/scripts/task-manager.js [plan-name] frontend init --framework [detected-framework]
```

**Example:**

```bash
# For React project
node plugin/scripts/task-manager.js myapp frontend init --framework react

# For Flutter project
node plugin/scripts/task-manager.js myapp frontend init --framework flutter
```

### 3. Create Tasks

Analyze plan files and create tasks. Use templates when possible:

```bash
# Using template (recommended)
node plugin/scripts/task-manager.js myapp frontend create \
  --template component \
  --ComponentName ProductCard \
  --ext tsx \
  --blockedBy fe-0001

# Manual creation
node plugin/scripts/task-manager.js myapp frontend create \
  --name "Setup Navigation" \
  --level high \
  --component AppNavigation \
  --files "src/navigation/AppNavigation.tsx" \
  --tests "Navigation tests,Deep link tests" \
  --acceptance "Can navigate between screens,Deep links work" \
  --effort M \
  --notes "Use React Router v6"
```

### 4. List and Manage Tasks

```bash
# List all foundation tasks
node plugin/scripts/task-manager.js myapp frontend list --foundation

# List by priority
node plugin/scripts/task-manager.js myapp frontend list --high
node plugin/scripts/task-manager.js myapp frontend list --critical

# Show task details
node plugin/scripts/task-manager.js myapp frontend detail fe-0001

# Show dependency chain
node plugin/scripts/task-manager.js myapp frontend chain fe-0003
```

### 5. Update Task Status

```bash
# Mark as done
node plugin/scripts/task-manager.js myapp frontend update fe-0001 --done

# Mark as not ready (blocked)
node plugin/scripts/task-manager.js myapp frontend update fe-0002 --notReady

# Update dependencies
node plugin/scripts/task-manager.js myapp frontend update fe-0003 --blockedBy fe-0001,fe-0002
```

### 6. Show Progress

```bash
node plugin/scripts/task-manager.js myapp frontend status
```

**Output:**

```
╔════════════════════════════════════════════════════════╗
║           Task Progress Dashboard                      ║
╠════════════════════════════════════════════════════════╣
║ Progress: ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 25.0% ║
║                                                      ║
║ Tasks: 24 total  │ 6 done  │ 12 ready  │ 6 pending  ║
║                                                      ║
║ By Priority:                                         ║
║   Critical: 0  High: 8  Medium: 12  Low: 4          ║
║                                                      ║
║ Dependencies:                                        ║
║   ✓ Foundation: 5                  ║
║   → Blocked:  19                  ║
╚════════════════════════════════════════════════════════╝

★ Ready to start:
  fe-0001 [high] Setup Vite + React + TypeScript
  fe-0005 [high] Setup Awilix IoC Container
```

## Available Templates

| Template    | Description                                | Level  |
| ----------- | ------------------------------------------ | ------ |
| `component` | UI Component (atoms, molecules, organisms) | high   |
| `hook`      | Custom React hook                          | medium |
| `page`      | Page/screen component                      | high   |
| `test`      | Test suite for existing component          | medium |

**List all templates:**

```bash
node plugin/scripts/task-manager.js myapp frontend template
```

## Task Examples by Platform

### React/Next.js

```bash
# Initialize
node plugin/scripts/task-manager.js myapp frontend init --framework react

# Create component
node plugin/scripts/task-manager.js myapp frontend create --template component --ComponentName Button --ext tsx

# Create page
node plugin/scripts/task-manager.js myapp frontend create --template page --PageName HomePage --ext tsx --blockedBy fe-0001

# Create hook
node plugin/scripts/task-manager.js myapp frontend create --template hook --HookName useProducts --ext ts
```

### Flutter

```bash
# Initialize
node plugin/scripts/task-manager.js myapp frontend init --framework flutter

# Create widget
node plugin/scripts/task-manager.js myapp frontend create \
  --name "Create ProductCard Widget" \
  --level high \
  --component ProductCard \
  --files "lib/widgets/product_card.dart" \
  --tests "Widget test,Golden test" \
  --acceptance "Displays product info,Handles tap" \
  --effort S
```

### Android (Jetpack Compose)

```bash
# Initialize
node plugin/scripts/task-manager.js myapp frontend init --framework jetpack-compose

# Create composable
node plugin/scripts/task-manager.js myapp frontend create \
  --name "Create ProductCard Composable" \
  --level high \
  --component ProductCard \
  --files "app/src/main/java/com/example/components/ProductCard.kt" \
  --tests "Compose UI test,Preview test" \
  --acceptance "Renders correctly,Handles click" \
  --effort S
```

## Common Operations

**List all foundation tasks:**

```bash
node plugin/scripts/task-manager.js myapp frontend list --foundation
```

**List by priority:**

```bash
node plugin/scripts/task-manager.js myapp frontend list --high
node plugin/scripts/task-manager.js myapp frontend list --critical
```

**Show task details:**

```bash
node plugin/scripts/task-manager.js myapp frontend detail fe-0001
```

**Show dependency chain:**

```bash
node plugin/scripts/task-manager.js myapp frontend chain fe-0003
```

**Remove a task:**

```bash
node plugin/scripts/task-manager.js myapp frontend remove fe-0001
```

## Output Summary

After task extraction, provide:

```
Frontend Task List Created

Plan: myapp
Platform: frontend

Tasks Generated: [total]
  Critical: [count] 🔴
  High:     [count] ⚠️
  Medium:   [count] ○
  Low:      [count] •

Dependency Analysis:
  ✅ No circular dependencies detected
  📊 Foundation tasks: [count]
  ⏳ Blocked tasks: [count]

Task File: .pland/myapp/frontend-tasks.jsonl

Quick Commands:
- List tasks: node plugin/scripts/task-manager.js myapp frontend list --foundation
- Show status: node plugin/scripts/task-manager.js myapp frontend status
- Validate: node plugin/scripts/task-manager.js myapp frontend validate

Next Steps:
1. Review: node plugin/scripts/task-manager.js myapp frontend list
2. Check status: node plugin/scripts/task-manager.js myapp frontend status
3. Start with foundation tasks
4. Execute: /execute-fe myapp
```

## Related Commands

- `/execute-fe` - Execute frontend tasks using TDD
- `/task-be` - Create backend task lists
- `/planning` - Create a new plan

## Notes

- Tasks stored in **JSONL format** at `.pland/[plan-name]/frontend-tasks.jsonl`
- **Auto-calculated dependencies**: only specify direct blockedBy relationships
- **Circular dependency detection** via `validate` command
- **Progress dashboard** with ASCII visualization
- **Task templates** for common patterns
- Task IDs auto-generated with `fe-` prefix (fe-0001, fe-0002, etc.)
