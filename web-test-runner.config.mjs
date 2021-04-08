import fs from 'fs';
import { playwrightLauncher } from '@web/test-runner-playwright';

const packages = ['form-integrations']

export default {
  nodeResolve: true,
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 90,
      branches: 65,
      functions: 80,
      lines: 90,
    },
  },
  testFramework: {
    config: {
      timeout: '3000',
    },
  },
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
  ],
  groups: packages.map(pkg => {
    return {
      name: pkg,
      files: `packages/${pkg}/test/dialog-integrations.test.js`,
    };
  }),
};
