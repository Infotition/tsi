import { Sade } from 'sade';
import { cleanAction } from '../actions/clean.action';

export const clean = (prog: Sade) => {
  prog
    .command('clean')
    .describe('Clean your project from build files (and dependencies).')

    .option('--modules', 'Also clean node modules folder.')
    .example('publish --modules')

    .action(cleanAction);
};
