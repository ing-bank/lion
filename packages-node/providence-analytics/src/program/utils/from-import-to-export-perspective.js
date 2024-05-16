import path from 'path';

import { isRelativeSourcePath } from './relative-source-path.js';
import { resolveImportPath } from './resolve-import-path.js';
import { LogService } from '../core/LogService.js';
import { toPosixPath } from './to-posix-path.js';

/**
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').SpecifierSource} SpecifierSource
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
    LogService.warn(
      `[fromImportToExportPerspective] Please only provide external import paths for ${{
        importee,
        importer,
        importeeProjectPath,
      }}`,
    );
    return null;
  }

  const absolutePath = await resolveImportPath(importee, importer, {
    // Usually, we resolve from `{importer}/node_modules`.
    // In some contexts, the package we are looking for is not in the importer's node_modules.
    // In that case it is either 2 levels (in cases of a scoped package) up or 1 level up.
    modulePaths: [
      path.resolve(importeeProjectPath, '..'),
      path.resolve(importeeProjectPath, '../..'),
    ],
  });

  if (!absolutePath) {
    return null;
  }

  return /** @type {PathRelativeFromProjectRoot} */ (
    absolutePath.replace(new RegExp(`^${toPosixPath(importeeProjectPath)}/?(.*)$`), './$1')
  );
}
