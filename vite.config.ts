/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative asset paths so the game works from any sub-folder, e.g. GitHub Pages /English-Mission-Town/.
  base: './',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
