import { playwrightLauncher } from '@web/test-runner-playwright';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import defaultConfig from './web-test-runner.config.mjs';

const isVisualDiff = process.argv.includes('--visual-diff');
const updateBaseline = process.argv.includes('--update-visual-baseline');

const config = { ...defaultConfig };
config.browsers = [playwrightLauncher({ product: 'chromium' })];

// Add visual regression plugin when --visual-diff flag is provided
if (isVisualDiff) {
  config.plugins = [
    ...(defaultConfig.plugins || []),
    visualRegressionPlugin({
      update: updateBaseline,
      baseDir: 'screenshots/baseline',
      diffDir: 'screenshots/.diff',
      failedDir: 'screenshots/.failed',
    }),
  ];
}

export default config;
