export type BuildOpts = {
  target: 'node' | 'browser';
  tsconfig?: string;
  entry: string;
  format: 'cjs' | 'esm';
  transpileOnly: boolean;
  env: 'dev' | 'prod';
  maps: boolean;
};
