/**
 * Zod validators for platform types
 */

import { z } from 'zod';

// Platform type validator
export const PlatformSchema = z.enum(['frontend', 'backend']);

// Framework type validator
export const FrameworkSchema = z.enum([
  // Frontend
  'react',
  'vue',
  'svelte',
  'angular',
  'next',
  'nuxt',
  'solid',
  'preact',
  // Mobile
  'flutter',
  'react-native',
  'android',
  'ios',
  'swiftui',
  'jetpack-compose',
  // Desktop
  'electron',
  'tauri',
  // Backend
  'express',
  'fastify',
  'nest',
  'koa',
  'hapi',
  // Unknown
  'unknown',
]);

// DetectedPlatform validator
export const DetectedPlatformSchema = z.object({
  platform: PlatformSchema,
  framework: FrameworkSchema.optional(),
  confidence: z.enum(['high', 'medium', 'low']),
  evidence: z.array(z.string()),
});

// PlatformConfig validator
export const PlatformConfigSchema = z.object({
  platform: PlatformSchema,
  framework: FrameworkSchema,
  language: z.string().min(1),
  fileExtensions: z.array(z.string()),
  buildFiles: z.array(z.string()),
  configFiles: z.array(z.string()),
});

// Pattern validator
export const PatternSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  example: z.string(),
  file: z.string(),
  line: z.number().int().positive().optional(),
});

// PlatformPattern validator
export const PlatformPatternSchema = z.object({
  platform: PlatformSchema,
  framework: FrameworkSchema.optional(),
  files: z.array(z.string()),
  patterns: z.array(z.string()),
  dependencies: z.array(z.string()).optional(),
});

// ArchitecturePatterns validator
export const ArchitecturePatternsSchema = z.object({
  platform: PlatformSchema,
  framework: FrameworkSchema,
  patterns: z.array(PatternSchema),
  bestPractices: z.array(z.string()),
  antiPatterns: z.array(z.string()),
});

// ModuleStructure validator
export const ModuleStructureSchema = z.object({
  platform: PlatformSchema,
  framework: FrameworkSchema,
  directories: z.record(z.array(z.string())),
  fileNaming: z.string(),
  importStyle: z.enum(['relative', 'absolute', 'alias']),
});

// TestConfig validator
export const TestConfigSchema = z.object({
  platform: PlatformSchema,
  framework: FrameworkSchema,
  testFramework: z.string().min(1),
  testLocation: z.string().min(1),
  mockPattern: z.string().min(1),
});
