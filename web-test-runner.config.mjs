import fs from 'fs';
import { playwrightLauncher } from '@web/test-runner-playwright';

const devMode = process.argv.includes('--dev-mode');

const packages = fs
  .readdirSync('packages')
  .filter(
    dir => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test`),
  )
  .filter(dir => dir === 'ui')
  .map(dir => ({ name: dir, path: `packages/${dir}/test` }))
  .concat(
    fs
      .readdirSync('packages/ui/components')
      .filter(
        dir =>
          fs.statSync(`packages/ui/components/${dir}`).isDirectory() &&
          fs.existsSync(`packages/ui/components/${dir}/test`),
      )
      .filter(dir => dir === 'core')
      .map(dir => ({ name: dir, path: `packages/ui/components/${dir}/test` })),
  );

/**
 * @type {import('@web/test-runner').TestRunnerConfig['testRunnerHtml']}
 *
 */
const testRunnerHtml = testRunnerImport =>
  `
<html>
  <head>
    <script type="module" src="${testRunnerImport}"></script>
  </head>
</html>
`;

export default {
  nodeResolve: { exportConditions: [devMode && 'development'] },
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 95,
      functions: 95,
      branches: 95,
      lines: 95,
    },
  },
  testFramework: {
    config: {
      timeout: '5000',
    },
  },
  testRunnerHtml,
  browserLogs: true,
  browsers: [
    playwrightLauncher({ product: 'firefox', concurrency: 1 }),
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  groups: packages.map(pkg => ({
    name: pkg.name,
    files: `${pkg.path}/**/*.test.js`,
  })),
};
