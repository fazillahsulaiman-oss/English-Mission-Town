import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-sales',
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4180' },
  webServer: [
    {
      command: 'npx vite build --config vite.sales.config.ts && npx vite preview --config vite.sales.config.ts --port 4180 --strictPort',
      url: 'http://localhost:4180',
      reuseExistingServer: true,
      timeout: 180_000,
    },
    {
      // A different origin that embeds the sales page in an iframe.
      command: 'npx http-server e2e-sales/embed-host -p 4181 -s',
      url: 'http://localhost:4181',
      reuseExistingServer: true,
    },
  ],
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }, testIgnore: /mobile\.spec\.ts/ },
    { name: 'phone', use: { ...devices['Pixel 7'] }, testMatch: /mobile\.spec\.ts/ },
  ],
});
