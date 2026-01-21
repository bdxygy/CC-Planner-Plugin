/**
 * Validation utility functions
 */

import { type ZodError, type ZodSchema } from 'zod';

/**
 * Parse and validate data against a Zod schema
 * Throws ZodError if validation fails
 */
export function validate<T>(schema: ZodSchema, data: unknown): T {
  return schema.parse(data) as T;
}

/**
 * Try to validate data against a Zod schema
 * Returns validation result with success/error info
 */
export function tryValidate<T>(
  schema: ZodSchema,
  data: unknown
): { success: true; data: T } | { success: false; errors: ValidationFailure[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data as T,
    };
  }

  return {
    success: false,
    errors: result.error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
    })),
  };
}

/**
 * Validate multiple items against a schema
 */
export function validateMany<T>(
  schema: ZodSchema,
  items: unknown[]
): { valid: T[]; invalid: ValidationFailure[] } {
  const valid: T[] = [];
  const invalid: ValidationFailure[] = [];

  items.forEach((item, index) => {
    const result = schema.safeParse(item);
    if (result.success) {
      valid.push(result.data as T);
    } else {
      result.error.errors.forEach((err) => {
        invalid.push({
          index,
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        });
      });
    }
  });

  return { valid, invalid };
}

/**
 * Extract validation error messages in a readable format
 */
export function formatValidationError(error: ZodError): string {
  return error.errors
    .map((err) => {
      const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
      return `${path}${err.message}`;
    })
    .join('\n');
}

export interface ValidationFailure {
  path?: string;
  message: string;
  code: string;
  index?: number;
}
