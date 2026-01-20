---
name: revise-planning
description: Edit specific sections of an existing project plan
argument-hint: [feature-topic] [section]
allowed-tools:
  - AskUserQuestion
  - Read
  - Write
  - Glob
  - Grep
  - mcp__plugin_context7_context7__resolve-library-id
  - mcp__plugin_context7_context7__query-docs
  - mcp__exa__get_code_context_exa
  - mcp__exa__web_search_exa
  - mcp__exa__deep_researcher_start
  - mcp__exa__deep_researcher_check
---

# /revise-planning

Edit specific sections of an existing project plan without regenerating the entire plan. Supports section-level modifications for targeted updates.

## When to Use

Use this command when:
- A specific section of a plan needs updating
- Requirements have changed for a planned feature
- Architecture decisions need revision
- Testing scenarios need expansion

## Revision Workflow

### 1. Identify Plan and Section

First, determine what needs to be revised:

**List available plans:**
```bash
# Use Glob to find .pland directories
Glob ".pland/**/project-context.mdx"
```

**Ask the user:**
- Which feature-topic needs revision?
- Which section(s) need to be updated?

**Available sections:**
- `project-context.mdx`
- `features.mdx`
- `frontend-architecture.mdx`
- `backend-architecture.mdx`
- `frontend-testing-scenarios.mdx`
- `backend-testing-cases.mdx`

### 2. Read Current Content

Read the existing file to understand current state:
```bash
Read .pland/[feature-topic]/[section].mdx
```

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

### 4. Apply Changes

Make the requested revisions to the file:

**For additions:**
- Add new content in appropriate location
- Maintain consistency with existing style
- Ensure cross-references remain accurate

**For modifications:**
- Update specific sections while preserving structure
- Check for impacted references in other files
- Update related sections if needed

**For removals:**
- Remove specified content cleanly
- Update references and dependencies
- Check for orphaned content

### 5. Validate Consistency

After making changes, verify plan consistency:

**Cross-file checks:**
- If features changed, do testing scenarios still align?
- If architecture changed, are features still implementable?
- Are cross-references still accurate?

**Use /validate-plan** to check overall quality after major revisions.

## Section-Specific Guidance

### Revising project-context.mdx

**Common revisions:**
- Updated technology stack or versions
- Changed constraints or assumptions
- Modified target platforms
- Updated project scope

**Cross-file impacts:**
- Architecture sections may need updates if tech stack changed
- Features may need reassessment if scope changed

### Revising features.mdx

**Common revisions:**
- Adding new features
- Modifying existing feature responsibilities
- Removing deprecated features
- Updating feature dependencies

**Cross-file impacts:**
- Testing scenarios must be added/updated for new features
- Architecture may need updates for new feature requirements

### Revising frontend-architecture.mdx

**Common revisions:**
- Changing component structure
- Updating state management approach
- Modifying API interaction patterns
- Adding new error handling

**Cross-file impacts:**
- Features may need frontend responsibility updates
- Testing scenarios may need updates for new patterns

### Revising backend-architecture.mdx

**Common revisions:**
- Adding new endpoints
- Changing validation rules
- Updating authentication/authorization
- Modifying error handling

**Cross-file impacts:**
- Features may need backend responsibility updates
- Testing cases may need updates for new endpoints

### Revising frontend-testing-scenarios.mdx

**Common revisions:**
- Adding new test scenarios for features
- Expanding edge case coverage
- Adding new failure states
- Correcting incorrect scenarios

**Cross-file impacts:**
- Should align with current feature list
- Should match current frontend architecture

### Revising backend-testing-cases.mdx

**Common revisions:**
- Adding new test cases for endpoints
- Expanding boundary condition coverage
- Adding new failure modes
- Correcting incorrect test cases

**Cross-file impacts:**
- Should align with current feature list
- Should match current backend architecture

## Interactive Best Practices

- **Read first, then ask** - understand current state before proposing changes
- **Confirm scope** - verify user's intent before making changes
- **Show diff summary** - summarize what changed after revision
- **Suggest validation** - recommend running /validate-plan after major changes
- **Use Context7** for official API documentation
- **Use Exa** for code examples and latest patterns:
  - `get_code_context_exa` - Real-world implementation examples
  - `web_search_exa` - Recent articles and best practices
  - `deep_researcher_start` - Complex research topics

## Example Usage

```bash
/revise-planning user-authentication frontend-architecture
```

This would allow editing `.pland/user-authentication/frontend-architecture.mdx`.

```bash
/revise-planning
```

This would prompt for both feature-topic and section.

## Output

After revision, provide a summary:
- Which file was modified
- What changes were made
- Any cross-file impacts identified
- Recommendation to run /validate-plan

## Related Commands

- `/planning` - Create a new plan
- `/validate-plan` - Check plan quality
- `/execute` - Implement from a plan

## Notes

- Original plan content is preserved in git history
- Each revision is an edit to existing files
- Use `git diff` to see what changed if using version control
