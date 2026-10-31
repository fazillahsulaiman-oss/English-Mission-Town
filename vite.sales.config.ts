// Build config for the sales page (sales/). Output: dist-sales/ (static, relative paths, works in a sub-folder).
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: resolve(__dirname, 'sales'),
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: resolve(__dirname, 'dist-sales'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'sales/index.html'),
        owner: resolve(__dirname, 'sales/owner.html'),
      },
    },
  },
  server: { port: 5180 },
  preview: { port: 4180 },
});
