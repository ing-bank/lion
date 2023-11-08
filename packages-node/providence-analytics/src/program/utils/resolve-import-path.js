import { isBuiltin } from 'module';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { LogService } from '../core/LogService.js';
import { memoize } from './memoize.js';
import { toPosixPath } from './to-posix-path.js';

/**
 * Solution inspired by es-dev-server:
 * https://github.com/open-wc/open-wc/blob/master/packages/es-dev-server/src/utils/resolve-module-imports.js
 */

/**
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').SpecifierSource} SpecifierSource
 */

const fakePluginContext = {
  meta: {
    // rollupVersion needed in plugin context => nodeResolvePackageJson.peerDependencies.rollup
    rollupVersion: '^2.42.0',
  },
  resolve: () => {},
  /**
   * @param {string[]} msg
   */
  warn(...msg) {
    LogService.warn('[resolve-import-path]: ', ...msg);
  },
};

/**
 * Based on importee (in a statement "import {x} from '@lion/core'", "@lion/core" is an
 * importee), which can be a bare module specifier, a filename without extension, or a folder
 * name without an extension.
 * @param {SpecifierSource} importee source like '@lion/core' or '../helpers/index.js'
 * @param {PathFromSystemRoot} importer importing file, like '/my/project/importing-file.js'
 * @param {{customResolveOptions?: {preserveSymlinks:boolean}}} [opts] nodeResolve options
 * @returns {Promise<PathFromSystemRoot|null|'[node-builtin]'>} the resolved file system path, like '/my/project/node_modules/@lion/core/index.js'
 */
async function resolveImportPathFn(importee, importer, opts) {
  if (isBuiltin(importee)) {
    return '[node-builtin]';
  }

  const rollupResolve = nodeResolve({
    rootDir: path.dirname(importer),
    // allow resolving polyfills for nodejs libs
    preferBuiltins: false,
    // extensions: ['.mjs', '.js', '.json', '.node'],
    ...(opts || {}),
  });

  const preserveSymlinks =
    (opts?.customResolveOptions && opts.customResolveOptions.preserveSymlinks) || false;
  // @ts-expect-error
  rollupResolve.buildStart.call(fakePluginContext, { preserveSymlinks });

  // @ts-expect-error
  const result = await rollupResolve.resolveId.handler.call(
    fakePluginContext,
    importee,
    importer,
    {},
  );

  if (!result?.id) {
    // LogService.warn(
    //   `[resolveImportPath] importee ${importee} not found in filesystem for importer '${importer}'.`,
    // );
    return null;
  }
  return toPosixPath(result.id);
}

export const resolveImportPath = memoize(resolveImportPathFn);
