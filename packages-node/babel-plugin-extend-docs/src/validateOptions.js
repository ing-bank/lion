const tagExample = [
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
];

const variableExample = [
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
];

function formatJsonErrorMessage(json) {
  if (!json) {
    return '';
  }
  return `\n  ${JSON.stringify(json, null, 2).split('\n').join('\n  ')}`;
}

function validatePaths(paths, given, intro, example) {
  if (!Array.isArray(paths) || (Array.isArray(paths) && paths.length === 0)) {
    const errorMsg = [
      intro,
      'The paths array is missing.',
      `Given: ${formatJsonErrorMessage(given)}`,
      ...example,
    ].join('\n');
    throw new Error(errorMsg);
  }

  const errorMsg = [
    intro,
    'The path object is invalid.',
    `Given: ${formatJsonErrorMessage(given)}`,
    ...example,
  ].join('\n');
  for (const pathObj of paths) {
    if (typeof pathObj.from !== 'string' || !pathObj.from) {
      throw new Error(errorMsg);
    }
    if (typeof pathObj.to !== 'string' || !pathObj.to) {
      throw new Error(errorMsg);
    }
  }
}

function validateChanges(changes) {
  if (!Array.isArray(changes) || (Array.isArray(changes) && changes.length === 0)) {
    const errorMsg = [
      'babel-plugin-extend-docs: The required changes array is missing.',
      `Given: ${formatJsonErrorMessage(changes)}`,
      ...tagExample,
    ].join('\n');
    throw new Error(errorMsg);
  }
  for (const change of changes) {
    if (change.tag) {
      const { tag } = change;
      const intro = 'babel-plugin-extend-docs: The provided tag change is not valid.';
      const errorMsg = [intro, `Given: ${formatJsonErrorMessage(tag)}`, ...tagExample].join('\n');
      if (typeof tag.from !== 'string' || !tag.from) {
        throw new Error(errorMsg);
      }
      if (typeof tag.to !== 'string' || !tag.to) {
        throw new Error(errorMsg);
      }

      validatePaths(tag.paths, tag, intro, tagExample);
    }

    if (change.variable) {
      const { variable } = change;
      const intro = 'babel-plugin-extend-docs: The provided variable change is not valid.';
      const errorMsg = [
        intro,
        `Given: ${formatJsonErrorMessage(variable)}`,
        ...variableExample,
      ].join('\n');
      if (typeof variable.from !== 'string' || !variable.from) {
        throw new Error(errorMsg);
      }
      if (typeof variable.to !== 'string' || !variable.to) {
        throw new Error(errorMsg);
      }
      validatePaths(variable.paths, variable, intro, variableExample);
    }
  }
}

function validateOptions(_options) {
  const options = {
    ..._options,
  };
  validateChanges(options.changes);
}

module.exports = {
  validateOptions,
};
