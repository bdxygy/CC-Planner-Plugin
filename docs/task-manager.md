# Task Manager CLI

The Architect-Planner Task Manager CLI is a standalone Node.js tool for managing implementation tasks in JSONL format.

## Quick Start

```bash
# Initialize frontend tasks for myapp
node plugin/scripts/task-manager.js myapp frontend init --framework react

# Create a component using template
node plugin/scripts/task-manager.js myapp frontend create --template component --ComponentName Button --ext tsx

# List foundation tasks
node plugin/scripts/task-manager.js myapp frontend list --foundation

# Show progress
node plugin/scripts/task-manager.js myapp frontend status
```

## Syntax

```
task-manager.js [plan-name] [frontend|backend] [command] [options...]
```

- **plan-name**: Name of your plan (creates `.pland/[plan-name]/` directory)
- **platform**: `frontend` or `backend` (determines task ID prefix: `fe-` or `be-`)
- **command**: Command to execute (see commands below)

## Commands

### init

Initialize task file for this plan/platform.

```bash
task-manager.js [plan] [platform] init [options]
```

**Options:**
- `--framework <name>` - Framework name (react, vue, flutter, etc.)
- `--deps <list>` - Current dependencies (comma-separated)

**Example:**
```bash
node plugin/scripts/task-manager.js myapp frontend init --framework react --deps "vite,typescript"
```

### create

Create a new task.

```bash
task-manager.js [plan] [platform] create [options]
```

**Options:**
- `--template <name>` - Use template (component, service, hook, page, test, repository, controller, migration, middleware, di-registration)
- `--id <id>` - Task ID (auto-generated if not specified)
- `--name <name>` - Task name
- `--level <level>` - Priority (critical/high/medium/low)
- `--component <name>` - Component name
- `--files <paths>` - File paths (comma-separated)
- `--tests <list>` - Test criteria (comma-separated)
- `--deps <list>` - Component dependencies (comma-separated)
- `--blockedBy <list>` - Task IDs this depends on (comma-separated)
- `--acceptance <list>` - Acceptance criteria (comma-separated)
- `--effort <size>` - Estimated effort (S/M/L)
- `--notes <text>` - Implementation notes
- `--done` - Mark as completed
- `--notReady` - Mark as not ready

**Template Variables:**
- `--ComponentName <name>` - For component/page templates
- `--ServiceName <name>` - For service templates
- `--HookName <name>` - For hook templates
- `--Entity <name>` - For repository/controller/migration templates
- `--MiddlewareName <name>` - For middleware templates
- `--ext <extension>` - File extension (tsx, ts, py, go, rs, etc.)
- `--category <name>` - Service category

**Examples:**

Using template:
```bash
node plugin/scripts/task-manager.js myapp frontend create \
  --template component \
  --ComponentName ProductCard \
  --ext tsx \
  --blockedBy fe-0001
```

Manual creation:
```bash
node plugin/scripts/task-manager.js myapp frontend create \
  --name "Create Button Component" \
  --level high \
  --component Button \
  --files "src/components/Button.tsx" \
  --tests "Renders correctly,Handles click" \
  --acceptance "Component works,Accessible" \
  --effort S
```

### update

Update an existing task.

```bash
task-manager.js [plan] [platform] update [taskId] [options]
```

**Options:**
- `--name <name>` - Update task name
- `--level <level>` - Update priority
- `--component <name>` - Update component name
- `--files <paths>` - Update file paths
- `--tests <list>` - Update test criteria
- `--deps <list>` - Update component dependencies
- `--blockedBy <list>` - Update task dependencies
- `--acceptance <list>` - Update acceptance criteria
- `--effort <size>` - Update estimated effort
- `--notes <text>` - Update implementation notes
- `--done` - Mark as completed
- `--notDone` - Mark as not completed
- `--ready` - Mark as ready
- `--notReady` - Mark as not ready

**Examples:**
```bash
# Mark as done
node plugin/scripts/task-manager.js myapp frontend update fe-0001 --done

# Update dependencies
node plugin/scripts/task-manager.js myapp frontend update fe-0002 --blockedBy fe-0001,fe-0003

# Mark as not ready
node plugin/scripts/task-manager.js myapp frontend update fe-0002 --notReady
```

### list

List tasks with optional filtering.

```bash
task-manager.js [plan] [platform] list [filters]
```

**Filters:**
- `--critical` - Show only critical tasks
- `--high` - Show only high priority tasks
- `--medium` - Show only medium priority tasks
- `--low` - Show only low priority tasks
- `--done` - Show only completed tasks
- `--pending` - Show only pending tasks
- `--ready` - Show only ready tasks
- `--notReady` - Show only not-ready tasks
- `--foundation` - Show only tasks with no dependencies

**Examples:**
```bash
# List all foundation tasks
node plugin/scripts/task-manager.js myapp frontend list --foundation

# List high priority tasks
node plugin/scripts/task-manager.js myapp frontend list --high

# List pending critical tasks
node plugin/scripts/task-manager.js myapp backend list --critical --pending
```

### detail

Show detailed information about a task.

```bash
task-manager.js [plan] [platform] detail [taskId]
```

**Example:**
```bash
node plugin/scripts/task-manager.js myapp frontend detail fe-0001
```

### chain

Show the dependency chain for a task.

```bash
task-manager.js [plan] [platform] chain [taskId]
```

**Example:**
```bash
node plugin/scripts/task-manager.js myapp frontend chain fe-0003
```

Output shows:
- Direct dependencies (must complete first)
- Transitive dependencies (dependencies of dependencies)
- Dependents (tasks that depend on this one)
- Full dependency chain

