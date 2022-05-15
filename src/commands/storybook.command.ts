import { Sade } from 'sade';
import { storybookAction } from '../actions/storybook.action';

export const storybook = (prog: Sade) => {
  prog
    .command('storybook')
    .describe('Start the storybook development server.')
    .action(storybookAction);
};
