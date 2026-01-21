/**
 * Local task models with Zod schemas
 */

import { z } from 'zod';

// Zod schemas for local models

export const DependencyChainSchema = z.object({
  task: z.object({
    id: z.string(),
  }),
  dependencies: z.array(
    z.object({
      task: z.object({
        id: z.string(),
        name: z.string(),
      }),
      direct: z.boolean(),
    })
  ),
  dependents: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  fullChain: z.array(z.string()),
});

export const ProgressStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  byLevel: z.record(
    z.enum(['critical', 'high', 'medium', 'low']),
    z.number().int().nonnegative()
  ),
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

// TypeScript types inferred from schemas
export type DependencyChain = z.infer<typeof DependencyChainSchema>;
export type ProgressStats = z.infer<typeof ProgressStatsSchema>;
