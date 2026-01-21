---
description: Create organized backend task lists from existing plans. Extracts tasks with full context, organizes by priority, and outputs task lists in JSONL format ready for seamless execution with /execute-be.
argument-hint: [plan-name]
allowed-tools: ['AskUserQuestion', 'Read', 'Write', 'Glob', 'Grep', 'Bash', 'TodoWrite']
---

# /task-be

Create organized backend task lists from existing project plans. Extracts implementation tasks with full context, organizes them by priority, and generates task lists in **JSONL format** ready for seamless execution with `/execute-be`.

This command uses the **Task Manager CLI** with efficient syntax:

```
task-manager.js [plan-name] backend [command] [options...]
```

## When to Use

Use this command when:

- You have an existing plan in `.pland/[plan-name]/`
- You need to break down backend features into actionable tasks
- You want prioritized task lists before implementation
- You're preparing for a backend TDD implementation sprint

## Task Manager CLI

**Syntax:** `task-manager.js [plan-name] backend [command] [options...]`

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
# Initialize backend tasks for myapp
node plugin/scripts/task-manager.js myapp backend init --framework express

# Create a service using template
node plugin/scripts/task-manager.js myapp backend create --template service --ServiceName ProductService --category products --ext ts

# Create a repository
node plugin/scripts/task-manager.js myapp backend create --template repository --Entity Product --ext ts

# List foundation tasks
node plugin/scripts/task-manager.js myapp backend list --foundation

# Show progress
node plugin/scripts/task-manager.js myapp backend status
```

## Execution Workflow

### 1. Load Plan and Detect Platform

First, identify the plan and detect the backend platform:

```bash
# Check if plan directory exists
Glob ".pland/*/backend-architecture.mdx"

# Detect platform using Glob
Glob "package.json"           # Node.js (Express, Fastify, Hono)
Glob "requirements.txt"       # Python (FastAPI, Django)
Glob "go.mod"                 # Go
Glob "Cargo.toml"             # Rust
```

### 2. Initialize Task File

```bash
node plugin/scripts/task-manager.js [plan-name] backend init --framework [detected-framework]
```

**Example:**

```bash
# Node.js + Express
node plugin/scripts/task-manager.js myapp backend init --framework express

# Python + FastAPI
node plugin/scripts/task-manager.js myapp backend init --framework fastapi

# Go
node plugin/scripts/task-manager.js myapp backend init --framework go
```

### 3. Create Tasks

Analyze plan files and create tasks. Use templates when possible:

```bash
# Create repository
node plugin/scripts/task-manager.js myapp backend create \
  --template repository \
  --Entity Product \
  --ext ts

# Create service (depends on repository)
node plugin/scripts/task-manager.js myapp backend create \
  --template service \
  --ServiceName ProductService \
  --category products \
  --ext ts \
  --blockedBy be-0001

# Create controller (depends on service)
node plugin/scripts/task-manager.js myapp backend create \
  --template controller \
  --Entity Product \
  --ext ts \
  --blockedBy be-0002
```

### 4. List and Manage Tasks

```bash
# List all foundation tasks
node plugin/scripts/task-manager.js myapp backend list --foundation

# List by priority
node plugin/scripts/task-manager.js myapp backend list --high
node plugin/scripts/task-manager.js myapp backend list --critical

# Show task details
node plugin/scripts/task-manager.js myapp backend detail be-0001

# Show dependency chain
node plugin/scripts/task-manager.js myapp backend chain be-0003
```

### 5. Update Task Status

```bash
# Mark as done
node plugin/scripts/task-manager.js myapp backend update be-0001 --done

# Mark as not ready
node plugin/scripts/task-manager.js myapp backend update be-0002 --notReady

# Update dependencies
node plugin/scripts/task-manager.js myapp backend update be-0003 --blockedBy be-0001,be-0002
```

## Available Templates

| Template     | Description                          | Level    |
| ------------ | ------------------------------------ | -------- |
| `repository` | Data repository with CRUD operations | high     |
| `service`    | Business logic service               | high     |
| `controller` | API controller/handler               | high     |
| `migration`  | Database migration                   | critical |
| `middleware` | Middleware component                 | medium   |
| `test`       | Test suite for existing service      | medium   |

**List all templates:**

```bash
node plugin/scripts/task-manager.js myapp backend template
```

## Task Examples by Platform

### Node.js + Express/Fastify

```bash
# Initialize
node plugin/scripts/task-manager.js myapp backend init --framework express

# Create repository
node plugin/scripts/task-manager.js myapp backend create --template repository --Entity Product --ext ts

# Create service
node plugin/scripts/task-manager.js myapp backend create --template service --ServiceName ProductService --category products --ext ts --blockedBy be-0001

# Create controller
node plugin/scripts/task-manager.js myapp backend create --template controller --Entity Product --ext ts --blockedBy be-0002
```

### Bun + Hono

```bash
# Initialize
node plugin/scripts/task-manager.js myapp backend init --framework hono

