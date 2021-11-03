/**
 * Solution inspired by es-dev-server:
 * https://github.com/open-wc/open-wc/blob/master/packages/es-dev-server/src/utils/resolve-module-imports.js
 */

const pathLib = require('path');
const nodeResolvePackageJson = require('@rollup/plugin-node-resolve/package.json');
const createRollupResolve = require('@rollup/plugin-node-resolve');
const { LogService } = require('../services/LogService.js');

const fakePluginContext = {
  meta: {
    rollupVersion: nodeResolvePackageJson.peerDependencies.rollup,
  },
  /**
   * @param {any[]} msg
   */
  warn(...msg) {
    LogService.warn('[resolve-import-path]: ', ...msg);
  },
};

/**
 * @desc based on importee (in a statement "import {x} from '@lion/core'", "@lion/core" is an
 * importee), which can  be a bare module specifier, a filename without extension, or a folder
 * name without an extension.
 * @param {string} importee source like '@lion/core'
 * @param {string} importer importing file, like '/my/project/importing-file.js'
 * @returns {Promise<string|null>} the resolved file system path, like '/my/project/node_modules/@lion/core/index.js'
 */
async function resolveImportPath(importee, importer, opts = {}) {
  const rollupResolve = createRollupResolve({
    rootDir: pathLib.dirname(importer),
    // allow resolving polyfills for nodejs libs
    preferBuiltins: false,
    // extensions: ['.mjs', '.js', '.json', '.node'],
    ...opts,
  });

  const preserveSymlinks =
    (opts && opts.customResolveOptions && opts.customResolveOptions.preserveSymlinks) || false;
  rollupResolve.buildStart.call(fakePluginContext, { preserveSymlinks });

  const result = await rollupResolve.resolveId.call(fakePluginContext, importee, importer);
  if (!result || !result.id) {
    // throw new Error(`importee ${importee} not found in filesystem.`);
    LogService.warn(`importee ${importee} not found in filesystem for importer '${importer}'.`);
    return null;
  }
  return result.id;
}

module.exports = { resolveImportPath };
