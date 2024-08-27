import fs from 'fs';
import { playwrightLauncher } from '@web/test-runner-playwright';

const devMode = process.argv.includes('--dev-mode');

const packages = fs
  .readdirSync('packages')
  .filter(
    dir => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test`),
  )
  .map(dir => ({ name: dir, path: `packages/${dir}/test` }))
  .concat(
    fs
      .readdirSync('packages/ui/components')
      .filter(
        dir =>
          fs.statSync(`packages/ui/components/${dir}`).isDirectory() &&
          fs.existsSync(`packages/ui/components/${dir}/test`),
      )
      .map(dir => ({ name: dir, path: `packages/ui/components/${dir}/test` }))

      // just run button tests so it runs faster
      .filter(p => p.name === 'button'),
  );

/**
 * @type {import('@web/test-runner').TestRunnerConfig['testRunnerHtml']}
 *
 */
const testRunnerHtml = testRunnerImport =>
  `
<html>
  <head>
    <!-- This line below is where the problem is coming from. This alters behavior -->
    <!-- And I believe its dangerous, because it gives us false positives. -->
    <!-- Not everybody is importing this module in their app -->
    <!-- Only tests that need it, should import it individually -->
    <!-- <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script> -->

    <script type="module" src="${testRunnerImport}"></script>
  </head>
</html>
`;

export default {
  nodeResolve: { exportConditions: [devMode && 'development'] },
  browserLogs: true,
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
  browsers: [
    playwrightLauncher({ product: 'firefox', concurrency: 1 }),
    playwrightLauncher({ product: 'chromium' }),

    // ignore this, didn't work for me locally
    // playwrightLauncher({ product: 'webkit' }),
  ],
  groups: packages.map(pkg => ({
    name: pkg.name,
    files: `${pkg.path}/**/*.test.js`,
  })),
};
