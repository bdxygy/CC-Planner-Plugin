---
description: Create organized backend task lists from existing plans. Extracts tasks with full context, organizes by priority, and outputs task lists ready for seamless execution with /execute-be.
argument-hint: [feature-topic]
allowed-tools: ["AskUserQuestion", "Read", "Write", "Glob", "Grep", "Bash", "TodoWrite"]
---

# /task-be

Create organized backend task lists from existing project plans. Extracts implementation tasks with full context, organizes them by priority, and generates task lists ready for seamless execution with `/execute-be`.

## When to Use

Use this command when:
- You have an existing plan in `.pland/[feature-topic]/`
- You need to break down backend features into actionable tasks
- You want prioritized task lists before implementation
- You're preparing for a backend TDD implementation sprint

## Execution Workflow

### 1. Load Plan and Feature Selection

First, identify the plan to extract tasks from:

```bash
# Check if plan directory exists
Glob ".pland/*/backend-architecture.mdx"
```

**Use AskUserQuestion to ask:**
- Which feature-topic plan to extract tasks from?
- Extract tasks for entire backend or specific services?
- Include dependencies between tasks?

### 2. Read Plan Files

Read the relevant plan files for task extraction:

```bash
# Read core plan files
Read .pland/[feature-topic]/features.mdx
Read .pland/[feature-topic]/backend-architecture.mdx
Read .pland/[feature-topic]/backend-testing-cases.mdx
Read .pland/[feature-topic]/project-context.mdx (optional)
```

### 3. Detect Backend Platform

Auto-detect the backend platform from existing codebase:

**Use Glob to detect:**
- **Bun + Hono**: `src/**/*.ts`, `package.json` with "hono"
- **Node.js + Express**: `src/**/*.ts`, `package.json` with "express"
- **Node.js + Fastify**: `src/**/*.ts`, `package.json` with "fastify"
- **Python + FastAPI**: `**/*.py`, `requirements.txt` or `pyproject.toml`
- **Python + Django**: `manage.py`, `settings.py`
- **Go**: `**/*.go`, `go.mod`
- **Rust**: `src/**/*.rs`, `Cargo.toml`
- **Android (Room)**: `db/**/*.kt`, `@Dao`, `@Entity`
- **iOS (Core Data)**: `**/*.xcdatamodeld`, `*.xcdatamodel`
- **Flutter (sqflite)**: `database/**/*.dart`

### 4. Extract and Categorize Tasks

Analyze plan files to extract backend tasks. For each task identified:

**Task Information to Extract (Full Context):**
- **Task Name**: Clear, actionable description
- **Priority**: High, Medium, or Low
- **Component/Service**: Which service, repository, or controller
- **File Location**: Suggested file path
- **Related Components**: Dependencies on other services
- **Test Requirements**: Unit tests with isolated mocks
- **Implementation Notes**: Platform-specific patterns
- **Acceptance Criteria**: Definition of done
- **Estimated Effort**: Relative complexity (S/M/L)

**Auto-detect Dependencies:**
- Scan `features.mdx` for service relationships (e.g., "ProductService uses ProductRepository")
- Scan `backend-architecture.mdx` for layer architecture (controllers → services → repositories)
- Extract API endpoint to service mappings
- Build dependency graph: Service A → depends on → Service B

**Dependency Detection Patterns:**
```
From features.mdx:
- "ProductService manages products via ProductRepository" → ProductService depends on ProductRepository
- "AuthController validates tokens via AuthService" → AuthController depends on AuthService
- "OrderService creates orders via ProductRepository" → OrderService depends on ProductRepository

From backend-architecture.mdx:
- Layer hierarchy (controller → service → repository → model)
- Service composition patterns
- External service dependencies
```

### 5. Validate Dependencies

**Circular Dependency Detection:**
- Build directed graph from task dependencies
- Run cycle detection algorithm (DFS-based)
- **Reject any circular dependencies** - not allowed

**Example of REJECTED circular dependency:**
```
Task A: ProductService → depends on → OrderService
Task B: OrderService → depends on → ProductService
❌ REJECTED: Circular dependency detected!

Resolution: Remove or restructure dependency
- Extract shared logic to a third service
- Or invert dependency (both depend on a common abstraction)
```

**Valid Dependency Chain Example:**
```
ProductModel (no deps)
    ↓
ProductRepository (depends on ProductModel)
    ↓
ProductService (depends on ProductRepository)
    ↓
ProductsController (depends on ProductService)
```

### 6. Organize Tasks by Priority

Structure tasks into three priority levels:

