/**
 * Task validation using Zod schemas
 */

import { z } from 'zod';
import type { Task, TaskCreate, TaskUpdate, TaskMetadata } from '@architect-planner/types';
import {
  TaskSchema,
  TaskCreateSchema,
  TaskUpdateSchema,
  TaskMetadataSchema,
} from '@architect-planner/types';
import { ValidationError } from '../errors/index.js';

/**
 * Validate task data
 */
export function validateTask(data: unknown): Task {
  const result = TaskSchema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    throw new ValidationError(
      `Invalid task: ${firstError?.message}`,
      firstError?.path.join('.'),
      result.error.flatten()
    );
  }
  return result.data;
}

/**
 * Validate task creation data
 */
export function validateTaskCreate(data: unknown): TaskCreate {
  const result = TaskCreateSchema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    throw new ValidationError(
      `Invalid task data: ${firstError?.message}`,
      firstError?.path.join('.'),
      result.error.flatten()
    );
  }
  return result.data;
}

/**
 * Validate task update data
 */
export function validateTaskUpdate(data: unknown): TaskUpdate {
  const result = TaskUpdateSchema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    throw new ValidationError(
      `Invalid update data: ${firstError?.message}`,
      firstError?.path.join('.'),
      result.error.flatten()
    );
  }
  return result.data;
}

/**
 * Validate metadata
 */
export function validateMetadata(data: unknown): TaskMetadata {
  const result = TaskMetadataSchema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    throw new ValidationError(
      `Invalid metadata: ${firstError?.message}`,
      firstError?.path.join('.'),
      result.error.flatten()
    );
  }
  return result.data;
}

/**
 * Validate task ID format
 */
export function validateTaskId(id: string): void {
  const taskIdSchema = z
    .string()
    .regex(/^(fe|be)-\d{4}$/, 'Task ID must be in format fe-XXXX or be-XXXX');
  const result = taskIdSchema.safeParse(id);
  if (!result.success) {
    throw new ValidationError(`Invalid task ID: ${id}`, 'id', result.error.flatten());
  }
}

/**
 * Validate JSONL file structure
 */
export interface JsonlValidationIssue {
  type: 'format' | 'structure' | 'dependency' | 'data';
  severity: 'error' | 'warning';
  line?: number;
  taskId?: string;
  message: string;
}

export function validateJsonlFile(content: string): JsonlValidationIssue[] {
  const issues: JsonlValidationIssue[] = [];
  const lines = content.trim().split('\n');
  const taskIds = new Set<string>();
  const tasks: Map<string, Task> = new Map();

  // Parse all lines
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    if (!line.trim()) continue;

    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch (err) {
      issues.push({
        type: 'format',
        severity: 'error',
        line: lineNum + 1,
        message: `Invalid JSON: ${err instanceof Error ? err.message : 'Parse error'}`,
      });
      continue;
    }

    // Validate structure
    const result = TaskSchema.safeParse(parsed);
    if (!result.success) {
      const firstError = result.error.errors[0];
      issues.push({
        type: 'structure',
        severity: 'error',
        line: lineNum + 1,
        taskId: (parsed as Record<string, unknown>).id as string,
        message: `${firstError?.path.join('.') || 'root'}: ${firstError?.message}`,
      });
      continue;
    }

    const task = result.data;
    taskIds.add(task.id);
    tasks.set(task.id, task);
  }

  // Validate dependencies
  for (const [taskId, task] of tasks.entries()) {
    // Check blockedBy references exist
    for (const blockedById of task.blockedBy) {
      if (!taskIds.has(blockedById)) {
        issues.push({
          type: 'dependency',
          severity: 'error',
          taskId,
          message: `blockedBy references non-existent task: ${blockedById}`,
        });
      }

      // Check self-reference
      if (blockedById === taskId) {
        issues.push({
          type: 'dependency',
          severity: 'error',
          taskId,
          message: `Task cannot block itself`,
        });
      }
    }


  }

  // Check for circular dependencies
  const circularDeps = detectCircularDependencies(Array.from(tasks.values()));
  for (const dep of circularDeps) {
    issues.push({
      type: 'dependency',
      severity: 'error',
      taskId: dep.taskId,
      message: dep.message,
    });
  }

  // Validate data consistency
  for (const [taskId, task] of tasks.entries()) {
    // Check timestamp consistency
    if (new Date(task.createdAt) > new Date(task.updatedAt)) {
      issues.push({
        type: 'data',
        severity: 'warning',
        taskId,
        message: `createdAt (${task.createdAt}) is after updatedAt (${task.updatedAt})`,
      });
    }
  }

  return issues;
}

/**
 * Detect circular dependencies in tasks
 */
function detectCircularDependencies(
  tasks: Task[]
): Array<{ taskId: string; message: string }> {
  const issues: Array<{ taskId: string; message: string }> = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const dfs = (taskId: string, path: string[]): void => {
    if (recursionStack.has(taskId)) {
      const cycle = [...path, taskId].join(' → ');
      issues.push({
        taskId: path[0] ?? taskId,
        message: `Circular dependency: ${cycle}`,
      });
      return;
    }

    if (visited.has(taskId)) {
      return;
    }

    visited.add(taskId);
    recursionStack.add(taskId);

    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      for (const depId of task.blockedBy) {
        dfs(depId, [...path, taskId]);
      }
    }

    recursionStack.delete(taskId);
  };

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      dfs(task.id, []);
    }
  }

  return issues;
}
