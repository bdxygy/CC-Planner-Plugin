/**
 * Validation utilities
 */
/**
 * Check if a value is defined (not null or undefined)
 */
export function isDefined(value) {
    return value !== null && value !== undefined;
}
/**
 * Check if a string is not empty
 */
export function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
/**
 * Check if an array is not empty
 */
export function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}
/**
 * Validate task ID format
 */
export function isValidTaskId(taskId) {
    return /^[a-z]{2}-[a-z0-9-]+-\d{3}$/.test(taskId);
}
/**
 * Validate plan name format
 */
export function isValidPlanName(name) {
    return /^[a-z0-9-]+$/.test(name) && name.length > 0 && name.length < 50;
}
/**
 * Validate platform value
 */
export function isValidPlatform(platform) {
    return platform === 'frontend' || platform === 'backend';
}
/**
 * Validate priority value
 */
export function isValidPriority(priority) {
    return ['critical', 'high', 'medium', 'low'].includes(priority);
}
/**
 * Validate effort value
 */
export function isValidEffort(effort) {
    return ['S', 'M', 'L', 'XL'].includes(effort);
}
/**
 * Create a validation error
 */
export function createValidationError(type, message, severity = 'error', field) {
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
export function validateSchema(data, schema) {
    const errors = [];
    if (typeof data !== 'object' || data === null) {
        errors.push(createValidationError('schema', 'Data must be an object'));
        return errors;
    }
    const obj = data;
    // Check required fields
    for (const field of schema.required || []) {
        if (!isDefined(obj[field])) {
            errors.push(createValidationError('schema', `Missing required field: ${field}`, 'error', field));
        }
    }
    // Run custom validation
    if (schema.validate) {
        try {
            const customErrors = schema.validate(obj);
            errors.push(...customErrors);
        }
        catch {
            errors.push(createValidationError('schema', 'Custom validation failed'));
        }
    }
    return errors;
}
/**
 * Validate dependencies are not circular
 */
export function detectCircularDependencies(tasks) {
    const errors = [];
    const visited = new Set();
    const recursionStack = new Set();
    function dfs(taskId, path) {
        if (recursionStack.has(taskId)) {
            const cycle = [...path, taskId].join(' -> ');
            errors.push(createValidationError('dependency', `Circular dependency detected: ${cycle}`, 'error', taskId));
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
//# sourceMappingURL=index.js.map