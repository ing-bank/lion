import { builtinModules } from 'module';
import path from 'path';

import { ResolverFactory } from 'oxc-resolver';

import { isRelativeSourcePath } from '#utils/relative-source-path.js';
import { toPosixPath } from '#utils/to-posix-path.js';
import { memoize } from '#utils/memoize.js';

/**
 * @typedef {import('#types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('#types/index.js').SpecifierSource} SpecifierSource
 * @typedef {{customResolveOptions?: {preserveSymlinks:boolean}; modulePaths?: string[]}} ResolveOptions
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

const baseResolver = new ResolverFactory({
  // The rules the previous @rollup/plugin-node-resolve setup used: honour `exports` maps with the
  // ESM conditions, prefer the `module` entry over `main`, and guess `.mjs`/`.js`/`.json`.
  extensions: ['.js', '.mjs', '.json'],
  conditionNames: ['import', 'module', 'default'],
  mainFields: ['module', 'main'],
});

/**
 * @param {ResolveOptions} opts
 */
function getResolver(opts) {
  const { modulePaths, customResolveOptions } = opts;
  if (!modulePaths && !customResolveOptions) {
    return baseResolver;
  }
  return baseResolver.cloneWithOptions({
    ...(modulePaths ? { modules: modulePaths } : {}),
    ...(customResolveOptions ? { symlinks: !customResolveOptions.preserveSymlinks } : {}),
  });
}

/**
 * Based on importee (in a statement "import {x} from '@lion/core'", "@lion/core" is an
 * importee), which can be a bare module specifier, a filename without extension, or a folder
 * name without an extension.
 * @param {SpecifierSource} importee source like '@lion/core' or '../helpers/index.js'
 * @param {PathFromSystemRoot} importer importing file, like '/my/project/importing-file.js'
 * @param {ResolveOptions} [opts]
 * @returns {Promise<PathFromSystemRoot|null|'[node-builtin]'>} the resolved file system path, like '/my/project/node_modules/@lion/core/index.js'
 */
async function resolveWithOxcResolver(importee, importer, opts = {}) {
  if (isBuiltin(importee)) {
    return '[node-builtin]';
  }

  // oxc-resolver resolves from a directory, not from the importing file.
  const result = getResolver(opts).sync(path.dirname(importer), importee);
  if (!result || result.error || !result.path) {
    return null;
  }
  return /** @type {PathFromSystemRoot} */ (toPosixPath(result.path));
}

/**
 * Provides the resolver that turns an import specifier into a file system path.
 *
 * `oxc-resolver` is the default: the rules and the outcome are the ones the previous
 * @rollup/plugin-node-resolve setup produced, at a fraction of the cost (a fresh plugin instance
 * per call versus a reused native resolver). It is native and reads the real file system only, so
 * the suites that mock the file system (mock-fs) swap in a JS resolver via `setResolver` - the same
 * shape as `fsAdapter` swapping the file system. Those suites therefore exercise the JS resolver;
 * resolve-import-path.test.js asserts the oxc path itself.
 */
class ImportResolver {
  constructor() {
    /** @type {typeof resolveWithOxcResolver} */
    this.resolve = resolveWithOxcResolver;
  }

  /**
   * Call this for mocking or compatibility with non-node environments.
   * @param {typeof resolveWithOxcResolver} resolve
   */
  setResolver(resolve) {
    this.resolve = resolve;
  }

  /**
   * When done testing, call this to restore the default resolver.
   */
  restoreResolver() {
    this.resolve = resolveWithOxcResolver;
  }
}

export const importResolver = new ImportResolver();

/**
 * @param {SpecifierSource} importee
 * @param {PathFromSystemRoot} importer
 * @param {ResolveOptions} [opts]
 */
async function resolveImportPathFn(importee, importer, opts) {
  return importResolver.resolve(importee, importer, opts);
}

export const resolveImportPath = memoize(resolveImportPathFn);