### remove

Delete a task.

```bash
task-manager.js [plan] [platform] remove [taskId]
```

**Example:**
```bash
node plugin/scripts/task-manager.js myapp frontend remove fe-0001
```

**Warning:** Will show dependents before deleting.

### status

Show the progress dashboard with visual statistics.

```bash
task-manager.js [plan] [platform] status
```

**Example:**
```bash
node plugin/scripts/task-manager.js myapp frontend status
```

### validate

Check for circular dependencies and other conflicts.

```bash
task-manager.js [plan] [platform] validate
```

**Example:**
```bash
node plugin/scripts/task-manager.js myapp frontend validate
```

**Checks:**
- Circular dependencies (errors)
- Invalid task references (warnings)

### template

List available task templates.

```bash
task-manager.js [plan] [platform] template list
```

**Available Templates:**

| Template | Description | Level |
|----------|-------------|-------|
| `component` | UI Component (atoms, molecules, organisms) | high |
| `service` | Business logic service | high |
| `hook` | Custom React hook | medium |
| `page` | Page/screen component | high |
| `test` | Test suite for existing component | medium |
| `repository` | Data repository (backend) | high |
| `controller` | API controller/handler (backend) | high |
| `migration` | Database migration | critical |
| `middleware` | Middleware component | medium |
| `di-registration` | Dependency injection registration | medium |

## Task File Location

Tasks are automatically stored at:
```
.pland/[plan-name]/[platform]-tasks.jsonl
```

Examples:
- Frontend: `.pland/myapp/frontend-tasks.jsonl`
- Backend: `.pland/myapp/backend-tasks.jsonl`

## Task Schema

```typescript
{
  // Required
  id: string;              // Task ID (auto-generated: fe-0001, be-0001)
  name: string;            // Task name
  level: 'critical' | 'high' | 'medium' | 'low';
  component: string;       // Component/service name

  // Optional
  files: string;           // File paths
  testsSuccess: string[];  // Test success criteria
  dependencies: string[];  // Component dependencies (documentation)
  blockedBy: string[];     // Task IDs this depends on (direct)
  blockedByTransitive: string[];  // Auto-calculated
  dependencyChain: string[];      // Auto-calculated
  blocks: string[];        // Auto-calculated
  acceptanceCriteria: string[];
  estimatedEffort: 'S' | 'M' | 'L';
  implementationNotes: string;
  done: boolean;
  ready: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Dependency Resolution

You only specify `blockedBy` - the CLI calculates the rest:

```bash
# Task A has no dependencies
node plugin/scripts/task-manager.js myapp frontend create \
  --name "Task A" --component A

# Task B depends on A
node plugin/scripts/task-manager.js myapp frontend create \
  --name "Task B" --component B --blockedBy fe-0001

# Task C depends on B
node plugin/scripts/task-manager.js myapp frontend create \
  --name "Task C" --component C --blockedBy fe-0002

# Task C automatically gets:
# - blockedByTransitive: ["fe-0001"]
# - dependencyChain: ["C → fe-0002", "C → fe-0002 → fe-0001"]
```

## Examples by Platform

### Frontend (React/Next.js)

```bash
# Initialize
node plugin/scripts/task-manager.js myapp frontend init --framework react

# Create components
node plugin/scripts/task-manager.js myapp frontend create --template component --ComponentName Button --ext tsx
node plugin/scripts/task-manager.js myapp frontend create --template component --ComponentName Form --ext tsx --blockedBy fe-0001
node plugin/scripts/task-manager.js myapp frontend create --template page --PageName HomePage --ext tsx --blockedBy fe-0002

# Show progress
node plugin/scripts/task-manager.js myapp frontend status
```

### Frontend (Flutter)

```bash
# Initialize
node plugin/scripts/task-manager.js myapp frontend init --framework flutter

# Create widgets
node plugin/scripts/task-manager.js myapp frontend create --name "Create ProductCard Widget" --component ProductCard --files "lib/widgets/product_card.dart" --level high

# Show foundation tasks
node plugin/scripts/task-manager.js myapp frontend list --foundation
```

### Backend (Node.js + Express/Fastify)

```bash
# Initialize
node plugin/scripts/task-manager.js myapp backend init --framework express

# Create repository
node plugin/scripts/task-manager.js myapp backend create --template repository --Entity Product --ext ts

# Create service (depends on repository)
node plugin/scripts/task-manager.js myapp backend create --template service --ServiceName ProductService --category products --ext ts --blockedBy be-0001

# Create controller (depends on service)
node plugin/scripts/task-manager.js myapp backend create --template controller --Entity Product --ext ts --blockedBy be-0002

# Show status
node plugin/scripts/task-manager.js myapp backend status
```

### Backend (Python + FastAPI)

```bash
# Initialize
node plugin/scripts/task-manager.js myapp backend init --framework fastapi

# Create repository
node plugin/scripts/task-manager.js myapp backend create --template repository --Entity Product --ext py

# Create service
node plugin/scripts/task-manager.js myapp backend create --template service --ServiceName ProductService --category products --ext py --blockedBy be-0001

# Create migration
node plugin/scripts/task-manager.js myapp backend create --template migration --Entity products --ext py --level critical
```

## Best Practices

1. **Use templates when possible** - Ensures consistent task structure
2. **Start with foundation tasks** - Use `--foundation` filter
3. **Validate after creating** - Run `validate` to catch dependency issues
4. **Mark tasks done promptly** - Keeps progress dashboard accurate
5. **Use specific dependencies** - Only specify direct `blockedBy` relationships

## Progress Dashboard

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
