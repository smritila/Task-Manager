import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
});
