import { existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import jest from 'jest';
import { createJestConfig } from '../generators/createJestConfig';
import { appRoot } from '../utils/constants';

/**
 * Runs the jest test suites.
 *
 * The jest setup file is the standard tsi one. If this files isn't
 * found in the current project, the action searches it max. 3 folders up the file tree. This is
 * needed in yarn workspaces/monorepos, because they store node modules in monorepo root and not
 * in the project root.
 */
export const testAction = async () => {
  for (let i = 0; i < 3; i += 1) {
    const setupPath = join(
      appRoot,
      '../'.repeat(i),
      '/node_modules/@infotition/tsi/lib/config/jest.setup.ts',
    );

    if (existsSync(setupPath)) {
      return jest.run(['--config', JSON.stringify(createJestConfig(setupPath))]);
    }
  }

  console.log(
    chalk.bold.red(
      'The infotition jest setup file was not found in a range of 3 folders up. Please make sure, the newest tsi version is installed.',
    ),
  );
};
