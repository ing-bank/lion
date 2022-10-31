import fs from 'fs';
import { playwrightLauncher } from '@web/test-runner-playwright';

const packages = fs
  .readdirSync('packages')
  .filter(
    dir => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test`),
  )
  .map(dir => ({ name: dir, path: `packages/${dir}/test` }))
  .concat(
    fs
      .readdirSync('packages/ui/src')
      .filter(
        dir =>
          fs.statSync(`packages/ui/src/${dir}`).isDirectory() &&
          fs.existsSync(`packages/ui/src/${dir}/test`),
      )
      .map(dir => ({ name: dir, path: `packages/ui/src/${dir}/test` })),
  );
// .filter(x => x.endsWith('-dropdown'))
// .concat(
//   fs
//     .readdirSync('packages/helpers')
//     .filter(
//       dir =>
//         fs.statSync(`packages/helpers/${dir}`).isDirectory() &&
//         fs.existsSync(`packages/helpers/${dir}/test`),
//     )
//     .map(dir => `helpers/${dir}`),
// );

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
  groups: packages.map(pkg => ({
    name: pkg.name,
    files: `${pkg.path}/**/*.test.js`,
  })),
};
