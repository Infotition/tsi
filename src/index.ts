#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import { emptyDirSync } from 'fs-extra';
// eslint-disable-next-line import/default
import pkg from 'jest';
import ora from 'ora';
import { OutputOptions, rollup, watch } from 'rollup';
import sade from 'sade';

import { appDist } from './constants/paths';
import { createBuildConfigs } from './generators/createBuildConfigs';
import { createJestConfig } from './generators/createJestConfig';
import type { BuildOpts } from './types/index.types';
import { clearConsole } from './utils/clearConsole';
import { extractFilename } from './utils/extractFilename';
import { parseSeconds } from './utils/parseSeconds';

const { run } = pkg;

const templates = ['basic', 'minimal', 'react'];
const prog = sade('tsi');

//* ----------------------------------------------------------------------------------
//* CREATE COMMAND
//* ----------------------------------------------------------------------------------
prog
  .command('create <pkg>')
  .describe('Create a new package with TSI')
  .example('create package')
  .option(
    '--template',
    `Specify a template. Allowed choices: [${Object.keys(templates).join(', ')}]`,
  )
  .example('create --template react package')
  .action(async (pkg: string, { template }: { template: string }) => {
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

    if (fs.existsSync(resolve(cwd, pkg))) {
      console.log(chalk.bold.red('A folder with the provided name already exists.'));
      return;
    }

    const bootSpinner = ora(`Creating ${chalk.bold.green(pkg)}...`);

    fs.cpSync(resolve(process.argv[1], `../templates/${template}`), resolve(cwd, pkg), {
      recursive: true,
    });

    bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);

    const nodeSpinner = ora(`Installing ${chalk.bold.green('dependencies')}...`);
    execSync(
      `cd ${pkg}&&yarn install&&git init&&git add .&&git commit -m "chore: initial commit"&&npx husky install&&`,
    );
    nodeSpinner.succeed(`Installed ${chalk.bold.green('dependencies')}`);
  });

//* ----------------------------------------------------------------------------------
//* CLEAN COMMAND
//* ----------------------------------------------------------------------------------

prog
  .command('clean')
  .describe('Clean your project from build files and dependencies.')

  .option('--modules', 'Also clean node modules folder.')
  .example('publish --modules')

  .action(async ({ modules }: { modules: boolean }) => {
    const spinner = ora();
    const cwd = process.cwd();

    spinner.start(chalk.bold.cyan('Cleaning project...'));

    const files = ['package', 'lib'];

    for (const file of files) {
      if (fs.existsSync(resolve(cwd, file))) {
        fs.rmSync(resolve(cwd, file), { recursive: true });
      }
    }

    if (modules && fs.existsSync(resolve(cwd, 'node_modules'))) {
      fs.rmSync(resolve(cwd, 'node_modules'), { recursive: true });
    }

    spinner.succeed(chalk.bold.green('Cleaned successfully'));
  });

//* ----------------------------------------------------------------------------------
//* LINT COMMAND
//* ----------------------------------------------------------------------------------

prog
  .command('lint')
  .describe('Lint your source code.')

  .action(async () => {
    const spinner = ora();

    spinner.start(chalk.bold.cyan('Linting source code...'));
    execSync('eslint src/**/*.ts');
    spinner.succeed(chalk.bold.green('Linting completed'));
  });

//* ----------------------------------------------------------------------------------
//* PUBLISH COMMAND
//* ----------------------------------------------------------------------------------

prog
  .command('publish')
  .describe('Publish your project to the npm registry.')

  .option('--dry', 'Whether the project should be published or not.')
  .example('publish --dry')

  .option('--clean', 'Whether the bundle should get deleted after publishing.')
  .example('publish --clean')

  .option('--license', 'Specify the license path.')
  .example('publish --license ../LICENSE')

  .action(async ({ dry, clean, license }: { dry: boolean; clean: boolean; license: string }) => {
    const cwd = process.cwd();

    if (!fs.existsSync(resolve(cwd, 'lib'))) {
      console.log(
        chalk.bold.red(
          'You must build the project before you can publish it.\n  - Try running yarn build or npm run build.\n  - Or run the tsi build script directly.',
        ),
      );
      return;
    }

    const spinner = ora();

    spinner.start(chalk.bold.cyan('Bundling package...'));

    if (fs.existsSync(resolve(cwd, 'package'))) {
      fs.rmSync(resolve(cwd, 'package'), { recursive: true });
    }

    execSync(`npx clean-publish --without-publish --temp-dir package --clean-docs`);

    const filter = ['LICENSE', 'lib', 'package.json', 'README.md'];

    const files = fs.readdirSync(cwd);

    for (const file of files) {
      if (filter.includes(file)) continue;

      if (fs.existsSync(resolve(cwd, 'package', file))) {
        fs.rmSync(resolve(cwd, 'package', file), { recursive: true });
      }
    }

    if (license) {
      fs.copyFileSync(resolve(cwd, license), resolve(cwd, 'package/LICENSE'));
    }

    spinner.succeed(chalk.bold.green('Bundling successfully'));

    const authToken = process.env.NODE_AUTH_TOKEN;

    const withAuth = authToken ? `npx cross-env NODE_AUTH_TOKEN=${authToken} ` : '';
    const withDry = dry ? '--dry-run' : '';
    const publishCommand = `cd package&&${withAuth}npm publish ${withDry} --access public`;

    if (dry) {
      execSync(publishCommand);
    } else {
      const localVersion = JSON.parse(
        fs.readFileSync(resolve(cwd, 'package.json')).toString(),
      ).version;
      const remoteVersion = execSync('npm view . version', { encoding: 'utf-8' }).trim();

      if (localVersion !== remoteVersion) {
        execSync(publishCommand);
      } else {
        console.log(chalk.bold.red('Package already up to date.'));
      }
    }

    if (clean) {
      fs.rmSync(resolve(cwd, 'package'), { recursive: true });
    }
  });

