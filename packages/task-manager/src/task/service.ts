/**
 * Task service - business logic for task management
 */

import type { Task, TaskCreate, TaskUpdate, TaskMetadata, ValidationError as ValidationErrorType } from '@architect-planner/types';
import type { Platform, Priority } from '../shared/index.js';
import type { DependencyChain, ProgressStats } from './models.js';
import { TaskRepository } from './repository.js';
import { NotFoundError, ConflictError } from '../errors/index.js';
import { getNextTaskId } from '../shared/index.js';

export class TaskService {
  private repository: TaskRepository;
  private tasks: Task[] = [];
  public metadata: TaskMetadata | null = null;

  constructor(planName: string, platform: Platform) {
    this.repository = new TaskRepository(planName, platform);
    this.load();
  }

  /**
   * Load tasks from repository
   */
  load(): void {
    const { tasks, metadata } = this.repository.load();
    this.tasks = tasks;
    this.metadata = metadata;
    this.rebuildDependencies();
  }

  /**
   * Save tasks to repository
   */
  save(): void {
    this.repository.save(this.tasks, this.metadata ?? undefined);
  }

  /**
   * Get task file path
   */
  getFilePath(): string {
    return this.repository.getFilePath();
  }

  /**
   * Initialize task file with metadata
   */
  init(options: { framework?: string; deps?: string[] } = {}): void {
    if (this.repository.exists() && this.tasks.length > 0) {
      console.log('Task file already exists');
      return;
    }

    this.metadata = {
      planName: this.getPlanName(),
      platform: this.getPlatform(),
      framework: options.framework ?? 'unknown',
      currentDependencies: options.deps ?? [],
      createdAt: new Date().toISOString(),
      version: '1.0.0',
    };

    this.save();
    console.log(`Initialized: ${this.repository.getFilePath()}`);
    console.log(`  Plan: ${this.metadata.planName} | Platform: ${this.metadata.platform}`);
  }

  /**
   * Get plan name
   */
  private getPlanName(): string {
    const match = this.repository.getFilePath().match(/\.pland\/([^/]+)\//);
    return match?.[1] ?? 'unknown';
  }

  /**
   * Get platform
   */
  private getPlatform(): 'frontend' | 'backend' {
    const match = this.repository.getFilePath().match(/(frontend|backend)-tasks\.jsonl$/);
    return (match?.[1] ?? 'frontend') as 'frontend' | 'backend';
  }

  /**
   * Create a new task
   */
  create(data: TaskCreate): Task {
    // Validate ID is unique
    if (this.repository.isDuplicate(this.tasks, data.id)) {
      throw new ConflictError(`Task ID already exists: ${data.id}`, data.id);
    }

    const task: Task = {
      id: data.id,
      name: data.name,
      level: data.level,
      component: data.component,
      files: data.files ?? '',
      testsSuccess: data.testsSuccess ?? [],
      blockedBy: data.blockedBy ?? [],
      blockedByTransitive: [],
      dependencyChain: [],
      blocks: [],
      acceptanceCriteria: data.acceptanceCriteria ?? [],
      estimatedEffort: data.estimatedEffort ?? 'M',
      implementationNotes: data.implementationNotes ?? '',
      done: data.done ?? false,
      ready: data.ready ?? true,
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: data.updatedAt ?? new Date().toISOString(),
    };

    this.tasks.push(task);
    this.rebuildDependencies();
    this.save();
    return task;
  }

  /**
   * Update an existing task
   */
  update(id: string, updates: TaskUpdate): Task {
    const task = this.repository.findById(this.tasks, id);
    if (!task) {
      throw new NotFoundError('Task', id);
    }

    Object.assign(task, updates);
    task.updatedAt = new Date().toISOString();

    this.rebuildDependencies();
    this.save();
    return task;
  }

  /**
   * Remove a task
   */
  remove(id: string): void {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundError('Task', id);
    }

    const dependents = this.repository.findDependents(this.tasks, id);
    if (dependents.length > 0) {
      console.warn(`Warning: ${dependents.length} task(s) depend on ${id}:`);
      for (const dep of dependents) {
        console.warn(`  - ${dep.id}: ${dep.name}`);
      }
    }

    this.tasks.splice(index, 1);
    this.rebuildDependencies();
    this.save();
  }

  /**
   * Get task by ID
   */
  get(id: string): Task | undefined {
    return this.repository.findById(this.tasks, id);
  }

  /**
   * List tasks with optional filtering
   */
  list(
    options: {
      level?: Priority;
      done?: boolean;
      ready?: boolean;
      foundation?: boolean;
    } = {}
  ): Task[] {
    let filtered = [...this.tasks];

    if (options.level) {
      filtered = filtered.filter((t) => t.level === options.level);
    }
    if (options.done !== undefined) {
      filtered = filtered.filter((t) => t.done === options.done);
    }
    if (options.ready !== undefined) {
      filtered = filtered.filter((t) => t.ready === options.ready);
    }
    if (options.foundation) {
      filtered = filtered.filter((t) => !t.blockedBy || t.blockedBy.length === 0);
    }

    // Sort by priority then ID
    const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
    filtered.sort((a, b) => {
      const diff = priorityWeight[b.level] - priorityWeight[a.level];
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    });

    return filtered;
  }

