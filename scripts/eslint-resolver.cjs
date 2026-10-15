'use strict';

const nodeModule = require('module');

exports.interfaceVersion = 2;

exports.resolve = function (source, file, config) {
  try {
    if (nodeModule.isBuiltin(source)) {
      return { found: true, path: null };
    }
    const myRequire = nodeModule.createRequire(file);
    const resolvedPath = myRequire.resolve(source);

    return { found: true, path: resolvedPath };
  } catch (err) {
    return { found: false };
  }
};
