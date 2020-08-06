const { legacyPlugin } = require('@web/dev-server-legacy');

module.exports = {
  plugins: [legacyPlugin()],
  nodeResolve: true,
  sessionStartTimeout: 30000,
  concurrency: 5,
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
      timeout: '3000',
    },
  },
};
