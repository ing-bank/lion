const { isRelativeSourcePath } = require('../../utils/relative-source-path.js');
const { LogService } = require('../../services/LogService.js');
const { resolveImportPath } = require('../../utils/resolve-import-path.js');

/**
 * @typedef {import('../../types/core').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 */

/**
 * @param {string} importee like '@lion/core/myFile.js'
 * @returns {string} project name ('@lion/core')
 */
function getProjectFromImportee(importee) {
  const scopedProject = importee[0] === '@';
  // 'external-project/src/file.js' -> ['external-project', 'src', file.js']
  let splitSource = importee.split('/');
  if (scopedProject) {
    // '@external/project'
    splitSource = [splitSource.slice(0, 2).join('/'), ...splitSource.slice(2)];
  }
  // ['external-project', 'src', 'file.js'] -> 'external-project'
  const project = splitSource.slice(0, 1).join('/');

  return project;
}

/**
 * Gets local path from reference project
 *
 * - from: 'reference-project/foo'
 * - to: './foo.js'
 * When we need to resolve to the main entry:
 * - from: 'reference-project'
 * - to: './index.js' (or other file specified in package.json 'main')
 * @param {object} config
 * @param {string} config.importee 'reference-project/foo.js'
 * @param {string} config.importer '/my/project/importing-file.js'
 * @returns {Promise<PathRelativeFromProjectRoot|null>} './foo.js'
 */
async function fromImportToExportPerspective({ importee, importer }) {
  if (isRelativeSourcePath(importee)) {
    LogService.warn('[fromImportToExportPerspective] Please only provide external import paths');
    return null;
  }

  const absolutePath = await resolveImportPath(importee, importer);
  const projectName = getProjectFromImportee(importee);

  /**
   * - from: '/my/reference/project/packages/foo/index.js'
   * - to: './packages/foo/index.js'
   */
  return absolutePath
    ? /** @type {PathRelativeFromProjectRoot} */ (
        absolutePath.replace(new RegExp(`^.*/${projectName}/?(.*)$`), './$1')
      )
    : null;
}

module.exports = { fromImportToExportPerspective };
