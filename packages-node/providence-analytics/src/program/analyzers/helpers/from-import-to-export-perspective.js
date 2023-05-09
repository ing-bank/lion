import { isRelativeSourcePath } from '../../utils/relative-source-path.js';
import { LogService } from '../../core/LogService.js';
import { resolveImportPath } from '../../utils/resolve-import-path.js';
import { toPosixPath } from '../../utils/to-posix-path.js';

/**
 * @typedef {import('../../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../../types/index.js').SpecifierSource} SpecifierSource
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
export async function fromImportToExportPerspective({ importee, importer, importeeProjectPath }) {
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
