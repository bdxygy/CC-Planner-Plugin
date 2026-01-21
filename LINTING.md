# Linting and Code Style Guide

This project uses ESLint for code linting and Prettier for code formatting to maintain consistent code quality across all packages.

## Quick Start

### Lint Code
Check for ESLint issues:
```bash
pnpm lint
```

### Fix Linting Issues
Auto-fix ESLint issues:
```bash
pnpm lint:fix
```

### Format Code
Format all files with Prettier:
```bash
pnpm format
```

### Check Formatting
Verify all files are properly formatted without changes:
```bash
pnpm format:check
```

### Type Check
Run TypeScript type checking:
```bash
pnpm typecheck
```

## Configuration Files

### ESLint (`eslint.config.js`)
- Uses ESLint 9+ flat config format
- Includes TypeScript support via `typescript-eslint`
- Prettier integration to avoid conflicts
- Ignores: `node_modules`, `dist`, `build`, `.pland`, `coverage`, `*.cjs`, `plugin/scripts`

**Key Rules:**
- Unused variables must be prefixed with `_` (e.g., `_unused`)
- `any` types trigger warnings
- Explicit return types are optional
- `console` and `process` are allowed (CLI tool)

### Prettier (`.prettierrc.json`)
- Print width: 100 characters
- Single quotes for strings
- Trailing commas (ES5 compatible)
- 2-space indentation

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- Module resolution for workspace packages
- ESM modules

## Workflow

### Before Committing
Run the full pre-push check:
```bash
pnpm run prepush
```

This runs:
1. Build task-manager CLI
2. Lint all TypeScript files
3. Type check entire codebase

### Git Hooks
Husky is configured to run linting on pre-commit (if configured).

## Common Issues

### Issue: "Module 'X' is defined but never used"
**Solution:** Either remove the import or prefix with underscore if intentional:
```typescript
import { unusedHelper as _unusedHelper } from './helpers';
```

### Issue: "A `require()` style import is forbidden"
**Solution:** Use ES modules:
```typescript
// ❌ Wrong
const fs = require('fs');

// ✅ Correct
import { readFile } from 'fs';
```

### Issue: Prettier formatting conflicts
**Solution:** Run `pnpm format` to auto-format, then commit the changes.

## Workspace Structure

Linting applies to all packages:
- `packages/task-manager/` - CLI tool with TypeScript
- `packages/types/` - Type definitions
- `packages/utils/` - Utility functions
- `packages/config/` - Configuration
- `plugin/` - Claude Code plugin files

## IDE Integration

### VS Code
Install extensions:
- ESLint
- Prettier - Code formatter

Add to `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Scripts Summary

| Script | Purpose |
|--------|---------|
| `lint` | Check for ESLint issues |
| `lint:fix` | Auto-fix ESLint issues |
| `format` | Format all files with Prettier |
| `format:check` | Check formatting without changes |
| `typecheck` | Run TypeScript type checking |
| `prepush` | Full validation before push (build + lint + typecheck) |
