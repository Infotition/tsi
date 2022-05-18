import { exec, execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

export type StorybookOpts = {
  /** Whether storybook should build a static folder. */
  build: boolean;
};

export const storybookAction = async (opts: StorybookOpts) => {
  const spinner = ora();

  if (opts.build) {
    spinner.start(chalk.bold.cyan('Building static docs folder...\n'));

    execSync(
      'build-storybook --quiet -o ./docs -c ../../node_modules/@infotition/tsi/lib/config/.storybook',
    );

    return spinner.succeed(chalk.bold.green('Docs successfully created.'));
  }

  spinner.start(chalk.bold.cyan('Running storybook server...\n'));

  const storybook = exec(
    'start-storybook -p 6006 --quiet -c ../../node_modules/@infotition/tsi/lib/config/.storybook',
  );

  //storybook.stderr?.on('data', (data) => console.log(data.toString()));
  storybook.on('exit', () => spinner.succeed(chalk.bold.green('Storybook closed')));
};
