import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ command }) => ({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/notascan-projeto/' : '/',
  plugins: command === 'serve' ? [basicSsl()] : [],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true, // Permite conexões através de túneis e proxies
  },
  preview: {
    host: true,
    port: 4173,
    https: false,
    allowedHosts: true, // Permite conexões através de túneis e proxies no preview
  },
  build: { target: 'es2020' },
}));
