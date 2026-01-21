/**
 * Project commands using Commander
 */

import { Command } from 'commander';
import { TaskService } from '../task/service.js';
import { colors, symbols } from '../shared/index.js';

export function registerProjectCommands(program: Command, getTaskService: () => TaskService): void {
  const projectCmd = program.command('project').description('Project commands');

  // Initialize project
  projectCmd
    .command('init')
    .description('Initialize project')
    .option('--framework <name>', 'Framework name')
    .option('--deps <deps...>', 'Dependencies')
    .action((options) => {
      const service = getTaskService();
      service.init({
        framework: options.framework,
        deps: options.deps,
      });
    });

  // Validate project
  projectCmd
    .command('validate')
    .description('Validate project')
    .action(() => {
      const service = getTaskService();
      const issues = service.validate();
      if (issues.length === 0) {
        console.log(`${colors.green}${symbols.check} No issues found!${colors.reset}`);
      } else {
        for (const issue of issues) {
          const icon =
            issue.severity === 'error'
              ? `${colors.red}${symbols.cross}`
              : `${colors.yellow}${symbols.bullet}`;
          console.log(`${icon} ${issue.severity}: ${issue.message}`);
        }
      }
      process.exit(issues.filter((i) => i.severity === 'error').length > 0 ? 1 : 0);
    });
}
