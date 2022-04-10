#!/usr/bin/env node

import { OutputOptions, rollup } from 'rollup';
import sade from 'sade';

import { createBuildConfigs } from './generators/createBuildConfigs';
import type { BuildOpts } from './types/index.types';

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
    const buildConfigs = createBuildConfigs(opts);

    for (const config of buildConfigs) {
      const outputOptions = config.output as OutputOptions[];

      const bundle = await rollup(config);
      await Promise.all(outputOptions.map(bundle.write));
      await bundle.close();
    }
  });

prog.parse(process.argv);
