---
name: Architecture Patterns
description: This skill should be used when the user asks to "design frontend architecture", "design backend architecture", "define component structure", "plan state management", "separate concerns", or needs guidance on system design, component boundaries, layering, testability, or API patterns. Provides architecture patterns and design principles for building testable, maintainable applications.
version: 0.1.0
---

# Architecture Patterns

Architecture defines the structural foundation of an application. Good architecture enables parallel development, independent testing, easy modification, and clear ownership boundaries. Poor architecture creates entanglement, makes testing difficult, and leads to costly refactors.

This skill provides architecture patterns for frontend and backend systems, with emphasis on separation of concerns, testability, and clear boundaries.

## Core Architecture Principles

**Separation of concerns**: Different responsibilities belong in different layers. UI logic should not mix with business logic. HTTP handling should not mix with domain logic. Clear boundaries enable independent testing and parallel development.

**Dependency inversion**: Higher layers should not depend on lower layers. Both should depend on abstractions (interfaces). This enables swapping implementations without affecting consumers.

**Single responsibility**: Each module, component, or function should have one reason to change. If a component handles UI rendering, state management, and API calls, it has too many responsibilities.

**Testability first**: Design for unit testing from the start. If logic cannot be tested without HTTP, databases, or external services, it's in the wrong layer. Unit tests require isolated, deterministic behavior.

## Frontend Architecture Patterns

### Component Structure

Organize components by feature and responsibility:

**Atomic design hierarchy:**
```
atoms/      - Smallest UI elements (buttons, inputs, labels)
molecules/  - Simple compositions (search bars, form fields)
organisms/  - Complex compositions (forms, cards, headers)
templates/  - Layout structures (page layouts, grids)
pages/      - Route-level compositions
```

**Feature-based organization (alternative):**
```
features/
  user-authentication/
    components/
      LoginForm.tsx
      RegisterForm.tsx
    hooks/
      useAuth.ts
    api/
      authApi.ts
```

**Component boundary rules:**
- Presentational components receive data via props, emit events via callbacks
- Container components connect to state management, handle business logic
- Keep components small and focused (< 200 lines ideal)
- Extract reusable logic into custom hooks or utility functions

### State Management Strategy

Choose state management based on scope and complexity:

**Local component state:**
- Use for UI-only state (modals, toggles, form input)
- Implemented with useState, useReducer, or similar
- No need for global state for isolated UI behavior

**Global application state:**
- Use for state shared across multiple components
- Consider Redux Toolkit, Zustand, or Context + useReducer
- Keep global state minimal - derive what can be derived
- Normalize data structure to avoid duplication

**Server state:**
- Use for data from APIs (cache, refetch, background updates)
- Prefer React Query, SWR, or similar over manual state management
- Server state libraries handle caching, invalidation, retries
- Treat server state as separate from client state

**State synchronization rules:**
- Server state is the source of truth for persisted data
- Client state optimistically updates, rolls back on error
- Avoid duplicating server state in global state
- Use keys to identify and invalidate stale data

### API Interaction Patterns

Design clean API interaction layers:

**API client abstraction:**
```typescript
// api/authApi.ts
export const authApi = {
  login: (credentials) => fetch('/api/auth/login', { ... }),
  logout: () => fetch('/api/auth/logout', { ... }),
  register: (data) => fetch('/api/auth/register', { ... }),
}
```

**Using React Query for server state:**
```typescript
// hooks/useAuth.ts
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => queryClient.invalidateQueries('user'),
  });
}
```

**Fetch patterns:**
- Use library (React Query, SWR) for automatic caching and retries
- Define API contracts with TypeScript for type safety
- Handle errors at the call site or with error boundaries
- Show loading states during mutations and fetches

**Mutation patterns:**
- Optimistic updates: update UI immediately, roll back on error
- Pessimistic updates: wait for server confirmation
- Invalidate related queries after mutations
- Show feedback (toasts, notifications) for mutations

### Error & Loading State Handling

Design consistent error and loading patterns:

**Loading states:**
- Show skeleton screens for content loading
- Disable buttons during form submissions
- Use loading spinners for inline operations
- Provide progress indication for long operations

**Error boundaries:**
- Place error boundaries around route components
- Catch errors in component trees, show fallback UI
- Log errors for debugging
- Provide recovery options (retry, go back)

**Error types:**
- Network errors: show connection error message, offer retry
- Server errors (4xx/5xx): show server error message
- Validation errors: show field-level error messages
- Timeout errors: show timeout message, offer retry

**Empty states:**
- Show helpful message when no data exists
- Provide call-to-action (create item, refresh, navigate)
- Use illustrations or icons for visual clarity
- Link to relevant documentation if applicable

## Backend Architecture Patterns

### Module Structure

Organize backend code into clear layers:

