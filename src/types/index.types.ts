/** Specifies the options for the build cli command. */
export type BuildOpts = {
  /** The path of the entry file (src/index.ts). */
  entry: string;
  /** The format of the output (esm). */
  format: 'cjs' | 'esm';
  /** The target environment of the output (prod). */
  env: 'dev' | 'prod';
  /** Whether source maps should get generated or not (false). */
  maps: boolean;
};