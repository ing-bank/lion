import { playwrightLauncher } from '@web/test-runner-playwright';

// Minimal, metric-agnostic config: just Chromium + nodeResolve + the default mocha framework.
// What is actually measured is entirely up to the spec and config the caller supplies to
// compare-measures.mjs (e.g. the tracing config shipped by @lion-labs/test-runner-advanced-perf).
export default {
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: 'chromium' })],
  testFramework: {
    config: {
      timeout: 15000,
    },
  },
};
