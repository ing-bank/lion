module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'].map(require.resolve),
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/test-suites/**/*.js',
          '**/test/**/*.js',
          '**/stories/**/*.js',
          '**/*.config.js',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/test-suites/**/*.js', '**/test/**/*.js', '**/stories/**/*.js', '**/*.config.js'],
      rules: {
        'no-console': 'off',
        'no-unused-expressions': 'off',
        'class-methods-use-this': 'off',
      },
    },
  ],
};
