const path = require('path');

module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'].map(require.resolve),
  overrides: [
    {
      files: ['**/*.js', '**/*.mjs'],
      rules: {
        'wc/guard-super-call': 'off', // types will prevent you from calling the super if it's not in the base class, making the guard unnecessary
        'no-await-in-loop': 'off',
        'import/no-unresolved': 'off', // eslint not smart enough atm to understand package exports maps
        camelcase: ['error', { properties: 'always' }],
      },
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
    {
      files: [
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
        'import/no-extraneous-dependencies': 'off', // we moved all devDependencies to root
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
  // ignores: [
  //   'node_modules',
  //   'coverage/',
  //   'bundlesize/',
  //   '.history/',
  //   'storybook-static/',
  //   '*.d.ts',
  //   '_site-dev',
  //   '_site',
  //   'docs/_merged_*',
  //   'patches/',

  //   '/docs/_assets/scoped-custom-element-registry.min.js',
  //   '/docs/_assets/scoped-custom-element-registry.min.js.map',
  //   '/docs/_merged_assets/scoped-custom-element-registry.min.js',
  // ],
};
