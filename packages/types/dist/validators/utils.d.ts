/**
 * Validation utility functions
 */
import { type ZodError, type ZodSchema } from 'zod';
/**
 * Parse and validate data against a Zod schema
 * Throws ZodError if validation fails
 */
export declare function validate<T>(schema: ZodSchema, data: unknown): T;
/**
 * Try to validate data against a Zod schema
 * Returns validation result with success/error info
 */
export declare function tryValidate<T>(schema: ZodSchema, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    errors: ValidationFailure[];
};
/**
 * Validate multiple items against a schema
 */
export declare function validateMany<T>(schema: ZodSchema, items: unknown[]): {
    valid: T[];
    invalid: ValidationFailure[];
};
/**
 * Extract validation error messages in a readable format
 */
export declare function formatValidationError(error: ZodError): string;
export interface ValidationFailure {
    path?: string;
    message: string;
    code: string;
    index?: number;
}
//# sourceMappingURL=utils.d.ts.map