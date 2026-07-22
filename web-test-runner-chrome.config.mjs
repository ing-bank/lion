import { playwrightLauncher } from '@web/test-runner-playwright';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import defaultConfig from './web-test-runner.config.mjs';

const isVisualDiff = process.argv.includes('--visual-diff');
const updateBaseline = process.argv.includes('--update-visual-baseline');

const config = { ...defaultConfig };
config.browsers = [playwrightLauncher({ product: 'chromium' })];

/**
 * Extract component name from test file path
 * Handles both Unix and Windows paths
 * e.g., packages/ui/components/button/test/lion-button.test.js -> button
 *       packages/ui/components/lion-accordion/test/lion-accordion.test.js -> lion-accordion
 */
function getComponentName(testFile) {
  // Normalize backslashes to forward slashes for consistent regex matching
  const normalizedPath = testFile.replace(/\\/g, '/');

  // Try: components/{name}/test/
  let match = normalizedPath.match(/components\/([^\/]+)\/test\//);
  if (match) return match[1];

  // Try: components/lion-{name}/test/
  match = normalizedPath.match(/components\/(lion-[^\/]+)\/test\//);
  if (match) return match[1];

  // Fallback: use the test file name
  match = normalizedPath.match(/\/([^\/]+)\.test\./);
  return match ? match[1] : 'unknown';
}

/**
 * Custom naming for baseline images organized by component
 */
function getBaselineName({ browser, name, testFile }) {
  const componentName = getComponentName(testFile);
  return `${componentName}/${name}.png`;
}

function getDiffName({ browser, name, testFile }) {
  const componentName = getComponentName(testFile);
  return `${componentName}/${name}.png`;
}

function getFailedName({ browser, name, testFile }) {
  const componentName = getComponentName(testFile);
  return `${componentName}/${name}.png`;
}

// Add visual regression plugin when --visual-diff flag is provided
if (isVisualDiff) {
  config.plugins = [
    ...(defaultConfig.plugins || []),
    visualRegressionPlugin({
      update: updateBaseline,
      baseDir: 'screenshots/baseline',
      diffDir: 'screenshots/.diff',
      failedDir: 'screenshots/.failed',
      getBaselineName,
      getDiffName,
      getFailedName,
    }),
  ];
}

export default config;
