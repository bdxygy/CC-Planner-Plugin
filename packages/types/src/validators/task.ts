/**
 * Zod validators for task types
 */

import { z } from 'zod';
import { PlatformSchema } from './platform.js';

// Priority validator
export const PrioritySchema = z.enum(['critical', 'high', 'medium', 'low']);

// Effort validator
export const EffortSchema = z.enum(['S', 'M', 'L', 'XL']);

// TaskMetadata validator
export const TaskMetadataSchema = z.object({
  planName: z.string().min(1),
  platform: PlatformSchema,
  framework: z.string().min(1),
  currentDependencies: z.array(z.string()),
  createdAt: z.string().datetime(),
  version: z.string().min(1),
});

// Task validator
export const TaskSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  level: PrioritySchema,
  component: z.string().min(1),
  files: z.string(),
  testsSuccess: z.array(z.string()),
  dependencies: z.array(z.string()),
  blockedBy: z.array(z.string()),
  blockedByTransitive: z.array(z.string()),
  dependencyChain: z.array(z.string()),
  blocks: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
  estimatedEffort: EffortSchema,
  implementationNotes: z.string(),
  done: z.boolean(),
  ready: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// TaskCreate validator
export const TaskCreateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  level: PrioritySchema,
  component: z.string().min(1),
  files: z.string().optional(),
  testsSuccess: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  blockedBy: z.array(z.string()).optional(),
  acceptanceCriteria: z.array(z.string()).optional(),
  estimatedEffort: EffortSchema.optional(),
  implementationNotes: z.string().optional(),
  done: z.boolean().optional(),
  ready: z.boolean().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// TaskUpdate validator
export const TaskUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  level: PrioritySchema.optional(),
  component: z.string().min(1).optional(),
  files: z.string().optional(),
  testsSuccess: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  blockedBy: z.array(z.string()).optional(),
  acceptanceCriteria: z.array(z.string()).optional(),
  estimatedEffort: EffortSchema.optional(),
  implementationNotes: z.string().optional(),
  done: z.boolean().optional(),
  ready: z.boolean().optional(),
});

// DependencyChain validator
export const DependencyChainSchema = z.object({
  task: TaskSchema,
  dependencies: z.array(
    z.object({
      task: TaskSchema,
      direct: z.boolean(),
    })
  ),
  dependents: z.array(TaskSchema),
  fullChain: z.array(z.string()),
});

// ProgressStats validator
export const ProgressStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  byLevel: z.record(PrioritySchema, z.number().int().nonnegative()),
  byStatus: z.object({
    done: z.number().int().nonnegative(),
    pending: z.number().int().nonnegative(),
    ready: z.number().int().nonnegative(),
    blocked: z.number().int().nonnegative(),
  }),
  foundation: z.number().int().nonnegative(),
  blocked: z.number().int().nonnegative(),
  completionRate: z.string().regex(/^\d+(\.\d+)?%$/),
});

// ValidationError validator
export const ValidationErrorSchema = z.object({
  type: z.string().min(1),
  severity: z.enum(['error', 'warning']),
  message: z.string().min(1),
});