  /**
   * Get dependency chain for a task
   */
  getChain(id: string): DependencyChain {
    const task = this.get(id);
    if (!task) {
      throw new NotFoundError('Task', id);
    }

    const taskMap = new Map(this.tasks.map((t) => [t.id, t]));
    const chain: DependencyChain = {
      task: { id: task.id },
      dependencies: [],
      dependents: [],
      fullChain: [],
    };

    // Direct dependencies
    if (task.blockedBy) {
      for (const depId of task.blockedBy) {
        const depTask = taskMap.get(depId);
        if (depTask) {
          chain.dependencies.push({ task: { id: depTask.id, name: depTask.name }, direct: true });
        }
      }
    }

    // Transitive dependencies
    if (task.blockedByTransitive) {
      for (const depId of task.blockedByTransitive) {
        const depTask = taskMap.get(depId);
        if (depTask && !chain.dependencies.find((d) => d.task.id === depId)) {
          chain.dependencies.push({ task: { id: depTask.id, name: depTask.name }, direct: false });
        }
      }
    }

    // Dependents
    if (task.blocks) {
      for (const blockerId of task.blocks) {
        const blockerTask = taskMap.get(blockerId);
        if (blockerTask) {
          chain.dependents.push({ id: blockerTask.id, name: blockerTask.name });
        }
      }
    }

    chain.fullChain = task.dependencyChain ?? [];
    return chain;
  }

  /**
   * Validate for circular dependencies and conflicts
   */
  validate(): ValidationErrorType[] {
    const issues: ValidationErrorType[] = [];
    const taskMap = new Map(this.tasks.map((t) => [t.id, t]));

    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (taskId: string, path: string[] = []): void => {
      if (recursionStack.has(taskId)) {
        issues.push({
          type: 'circular',
          severity: 'error',
          message: `Circular dependency: [...${path.slice(-3)}, ${taskId}].join(' → ')`,
        });
        return;
      }
      if (visited.has(taskId)) return;

      visited.add(taskId);
      recursionStack.add(taskId);

      const task = taskMap.get(taskId);
      if (task && task.blockedBy) {
        for (const depId of task.blockedBy) {
          dfs(depId, [...path, taskId]);
        }
      }
      recursionStack.delete(taskId);
    };

    for (const task of this.tasks) {
      dfs(task.id);
    }

    // Check for invalid references
    for (const task of this.tasks) {
      if (task.blockedBy) {
        for (const depId of task.blockedBy) {
          if (!taskMap.has(depId)) {
            issues.push({
              type: 'invalid-reference',
              severity: 'warning',
              message: `Task ${task.id} references non-existent ${depId}`,
            });
          }
        }
      }
    }

    return issues;
  }

  /**
   * Get progress statistics
   */
  getProgress(): ProgressStats {
    const stats: ProgressStats = {
      total: this.tasks.length,
      byLevel: { critical: 0, high: 0, medium: 0, low: 0 },
      byStatus: { done: 0, pending: 0, ready: 0, blocked: 0 },
      foundation: 0,
      blocked: 0,
      completionRate: '0',
    };

    for (const task of this.tasks) {
      stats.byLevel[task.level] = (stats.byLevel[task.level] ?? 0) + 1;
      if (task.done) {
        stats.byStatus.done++;
      } else if (task.ready) {
        stats.byStatus.ready++;
      } else {
        stats.byStatus.pending++;
      }

      if (!task.blockedBy || task.blockedBy.length === 0) {
        stats.foundation++;
      } else {
        stats.blocked++;
      }
    }

    stats.byStatus.blocked = stats.blocked;
    stats.completionRate =
      stats.total > 0 ? ((stats.byStatus.done / stats.total) * 100).toFixed(1) : '0';
    return stats;
  }

  /**
   * Get next available task ID
   */
  getNextId(): string {
    const platform = this.metadata?.platform ?? 'frontend';
    const existingIds = this.tasks.map((t) => t.id);
    return getNextTaskId(platform, existingIds);
  }

  /**
   * Rebuild dependency information
   */
  private rebuildDependencies(): void {
    const taskMap = new Map(this.tasks.map((t) => [t.id, t]));

    // Reset calculated fields
    for (const task of this.tasks) {
      task.blockedByTransitive = [];
      task.dependencyChain = [];
      task.blocks = [];
    }

    // Build blocks relationships (reverse of blockedBy)
    for (const task of this.tasks) {
      if (task.blockedBy) {
        for (const depId of task.blockedBy) {
          const depTask = taskMap.get(depId);
          if (depTask) {
            if (!depTask.blocks) depTask.blocks = [];
            depTask.blocks.push(task.id);
          }
        }
      }
    }

    // Calculate transitive dependencies using DFS
    for (const task of this.tasks) {
      const visited = new Set<string>();
      const directTransitive = new Set<string>();

      const collectTransitive = (taskId: string): void => {
        if (visited.has(taskId)) return;
        visited.add(taskId);
        const depTask = taskMap.get(taskId);
        if (depTask && depTask.blockedBy) {
          for (const parentDepId of depTask.blockedBy) {
            directTransitive.add(parentDepId);
            collectTransitive(parentDepId);
          }
        }
      };

      if (task.blockedBy && task.blockedBy.length > 0) {
        for (const depId of task.blockedBy) {
          collectTransitive(depId);
        }
        task.blockedByTransitive = Array.from(directTransitive);


      }
    }
  }
}
