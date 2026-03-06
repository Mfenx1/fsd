import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';
import { fileURLToPath, URL } from 'node:url';

const OUT_DIR = 'dist-remote';
const ESM_NAME = 'chat.js';

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
const REMOTE_VERSION = pkg.version ?? '0.0.0';


export default defineConfig({
  define: {
    __REMOTE_VERSION__: JSON.stringify(REMOTE_VERSION),
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  resolve: {
    alias: [
      { find: '$shared', replacement: fileURLToPath(new URL('./src/shared', import.meta.url)) },
      { find: '$entities', replacement: fileURLToPath(new URL('./src/entities', import.meta.url)) },
      { find: '$features', replacement: fileURLToPath(new URL('./src/features', import.meta.url)) },
    ],
  },
  plugins: [
    react(),
    {
      name: 'remote-manifest-sri',
      closeBundle() {
        const outPath = join(process.cwd(), OUT_DIR, ESM_NAME);
        try {
          const buf = readFileSync(outPath);
          const hash = createHash('sha384').update(buf).digest('base64');
          const integrity = `sha384-${hash}`;
          const manifest = {
            name: 'chat',
            label: 'Chat',
            script: ESM_NAME,
            integrity,
            version: REMOTE_VERSION,
          };
          writeFileSync(
            join(process.cwd(), OUT_DIR, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
          );
        } catch (e) {
          console.warn('remote-manifest-sri: could not generate manifest', e);
        }
      },
    },
    {
      name: 'html-preview',
      closeBundle() {
        const templatePath = join(fileURLToPath(new URL('.', import.meta.url)), 'remote-preview.template.html');
        const html = readFileSync(templatePath, 'utf-8').replaceAll('__SCRIPT_NAME__', ESM_NAME);
        writeFileSync(join(process.cwd(), OUT_DIR, 'index.html'), html);
      },
    },
  ],
  build: {
    lib: {
      entry: 'src/remote.tsx',
      name: 'ChatRemote',
      fileName: 'chat',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        '@tanstack/react-query',
      ],
    },
    outDir: 'dist-remote',
    emptyOutDir: true,
  },
});