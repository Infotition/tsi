import { existsSync } from 'fs';
import { resolve as pathResolve } from 'path';
//import { DEFAULT_EXTENSIONS } from '@babel/core';
//import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import cssnanoPlugin from 'cssnano';
import postcssimport from 'postcss-import';
import postcsspresetenv from 'postcss-preset-env';
import { RollupOptions } from 'rollup';
import autoExternal from 'rollup-plugin-auto-external';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

import { appDist, appRoot, appTypes } from '../constants/paths';
import { BuildOpts } from '../types/index.types';

/**
 * From user build option input an array rollup configuration gets generated and
 * returned. Each element must be bundled and written with rollup.
 *
 * @param opts  The build options to generate a config from.
 * @returns     The rollup configuration.
 */
const createRollupConfig = (opts: BuildOpts) => {
  const { format, entry, env, maps, types } = opts;

  const isProd = env === 'prod';
  const isEsm = format === 'esm';

  const filename = entry.split('/').pop()?.split('.')[0] || entry;
  const inputFile = pathResolve(appRoot, entry);
  const outputFile = pathResolve(appDist, `${filename}.js`);

  return [
    {
      input: inputFile,
      treeshake: {
        propertyReadSideEffects: false,
      },
      output: [
        {
          file: outputFile,
          format,
          sourcemap: maps,
        },
      ],
      plugins: [
        postcss({
          plugins: [
            postcssimport,
            autoprefixer,
            postcsspresetenv({
              browsers: ['last 2 versions', '> 5%'],
            }),
            cssnanoPlugin,
          ],
        }),

        autoExternal(),

        /*babel({
          exclude: 'node_modules/**',
          extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
          babelHelpers: 'bundled',
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                targets: ['>0.2%', 'not dead', 'not op_mini all'],
              },
            ],
            '@babel/preset-react',
          ],
        }),*/

        typescript({
          tsconfig: pathResolve(appRoot, 'tsconfig.json'),

          plugins: [{ name: 'typescript-plugin-css-modules' }],

          exclude: ['node_modules', appDist],
          module: 'esnext',
          target: 'es2021',
          jsx: 'react',

          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,

          lib: ['es2021', 'dom'],
          forceConsistentCasingInFileNames: true,
          moduleResolution: 'node',
          types: ['node', 'jest'],

          sourceMap: maps,

          declaration: types,
          declarationDir: types ? 'types' : undefined,

          baseUrl: appRoot,
          outDir: appDist,
        }),

        resolve({
          resolveOnly: [/.*\.(scss|css)/],
        }),

        isProd &&
          terser({
            output: { comments: false },
            compress: {
              keep_infinity: true,
              pure_getters: true,
              passes: 10,
            },
            module: isEsm,
            toplevel: format === 'cjs' || isEsm,
          }),
      ],
    },
    {
      input: pathResolve(appTypes, `${filename}.d.ts`),
      output: [{ file: pathResolve(appDist, `${filename}.d.ts`), format }],
      plugins: [dts(), del({ targets: appTypes, hook: 'buildEnd' })],
    },
  ];
};

/**
 * From user build option input an array rollup configuration gets generated and
 * returned. Each element must be bundled and written with rollup.
 *
 * If multiple entries are provided, multiple rollup configs are getting generated.
 *
 * @param opts  The build options to generate a config from.
 * @returns     The rollup configuration.
 */
export const createBuildConfigs = (opts: BuildOpts): RollupOptions[] => {
  let { entry } = opts;

  if (!entry) {
    entry = 'src/index.ts';

    if (existsSync(pathResolve(appRoot, 'src/index.tsx'))) {
      entry = 'src/index.tsx';
    }
  }

  // If only a single entry is provided, create its config
  if (entry.indexOf(',') === -1) {
    return createRollupConfig({ ...opts, entry });
  }

  // If multiple entries are provided, create rollup config for every entry
  const entries = entry.split(',');
  return entries.map((e) => createRollupConfig({ ...opts, entry: e })).flat();
};
