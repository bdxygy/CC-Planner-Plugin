---
description: Regenerate backend task lists after revising a plan with /revise-plan
argument-hint: [feature-topic]
allowed-tools: ["AskUserQuestion", "Read", "Write", "Glob", "Grep"]
---

# /revise-task-be

Regenerate backend task lists after revising a plan with `/revise-plan`. This command removes existing task files and generates fresh task lists from the revised plan files.

## When to Use

Use this command when:
- You have run `/revise-plan` to update an existing plan
- You previously generated backend task lists with `/task-be`
- You need to update task lists to reflect the revised plan
- Features, architecture, or testing cases have changed

## Workflow

### 1. Locate Plan and Task Files

**Ask the user:**
- Which feature-topic plan to regenerate tasks for?

**Identify files:**
```bash
# Read revised plan files
Read .pland/[feature-topic]/features.mdx
Read .pland/[feature-topic]/backend-architecture.mdx

# Check if task files exist
Glob ".pland/[feature-topic]/backend-tasks.*"
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
Bash: rm -f .pland/[feature-topic]/backend-tasks.mdx
Bash: rm -f .pland/[feature-topic]/backend-tasks.yaml
```

### 4. Generate New Task Lists

Follow the same workflow as `/task-be`:

**Parse features from features.mdx:**
- Extract all feature definitions
- Identify backend responsibilities for each feature (services, repositories, endpoints)
- Note feature dependencies mentioned in descriptions

**Parse modules from backend-architecture.mdx:**
- Extract service/repository layer structure
- Identify endpoint definitions and contracts
- Note module relationships and data flow

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
- Use this after `/revise-plan` to keep tasks in sync with the plan
- Dependencies are auto-detected from plan file content
- Circular dependencies are rejected and must be resolved manually
