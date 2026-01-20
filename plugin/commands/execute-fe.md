---
description: Implement frontend features from a plan using Test-Driven Development (TDD). Generates tests first, then implementation, following Red-Green-Refactor cycle.
argument-hint: [feature-topic] [feature-name]
allowed-tools: ["AskUserQuestion", "Read", "Write", "Edit", "Glob", "Grep", "Bash", "TodoWrite", "mcp__plugin_context7_context7__resolve-library-id", "mcp__plugin_context7_context7__query-docs", "mcp__exa__get_code_context_exa", "mcp__exa__web_search_exa"]
---

# /execute-fe

Implement frontend features from an existing plan using Test-Driven Development. Generates tests FIRST, then implementation code, following the classic Red-Green-Refactor TDD cycle.

## When to Use

Use this command when:
- Implementing frontend components, views, or widgets
- Building UI features from a plan
- Following TDD methodology for frontend development
- Need test coverage before implementation

## TDD Workflow: Red-Green-Refactor

This command follows the classic TDD cycle:

1. **RED** - Write a failing test first
2. **GREEN** - Write minimal implementation to pass the test
3. **REFACTOR** - Improve the code while keeping tests green

## Execution Workflow

### 1. Load Task List or Plan

First, check if a task list exists from `/task-fe`, or load the plan directly:

```bash
# Option 1: Load existing task list from /task-fe
Read .pland/[feature-topic]/frontend-tasks.yaml
Read .pland/[feature-topic]/frontend-tasks.mdx

# Option 2: If no task list exists, load plan files directly
Read .pland/[feature-topic]/features.mdx
Read .pland/[feature-topic]/frontend-architecture.mdx
Read .pland/[feature-topic]/frontend-testing-scenarios.mdx
```

**Use AskUserQuestion to ask:**
- Which feature-topic plan to execute?
- Use existing task list from `/task-fe` or load plan directly?
- Implement entire frontend or specific features?
- Select specific tasks for implementation

**If using task list from `/task-fe`:**
- Load tasks from YAML for token efficiency
- Respect task priorities (High → Medium → Low)
- Check `dependencySummary` for foundation vs blocked tasks
- Use `blockedBy` to determine execution order

### 2. Detect Frontend Platform

Auto-detect the frontend platform from existing codebase:

**Use Glob to detect:**
- **Android**: `app/src/main/**/*.kt`, `build.gradle` with Compose/XML
- **iOS/Swift**: `**/*.swift`, `*.xcodeproj`
- **Flutter**: `lib/**/*.dart`, `pubspec.yaml`
- **React Native**: `package.json` with react-native, `components/**`
- **Tauri/Electron**: `src/**`, web framework detection
- **Web**: `src/components/**`, framework detection

**Load appropriate platform-specific skill:**
- Android → `android-patterns`
- iOS/Swift → `ios-swift-patterns`
- Flutter → `flutter-patterns`
- React Native → `react-native-patterns`
- Tauri → `tauri-patterns`
- Electron → `electron-patterns`
- Web → `architecture-patterns`

### 3. Select Testing Framework

**Use AskUserQuestion to present platform-specific options:**

**Android:**
- Compose UI Tests (Jetpack Compose)
- Espresso (classic UI tests)
- JUnit (unit tests)

**iOS/Swift:**
- XCTest (SwiftUI/UIKit)
- XCUITest (UI tests)
- Snapshot tests (iSnapshot)

**Flutter:**
- flutter_test (widget tests)
- golden tests (snapshot)
- integration tests

**React Native:**
- React Native Testing Library
- Jest (component tests)
- Detox (E2E tests)

**Web (React/Vue/Svelte):**
- Vitest/Jest (unit tests)
- Testing Library (component tests)
- Playwright/Cypress (E2E)

### 4. Create TODO List

