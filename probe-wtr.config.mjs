import { playwrightLauncher } from '@web/test-runner-playwright';
import defaultConfig from './web-test-runner.config.mjs';

export default {
  ...defaultConfig,
  groups: undefined,
  files: ['packages/ui/components/form-core/test/form-group/Probe*.test.js'],
  browsers: [playwrightLauncher({ product: 'chromium' })],
  coverageConfig: undefined,
  filterBrowserLogs: () => true,
};
