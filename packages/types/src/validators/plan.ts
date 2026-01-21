/**
 * Zod validators for plan types
 */

import { z } from 'zod';
import { PlatformSchema } from './platform.js';
import { TaskSchema, TaskMetadataSchema } from './task.js';

// TechStack validator
export const TechStackSchema = z.object({
  framework: z.string().min(1),
  language: z.string().min(1),
  stateManagement: z.string().optional(),
  testing: z.array(z.string()).optional(),
  buildTools: z.array(z.string()).optional(),
  additional: z.array(z.string()).optional(),
});

// ProjectContext validator
export const ProjectContextSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  techStack: TechStackSchema,
  platform: PlatformSchema,
  constraints: z.array(z.string()),
});

// Feature validator
export const FeatureSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  status: z.enum(['pending', 'in-progress', 'completed']),
  components: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
});

// ComponentDefinition validator
export const ComponentDefinitionSchema = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  type: z.enum(['page', 'layout', 'component', 'hook', 'util']),
  props: z.record(z.unknown()).optional(),
  dependencies: z.array(z.string()),
});

// StateManagement validator
export const StateManagementSchema = z.object({
  approach: z.enum([
    'redux',
    'zustand',
    'context',
    'mobx',
    'pinia',
    'bloc',
    'provider',
  ]),
  stores: z.array(z.string()),
});

// ApiEndpoint validator
export const ApiEndpointSchema = z.object({
  path: z.string().min(1),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  description: z.string(),
  auth: z.boolean(),
  requestType: z.string().optional(),
  responseType: z.string().optional(),
});

// RouteDefinition validator
export const RouteDefinitionSchema = z.object({
  path: z.string().min(1),
  component: z.string().min(1),
  layout: z.string().optional(),
  protected: z.boolean(),
});

// RoutingConfig validator
export const RoutingConfigSchema = z.object({
  type: z.enum(['file-based', 'config-based']),
  routes: z.array(RouteDefinitionSchema),
});

// StylingConfig validator
export const StylingConfigSchema = z.object({
  approach: z.enum(['css', 'scss', 'tailwind', 'styled-components', 'emotion']),
  themePath: z.string().optional(),
});

// FrontendArchitecture validator
export const FrontendArchitectureSchema = z.object({
  components: z.array(ComponentDefinitionSchema),
  state: StateManagementSchema,
  apis: z.array(ApiEndpointSchema),
  routing: RoutingConfigSchema,
  styling: StylingConfigSchema,
});

// ModuleDefinition validator
export const ModuleDefinitionSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  responsibilities: z.array(z.string()),
  dependencies: z.array(z.string()),
});

// DatabaseConfig validator
export const DatabaseConfigSchema = z.object({
  type: z.string().min(1),
  schema: z.array(z.string()),
  orm: z.string().min(1),
});

// ServiceDefinition validator
export const ServiceDefinitionSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  methods: z.array(z.string()),
});

// BackendArchitecture validator
export const BackendArchitectureSchema = z.object({
  modules: z.array(ModuleDefinitionSchema),
  endpoints: z.array(ApiEndpointSchema),
  database: DatabaseConfigSchema,
  services: z.array(ServiceDefinitionSchema),
});

// TestScenario validator
export const TestScenarioSchema = z.object({
  id: z.string().min(1),
  description: z.string(),
  given: z.string(),
  when: z.string(),
  then: z.array(z.string()),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
});

// TestingPlan validator
export const TestingPlanSchema = z.object({
  unit: z.array(TestScenarioSchema),
  integration: z.array(TestScenarioSchema),
  e2e: z.array(TestScenarioSchema),
});

// Plan validator
export const PlanSchema = z.object({
  context: ProjectContextSchema,
  features: z.array(FeatureSchema),
  architecture: z.union([FrontendArchitectureSchema, BackendArchitectureSchema]),
  testing: TestingPlanSchema,
  tasks: z.array(TaskSchema),
  metadata: TaskMetadataSchema,
});

// ValidationError validator
export const ValidationErrorSchema = z.object({
  type: z.string().min(1),
  severity: z.enum(['error', 'warning']),
  message: z.string().min(1),
  field: z.string().optional(),
  details: z.unknown().optional(),
});

// ValidationSummary validator
export const ValidationSummarySchema = z.object({
  totalIssues: z.number().int().nonnegative(),
  critical: z.number().int().nonnegative(),
  byCategory: z.record(z.number().int().nonnegative()),
  passed: z.boolean(),
});

// ValidationReport validator
export const ValidationReportSchema = z.object({
  planName: z.string().min(1),
  timestamp: z.string().datetime(),
  errors: z.array(ValidationErrorSchema),
  warnings: z.array(ValidationErrorSchema),
  summary: ValidationSummarySchema,
});
