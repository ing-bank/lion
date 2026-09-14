import { litSsrPlugin } from '@lit-labs/testing/web-test-runner-ssr-plugin.js';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { advancedPerfPlugin } from './packages-node/web-test-runner-advanced-perf/src/index.js';

export default {
  browsers: [playwrightLauncher({ product: 'chromium' })],
  nodeResolve: true,
  groups: [
    {
      name: 'statistical-benchmarks',
      files: 'packages/ui/components/**/test/**/*.statistical-bench.js',
    },
  ],
  plugins: [litSsrPlugin(), advancedPerfPlugin({ report: true, statisticalBench: true })],
  testFramework: {
    config: { timeout: '5000' },
  },
  testRunnerHtml: testRunnerImport => `
<html>
  <head>
    <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
    <script type="module" src="${testRunnerImport}"></script>
  </head>
</html>
`,
};
