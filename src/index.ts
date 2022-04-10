#!/usr/bin/env node

import { OutputOptions, rollup } from 'rollup';
import sade from 'sade';
import { createBuildConfigs } from './generators/createBuildConfigs';
import { BuildOpts } from './types';

const prog = sade('tsi');

prog
  .command('build')
  .describe('Build your project once and exit')

  .option('--entry', 'Entry Module(s)', 'src/index.ts')
  .example('build --entry src/index.ts')

  .option('--target', 'Specify your target environment', 'browser')
  .example('build --target node')

  .option('--env', 'Specify your build environment', 'prod')
  .example('build --env prod')

  .option('--maps', 'Generate source maps', false)
  .example('build --maps')

  .option('--format', 'Specify module format(s)', 'esm')
  .example('build --format both')

  .option('--tsconfig', 'Specify custom tsconfig path')
  .example('build --tsconfig ./tsconfig.json')

  .option('--transpileOnly', 'Skip type checking', false)
  .example('build --transpileOnly')

  .action(async (opts: BuildOpts) => {
    const buildConfigs = createBuildConfigs(opts);
    const outputOptions = buildConfigs.output as OutputOptions[];

    const bundle = await rollup(buildConfigs);
    await Promise.all(outputOptions.map(bundle.write));
    await bundle.close();
  });

prog.parse(process.argv);
