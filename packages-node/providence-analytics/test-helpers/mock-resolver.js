import { builtinModules } from 'module';
import path from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { nodeResolve } from '@rollup/plugin-node-resolve';

import { isRelativeSourcePath } from '#utils/relative-source-path.js';
import { LogService } from '#core/LogService.js';
import { toPosixPath } from '#utils/to-posix-path.js';
import { importResolver } from '#utils/resolve-import-path.js';

/**
 * @typedef {import('#types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('#types/index.js').SpecifierSource} SpecifierSource
 * @typedef {import('#utils/resolve-import-path.js').ResolveOptions} ResolveOptions
 */

/**
 * @param {string} importee
 */
function isBuiltin(importee) {
  return (
    !isRelativeSourcePath(importee) &&
    Boolean(builtinModules.find(m => importee.split('/')[0] === m))
  );
}

/**
 * Solution inspired by es-dev-server:
 * https://github.com/open-wc/open-wc/blob/master/packages/es-dev-server/src/utils/resolve-module-imports.js
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
 * The pure JS equivalent of the resolver in `#utils/resolve-import-path.js`, used by the suites
 * that mock the file system: mock-fs patches the JS `fs` module, which the native oxc-resolver
 * cannot see (it resolves in Rust against the real file system).
 *
 * This lives in the test helpers (and @rollup/plugin-node-resolve in devDependencies) on purpose:
 * production code should not depend on a rollup plugin to resolve imports.
 * @param {SpecifierSource} importee source like '@lion/core' or '../helpers/index.js'
 * @param {PathFromSystemRoot} importer importing file, like '/my/project/importing-file.js'
 * @param {ResolveOptions} [opts]
 * @returns {Promise<PathFromSystemRoot|null|'[node-builtin]'>} the resolved file system path, like '/my/project/node_modules/@lion/core/index.js'
 */
export async function resolveImportPathWithNodeResolve(importee, importer, opts = {}) {
  if (isBuiltin(importee)) {
    return '[node-builtin]';
  }

  const rollupResolve = nodeResolve({
    rootDir: path.dirname(importer),
    // allow resolving polyfills for nodejs libs
    preferBuiltins: false,
    ...opts,
  });

  const preserveSymlinks =
    (opts?.customResolveOptions && opts.customResolveOptions.preserveSymlinks) || false;
  // @ts-expect-error
  rollupResolve.buildStart.call(fakePluginContext, { preserveSymlinks });

  const resolveIdHook = rollupResolve.resolveId;
  const resolveIdHandler =
    typeof resolveIdHook === 'function' ? resolveIdHook : resolveIdHook?.handler;
  const pluginContext = /** @type {import('rollup').PluginContext} */ (
    /** @type {unknown} */ (fakePluginContext)
  );
  const result = await resolveIdHandler?.call(pluginContext, importee, importer, {
    isEntry: false,
  });

  if (!result || typeof result === 'string' || !result.id) {
    return null;
  }
  return /** @type {PathFromSystemRoot} */ (toPosixPath(result.id));
}

/**
 * Installs the JS resolver for suites that mock the file system. Call this again after
 * `useRealFsResolver()`, or the suites that run later resolve against the real file system and miss
 * every mocked project.
 */
export function useMockFsResolver() {
  importResolver.setResolver(resolveImportPathWithNodeResolve);
}

/**
 * Installs the production (native) resolver, which only sees the real file system.
 */
export function useRealFsResolver() {
  importResolver.restoreResolver();
}

// Runs on module load, before any test activates mock-fs, so the native oxc-resolver is swapped
// out for the whole suite. Individual tests can call `useRealFsResolver()` to assert the oxc path
// against the real file system, and must call `useMockFsResolver()` again afterwards.
useMockFsResolver();
