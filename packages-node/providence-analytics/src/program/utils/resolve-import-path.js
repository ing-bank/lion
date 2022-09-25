/**
 * Solution inspired by es-dev-server:
 * https://github.com/open-wc/open-wc/blob/master/packages/es-dev-server/src/utils/resolve-module-imports.js
 */

/**
 * @typedef {import('../types/core/core').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../types/core/core').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../types/core/core').SpecifierSource} SpecifierSource
 */

const pathLib = require('path');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { LogService } = require('../services/LogService.js');
const { memoize } = require('./memoize.js');
const { toPosixPath } = require('./to-posix-path.js');

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

async function resolveImportPath(importee, importer, opts = {}) {
  const rollupResolve = nodeResolve({
    rootDir: pathLib.dirname(importer),
    // allow resolving polyfills for nodejs libs
    preferBuiltins: false,
    // extensions: ['.mjs', '.js', '.json', '.node'],
    ...opts,
  });

  const preserveSymlinks =
    (opts && opts.customResolveOptions && opts.customResolveOptions.preserveSymlinks) || false;
  // @ts-ignore
  rollupResolve.buildStart.call(fakePluginContext, { preserveSymlinks });

  // @ts-ignore
  const result = await rollupResolve.resolveId.call(fakePluginContext, importee, importer, {});
  // @ts-ignore
  if (!result || !result.id) {
    // throw new Error(`importee ${importee} not found in filesystem.`);
    LogService.warn(`importee ${importee} not found in filesystem for importer '${importer}'.`);
    return null;
  }
  // @ts-ignore
  return toPosixPath(result.id);
}

/**
 * Based on importee (in a statement "import {x} from '@lion/core'", "@lion/core" is an
 * importee), which can be a bare module specifier, a filename without extension, or a folder
 * name without an extension.
 * @param {SpecifierSource} importee source like '@lion/core' or '../helpers/index.js'
 * @param {PathFromSystemRoot} importer importing file, like '/my/project/importing-file.js'
 * @param {{customResolveOptions?: {preserveSymlinks:boolean}}} [opts] nodeResolve options
 * @returns {Promise<PathFromSystemRoot|null>} the resolved file system path, like '/my/project/node_modules/@lion/core/index.js'
 */
const resolveImportPathMemoized = memoize(resolveImportPath);

module.exports = { resolveImportPath: resolveImportPathMemoized };
