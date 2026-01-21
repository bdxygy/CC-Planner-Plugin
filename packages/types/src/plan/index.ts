/**
 * Plan-related types (inferred from Zod schemas)
 */

import { type z } from 'zod';
import {
  TechStackSchema,
  ProjectContextSchema,
  FeatureSchema,
  ComponentDefinitionSchema,
  StateManagementSchema,
  ApiEndpointSchema,
  RouteDefinitionSchema,
  RoutingConfigSchema,
  StylingConfigSchema,
  FrontendArchitectureSchema,
  ModuleDefinitionSchema,
  DatabaseConfigSchema,
  ServiceDefinitionSchema,
  BackendArchitectureSchema,
  TestScenarioSchema,
  TestingPlanSchema,
  PlanSchema,
  ValidationSummarySchema,
  ValidationReportSchema,
} from '../validators/plan.js';

// Tech stack
export type TechStack = z.infer<typeof TechStackSchema>;

// Project context
export type ProjectContext = z.infer<typeof ProjectContextSchema>;

// Feature definition
export type Feature = z.infer<typeof FeatureSchema>;

// Frontend architecture
export type FrontendArchitecture = z.infer<typeof FrontendArchitectureSchema>;

// Backend architecture
export type BackendArchitecture = z.infer<typeof BackendArchitectureSchema>;

// Component definition
export type ComponentDefinition = z.infer<typeof ComponentDefinitionSchema>;

// State management
export type StateManagement = z.infer<typeof StateManagementSchema>;

// API endpoint
export type ApiEndpoint = z.infer<typeof ApiEndpointSchema>;

// Routing config
export type RoutingConfig = z.infer<typeof RoutingConfigSchema>;

// Route definition
export type RouteDefinition = z.infer<typeof RouteDefinitionSchema>;

// Styling config
export type StylingConfig = z.infer<typeof StylingConfigSchema>;

// Module definition
export type ModuleDefinition = z.infer<typeof ModuleDefinitionSchema>;

// Database config
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

// Service definition
export type ServiceDefinition = z.infer<typeof ServiceDefinitionSchema>;

// Testing plan
export type TestingPlan = z.infer<typeof TestingPlanSchema>;

// Test scenario
export type TestScenario = z.infer<typeof TestScenarioSchema>;

// Plan structure
export type Plan = z.infer<typeof PlanSchema>;

// Validation report
export type ValidationReport = z.infer<typeof ValidationReportSchema>;

// Validation summary
export type ValidationSummary = z.infer<typeof ValidationSummarySchema>;
