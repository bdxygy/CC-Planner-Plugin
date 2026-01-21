/**
 * Shared utility functions
 */

import type { Platform } from './colors.js';

/**
 * Get the task ID prefix for a platform
 */
export function getPrefixForPlatform(platform: Platform): string {
  const prefixMap: Record<Platform, string> = {
    frontend: 'fe',
    backend: 'be',
  };
  return prefixMap[platform];
}

/**
 * Parse a task ID to extract platform and number
 */
export function parseTaskId(id: string): { platform: Platform; number: number } | null {
  const match = id.match(/^(fe|be)-(\d+)$/);
  if (!match) return null;

  const [, prefix, numStr] = match;
  const platformMap: Record<string, Platform> = {
    fe: 'frontend',
    be: 'backend',
  };
  const platform = platformMap[prefix!];
  if (!platform) return null;

  return { platform, number: Number.parseInt(numStr, 10) };
}

/**
 * Format task ID with prefix and padded number
 */
export function formatTaskId(platform: Platform, number: number): string {
  const prefix = getPrefixForPlatform(platform);
  return `${prefix}-${String(number).padStart(4, '0')}`;
}

/**
 * Get next available task ID
 */
export function getNextTaskId(platform: Platform, existingIds: string[]): string {
  const prefix = getPrefixForPlatform(platform);
  const numbers = existingIds
    .filter((id) => id.startsWith(prefix))
    .map((id) => {
      const parsed = parseTaskId(id);
      return parsed?.number ?? 0;
    })
    .filter((n) => !Number.isNaN(n));

  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  return formatTaskId(platform, max + 1);
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Format date as ISO string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parse date from ISO string
 */
export function parseDate(isoString: string): Date {
  return new Date(isoString);
}
