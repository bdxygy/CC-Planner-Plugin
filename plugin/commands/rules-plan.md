---
description: Define project-specific rules that guide /planning and /revise-planning decisions
allowed-tools: ["AskUserQuestion", "Read", "Write", "Glob", "mcp__plugin_context7_context7__resolve-library-id", "mcp__plugin_context7_context7__query-docs", "mcp__exa__get_code_context_exa", "mcp__exa__web_search_exa", "mcp__exa__deep_researcher_start", "mcp__exa__deep_researcher_check"]
---

# /rules-plan

Define project-specific rules and constraints that will be referenced when creating or revising plans with `/planning` and `/revise-planning`. Rules are stored in `.pland/rules.mdx` and serve as guardrails for architectural decisions.

## When to Use

Use this command when:
- Starting a new project and want to establish planning rules
- Updating existing rules for a project
- Enforcing team standards and conventions
- Documenting architectural principles
- Setting constraints for technology choices

## Workflow

### 1. Check for Existing Rules

First, check if rules already exist:

```bash
# Check if rules file exists
Glob ".pland/rules.mdx"
```

**If rules exist:**
- Read existing rules
- Ask user if they want to replace or extend them
- Show current rules for review

**If no rules exist:**
- Proceed to create new rules

### 2. Gather Rule Categories

Use AskUserQuestion to collect rules in each category:

#### Architecture Rules

**Ask about architecture preferences:**
- Which architectural patterns are preferred? (layered, clean architecture, hexagonal, etc.)
- State management approach for frontend?
- API design patterns? (REST, GraphQL, RPC)
- Database approach? (SQL vs NoSQL preferences)

**Example rules:**
- "Use clean architecture with clear separation of concerns"
- "Frontend must use Redux for state management"
- "All APIs must follow RESTful conventions"

#### Technology Constraints

**Ask about technology requirements:**
- Required frameworks or libraries?
- Forbidden technologies?
- Version constraints?
- Language preferences?

**Example rules:**
- "Use React 18+ with TypeScript"
- "No jQuery allowed in new code"
- "Backend must use Node.js 20+ LTS"

#### Coding Standards

**Ask about coding standards:**
- Code style guide? (Airbnb, Standard, Custom)
- Naming conventions?
- File organization patterns?
- Comment/documentation requirements?

**Example rules:**
- "Follow Airbnb JavaScript style guide"
- "Use camelCase for variables, PascalCase for components"
- "All functions must have JSDoc comments"

#### Security Requirements

**Ask about security rules:**
- Authentication requirements?
- Data encryption requirements?
- Input validation standards?
- API security standards?

**Example rules:**
- "All APIs must require authentication"
- "Sensitive data must be encrypted at rest"
- "Validate all user input on both client and server"

#### Performance Requirements

**Ask about performance constraints:**
- Response time requirements?
- Bundle size limits?
- Database query constraints?
- Caching strategies?

**Example rules:**
- "API responses must be under 200ms"
- "Initial bundle size must be under 200KB"
- "All database queries must use indexed columns"

#### Testing Standards

**Ask about testing requirements:**
- Minimum test coverage percentage?
- Required test types? (unit, integration, E2E)
- Testing framework preferences?
- Mock/stub policies?

**Example rules:**
- "Maintain 80% minimum test coverage"
- "All critical paths must have E2E tests"
- "Use Vitest for unit tests, Playwright for E2E"

#### Documentation Rules

**Ask about documentation requirements:**
- README requirements?
- API documentation standards?
- Code commenting policies?
- Diagram requirements?

**Example rules:**
- "All modules must have README.md"
- "API endpoints must be documented in OpenAPI format"
- "Complex algorithms must have explanatory comments"

#### Team/Process Rules

**Ask about process constraints:**
- Code review requirements?
- Branching strategy?
- CI/CD requirements?
- Deployment policies?

**Example rules:**
- "All code must be reviewed before merging"
- "Use GitFlow branching strategy"
- "Main branch must always be deployable"

### 2.5. Use Context7 and Exa for Research

When defining rules, use documentation and research tools to ensure best practices:

