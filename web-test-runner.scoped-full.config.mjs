/**
 * POC config: the repo's own full chromium suite — every test group, the SSR plugin, the coverage
 * thresholds — but with the scoped custom element registry polyfill selected by `SCOPED_POLYFILL`
 * (see `web-test-runner.polyfills.mjs`) instead of always the 0.x polyfill from npm. The tests are
 * not modified or restricted in any way; only `browsers` and `testRunnerHtml` are overridden.
 *
 *   SCOPED_POLYFILL=v1 node node_modules/@web/test-runner/dist/bin.js \
 *     --config web-test-runner.scoped-full.config.mjs
 *   SCOPED_POLYFILL=none node node_modules/@web/test-runner/dist/bin.js \
 *     --config web-test-runner.scoped-full.config.mjs
 */
import defaultConfig from './web-test-runner.config.mjs';
import {
  resolveScopedPolyfillVariant,
  scopedPolyfillBrowsers,
  scopedPolyfillTestRunnerHtml,
} from './web-test-runner.polyfills.mjs';

const variant = resolveScopedPolyfillVariant();
const config = { ...defaultConfig };
config.browsers = scopedPolyfillBrowsers(variant);
config.testRunnerHtml = scopedPolyfillTestRunnerHtml(variant);

export default config;
