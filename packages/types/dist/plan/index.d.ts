/**
 * Plan-related types (inferred from Zod schemas)
 */
import { type z } from 'zod';
import { TechStackSchema, ProjectContextSchema, FeatureSchema, ComponentDefinitionSchema, StateManagementSchema, ApiEndpointSchema, RouteDefinitionSchema, RoutingConfigSchema, StylingConfigSchema, FrontendArchitectureSchema, ModuleDefinitionSchema, DatabaseConfigSchema, ServiceDefinitionSchema, BackendArchitectureSchema, TestScenarioSchema, TestingPlanSchema, PlanSchema, ValidationSummarySchema, ValidationReportSchema } from '../validators/plan.js';
export type TechStack = z.infer<typeof TechStackSchema>;
export type ProjectContext = z.infer<typeof ProjectContextSchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type FrontendArchitecture = z.infer<typeof FrontendArchitectureSchema>;
export type BackendArchitecture = z.infer<typeof BackendArchitectureSchema>;
export type ComponentDefinition = z.infer<typeof ComponentDefinitionSchema>;
export type StateManagement = z.infer<typeof StateManagementSchema>;
export type ApiEndpoint = z.infer<typeof ApiEndpointSchema>;
export type RoutingConfig = z.infer<typeof RoutingConfigSchema>;
export type RouteDefinition = z.infer<typeof RouteDefinitionSchema>;
export type StylingConfig = z.infer<typeof StylingConfigSchema>;
export type ModuleDefinition = z.infer<typeof ModuleDefinitionSchema>;
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
export type ServiceDefinition = z.infer<typeof ServiceDefinitionSchema>;
export type TestingPlan = z.infer<typeof TestingPlanSchema>;
export type TestScenario = z.infer<typeof TestScenarioSchema>;
export type Plan = z.infer<typeof PlanSchema>;
export type ValidationReport = z.infer<typeof ValidationReportSchema>;
export type ValidationSummary = z.infer<typeof ValidationSummarySchema>;
//# sourceMappingURL=index.d.ts.map