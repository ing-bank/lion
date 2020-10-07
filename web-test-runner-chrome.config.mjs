/* eslint-disable no-param-reassign */
import { playwrightLauncher } from '@web/test-runner-playwright';
import defaultConfig from './web-test-runner.config.mjs';

const config = { ...defaultConfig };
config.browsers = [playwrightLauncher({ product: 'chromium' })];

export default config;
