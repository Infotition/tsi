import { existsSync, readdirSync, lstatSync, copyFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { emptyDirSync } from 'fs-extra';
import ora from 'ora';
import { OutputOptions, rollup } from 'rollup';
import { createBuildConfigs } from '../generators/createBuildConfigs';
import { appDist, appSrc } from '../utils/constants';
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
  /** Whether css should get extracted or bundled in js. */
  extract: boolean;
  /** Whether scss should additionally get extracted. */
  extractScss: boolean;
};

const copyFiles = (src: string, dest: string, ext: string): void => {
  if (!existsSync(src)) return;

  const files = readdirSync(src);

  for (let i = 0; i < files.length; i += 1) {
    const file = join(src, files[i]);
    const stats = lstatSync(file);

    if (stats.isDirectory()) {
      copyFiles(file, dest, ext);
    } else if (file.endsWith(ext)) {
      const filename = extractFilename(file);
      if (filename.startsWith('index')) continue;
      copyFileSync(file, join(dest, filename));
      console.log(chalk.green('✔ copied ' + chalk.bold(filename) + ' to dest'));
    }
  }
};

export const buildAction = async (opts: BuildOpts) => {
  const spinner = ora();

  console.log(
    chalk.bold.cyan(`Generating ${opts.env === 'prod' ? 'production' : 'development'} build...`),
  );

  emptyDirSync(appDist);

  const buildConfigs = createBuildConfigs(opts);

  if (buildConfigs) {
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
  } else {
    console.log(chalk.red('No entry is defined.'));
  }

  if (opts.extractScss) {
    copyFiles(appSrc, appDist, 'scss');
  }
};
