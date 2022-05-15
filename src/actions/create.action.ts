import { execSync } from 'child_process';
import { cpSync, existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import ora from 'ora';

export type CreateOpts = {
  /** The name of the template to create. */
  template: string;
};

export const createAction = async (pkg: string, { template }: CreateOpts) => {
  const cwd = process.cwd();

  console.log(
    chalk.magenta(`
::::::::::: ::::::::  :::::
  :+:    :+:    :+:  :+:
  +:+    +:+         +:+
  +#+    +#++:++#++  +#+
  +#+           +#+  +#+
  #+#    #+#    #+#  #+#
  ###     ########  #####
`),
  );

  const folderPath = resolve(cwd, pkg);

  if (existsSync(folderPath)) {
    return console.log(chalk.bold.red('A folder with the provided name already exists.'));
  }

  const bootSpinner = ora(`Creating ${chalk.bold.green(pkg)}...`);

  cpSync(resolve(process.argv[1], `../templates/${template}`), resolve(cwd, pkg), {
    recursive: true,
  });

  bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);

  const nodeSpinner = ora(`Installing ${chalk.bold.green('dependencies')}...`);
  execSync(
    `cd ${folderPath}&&yarn install&&git init&&git add .&&git commit -m "chore: initial commit"&&npx husky install`,
  );
  nodeSpinner.succeed(`Installed ${chalk.bold.green('dependencies')}`);
};
