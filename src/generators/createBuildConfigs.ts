import { resolve } from 'path';
import { RollupOptions } from 'rollup';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import { appDist, appRoot, appSrc, appTypes } from '../constants/paths';
import { BuildOpts } from '../types/index.types';

/**
 * From user build option input an array rollup configuration gets generated and
 * returned. Each element must be bundled and written with rollup.
 *
 * @param opts  The build options to generate a config from.
 * @returns     The rollup configuration.
 */
export const createBuildConfigs = (opts: BuildOpts): RollupOptions[] => {
  const { format, entry, env, maps } = opts;

  const isProd = env === 'prod';
  const isEsm = format === 'esm';

  const filename = entry.split('/').pop()?.split('.')[0] || entry;
  const inputFile = resolve(appRoot, entry);
  const outputFile = resolve(appDist, `${filename}.js`);

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
        typescript({
          tsconfigDefaults: {
            include: [`${appSrc}/**/*.ts`],
            exclude: ['node_modules', appDist],
            compilerOptions: {
              module: 'esnext',
              target: 'es2021',

              strict: true,
              esModuleInterop: true,
              skipLibCheck: true,

              lib: ['es2021', 'dom'],
              forceConsistentCasingInFileNames: true,
              moduleResolution: 'node',

              sourceMap: maps,
              declaration: true,
              declarationDir: appTypes,
              baseUrl: appRoot,
              outDir: appDist,
            },
          },

          useTsconfigDeclarationDir: true,
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
      input: resolve(appTypes, `${filename}.d.ts`),
      output: [{ file: resolve(appDist, `${filename}.d.ts`), format }],
      plugins: [dts(), del({ targets: appTypes, hook: 'buildEnd' })],
    },
  ];
};
