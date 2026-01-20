---
description: Edit specific sections of an existing project plan with intelligent cross-file propagation
argument-hint: [plan-name] [section]
allowed-tools: ["AskUserQuestion", "Read", "Write", "Glob", "Grep", "mcp__plugin_context7_context7__resolve-library-id", "mcp__plugin_context7_context7__query-docs", "mcp__exa__get_code_context_exa", "mcp__exa__web_search_exa", "mcp__exa__deep_researcher_start", "mcp__exa__deep_researcher_check"]
---

# /revise-planning

Edit specific sections of an existing project plan with **intelligent cross-file propagation**. When you revise frontend or backend components, related files are automatically included to maintain consistency.

## When to Use

Use this command when:
- A specific section of a plan needs updating
- Requirements have changed for a planned feature
- Architecture decisions need revision
- Testing scenarios need expansion

## Intelligent File Grouping

The command automatically groups related files based on revision scope:

**Frontend revisions affect:**
- `features.mdx` (feature responsibilities)
- `frontend-architecture.mdx` (components, state, APIs)
- `frontend-testing-scenarios.mdx` (test scenarios)
- `project-context.mdx` (if it exists, for tech stack/dependencies)

**Backend revisions affect:**
- `features.mdx` (feature responsibilities)
- `backend-architecture.mdx` (modules, endpoints, contracts)
- `backend-testing-cases.mdx` (test cases)
- `project-context.mdx` (if it exists, for tech stack/dependencies)

**Standalone revisions:**
- `project-context.mdx` alone (affects both frontend and backend)

## Revision Workflow

### 1. Identify Plan and Scope

First, determine what needs to be revised:

**List available plans:**
```bash
# Use Glob to find .pland directories
Glob ".pland/**/project-context.mdx"
```

**Ask the user:**
- Which plan-name needs revision?
- Which section needs to be updated initially?

**Use AskUserQuestion to determine revision scope:**
- Is this a **frontend** change? (affects features.mdx, frontend-architecture.mdx, frontend-testing-scenarios.mdx)
- Is this a **backend** change? (affects features.mdx, backend-architecture.mdx, backend-testing-cases.mdx)
- Is this a **project context** change? (affects project-context.mdx)

### 2. Load Affected Files

Based on the revision scope, load all affected files:

**For frontend revisions:**
```bash
Read .pland/[plan-name]/features.mdx
Read .pland/[plan-name]/frontend-architecture.mdx
Read .pland/[plan-name]/frontend-testing-scenarios.mdx

# Check if project-context exists
Glob ".pland/[plan-name]/project-context.mdx"
# If exists: Read .pland/[plan-name]/project-context.mdx
# If not exists: Proceed without project-context (it's optional)
```

**For backend revisions:**
```bash
Read .pland/[plan-name]/features.mdx
Read .pland/[plan-name]/backend-architecture.mdx
Read .pland/[plan-name]/backend-testing-cases.mdx

# Check if project-context exists
Glob ".pland/[plan-name]/project-context.mdx"
# If exists: Read .pland/[plan-name]/project-context.mdx
# If not exists: Proceed without project-context (it's optional)
```

**For project-context revisions:**
```bash
# project-context must exist to revise it
Read .pland/[plan-name]/project-context.mdx
# If file doesn't exist, ask user if they want to create it
```

### 2.5. Load Project Rules (if exists)

Check for project-specific rules that will guide revisions:

```bash
# Check if rules file exists
Glob ".pland/rules.mdx"
# If exists: Read .pland/rules.mdx
```

**If rules exist, apply them during revision:**
- **Technology constraints**: Check that revisions don't introduce forbidden technologies
- **Architecture rules**: Verify changes align with specified patterns
- **Coding standards**: Ensure revisions follow naming conventions and style
- **Security requirements**: Confirm security considerations are maintained
- **Performance requirements**: Check that performance targets are still met
- **Testing standards**: Verify testing requirements are satisfied
- **Documentation rules**: Ensure documentation standards are followed

**If revisions violate rules:**
- Warn user about the violation
- Show the specific rule being violated
- Ask user if they want to:
  - Modify the revision to comply with rules
  - Update the rules to allow the revision
  - Document an exception

### 3. Understand Revision Request

Ask the user what specifically needs to change:

**Use AskUserQuestion to clarify:**
- What needs to be added?
- What needs to be removed?
- What needs to be modified?
- Is this a minor update or major revision?

**For feature changes:**
- Is this a new feature being added?
- Is an existing feature being modified?
- Should a feature be removed?

**For architecture changes:**
- Is this a pattern change (e.g., different state management)?
- Are new modules/components being added?
- Is the overall structure changing?

**For testing changes:**
- Are new scenarios needed?
- Are existing scenarios incorrect?
- Is coverage incomplete?

### 4. Apply Changes with Cross-File Propagation

Make the requested revisions and propagate changes to related files:

**For frontend revisions:**

1. **Update the primary target file** based on user request
2. **Update features.mdx** if feature responsibilities changed
3. **Update frontend-architecture.mdx** if components/state/APIs changed
4. **Update frontend-testing-scenarios.mdx** if new scenarios needed
5. **Update project-context.mdx** (if exists) if tech stack/dependencies changed

**For backend revisions:**

1. **Update the primary target file** based on user request
2. **Update features.mdx** if feature responsibilities changed
3. **Update backend-architecture.mdx** if modules/endpoints changed
4. **Update backend-testing-cases.mdx** if new test cases needed
5. **Update project-context.mdx** (if exists) if tech stack/dependencies changed

**For project-context revisions:**

1. **Update project-context.mdx** based on user request
2. **Check if tech stack changes** affect architecture files
3. **Ask user** if architecture files need updates based on context changes

