import fs from 'fs';
import path from 'path';

/** The current the current working directory of the Node.js process. */
export const appDirectory = fs.realpathSync(process.cwd());

/**
 * Resolves a given relative path with the cwd to a absolute path.
 *
 * @param relativePath  The relative path to resolve in the app context.
 * @returns             The resolved absolute path.
 */
export const resolveApp = (relativePath: string) => {
  return path.resolve(appDirectory, relativePath);
};
