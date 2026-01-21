# Task Manager CLI

A command-line interface for managing project tasks with dependency tracking, progress monitoring, and validation. Designed to work with architect-planner's project planning workflow.

## Overview

The Task Manager CLI provides a complete task lifecycle management system, allowing you to:

- Create and organize tasks with dependencies
- Track task progress and completion status
- Manage frontend and backend tasks separately
- Validate task structure for circular dependencies and invalid references
- View task hierarchies and dependency chains
- Generate progress dashboards and reports

## Installation

The task-manager is automatically built and installed as a CLI tool when you build the architect-planner plugin.

```bash
pnpm build  # Builds task-manager along with other packages
```

After building, the CLI is available as:

```bash
task-manager [options] <command>
```

## Quick Start

### Initialize a Project

```bash
task-manager --plan-name my-project --platform frontend project init --framework React --deps "@react/hooks"
```

### Create a Task

```bash
task-manager --plan-name my-project --platform frontend task create \
  --id fe-001 \
  --name "Create header component" \
  --level high \
  --component "Header"
```

### List Tasks

```bash
task-manager --plan-name my-project --platform frontend task list
task-manager --plan-name my-project --platform frontend task list --foundation  # Only unblocked tasks
```

### Check Progress

```bash
task-manager --plan-name my-project --platform frontend task status
```

## Command Reference

| Command | Description | Platform | Key Options |
|---------|-------------|----------|------------|
| `task create` | Create a new task | Both | `--id`, `--name`, `--level`, `--component`, `--template`, `--blockedBy`, `--done`, `--notReady` |
| `task update <id>` | Update existing task | Both | `--name`, `--level`, `--done`, `--notDone`, `--ready`, `--notReady` |
| `task list` | List tasks with filtering | Both | `--level`, `--done`, `--pending`, `--ready`, `--notReady`, `--foundation` |
| `task detail <id>` | Show task details | Both | - |
| `task chain <id>` | Show dependency chain | Both | - |
| `task remove <id>` | Remove a task | Both | - |
| `task status` | Show progress dashboard | Both | - |
| `task validate` | Validate tasks for errors | Both | - |
| `task validate-jsonl` | Validate JSONL file format | Both | - |
| `task batch-import` | Import tasks from file | Both | `--file` |
| `project init` | Initialize project | Both | `--framework`, `--deps` |
| `project validate` | Validate entire project | Both | - |

## Commands

### Global Options

```
--plan-name <name>      Plan name (required for subcommands)
--platform <type>       Platform: frontend|backend (default: frontend)
--help                  Show help
--version              Show version
```

### Task Commands

#### `task create`

Create a new task with optional template support.

**Options:**
- `--template <name>` - Use a predefined template
- `--id <id>` - Task ID (auto-generated if not provided)
- `--name <name>` - Task name
- `--level <level>` - Priority level: critical|high|medium|low
- `--component <component>` - Component name
- `--files <files>` - Files to be created
- `--done` - Mark as done
- `--notReady` - Mark as not ready
- `--blockedBy <ids...>` - Blocking task IDs

**Examples:**

```bash
# Create with explicit values
task-manager --plan-name myapp --platform frontend task create \
  --id fe-001 \
  --name "Setup routing" \
  --level high \
  --component "Router"

# Create with template
task-manager --plan-name myapp --platform frontend task create \
  --template component \
  --name "User Profile Component"
```

#### `task update <id>`

Update an existing task.

**Options:**
- `--name <name>` - Update task name
- `--level <level>` - Update priority level
- `--done` - Mark as done
- `--notDone` - Mark as not done
- `--ready` - Mark as ready
- `--notReady` - Mark as not ready

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend task update fe-001 --done
task-manager --plan-name myapp --platform frontend task update fe-001 --name "New name" --level critical
```

#### `task list`

List tasks with optional filtering.

**Options:**
- `--level <level>` - Filter by priority level
- `--done` - Show only completed tasks
- `--pending` - Show only pending tasks
- `--ready` - Show only ready tasks
- `--notReady` - Show only blocked tasks
- `--foundation` - Show only foundation tasks (no blockers)

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend task list
task-manager --plan-name myapp --platform frontend task list --foundation --ready
task-manager --plan-name myapp --platform frontend task list --level high --done
```

#### `task detail <id>`

