import { Sade } from 'sade';
import { docsAction } from '../actions/docs.action';

export const docs = (prog: Sade) => {
  prog
    .command('docs')
    .describe('Bundles the doc folders from workspaces.')

    .option('--workspaces', 'Specify the paths of the workspaces.')
    .example('docs --workspaces components,utils')

    .action(docsAction);
};
