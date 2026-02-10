import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
const appName = pkg.name;

const chunkRules: Array<{ include: string[]; name: string }> = [
  {
    include: [
      'node_modules/react/',
      'node_modules/react-dom/',
      'node_modules/lucide-react/',
      'node_modules/@tanstack/react-query/',
    ],
    name: 'react-vendor',
  },
];

const toNorm = (path: string) => path.split('\\').join('/');

const config = {
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      plugins: [
        visualizer({ filename: 'stats.html', gzipSize: true, open: false }),
      ],
      output: {
        entryFileNames: `assets/${appName}-[name]-[hash].js`,
        chunkFileNames: `assets/${appName}-[name]-[hash].js`,
        assetFileNames: `assets/${appName}-[name]-[hash][extname]`,
        manualChunks(id: string) {
          const norm = toNorm(id);
          for (const rule of chunkRules) {
            if (rule.include.some((p) => norm.includes(p))) return rule.name;
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/_tests_/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/_tests_/**',
        'src/test/**',
        'src/vite-env.d.ts',
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
  resolve: {
    alias: {
      $components: fileURLToPath(new URL('./src/components', import.meta.url)),
      $api: fileURLToPath(new URL('./src/api', import.meta.url)),
      $constants: fileURLToPath(new URL('./src/constants', import.meta.url)),
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
      $hooks: fileURLToPath(new URL('./src/hooks', import.meta.url)),
      $pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      $schemas: fileURLToPath(new URL('./src/schemas', import.meta.url)),
      $services: fileURLToPath(new URL('./src/services', import.meta.url)),
      $store: fileURLToPath(new URL('./src/store', import.meta.url)),
      $types: fileURLToPath(new URL('./src/types', import.meta.url)),
      $utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
};

export default defineConfig(config as Parameters<typeof defineConfig>[0]);
