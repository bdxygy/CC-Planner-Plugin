/**
 * Validation utilities
 */

import type { ValidationError } from '@architect-planner/types';

/**
 * Check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if a string is not empty
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if an array is not empty
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Validate task ID format
 */
export function isValidTaskId(taskId: string): boolean {
  return /^[a-z]{2}-[a-z0-9-]+-\d{3}$/.test(taskId);
}

/**
 * Validate plan name format
 */
export function isValidPlanName(name: string): boolean {
  return /^[a-z0-9-]+$/.test(name) && name.length > 0 && name.length < 50;
}

/**
 * Validate platform value
 */
export function isValidPlatform(platform: string): platform is 'frontend' | 'backend' {
  return platform === 'frontend' || platform === 'backend';
}

/**
 * Validate priority value
 */
export function isValidPriority(
  priority: string
): priority is 'critical' | 'high' | 'medium' | 'low' {
  return ['critical', 'high', 'medium', 'low'].includes(priority);
}

/**
 * Validate effort value
 */
export function isValidEffort(effort: string): effort is 'S' | 'M' | 'L' | 'XL' {
  return ['S', 'M', 'L', 'XL'].includes(effort);
}

/**
 * Create a validation error
 */
export function createValidationError(
  type: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
  field?: string
): ValidationError {
  return {
    type,
    severity,
    message,
    ...(field && { field }),
  };
}

/**
 * Validate an object against a schema
 */
export function validateSchema<T>(
  data: unknown,
  schema: {
    required?: string[];
    optional?: string[];
    validate?: (value: T) => ValidationError[];
  }
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push(createValidationError('schema', 'Data must be an object'));
    return errors;
  }

  const obj = data as Record<string, unknown>;

  // Check required fields
  for (const field of schema.required || []) {
    if (!isDefined(obj[field])) {
      errors.push(
        createValidationError('schema', `Missing required field: ${field}`, 'error', field)
      );
    }
  }

  // Run custom validation
  if (schema.validate) {
    try {
      const customErrors = schema.validate(obj as T);
      errors.push(...customErrors);
    } catch {
      errors.push(createValidationError('schema', 'Custom validation failed'));
    }
  }

  return errors;
}

/**
 * Validate dependencies are not circular
 */
export function detectCircularDependencies(
  tasks: Array<{ id: string; dependencies: string[] }>
): ValidationError[] {
  const errors: ValidationError[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(taskId: string, path: string[]): boolean {
    if (recursionStack.has(taskId)) {
      const cycle = [...path, taskId].join(' -> ');
      errors.push(
        createValidationError(
          'dependency',
          `Circular dependency detected: ${cycle}`,
          'error',
          taskId
        )
      );
      return true;
    }

    if (visited.has(taskId)) {
      return false;
    }

    visited.add(taskId);
    recursionStack.add(taskId);

    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      for (const depId of task.dependencies) {
        dfs(depId, [...path, taskId]);
      }
    }

    recursionStack.delete(taskId);
    return false;
  }

  for (const task of tasks) {
    dfs(task.id, []);
  }

  return errors;
}
