/**
 * Zod validators for platform types
 */
import { z } from 'zod';
export declare const PlatformSchema: z.ZodEnum<["frontend", "backend"]>;
export declare const FrameworkSchema: z.ZodEnum<["react", "vue", "svelte", "angular", "next", "nuxt", "solid", "preact", "flutter", "react-native", "android", "ios", "swiftui", "jetpack-compose", "electron", "tauri", "express", "fastify", "nest", "koa", "hapi", "unknown"]>;
export declare const DetectedPlatformSchema: z.ZodObject<{
    platform: z.ZodEnum<["frontend", "backend"]>;
    framework: z.ZodOptional<z.ZodEnum<["react", "vue", "svelte", "angular", "next", "nuxt", "solid", "preact", "flutter", "react-native", "android", "ios", "swiftui", "jetpack-compose", "electron", "tauri", "express", "fastify", "nest", "koa", "hapi", "unknown"]>>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    evidence: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    platform: "frontend" | "backend";
    confidence: "high" | "medium" | "low";
    evidence: string[];
    framework?: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi" | undefined;
}, {
    platform: "frontend" | "backend";
    confidence: "high" | "medium" | "low";
    evidence: string[];
    framework?: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi" | undefined;
}>;
export declare const PlatformConfigSchema: z.ZodObject<{
    platform: z.ZodEnum<["frontend", "backend"]>;
    framework: z.ZodEnum<["react", "vue", "svelte", "angular", "next", "nuxt", "solid", "preact", "flutter", "react-native", "android", "ios", "swiftui", "jetpack-compose", "electron", "tauri", "express", "fastify", "nest", "koa", "hapi", "unknown"]>;
    language: z.ZodString;
    fileExtensions: z.ZodArray<z.ZodString, "many">;
    buildFiles: z.ZodArray<z.ZodString, "many">;
    configFiles: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    platform: "frontend" | "backend";
    framework: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi";
    language: string;
    fileExtensions: string[];
    buildFiles: string[];
    configFiles: string[];
}, {
    platform: "frontend" | "backend";
    framework: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi";
    language: string;
    fileExtensions: string[];
    buildFiles: string[];
    configFiles: string[];
}>;
export declare const PatternSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    example: z.ZodString;
    file: z.ZodString;
    line: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    example: string;
    file: string;
    line?: number | undefined;
}, {
    name: string;
    description: string;
    example: string;
    file: string;
    line?: number | undefined;
}>;
export declare const PlatformPatternSchema: z.ZodObject<{
    platform: z.ZodEnum<["frontend", "backend"]>;
    framework: z.ZodOptional<z.ZodEnum<["react", "vue", "svelte", "angular", "next", "nuxt", "solid", "preact", "flutter", "react-native", "android", "ios", "swiftui", "jetpack-compose", "electron", "tauri", "express", "fastify", "nest", "koa", "hapi", "unknown"]>>;
    files: z.ZodArray<z.ZodString, "many">;
    patterns: z.ZodArray<z.ZodString, "many">;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    platform: "frontend" | "backend";
    files: string[];
    patterns: string[];
    framework?: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi" | undefined;
    dependencies?: string[] | undefined;
}, {
    platform: "frontend" | "backend";
    files: string[];
    patterns: string[];
    framework?: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi" | undefined;
    dependencies?: string[] | undefined;
}>;
export declare const ArchitecturePatternsSchema: z.ZodObject<{
    platform: z.ZodEnum<["frontend", "backend"]>;
    framework: z.ZodEnum<["react", "vue", "svelte", "angular", "next", "nuxt", "solid", "preact", "flutter", "react-native", "android", "ios", "swiftui", "jetpack-compose", "electron", "tauri", "express", "fastify", "nest", "koa", "hapi", "unknown"]>;
    patterns: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        example: z.ZodString;
        file: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        example: string;
        file: string;
        line?: number | undefined;
    }, {
        name: string;
        description: string;
        example: string;
        file: string;
        line?: number | undefined;
    }>, "many">;
    bestPractices: z.ZodArray<z.ZodString, "many">;
    antiPatterns: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    platform: "frontend" | "backend";
    framework: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi";
    patterns: {
        name: string;
        description: string;
        example: string;
        file: string;
        line?: number | undefined;
    }[];
    bestPractices: string[];
    antiPatterns: string[];
}, {
    platform: "frontend" | "backend";
    framework: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi";
    patterns: {
        name: string;
        description: string;
        example: string;
        file: string;
        line?: number | undefined;
    }[];
    bestPractices: string[];
    antiPatterns: string[];
}>;
export declare const ModuleStructureSchema: z.ZodObject<{
    platform: z.ZodEnum<["frontend", "backend"]>;
    framework: z.ZodEnum<["react", "vue", "svelte", "angular", "next", "nuxt", "solid", "preact", "flutter", "react-native", "android", "ios", "swiftui", "jetpack-compose", "electron", "tauri", "express", "fastify", "nest", "koa", "hapi", "unknown"]>;
    directories: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>;
    fileNaming: z.ZodString;
    importStyle: z.ZodEnum<["relative", "absolute", "alias"]>;
}, "strip", z.ZodTypeAny, {
    platform: "frontend" | "backend";
    framework: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi";
    directories: Record<string, string[]>;
    fileNaming: string;
    importStyle: "relative" | "absolute" | "alias";
}, {
    platform: "frontend" | "backend";
    framework: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi";
    directories: Record<string, string[]>;
    fileNaming: string;
    importStyle: "relative" | "absolute" | "alias";
}>;
export declare const TestConfigSchema: z.ZodObject<{
    platform: z.ZodEnum<["frontend", "backend"]>;
    framework: z.ZodEnum<["react", "vue", "svelte", "angular", "next", "nuxt", "solid", "preact", "flutter", "react-native", "android", "ios", "swiftui", "jetpack-compose", "electron", "tauri", "express", "fastify", "nest", "koa", "hapi", "unknown"]>;
    testFramework: z.ZodString;
    testLocation: z.ZodString;
    mockPattern: z.ZodString;
}, "strip", z.ZodTypeAny, {
    platform: "frontend" | "backend";
    framework: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi";
    testFramework: string;
    testLocation: string;
    mockPattern: string;
}, {
    platform: "frontend" | "backend";
    framework: "unknown" | "react" | "vue" | "svelte" | "angular" | "next" | "nuxt" | "solid" | "preact" | "flutter" | "react-native" | "android" | "ios" | "swiftui" | "jetpack-compose" | "electron" | "tauri" | "express" | "fastify" | "nest" | "koa" | "hapi";
    testFramework: string;
    testLocation: string;
    mockPattern: string;
}>;
//# sourceMappingURL=platform.d.ts.map