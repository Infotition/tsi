import { Sade } from 'sade';
import { watchAction } from '../actions/watch.action';

export const watch = (prog: Sade) => {
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

    .option('--extract', 'Extract css into own files', false)
    .example('build --extract')

    .action(watchAction);
};
