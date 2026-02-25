import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

const hostOrigin = process.env.VITE_HOST_ORIGIN ?? 'http://localhost:3000';
const isDevForHost = process.env.VITE_DEV_FOR_HOST === '1';
const isDocker = process.env.DOCKER_DEV === '1';
const hmrBase = isDocker && hostOrigin.includes('8080') ? '/remote-chat' : undefined;

const hostReactUrls = {
  react: `${hostOrigin}/api/host-react/react`,
  'react-dom': `${hostOrigin}/api/host-react/react-dom`,
  'react-dom/client': `${hostOrigin}/api/host-react/react-dom/client`,
  'react/jsx-runtime': `${hostOrigin}/api/host-react/react/jsx-runtime`,
  'react/jsx-dev-runtime': `${hostOrigin}/api/host-react/react/jsx-dev-runtime`,
};

export default defineConfig({
  
  plugins: [react(), tailwindcss()],
  root: '.',
  server: {
    port: 5174,
    host: true,
    cors: true,
    watch: isDocker ? { usePolling: true, interval: 300 } : undefined,
    hmr: hmrBase
        ? { host: 'localhost', port: 8080, path: hmrBase, clientPort: 8080 }
        : isDocker
          ? { host: 'localhost', port: 5174, clientPort: 5174 }
          : undefined,
  },
  optimizeDeps: isDevForHost
    ? {
        exclude: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
      }
    : undefined,
  esbuild: isDevForHost
    ? { jsx: 'automatic', jsxImportSource: 'react' }
    : undefined,
  resolve: {
    alias: [
      ...(isDevForHost
        ? [
            { find: 'react-dom/client', replacement: hostReactUrls['react-dom/client'] },
            { find: 'react/jsx-dev-runtime', replacement: hostReactUrls['react/jsx-dev-runtime'] },
            { find: 'react/jsx-runtime', replacement: hostReactUrls['react/jsx-runtime'] },
            { find: 'react-dom', replacement: hostReactUrls['react-dom'] },
            { find: 'react', replacement: hostReactUrls.react },
          ]
        : []),
      { find: '$shared', replacement: fileURLToPath(new URL('./src/shared', import.meta.url)) },
      { find: '$entities', replacement: fileURLToPath(new URL('./src/entities', import.meta.url)) },
      { find: '$features', replacement: fileURLToPath(new URL('./src/features', import.meta.url)) },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});