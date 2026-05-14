import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import type { Plugin } from 'vite';

function chatbotProxy(): Plugin {
  return {
    name: 'chatbot-proxy',
    configureServer(server) {
      server.middlewares.use('/chatbot-proxy.js', async (_req, res) => {
        try {
          const r = await fetch('http://localhost:8080/chatbot.js');
          const text = await r.text();
          res.setHeader('Content-Type', 'application/javascript');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          res.end(text);
        } catch {
          res.statusCode = 502;
          res.end('/* chatbot server not reachable */');
        }
      });
    },
  };
}

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react(), tailwindcss(), chatbotProxy()],
  resolve: {
    alias: {
      '@schema': path.resolve(__dirname, '../schema'),
    },
  },
  server: {
    port: 5173,
    headers: {
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});
