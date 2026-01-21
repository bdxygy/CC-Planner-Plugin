/**
 * Platform detection and configuration types (inferred from Zod schemas)
 */

import { type z } from 'zod';
import {
  PlatformSchema,
  FrameworkSchema,
  DetectedPlatformSchema,
  PlatformConfigSchema,
  PlatformPatternSchema,
  ArchitecturePatternsSchema,
  PatternSchema,
  ModuleStructureSchema,
  TestConfigSchema,
} from '../validators/platform.js';

// Supported platforms
export type Platform = z.infer<typeof PlatformSchema>;

// Framework types by platform
export type Framework = z.infer<typeof FrameworkSchema>;

// Detected platform from codebase
export type DetectedPlatform = z.infer<typeof DetectedPlatformSchema>;

// Platform configuration
export type PlatformConfig = z.infer<typeof PlatformConfigSchema>;

// Platform detection patterns
export type PlatformPattern = z.infer<typeof PlatformPatternSchema>;

// Code pattern
export type Pattern = z.infer<typeof PatternSchema>;

// Platform-specific architecture patterns
export type ArchitecturePatterns = z.infer<typeof ArchitecturePatternsSchema>;

// Platform module structure
export type ModuleStructure = z.infer<typeof ModuleStructureSchema>;

// Test configuration by platform
export type TestConfig = z.infer<typeof TestConfigSchema>;
