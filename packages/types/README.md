# Type Validators using Zod

This package provides comprehensive Zod validators for all types in the architect-planner system. Validators ensure robust runtime validation of data structures across the entire application.

## Structure

The validators are organized into three modules:

- **`platform.ts`** - Platform detection and configuration validators
- **`task.ts`** - Task-related data structure validators
- **`plan.ts`** - Planning and architecture validators
- **`utils.ts`** - Validation utility functions

## Usage

### Basic Validation

```typescript
import { TaskSchema, validate, tryValidate } from '@architect-planner/types';

// Throws ZodError if invalid
const task = validate(TaskSchema, data);

// Safe validation with error handling
const result = tryValidate(TaskSchema, data);
if (result.success) {
  console.log('Valid task:', result.data);
} else {
  console.error('Validation errors:', result.errors);
}
```

### Validating Collections

```typescript
import { TaskSchema, validateMany } from '@architect-planner/types';

const data = [
  { id: '1', name: 'Task 1', ... },
  { id: '2', name: 'Task 2', ... },
  { /* invalid data */ },
];

const { valid, invalid } = validateMany(TaskSchema, data);
console.log(`Valid: ${valid.length}, Invalid: ${invalid.length}`);
```

### Formatting Errors

```typescript
import { formatValidationError } from '@architect-planner/types';

try {
  validate(TaskSchema, data);
} catch (error) {
  if (error instanceof ZodError) {
    console.error(formatValidationError(error));
  }
}
```

## Available Schemas

### Platform Validators

- `PlatformSchema` - Frontend/Backend platform type
- `FrameworkSchema` - Supported framework types
- `DetectedPlatformSchema` - Platform detection result
- `PlatformConfigSchema` - Platform configuration
- `PlatformPatternSchema` - Platform-specific patterns
- `ArchitecturePatternsSchema` - Architecture patterns for platforms
- `ModuleStructureSchema` - Module structure configuration
- `TestConfigSchema` - Test configuration by platform

### Task Validators

- `PrioritySchema` - Priority levels (critical, high, medium, low)
- `EffortSchema` - Effort estimation (S, M, L, XL)
- `TaskMetadataSchema` - Task metadata
- `TaskSchema` - Complete task entity
- `TaskCreateSchema` - Task creation input
- `TaskUpdateSchema` - Task update input
- `DependencyChainSchema` - Task dependency relationships
- `ProgressStatsSchema` - Task progress statistics

### Plan Validators

- `ProjectContextSchema` - Project context and overview
- `TechStackSchema` - Technology stack definition
- `FeatureSchema` - Feature definition
- `ComponentDefinitionSchema` - UI component definition
- `StateManagementSchema` - State management approach
- `ApiEndpointSchema` - API endpoint definition
- `RoutingConfigSchema` - Routing configuration
- `StylingConfigSchema` - Styling approach
- `FrontendArchitectureSchema` - Complete frontend architecture
- `ModuleDefinitionSchema` - Backend module definition
- `DatabaseConfigSchema` - Database configuration
- `ServiceDefinitionSchema` - Backend service definition
- `BackendArchitectureSchema` - Complete backend architecture
- `TestScenarioSchema` - Test scenario definition
- `TestingPlanSchema` - Complete testing plan
- `PlanSchema` - Complete project plan
- `ValidationReportSchema` - Validation report with results

## Integration with Application

### In Commands

```typescript
import { TaskSchema, tryValidate } from '@architect-planner/types';

export async function executeCommand(input: unknown) {
  const validation = tryValidate(TaskSchema, input);
  
  if (!validation.success) {
    return `Validation failed:\n${validation.errors
      .map(e => `  - ${e.path}: ${e.message}`)
      .join('\n')}`;
  }
  
  const task = validation.data;
  // Process validated task
}
```

### In APIs/Services

```typescript
import { PlanSchema, validate } from '@architect-planner/types';

export async function createPlan(data: unknown) {
  try {
    const plan = validate(PlanSchema, data);
    return await savePlan(plan);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(formatValidationError(error));
    }
    throw error;
  }
}
```

## Type Safety

Zod schemas are type-safe. You can infer TypeScript types from schemas:

```typescript
import { type z } from 'zod';
import { TaskSchema } from '@architect-planner/types';

type Task = z.infer<typeof TaskSchema>;
// Task type is now properly inferred from the schema
```

## Best Practices

1. **Always validate external input** - Use validators for data from files, APIs, or user input
2. **Use `tryValidate` for user-facing operations** - Provide better error messages
3. **Use `validate` for internal operations** - Fail fast in development
4. **Compose schemas** - Combine validators for complex objects
5. **Keep schemas updated** - Ensure schemas match TypeScript types when they change

## Validation Errors

The validators provide detailed error information:

```typescript
{
  success: false,
  errors: [
    {
      path: 'tasks[0].name',      // Path to the field
      message: 'String must be...',// Error message
      code: 'too_small'            // Zod error code
    }
  ]
}
```

Zod error codes include: `too_small`, `too_big`, `invalid_type`, `invalid_enum_value`, `invalid_literal`, etc.

## References

- [Zod Documentation](https://zod.dev/)
- [Zod Error Handling](https://zod.dev/?id=error-handling)
- [Zod Validation](https://zod.dev/?id=validation)
