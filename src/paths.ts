import { resolveApp } from './utils/resolveApp';

export const appRoot = resolveApp('.');
export const appSrc = resolveApp('src');
export const appDist = resolveApp('lib');

export const tsconfigJson = resolveApp('tsconfig.json');
