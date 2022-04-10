#!/usr/bin/env node

import chalk from 'chalk';
import { OutputOptions, rollup } from 'rollup';
import sade from 'sade';

import { createBuildConfigs } from './generators/createBuildConfigs';
import type { BuildOpts } from './types/index.types';
import { extractFilename } from './utils/extractFilename';
import { parseSeconds } from './utils/parseSeconds';

const prog = sade('tsi');

//* ----------------------------------------------------------------------------------
//* BUILD COMMAND
//* ----------------------------------------------------------------------------------
prog
  .command('build')
  .describe('Build your project once and exit.')

  .option('--entry', 'Specify the Entry Module(s).', 'src/index.ts')
  .example('build --entry src/index.ts')

  .option('--env', 'Specify your build environment.', 'prod')
  .example('build --env prod')

  .option('--maps', 'Generate source maps.', false)
  .example('build --maps')

  .option('--format', 'Specify the module format', 'esm')
  .example('build --format esm')

  .action(async (opts: BuildOpts) => {
    console.log(
      chalk.blue(`Generating ${opts.env === 'prod' ? 'production' : 'development'} build...`),
    );

    const buildConfigs = createBuildConfigs(opts);

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

prog.parse(process.argv);
