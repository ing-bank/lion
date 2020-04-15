const babel = require('babel-core');
const babelPluginExtendDocs = require('../src/babelPluginExtendDocs.js');

function executeBabel(input, options) {
  const result = babel.transform(input, {
    plugins: [[babelPluginExtendDocs, options]],
  });
  return result.code;
}

const baseConfig = {
  changes: [
    {
      description: 'LionInput',
      variable: {
        from: 'LionInput',
        to: 'WolfInput',
        paths: [
          {
            from: './index.js',
            to: './index.js',
          },
          {
            from: './src/LionInput.js',
            to: './index.js',
          },
          {
            from: '@lion/input',
            to: './index.js',
          },
        ],
      },
      tag: {
        from: 'lion-input',
        to: 'wolf-input',
        paths: [
          {
            from: './lion-input.js',
            to: './__element-definitions/wolf-input.js',
          },
          {
            from: '@lion/input/lion-input.js',
            to: './__element-definitions/wolf-input.js',
          },
        ],
      },
    },
    {
      description: 'LionButton',
      variable: {
        from: 'LionButton',
        to: 'WolfButton',
        paths: [
          {
            from: './index.js',
            to: './index.js',
          },
          {
            from: './src/LionButton.js',
            to: './index.js',
          },
          {
            from: '@lion/button',
            to: './index.js',
          },
        ],
      },
      tag: {
        from: 'lion-button',
        to: 'wolf-button',
        paths: [
          {
            from: './lion-button.js',
            to: './__element-definitions/wolf-button.js',
          },
          {
            from: '@lion/button/lion-button.js',
            to: './__element-definitions/wolf-button.js',
          },
        ],
      },
    },
    {
      description: 'localize',
      variable: {
        from: 'localize',
        to: 'localize',
        paths: [
          {
            from: './index.js',
            to: './localize.js',
          },
          {
            from: './src/localize.js',
            to: './localize.js',
          },
          {
            from: '@lion/localize',
            to: './localize.js',
          },
        ],
      },
    },
  ],
};

module.exports = {
  executeBabel,
  baseConfig,
};
