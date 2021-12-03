const { isRelativeSourcePath } = require('../../utils/relative-source-path.js');
const { LogService } = require('../../core/LogService.js');
const { resolveImportPath } = require('../../utils/resolve-import-path.js');
const { toPosixPath } = require('../../utils/to-posix-path.js');

/**
 * @typedef {import('../../types/core').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../types/core').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../types/core').SpecifierSource} SpecifierSource
 */

/**
 * Gets local path from reference project
 *
 * - from: 'reference-project/foo'
 * - to: './foo.js'
 * When we need to resolve to the main entry:
 * - from: 'reference-project'
 * - to: './index.js' (or other file specified in package.json 'main')
 * @param {object} config
 * @param {SpecifierSource} config.importee 'reference-project/foo.js'
 * @param {PathFromSystemRoot} config.importer '/my/project/importing-file.js'
 * @param {PathFromSystemRoot} config.importeeProjectPath '/path/to/reference/project'
 * @returns {Promise<PathRelativeFromProjectRoot|null>} './foo.js'
 */
async function fromImportToExportPerspective({ importee, importer, importeeProjectPath }) {
  if (isRelativeSourcePath(importee)) {
    LogService.warn('[fromImportToExportPerspective] Please only provide external import paths');
    return null;
  }

  const absolutePath = await resolveImportPath(importee, importer);
  if (!absolutePath) {
    return null;
  }

  return /** @type {PathRelativeFromProjectRoot} */ (
    absolutePath.replace(new RegExp(`^${toPosixPath(importeeProjectPath)}/?(.*)$`), './$1')
  );
}

module.exports = { fromImportToExportPerspective };
