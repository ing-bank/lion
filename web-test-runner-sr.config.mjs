import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
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
 * A real screen reader can start and then stop answering on a machine where it
 * is not installed or configured properly (reported as "NVDA is not running" or
 * "VoiceOver not running" somewhere in a test). Say so before the test run,
 * with the reader's own answer once a second, instead of letting it surface as a
 * timeout in the middle of a test. Never fails the run: the tests are the gate.
 */
function reportReaderHealth() {
  if (!isRealReader) {
    return;
  }
  const script = fileURLToPath(
    new URL(
      'packages-node/test-runner-screenreader/scripts/screenreader-smoke.mjs',
      import.meta.url,
    ),
  );
  console.log(`\n[preflight] ${screenReader} on this machine:`);
  try {
    execFileSync(process.execPath, [script, screenReader, '10'], { stdio: 'inherit' });
  } catch {
    console.log(`[preflight] ${screenReader} did not stay reachable (see above)`);
  }
}

reportReaderHealth();

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
    // A real reader needs time to start and to speak: VoiceOver speaks slower than the
    // commands that cause it, and a test that commits a value anchors itself three times.
    config: { timeout: isRealReader ? '90000' : '30000' },
  },
  testRunnerHtml: process.argv.includes('--no-scoped-registries-polyfill')
    ? undefined
    : testRunnerHtmlWithPolyfill,
  browsers: [createBrowserLauncher()],
  // VoiceOver speaks slower than the commands that cause it; without this a slow real reader
  // run is reported as "browser tests did not finish" instead of per test.
  testsFinishTimeout: isRealReader ? 300000 : 120000,
  groups: process.argv.includes('--files') ? undefined : groups,
  reporters: [
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
    screenreaderReporter(),
  ],
  plugins: [screenreaderPlugin({ screenReader })],
  filterBrowserLogs: log => log.type === 'error',
};
