import { playwrightLauncher } from '@web/test-runner-playwright';
import defaultConfig from './web-test-runner.config.mjs';
import { globby } from 'globby';

const config = { ...defaultConfig };
config.browsers = [playwrightLauncher({ product: 'chromium' })];
config.groups.push({
  name: 'Chrome only',
  files: 'packages/ui/components/**/*.test.chrome.js',
});

export default config;
