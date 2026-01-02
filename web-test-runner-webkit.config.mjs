import { playwrightLauncher } from '@web/test-runner-playwright';
import defaultConfig from './web-test-runner.config.mjs';

const config = { ...defaultConfig };
config.browsers = [playwrightLauncher({ product: 'webkit' })];
config.groups.push({
  name: 'Webkit only',
  files: 'packages/ui/components/**/*.test.webkit.js',
});
export default config;
