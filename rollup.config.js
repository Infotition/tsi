import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import shebang from 'rollup-plugin-preserve-shebang';
import dts from 'rollup-plugin-dts';

const rollupConfig = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.js',
        format: 'cjs',
        sourcemap: false,
      },
    ],
    plugins: [
      typescript({
        tsconfigDefaults: {
          include: ['src/**/*.ts'],
          exclude: ['node_modules', 'lib'],
          compilerOptions: {
            module: 'esnext',
            target: 'es2021',

            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,

            lib: ['es2021', 'dom'],
            forceConsistentCasingInFileNames: true,
            moduleResolution: 'node',

            sourceMap: false,
            baseUrl: './src',
            outDir: './lib',
          },
        },

        useTsconfigDeclarationDir: true,
      }),
      terser(),
      shebang(),
    ],
  },
];

export default rollupConfig;
