/**
 * POC test-runner config: runs the core scoped-elements tests against one of the
 * available flavours of scoped custom element registry support.
 *
 *   SCOPED_POLYFILL=v0      the polyfill that is on npm today
 *                           (@webcomponents/scoped-custom-element-registry@0.0.10, spec 0.x)
 *   SCOPED_POLYFILL=v1      the redesigned polyfill (webcomponents/polyfills#668, spec 1.x),
 *                           forced so it is exercised even where the browser has native support
 *   SCOPED_POLYFILL=none    no polyfill at all: native support if the browser has it,
 *                           otherwise the global-registry fallback
 *
 * Usage:
 *   SCOPED_POLYFILL=v1 node node_modules/@web/test-runner/dist/bin.js \
 *     --config web-test-runner.scoped-spec.config.mjs \
 *     --files "packages/ui/components/core/test/*ScopedElements*.test.js"
 */
import { playwrightLauncher } from '@web/test-runner-playwright';
import { litSsrPlugin } from '@lit-labs/testing/web-test-runner-ssr-plugin.js';

const variant = process.env.SCOPED_POLYFILL ?? 'v1';

const POLYFILL_SCRIPTS = {
  none: '',
  v0: '<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>',
  v1: [
    // Force the polyfill, so the spec 1.x code path is exercised in a browser that
    // may already have native support.
    '<script>window.CustomElementRegistryPolyfill = { force: true };</script>',
    '<script src="/packages/ui/components/core/test/scoped-registry-v1/scoped-custom-element-registry.min.js"></script>',
  ].join('\n    '),
};

if (!(variant in POLYFILL_SCRIPTS)) {
  throw new Error(
    `Unknown SCOPED_POLYFILL "${variant}" (expected one of ${Object.keys(POLYFILL_SCRIPTS).join(', ')})`,
  );
}

/**
 * @type {(testRunnerImport: string) => string}
 */
const testRunnerHtml = testRunnerImport => `
<html>
  <head>
    ${POLYFILL_SCRIPTS[/** @type {keyof typeof POLYFILL_SCRIPTS} */ (variant)]}
    <script type="module" src="${testRunnerImport}"></script>
  </head>
</html>
`;

export default {
  nodeResolve: true,
  testsFinishTimeout: 20000,
  testFramework: {
    config: { timeout: '5000' },
  },
  testRunnerHtml,
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [litSsrPlugin()],
  groups: undefined,
};
