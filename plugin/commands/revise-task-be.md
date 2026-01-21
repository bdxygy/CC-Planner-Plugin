---
description: Regenerate backend task lists after revising a plan with /revise-planning
argument-hint: [plan-name]
allowed-tools:
  [
    'AskUserQuestion',
    'Read',
    'Write',
    'Glob',
    'Grep',
    'TodoWrite',
    'Bash',
    'mcp__plugin_context7_context7__resolve-library-id',
    'mcp__plugin_context7_context7__query-docs',
    'mcp__exa__get_code_context_exa',
    'mcp__exa__web_search_exa',
  ]
---

# /revise-task-be

Regenerate backend task lists after revising a plan with `/revise-planning`. This command removes existing task files and generates fresh task lists from the revised plan files.

## When to Use

Use this command when:

- You have run `/revise-planning` to update an existing plan
- You previously generated backend task lists with `/task-be`
- You need to update task lists to reflect the revised plan
- Features, architecture, or testing cases have changed

## Workflow

### 1. Locate Plan and Task Files

**Ask the user:**

- Which plan-name plan to regenerate tasks for?

**Identify and read all relevant plan files:**

```bash
# Read all backend plan files (same files affected by /revise-planning)
Read .pland/[plan-name]/features.mdx
Read .pland/[plan-name]/backend-architecture.mdx
Read .pland/[plan-name]/backend-testing-cases.mdx

# Check if project-context exists and read it
Glob ".pland/[plan-name]/project-context.mdx"
# If exists: Read .pland/[plan-name]/project-context.mdx

# Check if task files exist
Glob ".pland/[plan-name]/backend-tasks.*"
```

### 2. Confirm Regeneration

**Before proceeding, confirm with user:**

- Existing task files will be deleted
- New task files will be generated from the revised plan
- All task IDs, priorities, and dependencies will be recalculated

**If user confirms, proceed to step 3**

### 3. Delete Existing Task Files

Remove the old task files:

```bash
# Delete existing backend task files
Bash: rm -f .pland/[plan-name]/backend-tasks.mdx
Bash: rm -f .pland/[plan-name]/backend-tasks.yaml
```

### 4. Generate New Task Lists

Follow the same workflow as `/task-be`, reading from all plan files:

**Parse features from features.mdx:**

- Extract all feature definitions
- Identify backend responsibilities for each feature (services, repositories, endpoints)
- Note feature dependencies mentioned in descriptions

**Parse modules from backend-architecture.mdx:**

- Extract service/repository layer structure
- Identify endpoint definitions and contracts
- Note module relationships and data flow

**Parse test cases from backend-testing-cases.mdx:**

- Extract testing requirements for each feature
- Identify business logic that needs unit tests
- Note test-specific dependencies (e.g., services needed for test cases)

**Parse tech stack from project-context.mdx (if exists):**

- Extract backend framework, runtime, and libraries
- Note platform-specific requirements
- Consider tech stack when estimating task complexity

**Auto-detect dependencies:**

- Scan feature descriptions for dependency keywords (requires, depends on, after, needs)
- Parse endpoint dependencies (e.g., endpoints that depend on shared services)
- Build dependency graph from identified relationships

**Check for circular dependencies:**

- Run DFS-based cycle detection on dependency graph
- If cycles found, reject and report to user for resolution
- Only proceed if dependency graph is acyclic

**Calculate transitive dependencies:**

- For each task, compute full dependency chain
- Calculate `blockedByTransitive` (all ancestors)
- Calculate `blocks` (all dependents)

**Generate task list:**

- Assign task IDs: be-001, be-002, be-003, etc.
- Set priority: High (data models, core services), Medium (endpoints), Low (nice-to-have)
- Calculate dependencies for each task
- Organize by priority (High → Medium → Low)

### 5. Write Output Files

Create the task list files:

**backend-tasks.yaml** (token-efficient):

```yaml
tasks:
  - id: be-001
    title: Define Product Data Model
    priority: High
    status: pending
    description: Define Product entity with properties and validation
    dependencies: []
    dependencyChain: []
    blockedBy: []
    blockedByTransitive: []
    blocks: [be-002, be-003]
  - id: be-002
    title: Implement ProductRepository Interface
    priority: High
    description: Repository interface for Product data access operations
    dependencies: [be-001]
    dependencyChain:
      - ProductRepository → Product
    blockedBy: [be-001]
    blockedByTransitive: []
    blocks: [be-003]
  # ... more tasks

dependencySummary:
  foundation:
    - be-001
  blocked:
    - id: be-002
      blockedBy: [be-001]
      blockedByTransitive: []
    - id: be-003
      blockedBy: [be-001, be-002]
      blockedByTransitive: [be-001]
```

**backend-tasks.mdx** (human-readable):

```markdown
# Backend Task List

## Overview

This document contains the organized task list for backend implementation.

## Tasks

### High Priority

#### be-001: Define Product Data Model

**Status:** pending
**Priority:** High
**Dependencies:** None

**Description:** Define Product entity with properties and validation

**Dependency Analysis:**

- Foundation task (no dependencies)
- Blocks: be-002, be-003

---

#### be-002: Implement ProductRepository Interface

**Status:** pending
**Priority:** High
**Dependencies:** be-001

**Description:** Repository interface for Product data access operations

**Dependency Analysis:**

- Blocked by: be-001 (Define Product Data Model)
- Dependency chain: ProductRepository → Product
- Blocks: be-003

---

### Medium Priority

#### be-003: Implement ProductService

**Status:** pending
**Priority:** Medium
**Dependencies:** be-001, be-002

**Description:** Service layer for product business logic

**Dependency Analysis:**

- Blocked by: be-001 (Define Product Data Model)
- Blocked by: be-002 (Implement ProductRepository Interface)
- Dependency chain: ProductService → ProductRepository → Product

---

## Dependency Summary

### Foundation Tasks

Tasks with no dependencies that should be completed first:

- be-001: Define Product Data Model

### Blocked Tasks

Tasks that depend on other tasks:

- **be-002** (ProductRepository Interface)
  - Direct dependencies: be-001
  - Transitive dependencies: None
- **be-003** (ProductService)
  - Direct dependencies: be-001, be-002
  - Transitive dependencies: be-001
```

### 6. Summary

Report to user:

- Number of tasks generated
- Number of foundation tasks vs blocked tasks
- Any dependency cycles detected and resolved
- Output file locations

## Usage Examples

```bash
/revise-task-be user-authentication
```

This regenerates backend task lists for the `user-authentication` plan.

## Related Commands

- `/task-be` - Generate backend task lists from plans (initial creation)
- `/revise-task-fe` - Regenerate frontend task lists
- `/revise-planning` - Revise plan before regenerating tasks
- `/execute-be` - Implement backend using task lists

## Notes

- This command removes existing task files and regenerates from scratch
- All task IDs, priorities, and dependencies are recalculated
- Use this after `/revise-planning` to keep tasks in sync with the plan
- Reads from: features.mdx, backend-architecture.mdx, backend-testing-cases.mdx, project-context.mdx (if exists)
- Dependencies are auto-detected from all plan file content
- Circular dependencies are rejected and must be resolved manually
