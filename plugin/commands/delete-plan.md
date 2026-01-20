---
description: Delete a project plan directory and all its files
argument-hint: [plan-name]
allowed-tools: ["AskUserQuestion", "Glob", "Bash"]
---

# /delete-plan

Delete a project plan directory and all its files from the `.pland/` folder. This is a destructive operation that cannot be undone unless you have version control.

## When to Use

Use this command when:
- A plan is no longer needed
- You want to clean up abandoned projects
- A plan was created incorrectly and needs to be removed
- You're consolidating multiple plans

## Workflow

### 1. List Available Plans

First, show the user what plans exist:

```bash
# Find all plan directories
Glob ".pland/*/project-context.mdx"
```

Display the list with plan names and brief descriptions.

### 2. Select Plan to Delete

**Ask the user:**
- Which plan do you want to delete?

### 3. Confirm Deletion

**Before deleting, confirm with the user:**

Show what will be deleted:
```
You are about to delete: [plan-name]

This will remove:
- .pland/[plan-name]/project-context.mdx
- .pland/[plan-name]/features.mdx
- .pland/[plan-name]/frontend-architecture.mdx
- .pland/[plan-name]/backend-architecture.mdx
- .pland/[plan-name]/frontend-testing-scenarios.mdx
- .pland/[plan-name]/backend-testing-cases.mdx
- .pland/[plan-name]/frontend-tasks.mdx (if exists)
- .pland/[plan-name]/frontend-tasks.yaml (if exists)
- .pland/[plan-name]/backend-tasks.mdx (if exists)
- .pland/[plan-name]/backend-tasks.yaml (if exists)

This action CANNOT be undone unless you have git history.
```

**Use AskUserQuestion to confirm:**
- "Are you sure you want to delete this plan?"
- Options: "Yes, delete it", "No, cancel"

### 4. Delete the Plan Directory

If user confirms, remove the entire directory:

```bash
# Remove the entire plan directory
Bash: rm -rf .pland/[plan-name]
```

### 5. Verify Deletion

Confirm the directory was removed:

```bash
# Verify directory no longer exists
Glob ".pland/[plan-name]/*"
```

Report success to user:
```
✅ Successfully deleted plan: [plan-name]

Remaining plans: [count] plans
- [plan-1]
- [plan-2]
...
```

## Safety Checks

**Before deletion, check:**
- [ ] Plan directory exists
- [ ] User has confirmed deletion
- [ ] No important changes are unsaved (warn if files are modified but not committed)

**Warnings to show:**
- If the plan has task files: "This plan has generated task lists that will be deleted"
- If git tracking: "Consider using git to preserve history instead of deleting"

## Example Usage

```bash
/delete-plan user-authentication
```

This would:
1. Show the user what will be deleted
2. Ask for confirmation
3. Delete `.pland/user-authentication/` directory
4. Confirm deletion was successful

## Output

**Success:**
```
✅ Plan deleted: user-authentication

Removed 8 files:
- project-context.mdx
- features.mdx
- frontend-architecture.mdx
- backend-architecture.mdx
- frontend-testing-scenarios.mdx
- backend-testing-cases.mdx
- frontend-tasks.yaml
- backend-tasks.yaml
```

**Cancelled:**
```
❌ Deletion cancelled
Plan user-authentication was not deleted
```

## Related Commands

- `/list-plans` - Show all available plans before deletion
- `/planning` - Create a new plan
- `/validate-plan` - Check plan quality before deciding to delete

## Notes

- This is a destructive operation that cannot be undone
- Use `git` to preserve history if you might need the plan later
- Deleted plans are gone forever unless you have backups
- Consider using `/revise-planning` to modify a plan instead of deleting it
