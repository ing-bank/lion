import { playwrightLauncher } from '@web/test-runner-playwright';
import { advancedPerfPlugin } from './src/index.js';

// Measurement config for the advanced-perf tracing specs (forced-layout / FCP). Run through
// @lion-tools/smart-baseline, which copies the spec into each worktree and runs this config.
// The plugin (the trace instrument) is loaded from this package, so the same config works from a
// baseline worktree that predates the plugin — the instrument only observes, it does not alter
// the measured code.

export default {
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [advancedPerfPlugin()],
  testFramework: {
    config: {
      timeout: 15000,
    },
  },
};
