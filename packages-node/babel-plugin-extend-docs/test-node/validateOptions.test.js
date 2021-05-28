const { expect } = require('chai');
const path = require('path');
const { executeBabel } = require('./helpers.js');

function formatJsonErrorMessage(json) {
  if (!json) {
    return '';
  }
  return `\n  ${JSON.stringify(json, null, 2).split('\n').join('\n  ')}`;
}

describe('babel-plugin-extend-docs: validateOptions', () => {
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
        "    from: 'source-counter',",
        "    to: 'extension-counter',",
        '    paths: [',
        '      {',
        "         from: '@source/counter/define',",
        "         to: 'extension/counter/define'",
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
          "    from: 'source-counter',",
          "    to: 'extension-counter',",
          '    paths: [',
          '      {',
          "         from: '@source/counter/define',",
          "         to: 'extension/counter/define'",
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
          "    from: 'SourceCounter',",
          "    to: 'ExtensionCounter',",
          '    paths: [',
          '      {',
          "         from: '@source/counter',",
          "         to: 'extension/counter'",
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
