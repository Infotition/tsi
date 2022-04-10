import { RollupOptions } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import { appDist, appRoot } from '../paths';
import { BuildOpts } from '../types';

export const createBuildConfigs = (opts: BuildOpts): RollupOptions => {
  const { format, entry, tsconfig, env, maps } = opts;

  const isProd = env === 'prod';
  const isEsm = format === 'esm';
  const inputFile = `${appRoot}/${entry}`;
  const outputFile = `${appDist}/index.js`;

  return {
    input: inputFile,
    output: [
      {
        file: outputFile,
        format,
        sourcemap: maps,
      },
    ],
    plugins: [
      typescript({
        tsconfig: tsconfig,

        tsconfigDefaults: {
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
            declarationDir: `${appDist}/types`,
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
  };
};
