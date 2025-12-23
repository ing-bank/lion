import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['components/**/test/**/*.test.js'],
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true,
      screenshotFailures: false,
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: '../../coverage',
      thresholds: { statements: 95, functions: 95, branches: 95, lines: 95 },
      include: ['components/**/src/**/*.js', 'exports/**/*.js'],
      exclude: [
        '**/test/**',
        '**/test-suites/**',
        '**/node_modules/**',
        '**/*.config.js',
        '**/dist-types/**',
        '**/scripts/**',
        '**/translations/**',
      ],
    },
    testTimeout: 5000,
    hookTimeout: 10000,
    setupFiles: ['./vitest.setup.js'],
  },
  resolve: { conditions: ['development', 'browser', 'default'] },
});
