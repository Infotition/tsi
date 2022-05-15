import { Sade } from 'sade';
import { testAction } from '../actions/test.action';

export const test = (prog: Sade) => {
  prog.command('test').describe('Run the jest test suites.').action(testAction);
};
