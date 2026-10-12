import nodeFs from 'fs';
import path from 'path';

/**
 * @typedef {object} FsGlobOptions
 * @property {string} [cwd=process.cwd()] current working directory
 * @property {boolean} [absolute=false] return absolute paths instead of paths relative to cwd
 * @property {boolean} [onlyFiles=true] only return files, exclude directories
 * @property {boolean} [onlyDirectories=false] only return directories, exclude files. Takes
 * precedence over `onlyFiles` when set
 * @property {typeof nodeFs} [fs] fs implementation to use (e.g. a mocked fs). Note that the
 * actual glob traversal always runs against the real fs bindings (`fs.promises.glob` isn't
 * pluggable), this option only affects the `stat` calls used to filter/resolve results
 */

/**
 * @param {string} filePath
 * @returns {string}
 */
function toForwardSlashes(filePath) {
  return filePath.replace(/\\/g, '/');
}

/**
 * @param {string} pattern
 * @returns {boolean}
 */
function isGlobPattern(pattern) {
  return /[*?[\]{}]/.test(pattern);
}

/**
 * @param {{isFile: () => boolean; isDirectory: () => boolean;}} stat
 * @param {FsGlobOptions} [opts]
 * @returns {boolean}
 */
function matchesTypeFilter(stat, opts) {
  if (opts?.onlyDirectories) {
    return stat.isDirectory();
  }
  return stat.isFile() || (stat.isDirectory() && opts?.onlyFiles === false);
}

/**
 * Glob files using native `fs.promises.glob`, with support for non-glob (literal) patterns and
 * negation patterns. A drop-in replacement for the subset of `globby` used by providence-analytics,
 * without adding a dependency.
 * @param {string|string[]} globOrGlobs glob pattern(s) or file path(s). Use a '!' prefix for
 * negation patterns (e.g. '!src/cli/**')
 * @param {FsGlobOptions} [opts]
 * @returns {Promise<string[]>} alphabetically sorted array of matching paths
 */
export async function fsGlob(globOrGlobs, opts) {
  const cwd = opts?.cwd || process.cwd();
  const fs = opts?.fs || nodeFs;
  const patterns = Array.isArray(globOrGlobs) ? globOrGlobs : [globOrGlobs];

  /** @type {string[]} */
  const positiveGlobPatterns = [];
  /** @type {string[]} */
  const positiveNonGlobPatterns = [];
  /** @type {string[]} */
  const negatedGlobPatterns = [];
  /** @type {string[]} */
  const negatedNonGlobPatterns = [];

  for (const pattern of patterns) {
    const isNegated = pattern.startsWith('!');
    const cleanPattern = isNegated ? pattern.slice(1) : pattern;
    if (isGlobPattern(cleanPattern)) {
      (isNegated ? negatedGlobPatterns : positiveGlobPatterns).push(cleanPattern);
    } else {
      (isNegated ? negatedNonGlobPatterns : positiveNonGlobPatterns).push(cleanPattern);
    }
  }

  /** @type {string[]} */
  const results = [];

  if (positiveGlobPatterns.length) {
    // `fs.promises.glob` can't be swapped for a custom fs implementation, but mock-fs style
    // mocking (which patches the real fs bindings in place) is transparently supported
    for await (const filePath of nodeFs.promises.glob(positiveGlobPatterns, {
      exclude: negatedGlobPatterns,
      cwd,
    })) {
      const fullPath = path.join(cwd, filePath);
      try {
        const stat = await fs.promises.stat(fullPath);
        if (matchesTypeFilter(stat, opts)) {
          results.push(toForwardSlashes(opts?.absolute ? fullPath : filePath));
        }
      } catch {
        // file doesn't exist or is inaccessible, skip
      }
    }
  }

  for (const filePath of positiveNonGlobPatterns) {
    try {
      const fullPath = path.join(cwd, filePath);
      const stat = await fs.promises.stat(fullPath);
      if (matchesTypeFilter(stat, opts)) {
        results.push(toForwardSlashes(opts?.absolute ? fullPath : filePath));
      }
    } catch {
      // file doesn't exist, skip
    }
  }

  if (negatedNonGlobPatterns.length) {
    const negatedSet = new Set(negatedNonGlobPatterns.map(toForwardSlashes));
    return results.filter(result => !negatedSet.has(result)).sort();
  }

  return results.sort();
}
