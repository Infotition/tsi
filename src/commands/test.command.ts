import { Sade } from 'sade';
import { testAction } from '../actions/test.action';

export const test = (prog: Sade) => {
  prog
    .command('test')
    .describe('Run the jest test suites.')

    .option('--coverage', 'Whether a coverage report should get generated or not.')
    .example('test --coverage')

    .action(testAction);
};