### 5. Validate Consistency

After making changes, verify plan consistency:

**Cross-file checks for frontend:**
- features.mdx frontend responsibilities align with frontend-architecture.mdx
- frontend-testing-scenarios.mdx covers all features
- project-context.mdx tech stack matches frontend-architecture.mdx

**Cross-file checks for backend:**
- features.mdx backend responsibilities align with backend-architecture.mdx
- backend-testing-cases.mdx covers all features
- project-context.mdx tech stack matches backend-architecture.mdx

**Use /validate-plan** to check overall quality after major revisions.

### 6. Confirm Cross-File Updates

**Before completing, show user:**
- Primary file modified: [file]
- Related files updated for consistency:
  - [affected file 1]
  - [affected file 2]
  - [affected file 3]
- Summary of changes across all files

**Ask user to confirm** or make additional adjustments.

## Section-Specific Guidance

### Revising frontend-architecture.mdx (Primary)

**Automatically affects:**
- `features.mdx` - Update frontend responsibilities if components changed
- `frontend-testing-scenarios.mdx` - Add scenarios for new components
- `project-context.mdx` - Update if tech stack dependencies changed

**Common revisions:**
- Changing component structure
- Updating state management approach
- Modifying API interaction patterns
- Adding new error handling

### Revising backend-architecture.mdx (Primary)

**Automatically affects:**
- `features.mdx` - Update backend responsibilities if endpoints changed
- `backend-testing-cases.mdx` - Add test cases for new endpoints
- `project-context.mdx` - Update if tech stack dependencies changed

**Common revisions:**
- Adding new endpoints
- Changing validation rules
- Updating authentication/authorization
- Modifying error handling

### Revising features.mdx (Primary)

**Use AskUserQuestion to determine scope:**
- Is this a **frontend feature** change? (affects frontend files)
- Is this a **backend feature** change? (affects backend files)
- Is this **both**? (affects all files)

**If frontend feature change:**
- Update `frontend-architecture.mdx` for new components
- Update `frontend-testing-scenarios.mdx` for new scenarios

**If backend feature change:**
- Update `backend-architecture.mdx` for new endpoints
- Update `backend-testing-cases.mdx` for new test cases

**If both:**
- Update both architecture and testing files

### Revising frontend-testing-scenarios.mdx (Primary)

**Automatically affects:**
- `features.mdx` - Ensure feature list matches scenarios
- `frontend-architecture.mdx` - Ensure components match scenarios

**Common revisions:**
- Adding new test scenarios for features
- Expanding edge case coverage
- Adding new failure states

### Revising backend-testing-cases.mdx (Primary)

**Automatically affects:**
- `features.mdx` - Ensure feature list matches test cases
- `backend-architecture.mdx` - Ensure endpoints match test cases

**Common revisions:**
- Adding new test cases for endpoints
- Expanding boundary condition coverage
- Adding new failure modes

### Revising project-context.mdx (Standalone)

**Does NOT automatically affect other files** - but ask user:

**Use AskUserQuestion:**
- Did tech stack changes require architecture updates?
- Did constraint changes affect feature definitions?
- Should related files be updated?

**If user confirms:**
- Propagate changes to affected architecture files

## Interactive Best Practices

- **Read first, then ask** - understand current state before proposing changes
- **Confirm scope** - verify user's intent (frontend/backend/both)
- **Show affected files** - list all files that will be modified
- **Propagate intelligently** - update related files automatically
- **Show diff summary** - summarize what changed across all files
- **Suggest validation** - recommend running /validate-plan after changes
- **Suggest task regeneration** - recommend /revise-task-fe or /revise-task-be after plan changes
- **Use Context7** for official API documentation
- **Use Exa** for code examples and latest patterns:
  - `get_code_context_exa` - Real-world implementation examples
  - `web_search_exa` - Recent articles and best practices
  - `deep_researcher_start` - Complex research topics

## Example Usage

```bash
/revise-planning user-authentication frontend-architecture
```

This would:
1. Load: features.mdx, frontend-architecture.mdx, frontend-testing-scenarios.mdx, project-context.mdx (if exists)
2. Allow editing frontend-architecture.mdx
3. Automatically update features.mdx if responsibilities changed
4. Automatically update frontend-testing-scenarios.mdx for new components
5. Show summary of all files modified

```bash
/revise-planning
```

This would prompt for both plan-name and section, then determine scope automatically.

## Output

After revision, provide a summary:
- **Primary file modified:** [file]
- **Related files updated:**
  - [file 1] - [reason]
  - [file 2] - [reason]
  - [file 3] - [reason]
- **Summary of changes** across all files
- **Recommendations:**
  - Run /validate-plan to check quality
  - Run /revise-task-fe to regenerate frontend task lists
  - Run /revise-task-be to regenerate backend task lists

## Related Commands

- `/rules-plan` - Define project rules that guide revisions
- `/planning` - Create a new plan
- `/validate-plan` - Check plan quality across all files
- `/revise-task-fe` - Regenerate frontend task lists after plan revision
- `/revise-task-be` - Regenerate backend task lists after plan revision
- `/execute-fe` - Implement frontend from revised plan
- `/execute-be` - Implement backend from revised plan

## Notes

- **Cross-file propagation is automatic** - related files are updated together
- **Frontend/backend scope is detected** - only relevant files are affected
- **project-context.mdx is included** when it exists and tech stack changes
- **Rules are checked during revision** - if `.pland/rules.mdx` exists, revisions are validated against rules
- **Original plan content is preserved** in git history
- **Use git diff** to see what changed if using version control
- **Always regenerate task lists** after plan revisions using /revise-task-fe or /revise-task-be