**If using task list from `/task-fe`:**
```javascript
// Load tasks from frontend-tasks.yaml
// Create TODO items for each task with TDD phases
[
  { "content": "fe-001: Setup Navigation & Routing (RED)", "status": "pending", "phase": "red", "taskId": "fe-001" },
  { "content": "fe-001: Setup Navigation & Routing (GREEN)", "status": "pending", "phase": "green", "taskId": "fe-001" },
  { "content": "fe-001: Setup Navigation & Routing (REFACTOR)", "status": "pending", "phase": "refactor", "taskId": "fe-001" },
  { "content": "fe-002: Create ProductCard Component (RED)", "status": "pending", "phase": "red", "taskId": "fe-002" },
  // ...
]
```

**If loading plan directly:**
```javascript
// Example TODO structure
[
  { "content": "Write test for ProductCard component", "status": "pending", "phase": "red" },
  { "content": "Implement ProductCard component", "status": "pending", "phase": "green" },
  { "content": "Refactor ProductCard for reusability", "status": "pending", "phase": "refactor" },
  // ...
]
```

**TODO phases:**
- `red`: Write failing test
- `green`: Implement to pass test
- `refactor`: Improve implementation

**Task execution order (from task list):**
1. Start with foundation tasks (empty `blockedBy`)
2. Follow priority: High → Medium → Low
3. Check `dependencyChain` for transitive dependencies
4. Mark tasks complete as dependencies are satisfied

### 5. TDD Implementation Cycle

For each feature component, follow Red-Green-Refactor:

#### RED Phase: Write Failing Test

**Generate test file first:**
```bash
# Create test file alongside component
# Android: app/src/test/java/com/example/ProductCardTest.kt
# iOS: Tests/ProductCardTests.swift
# Flutter: test/product_card_test.dart
# React Native: ProductCard.test.tsx
```

**Test structure based on plan scenarios:**
- Happy path tests
- Edge case tests
- Failure state tests
- Platform-specific scenarios (rotation, permissions, etc.)

**Write test using Context7 and Exa for framework-specific patterns:**
- Query Context7 for testing framework documentation (official APIs)
- Use Exa `get_code_context_exa` for real-world test examples
- Use Exa `web_search_exa` for latest testing patterns and tutorials
- Use platform-specific testing patterns

**Run test - must FAIL:**
```bash
# Platform-specific test commands
# Android: ./gradlew test
# iOS: swift test
# Flutter: flutter test
# React Native: npm test
```

#### GREEN Phase: Implement Feature

**Generate implementation file:**
```bash
# Create component file
# Android: app/src/main/java/com/example/ProductCard.kt
# iOS: Sources/ProductCard.swift
# Flutter: lib/product_card.dart
# React Native: src/components/ProductCard.tsx
```

**Implementation guidelines:**
- Write MINIMAL code to pass the test
- Focus on happy path first
- Use platform-specific patterns from loaded skill
- Use Context7 for framework implementation patterns (official APIs)
- Use Exa `get_code_context_exa` for real-world component examples
- Use Exa `web_search_exa` for latest implementation tutorials

**Run test - must PASS:**
```bash
# Re-run test
```

#### REFACTOR Phase: Improve Code

**Refactoring checklist:**
- Extract reusable logic
- Improve naming
- Remove duplication
- Apply platform-specific best practices

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

### Android TDD (Jetpack Compose)

**RED - Write test:**
```kotlin
// app/src/test/java/com/example/ProductCardTest.kt
class ProductCardTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun productCard_displaysProductName() {
        val product = Product(name = "Test Product", price = 9.99)

        composeTestRule.setContent {
            ProductCard(product = product)
        }

        composeTestRule.onNodeWithText("Test Product").assertExists()
    }
}
```

**GREEN - Implement:**
```kotlin
// app/src/main/java/com/example/ProductCard.kt
@Composable
fun ProductCard(product: Product) {
    Card {
        Column {
            Text(product.name)
            Text("$${product.price}")
        }
    }
}
```

**REFACTOR - Improve:**
```kotlin
// Extract styles, add modifiers, improve structure
@Composable
fun ProductCard(
    product: Product,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    Card(
        modifier = modifier.clickable { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = product.name,
                style = MaterialTheme.typography.titleLarge
            )
            Text(
                text = "$${product.price}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.secondary
            )
        }
    }
}
```