Show detailed information about a task.

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend task detail fe-001
```

#### `task chain <id>`

Show the dependency chain for a task (direct and transitive dependencies).

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend task chain fe-001
```

#### `task remove <id>`

Remove a task (with warnings about dependents).

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend task remove fe-001
```

#### `task status`

Display a progress dashboard with:
- Overall completion rate
- Status breakdown (Done, Ready, Pending)
- Priority distribution
- Dependency statistics
- Tasks ready to start

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend task status
```

#### `task validate`

Validate tasks for:
- Circular dependencies
- Invalid task references
- Data integrity

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend task validate
```

#### `task validate-jsonl`

Validate the JSONL task file structure for formatting issues.

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend task validate-jsonl
```

#### `task batch-import`

Import tasks from a JSONL file.

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend task batch-import --file tasks.jsonl
```

### Project Commands

#### `project init`

Initialize a project task file with metadata.

**Options:**
- `--framework <name>` - Framework name
- `--deps <deps...>` - Dependencies list

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend project init --framework React --deps react react-dom
```

#### `project validate`

Validate the entire project for issues.

**Examples:**

```bash
task-manager --plan-name myapp --platform frontend project validate
```

## Task Structure

Tasks are stored in JSONL format (one JSON object per line) and include:

```typescript
{
  id: string;                    // Unique task identifier (fe-001, be-001)
  name: string;                  // Task name
  level: Priority;               // critical|high|medium|low
  component: string;             // Component/module name
  files?: string;                // Files to create
  testsSuccess?: string[];       // Acceptance criteria/tests
  blockedBy?: string[];          // Direct blocking tasks
  blockedByTransitive?: string[]; // All transitive dependencies
  dependencyChain?: string[];    // Readable dependency chain
  blocks?: string[];             // Tasks this blocks
  acceptanceCriteria?: string[]; // Acceptance criteria
  estimatedEffort?: string;      // S|M|L|XL
  implementationNotes?: string;  // Implementation notes
  done: boolean;                 // Completion status
  ready: boolean;                // Ready to start status
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

## File Locations

Task files are stored in the `.pland` directory structure:

```
.pland/
├── [plan-name]/
│   ├── frontend-tasks.jsonl     # Frontend tasks
│   └── backend-tasks.jsonl      # Backend tasks
```

## Architecture

### Core Components

**TaskService** - Business logic for task operations
- CRUD operations (Create, Read, Update, Delete)
- Dependency calculation and validation
- Progress tracking and statistics
- File I/O operations

**TaskRepository** - Data access layer
- Loads/saves JSONL files
- Handles file structure validation
- Finds tasks by ID or criteria

**TaskValidator** - Input validation
- Validates task creation data
- Validates task updates
- Validates JSONL file format

**CLI** - Command-line interface
- Command registration with Commander.js
- Error handling and user feedback
- Context management for plan/platform

### Dependency Management

The task manager automatically maintains:

- **Direct dependencies** (`blockedBy`): Tasks explicitly blocking this task
- **Transitive dependencies** (`blockedByTransitive`): All upstream dependencies
- **Dependent tasks** (`blocks`): Tasks that depend on this one
- **Dependency chains** (`dependencyChain`): Readable dependency paths

Circular dependencies are detected and reported as validation errors.

## Error Handling

The CLI provides clear error messages for:

- Missing required options (plan-name, platform)
- Task not found
- Duplicate task IDs
- Circular dependencies
- Invalid references
- Validation errors

## Output Formatting

The CLI uses:

- **Color coding** for status and priority
- **Tables** for formatted output
- **Progress bars** for completion tracking
- **Symbols** for visual clarity (✓, ✗, →, •)

## Development

### Building

```bash
pnpm --filter @architect-planner/task-manager build
```

### Development Watch Mode

```bash
pnpm --filter @architect-planner/task-manager dev
```

### Type Checking

```bash
pnpm --filter @architect-planner/task-manager typecheck
```

### Cleaning

```bash
pnpm --filter @architect-planner/task-manager clean
```

## Dependencies

- **commander** - CLI framework
- **cli-table3** - Table formatting
- **zod** - Data validation
- **@architect-planner/types** - Shared types
- **@architect-planner/utils** - Shared utilities

## Node.js Requirements

Minimum: Node.js 18.0.0

## License

MIT
