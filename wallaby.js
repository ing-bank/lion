const wallabyWebpack = require('wallaby-webpack'); // eslint-disable-line import/no-extraneous-dependencies

// filter packages, e.g. 'core' / '{radio,radio-button}' / '{form,input*}'
const packagePattern = '*';

module.exports = () => ({
  files: [
    { pattern: `packages/${packagePattern}/*.js`, load: false },
    { pattern: `packages/${packagePattern}/{src,translations,test}/**/*.js`, load: false },
    { pattern: `packages/${packagePattern}/test/**/*.test.js`, ignore: true },
  ],
  filesWithNoCoverageCalculated: [
    `packages/${packagePattern}/*.js`,
    `packages/${packagePattern}/test/**/*.js`,
  ],
  tests: [{ pattern: `packages/${packagePattern}/test/**/*.test.js`, load: false }],
  testFramework: 'mocha',
  env: {
    kind: 'chrome',
  },
  postprocessor: wallabyWebpack(),
  setup: () => {
    // required to trigger test loading
    window.__moduleBundler.loadTests();
  },
});
