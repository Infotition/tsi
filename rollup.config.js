import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import shebang from 'rollup-plugin-preserve-shebang';
import dts from 'rollup-plugin-dts';

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
      typescript({
        tsconfig: './tsconfig.json',

        include: ['src/**/*.ts'],
        exclude: ['node_modules', 'lib'],
        module: 'esnext',
        target: 'es2021',

        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,

        lib: ['es2021', 'dom'],
        forceConsistentCasingInFileNames: true,
        moduleResolution: 'node',

        declaration: true,
        declarationDir: 'types',

        sourceMap: false,
        baseUrl: './src',
        outDir: './lib',
      }),
      terser(),
      shebang(),
    ],
  },
];

export default rollupConfig;
