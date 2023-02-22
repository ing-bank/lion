import fs from 'fs';
import { playwrightLauncher } from '@web/test-runner-playwright';

const packages = fs
  .readdirSync('packages')
  .filter(
    dir => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test`),
  )
  .concat(
    fs
      .readdirSync('packages/helpers')
      .filter(
        dir =>
          fs.statSync(`packages/helpers/${dir}`).isDirectory() &&
          fs.existsSync(`packages/helpers/${dir}/test`),
      )
      .map(dir => `helpers/${dir}`),
  );

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
      timeout: '5000',
    },
  },
  browsers: [
    playwrightLauncher({ product: 'firefox', concurrency: 1 }),
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  groups: packages.map(pkg => {
    return {
      name: pkg,
      files: `packages/${pkg}/test/**/*.test.js`,
    };
  }),
};
