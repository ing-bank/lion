/* eslint-disable import/no-extraneous-dependencies */
const createDefaultConfig = require('@open-wc/testing-karma/default-config');
const merge = require('webpack-merge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        config.grep ? config.grep : 'packages/*/test/**/*.test.js',
      ],

      // TODO: improve coverage
      coverageIstanbulReporter: {
        thresholds: {
          global: {
            statements: 80,
            branches: 70,
            functions: 70,
            lines: 80,
          },
        },
      },
    }),
  );
  return config;
};
