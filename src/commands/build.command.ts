import { Sade } from 'sade';
import { buildAction } from '../actions/build.action';

export const build = (prog: Sade) => {
  prog
    .command('build')
    .describe('Build your project once and exit.')

    .option('--entry', 'Specify the Entry Module(s).')
    .example('build --entry src/index.ts')

    .option('--types', 'Generate types.')
    .example('build --types')

    .option('--env', 'Specify your build environment.', 'prod')
    .example('build --env prod')

    .option('--maps', 'Generate source maps.', false)
    .example('build --maps')

    .option('--format', 'Specify the module format', 'esm')
    .example('build --format esm')

    .action(buildAction);
};
