import { resolve } from 'path';
import { resolveApp } from '../utils/resolveApp';

/** The root folder of the project. */
export const appRoot = resolveApp('.');
/** The path to the source directory. */
export const appSrc = resolveApp('src');
/** The path to the build directory. */
export const appDist = resolveApp('lib');
/** The path to the type directory. */
export const appTypes = resolve(appDist, 'types');
