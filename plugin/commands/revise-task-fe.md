---
description: Regenerate frontend task lists after revising a plan with /revise-planning
argument-hint: [feature-topic]
allowed-tools: ["AskUserQuestion", "Read", "Write", "Glob", "Grep"]
---

# /revise-task-fe

Regenerate frontend task lists after revising a plan with `/revise-planning`. This command removes existing task files and generates fresh task lists from the revised plan files.

## When to Use

Use this command when:
- You have run `/revise-planning` to update an existing plan
- You previously generated frontend task lists with `/task-fe`
- You need to update task lists to reflect the revised plan
- Features, architecture, or testing scenarios have changed

## Workflow

### 1. Locate Plan and Task Files

**Ask the user:**
- Which feature-topic plan to regenerate tasks for?

**Identify files:**
```bash
# Read revised plan files
Read .pland/[feature-topic]/features.mdx
Read .pland/[feature-topic]/frontend-architecture.mdx

# Check if task files exist
Glob ".pland/[feature-topic]/frontend-tasks.*"
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
# Delete existing frontend task files
Bash: rm -f .pland/[feature-topic]/frontend-tasks.mdx
Bash: rm -f .pland/[feature-topic]/frontend-tasks.yaml
```

### 4. Generate New Task Lists

Follow the same workflow as `/task-fe`:

**Parse features from features.mdx:**
- Extract all feature definitions
- Identify frontend responsibilities for each feature
- Note feature dependencies mentioned in descriptions

**Parse components from frontend-architecture.mdx:**
- Extract component/view/widget structure
- Identify reusable components vs feature-specific components
- Note component relationships and hierarchy

**Auto-detect dependencies:**
- Scan feature descriptions for dependency keywords (requires, depends on, after, needs)
- Parse component hierarchy to identify composition dependencies
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
- Assign task IDs: fe-001, fe-002, fe-003, etc.
- Set priority: High (foundation), Medium (core features), Low (nice-to-have)
- Calculate dependencies for each task
- Organize by priority (High → Medium → Low)

### 5. Write Output Files

Create the task list files:

**frontend-tasks.yaml** (token-efficient):
```yaml
tasks:
  - id: fe-001
    title: Setup Navigation & Routing
    priority: High
    status: pending
    description: Set up app navigation structure and routing
    dependencies: []
    dependencyChain: []
    blockedBy: []
    blockedByTransitive: []
    blocks: [fe-003, fe-005]
  - id: fe-002
    title: Create ProductCard Component
    priority: High
    description: Reusable product card component with image, title, price
    dependencies: []
    dependencyChain: []
    blockedBy: []
    blockedByTransitive: []
    blocks: [fe-003]
  # ... more tasks

dependencySummary:
  foundation:
    - fe-001
    - fe-002
  blocked:
    - id: fe-003
      blockedBy: [fe-001, fe-002]
      blockedByTransitive: []
    - id: fe-005
      blockedBy: [fe-001]
      blockedByTransitive: []
```

**frontend-tasks.mdx** (human-readable):
```markdown
# Frontend Task List

## Overview
This document contains the organized task list for frontend implementation.

## Tasks

### High Priority

#### fe-001: Setup Navigation & Routing
**Status:** pending
**Priority:** High
**Dependencies:** None

**Description:** Set up app navigation structure and routing

**Dependency Analysis:**
- Foundation task (no dependencies)
- Blocks: fe-003, fe-005

---

#### fe-002: Create ProductCard Component
**Status:** pending
**Priority:** High
**Dependencies:** None

**Description:** Reusable product card component with image, title, price

**Dependency Analysis:**
- Foundation task (no dependencies)
- Blocks: fe-003

---

### Medium Priority

#### fe-003: Build ProductList Screen
**Status:** pending
**Priority:** Medium
**Dependencies:** fe-001, fe-002

**Description:** Product listing screen with grid of ProductCard components

**Dependency Analysis:**
- Blocked by: fe-001 (Setup Navigation & Routing)
- Blocked by: fe-002 (Create ProductCard Component)
- Dependency chain: ProductList → ProductCard, Navigation

---

## Dependency Summary

### Foundation Tasks
Tasks with no dependencies that should be completed first:
- fe-001: Setup Navigation & Routing
- fe-002: Create ProductCard Component

### Blocked Tasks
Tasks that depend on other tasks:
- **fe-003** (ProductList Screen)
  - Direct dependencies: fe-001, fe-002
  - Transitive dependencies: None
```

### 6. Summary

Report to user:
- Number of tasks generated
- Number of foundation tasks vs blocked tasks
- Any dependency cycles detected and resolved
- Output file locations

## Usage Examples

```bash
/revise-task-fe user-authentication
```

This regenerates frontend task lists for the `user-authentication` plan.

## Related Commands

- `/task-fe` - Generate frontend task lists from plans (initial creation)
- `/revise-task-be` - Regenerate backend task lists
- `/revise-planning` - Revise plan before regenerating tasks
- `/execute-fe` - Implement frontend using task lists

## Notes

- This command removes existing task files and regenerates from scratch
- All task IDs, priorities, and dependencies are recalculated
- Use this after `/revise-planning` to keep tasks in sync with the plan
- Dependencies are auto-detected from plan file content
- Circular dependencies are rejected and must be resolved manually
