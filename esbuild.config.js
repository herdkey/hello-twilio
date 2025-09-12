import { TsconfigPathsPlugin } from '@esbuild-plugins/tsconfig-paths';
import { build } from 'esbuild';
import { globby } from 'globby';

const common = {
  platform: 'node',
  sourcemap: true,
  bundle: false,
  logLevel: 'info',
  target: 'node18',
  plugins: [TsconfigPathsPlugin({})],
};

const entryFns = await globby(['src/functions/**/*.{ts,tsx,js}']);
const entryLib = await globby(['src/lib/**/*.{ts,tsx,js}']);

await Promise.all([
  build({
    ...common,
    entryPoints: entryFns,
    outdir: 'dist/functions',
    format: 'cjs',
  }),
  build({
    ...common,
    entryPoints: entryLib,
    outdir: 'dist/assets',
    format: 'cjs',
  }),
]);