### iOS TDD (SwiftUI)

**RED - Write test:**
```swift
// Tests/ProductCardTests.swift
import XCTest
import SwiftUI
@testable import MyApp

struct ProductCardTests: XCTestCase {
    func testProductCardDisplaysName() {
        let product = Product(name: "Test Product", price: 9.99)

        let card = ProductCard(product: product)

        // Verify product name is displayed
        // (Use accessibility identifiers or snapshot testing)
    }
}
```

**GREEN - Implement:**
```swift
// Sources/ProductCard.swift
import SwiftUI

struct ProductCard: View {
    let product: Product

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(product.name)
                .font(.headline)
            Text("$\(product.price)")
                .foregroundColor(.secondary)
        }
        .padding()
    }
}
```

**REFACTOR - Improve:**
```swift
struct ProductCard: View {
    let product: Product
    var onTap: (() -> Void)?

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(product.name)
                .font(.headline)
            Text(product.formattedPrice)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .shadow(radius: 2)
        .contentShape(Rectangle())
        .onTapGesture {
            onTap?()
        }
    }
}

extension Product {
    var formattedPrice: String {
        String(format: "$%.2f", price)
    }
}
```

### Flutter TDD

**RED - Write test:**
```dart
// test/product_card_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:myapp/product_card.dart';

void main() {
  testWidgets('ProductCard displays product name', (tester) async {
    const product = Product(name: 'Test Product', price: 9.99);

    await tester.pumpWidget(MaterialApp(
      home: ProductCard(product: product),
    ));

    expect(find.text('Test Product'), findsOneWidget);
  });
}
```

**GREEN - Implement:**
```dart
// lib/product_card.dart
class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(product.name, style: Theme.of(context).textTheme.titleLarge),
            Text('\$${product.price}'),
          ],
        ),
      ),
    );
  }
}
```

**REFACTOR - Improve:**
```dart
class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback? onTap;

  const ProductCard({
    super.key,
    required this.product,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Card(
        elevation: 2,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                product.name,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                product.formattedPrice,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

extension Product on Product {
  String get formattedPrice => '\$${price.toStringAsFixed(2)}';
}
```

### React Native TDD

**RED - Write test:**
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react-native';
import { ProductCard } from '../ProductCard';

describe('ProductCard', () => {
  it('displays product name', () => {
    const product = { name: 'Test Product', price: 9.99 };

    render(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeTruthy();
  });
});
```

**GREEN - Implement:**
```typescript
// src/components/ProductCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProductCardProps {
  product: { name: string; price: number };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
};
```

**REFACTOR - Improve:**
```typescript
// src/components/ProductCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ProductCardProps {
  product: { name: string; price: number };
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
    </TouchableOpacity>
  );
};

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#666',
  },
});
```

## Output Summary

After implementation, provide:
```
✅ Frontend TDD Implementation Complete

Components Implemented:
- ProductCard
- ProductList
- FilterBar
- CartButton

Tests Written: 12
- Passing: 12 ✅
- Failing: 0

Test Coverage:
- Happy paths: 4/4 ✅
- Edge cases: 5/5 ✅
- Failure states: 3/3 ✅

Next Steps:
- Run full test suite: [test command]
- Start development server: [dev command]
- Run /execute-be for backend implementation
```

## Related Commands

- `/task-fe` - Create frontend task lists from plans (run before /execute-fe)
- `/execute-be` - Implement backend features using TDD
- `/planning` - Create a plan
- `/validate-plan` - Check plan quality

## Notes

- Follows strict TDD: Tests FIRST, then implementation
- Red-Green-Refactor cycle for each component
- Platform-specific test frameworks supported
- Interactive test verification at each phase
- Split from original /execute for focused frontend work
- **Context7** for official API documentation and testing frameworks
- **Exa** for code examples and implementation patterns:
  - `get_code_context_exa` - Real-world component examples
  - `web_search_exa` - Latest tutorials and best practices
