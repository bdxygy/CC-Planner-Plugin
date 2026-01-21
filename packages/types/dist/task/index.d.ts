/**
 * Task-related types (inferred from Zod schemas)
 */
import { type z } from 'zod';
import { PrioritySchema, EffortSchema, TaskMetadataSchema, TaskSchema, TaskCreateSchema, TaskUpdateSchema, DependencyChainSchema, ProgressStatsSchema, ValidationErrorSchema } from '../validators/task.js';
export type Priority = z.infer<typeof PrioritySchema>;
export type Effort = z.infer<typeof EffortSchema>;
export type TaskMetadata = z.infer<typeof TaskMetadataSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
export type DependencyChain = z.infer<typeof DependencyChainSchema>;
export type ProgressStats = z.infer<typeof ProgressStatsSchema>;
export type ValidationError = z.infer<typeof ValidationErrorSchema>;
//# sourceMappingURL=index.d.ts.map