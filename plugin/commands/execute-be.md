---
name: execute-be
description: Implement backend features from a plan using Test-Driven Development (TDD). Generates tests first, then implementation, following Red-Green-Refactor cycle with isolated unit tests.
argument-hint: [feature-topic] [feature-name]
allowed-tools:
  - AskUserQuestion
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - TodoWrite
  - mcp__plugin_context7_context7__resolve-library-id
  - mcp__plugin_context7_context7__query-docs
---

# /execute-be

Implement backend features from an existing plan using Test-Driven Development. Generates tests FIRST, then implementation code, following the classic Red-Green-Refactor TDD cycle with isolated unit tests.

## When to Use

Use this command when:
- Implementing backend services, repositories, or API endpoints
- Building business logic from a plan
- Following TDD methodology for backend development
- Need test coverage without HTTP/database dependencies

## TDD Workflow: Red-Green-Refactor

This command follows the classic TDD cycle for backend code:

1. **RED** - Write a failing unit test (no HTTP, no database)
2. **GREEN** - Write minimal implementation to pass the test
3. **REFACTOR** - Improve the code while keeping tests green

**Critical**: Backend unit tests MUST be isolated:
- Mock HTTP layer
- Mock database/repositories
- Test business logic only
- No integration tests (those come later)

## Execution Workflow

### 1. Load Plan and Select Feature

First, identify the plan and feature to implement:

```bash
# Read plan files
Read .pland/[feature-topic]/features.mdx
Read .pland/[feature-topic]/backend-architecture.mdx
Read .pland/[feature-topic]/backend-testing-cases.mdx
```

**Use AskUserQuestion to ask:**
- Which feature-topic plan to execute?
- Implement entire backend or specific features?
- Select specific services/repositories/endpoints

### 2. Detect Backend Platform

Auto-detect the backend platform from existing codebase:

**Use Glob to detect:**
- **Bun + Hono**: `src/**/*.ts`, `package.json` with "hono"
- **Node.js + Express**: `src/**/*.ts`, `package.json` with "express"
- **Python + FastAPI**: `**/*.py`, `requirements.txt` or `pyproject.toml`
- **Go**: `**/*.go`, `go.mod`
- **Rust**: `src/**/*.rs`, `Cargo.toml`
- **Android (Room)**: `db/**/*.kt`, `@Dao`, `@Entity`
- **iOS (Core Data)**: `**/*.xcdatamodeld`, `*.xcdatamodel`
- **Flutter (sqflite)**: `database/**/*.dart`

**Load appropriate patterns:**
- Web APIs → Use `architecture-patterns` skill
- Android Room → Use `android-patterns` skill
- iOS Core Data → Use `ios-swift-patterns` skill
- Other → Use Context7 for framework patterns

### 3. Select Testing Framework

**Use AskUserQuestion to present platform-specific options:**

**Bun + Hono / Node.js:**
- Vitest (recommended, fast)
- Jest (classic)
- Bun's built-in test runner

**Python (FastAPI):**
- pytest
- unittest

**Go:**
- testing package
- testify

**Rust:**
- built-in test module

**Android (Room):**
- JUnit (Robolectric for in-memory database)

**iOS (Core Data):**
- XCTest with in-memory persistent store

**Flutter (sqflite):**
- flutter_test with sqflite_ffi_test
- Mockito for mocks

### 4. Create TODO List

Use TodoWrite to create a backend TODO list:

```javascript
// Example TODO structure
[
  { "content": "Write test for ProductService.getAll()", "status": "pending", "phase": "red" },
  { "content": "Implement ProductService.getAll()", "status": "pending", "phase": "green" },
  { "content": "Refactor ProductService for error handling", "status": "pending", "phase": "refactor" },
  { "content": "Write test for ProductRepository", "status": "pending", "phase": "red" },
  // ...
]
```

**TODO phases:**
- `red`: Write failing unit test
- `green`: Implement to pass test
- `refactor`: Improve implementation

### 5. TDD Implementation Cycle

For each backend component, follow Red-Green-Refactor:

#### RED Phase: Write Failing Unit Test

