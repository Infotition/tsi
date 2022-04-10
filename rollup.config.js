import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import shebang from 'rollup-plugin-preserve-shebang';

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
    plugins: [typescript({ tsconfig: 'tsconfig.json' }), terser(), shebang()],
  },
];

export default rollupConfig;
