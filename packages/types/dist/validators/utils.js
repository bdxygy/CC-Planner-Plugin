/**
 * Validation utility functions
 */
/**
 * Parse and validate data against a Zod schema
 * Throws ZodError if validation fails
 */
export function validate(schema, data) {
    return schema.parse(data);
}
/**
 * Try to validate data against a Zod schema
 * Returns validation result with success/error info
 */
export function tryValidate(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return {
            success: true,
            data: result.data,
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
export function validateMany(schema, items) {
    const valid = [];
    const invalid = [];
    items.forEach((item, index) => {
        const result = schema.safeParse(item);
        if (result.success) {
            valid.push(result.data);
        }
        else {
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
export function formatValidationError(error) {
    return error.errors
        .map((err) => {
        const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
        return `${path}${err.message}`;
    })
        .join('\n');
}
//# sourceMappingURL=utils.js.map