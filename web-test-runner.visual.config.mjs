import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { globby } from 'globby';
import defaultConfig from './web-test-runner.config.mjs';
import { getWorkTreeRelativePath } from './scripts/screenshots-comparison/util.mjs';

const shouldUpdateVisualBaseline = process.argv.includes('--update-visual-baseline');
const shouldRunTestsLocatedInWorktree = process.argv.includes('--worktree');
const targetBranch = process.argv.find(arg => arg.startsWith('--target-branch='))?.split('=')[1];
const chromium = process.argv.includes('--chromium');
const worktreeRelativePath = getWorkTreeRelativePath(targetBranch);
const testsPathPrefix = shouldRunTestsLocatedInWorktree ? `${worktreeRelativePath}/` : '';

const groups = [
  {
    name: 'visual-tests',
    files: await globby([`${testsPathPrefix}packages/**/*.visual.test.js`]),
  },
];

const config = {
  ...defaultConfig,
  browsers: chromium ? [playwrightLauncher({ product: 'chromium' })] : defaultConfig.browsers,
  groups,
  plugins: [...defaultConfig.plugins],
};
config.testsFinishTimeout = 1000 * 60 * 10; // 10 minutes
config.plugins.push(
  visualRegressionPlugin({
    update: shouldUpdateVisualBaseline,
    // We store screenshots only in worktree.
    // in all cases: when running test from the root of the repo or from inside the worktree.
    baseDir: `${worktreeRelativePath}/.tmp/screenshots`,
  }),
);
export default config;
