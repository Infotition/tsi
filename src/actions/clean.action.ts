import { existsSync, rmSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import ora from 'ora';

export type CleanOpts = {
  /** Whether node modules folder should also get cleaned. */
  modules: boolean;
};

export const cleanAction = async ({ modules }: CleanOpts) => {
  const spinner = ora();
  const cwd = process.cwd();

  spinner.start(chalk.bold.cyan('Cleaning project...'));

  const files = ['package', 'lib', '.turbo', 'coverage', 'build'];

  for (const file of files) {
    if (existsSync(resolve(cwd, file))) {
      rmSync(resolve(cwd, file), { recursive: true });
    }
  }

  if (modules && existsSync(resolve(cwd, 'node_modules'))) {
    rmSync(resolve(cwd, 'node_modules'), { recursive: true });
  }

  spinner.succeed(chalk.bold.green('Cleaned successfully'));
};
