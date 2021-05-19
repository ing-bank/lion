// eslint-disable-next-line import/no-unresolved
const babel = require('@babel/core');
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
            from: '@lion/input',
            to: 'wolf-web/input',
          },
        ],
      },
      tag: {
        from: 'lion-input',
        to: 'wolf-input',
        paths: [
          {
            from: '@lion/input/define',
            to: '#input/define',
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
            from: '@lion/button',
            to: 'wolf-web/button',
          },
        ],
      },
      tag: {
        from: 'lion-button',
        to: 'wolf-button',
        paths: [
          {
            from: '@lion/button/define',
            to: '#button/define',
          },
        ],
      },
    },
    {
      description: 'LionCheckbox',
      variable: {
        from: 'LionCheckbox',
        to: 'WolfCheckbox',
        paths: [
          {
            from: '@lion/checkbox-group',
            to: 'wolf-web/checkbox-group',
          },
        ],
      },
      tag: {
        from: 'lion-checkbox',
        to: 'wolf-checkbox',
        paths: [
          {
            from: '@lion/checkbox-group/define',
            to: '#checkbox-group/define',
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
            from: '@lion/localize',
            to: 'wolf-web/localize',
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
