const { isRelativeSourcePath } = require('../../utils/relative-source-path.js');
const { LogService } = require('../../core/LogService.js');
const { resolveImportPath } = require('../../utils/resolve-import-path.js');

/**
 * @typedef {import('../../types/core').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../types/core').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../types/core').SpecifierSource} SpecifierSource
 */

/**
 * @param {SpecifierSource} importee like '@lion/core/myFile.js'
 * @returns {SpecifierSource} project name ('@lion/core')
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

  if (importeeProjectPath) {
    return /** @type {PathRelativeFromProjectRoot} */ (
      absolutePath.replace(new RegExp(`^${importeeProjectPath}/?(.*)$`), './$1')
    );
  }

  const projectName = getProjectFromImportee(importee);

  /**
   * - from: '/my/reference/project/packages/foo/index.js'
   * - to: './packages/foo/index.js'
   */
  return /** @type {PathRelativeFromProjectRoot} */ (
    absolutePath.replace(new RegExp(`^.*/${projectName}/?(.*)$`), './$1')
  );
}

module.exports = { fromImportToExportPerspective };
