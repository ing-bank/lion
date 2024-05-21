/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
import nodeFs from 'fs';
import path from 'path';

import { toPosixPath } from './to-posix-path.js';
import { memoize } from './memoize.js';

/**
 * @typedef {nodeFs} FsLike
 * @typedef {nodeFs.Dirent & {path:string;parentPath:string}} DirentWithPath
 * @typedef {{onlyDirectories:boolean;onlyFiles:boolean;deep:number;suppressErrors:boolean;fs: FsLike;cwd:string;absolute:boolean;extglob:boolean;}} FastGlobtions
 */

const [nodeMajor] = process.versions.node.split('.').map(Number);

export const parseGlobToRegex = memoize(
  /**
   * @param {string} glob
   * @param {object} [providedOpts]
   * @param {boolean} [providedOpts.globstar=true] if true, '/foo/*' => '^\/foo\/[^/]*$' (not allowing folders inside *), else '/foo/*' => '^\/foo\/.*$'
   * @param {boolean} [providedOpts.extglob=true] if true, supports so called "extended" globs (like bash) and single character matching, matching ranges of characters, group matching etc.
   * @returns {RegExp}
   */
  (glob, providedOpts) => {
    if (typeof glob !== 'string') throw new TypeError('Expected a string');

    const options = {
      globstar: true,
      extglob: true,
      ...providedOpts,
    };

    let regexResultStr = '';
    let isInGroup = false;
    let currentChar;

    for (let i = 0; i < glob.length; i += 1) {
      currentChar = glob[i];

      const charsToEscape = ['/', '$', '^', '+', '.', '(', ')', '=', '!', '|'];
      if (charsToEscape.includes(currentChar)) {
        regexResultStr += `\\${currentChar}`;
        continue; // eslint-disable-line no-continue
      }

      if (options.extglob) {
        if (currentChar === '?') {
          regexResultStr += '.';
          continue; // eslint-disable-line no-continue
        }
        if (['[', ']'].includes(currentChar)) {
          regexResultStr += currentChar;
          continue; // eslint-disable-line no-continue
        }
        if (currentChar === '{') {
          isInGroup = true;
          regexResultStr += '(';
          continue; // eslint-disable-line no-continue
        }
        if (currentChar === '}') {
          isInGroup = false;
          regexResultStr += ')';
          continue; // eslint-disable-line no-continue
        }
      }

      if (currentChar === ',') {
        if (isInGroup) {
          regexResultStr += '|';
          continue; // eslint-disable-line no-continue
        }
        regexResultStr += `\\${currentChar}`;
        continue; // eslint-disable-line no-continue
      }

      if (currentChar === '*') {
        const prevChar = glob[i - 1];
        let isMultiStar = false;
        while (glob[i + 1] === '*') {
          isMultiStar = true;
          i += 1;
        }
        const nextChar = glob[i + 1];
        if (!options.globstar) {
          // Treat any number of "*" as one
          regexResultStr += '.*';
        } else {
          const isGlobstarSegment =
            isMultiStar &&
            ['/', undefined].includes(prevChar) &&
            ['/', undefined].includes(nextChar);
          if (isGlobstarSegment) {
            // Match zero or more path segments
            regexResultStr += '((?:[^/]*(?:/|$))*)';
            // Move over the "/"
            i += 1;
          } else {
            // Only match one path segment
            regexResultStr += '([^/]*)';
          }
        }
        continue; // eslint-disable-line no-continue
      }
      regexResultStr += currentChar;
    }

    return new RegExp(`^${regexResultStr}$`);
  },
);

const getStartPath = memoize(
  /**
   * @param {string} glob
   */
  glob => {
    const reservedChars = ['?', '[', ']', '{', '}', ',', '.', '*'];
    let hasFoundReservedChar = false;
    return glob
      .split('/')
      .map(part => {
        if (hasFoundReservedChar) return undefined;
        hasFoundReservedChar = reservedChars.some(reservedChar => part.includes(reservedChar));
        return hasFoundReservedChar ? undefined : part;
      })
      .filter(Boolean)
      .join('/');
  },
);

let isCacheEnabled = false;
/** @type {{[path:string]:DirentWithPath[]}} */
const cache = {};

const getAllDirentsFromStartPath = memoize(
  /**
   * @param {string} startPath
   * @param {{fs?:FsLike, dirents?:DirentWithPath[]}} providedOptions
   * @returns {Promise<DirentWithPath[]>}
   */
  async (startPath, { fs = /** @type {* & FsLike} */ (nodeFs), dirents = [] } = {}) => {
    if (isCacheEnabled && cache[startPath]) return cache[startPath];

    // Older node doesn't support recursive option
    if (nodeMajor < 18) {
      /** @type {nodeFs.Dirent[]} */
      const direntsForLvl = await fs.promises.readdir(startPath, { withFileTypes: true });
      for (const _dirent of direntsForLvl) {
        const dirent = /** @type {DirentWithPath} */ (_dirent);
        dirent.parentPath = dirent.path = startPath; // eslint-disable-line no-multi-assign
        dirents.push(/** @type {DirentWithPath} */ (dirent));

        if (dirent.isDirectory()) {
          const subDir = path.join(startPath, dirent.name);
          await getAllDirentsFromStartPath(subDir, { fs, dirents });
        }
      }
      return dirents;
    }

    dirents.push(
      // @ts-expect-error
      ...(await fs.promises.readdir(startPath, { withFileTypes: true, recursive: true })),
    );
    cache[startPath] = dirents;
    return dirents;
  },
);

