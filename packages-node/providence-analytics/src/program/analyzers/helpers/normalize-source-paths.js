/* eslint-disable no-param-reassign */
const pathLib = require('path');
const { isRelativeSourcePath } = require('../../utils/relative-source-path.js');
const { resolveImportPath } = require('../../utils/resolve-import-path.js');
const { toPosixPath } = require('../../utils/to-posix-path.js');
const { aMap } = require('../../utils/async-array-utils.js');

/**
 * @typedef {import('../../types/core').PathRelative} PathRelative
 * @typedef {import('../../types/core').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../types/core').QueryOutput} QueryOutput
 */

/**
 *
 * @param {PathFromSystemRoot} currentDirPath
 * @param {PathFromSystemRoot} resolvedPath
 * @returns {PathRelative}
 */
function toLocalPath(currentDirPath, resolvedPath) {
  let relativeSourcePath = pathLib.relative(currentDirPath, resolvedPath);
  if (!relativeSourcePath.startsWith('.')) {
    // correction on top of pathLib.resolve, which resolves local paths like
    // (from import perspective) external modules.
    // so 'my-local-files.js' -> './my-local-files.js'
    relativeSourcePath = `./${relativeSourcePath}`;
  }
  return /** @type {PathRelative} */ (toPosixPath(relativeSourcePath));
}

/**
 * Resolves and converts to normalized local/absolute path, based on file-system information.
 * - from: { source: '../../relative/file' }
 * - to: {
 *         fullPath: './absolute/path/from/root/to/relative/file.js',
 *         normalizedPath: '../../relative/file.js'
 *    }
 * @param {QueryOutput} queryOutput
 * @param {string} relativePath
 * @param {string} rootPath
 */
async function normalizeSourcePaths(queryOutput, relativePath, rootPath = process.cwd()) {
  const currentFilePath = /** @type {PathFromSystemRoot} */ (
    pathLib.resolve(rootPath, relativePath)
  );
  const currentDirPath = /** @type {PathFromSystemRoot} */ (pathLib.dirname(currentFilePath));
  return aMap(queryOutput, async specifierResObj => {
    if (specifierResObj.source) {
      if (isRelativeSourcePath(specifierResObj.source) && relativePath) {
        // This will be a source like '../my/file.js' or './file.js'
        const resolvedPath = /** @type {PathFromSystemRoot} */ (
          await resolveImportPath(specifierResObj.source, currentFilePath)
        );
        specifierResObj.normalizedSource =
          resolvedPath && toLocalPath(currentDirPath, resolvedPath);
        // specifierResObj.fullSource = resolvedPath && toRelativeSourcePath(resolvedPath, rootPath);
      } else {
        // This will be a source from a project, like 'lion-based-ui/x.js' or '@open-wc/testing/y.js'
        specifierResObj.normalizedSource = specifierResObj.source;
        // specifierResObj.fullSource = specifierResObj.source;
      }
    }
    return specifierResObj;
  });
}

module.exports = { normalizeSourcePaths };
