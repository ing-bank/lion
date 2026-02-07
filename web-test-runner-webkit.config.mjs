/*
 * Run tests on Webkit browser only
 */

import defaultConfig from './web-test-runner.config.mjs';
import webkitTestsOnlyConfig from './web-test-runner-webkit-only-tests.config.mjs';

const config = { ...defaultConfig };
config.browsers = webkitTestsOnlyConfig.browsers;
config.groups.push(...webkitTestsOnlyConfig.groups);
export default config;