#### HIGH Priority Tasks
- Core business logic and services
- Data models and repositories
- API endpoints for critical features
- Authentication and authorization
- Database schema and migrations

#### MEDIUM Priority Tasks
- Secondary API endpoints
- Validation and error handling
- Caching layers
- Background jobs and workers
- Integration services

#### LOW Priority Tasks
- Logging and monitoring
- API documentation
- Performance optimizations
- Admin endpoints
- Data export/import features

### 7. Generate Task List Output

Create a structured task list in both formats:

**Format 1: MDX Task List (for human review)**
```mdx
# Backend Tasks: [feature-topic]

## High Priority
- [ ] **Define Product Data Model**
  - Service: Product entity/model
  - File: `src/models/Product.{ext}`
  - Tests: Validation tests, serialization tests
  - Dependencies: None (foundation model)
  - Dependency Chain: None
  - Blocked By: None
  - Blocks: ProductRepository, OrderRepository
  - Acceptance: Fields validated, JSON serializable

- [ ] **Implement ProductRepository Interface**
  - Service: ProductRepository
  - File: `src/repositories/ProductRepository.{ext}`
  - Tests: CRUD operations with mocked database
  - Dependencies: Product model
  - Dependency Chain: ProductRepository → ProductModel
  - Blocked By: ProductModel
  - Blocks: ProductService, OrderService
  - Notes: Interface for data access, isolate DB calls

- [ ] **Create ProductService with Business Logic**
  - Service: ProductService
  - File: `src/services/ProductService.{ext}`
  - Tests: Business logic with mocked repository
  - Dependencies: ProductRepository
  - Dependency Chain: ProductService → ProductRepository → ProductModel
  - Blocked By: ProductRepository (transitive: also needs ProductModel)
  - Blocks: ProductsController
  - Acceptance: getAll, getById, create, update, delete

## Medium Priority
- [ ] **Implement GET /api/products Endpoint**
  - Service: ProductsController
  - File: `src/controllers/products.controller.{ext}`
  - Tests: Request/response with mocked service
  - Dependencies: ProductService
  - Dependency Chain: ProductsController → ProductService → ProductRepository → ProductModel
  - Blocked By: ProductService (transitive: ProductRepository, ProductModel)
  - Blocks: None
  - Notes: Pagination, filtering, sorting

## Low Priority
- [ ] **Add Request Logging Middleware**
  - Service: LoggingMiddleware
  - File: `src/middleware/logging.{ext}`
  - Tests: Logs requests correctly
  - Dependencies: None (cross-cutting concern)
  - Dependency Chain: None
  - Blocked By: None
  - Blocks: None
  - Notes: Log level, request ID tracking
```

**Format 2: YAML Task List (for /execute-be integration)**
```yaml
featureTopic: e-commerce
platform: bun+hono
tasks:
  high:
    - id: be-001
      name: Define Product Data Model
      service: Product model
      file: src/models/product.ts
      tests:
        - Validation tests
        - Serialization tests
        - Type safety
      dependencies: []
      dependencyChain: []
      blockedBy: []
      blocks:
        - be-002
        - be-005
      acceptanceCriteria:
        - Zod schema validated
        - TypeScript types defined
        - JSON schema documented
      estimatedEffort: S
      implementationNotes: Use Zod for runtime validation
    - id: be-002
      name: Implement ProductRepository Interface
      service: ProductRepository
      file: src/repositories/product.repository.ts
      tests:
        - CRUD interface
        - Error handling
      dependencies:
        - Product model
      dependencyChain:
        - ProductRepository → ProductModel
      blockedBy:
        - ProductModel
      blocks:
        - be-003
        - be-006
      acceptanceCriteria:
        - findAll, findById, save, delete methods
        - Returns typed data
      estimatedEffort: M
      implementationNotes: Define interface first, implementation later
    - id: be-003
      name: Create ProductService with Business Logic
      service: ProductService
      file: src/services/product.service.ts
      tests:
        - getAll with filtering
        - getById with 404
        - create with validation
        - update with optimistic locking
      dependencies:
        - ProductRepository
      dependencyChain:
        - ProductService → ProductRepository
        - ProductService → ProductRepository → ProductModel
      blockedBy:
        - ProductRepository
      blockedByTransitive:
        - ProductModel
      blocks:
        - be-004
      acceptanceCriteria:
        - All CRUD operations
        - Business rules enforced
        - Error handling
      estimatedEffort: L
      implementationNotes: Mock repository in tests, no real DB
  medium:
    - id: be-004
      name: Implement GET /api/products Endpoint
      service: ProductsController
      file: src/controllers/products.controller.ts
      tests:
        - 200 response
        - 400 validation error
        - 500 server error
      dependencies:
        - ProductService
      dependencyChain:
        - ProductsController → ProductService
        - ProductsController → ProductService → ProductRepository
        - ProductsController → ProductService → ProductRepository → ProductModel
      blockedBy:
        - ProductService
      blockedByTransitive:
        - ProductRepository
        - ProductModel
      blocks: []
      acceptanceCriteria:
        - Returns paginated products
        - Query params: page, limit
      estimatedEffort: M
      implementationNotes: Use Hono route, mock service in tests
  low:
    - id: be-005
      name: Add Request Logging Middleware
      service: LoggingMiddleware
      file: src/middleware/logging.ts
      tests:
        - Logs request method
        - Logs request path
        - Adds request ID
      dependencies: []
      dependencyChain: []
      blockedBy: []
      blocks: []
      acceptanceCriteria:
        - Logs to console
        - Request ID header added
      estimatedEffort: S
      implementationNotes: Use Hono middleware

# Dependency Summary (for quick reference)
dependencySummary:
  foundation: # No dependencies, can start immediately
    - be-001  # Product model
    - be-005  # LoggingMiddleware
  blocked:
    - be-002  # ProductRepository (blocked by: Product model)
    - be-003  # ProductService (blocked by: ProductRepository → Product model)
    - be-004  # ProductsController (blocked by: ProductService → ProductRepository → Product model)
    - be-006  # OrderService (blocked by: ProductRepository → Product model)
```

