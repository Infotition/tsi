import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import shebang from 'rollup-plugin-preserve-shebang';
import autoExternal from 'rollup-plugin-auto-external';
import copy from 'rollup-plugin-copy';

const rollupConfig = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.js',
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins: [
      autoExternal(),
      typescript({
        tsconfig: './tsconfig.json',

        include: ['src/**/*.ts'],
        exclude: ['node_modules', 'lib'],
        module: 'esnext',
        target: 'es2021',

        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        declaration: false,

        lib: ['es2021', 'dom'],
        forceConsistentCasingInFileNames: true,
        moduleResolution: 'node',

        sourceMap: false,
        baseUrl: './src',
        outDir: './lib',
      }),
      terser(),
      shebang(),
      copy({
        targets: [
          { src: 'templates', dest: 'lib' },
          { src: 'config', dest: 'lib' },
          { src: 'index.d.ts', dest: 'lib' },
        ],
      }),
    ],
  },
];

export default rollupConfig;
