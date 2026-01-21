/**
 * File system utilities
 */
import * as fs from 'fs';
/**
 * Ensure a directory exists, create if not
 */
export declare function ensureDir(dirPath: string): void;
/**
 * Read JSON file safely
 */
export declare function readJson<T = unknown>(filePath: string): T | null;
/**
 * Write JSON file safely
 */
export declare function writeJson(filePath: string, data: unknown, indent?: number): void;
/**
 * Check if a path exists and is accessible
 */
export declare function pathExists(filePath: string): boolean;
/**
 * Get file stats safely
 */
export declare function getStats(filePath: string): fs.Stats | null;
/**
 * List files in directory with optional filter
 */
export declare function listFiles(dirPath: string, options?: {
    recursive?: boolean;
    filter?: (fileName: string) => boolean;
    ext?: string;
}): string[];
/**
 * Delete file or directory safely
 */
export declare function removePath(targetPath: string): boolean;
/**
 * Copy file from source to destination
 */
export declare function copyFile(src: string, dest: string): boolean;
/**
 * Get the .pland directory path for a plan
 */
export declare function getPlandPath(planName: string): string;
/**
 * Get the tasks file path for a plan and platform
 */
export declare function getTasksPath(planName: string, platform: 'frontend' | 'backend'): string;
//# sourceMappingURL=index.d.ts.map