### 8. Write Task List File

Save the task list to the plan directory:

```bash
# Save MDX task list to .pland/[feature-topic]/backend-tasks.mdx
Write .pland/[feature-topic]/backend-tasks.mdx
```

And save as YAML for programmatic access:

```bash
# Save YAML task list to .pland/[feature-topic]/backend-tasks.yaml
Write .pland/[feature-topic]/backend-tasks.yaml
```

### 9. Display Task Summary

Present a summary to the user:

```
Backend Tasks Extracted: e-commerce

Platform: Bun + Hono
Total Tasks: 18

Priority Breakdown:
  🔴 High:   6 tasks  (Models, repositories, core services)
  🟡 Medium: 8 tasks (API endpoints, validation)
  🟢 Low:    4 tasks  (Logging, docs, optimization)

Dependency Analysis:
  ✅ No circular dependencies detected
  📊 Foundation tasks (can start immediately): 4
  ⏳ Blocked tasks (waiting for dependencies): 14
  🔗 Total dependency relationships: 18

Task List Saved: .pland/e-commerce/backend-tasks.mdx

Next Steps:
- Review task list: cat .pland/e-commerce/backend-tasks.mdx
- Check dependency summary: cat .pland/e-commerce/backend-tasks.yaml
- Execute with TDD: /execute-be e-commerce
- Start with foundation tasks (no dependencies)
```

## Task Extraction Patterns

### From features.mdx
Extract backend requirements and break down into tasks:
- Each user story → API endpoint or service task
- Each data requirement → model/repository task
- Each business rule → service logic task

### From backend-architecture.mdx
Extract implementation details:
- Layer architecture → service/repository/controller tasks
- API endpoints → controller tasks
- Data models → entity/schema tasks
- External integrations → adapter/client tasks

### From backend-testing-cases.mdx
Extract test requirements:
- Each test case → unit test task
- Edge cases → additional test tasks
- Business rules → validation test tasks

## Platform-Specific Task Examples

### Bun + Hono Tasks
```markdown
## High Priority
- [ ] **Define Product Schema with Zod**
  - Service: Product model
  - File: `src/models/product.ts`
  - Tests: Zod validation tests
  - Notes: Runtime validation + TypeScript types

- [ ] **Implement ProductRepository Interface**
  - Service: ProductRepository
  - File: `src/repositories/product.repository.ts`
  - Tests: Interface contract tests
  - Notes: Interface for dependency injection

- [ ] **Create ProductService**
  - Service: ProductService
  - File: `src/services/product.service.ts`
  - Tests: Business logic with mocked repo
  - Notes: All business rules, no HTTP/DB
```

### Node.js + Express Tasks
```markdown
## High Priority
- [ ] **Define Mongoose Product Schema**
  - Service: Product model
  - File: `src/models/Product.model.ts`
  - Tests: Schema validation, methods
  - Notes: Mongoose schema with TypeScript

- [ ] **Implement ProductRepository**
  - Service: ProductRepository
  - File: `src/repositories/product.repository.ts`
  - Tests: CRUD with mocked Model
  - Notes: Abstract database operations
```

