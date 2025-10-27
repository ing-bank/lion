import { litSsrPlugin } from '@lit-labs/testing/web-test-runner-ssr-plugin.js';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { globby } from 'globby';

const config = {
  shouldLoadPolyfill: !process.argv.includes('--no-scoped-registries-polyfill'),
  shouldRunDevMode: process.argv.includes('--dev-mode'),
};

const groups = (
  await globby(['packages/*/test', 'packages/ui/components/**/test'], {
    onlyDirectories: true,
  })
) // @ts-expect-error [update-es-version-later]
  .map(dir => ({ name: dir.split('/').at(-2), files: `${dir}/**/*.test.js` })); // .filter(({name}) => name === 'overlays');

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

export default {
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
  testsFinishTimeout: 240000,
  browsers: [
    playwrightLauncher({ product: 'firefox', concurrency: 1 }),
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  groups,
  filterBrowserLogs(/** @type {{ type: 'error'|'warn'|'debug'; args: string[] }} */ log) {
    return log.type === 'error' || log.type === 'debug';
  },
  plugins: [litSsrPlugin()],
};
