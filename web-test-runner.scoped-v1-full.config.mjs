/**
 * POC config: the repo's full chromium test suite, but on the *redesigned* (spec 1.x)
 * scoped custom element registry polyfill, forced, instead of the 0.x polyfill from
 * npm. This is the "whole of @lion/ui runs on spec 1.x" proof.
 *
 *   node node_modules/@web/test-runner/dist/bin.js \
 *     --config web-test-runner.scoped-v1-full.config.mjs
 */
import { playwrightLauncher } from '@web/test-runner-playwright';
import defaultConfig from './web-test-runner.config.mjs';

const config = { ...defaultConfig };
config.browsers = [playwrightLauncher({ product: 'chromium' })];
config.testRunnerHtml = testRunnerImport => `
<html>
  <head>
    <script>window.CustomElementRegistryPolyfill = { force: true };</script>
    <script src="/packages/ui/components/core/test/scoped-registry-v1/scoped-custom-element-registry.min.js"></script>
    <script type="module" src="${testRunnerImport}"></script>
  </head>
</html>
`;

export default config;
