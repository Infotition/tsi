import chalk from 'chalk';
import { emptyDirSync } from 'fs-extra';
import ora from 'ora';
import { watch } from 'rollup';
import { createBuildConfigs } from '../generators/createBuildConfigs';
import { clearConsole } from '../utils/clearConsole';
import { appDist } from '../utils/constants';

export type WatchOpts = {
  /** The path of the entry file (src/index.ts). */
  entry: string;
  /** The format of the output (esm). */
  format: 'cjs' | 'esm';
  /** Whether types should get generated or not. */
  types: boolean;
  /** The target environment of the output (prod). */
  env: 'dev' | 'prod';
  /** Whether source maps should get generated or not (false). */
  maps: boolean;
  /** Whether css should get extracted or bundled in js. */
  extract: boolean;
};

export const watchAction = async (opts: WatchOpts) => {
  const buildConfigs = createBuildConfigs({
    ...opts,
    env: 'dev',
    types: false,
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
};