### Python + FastAPI Tasks
```markdown
## High Priority
- [ ] **Define Product Pydantic Model**
  - Service: Product schema
  - File: `app/models/product.py`
  - Tests: Pydantic validation
  - Notes: Request/response schemas

- [ ] **Implement ProductRepository**
  - Service: ProductRepository
  - File: `app/repositories/product.py`
  - Tests: CRUD with mocked session
  - Notes: SQLAlchemy async repository
```

### Go Tasks
```markdown
## High Priority
- [ ] **Define Product Struct**
  - Service: Product model
  - File: `internal/models/product.go`
  - Tests: JSON marshaling, validation
  - Notes: Go struct with tags

- [ ] **Implement ProductRepository Interface**
  - Service: ProductRepository
  - File: `internal/repository/product.go`
  - Tests: Interface with mock
  - Notes: Go interface for testability
```

### Android (Room) Tasks
```markdown
## High Priority
- [ ] **Define Product Entity**
  - Service: Product entity
  - File: `app/src/main/java/com/example/db/ProductEntity.kt`
  - Tests: Entity validation
  - Notes: Room @Entity with indices

- [ ] **Implement ProductDao**
  - Service: ProductDao
  - File: `app/src/main/java/com/example/db/ProductDao.kt`
  - Tests: DAO with in-memory DB
  - Notes: Room @Dao with queries

- [ ] **Create ProductRepository**
  - Service: ProductRepository
  - File: `app/src/main/java/com/example/data/ProductRepository.kt`
  - Tests: Repository with mocked DAO
  - Notes: Abstract data layer
```

### iOS (Core Data) Tasks
```markdown
## High Priority
- [ ] **Define Product NSManagedObject**
  - Service: Product entity
  - File: `Models/ProductEntity+CoreDataClass.swift`
  - Tests: Entity creation, fetching
  - Notes: Core Data model

- [ ] **Implement ProductRepository**
  - Service: ProductRepository
  - File: `Repositories/ProductRepository.swift`
  - Tests: CRUD with mocked context
  - Notes: Protocol-based for testing
```

## Seamless Integration with /execute-be

The generated task list integrates seamlessly with `/execute-be`:

**Option 1: Direct Reference**
```bash
# /execute-be reads the task list automatically
/execute-be e-commerce
# Loads: .pland/e-commerce/backend-tasks.yaml
# Executes tasks by priority (high → medium → low)
```

**Option 2: Manual Selection**
```bash
# User selects specific tasks to execute
/execute-be e-commerce
# Asks: Which tasks to execute?
# Options: High only, All, Select specific
```

**Option 3: TODO List Sync**
```bash
# /task-be creates TodoWrite entries
# /execute-be picks up the same TODOs
# No duplication, seamless handoff
```

## Isolated Testing Reminder

All backend tasks MUST include isolated unit tests:
- Mock repositories (no database)
- Mock HTTP clients (no API calls)
- Test business logic only
- No integration tests in this phase

## Output Summary

After task extraction, provide:

```
Backend Task List Created

Feature Topic: [feature-topic]
Platform: [detected platform]

Tasks Generated: [total]
  High Priority:   [count] 🔴
  Medium Priority: [count] 🟡
  Low Priority:    [count] 🟢

Dependency Analysis:
  ✅ No circular dependencies detected
  📊 Foundation tasks (can start immediately): [count]
  ⏳ Blocked tasks (waiting for dependencies): [count]
  🔗 Total dependency relationships: [count]

Output Files:
- .pland/[topic]/backend-tasks.mdx (human-readable)
- .pland/[topic]/backend-tasks.yaml (machine-readable, token-efficient)

Integration:
- Run /execute-be [topic] to execute tasks with TDD
- Tasks organized by priority for optimal implementation
- Full context included for each task
- All tests isolated (no HTTP, no database)
- Auto-detected dependencies with full chain tracking

Next Steps:
1. Review task list: cat .pland/[topic]/backend-tasks.mdx
2. Check dependency summary in YAML
3. Adjust priorities if needed
4. Execute: /execute-be [topic]
```

## Related Commands

- `/execute-be` - Execute backend tasks using TDD
- `/task-fe` - Create frontend task lists
- `/planning` - Create a new plan
- `/revise-planning` - Edit existing plans

## Notes

- Tasks extracted from existing plans only
- Full context included: file locations, tests, dependencies
- Organized by priority for focused implementation
- Seamless integration with /execute-be
- Platform-specific task patterns applied automatically
- All tasks require isolated unit tests
- **Auto-detected dependencies** from plan files
- **Full dependency chain tracking** (transitive dependencies)
- **Circular dependency detection** (rejected with resolution guidance)
