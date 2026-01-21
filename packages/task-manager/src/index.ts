/**
 * Task Manager CLI - Entry point
 */

// Re-export specific types from @architect-planner/types (excluding ValidationError which conflicts with local class)
export type {
  Priority,
  Effort,
  TaskMetadata,
  Task,
  TaskCreate,
  TaskUpdate,
  DependencyChain,
  ProgressStats,
} from '@architect-planner/types';

export type {
  TechStack,
  ProjectContext,
  Feature,
  FrontendArchitecture,
  BackendArchitecture,
  TestingPlan,
  ValidationReport,
  ValidationSummary,
} from '@architect-planner/types';

export type { Platform, DetectedPlatform, PlatformConfig } from '@architect-planner/types';

// Export for programmatic use
export { TaskService } from './task/service.js';
export { TaskRepository } from './task/repository.js';
export * from './errors/index.js';
export * from './shared/index.js';

// Import CLI module (side-effect import for CLI execution)
import './cli.js';