const getAllDirentsRelativeToCwd = memoize(
  /**
   * @param {string} fullStartPath
   * @param {{fs?:FsLike, cwd:string}} options
   * @returns {Promise<{relativeToCwdPath:string;dirent:DirentWithPath}[]>}
   */
  async (fullStartPath, options) => {
    const allDirentsRelativeToStartPath = await getAllDirentsFromStartPath(fullStartPath, {
      fs: options.fs,
    });

    const allDirEntsRelativeToCwd = allDirentsRelativeToStartPath.map(dirent => ({
      relativeToCwdPath: toPosixPath(
        path.join(dirent.parentPath || dirent.path, dirent.name),
      ).replace(`${toPosixPath(options.cwd)}/`, ''),
      dirent,
    }));
    return allDirEntsRelativeToCwd;
  },
);

/**
 * Lightweight glob implementation.
 * It's a drop-in replacement for globby, but it's faster, a few hundred lines of code and has no dependencies.
 * @param {string|string[]} globOrGlobs
 * @param {Partial<FastGlobtions>} providedOptions
 * @returns {Promise<string[]>}
 */
export async function optimisedGlob(globOrGlobs, providedOptions = {}) {
  const options = {
    fs: /** @type {* & FsLike} */ (nodeFs),
    onlyDirectories: false,
    suppressErrors: true,
    cwd: process.cwd(),
    absolute: false,
    onlyFiles: true,
    deep: Infinity,
    globstar: true,
    extglob: true,
    unique: true,
    sync: false,
    dot: false,
    // TODO: ignore, throwErrorOnBrokenSymbolicLink, markDirectories, objectMode, onlyDirectories, onlyFiles, stats
    // https://github.com/mrmlnc/fast-glob?tab=readme-ov-file
    ...providedOptions,
  };

  if (!options.onlyFiles) {
    // This makes behavior aligned with globby
    options.onlyDirectories = true;
  }

  const globs = Array.isArray(globOrGlobs) ? Array.from(new Set(globOrGlobs)) : [globOrGlobs];

  /** @type {RegExp[]} */
  const matchRegexesNegative = [];
  /** @type {RegExp[]} */
  const matchRegexes = [];
  /** @type {{dirent:nodeFs.Dirent;relativeToCwdPath:string}[]} */
  const globEntries = [];

  for (const glob of globs) {
    const isNegative = glob.startsWith('!');

    // Relative paths like './my/folder/**/*.js' are changed to 'my/folder/**/*.js'
    const globNormalized = glob.replace(/^\.\//g, '').slice(isNegative ? 1 : 0);

    const regexForGlob = parseGlobToRegex(globNormalized, {
      globstar: options.globstar,
      extglob: options.extglob,
    });
    if (isNegative) {
      matchRegexesNegative.push(regexForGlob);
    } else {
      matchRegexes.push(regexForGlob);
    }

    // Search for the "deepest" starting point in the filesystem that we can use to search the fs
    const startPath = getStartPath(globNormalized);
    const fullStartPath = path.join(options.cwd, startPath);

    try {
      const allDirEntsRelativeToCwd = await getAllDirentsRelativeToCwd(fullStartPath, {
        cwd: options.cwd,
        fs: options.fs,
      });

      globEntries.push(...allDirEntsRelativeToCwd);
    } catch (e) {
      if (!options.suppressErrors) {
        throw e;
      }
    }
  }

  // TODO: for perf, combine options checks instead of doing multiple filters and maps
  const matchedEntries = globEntries.filter(
    globEntry =>
      matchRegexes.some(globRe => globRe.test(globEntry.relativeToCwdPath)) &&
      !matchRegexesNegative.some(globReNeg => globReNeg.test(globEntry.relativeToCwdPath)),
  );

  const allFileOrDirectoryEntries = matchedEntries.filter(({ dirent }) =>
    options.onlyDirectories ? dirent.isDirectory() : dirent.isFile(),
  );

  let filteredPaths = allFileOrDirectoryEntries.map(({ relativeToCwdPath }) => relativeToCwdPath);

  if (!options.dot) {
    filteredPaths = filteredPaths.filter(
      f => !f.split('/').some(folderOrFile => folderOrFile.startsWith('.')),
    );
  }

  if (options.absolute) {
    filteredPaths = filteredPaths.map(f => toPosixPath(path.join(options.cwd, f)));

    if (process.platform === 'win32') {
      const driveChar = path.win32.resolve(options.cwd).slice(0, 1).toUpperCase();
      filteredPaths = filteredPaths.map(f => `${driveChar}:${f}`);
    }
  }

  if (options.deep !== Infinity) {
    filteredPaths = filteredPaths.filter(f => f.split('/').length <= options.deep + 2);
  }

  const result = options.unique ? Array.from(new Set(filteredPaths)) : filteredPaths;

  const res = result.sort((a, b) => {
    const pathDiff = a.split('/').length - b.split('/').length;
    return pathDiff !== 0 ? pathDiff : a.localeCompare(b);
  });

  // It could happen the fs changes with the next call, so we clear the cache
  getAllDirentsRelativeToCwd.clearCache();
  getAllDirentsFromStartPath.clearCache();

  return res;
}

optimisedGlob.disableCache = () => {
  isCacheEnabled = false;
};
