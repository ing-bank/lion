/* eslint-disable no-param-reassign */
const { aMap } = require('../../utils/async-array-utils.js');

/**
 * @desc Resolves and converts to normalized local/absolute path, based on file-system, bower
 * dependency information and workings of path resolve mechanism of polymer serve.
 * Outputted path notations will be according to es module spec.
 *
 * 1. Bare module found in bower deps
 * - from: { source: '../paper-dialog/paper-dialog.html' }
 * - to: {
 *         fullPath: 'paper-dialog/paper-dialog.html',
 *         normalizedPath: 'paper-dialog/paper-dialog.html'
 *    }
 *
 * 2. Relative local import from current folder
 * - from: { source: 'local/file.html' }
 * - to: {
 *         fullPath: 'src/local/file.html',
 *         normalizedPath: './local/file.html'
 * }
 *
 * 3. Relative Local import from parent level
 * - from: { source: '../local/file.html' }
 * - to: {
 *         fullPath: 'src/local/file.html',
 *         normalizedPath: '../local/file.html'
 * }
 * @param {FindHTMLImportsAnalysisResult} result
 * @param {string} result
 * @param {string} relativePath
 * @returns {string} a relative path from root (usually a project) or an external path like 'lion-based-ui/x.js'
 */
async function normalizeSourcePaths(queryOutput, relativePath, { bowerJson }) {
  return aMap(queryOutput, async specifierResObj => {
    if (specifierResObj.source) {
      const { source } = specifierResObj;
      // '../paper-dialog/paper-dialog.html' => ['paper-dialog', 'paper-dialog.html']
      const externalDepMatch = source.match(/^\.\.\/(.*)\/(.*\.html$)/);
      if (externalDepMatch) {
        const [, externalDep, rest] = externalDepMatch;
        const deps = { ...bowerJson.devDependencies, ...bowerJson.dependencies };
        const isExternalPolymerPath = Object.keys(deps).includes(externalDep);
        if (isExternalPolymerPath) {
          // rewrite to 'bare module import'
          specifierResObj.normalizedSource = `${externalDep}/${rest}`;
        } else if (!source.startsWith('.')) {
          // in case of html imports, a path will either start with:
          // - '../' (this can be a relative path or (due to workings polymer serve) a bare module)
          // - 'my-folder/my-file.html' (allways a relative path)
          specifierResObj.normalizedSource = `./${externalDep}/${rest}`;
        } else {
          //
          specifierResObj.normalizedSource = source;
        }
      }
    }
    return specifierResObj;
  });
}

module.exports = { normalizeSourcePaths };
