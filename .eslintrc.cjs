const path = require('path');

module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'].map(require.resolve),
  plugins: ['@html-eslint'],
  overrides: [
    {
      files: ['**/*.js', '**/*.mjs'],
      rules: {
        'wc/guard-super-call': 'off', // types will prevent you from calling the super if it's not in the base class, making the guard unnecessary
        'no-await-in-loop': 'off',
        'import/no-unresolved': 'off', // eslint not smart enough atm to understand package exports maps
        camelcase: ['error', { properties: 'always' }],
        '@html-eslint/no-extra-spacing-attrs': ['error', { enforceBeforeSelfClose: true }],
        '@html-eslint/require-button-type': 'error',
        '@html-eslint/no-extra-spacing-text': 'error',
        '@html-eslint/no-duplicate-attrs': 'error',
        '@html-eslint/no-duplicate-class': 'error',
        '@html-eslint/no-invalid-role': 'error',
        '@html-eslint/no-multiple-empty-lines': 'error',
        '@html-eslint/require-title': 'error',
        '@html-eslint/require-img-alt': 'error',
        '@html-eslint/no-abstract-roles': 'error',
      },
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
    {
      files: [
        '**/test-helpers/**/*.js',
        '**/test-suites/**/*.js',
        '**/test/**/*.js',
        '**/test-node/**/*.{j,mj}s',
        '**/demo/**/*.js',
        '**/docs/**/*.js',
        '**/*.config.js',
        'scripts/**/*.js',
      ],
      rules: {
        'lit/binding-positions': 'off',
        'lit/no-invalid-html': 'off',
        'lit/no-useless-template-literals': 'off',
        'no-console': 'off',
        'no-unused-expressions': 'off',
        'class-methods-use-this': 'off',
        'max-classes-per-file': 'off',
        'import/no-extraneous-dependencies': 'off', // we moved all devDependencies to root,
        '@html-eslint/require-button-type': 'off',
      },
    },
    {
      files: ['demo/**/*.js'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      [path.resolve('./scripts/eslint-resolver.cjs')]: {},
    },
  },
  env: {
    es2020: true,
  },
};
