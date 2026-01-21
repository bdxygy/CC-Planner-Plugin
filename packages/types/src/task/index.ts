/**
 * Task-related types (inferred from Zod schemas)
 */

import { type z } from 'zod';
import {
  PrioritySchema,
  EffortSchema,
  TaskMetadataSchema,
  TaskSchema,
  TaskCreateSchema,
  TaskUpdateSchema,
  DependencyChainSchema,
  ProgressStatsSchema,
  ValidationErrorSchema,
} from '../validators/task.js';

// Priority levels
export type Priority = z.infer<typeof PrioritySchema>;

// Effort estimation
export type Effort = z.infer<typeof EffortSchema>;

// Task metadata
export type TaskMetadata = z.infer<typeof TaskMetadataSchema>;

// Task entity
export type Task = z.infer<typeof TaskSchema>;

// Task creation input (partial fields)
export type TaskCreate = z.infer<typeof TaskCreateSchema>;

// Task update input (all optional)
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;

// Dependency chain representation
export type DependencyChain = z.infer<typeof DependencyChainSchema>;

// Progress statistics
export type ProgressStats = z.infer<typeof ProgressStatsSchema>;

// Validation error
export type ValidationError = z.infer<typeof ValidationErrorSchema>;
