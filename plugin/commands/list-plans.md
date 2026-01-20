---
description: List all available project plans in the .pland directory
allowed-tools: ["Glob", "Read", "Grep"]
---

# /list-plans

List all available project plans stored in the `.pland/` directory. Displays plan names, status, and key information.

## When to Use

Use this command when:
- You want to see all existing plans
- You need to find a specific plan name
- You want to check plan completeness
- You're managing multiple projects

## Workflow

### 1. Scan for Plans

Use Glob to find all plan directories:

```bash
# Find all plan directories by looking for project-context.mdx
Glob ".pland/*/project-context.mdx"
```

### 2. Extract Plan Information

For each plan found, extract key information:

**Read project-context.mdx to get:**
- Plan name (from directory name)
- Project overview/goals
- Technology stack
- Creation date (from file metadata if available)

**Check plan completeness:**
```bash
# Required files
Glob ".pland/[plan-name]/features.mdx"
Glob ".pland/[plan-name]/frontend-architecture.mdx"
Glob ".pland/[plan-name]/backend-architecture.mdx"
Glob ".pland/[plan-name]/frontend-testing-scenarios.mdx"
Glob ".pland/[plan-name]/backend-testing-cases.mdx"

# Optional task files
Glob ".pland/[plan-name]/frontend-tasks.yaml"
Glob ".pland/[plan-name]/backend-tasks.yaml"
```

### 3. Display Plan Summary

Present the information in a clear, organized format:

```markdown
# Available Plans

## [plan-name]
**Status:** Complete / Incomplete
**Overview:** [Brief description from project-context]
**Tech Stack:** [Key technologies]
**Files:** 6/6 required files + 2 task files
**Last Modified:** [Date from file metadata]

---

## [another-plan]
**Status:** Incomplete (missing backend-testing-cases.mdx)
**Overview:** [Brief description]
**Tech Stack:** [Key technologies]
**Files:** 5/6 required files
**Last Modified:** [Date]
```

### 4. Quick Actions

After displaying the list, offer quick actions:

- Use `/planning [plan-name]` to create a new plan
- Use `/revise-planning [plan-name]` to edit an existing plan
- Use `/validate-plan [plan-name]` to check plan quality
- Use `/delete-plan [plan-name]` to delete a plan
- Use `/task-fe [plan-name]` to generate frontend tasks
- Use `/task-be [plan-name]` to generate backend tasks

## Output Format

**Summary View:**
```
Found 3 plans:

1. user-authentication - Complete (React 18, Hono v3)
2. e-commerce-checkout - Incomplete (missing backend-testing-cases.mdx)
3. mobile-dashboard - Complete (Flutter, Firebase)
```

**Detailed View:** (use /list-plans --detail or ask for details)
```
[user-authentication]
Location: .pland/user-authentication/
Status: Complete
Overview: User authentication system with JWT tokens
Tech Stack: React 18, Hono v3, Bun, PostgreSQL
Required Files: 6/6 ✓
Task Files: 2/2 ✓
Last Modified: 2025-01-15
```

## Related Commands

- `/planning` - Create a new plan
- `/delete-plan` - Delete an existing plan
- `/validate-plan` - Check plan quality
- `/revise-planning` - Edit an existing plan

## Notes

- Plans are stored in `.pland/[plan-name]/` directories
- project-context.mdx is required for a plan to be listed
- Incomplete plans show which required files are missing
- Task files are optional but recommended for implementation
