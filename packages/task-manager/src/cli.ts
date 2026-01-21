/**
 * CLI entry point using Commander
 */

import { Command } from 'commander';
import { TaskService } from './task/service.js';
import { registerTaskCommands } from './task/commands.js';
import { registerProjectCommands } from './project/commands.js';
import { ValidationError, type TaskManagerError } from './errors/index.js';
import { colors } from './shared/index.js';

// Store for plan context
let planContext: { planName: string; platform: 'frontend' | 'backend' } | null = null;

// Factory function to get task service
function getTaskService(): TaskService {
  if (!planContext) {
    throw new ValidationError('plan-name and platform must be specified');
  }
  return new TaskService(planContext.planName, planContext.platform);
}

// Create program
const program = new Command();

// Main program configuration
program
  .name('task-manager')
  .description('Architect-Planner Task Manager CLI')
  .version('0.0.6')
  .option('-p, --plan-name <name>', 'Plan name')
  .option('-pl, --platform <platform>', 'Platform (frontend|backend)', 'frontend')
  .hook('preAction', (thisCommand) => {
    // Get plan-name and platform from this command or parent
    const planName = thisCommand.opts().planName || program.opts().planName;
    const platform = thisCommand.opts().platform || program.opts().platform;

    // Validate platform
    if (platform !== 'frontend' && platform !== 'backend') {
      console.error(
        `${colors.red}Error: platform must be 'frontend' or 'backend'${colors.reset}\n`
      );
      process.exit(1);
    }

    // Check if this is a subcommand (not help/version on root)
    const isSubcommand = thisCommand.parent !== program;

    if (isSubcommand && !planName) {
      console.error(`${colors.red}Error: plan-name is required${colors.reset}`);
      console.error(
        `\nUsage: task-manager --plan-name <name> [--platform=frontend|backend] <command> [options]`
      );
      console.error(
        `\nRun '${colors.cyan}task-manager --help${colors.reset}' for more information.\n`
      );
      process.exit(1);
    }

    // Store context for subcommands
    if (isSubcommand) {
      planContext = {
        planName,
        platform: platform as 'frontend' | 'backend',
      };
    }
  });

// Register feature commands
registerTaskCommands(program, getTaskService);
registerProjectCommands(program, getTaskService);

// Handle no command or help
if (process.argv.length <= 2 || process.argv.includes('--help') || process.argv.includes('-h')) {
  program.parse(process.argv);
} else {
  // Setup error handling
  program.exitOverride((err) => {
    // Help and version should exit with code 0
    if (err.code === 'commander.help' || err.code === 'commander.version') {
      process.exit(0);
    }
    // Re-throw other errors
    throw err;
  });

  // Parse and handle errors
  program.parseAsync().catch((error) => {
    if (error instanceof Error && 'code' in error) {
      console.error(
        `${colors.red}${(error as TaskManagerError).code}: ${error.message}${colors.reset}`
      );
      process.exit(1);
    }

    if (error instanceof Error && !error.message.includes('commander')) {
      console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    }

    process.exit(1);
  });
}
