const { expect } = require('chai');
const path = require('path');
const { executeBabel, baseConfig } = require('./helpers.js');

function formatJsonErrorMessage(json) {
  if (!json) {
    return '';
  }
  return `\n  ${JSON.stringify(json, null, 2).split('\n').join('\n  ')}`;
}

describe('babel-plugin-extend-docs: validateOptions', () => {
  it('throws if no rootPath string is provided', () => {
    expect(() => executeBabel('', { ...baseConfig })).to.throw(
      `babel-plugin-extend-docs: You need to provide a rootPath option (string)\nExample: rootPath: path.resolve('.')`,
    );
  });

  it('throws if rootPath does not exist', () => {
    expect(() => executeBabel('', { ...baseConfig, rootPath: 'something' })).to.throw(
      `babel-plugin-extend-docs: The provided rootPath "something" does not exist.`,
    );
  });

  it('throws if rootPath is not a directory', () => {
    const rootPath = path.resolve('./index.js');
    expect(() => {
      executeBabel('', {
        ...baseConfig,
        rootPath,
      });
    }).to.throw(
      `babel-plugin-extend-docs: The provided rootPath "${rootPath}" is not a directory.`,
    );
  });

  it('throws if no changes array is provided', () => {
    expect(() => {
      executeBabel('', {
        rootPath: path.resolve('./'),
      });
    }).to.throw(
      [
        'babel-plugin-extend-docs: The required changes array is missing.',
        `Given: ${formatJsonErrorMessage(undefined)}`,
        'Should be example:',
        '  {',
        "    from: 'my-counter',",
        "    to: 'my-extension',",
        '    paths: [',
        '      {',
        "         from: './my-counter.js',",
        "         to: './my-extension/my-extension.js'",
        '      }',
        '    ]',
        '  }',
      ].join('\n'),
    );
  });

  it('throws if tag change does not have a valid to, from, and paths property', () => {
    const defaultMsg = ['babel-plugin-extend-docs: The provided tag change is not valid.'];
    function tagThrowsErrorFor(tag, msg = defaultMsg) {
      expect(() => {
        executeBabel('', {
          rootPath: path.resolve('./'),
          changes: [{ tag }],
        });
      }).to.throw(
        [
          ...msg,
          `Given: ${formatJsonErrorMessage(tag)}`,
          'Should be example:',
          '  {',
          "    from: 'my-counter',",
          "    to: 'my-extension',",
          '    paths: [',
          '      {',
          "         from: './my-counter.js',",
          "         to: './my-extension/my-extension.js'",
          '      }',
          '    ]',
          '  }',
        ].join('\n'),
      );
    }

    tagThrowsErrorFor({});
    tagThrowsErrorFor({ from: '' });
    tagThrowsErrorFor({ from: 'my-counter' });
    tagThrowsErrorFor({ from: 'my-counter', to: '' });
    tagThrowsErrorFor({ from: 'my-counter', to: 'my-extension' }, [
      'babel-plugin-extend-docs: The provided tag change is not valid.',
      'The paths array is missing.',
    ]);
    tagThrowsErrorFor({ from: 'my-counter', to: 'my-extension', paths: [] }, [
      'babel-plugin-extend-docs: The provided tag change is not valid.',
      'The paths array is missing.',
    ]);

    const pathMsg = [
      'babel-plugin-extend-docs: The provided tag change is not valid.',
      'The path object is invalid.',
    ];
    const pathSetup = { from: 'my-counter', to: 'my-extension' };
    tagThrowsErrorFor({ ...pathSetup, paths: [{}] }, pathMsg);
    tagThrowsErrorFor({ ...pathSetup, paths: [{ from: '' }] }, pathMsg);
    tagThrowsErrorFor({ ...pathSetup, paths: [{ from: './index.js' }] }, pathMsg);
    tagThrowsErrorFor({ ...pathSetup, paths: [{ to: '' }] }, pathMsg);
    tagThrowsErrorFor({ ...pathSetup, paths: [{ to: './index.js' }] }, pathMsg);
    tagThrowsErrorFor({ ...pathSetup, paths: [{ from: './index.js', to: '' }] }, pathMsg);
    tagThrowsErrorFor({ ...pathSetup, paths: [{ from: '', to: './index.js' }] }, pathMsg);
  });

  it('throws if variable change does not have a valid to, from, and paths property', () => {
    const defaultMsg = ['babel-plugin-extend-docs: The provided variable change is not valid.'];
    function variableThrowsErrorFor(variable, msg = defaultMsg) {
      expect(() => {
        executeBabel('', {
          rootPath: path.resolve('./'),
          changes: [{ variable }],
        });
      }).to.throw(
        [
          ...msg,
          `Given: ${formatJsonErrorMessage(variable)}`,
          'Should be example:',
          '  {',
          "    from: 'MyCounter',",
          "    to: 'MyExtension',",
          '    paths: [',
          '      {',
          "         from: './index.js',",
          "         to: './my-extension/index.js'",
          '      }',
          '    ]',
          '  }',
        ].join('\n'),
      );
    }

    variableThrowsErrorFor({});
    variableThrowsErrorFor({ from: '' });
    variableThrowsErrorFor({ from: 'my-counter' });
    variableThrowsErrorFor({ from: 'my-counter', to: '' });
    variableThrowsErrorFor({ from: 'my-counter', to: 'my-extension' }, [
      'babel-plugin-extend-docs: The provided variable change is not valid.',
      'The paths array is missing.',
    ]);
    variableThrowsErrorFor({ from: 'my-counter', to: 'my-extension', paths: [] }, [
      'babel-plugin-extend-docs: The provided variable change is not valid.',
      'The paths array is missing.',
    ]);

    const pathMsg = [
      'babel-plugin-extend-docs: The provided variable change is not valid.',
      'The path object is invalid.',
    ];
    const pathSetup = { from: 'my-counter', to: 'my-extension' };
    variableThrowsErrorFor({ ...pathSetup, paths: [{}] }, pathMsg);
    variableThrowsErrorFor({ ...pathSetup, paths: [{ from: '' }] }, pathMsg);
    variableThrowsErrorFor({ ...pathSetup, paths: [{ from: './index.js' }] }, pathMsg);
    variableThrowsErrorFor({ ...pathSetup, paths: [{ to: '' }] }, pathMsg);
    variableThrowsErrorFor({ ...pathSetup, paths: [{ to: './index.js' }] }, pathMsg);
    variableThrowsErrorFor({ ...pathSetup, paths: [{ from: './index.js', to: '' }] }, pathMsg);
    variableThrowsErrorFor({ ...pathSetup, paths: [{ from: '', to: './index.js' }] }, pathMsg);
  });

  it('throws if "to path" could not be found on file system', () => {
    expect(() => {
      executeBabel('', {
        changes: [
          {
            tag: {
              from: 'lion-input',
              to: 'wolf-input',
              paths: [
                {
                  from: './lion-input.js',
                  to: './non-existing/wolf-input.js',
                },
              ],
            },
          },
        ],
        rootPath: path.resolve('./'),
      });
    }).to.throw(
      [
        'babel-plugin-extend-docs: Rewriting import from "./lion-input.js" to "./non-existing/wolf-input.js" but we ',
        `could not find a file at "${path.resolve('./')}/non-existing/wolf-input.js".`,
      ].join(''),
    );
  });

  it('does NOT throws if "to path" could be found on file system', () => {
    expect(() => {
      executeBabel('', {
        changes: [
          {
            tag: {
              from: 'lion-input',
              to: 'wolf-input',
              paths: [
                {
                  from: './lion-input.js',
                  to: path.resolve('./test-node/validateOptions.test.js'),
                },
              ],
            },
          },
        ],
        rootPath: path.resolve('./'),
      });
    }).to.not.throw();
  });
});
