const { legacyPlugin } = require('@web/dev-server-legacy');
const { browserstackLauncher } = require('@web/test-runner-browserstack');

const sharedCapabilities = {
  // it's recommended to store user and key as environment variables
  'browserstack.user': process.env.BROWSER_STACK_USERNAME,
  'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY,

  project: '@lion',
  name: '@lion web components',
  // if you are running tests in a CI, the build id might be available as an
  // environment variable. this is useful for identifying test runs
  // this is for example the name for github actions
  build: `build ${process.env.GITHUB_RUN_NUMBER || 'unknown'}`,
};

module.exports = {
  plugins: [legacyPlugin()],
  nodeResolve: true,
  sessionStartTimeout: 60000,
  concurrency: 1,
  coverageConfig: {
    threshold: {
      statements: 80,
      branches: 70,
      functions: 70,
      lines: 80,
    },
  },
  browsers: [
    // browserstackLauncher({
    //   capabilities: {
    //     ...sharedCapabilities,
    //     browserName: 'Chrome',
    //     os: 'Windows',
    //     os_version: '10',
    //   },
    // }),
    // browserstackLauncher({
    //   capabilities: {
    //     ...sharedCapabilities,
    //     browserName: 'Firefox',
    //     os: 'Windows',
    //     os_version: '10',
    //   },
    // }),
    // browserstackLauncher({
    //   capabilities: {
    //     ...sharedCapabilities,
    //     browserName: 'Firefox',
    //     browser_version: '60.0',
    //     os: 'Windows',
    //     os_version: '10',
    //   },
    // }),
    // browserstackLauncher({
    //   capabilities: {
    //     ...sharedCapabilities,
    //     browserName: 'Safari',
    //     browser_version: '11.1',
    //     os: 'OS X',
    //     os_version: 'High Sierra',
    //   },
    // }),
    browserstackLauncher({
      capabilities: {
        ...sharedCapabilities,
        browserName: 'IE',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '7',
      },
    }),
  ],
};
