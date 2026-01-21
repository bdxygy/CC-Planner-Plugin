/**
 * Validation utilities
 */
import type { ValidationError } from '@architect-planner/types';
/**
 * Check if a value is defined (not null or undefined)
 */
export declare function isDefined<T>(value: T | null | undefined): value is T;
/**
 * Check if a string is not empty
 */
export declare function isNonEmptyString(value: unknown): value is string;
/**
 * Check if an array is not empty
 */
export declare function isNonEmptyArray<T>(value: unknown): value is T[];
/**
 * Validate task ID format
 */
export declare function isValidTaskId(taskId: string): boolean;
/**
 * Validate plan name format
 */
export declare function isValidPlanName(name: string): boolean;
/**
 * Validate platform value
 */
export declare function isValidPlatform(platform: string): platform is 'frontend' | 'backend';
/**
 * Validate priority value
 */
export declare function isValidPriority(priority: string): priority is 'critical' | 'high' | 'medium' | 'low';
/**
 * Validate effort value
 */
export declare function isValidEffort(effort: string): effort is 'S' | 'M' | 'L' | 'XL';
/**
 * Create a validation error
 */
export declare function createValidationError(type: string, message: string, severity?: 'error' | 'warning', field?: string): ValidationError;
/**
 * Validate an object against a schema
 */
export declare function validateSchema<T>(data: unknown, schema: {
    required?: string[];
    optional?: string[];
    validate?: (value: T) => ValidationError[];
}): ValidationError[];
/**
 * Validate dependencies are not circular
 */
export declare function detectCircularDependencies(tasks: Array<{
    id: string;
    dependencies: string[];
}>): ValidationError[];
//# sourceMappingURL=index.d.ts.map