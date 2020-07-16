const { legacyPlugin } = require('@web/dev-server-legacy');

module.exports = {
  plugins: [legacyPlugin()],
  nodeResolve: true,
  sessionStartTimeout: 30000,
  concurrency: 5,
  coverageConfig: {
    threshold: {
      statements: 80,
      branches: 70,
      functions: 70,
      lines: 80,
    },
  },
};