**Generate test file first:**
```bash
# Create test file alongside source
# Bun/Hono: src/services/product.service.test.ts
# Node/Express: src/services/product.service.test.ts
# Python: tests/test_product_service.py
# Go: product_service_test.go
# Android: app/src/test/.../ProductServiceTest.kt
```

**Test structure - MUST be isolated:**
- Mock repositories (no database)
- Mock HTTP clients (no real API calls)
- Test business rules only
- Test boundary conditions
- Test failure modes

**Write test using Context7 for framework-specific patterns:**
- Query Context7 for testing framework documentation
- Use mocking patterns appropriate for framework

**Run test - must FAIL:**
```bash
# Platform-specific test commands
# Bun: bun test
# Node: npm test
# Python: pytest
# Go: go test
# Android: ./gradlew testDebugUnitTest
```

#### GREEN Phase: Implement Feature

**Generate implementation file:**
```bash
# Create source file
# Bun/Hono: src/services/product.service.ts
# Node: src/services/product.service.ts
# Python: services/product_service.py
# Go: product_service.go
# Android: app/src/main/.../ProductService.kt
```

**Implementation guidelines:**
- Write MINIMAL code to pass the test
- Focus on business logic first
- Use dependency injection for testability
- Use platform-specific patterns

**Run test - must PASS:**
```bash
# Re-run test
```

#### REFACTOR Phase: Improve Code

**Refactoring checklist:**
- Extract duplicate logic
- Improve error handling
- Add validation
- Apply design patterns (repository, factory, etc.)
- Ensure tests still pass

**Re-run tests after each refactor:**
```bash
# All tests must still pass
```

### 6. Interactive Test Verification

After each phase, **use AskUserQuestion to ask:**

**After RED phase:**
"Test written. Verify it fails?"
- Run test and confirm failure
- Show test output to user

**After GREEN phase:**
"Implementation complete. Run tests?"
- Run test and confirm passing
- Show test output to user

**After REFACTOR phase:**
"Refactoring complete. Re-run tests?"
- Run all tests to confirm still passing
- Show test output to user

**After full cycle:**
"Continue to next component?"
- Move to next TODO item
- Complete TDD cycle for all components

## Platform-Specific Examples

### Bun + Hono Backend TDD

**RED - Write test:**
```typescript
// src/services/product.service.test.ts
import { describe, it, expect, beforeEach } from 'bun:test';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let mockRepository: MockProductRepository;

  beforeEach(() => {
    mockRepository = new MockProductRepository();
    service = new ProductService(mockRepository);
  });

  it('should return all products', async () => {
    // Arrange
    const expectedProducts = [
      { id: '1', name: 'Product 1', price: 9.99 },
      { id: '2', name: 'Product 2', price: 19.99 },
    ];
    mockRepository.setProducts(expectedProducts);

    // Act
    const products = await service.getAll();

    // Assert
    expect(products).toEqual(expectedProducts);
  });
});

class MockProductRepository {
  private products: Product[] = [];

  setProducts(products: Product[]) {
    this.products = products;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }
}
```

**GREEN - Implement:**
```typescript
// src/services/product.service.ts
export class ProductService {
  constructor(private repository: ProductRepository) {}

  async getAll(): Promise<Product[]> {
    return await this.repository.findAll();
  }
}
```

**REFACTOR - Improve:**
```typescript
// src/services/product.service.ts
export class ProductService {
  constructor(private repository: ProductRepository) {}

  async getAll(options?: { limit?: number }): Promise<Product[]> {
    const products = await this.repository.findAll();

    if (options?.limit) {
      return products.slice(0, options.limit);
    }

    return products;
  }

  async getById(id: string): Promise<Product | null> {
    const products = await this.repository.findAll();
    return products.find(p => p.id === id) ?? null;
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct = { ...product, id: crypto.randomUUID() };
    await this.repository.save(newProduct);
    return newProduct;
  }
}
```

### Android (Room + Hilt) TDD

