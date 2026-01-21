/**
 * Task repository for file I/O operations
 */

import { existsSync } from 'fs';
import type { Task, TaskMetadata } from '@architect-planner/types';
import { parseNdjsonWithMetadata, writeNdjson } from '../shared/ndjson.js';

export class TaskRepository {
  private readonly taskFile: string;

  constructor(
    planName: string,
    platform: 'frontend' | 'backend'
  ) {
    this.taskFile = `.pland/${planName}/${platform}-tasks.jsonl`;
  }

  /**
   * Load all tasks and metadata from file
   */
  load(): { tasks: Task[]; metadata: TaskMetadata | null } {
    const { records, metadata } = parseNdjsonWithMetadata<Task, TaskMetadata>(this.taskFile);
    return { tasks: records, metadata };
  }

  /**
   * Save tasks and metadata to file
   */
  save(tasks: Task[], metadata?: TaskMetadata | null): void {
    writeNdjson(this.taskFile, tasks, metadata ?? undefined);
  }

  /**
   * Check if repository file exists
   */
  exists(): boolean {
    return existsSync(this.taskFile);
  }

  /**
   * Get file path
   */
  getFilePath(): string {
    return this.taskFile;
  }

  /**
   * Find task by ID
   */
  findById(tasks: Task[], id: string): Task | undefined {
    return tasks.find((t) => t.id === id);
  }

  /**
   * Check for duplicate task ID
   */
  isDuplicate(tasks: Task[], id: string, excludeId?: string): boolean {
    return tasks.some((t) => t.id === id && t.id !== excludeId);
  }

  /**
   * Find dependents of a task
   */
  findDependents(tasks: Task[], taskId: string): Task[] {
    return tasks.filter((t) => t.blockedBy?.includes(taskId));
  }
}
