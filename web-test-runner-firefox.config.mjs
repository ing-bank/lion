import { playwrightLauncher } from '@web/test-runner-playwright';
import defaultConfig from './web-test-runner.config.mjs';

const config = { ...defaultConfig };
config.browsers = [playwrightLauncher({ product: 'firefox', concurrency: 1 })];
config.groups.push({
  name: 'Firefox only',
  files: 'packages/ui/components/**/*.test.firefox.js',
});

export default config;
