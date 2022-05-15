import { Sade } from 'sade';
import { lintAction } from '../actions/lint.action';

export const lint = (prog: Sade) => {
  prog.command('lint').describe('Lint your source code.').action(lintAction);
};
