import fs from 'fs';
import { playwrightLauncher } from '@web/test-runner-playwright';

const devMode = process.argv.includes('--dev-mode');

const testGroups = fs
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
      .map(dir => ({ name: dir, path: `packages/ui/components/${dir}/test` })),
  )
  .map(pkg => ({
    name: pkg.name,
    files: `${pkg.path}/**/*.test.js`,
  }));

const testsThatMustRunWithScopedCustomElementRegistryPolyfill = testGroups.map(testGroup => {
  const files = [
    testGroup.files,
    `!${testGroup.files.replace('*.test.js', '*.no-polyfill.test.js')}`,
  ];
  return {
    name: testGroup.name,
    files,
    /**
     * @type {import('@web/test-runner').TestRunnerConfig['testRunnerHtml']}
     *
     */
    testRunnerHtml: testRunnerImport => `
<html>
  <head>
    <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
    <script type="module" src="${testRunnerImport}"></script>
  </head>
</html>
`,
  };
});

const testsThatMustRunWithoutPolyfill = testGroups.map(testGroup => {
  const files = [testGroup.files, `!${testGroup.files.replace('*.test.js', '*.polyfill.test.js')}`];

  return {
    name: testGroup.name,
    files,
    /**
     * @type {import('@web/test-runner').TestRunnerConfig['testRunnerHtml']}
     *
     */
    testRunnerHtml: testRunnerImport => `
<html>
  <head>
    <script type="module" src="${testRunnerImport}"></script>
  </head>
</html>
`,
  };
});

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
  browsers: [
    playwrightLauncher({ product: 'firefox', concurrency: 1 }),
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  groups: testsThatMustRunWithoutPolyfill.concat([
    ...testsThatMustRunWithScopedCustomElementRegistryPolyfill,
  ]),
};
