import { Sade } from 'sade';
import { createAction } from '../actions/create.action';

const templates = ['basic', 'turbo-basic', 'react'];

export const create = (prog: Sade) => {
  prog
    .command('create <pkg>')
    .describe('Create a new TSI package.')
    .example('create package')
    .option(
      '--template',
      `Specify a template. Allowed choices: [${Object.keys(templates).join(', ')}]`,
    )
    .example('create --template react package')
    .action(createAction);
};
