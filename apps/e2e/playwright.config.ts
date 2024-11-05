import { defineConfig, devices } from '@playwright/test';

const enableBillingTests = process.env.ENABLE_BILLING_TESTS === 'true';

const testIgnore: string[] = [];

if (!enableBillingTests) {
  console.log(
    `Billing tests are disabled. To enable them, set the environment variable ENABLE_BILLING_TESTS=true.`,
    `Current value: "${process.env.ENABLE_BILLING_TESTS}"`
  );

  testIgnore.push('*-billing.spec.ts');
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const TEST_TIERS = {
  fast: {
    testTimeout: 120 * 1000,      // 2 minutes
    expectTimeout: 5 * 1000,      // 5 seconds
    retries: {
      local: 1,
      CI: 2
    },
    workers: {
      local: undefined,           // Use all available
      CI: 2                       // Limited parallelization
    }
  },
  default: {
    testTimeout: 180 * 1000,      // 3 minutes (current)
    expectTimeout: 10 * 1000,     // 10 seconds (current)
    retries: {
      local: 1,
      CI: 3
    },
    workers: {
      local: undefined,
      CI: 1
    }
  },
  slow: {
    testTimeout: 300 * 1000,      // 5 minutes
    expectTimeout: 20 * 1000,     // 20 seconds
    retries: {
      local: 2,
      CI: 4
    },
    workers: {
      local: 3,                   // Limit even locally
      CI: 1
    }
  }
};

const tier = process.env.TEST_TIER || 'default';
const config = TEST_TIERS[tier as keyof typeof TEST_TIERS] ?? TEST_TIERS.default;

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? config.retries.CI : config.retries.local,
  /* Limit parallel tests on CI. */
  workers: process.env.CI ? config.workers.CI : config.workers.local,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Ignore billing tests if the environment variable is not set. */
  testIgnore,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    // take a screenshot when a test fails
    screenshot: 'only-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  timeout: config.testTimeout,
  expect: {
    timeout: config.expectTimeout,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
     {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
     },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.PLAYWRIGHT_SERVER_COMMAND
    ? {
        cwd: '../../',
        command: process.env.PLAYWRIGHT_SERVER_COMMAND,
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
      }
    : undefined,
});