**RED - Write test:**
```kotlin
// app/src/test/java/com/example/ProductServiceTest.kt
class ProductServiceTest {
    private lateinit var service: ProductService
    private lateinit var mockRepository: MockProductRepository

    @Before
    fun setup() {
        mockRepository = MockProductRepository()
        service = ProductService(mockRepository)
    }

    @Test
    fun `getAllProducts returns list from repository`() = runTest {
        // Arrange
        val expectedProducts = listOf(
            Product(id = "1", name = "Product 1", price = 9.99),
            Product(id = "2", name = "Product 2", price = 19.99)
        )
        mockRepository.setProducts(expectedProducts)

        // Act
        val products = service.getAllProducts()

        // Assert
        assertEquals(expectedProducts, products)
    }
}
```

**GREEN - Implement:**
```kotlin
// app/src/main/java/com/example/ProductService.kt
@Singleton
class ProductService @Inject constructor(
    private val repository: ProductRepository
) {
    fun getAllProducts(): Flow<List<Product>> {
        return repository.getAllProducts()
            .catch { e -> emptyFlow() }
    }
}
```

**REFACTOR - Improve:**
```kotlin
@Singleton
class ProductService @Inject constructor(
    private val repository: ProductRepository,
    private val dispatcher: CoroutineDispatcher = Dispatchers.Default
) {
    fun getAllProducts(limit: Int? = null): Flow<List<Product>> {
        return repository.getAllProducts()
            .map { products ->
                limit?.let { products.take(it) } ?: products
            }
            .flowOn(dispatcher)
            .catch { e ->
                when (e) {
                    is EmptyDataException -> emptyList()
                    else -> throw e
                }
            }
    }

    suspend fun getProductById(id: String): Product? {
        return repository.getProductById(id)
            .firstOrNull()
    }
}
```

### Python (FastAPI) TDD

**RED - Write test:**
```python
# tests/test_product_service.py
import pytest
from unittest.mock import Mock
from services.product_service import ProductService

def test_get_all_products():
    # Arrange
    mock_repo = Mock()
    mock_repo.get_all.return_value = [
        {"id": "1", "name": "Product 1", "price": 9.99}
    ]
    service = ProductService(mock_repo)

    # Act
    products = service.get_all()

    # Assert
    assert len(products) == 1
    assert products[0]["name"] == "Product 1"
```

**GREEN - Implement:**
```python
# services/product_service.py
class ProductService:
    def __init__(self, repository):
        self.repository = repository

    def get_all(self):
        return self.repository.get_all()
```

**REFACTOR - Improve:**
```python
# services/product_service.py
class ProductService:
    def __init__(self, repository):
        self.repository = repository

    def get_all(self, limit: int = None):
        products = self.repository.get_all()
        if limit:
            return products[:limit]
        return products

    def get_by_id(self, product_id: str):
        products = self.repository.get_all()
        for product in products:
            if product["id"] == product_id:
                return product
        return None

    def create(self, product_data: dict):
        product = {
            "id": str(uuid.uuid4()),
            **product_data
        }
        self.repository.save(product)
        return product
```

## Isolated Testing Requirements

Backend unit tests MUST NOT depend on:

❌ **NOT ALLOWED:**
- HTTP requests to external APIs
- Database connections
- File system operations (for data)
- Real API calls
- Real database queries

✅ **REQUIRED:**
- Mock all repositories
- Mock all HTTP clients
- Mock all external dependencies
- Test pure business logic
- Test in-memory data structures

## Output Summary

After implementation, provide:
```
✅ Backend TDD Implementation Complete

Components Implemented:
- ProductService
- ProductRepository
- AuthController
- UserRepository

Tests Written: 15
- Passing: 15 ✅
- Failing: 0

Test Coverage:
- Business rules: 6/6 ✅
- Boundary conditions: 5/5 ✅
- Failure modes: 4/4 ✅

Isolation:
- All tests isolated from HTTP ✅
- All tests isolated from database ✅
- Mocked repositories ✅

Next Steps:
- Run full test suite: [test command]
- Run /execute-fe for frontend implementation
- Integration tests: [integration test command]
```

## Related Commands

- `/execute-fe` - Implement frontend features using TDD
- `/planning` - Create a plan
- `/validate-plan` - Check plan quality

## Notes

- Follows strict TDD: Tests FIRST, then implementation
- Red-Green-Refactor cycle for each component
- Tests MUST be isolated (no HTTP, no database)
- Platform-specific test frameworks supported
- Interactive test verification at each phase
- Split from original /execute for focused backend work
