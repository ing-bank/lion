const path = require('path');

const extendDocsConfig = {
  changes: [
    {
      name: 'MyCounter',
      variable: {
        from: 'MyCounter',
        to: 'MyExtension',
        paths: [
          { from: './index.js', to: './my-extension/index.js' },
          { from: './src/MyCounter.js', to: './my-extension/index.js' },
        ],
      },
      tag: {
        from: 'my-counter',
        to: 'my-extension',
        paths: [{ from: './my-counter.js', to: './my-extension/my-extension.js' }],
      },
    },
  ],
  rootPath: path.resolve('./demo'),
};

module.exports = {
  nodeResolve: true,
  watch: true,
  open: 'packages-node/babel-plugin-extend-docs/demo/',
  babel: true,
  babelConfig: {
    overrides: [
      {
        test: ['./demo/**/*.demo.js'],
        plugins: [[path.resolve('./'), extendDocsConfig]],
      },
    ],
  },
};
