import { Sade } from 'sade';
import { publishAction } from '../actions/publish.action';

export const publish = (prog: Sade) => {
  prog
    .command('publish')
    .describe('Publish your project to the npm registry.')

    .option('--dry', 'Whether the project should be published or not.')
    .example('publish --dry')

    .option('--clean', 'Whether the bundle should get deleted after publishing.')
    .example('publish --clean')

    .option('--license', 'Specify the license path.')
    .example('publish --license ../LICENSE')

    .action(publishAction);
};
