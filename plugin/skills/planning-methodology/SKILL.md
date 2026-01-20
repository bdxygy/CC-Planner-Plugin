---
name: Planning Methodology
description: This skill should be used when the user asks to "plan a project", "create an application plan", "design system architecture", "break down features", or needs guidance on project discovery, feature decomposition, testing scenarios, or documentation structure. Provides comprehensive planning methodology and templates for software projects.
version: 0.1.0
---

# Planning Methodology

Planning transforms ambiguous requirements into actionable, implementation-ready documentation. A good plan serves as a single source of truth, bridges the gap between product vision and technical implementation, and prevents costly rework by revealing dependencies and risks early.

This skill provides a systematic approach to planning software projects, with emphasis on clarity, testability, and technical feasibility.

## Core Planning Principles

**Precision over abstraction**: Avoid theoretical fluff. Every statement in a plan should be directly implementable or testable. If content can be summarized or removed without impact, remove it.

**Test-driven planning**: Every feature must have explicit testing scenarios. If something cannot be tested, it cannot be verified as working. Frontend features require user-centric scenarios; backend features require logic-driven test cases.

**Separation of concerns**: Frontend and backend responsibilities must be clearly delineated. This enables parallel development, independent testing, and clearer ownership boundaries.

**Context awareness**: Distinguish between new projects (greenfield) and existing projects (brownfield). Brownfield planning requires analyzing current architecture, identifying technical debt, and ensuring new features integrate cleanly.

## Planning Workflow

Follow this workflow for comprehensive project planning:

### 1. Project Context Analysis

First, establish whether the project is new or existing:

**New projects:**
- Identify the problem being solved and target users
- Define project scope and boundaries
- Establish baseline technology choices
- Identify success criteria

**Existing projects:**
- Scan codebase structure and identify current patterns
- Analyze package.json, configuration files, and entry points
- Identify architectural patterns, state management, and API patterns
- Document technical debt, constraints, and integration points

Use the codebase-scanner agent for autonomous analysis, then ask clarifying questions to fill gaps.

### 2. Feature Decomposition

Break down the project into concrete features:

**For new projects:**
- Start with user stories or product requirements
- Decompose into atomic, implementable features
- Group related features into logical modules
- Establish feature dependencies and priority

**For existing projects:**
- Identify existing features through codebase scanning
- List new features to be added or modified
- Document which features remain unchanged
- Analyze impact of new features on existing code

**For each feature, document:**
- Purpose and user value (why this matters)
- Frontend responsibilities (UI, state, behavior)
- Backend responsibilities (API, business logic, data)
- Impact on existing code (for brownfield)
- Frontend testing scenarios (user actions, edge cases, failures)
- Backend testing cases (business rules, boundaries, failures)

### 3. Architecture Design

Design frontend and backend architectures independently, with clear integration points:

**Frontend:**
- Define component hierarchy and module boundaries
- Choose state management strategy (local, global, server state)
- Specify API interaction patterns (fetching, mutations, caching)
- Plan error, loading, and empty-state handling

**Backend:**
- Define module structure and layering
- Specify endpoints, request/response contracts
- Plan validation, authentication, and authorization
- Define error handling conventions

For technology-specific details (React patterns, Hono middleware, etc.), use Context7 to retrieve current documentation.

### 4. Testing Strategy

Define explicit unit test scenarios for every feature:

**Frontend testing scenarios:**
- User-centric actions (clicks, form submissions, navigation)
- Edge cases (empty states, boundary values, invalid input)
- Failure states (network errors, server errors, timeouts)

**Backend testing cases:**
- Business rules (validations, calculations, transformations)
- Boundary conditions (min/max values, empty collections, null handling)
- Failure modes (database errors, external API failures)

Unit tests must be isolated from HTTP, databases, and external services. Mock or stub all external dependencies.

### 5. Documentation Output

Generate structured `.mdx` files under `.pland/[plan-name]/`:

