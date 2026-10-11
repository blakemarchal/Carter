// Automated playthroughs (docs/GAME-PLAN.md §8): a robot plays one visit of every island, a battle, the
// Pal Kitchen and a practice round of each learning exercise, at iPad size with touch, against the Vite
// dev server. Any console error or page error fails the test. Screenshots land in e2e-results/shots.
//
//   npm run e2e                  WebKit (Safari's engine, as on an iPad): the default, and what CI runs
//   npm run e2e:chromium         Chromium, where WebKit can't be installed (set CHROMIUM_PATH to pick one)
//   npm run e2e -- -g noah       just the tests whose title matches
//   E2E_TIMES=1 npm run e2e      also print how long each island step took
import { existsSync } from 'node:fs'
import { cpus } from 'node:os'
import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT ?? 5213)
const BASE = `http://localhost:${PORT}`

// An iPad Pro 11 in landscape, with touch. (Screenshots at 1x keep the artifact small.)
const ipad = { ...devices['iPad Pro 11 landscape'], deviceScaleFactor: 1 }

// A Chromium already on the machine (e.g. /opt/pw-browsers/chromium in the cloud container), when the
// one Playwright would download isn't there.
const chromiumPath = process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined)

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  outputDir: 'e2e-results/test-output',
  fullyParallel: true,
  // (One browser per core: the mini-games run in real time, so it's the waiting that's shared out.)
  workers: Number(process.env.E2E_WORKERS ?? Math.max(2, cpus().length)),
  retries: process.env.CI ? 1 : 0,
  timeout: 4 * 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { outputFolder: 'e2e-results/report', open: 'never' }]],
  use: {
    baseURL: BASE,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    { name: 'webkit', use: { ...ipad, browserName: 'webkit' } },
    {
      name: 'chromium',
      use: { ...ipad, browserName: 'chromium', launchOptions: chromiumPath ? { executablePath: chromiumPath } : {} },
    },
  ],
  webServer: {
    command: `npx vite --port ${PORT} --strictPort`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
