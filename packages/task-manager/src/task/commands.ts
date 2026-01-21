/**
 * Task command handlers using Commander
 */

import { existsSync, readFileSync } from 'fs';
import { Command } from 'commander';
import Table from 'cli-table3';
import { TaskService } from './service.js';
import { validateTaskCreate, validateTaskUpdate, validateJsonlFile } from './validator.js';
import { colors, symbols, templates, applyTemplate } from '../shared/index.js';

export function registerTaskCommands(program: Command, getTaskService: () => TaskService): void {
  const taskCmd = program.command('task').description('Task commands');

  // Create task
  taskCmd
    .command('create')
    .description('Create a new task')
    .option('--template <name>', 'Use a template')
    .option('--id <id>', 'Task ID')
    .option('--name <name>', 'Task name')
    .option('--level <level>', 'Priority level')
    .option('--component <component>', 'Component name')
    .option('--files <files>', 'Files to create')
    .option('--done', 'Mark as done')
    .option('--notReady', 'Mark as not ready')
    .option('--blockedBy <ids...>', 'Blocking task IDs')
    .action((options) => {
      const service = getTaskService();

      let taskData: Record<string, unknown>;

      if (options.template) {
        const template = templates[options.template];
        if (!template) {
          console.error(`${colors.red}Template not found: ${options.template}${colors.reset}`);
          console.log(`Available: ${Object.keys(templates).join(', ')}`);
          process.exit(1);
        }

        const { template: _t, ...rest } = options;
        taskData = applyTemplate(template, rest as Record<string, unknown>) as unknown as Record<
          string,
          unknown
        >;
      } else {
        taskData = options;
      }

      // Handle boolean flags
      if (options.done) taskData.done = true;
      if (options.notReady) taskData.ready = false;

      if (!taskData.id) {
        taskData.id = service.getNextId();
      }

      const validated = validateTaskCreate(taskData);
      const created = service.create(validated);
      console.log(`${colors.green}${symbols.check} Task created: ${created.id}${colors.reset}`);
    });

  // Update task
  taskCmd
    .command('update <id>')
    .description('Update an existing task')
    .option('--name <name>', 'Task name')
    .option('--level <level>', 'Priority level')
    .option('--done', 'Mark as done')
    .option('--notDone', 'Mark as not done')
    .option('--ready', 'Mark as ready')
    .option('--notReady', 'Mark as not ready')
    .action((id, options) => {
      const service = getTaskService();

      const updateData: Record<string, unknown> = {};

      // Handle boolean flags
      if (options.done) updateData.done = true;
      if (options.notDone) updateData.done = false;
      if (options.ready) updateData.ready = true;
      if (options.notReady) updateData.ready = false;

      if (options.name) updateData.name = options.name;
      if (options.level) updateData.level = options.level;

      const validated = validateTaskUpdate(updateData);
      service.update(id, validated);
      console.log(`${colors.green}${symbols.check} Task updated: ${id}${colors.reset}`);
    });

  // List tasks
  taskCmd
    .command('list')
    .description('List tasks')
    .option('--level <level>', 'Filter by level')
    .option('--done', 'Show only done')
    .option('--pending', 'Show only pending')
    .option('--ready', 'Show only ready')
    .option('--notReady', 'Show only not ready')
    .option('--foundation', 'Show only foundation tasks')
    .action((options) => {
      const service = getTaskService();

      const listOptions: {
        level?: 'critical' | 'high' | 'medium' | 'low';
        done?: boolean;
        ready?: boolean;
        foundation?: boolean;
      } = {};

      if (options.level)
        listOptions.level = options.level as 'critical' | 'high' | 'medium' | 'low';
      if (options.done) listOptions.done = true;
      if (options.pending) listOptions.done = false;
      if (options.ready) listOptions.ready = true;
      if (options.notReady) listOptions.ready = false;
      if (options.foundation) listOptions.foundation = true;

      const tasks = service.list(listOptions);
      const metadata = service.metadata || {
        planName: 'unknown',
        platform: 'unknown',
      };
      renderTaskList(tasks, metadata);
    });

  // Show task detail
  taskCmd
    .command('detail <id>')
    .description('Show task detail')
    .action((id) => {
      const service = getTaskService();
      const task = service.get(id);
      if (!task) {
        console.error(`${colors.red}Error: Task not found: ${id}${colors.reset}`);
        process.exit(1);
      }
      renderTaskDetail(task);
    });

  // Show dependency chain
  taskCmd
    .command('chain <id>')
    .description('Show dependency chain')
    .action((id) => {
      const service = getTaskService();
      const chain = service.getChain(id);
      renderDependencyChain(chain);
    });

  // Remove task
  taskCmd
    .command('remove <id>')
    .description('Remove a task')
    .action((id) => {
      const service = getTaskService();
      service.remove(id);
      console.log(`${colors.green}${symbols.check} Task removed: ${id}${colors.reset}`);
    });

  // Show status
  taskCmd
    .command('status')
    .description('Show task status dashboard')
    .action(() => {
      const service = getTaskService();
      renderDashboard(service);
    });

  // Validate
  taskCmd
    .command('validate')
    .description('Validate tasks')
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

  // Validate JSONL file structure
  taskCmd
    .command('validate-jsonl')
    .description('Validate JSONL task file structure')
    .action(() => {
      const service = getTaskService();
      const filePath = service.getFilePath();

      if (!existsSync(filePath)) {
        console.log(
          `${colors.yellow}${symbols.bullet} Task file not found: ${filePath}${colors.reset}`
        );
        process.exit(1);
      }

      let content: string;
      try {
        content = readFileSync(filePath, 'utf-8');
      } catch (err) {
        console.log(
          `${colors.red}${symbols.cross} Failed to read file: ${err instanceof Error ? err.message : 'Unknown error'}${colors.reset}`
        );
        process.exit(1);
      }

      const issues = validateJsonlFile(content);

      if (issues.length === 0) {
        const lineCount = content.trim().split('\n').length;
        console.log(`${colors.green}${symbols.check} Validation passed!${colors.reset}`);
        console.log(`${colors.dim}File: ${filePath}${colors.reset}`);
        console.log(`${colors.dim}Total entries: ${lineCount}${colors.reset}`);
      } else {
        console.log(`${colors.red}${symbols.cross} Validation failed!${colors.reset}`);
        console.log(`${colors.dim}File: ${filePath}${colors.reset}\n`);

        const errorsByType = issues.reduce(
          (acc, issue) => {
            acc[issue.type] = (acc[issue.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        for (const issue of issues) {
          const icon =
            issue.severity === 'error'
              ? `${colors.red}${symbols.cross}`
              : `${colors.yellow}${symbols.bullet}`;
          const location = issue.taskId
            ? ` [${colors.cyan}${issue.taskId}${colors.reset}]`
            : issue.line
              ? ` [${colors.cyan}Line ${issue.line}${colors.reset}]`
              : '';
          console.log(`${icon} ${issue.type}${location}: ${issue.message}`);
        }

        console.log(`\n${colors.dim}Summary:${colors.reset}`);
        console.log(
          `  Errors: ${errorsByType['format'] ?? 0 + (errorsByType['structure'] ?? 0) + (errorsByType['dependency'] ?? 0) + (errorsByType['data'] ?? 0)}`
        );
        console.log(`  Warnings: ${errorsByType['data'] ?? 0}`);
      }

      process.exit(issues.filter((i) => i.severity === 'error').length > 0 ? 1 : 0);
    });

  // List templates
  taskCmd
    .command('template')
    .description('List available templates')
    .action(() => {
      console.log(`${colors.bright}Available Templates:${colors.reset}\n`);
      for (const [name, tmpl] of Object.entries(templates)) {
        console.log(`${colors.cyan}${name}${colors.reset}`);
        console.log(
          `  ${colors.dim}Level: ${tmpl.level} | Effort: ${tmpl.estimatedEffort}${colors.reset}`
        );
        console.log(`  ${colors.dim}${tmpl.name.substring(0, 60)}...${colors.reset}\n`);
      }
    });
}

function renderTaskList(
  tasks: unknown[],
  metadata: { planName?: string; platform?: string }
): void {
  console.log('');
  console.log(`${colors.bright}Tasks: ${metadata.planName ?? 'Unknown'}${colors.reset}`);
  console.log(`${colors.dim}Platform: ${metadata.platform ?? 'unknown'}${colors.reset}\n`);

  if (tasks.length === 0) {
    console.log(`${colors.dim}No tasks found.${colors.reset}`);
    return;
  }

  const table = new Table({
    head: [
      `${colors.bright}ID${colors.reset}`,
      `${colors.bright}Name${colors.reset}`,
      `${colors.bright}Priority${colors.reset}`,
      `${colors.bright}Status${colors.reset}`,
      `${colors.bright}Blocked By${colors.reset}`,
    ],
    style: { head: [], border: ['cyan'] },
    wordWrap: true,
  });

  const levelConfig: Record<string, { color: keyof typeof colors; icon: string }> = {
    critical: { color: 'red', icon: '🔴' },
    high: { color: 'yellow', icon: '⚠️' },
    medium: { color: 'blue', icon: '○' },
    low: { color: 'dim', icon: '•' },
  };

  for (const t of tasks) {
    const task = t as {
      level: string;
      id: string;
      name: string;
      done?: boolean;
      ready?: boolean;
      blockedBy?: string[];
    };
    const { color, icon } = levelConfig[task.level] || { color: 'dim' as const, icon: '○' };
    const status = task.done
      ? `${colors.green}${symbols.check} Done${colors.reset}`
      : task.ready
        ? `${colors.cyan}○ Ready${colors.reset}`
        : `${colors.red}${symbols.cross} Pending${colors.reset}`;
    const blockedBy = task.blockedBy && task.blockedBy.length > 0 ? task.blockedBy.join(', ') : '-';

    table.push([
      `${colors.cyan}${task.id}${colors.reset}`,
      task.name,
      `${colors[color]}${icon} ${task.level}${colors.reset}`,
      status,
      blockedBy,
    ]);
  }

  console.log(table.toString());
  console.log(`\n${colors.dim}Total: ${tasks.length} task(s)${colors.reset}`);
}

function renderTaskDetail(task: {
  id: string;
  name: string;
  component: string;
  level: string;
  estimatedEffort: string;
  done?: boolean;
  ready?: boolean;
  files?: string;
  testsSuccess?: string[];
  blockedBy?: string[];
  blocks?: string[];
  acceptanceCriteria?: string[];
  implementationNotes?: string;
}): void {
  console.log(`\n${colors.bright}${colors.cyan}${task.id}${colors.reset}: ${task.name}\n`);

  const table = new Table({
    style: { head: [], border: ['cyan'], compact: true },
    wordWrap: true,
  });

  const status = task.done
    ? `${colors.green}${symbols.check} Done`
    : task.ready
      ? `${colors.blue}${symbols.bullet} Ready`
      : `${colors.red}${symbols.cross} Not Ready`;

  table.push(
    [`${colors.bright}Component${colors.reset}`, task.component],
    [`${colors.bright}Level${colors.reset}`, `${colors.yellow}${task.level}${colors.reset}`],
    [`${colors.bright}Effort${colors.reset}`, task.estimatedEffort],
    [`${colors.bright}Status${colors.reset}`, `${status}${colors.reset}`]
  );

  if (task.files) {
    table.push([`${colors.bright}Files${colors.reset}`, task.files]);
  }

  if (task.blockedBy && task.blockedBy.length > 0) {
    table.push([`${colors.bright}Blocked by${colors.reset}`, task.blockedBy.join(', ')]);
  }

  if (task.blocks && task.blocks.length > 0) {
    table.push([`${colors.bright}Blocks${colors.reset}`, task.blocks.join(', ')]);
  }

  if (task.implementationNotes) {
    table.push([`${colors.bright}Notes${colors.reset}`, task.implementationNotes]);
  }

  console.log(table.toString());

  if (task.testsSuccess && task.testsSuccess.length > 0) {
    console.log(`\n${colors.bright}Tests:${colors.reset}`);
    for (const t of task.testsSuccess) {
      console.log(`  ${colors.green}${symbols.check}${colors.reset} ${t}`);
    }
  }

  if (task.acceptanceCriteria && task.acceptanceCriteria.length > 0) {
    console.log(`\n${colors.bright}Acceptance Criteria:${colors.reset}`);
    for (const c of task.acceptanceCriteria) {
      console.log(`  ${colors.cyan}${symbols.bullet}${colors.reset} ${c}`);
    }
  }

  console.log('');
}

function renderDependencyChain(chain: {
  task: { id: string };
  dependencies: Array<{ task: { id: string; name: string }; direct: boolean }>;
  dependents: Array<{ id: string; name: string }>;
}): void {
  console.log(`\n${colors.bright}Dependency Chain: ${chain.task.id}${colors.reset}\n`);

  if (chain.dependencies.length > 0) {
    const depsTable = new Table({
      head: [
        `${colors.bright}Type${colors.reset}`,
        `${colors.bright}ID${colors.reset}`,
        `${colors.bright}Name${colors.reset}`,
      ],
      style: { head: [], border: ['cyan'] },
      wordWrap: true,
    });

    console.log(`${colors.bright}Dependencies:${colors.reset}`);
    for (const dep of chain.dependencies) {
      const type = dep.direct
        ? `${colors.green}${symbols.arrow} Direct${colors.reset}`
        : `${colors.dim}${symbols.bullet} Transitive${colors.reset}`;
      depsTable.push([type, `${colors.cyan}${dep.task.id}${colors.reset}`, dep.task.name]);
    }
    console.log(depsTable.toString());
    console.log('');
  } else {
    console.log(`${colors.green}${symbols.check} No dependencies${colors.reset}\n`);
  }

  if (chain.dependents.length > 0) {
    const depentsTable = new Table({
      head: [`${colors.bright}ID${colors.reset}`, `${colors.bright}Name${colors.reset}`],
      style: { head: [], border: ['cyan'] },
      wordWrap: true,
    });

    console.log(`${colors.bright}Dependents:${colors.reset}`);
    for (const dep of chain.dependents) {
      depentsTable.push([`${colors.cyan}${dep.id}${colors.reset}`, dep.name]);
    }
    console.log(depentsTable.toString());
    console.log('');
  }
}

function renderDashboard(service: TaskService): void {
  const stats = service.getProgress();

  console.log('');
  console.log(`${colors.bright}Task Progress Dashboard${colors.reset}\n`);

  // Progress bar
  const barWidth = 50;
  const filled = Math.floor((Number.parseFloat(stats.completionRate) / 100) * barWidth);
  const empty = barWidth - filled;
  const bar = `${colors.green}${'█'.repeat(filled)}${colors.dim}${'░'.repeat(empty)}${colors.reset}`;

  const progressTable = new Table({
    style: { head: [], border: ['cyan'], compact: true },
  });

  progressTable.push([
    `${colors.bright}Progress${colors.reset}`,
    `${bar} ${stats.completionRate}%`,
  ]);

  console.log(progressTable.toString());

  // Status summary
  const statusTable = new Table({
    head: [
      `${colors.bright}Total${colors.reset}`,
      `${colors.green}Done${colors.reset}`,
      `${colors.yellow}Ready${colors.reset}`,
      `${colors.red}Pending${colors.reset}`,
    ],
    style: { head: [], border: ['cyan'] },
  });

  statusTable.push([
    `${colors.cyan}${stats.total}${colors.reset}`,
    `${colors.green}${stats.byStatus.done}${colors.reset}`,
    `${colors.yellow}${stats.byStatus.ready}${colors.reset}`,
    `${colors.red}${stats.byStatus.pending}${colors.reset}`,
  ]);

  console.log(`\n${colors.bright}By Status:${colors.reset}`);
  console.log(statusTable.toString());

  // Priority breakdown
  const priorityTable = new Table({
    head: [
      `${colors.red}Critical${colors.reset}`,
      `${colors.yellow}High${colors.reset}`,
      `${colors.blue}Medium${colors.reset}`,
      `${colors.dim}Low${colors.reset}`,
    ],
    style: { head: [], border: ['cyan'] },
  });

  priorityTable.push([
    `${colors.red}${stats.byLevel.critical}${colors.reset}`,
    `${colors.yellow}${stats.byLevel.high}${colors.reset}`,
    `${colors.blue}${stats.byLevel.medium}${colors.reset}`,
    `${colors.dim}${stats.byLevel.low}${colors.reset}`,
  ]);

  console.log(`\n${colors.bright}By Priority:${colors.reset}`);
  console.log(priorityTable.toString());

  // Dependencies
  const depTable = new Table({
    head: [`${colors.bright}Type${colors.reset}`, `${colors.bright}Count${colors.reset}`],
    style: { head: ['cyan'], border: ['cyan'] },
  });

  depTable.push(
    [
      `${colors.green}${symbols.check} Foundation${colors.reset}`,
      `${colors.green}${stats.foundation}${colors.reset}`,
    ],
    [
      `${colors.red}${symbols.arrow} Blocked${colors.reset}`,
      `${colors.red}${stats.blocked}${colors.reset}`,
    ]
  );

  console.log(`\n${colors.bright}Dependencies:${colors.reset}`);
  console.log(depTable.toString());

  // Ready tasks
  const readyTasks = service.list({ done: false, ready: true, foundation: true });
  if (readyTasks.length > 0) {
    console.log(`\n${colors.green}${symbols.star} Ready to start:${colors.reset}`);

    const readyTable = new Table({
      head: [
        `${colors.bright}ID${colors.reset}`,
        `${colors.bright}Priority${colors.reset}`,
        `${colors.bright}Name${colors.reset}`,
      ],
      style: { head: [], border: ['cyan'] },
      wordWrap: true,
    });

    for (const task of readyTasks.slice(0, 5)) {
      readyTable.push([
        `${colors.cyan}${task.id}${colors.reset}`,
        `${colors.dim}[${task.level}]${colors.reset}`,
        task.name,
      ]);
    }

    console.log(readyTable.toString());

    if (readyTasks.length > 5) {
      console.log(`${colors.dim}... and ${readyTasks.length - 5} more${colors.reset}`);
    }
  }

  console.log('');
}
