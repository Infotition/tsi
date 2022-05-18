import { Sade } from 'sade';
import { storybookAction } from '../actions/storybook.action';

export const storybook = (prog: Sade) => {
  prog
    .command('storybook')
    .describe('Start the storybook development server.')

    .option('--build', 'Whether storybook should build a static folder.', false)
    .example('storybook --build')

    .action(storybookAction);
};
