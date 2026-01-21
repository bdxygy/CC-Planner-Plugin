/**
 * File system utilities
 */
import * as fs from 'fs';
import * as path from 'path';
/**
 * Ensure a directory exists, create if not
 */
export function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
/**
 * Read JSON file safely
 */
export function readJson(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return null;
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return null;
    }
}
/**
 * Write JSON file safely
 */
export function writeJson(filePath, data, indent = 2) {
    const dir = path.dirname(filePath);
    ensureDir(dir);
    fs.writeFileSync(filePath, JSON.stringify(data, null, indent) + '\n');
}
/**
 * Check if a path exists and is accessible
 */
export function pathExists(filePath) {
    try {
        return fs.existsSync(filePath);
    }
    catch {
        return false;
    }
}
/**
 * Get file stats safely
 */
export function getStats(filePath) {
    try {
        return fs.statSync(filePath);
    }
    catch {
        return null;
    }
}
/**
 * List files in directory with optional filter
 */
export function listFiles(dirPath, options) {
    if (!fs.existsSync(dirPath)) {
        return [];
    }
    const results = [];
    function scanDir(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                if (options?.recursive) {
                    scanDir(fullPath);
                }
            }
            else if (entry.isFile()) {
                const relativePath = path.relative(dirPath, fullPath);
                let include = true;
                if (options?.filter) {
                    include = options.filter(relativePath);
                }
                if (include && options?.ext) {
                    include = relativePath.endsWith(options.ext);
                }
                if (include) {
                    results.push(relativePath);
                }
            }
        }
    }
    scanDir(dirPath);
    return results;
}
/**
 * Delete file or directory safely
 */
export function removePath(targetPath) {
    try {
        if (!fs.existsSync(targetPath)) {
            return true;
        }
        const stats = fs.statSync(targetPath);
        if (stats.isDirectory()) {
            fs.rmSync(targetPath, { recursive: true, force: true });
        }
        else {
            fs.unlinkSync(targetPath);
        }
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Copy file from source to destination
 */
export function copyFile(src, dest) {
    try {
        ensureDir(path.dirname(dest));
        fs.copyFileSync(src, dest);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Get the .pland directory path for a plan
 */
export function getPlandPath(planName) {
    return path.join(process.cwd(), '.pland', planName);
}
/**
 * Get the tasks file path for a plan and platform
 */
export function getTasksPath(planName, platform) {
    return path.join(getPlandPath(planName), `${platform}-tasks.jsonl`);
}
//# sourceMappingURL=index.js.map