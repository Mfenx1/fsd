import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

type TsConfigPaths = Record<string, string[]>;
type TsConfig = { compilerOptions?: { paths?: TsConfigPaths } };

const root = dirname(fileURLToPath(import.meta.url));
const tsconfig = JSON.parse(readFileSync(join(root, 'tsconfig.json'), 'utf-8')) as TsConfig;
const paths: TsConfigPaths = tsconfig.compilerOptions?.paths ?? {};

const alias = Object.fromEntries(
  Object.entries(paths)
    .filter(([key, values]) => !key.endsWith('/*') && values[0])
    .map(([key, values]) => [key, join(root, values[0]!)])
);

export default mergeConfig(
  defineConfig({ plugins: [react(), tailwindcss()], resolve: { alias } }),
  defineVitestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/_tests_/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/_tests_/**',
          'src/**/*.d.ts',
          'src/**/index.ts',
        ],
        thresholds: {
          lines: 15,
          functions: 15,
          branches: 10,
          statements: 15,
        },
      },
    },
  })
);
