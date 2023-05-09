/* eslint-disable no-param-reassign */
import path from 'path';
import { isRelativeSourcePath } from '../../utils/relative-source-path.js';
import { resolveImportPath } from '../../utils/resolve-import-path.js';
import { toPosixPath } from '../../utils/to-posix-path.js';

/**
 * @typedef {import('../../../../types/index.js').PathRelative} PathRelative
 * @typedef {import('../../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../../types/index.js').FindImportsAnalyzerEntry} FindImportsAnalyzerEntry
 */

/**
 * @param {PathFromSystemRoot} currentDirPath
 * @param {PathFromSystemRoot} resolvedPath
 * @returns {PathRelative}
 */
function toLocalPath(currentDirPath, resolvedPath) {
  let relativeSourcePath = path.relative(currentDirPath, resolvedPath);
  if (!relativeSourcePath.startsWith('.')) {
    // correction on top of path.resolve, which resolves local paths like
    // (from import perspective) external modules.
    // so 'my-local-files.js' -> './my-local-files.js'
    relativeSourcePath = `./${relativeSourcePath}`;
  }
  return /** @type {PathRelative} */ (toPosixPath(relativeSourcePath));
}

/**
 * Resolves and converts to normalized local/absolute path, based on file-system information.
 * - from:  '../../relative/file'
 * - to: './src/relative/file.js'
 * @param {string} oldSource
 * @param {string} relativePath
 * @param {string} rootPath
 */
export async function normalizeSourcePath(oldSource, relativePath, rootPath = process.cwd()) {
  const currentFilePath = /** @type {PathFromSystemRoot} */ (path.resolve(rootPath, relativePath));
  const currentDirPath = /** @type {PathFromSystemRoot} */ (path.dirname(currentFilePath));

  if (isRelativeSourcePath(oldSource) && relativePath) {
    // This will be a source like '../my/file.js' or './file.js'
    const resolvedPath = /** @type {PathFromSystemRoot} */ (
      await resolveImportPath(oldSource, currentFilePath)
    );
    return resolvedPath && toLocalPath(currentDirPath, resolvedPath);
  }
  // This will be a source from a project, like 'lion-based-ui/x.js' or '@open-wc/testing/y.js'
  return oldSource;
}

/**
 * @param {Partial<FindImportsAnalyzerEntry>[]} queryOutput
 * @param {string} relativePath
 * @param {string} rootPath
 */
export async function normalizeSourcePaths(queryOutput, relativePath, rootPath = process.cwd()) {
  const normalizedQueryOutput = [];
  for (const specifierResObj of queryOutput) {
    if (specifierResObj.source) {
      const x = await normalizeSourcePath(specifierResObj.source, relativePath, rootPath);
      if (x) {
        specifierResObj.normalizedSource = x;
      }
    }
    normalizedQueryOutput.push(specifierResObj);
  }
  return normalizedQueryOutput;
}
