'use strict';

const { createRequire, builtinModules } = require('module');

exports.interfaceVersion = 2;

exports.resolve = function (source, file, config) {
  try {
    if (builtinModules.includes(source)) {
      return { found: true, path: null };
    }
    const myRequire = createRequire(file);
    const resolvedPath = myRequire.resolve(source);

    return { found: true, path: resolvedPath };
  } catch (err) {
    return { found: false };
  }
};