**Layered architecture:**
```
src/
  http/           - HTTP layer (routes, controllers, middleware)
  services/       - Business logic layer (domain operations)
  repositories/   - Data access layer (database, external APIs)
  models/         - Domain models and types
  utils/          - Shared utilities (validation, formatting)
```

**Alternative: Feature-based modules:**
```
src/
  features/
    user-authentication/
      routes.ts
      service.ts
      repository.ts
      model.ts
  shared/
    middleware/
    validators/
    utils/
```

**Layer separation rules:**
- HTTP layer handles request parsing, response formatting
- Service layer contains business logic, validations
- Repository layer handles data persistence, external APIs
- Models define types and interfaces used across layers

**Dependency rules:**
- HTTP layer → service layer → repository layer
- No reverse dependencies (repository never calls HTTP)
- Lower layers never import from higher layers
- Use dependency injection for testability

### API Design

Design clear, consistent API contracts:

**Endpoint naming:**
- Use nouns for resources (e.g., `/users`, `/posts`)
- Use plural nouns for collections (e.g., `/users` not `/user`)
- Use kebab-case for multi-word resources (e.g., `/blog-posts`)
- Nest resources logically (e.g., `/users/{id}/posts`)

**HTTP method usage:**
- GET: Retrieve resources (no side effects)
- POST: Create resources or trigger actions
- PUT: Replace resources entirely
- PATCH: Partially update resources
- DELETE: Remove resources

**Request/response contracts:**
- Define request body schemas with validation
- Define response body schemas with TypeScript
- Use consistent response format (envelope or direct)
- Include error details in error responses

**Example contract:**
```typescript
// GET /users/{id}
// Response: 200 OK
{
  "id": string,
  "name": string,
  "email": string,
  "createdAt": string,
}

// Response: 404 Not Found
{
  "error": "User not found",
  "code": "USER_NOT_FOUND",
}
```

### Validation & Authentication

**Request validation:**
- Validate at HTTP layer before business logic
- Use schema validation (Zod, Yup, Joi)
- Return 400 Bad Request for invalid input
- Include field-level error details

**Authentication:**
- Use middleware to extract and verify credentials
- Support session-based or token-based auth
- Return 401 Unauthorized for missing/invalid credentials
- Store user context in request for downstream use

**Authorization:**
- Check permissions after authentication
- Implement role-based or resource-based access control
- Return 403 Forbidden for insufficient permissions
- Document permission requirements in API docs

### Error Handling Conventions

**Error response format:**
```typescript
{
  "error": string,        // Human-readable error message
  "code": string,         // Machine-readable error code
  "details?: object,      // Additional error context
}
```

**HTTP status codes:**
- 200 OK: Successful operation
- 201 Created: Resource created successfully
- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid credentials
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 409 Conflict: Resource conflict (duplicate, version mismatch)
- 422 Unprocessable Entity: Valid syntax but semantic errors
- 500 Internal Server Error: Unhandled server error

**Error logging:**
- Log all errors with context (user, request, stack trace)
- Use structured logging (JSON format)
- Include correlation IDs for request tracing
- Separate logs by severity (info, warn, error)

## Testability Patterns

### Frontend Testability

**Testable component design:**
- Pass data via props, emit events via callbacks
- Inject dependencies (API clients, hooks) for mocking
- Keep components pure - no side effects in render
- Test user behavior, not implementation details

**Testing scenarios:**
- User actions (clicks, form submission, navigation)
- Edge cases (empty data, boundary values, invalid input)
- Failure states (network errors, server errors, timeouts)
- Visual states (loading, error, empty, success)

### Backend Testability

**Testable service design:**
- Keep business logic isolated from HTTP
- Use interfaces for repository dependencies
- Avoid external dependencies in unit tests
- Test business rules, boundaries, and failures

**Testing isolation:**
- Mock HTTP layer in service tests
- Mock database in repository tests
- Use dependency injection for swapping implementations
- Test each layer independently

## Integration Points

### Frontend-Backend Contract

**API as contract:**
- Define endpoint contracts in advance
- Use TypeScript for type safety across boundary
- Document API with OpenAPI/Swagger
- Share types between frontend and backend

**Versioning strategy:**
- Use URL versioning (e.g., `/api/v1/users`)
- Maintain backward compatibility when possible
- Deprecate old versions before removing
- Communicate breaking changes clearly

### Context7 for Technology Details

For framework-specific architecture guidance:
- Use Context7 for React component patterns
- Use Context7 for Hono middleware and routing
- Use Context7 for state management library patterns
- Apply current best practices from official documentation

## Anti-Patterns to Avoid

- **God components**: Components that do everything (UI, state, API)
- **Circular dependencies**: Layers that depend on each other
- **Leaky abstractions**: HTTP details in business logic
- **Tangled state**: Mixing server and client state
- **Test-resistant design**: Logic that cannot be isolated for testing
