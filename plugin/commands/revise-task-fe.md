---
description: Regenerate frontend task lists after revising a plan with /revise-planning
argument-hint: [plan-name]
allowed-tools: ["AskUserQuestion", "Read", "Write", "Glob", "Grep", "TodoWrite", "Bash", "mcp__plugin_context7_context7__resolve-library-id", "mcp__plugin_context7_context7__query-docs", "mcp__exa__get_code_context_exa", "mcp__exa__web_search_exa"]
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
- Which plan-name plan to regenerate tasks for?

**Identify and read all relevant plan files:**
```bash
# Read all frontend plan files (same files affected by /revise-planning)
Read .pland/[plan-name]/features.mdx
Read .pland/[plan-name]/frontend-architecture.mdx
Read .pland/[plan-name]/frontend-testing-scenarios.mdx

# Check if project-context exists and read it
Glob ".pland/[plan-name]/project-context.mdx"
# If exists: Read .pland/[plan-name]/project-context.mdx

# Check if task files exist
Glob ".pland/[plan-name]/frontend-tasks.*"
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
Bash: rm -f .pland/[plan-name]/frontend-tasks.mdx
Bash: rm -f .pland/[plan-name]/frontend-tasks.yaml
```

### 4. Generate New Task Lists

Follow the same workflow as `/task-fe`, reading from all plan files:

**Parse features from features.mdx:**
- Extract all feature definitions
- Identify frontend responsibilities for each feature
- Note feature dependencies mentioned in descriptions

**Parse components from frontend-architecture.mdx:**
- Extract component/view/widget structure
- Identify reusable components vs feature-specific components
- Note component relationships and hierarchy

**Parse test scenarios from frontend-testing-scenarios.mdx:**
- Extract testing requirements for each feature
- Identify UI components that need testing
- Note test-specific dependencies (e.g., components needed for test scenarios)

**Parse tech stack from project-context.mdx (if exists):**
- Extract frontend framework and libraries
- Note platform-specific requirements
- Consider tech stack when estimating task complexity

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
- Reads from: features.mdx, frontend-architecture.mdx, frontend-testing-scenarios.mdx, project-context.mdx (if exists)
- Dependencies are auto-detected from all plan file content
- Circular dependencies are rejected and must be resolved manually
