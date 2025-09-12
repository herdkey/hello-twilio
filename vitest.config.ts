import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    // use DEBUG=vite-tsconfig-paths to debug
    tsconfigPaths(),
  ],
  test: {
    // prettier-ignore
    include: [
      'tests/**/*.test.{js,ts}',
      'src/**/*.test.{js,ts}',    // not used, but conventional
    ],
  },
});
