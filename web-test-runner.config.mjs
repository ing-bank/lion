import { litSsrPlugin } from '@lit-labs/testing/web-test-runner-ssr-plugin.js';
// @ts-expect-error
import { playwrightLauncher } from '@web/test-runner-playwright';

import { getTestGroups } from './web-test-runner.utils.mjs';

const config = {
  shouldLoadPolyfill: !process.argv.includes('--no-scoped-registries-polyfill'),
  shouldRunDevMode: process.argv.includes('--dev-mode'),
};

const groups = await getTestGroups();
// Exit early with success if no browser test groups are found
if (!groups.length) {
  console.log('No browser test groups found. Skipping browser tests.');
  process.exit(0);
}

/**
 * @type {import('@web/test-runner').TestRunnerConfig['testRunnerHtml']}
 */
const testRunnerHtmlWithPolyfill = testRunnerImport =>
  `
<html>
  <head>
    <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
    <script type="module" src="${testRunnerImport}"></script>
  </head>
</html>
`;

/**
 * @type {import('@web/test-runner').TestRunnerConfig}
 */
const testRunnerConfig = {
  nodeResolve: config.shouldRunDevMode ? { exportConditions: ['development'] } : true,
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: { statements: 95, functions: 95, branches: 95, lines: 95 },
  },
  testFramework: {
    config: { timeout: '5000' },
  },
  testRunnerHtml: config.shouldLoadPolyfill ? testRunnerHtmlWithPolyfill : undefined,
  browsers: [
    playwrightLauncher({ product: 'firefox', concurrency: 1 }),
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  groups,
  /**
   * Filters browser logs for the test runner.
   * @param {{ type: string; args: any[] }} log
   * @returns {boolean}
   */
  filterBrowserLogs(log) {
    return log.type === 'error' || log.type === 'debug';
  },
  /** @type {import('@web/test-runner').TestRunnerPlugin[]} */
  plugins: [litSsrPlugin()],
};

export default testRunnerConfig;
