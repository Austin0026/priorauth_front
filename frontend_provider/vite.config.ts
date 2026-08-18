import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/provider': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/clinical': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/cases': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/intake': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/policies': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/demo': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/sync': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/agent': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
});
