/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { msw } from 'msw/vite';
import { defineConfig } from 'vite';

// Build, dev server and test runner share this one config (guideline 11).
export default defineConfig({
  plugins: [
    react(),
    // Mock mode: serves MSW's worker script (/mockServiceWorker.js) from node_modules on the dev server, so
    // it is never committed and always matches the installed msw version. Dev server only.
    { ...msw({ mode: 'worker-only' }), apply: 'serve' },
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    // Real-backend mode: /api is forwarded to the local Spring Boot app, so the session cookie is same-origin.
    proxy: { '/api': 'http://localhost:8080' },
  },
  build: {
    rolldownOptions: {
      output: {
        // Libraries in their own chunks: they change rarely, so browsers keep them cached across deploys.
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
              priority: 3,
            },
            {
              name: 'antd',
              test: /node_modules[\\/](antd|@ant-design|@rc-component|rc-[^\\/]+)[\\/]/,
              priority: 2,
            },
            { name: 'vendor', test: /node_modules/, priority: 1 },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
