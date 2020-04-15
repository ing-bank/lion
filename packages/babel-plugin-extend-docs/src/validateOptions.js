const fs = require('fs');

const { joinPaths } = require('./helpers.js');

const tagExample = [
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
];

const variableExample = [
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
];

function formatJsonErrorMessage(json) {
  if (!json) {
    return '';
  }
  return `\n  ${JSON.stringify(json, null, 2)
    .split('\n')
    .join('\n  ')}`;
}

function validatePaths(paths, given, intro, example, options) {
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
    } else if (options.throwOnNonExistingPathToFiles === true) {
      const filePath = joinPaths(options.rootPath, pathObj.to);
      if (!(fs.existsSync(filePath) && fs.lstatSync(filePath).isFile())) {
        throw new Error(
          `babel-plugin-extend-docs: Rewriting import from "${pathObj.from}" to "${pathObj.to}" but we could not find a file at "${filePath}".`,
        );
      }
    }
  }
}

function validateChanges(changes, options) {
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

      validatePaths(tag.paths, tag, intro, tagExample, options);
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

      validatePaths(variable.paths, variable, intro, variableExample, options);
    }
  }
}

function validateOptions(_options) {
  const options = {
    throwOnNonExistingPathToFiles: true,
    throwOnNonExistingRootPath: true,
    ..._options,
  };
  if (options.throwOnNonExistingRootPath) {
    if (!options.rootPath) {
      throw new Error(
        `babel-plugin-extend-docs: You need to provide a rootPath option (string)\nExample: rootPath: path.resolve('.')`,
      );
    }
    if (!fs.existsSync(options.rootPath)) {
      throw new Error(
        `babel-plugin-extend-docs: The provided rootPath "${options.rootPath}" does not exist.`,
      );
    }
    if (!fs.lstatSync(options.rootPath).isDirectory()) {
      throw new Error(
        `babel-plugin-extend-docs: The provided rootPath "${options.rootPath}" is not a directory.`,
      );
    }
  }
  validateChanges(options.changes, {
    throwOnNonExistingPathToFiles: options.throwOnNonExistingPathToFiles,
    rootPath: options.rootPath,
  });
}

module.exports = {
  validateOptions,
};
