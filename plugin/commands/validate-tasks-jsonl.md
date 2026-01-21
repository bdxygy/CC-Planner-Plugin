---
description: Validate JSONL task structure for consistency and correctness. Checks format, required fields, and dependency integrity.
argument-hint: [plan-name] [platform]
allowed-tools: ['Read', 'Bash', 'Glob']
---

# /validate-tasks-jsonl

Validate JSONL task structure for a specific plan and platform. Checks file format integrity, validates all required fields, verifies dependency chains, and reports any structural issues.

## When to Use

Use this command when:

- You want to verify task file integrity before execution
- Tasks have been manually edited and need validation
- You're debugging task dependency issues
- You want to ensure task data consistency
- You need a pre-execution health check

## Validation Scope

### Format Validation

- ✓ File exists and is readable
- ✓ Valid JSONL format (one valid JSON object per line)
- ✓ No malformed JSON entries
- ✓ Proper line endings

### Structure Validation

Verifies each task object contains required fields:

- `id` - Unique task identifier (format: `[fe|be]-[name]-###`)
- `name` - Task name (non-empty string)
- `level` - Priority level (`critical`, `high`, `medium`, `low`)
- `component` - Component/module identifier
- `files` - File references (string)
- `testsSuccess` - Array of test names
- `dependencies` - Array of task IDs
- `blockedBy` - Array of blocking task IDs
- `acceptanceCriteria` - Array of criteria
- `estimatedEffort` - Effort size (`S`, `M`, `L`, `XL`)
- `implementationNotes` - Implementation details
- `done` - Completion status (boolean)
- `ready` - Ready for work (boolean)
- `createdAt` - ISO timestamp
- `updatedAt` - ISO timestamp

### Dependency Validation

- ✓ All referenced dependencies exist
- ✓ No circular dependencies
- ✓ `blockedBy` task IDs are valid
- ✓ No self-referencing tasks
- ✓ Transitive dependencies resolve correctly

### Data Validation

- ✓ Task IDs follow platform convention (`fe-*` or `be-*`)
- ✓ Priorities are valid enum values
- ✓ Effort sizes are valid enum values
- ✓ Timestamps are ISO 8601 format
- ✓ Arrays are properly formatted
- ✓ No duplicate task IDs

## Quick Start

### Basic Validation

```bash
# Validate frontend tasks for myapp
/validate-tasks-jsonl myapp frontend

# Validate backend tasks for myapp
/validate-tasks-jsonl myapp backend
```

### What Gets Checked

Running validation will check:

1. **File existence** - Task file at `.pland/[plan-name]/[platform]-tasks.jsonl`
2. **Format integrity** - Valid JSONL structure
3. **Field completeness** - All required fields present
4. **Field types** - Correct data types for each field
5. **Enum validation** - Valid priority/effort/status values
6. **Dependency integrity** - All referenced tasks exist
7. **Circular dependencies** - No circular dependency chains
8. **Data consistency** - No conflicting or invalid data

## Report Output

### Success Report

```markdown
✓ Validation Passed

File: .pland/myapp/frontend-tasks.jsonl
Platform: frontend
Total Tasks: 24

Format: Valid JSONL (24 entries)
Structure: All fields present and valid
Dependencies: No circular dependencies
References: All task IDs valid

Summary:
- By Priority: Critical (3) | High (8) | Medium (9) | Low (4)
- By Status: Done (5) | Ready (12) | Pending (7)
- By Effort: S (4) | M (12) | L (6) | XL (2)
```

### Error Report

```markdown
✗ Validation Failed

File: .pland/myapp/frontend-tasks.jsonl
Platform: frontend

Issues Found:

1. Invalid JSON Format
   Line 5: Malformed JSON object
   Details: Unexpected token } at position 142

2. Missing Required Fields
   Task fe-button-001: Missing 'level' field
   Task fe-modal-002: Missing 'createdAt' field

3. Invalid Field Values
   Task fe-header-001: Invalid priority 'urgent' (valid: critical, high, medium, low)
   Task fe-nav-002: Invalid effort 'XXL' (valid: S, M, L, XL)

4. Dependency Issues
   Task fe-form-003: References non-existent task fe-input-999
   Task fe-auth-004: Circular dependency - fe-login-005 → fe-auth-004
   Task fe-dashboard-006: Self-referencing dependency

5. Data Inconsistencies
   Task fe-state-007: createdAt (2024-01-15) is after updatedAt (2024-01-10)
   Task fe-utils-008: No timestamp (missing createdAt/updatedAt)
```

## Validation Details

### File Format

Each line must be valid JSON:

```jsonl
{"id":"fe-button-001","name":"Button Component","level":"high",...}
{"id":"fe-modal-002","name":"Modal Component","level":"medium",...}
```

Invalid formats:

```jsonl
{invalid json}
{"id":"fe-broken-001"
// This is a comment and will fail
{"id":"fe-text-001",}  // Trailing comma
```

### Required Fields

All tasks must include:

- **id**: Unique identifier matching pattern `^[fe|be]-[a-z0-9-]+-\d{3}$`
- **name**: Non-empty string
- **level**: One of `critical`, `high`, `medium`, `low`
- **component**: Non-empty string
- **files**: String (can be empty)
- **testsSuccess**: Array of strings
- **dependencies**: Array of task IDs
- **blockedBy**: Array of task IDs
- **acceptanceCriteria**: Array of strings
- **estimatedEffort**: One of `S`, `M`, `L`, `XL`
- **implementationNotes**: String (can be empty)
- **done**: Boolean
- **ready**: Boolean
- **createdAt**: ISO 8601 datetime string
- **updatedAt**: ISO 8601 datetime string

### Dependency Chain Rules

Validation checks:

1. **Existence**: All task IDs in `dependencies` and `blockedBy` exist
2. **No Cycles**: No circular dependency chains (A → B → C → A)
3. **No Self-Refs**: Tasks cannot block themselves
4. **Transitive**: All transitive dependencies are valid
5. **Consistency**: `blockedBy` A means `dependencies` B contains A

### Timestamp Validation

- `createdAt` must be valid ISO 8601 datetime
- `updatedAt` must be valid ISO 8601 datetime
- `createdAt` must be ≤ `updatedAt`
- Both must be within reasonable range (not too far in future)

## Command Execution

The validation process:

1. Check task file exists at `.pland/[plan-name]/[platform]-tasks.jsonl`
2. Read entire file
3. Parse each line as JSON
4. Validate structure of each task object
5. Collect all task IDs
6. Validate all dependency references
7. Check for circular dependencies
8. Verify data consistency
9. Generate report with findings

## Output Summary

### Pass Indicators

- ✓ No errors found
- ✓ All required fields present
- ✓ All field values valid
- ✓ All dependencies exist
- ✓ No circular dependencies
- ✓ Data is consistent

### Fail Indicators

- ✗ Format errors in JSONL
- ✗ Missing required fields
- ✗ Invalid field values
- ✗ Invalid or missing task references
- ✗ Circular dependency detected
- ✗ Data consistency issues

## Related Commands

- `/task-fe [plan-name]` - Generate frontend task list
- `/task-be [plan-name]` - Generate backend task list
- `/execute-fe [plan-name]` - Execute frontend tasks (after validation)
- `/execute-be [plan-name]` - Execute backend tasks (after validation)
- `/list-plans` - List all available plans

## Notes

- Validation is read-only and doesn't modify task files
- All issues are reported with location (task ID, line number)
- Warnings are shown but don't fail validation
- Use before running `/execute-fe` or `/execute-be`
- Validation ensures task runner can process tasks without errors
