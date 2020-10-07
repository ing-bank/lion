/* eslint-disable no-param-reassign */
// // import { legacyPlugin } from '@web/dev-server-legacy';
import { playwrightLauncher } from '@web/test-runner-playwright';
import defaultConfig from './web-test-runner.config.mjs';

const config = { ...defaultConfig };
config.browsers = [playwrightLauncher({ product: 'firefox' })];

export default config;
