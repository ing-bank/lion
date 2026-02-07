/*
 * Tests that are specific to Webkit browser only
 */

import { playwrightLauncher } from '@web/test-runner-playwright';
import defaultConfig from './web-test-runner.config.mjs';

const config = { ...defaultConfig };
config.browsers = [playwrightLauncher({ product: 'webkit' })];
config.groups = [
  {
    name: 'Webkit only',
    files: 'packages/ui/components/**/*.test.webkit.js',
  },
];
export default config;
