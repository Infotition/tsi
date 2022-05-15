import { exec } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

export const storybookAction = async () => {
  const spinner = ora();
  spinner.start(chalk.bold.cyan('Running storybook server...\n'));

  const storybook = exec(
    'start-storybook -p 6006 --quiet -c ../../node_modules/@infotition/tsi/lib/config/.storybook',
  );

  storybook.stderr?.on('data', (data) => console.log(data.toString()));
  storybook.on('exit', () => spinner.succeed(chalk.bold.green('Storybook closed')));
};
