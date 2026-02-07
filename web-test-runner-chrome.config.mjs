/*
 * Run tests on Chrome browser only
 */

import defaultConfig from './web-test-runner.config.mjs';
import chromeTestsOnlyConfig from './web-test-runner-chrome-only-tests.config.mjs';

const config = { ...defaultConfig };
config.browsers = chromeTestsOnlyConfig.browsers;
config.groups.push(...chromeTestsOnlyConfig.groups);

export default config;
