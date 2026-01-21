/**
 * Platform detection and configuration types (inferred from Zod schemas)
 */
import { type z } from 'zod';
import { PlatformSchema, FrameworkSchema, DetectedPlatformSchema, PlatformConfigSchema, PlatformPatternSchema, ArchitecturePatternsSchema, PatternSchema, ModuleStructureSchema, TestConfigSchema } from '../validators/platform.js';
export type Platform = z.infer<typeof PlatformSchema>;
export type Framework = z.infer<typeof FrameworkSchema>;
export type DetectedPlatform = z.infer<typeof DetectedPlatformSchema>;
export type PlatformConfig = z.infer<typeof PlatformConfigSchema>;
export type PlatformPattern = z.infer<typeof PlatformPatternSchema>;
export type Pattern = z.infer<typeof PatternSchema>;
export type ArchitecturePatterns = z.infer<typeof ArchitecturePatternsSchema>;
export type ModuleStructure = z.infer<typeof ModuleStructureSchema>;
export type TestConfig = z.infer<typeof TestConfigSchema>;
//# sourceMappingURL=index.d.ts.map