/* eslint-disable no-param-reassign */
const pathLib = require('path');
const {
  isRelativeSourcePath,
  // toRelativeSourcePath,
} = require('../../utils/relative-source-path.js');
const { resolveImportPath } = require('../../utils/resolve-import-path.js');
const { aMap } = require('../../utils/async-array-utils.js');

function toLocalPath(currentDirPath, resolvedPath) {
  let relativeSourcePath = pathLib.relative(currentDirPath, resolvedPath);
  if (!relativeSourcePath.startsWith('.')) {
    // correction on top of pathLib.resolve, which resolves local paths like
    // (from import perspective) external modules.
    // so 'my-local-files.js' -> './my-local-files.js'
    relativeSourcePath = `./${relativeSourcePath}`;
  }
  return relativeSourcePath;
}

/**
 * @desc Resolves and converts to normalized local/absolute path, based on file-system information.
 * - from: { source: '../../relative/file' }
 * - to: {
 *         fullPath: './absolute/path/from/root/to/relative/file.js',
 *         normalizedPath: '../../relative/file.js'
 *    }
 * @param {FindImportsAnalysisResult} result
 * @param {string} result
 * @param {string} relativePath
 * @returns {string} a relative path from root (usually a project) or an external path like 'lion-based-ui/x.js'
 */
async function normalizeSourcePaths(queryOutput, relativePath, rootPath = process.cwd()) {
  const currentFilePath = pathLib.resolve(rootPath, relativePath);
  const currentDirPath = pathLib.dirname(currentFilePath);
  return aMap(queryOutput, async specifierResObj => {
    if (specifierResObj.source) {
      if (isRelativeSourcePath(specifierResObj.source) && relativePath) {
        // This will be a source like '../my/file.js' or './file.js'
        const resolvedPath = await resolveImportPath(specifierResObj.source, currentFilePath);
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
