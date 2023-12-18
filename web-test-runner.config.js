// web-test-runner.config.js
import { litSsrPlugin } from '@lit-labs/testing/web-test-runner-ssr-plugin.js';
import { a11ySnapshotPlugin } from '@web/test-runner-commands/plugins';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';

export default {
  nodeResolve: {
    exportConditions: ['development'],
  },
  plugins: [
    a11ySnapshotPlugin(),
    litSsrPlugin(),
    visualRegressionPlugin({
      update: process.argv.includes('--update-visual-baseline'),
    }),
  ],
};
