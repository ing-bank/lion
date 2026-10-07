/**
 * POC test-runner config: runs the core scoped-elements tests against one of the available
 * flavours of scoped custom element registry support — see `web-test-runner.polyfills.mjs`
 * for `SCOPED_POLYFILL=v0|v1|none`.
 *
 * Usage:
 *   SCOPED_POLYFILL=v1 node node_modules/@web/test-runner/dist/bin.js \
 *     --config web-test-runner.scoped-spec.config.mjs \
 *     --files "packages/ui/components/core/test/*ScopedElements*.test.js"
 *
 * For the whole @lion/ui suite in the same modes, see `web-test-runner.scoped-full.config.mjs`.
 */
import { playwrightLauncher } from '@web/test-runner-playwright';
import { litSsrPlugin } from '@lit-labs/testing/web-test-runner-ssr-plugin.js';
import {
  resolveScopedPolyfillVariant,
  scopedPolyfillTestRunnerHtml,
} from './web-test-runner.polyfills.mjs';

const variant = resolveScopedPolyfillVariant();

export default {
  nodeResolve: true,
  testsFinishTimeout: 20000,
  testFramework: {
    config: { timeout: '5000' },
  },
  testRunnerHtml: scopedPolyfillTestRunnerHtml(variant),
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [litSsrPlugin()],
  groups: undefined,
};
