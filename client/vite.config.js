import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // All API calls (including /api/java/* booking calls) go to the Node server,
      // which forwards /api/java/* to the Spring Boot service. Same path as in production.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});