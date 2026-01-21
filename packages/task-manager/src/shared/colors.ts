/**
 * ANSI color codes and symbols for terminal output
 */

export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
} as const;

export const symbols = {
  check: '✓',
  cross: '✗',
  arrow: '→',
  dot: '•',
  star: '★',
  bullet: '◦',
} as const;

export const priorities = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
} as const;

export const prefixMap = {
  frontend: 'fe',
  backend: 'be',
} as const;

export type Priority = keyof typeof priorities;
export type Platform = keyof typeof prefixMap;
export type Effort = 'S' | 'M' | 'L' | 'XL';
