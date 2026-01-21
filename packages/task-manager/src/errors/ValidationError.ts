/**
 * Base error class for all task-manager errors
 */
export abstract class TaskManagerError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Validation error for invalid input data
 */
export class ValidationError extends TaskManagerError {
  readonly code = 'VALIDATION_ERROR' as const;

  constructor(
    message: string,
    public readonly field?: string,
    public readonly details?: unknown
  ) {
    super(message);
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends TaskManagerError {
  readonly code = 'NOT_FOUND' as const;

  constructor(
    resource: string,
    public readonly id: string
  ) {
    super(`${resource} not found: ${id}`);
  }
}

/**
 * Conflict error for duplicate resources
 */
export class ConflictError extends TaskManagerError {
  readonly code = 'CONFLICT' as const;

  constructor(
    message: string,
    public readonly conflictingId?: string
  ) {
    super(message);
  }
}

/**
 * Dependency error for circular dependencies
 */
export class DependencyError extends TaskManagerError {
  readonly code = 'DEPENDENCY_ERROR' as const;

  constructor(
    message: string,
    public readonly chain: string[]
  ) {
    super(message);
  }
}