# Create service
node plugin/scripts/task-manager.js myapp backend create --template service --ServiceName ProductService --category products --ext ts

# Create routes (like controller)
node plugin/scripts/task-manager.js myapp backend create \
  --name "Create Product Routes" \
  --level high \
  --component ProductRoutes \
  --files "src/routes/products.ts" \
  --tests "Route handlers,Middleware integration" \
  --acceptance "All routes work,Middleware applied" \
  --effort M \
  --blockedBy be-0001
```

### Python + FastAPI

```bash
# Initialize
node plugin/scripts/task-manager.js myapp backend init --framework fastapi

# Create repository
node plugin/scripts/task-manager.js myapp backend create \
  --name "Create ProductRepository" \
  --level high \
  --component ProductRepository \
  --files "app/repositories/product_repository.py" \
  --tests "Unit tests with pytest,Mocked DB" \
  --acceptance "All CRUD methods work" \
  --effort M

# Create service
node plugin/scripts/task-manager.js myapp backend create \
  --name "Create ProductService" \
  --level high \
  --component ProductService \
  --files "app/services/product_service.py" \
  --tests "Business logic,Validation" \
  --acceptance "All business rules implemented" \
  --effort L \
  --blockedBy be-0001

# Create API router
node plugin/scripts/task-manager.js myapp backend create \
  --name "Create Product Router" \
  --level high \
  --component ProductRouter \
  --files "app/api/products.py" \
  --tests "Endpoint tests,Validation" \
  --acceptance "All endpoints work" \
  --effort M \
  --blockedBy be-0002
```

### Go

```bash
# Initialize
node plugin/scripts/task-manager.js myapp backend init --framework go

# Create repository
node plugin/scripts/task-manager.js myapp backend create --template repository --Entity Product --ext go

# Create service
node plugin/scripts/task-manager.js myapp backend create --template service --ServiceName ProductService --category products --ext go --blockedBy be-0001

# Create handler
node plugin/scripts/task-manager.js myapp backend create --template controller --Entity Product --ext go --blockedBy be-0002
```

### Rust (Actix/Axum)

```bash
# Initialize
node plugin/scripts/task-manager.js myapp backend init --framework actix

# Create repository
node plugin/scripts/task-manager.js myapp backend create --template repository --Entity Product --ext rs

# Create service
node plugin/scripts/task-manager.js myapp backend create --template service --ServiceName ProductService --category products --ext rs --blockedBy be-0001

# Create handler
node plugin/scripts/task-manager.js myapp backend create --template controller --Entity Product --ext rs --blockedBy be-0002
```

## Common Operations

**List all foundation tasks:**

```bash
node plugin/scripts/task-manager.js myapp backend list --foundation
```

**List by priority:**

```bash
node plugin/scripts/task-manager.js myapp backend list --high
node plugin/scripts/task-manager.js myapp backend list --critical
```

**Show task details:**

```bash
node plugin/scripts/task-manager.js myapp backend detail be-0001
```

**Show dependency chain:**

```bash
node plugin/scripts/task-manager.js myapp backend chain be-0003
```

**Remove a task:**

```bash
node plugin/scripts/task-manager.js myapp backend remove be-0001
```

## Output Summary

After task extraction, provide:

```
Backend Task List Created

Plan: myapp
Platform: backend

Tasks Generated: [total]
  Critical: [count] 🔴
  High:     [count] ⚠️
  Medium:   [count] ○
  Low:      [count] •

Dependency Analysis:
  ✅ No circular dependencies detected
  📊 Foundation tasks: [count]
  ⏳ Blocked tasks: [count]

Task File: .pland/myapp/backend-tasks.jsonl

Quick Commands:
- List tasks: node plugin/scripts/task-manager.js myapp backend list --foundation
- Show status: node plugin/scripts/task-manager.js myapp backend status
- Validate: node plugin/scripts/task-manager.js myapp backend validate

Next Steps:
1. Review: node plugin/scripts/task-manager.js myapp backend list
2. Check status: node plugin/scripts/task-manager.js myapp backend status
3. Start with foundation tasks
4. Execute: /execute-be myapp
```

## Related Commands

- `/execute-be` - Execute backend tasks using TDD
- `/task-fe` - Create frontend task lists
- `/planning` - Create a new plan

## Notes

- Tasks stored in **JSONL format** at `.pland/[plan-name]/backend-tasks.jsonl`
- **Auto-calculated dependencies**: only specify direct blockedBy relationships
- **Circular dependency detection** via `validate` command
- **Progress dashboard** with ASCII visualization
- **Task templates** for common backend patterns
- Task IDs auto-generated with `be-` prefix (be-0001, be-0002, etc.)
- Backend tasks focus on **isolated unit tests** with mocked dependencies
