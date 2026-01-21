/**
 * Task templates for common patterns
 */

import type { Priority, Effort } from './colors.js';

export interface TaskTemplate {
  level: Priority;
  name: string;
  component: string;
  files: string;
  testsSuccess: string[];
  acceptanceCriteria: string[];
  estimatedEffort: Effort;
  implementationNotes: string;
}

export const templates: Record<string, TaskTemplate> = {
  component: {
    level: 'high',
    name: 'Create {ComponentName} Component',
    component: '{ComponentName}',
    files: 'src/components/{ComponentName}/{ComponentName}.{ext}',
    testsSuccess: ['Renders correctly', 'Handles user interactions', 'Accessible with ARIA'],
    acceptanceCriteria: [
      'Component renders without errors',
      'All interactions work',
      'WCAG 2.1 AA compliant',
    ],
    estimatedEffort: 'M',
    implementationNotes: 'Use atomic design principles',
  },
  service: {
    level: 'high',
    name: 'Create {ServiceName} Service',
    component: '{ServiceName}',
    files: 'src/services/{category}/{ServiceName}.{ext}',
    testsSuccess: ['Unit tests pass', 'Error handling works', 'Edge cases covered'],
    acceptanceCriteria: ['All methods return correct results', 'Error states handled properly'],
    estimatedEffort: 'M',
    implementationNotes: 'Register in DI container',
  },
  hook: {
    level: 'medium',
    name: 'Create use{HookName} Hook',
    component: 'use{HookName}',
    files: 'src/hooks/use{HookName}.{ext}',
    testsSuccess: ['Hook returns expected values', 'State updates work', 'Cleanup runs correctly'],
    acceptanceCriteria: ['Follows React hooks rules', 'Proper cleanup on unmount'],
    estimatedEffort: 'S',
    implementationNotes: 'Include TypeScript types',
  },
  page: {
    level: 'high',
    name: 'Create {PageName} Page',
    component: '{PageName}',
    files: 'src/pages/{PageName}/{PageName}.{ext}',
    testsSuccess: ['Page renders', 'Navigation works', 'Data fetching works'],
    acceptanceCriteria: ['Full user flow functional', 'Loading and error states handled'],
    estimatedEffort: 'L',
    implementationNotes: 'Integrate with routing',
  },
  test: {
    level: 'medium',
    name: 'Add Tests for {ComponentName}',
    component: '{ComponentName}',
    files: '{ComponentPath}.test.{ext}',
    testsSuccess: ['All tests pass', 'Coverage meets threshold'],
    acceptanceCriteria: [
      'Unit tests cover happy path',
      'Edge cases tested',
      'Error scenarios covered',
    ],
    estimatedEffort: 'M',
    implementationNotes: 'Use testing-library framework',
  },
  repository: {
    level: 'high',
    name: 'Create {Entity}Repository',
    component: '{Entity}Repository',
    files: 'src/repositories/{entity}Repository.{ext}',
    testsSuccess: ['CRUD operations', 'Error handling', 'Edge cases'],
    acceptanceCriteria: ['All CRUD methods work', 'Database queries tested'],
    estimatedEffort: 'M',
    implementationNotes: 'Use ORM of choice',
  },
  controller: {
    level: 'high',
    name: 'Create {Entity}Controller',
    component: '{Entity}Controller',
    files: 'src/controllers/{entity}Controller.{ext}',
    testsSuccess: ['Request parsing', 'Response formatting', 'Error responses'],
    acceptanceCriteria: ['All endpoints work', 'Validation implemented'],
    estimatedEffort: 'M',
    implementationNotes: 'Framework-specific patterns',
  },
  migration: {
    level: 'critical',
    name: 'Create {Entity} Migration',
    component: '{Entity}Migration',
    files: 'migrations/{timestamp}_create_{entity}.{ext}',
    testsSuccess: ['Migration up/down', 'Schema validation'],
    acceptanceCriteria: ['Table created correctly', 'Indexes defined', 'Migration reversible'],
    estimatedEffort: 'S',
    implementationNotes: 'Include rollback',
  },
  middleware: {
    level: 'medium',
    name: 'Create {MiddlewareName} Middleware',
    component: '{MiddlewareName}Middleware',
    files: 'src/middleware/{middlewareName}.{ext}',
    testsSuccess: ['Middleware execution', 'Error cases', 'Bypass conditions'],
    acceptanceCriteria: ['Middleware works correctly', 'Errors handled'],
    estimatedEffort: 'S',
    implementationNotes: 'Document execution order',
  },
  'di-registration': {
    level: 'medium',
    name: 'Register {ServiceName} in DI Container',
    component: 'DI Registration',
    files: 'src/di/registrations.{ext}',
    testsSuccess: ['Service resolves correctly', 'Singleton/scoped works'],
    acceptanceCriteria: ['Registered as correct lifetime', 'Dependencies injected properly'],
    estimatedEffort: 'S',
    implementationNotes: 'Use asClass().singleton() or .scoped()',
  },
};

/**
 * Apply template variables to a template
 */
export function applyTemplate(
  template: TaskTemplate,
  variables: Record<string, unknown>
): TaskTemplate {
  const result = { ...template };

  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string') {
      let resultValue = value;
      for (const [varName, varValue] of Object.entries(variables)) {
        resultValue = resultValue.replace(new RegExp(`\\{${varName}\\}`, 'g'), String(varValue));
      }
      (result as Record<string, unknown>)[key] = resultValue;
    } else if (Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = value.map((item) => {
        if (typeof item === 'string') {
          let resultItem = item;
          for (const [varName, varValue] of Object.entries(variables)) {
            resultItem = resultItem.replace(new RegExp(`\\{${varName}\\}`, 'g'), String(varValue));
          }
          return resultItem;
        }
        return item;
      });
    }
  }

  return result;
}
