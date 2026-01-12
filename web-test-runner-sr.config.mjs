import { playwrightLauncher } from '@web/test-runner-playwright';
import { screenreaderPlugin } from '@lion-labs/test-runner-screenreader';

function getScreenReaderArg() {
  if (process.argv.includes('--nvda')) {
    return 'nvda';
  }
  if (process.argv.includes('--voiceover')) {
    return 'voiceover';
  }
  return 'virtual';
}

/**
 * @param {'voiceover'|'nvda'|'virtual'} screenReader
 */
function getBrowsersConfig(screenReader) {
  if (screenReader === 'voiceover') {
    console.debug('Using WebKit for VoiceOver tests');
    return [playwrightLauncher({ product: 'webkit' })];
  }
  if (screenReader === 'nvda') {
    return [
      playwrightLauncher({ product: 'chromium' }),
      // https://webaim.org/projects/screenreadersurvey10/
      // playwrightLauncher({ product: 'firefox', concurrency: 1 }),
    ];
  }
  return [playwrightLauncher({ product: 'chromium' })];
}

const config = {
  shouldLoadPolyfill: !process.argv.includes('--no-scoped-registries-polyfill'),
  shouldRunDevMode: process.argv.includes('--dev-mode'),
  screenReader: getScreenReaderArg(),
};

const groups = [{ name: 'pup/poc', files: 'guidepup-poc-dialog/*guidepup-wtr.test.mjs' }];

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
    // wait max 30s for screen reader startup
    config: { timeout: '30000' },
  },
  testRunnerHtml: config.shouldLoadPolyfill ? testRunnerHtmlWithPolyfill : undefined,
  browsers: getBrowsersConfig(config.screenReader),
  groups,
  filterBrowserLogs(/** @type {{ type: 'error'|'warn'|'debug'; args: string[] }} */ log) {
    return log.type === 'error' || log.type === 'debug';
  },
  // TODO: find out how to get screenReader inside the plugin (based on session?)
  // we will need this when tests are run from main wtr config with multiple browsers
  // screenReader should be set to 'auto' (when in ci) and 'virtual' (when local)
  plugins: [screenreaderPlugin({ screenReader: config.screenReader })],
};
