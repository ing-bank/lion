/*
 * Run tests on Firefox browser only
 */

import defaultConfig from './web-test-runner.config.mjs';
import firefoxTestsOnlyConfig from './web-test-runner-firefox-only-tests.config.mjs';

const config = { ...defaultConfig };
config.browsers = firefoxTestsOnlyConfig.browsers;
config.groups.push(...firefoxTestsOnlyConfig.groups);

export default config;
