import chalk from 'chalk';
import { emptyDirSync } from 'fs-extra';
import ora from 'ora';
import { OutputOptions, rollup } from 'rollup';
import { createBuildConfigs } from '../generators/createBuildConfigs';
import { appDist } from '../utils/constants';
import { extractFilename } from '../utils/extractFilename';
import { parseSeconds } from '../utils/parseSeconds';

export type BuildOpts = {
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
};

export const buildAction = async (opts: BuildOpts) => {
  const spinner = ora();

  console.log(
    chalk.bold.cyan(`Generating ${opts.env === 'prod' ? 'production' : 'development'} build...`),
  );

  emptyDirSync(appDist);

  const buildConfigs = createBuildConfigs(opts);

  for (const config of buildConfigs) {
    const startTime = process.hrtime();

    const outputOptions = config.output as OutputOptions[];

    const input = extractFilename(config.input?.toString() || '');
    const output = extractFilename(outputOptions[0].file || '');

    spinner.start(chalk.cyan(`bundles ${input} →  ${output}...`));

    const bundle = await rollup(config);
    await Promise.all(outputOptions.map(bundle.write));
    await bundle.close();

    const elapsed = parseSeconds(process.hrtime(startTime));
    spinner.succeed(
      chalk.green('created ' + chalk.bold(output) + ' in ' + chalk.bold(elapsed) + 's'),
    );
  }
};
