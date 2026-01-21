/**
 * Rsbuild configuration for Task Manager CLI
 * Single bundled CJS file for CLI usage
 */

import { rspack } from '@rspack/core';
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  mode: 'production',
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  output: {
    target: 'node',
    // Output to plugin/scripts/task-manager directory
    distPath: {
      root: '../../plugin/scripts/task-manager',
    },
    cleanDistPath: true,
    filename: {
      js: 'index.cjs',
    },
    // Generate source maps
    sourceMap: true,
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      // Add BannerPlugin for shebang with raw: true
      appendPlugins(
        new rspack.BannerPlugin({
          banner: '#!/usr/bin/env node',
          raw: true,
          entryOnly: true,
        })
      );

      // Override chunkFilename to avoid conflict with main filename
      config.output = config.output || {};
      config.output.chunkFilename = '[id].js';

      return {
        ...config,
        optimization: {
          ...config.optimization,
          // Disable code splitting for single file bundle
          splitChunks: false,
        },
      };
    },
  },
});
