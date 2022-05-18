import { existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import jest from 'jest';
import { createJestConfig } from '../generators/createJestConfig';
import { appRoot } from '../utils/constants';

export type TestOpts = {
  /** Whether a coverage report should get generated or not. */
  coverage: boolean;
};

export const testAction = async (opts: TestOpts) => {
  for (let i = 0; i < 3; i += 1) {
    const setupPath = join(
      appRoot,
      '../'.repeat(i),
      '/node_modules/@infotition/tsi/lib/config/jest.setup.ts',
    );

    if (existsSync(setupPath)) {
      return jest.run([
        opts.coverage ? '--coverage' : '',
        '--config',
        JSON.stringify(createJestConfig(setupPath)),
      ]);
    }
  }

  console.log(
    chalk.bold.red(
      'The infotition jest setup file was not found in a range of 3 folders up. Please make sure, the newest tsi version is installed.',
    ),
  );
};