**Use Context7 for official documentation:**
- `resolve-library-id` + `query-docs` for framework-specific patterns
- Query coding standards for chosen technologies
- Research official security guidelines for frameworks
- Find official testing best practices

**Use Exa for code examples and latest practices:**
- `get_code_context_exa` to find real-world coding standards examples
- `web_search_exa` to find industry best practices for:
  - Architecture patterns and conventions
  - Security standards and requirements
  - Performance benchmarks and targets
  - Testing coverage standards
- `deep_researcher_start` for complex topics like:
  - Industry-specific compliance requirements (HIPAA, PCI-DSS, GDPR)
  - Enterprise architecture standards
  - Team scaling and process best practices

**Examples:**
```
Query Context7 for React testing best practices:
  resolve-library-id: "react"
  query: "testing best practices, recommended test coverage, testing libraries"

Use Exa to find coding standards examples:
  get_code_context_exa: "TypeScript naming conventions examples"

Research security requirements:
  web_search_exa: "OWASP security requirements for web applications 2025"
```

### 3. Generate Rules File

Create `.pland/rules.mdx` with the collected rules:

```markdown
# Project Rules

## Architecture Rules

### Pattern Preferences
- [rule 1]
- [rule 2]

### State Management
- [state management rule]

### API Design
- [API rule]

## Technology Constraints

### Required Technologies
- [required framework/library]
- [version requirements]

### Forbidden Technologies
- [forbidden technology]

### Language Preferences
- [language rules]

## Coding Standards

### Style Guide
- [style guide reference]

### Naming Conventions
- [convention rules]

### File Organization
- [organization rules]

## Security Requirements

### Authentication
- [auth rules]

### Data Protection
- [encryption rules]

### Validation
- [validation rules]

## Performance Requirements

### Response Times
- [performance targets]

### Resource Limits
- [bundle size, memory, etc.]

### Optimization
- [caching, optimization rules]

## Testing Standards

### Coverage Requirements
- [minimum coverage %]

### Required Test Types
- [test type requirements]

### Testing Frameworks
- [framework preferences]

## Documentation Rules

### Code Documentation
- [commenting rules]

### API Documentation
- [API doc standards]

### Project Documentation
- [README requirements]

## Team/Process Rules

### Code Review
- [review requirements]

### Branching Strategy
- [branching rules]

### CI/CD
- [automation rules]

---

**Last Updated:** [date]
**Version:** [version]
```

### 4. Integrate with Planning Commands

Update planning commands to reference rules:

**For `/planning`:**
- Read `.pland/rules.mdx` at the start
- Apply technology constraints when selecting tech stack
- Use architecture rules when designing structure
- Follow coding standards in generated code patterns
- Include testing requirements in testing scenarios

**For `/revise-planning`:**
- Check that changes comply with rules
- Warn if revisions violate established rules
- Suggest alternatives when conflicts arise

## Usage Examples

```bash
/rules-plan
```

This launches an interactive session to define or update project rules.

```bash
/rules-plan
```

When rules exist, asks if you want to replace or extend them.

## Output

**File location:** `.pland/rules.mdx`

**Example snippet:**
```markdown
# Project Rules

## Architecture Rules

- Use clean architecture with clear layer separation
- Frontend components must be reusable and composable
- All API endpoints must follow RESTful conventions

## Technology Constraints

### Required
- React 18+
- TypeScript 5+
- Node.js 20 LTS

### Forbidden
- jQuery
- var declarations (use const/let)

## Coding Standards

- Follow Airbnb JavaScript style guide
- Use PascalCase for components, camelCase for variables
- Maximum file length: 300 lines

## Testing Standards

- Minimum 80% code coverage
- All public APIs must have unit tests
- Critical user flows must have E2E tests
```

## Related Commands

- `/planning` - Create plans that follow these rules
- `/revise-planning` - Revise plans while respecting rules
- `/list-plans` - Show plans that were created with these rules

## Notes

- Rules are stored in a single `.pland/rules.mdx` file
- Rules apply globally to all plans in the project
- Rules can be updated anytime by running `/rules-plan` again
- When rules are updated, existing plans are not automatically updated
- Planning commands should reference rules and warn about violations
- Rules are meant as guidelines, not hard constraints
- Use rules to enforce team consistency and best practices
