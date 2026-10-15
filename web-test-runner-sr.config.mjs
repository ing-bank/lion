import { defaultReporter } from '@web/test-runner';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { screenreaderPlugin, screenreaderReporter } from '@lion/test-runner-screenreader';

const READERS = ['virtual', 'nvda', 'voiceover'];

function getScreenReader() {
  const reader = READERS.find(name => process.argv.includes(`--${name}`));
  if (!reader) {
    return 'virtual';
  }
  if (reader === 'virtual' && process.env.CI) {
    throw new Error(
      'Refusing --virtual under CI: the blocking screen reader runs are --nvda (windows) and --voiceover (macos).',
    );
  }
  return reader;
}

const screenReader = getScreenReader();
const isRealReader = screenReader !== 'virtual';

/**
 * A real screen reader reads the focused OS window, so those runs need a real
 * browser window (not headless) and wtr has to keep OS focus on that window.
 */
function createBrowserLauncher() {
  if (screenReader === 'voiceover') {
    return playwrightLauncher({
      product: 'webkit',
      launchOptions: { headless: false },
      __experimentalWindowFocus__: true,
    });
  }
  return playwrightLauncher({
    product: 'chromium',
    launchOptions: { headless: !isRealReader },
    __experimentalWindowFocus__: isRealReader,
  });
}

const groups = [{ name: 'sr', files: 'packages/ui/components/**/test/*.sr.test.mjs' }];

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
  nodeResolve: true,
  testFramework: {
    // a real reader needs time to start and to speak
    config: { timeout: '30000' },
  },
  testRunnerHtml: process.argv.includes('--no-scoped-registries-polyfill')
    ? undefined
    : testRunnerHtmlWithPolyfill,
  browsers: [createBrowserLauncher()],
  groups: process.argv.includes('--files') ? undefined : groups,
  reporters: [
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
    screenreaderReporter(),
  ],
  plugins: [screenreaderPlugin({ screenReader })],
  filterBrowserLogs: log => log.type === 'error',
};
