import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

/** Lint the source code via projects eslint configuration. */
export const lintAction = async () => {
  const spinner = ora();

  spinner.start(chalk.bold.cyan('Linting source code...'));
  execSync('eslint');
  spinner.succeed(chalk.bold.green('Linting completed'));
};
