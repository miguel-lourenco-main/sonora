import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
    banner: {},
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
]);
