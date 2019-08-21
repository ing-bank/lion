const wallabyWebpack = require('wallaby-webpack'); // eslint-disable-line import/no-extraneous-dependencies

// filter packages, e.g. 'core' / '{radio,radio-button}' / '{form,input*}'
const packagePattern = '*';

const replaceAll = (str, oldValue, newValue) => str.split(oldValue).join(newValue);

const countOccurences = (str, subbstr) => str.split(subbstr).length - 1;

const makeLionImportsRelative = file => {
  // example:
  // file.path: 'packages/package-name/src/my-element.js'
  // old imports: '@lion/package-name'
  // new imports: '../../package-name'
  const nestLevel = countOccurences(file.path, '/') - 1; // 3 - 1 = 2
  return replaceAll(file.content, '@lion/', '../'.repeat(nestLevel)); // '@lion/' => '../../'
};

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
  preprocessors: {
    '**/*.js': makeLionImportsRelative,
  },
  postprocessor: wallabyWebpack(),
  setup: () => {
    // required to trigger test loading
    window.__moduleBundler.loadTests();
  },
});
