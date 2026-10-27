import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  timeout: 90000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4186',
    headless: true,
    channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4186 --strictPort',
    url: 'http://127.0.0.1:4186',
    reuseExistingServer: false,
    timeout: 120000,
    env: { VITE_SUPABASE_URL: 'https://portfolio-qa.supabase.co', VITE_SUPABASE_ANON_KEY: 'local-test-public-key' },
  },
})