**Standard file set:**
- `project-context.mdx` - Project overview, tech stack, constraints
- `features.mdx` - Complete feature breakdown with responsibilities
- `frontend-architecture.mdx` - Component structure, state, APIs
- `backend-architecture.mdx` - Modules, endpoints, contracts
- `frontend-testing-scenarios.mdx` - User-centric test scenarios
- `backend-testing-cases.mdx` - Logic-driven test cases
- `e2e-overview.mdx` - High-level feature flow overview

**File organization:**
- Use plan-name directories (e.g., `.pland/user-authentication/`)
- Never overwrite existing plans - subdirectories prevent conflicts
- Each `.mdx` file is self-contained and independently readable

## Planning Templates

### Feature Template

For each feature, use this structure:

```markdown
## Feature: [Feature Name]

**Purpose:** [What problem does this solve? What user value does it provide?]

### Frontend Responsibilities
- [UI component and behavior responsibilities]
- [State management responsibilities]
- [API interaction responsibilities]

### Backend Responsibilities
- [API endpoint definitions]
- [Business logic responsibilities]
- [Data persistence responsibilities]

### Impact on Existing Code
- [For brownfield: what existing code changes?]
- [New dependencies or refactoring required?]

### Frontend Testing Scenarios
**Happy Path:**
- [User action steps and expected outcome]

**Edge Cases:**
- [Edge case 1: description and expected handling]
- [Edge case 2: description and expected handling]

**Failure States:**
- [Network error: expected behavior]
- [Server error: expected behavior]

### Backend Testing Cases
**Business Rules:**
- [Rule 1: validation or transformation logic]
- [Rule 2: calculation or constraint logic]

**Boundary Conditions:**
- [Boundary case 1: min/max/empty handling]
- [Boundary case 2: null/undefined handling]

**Failure Modes:**
- [Database failure: expected error handling]
- [External API failure: expected error handling]
```

### Architecture Template

For frontend architecture:

```markdown
## Frontend Architecture

### Component Structure
- [Component hierarchy and module organization]
- [Component boundaries and responsibilities]

### State Management
- [State type: local, global, or server]
- [State update patterns]
- [State synchronization strategy]

### API Interaction
- [Fetching patterns (libraries, caching, revalidation)]
- [Mutation patterns (optimistic updates, rollback)]
- [Error handling and retry logic]

### Error & Loading States
- [Loading state display strategy]
- [Error boundary placement and handling]
- [Empty state presentation]
```

For backend architecture:

```markdown
## Backend Architecture

### Module Structure
- [Folder and module organization]
- [Layer separation (HTTP, business logic, data)]

### API Endpoints
- [Endpoint definitions with methods and paths]
- [Request/response contracts]
- [Validation and authentication requirements]

### Error Handling
- [Error response format]
- [HTTP status code conventions]
- [Logging and monitoring strategy]
```

## Interactive Planning Process

When executing the `/planning` command, follow this interactive approach:

1. **Initial context gathering**: Ask targeted questions about project type, scope, and constraints
2. **Codebase analysis**: For existing projects, run codebase-scanner agent to gather context
3. **Feature elicitation**: Ask user to describe features, decompose into implementable units
4. **Architecture decisions**: Ask clarifying questions about technology choices and patterns
5. **Testing requirements**: For each feature, ask about edge cases and failure scenarios
6. **Document generation**: Create `.mdx` files with complete information

Use AskUserQuestion extensively for multi-option decisions (e.g., state management choice, API patterns).

## Validation Criteria

A plan is complete when:

- **Every feature has** explicit frontend/backend responsibilities
- **Every feature has** frontend testing scenarios (happy path, edges, failures)
- **Every feature has** backend testing cases (rules, boundaries, failures)
- **Frontend architecture** specifies components, state, APIs, error handling
- **Backend architecture** specifies modules, endpoints, contracts, validation
- **Documentation** is concrete and implementable (no abstract filler)

Use `/validate-plan` to verify completeness and quality.

## Context7 Integration

For technology-specific documentation:
- Use Context7 to retrieve current docs for frameworks (React, Hono, etc.)
- Apply Context7 guidance for API patterns and best practices
- Reference Context7 for testing library usage (Vitest, Jest, etc.)