//* ----------------------------------------------------------------------------------
//* WATCH COMMAND
//* ----------------------------------------------------------------------------------

prog
  .command('watch')
  .describe('Build your project once and exit.')

  .option('--entry', 'Specify the Entry Module(s).')
  .example('watch --entry src/index.ts')

  .option('--types', 'Generate types.')
  .example('watch --types')

  .option('--env', 'Specify your build environment.')
  .example('watch --env prod')

  .option('--maps', 'Generate source maps.', false)
  .example('watch --maps')

  .option('--format', 'Specify the module format', 'esm')
  .example('watch --format esm')

  .action(async (opts: BuildOpts) => {
    const buildConfigs = createBuildConfigs({
      ...opts,
      env: opts.env || 'dev',
      types: opts.types || false,
    });

    emptyDirSync(appDist);

    const spinner = ora().start();

    watch(
      buildConfigs.map((config) => {
        return {
          watch: {
            silent: true,
            include: ['src/**'],
            exclude: ['node_modules/**'],
          },
          ...config,
        };
      }),
    ).on('event', (event) => {
      if (event.code === 'START') {
        clearConsole();
        spinner.start(chalk.bold.cyan('Compiling modules...'));
      }

      if (event.code === 'END') {
        spinner.succeed(chalk.bold.green('Compiled successfully'));
        console.log(chalk.dim('Watching for changes'));
      }
    });
  });

//* ----------------------------------------------------------------------------------
//* BUILD COMMAND
//* ----------------------------------------------------------------------------------

prog
  .command('build')
  .describe('Build your project once and exit.')

  .option('--entry', 'Specify the Entry Module(s).')
  .example('build --entry src/index.ts')

  .option('--types', 'Generate types.')
  .example('watch --types')

  .option('--env', 'Specify your build environment.', 'prod')
  .example('build --env prod')

  .option('--maps', 'Generate source maps.', false)
  .example('build --maps')

  .option('--format', 'Specify the module format', 'esm')
  .example('build --format esm')

  .action(async (opts: BuildOpts) => {
    console.log(
      chalk.blue(
        `Generating ${(opts.env || 'prod') === 'prod' ? 'production' : 'development'} build...`,
      ),
    );

    if (opts.types) execSync('npx tsc');

    emptyDirSync(appDist);

    const buildConfigs = createBuildConfigs({
      ...opts,
      env: opts.env || 'prod',
      types: opts.types,
    });

    for (const config of buildConfigs) {
      const startTime = process.hrtime();

      const outputOptions = config.output as OutputOptions[];

      const input = extractFilename(config.input?.toString() || '');
      const output = extractFilename(outputOptions[0].file || '');

      console.log(' - ' + chalk.cyan(`${input} →  ${output}`));

      const bundle = await rollup(config);
      await Promise.all(outputOptions.map(bundle.write));
      await bundle.close();

      const elapsed = parseSeconds(process.hrtime(startTime));
      console.log(
        '   ' + chalk.green('created ' + chalk.bold(output) + ' in ' + chalk.bold(elapsed) + 's'),
      );
    }
  });

//* ----------------------------------------------------------------------------------
//* JEST COMMAND
//* ----------------------------------------------------------------------------------

prog
  .command('test')
  .describe('Run jest test runner.')

  .option('--tsi', 'Specify the node_modules where tsi is located.')
  .example('test --tsi ../../')

  .action(async ({ tsi }: { tsi: string | undefined }) => {
    const config = createJestConfig(tsi);
    run(['--config', JSON.stringify(config)]);
  });

prog.parse(process.argv);
