/*
 * Tests that are specific to Chrome browser only
 */

import { playwrightLauncher } from '@web/test-runner-playwright';
import defaultConfig from './web-test-runner.config.mjs';

const config = { ...defaultConfig };
config.browsers = [playwrightLauncher({ product: 'chromium' })];
config.groups = [
  {
    name: 'Chrome only',
    files: 'packages/ui/components/**/*.test.chrome.js',
  },
];
export default config;
