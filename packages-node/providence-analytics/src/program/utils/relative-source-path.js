import { toPosixPath } from './to-posix-path.js';

/**
 * Determines for a source path of an import- or export specifier, whether
 * it is relative (an internal import/export) or absolute (external)
 * - relative: './helpers', './helpers.js', '../helpers.js'
 * - not relative: '@open-wc/helpers', 'project-x/helpers'
 * @param {string} source source path of an import- or export specifier
 * @returns {boolean}
 */
export function isRelativeSourcePath(source) {
  return source.startsWith('.');
}

/**
 * Simple helper te make code a bit more readable.
 * - from '/path/to/repo/my/file.js';
 * - to './my/file.js'
 * @param {string} fullPath like '/path/to/repo/my/file.js'
 * @param {string} rootPath like '/path/to/repo'
 */
export function toRelativeSourcePath(fullPath, rootPath) {
  return toPosixPath(fullPath).replace(toPosixPath(rootPath), '.');
}
