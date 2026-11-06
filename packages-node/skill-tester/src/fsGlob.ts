import fs from 'node:fs';
import path from 'node:path';

/**
 * Glob files using native fs.promises.glob with support for non-glob patterns.
 * Returns results sorted alphabetically, matching globby behavior.
 *
 * @param {string | string[]} globOrGlobs - Glob pattern(s) or file path(s).
 *   Use '!' prefix for negation patterns (e.g., '!src/cli/**').
 * @param {object} [opts] - Options object
 * @param {string} [opts.cwd=process.cwd()] - Current working directory
 * @param {boolean} [opts.absolute=false] - Return absolute paths instead of relative
 * @param {boolean} [opts.onlyFiles=true] - Only return files, exclude directories
 * @returns {Promise<string[]>} Sorted array of matching file paths
 */
export default async function fsGlob(globOrGlobs, opts) {
  const cwd = opts?.cwd || process.cwd();
  const patterns = Array.isArray(globOrGlobs) ? globOrGlobs : [globOrGlobs];
  const useAbsolute = opts?.absolute;

  // Separate and classify patterns in a single pass
  /** @type {string[]} */
  const positiveGlobPatterns = [];
  /** @type {string[]} */
  const positiveNonGlobPatterns = [];
  /** @type {string[]} */
  const negatedGlobPatterns = [];
  /** @type {string[]} */
  const negatedNonGlobPatterns = [];

  /** @type {(pattern: string) => boolean} */
  const isGlobPattern = (pattern) => /[*?[\]{}]/.test(pattern);

  for (const pattern of patterns) {
    const isNegated = pattern.startsWith('!');
    const cleanPattern = isNegated ? pattern.slice(1) : pattern;

    if (isGlobPattern(cleanPattern)) {
      (isNegated ? negatedGlobPatterns : positiveGlobPatterns).push(
        cleanPattern,
      );
    } else {
      (isNegated ? negatedNonGlobPatterns : positiveNonGlobPatterns).push(
        cleanPattern,
      );
    }
  }

  /** @type {string[]} */
  const results = [];

  // Process glob patterns
  if (positiveGlobPatterns.length > 0) {
    for await (const filePath of fs.promises.glob(positiveGlobPatterns, {
      exclude: negatedGlobPatterns,
      cwd,
    })) {
      const fullPath = path.join(cwd, filePath);
      try {
        const stat = await fs.promises.stat(fullPath);
        if (stat.isFile() || (stat.isDirectory() && !opts?.onlyFiles)) {
          results.push(useAbsolute ? fullPath : filePath);
        }
      } catch {
        // File doesn't exist or is inaccessible, skip
      }
    }
  }

  // Process non-glob patterns using regular fs
  for (const filePath of positiveNonGlobPatterns) {
    try {
      const absolutePath = path.join(cwd, filePath);
      const stat = await fs.promises.stat(absolutePath);
      if (stat.isFile() || (stat.isDirectory() && !opts?.onlyFiles)) {
        results.push(useAbsolute ? absolutePath : filePath);
      }
    } catch {
      // File doesn't exist, skip
    }
  }

  // Subtract non-glob negated patterns from results
  if (negatedNonGlobPatterns.length > 0) {
    /** @type {Set<string>} */
    const negatedSet = new Set(negatedNonGlobPatterns);
    return results
      .filter((result) => {
        return !negatedSet.has(result);
      })
      .sort();
  }

  return results.sort();
}
