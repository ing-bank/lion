/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
import nodeFs from 'fs';
import path from 'path';

import { toPosixPath } from './to-posix-path.js';
import { memoize } from './memoize.js';

/**
 * @typedef {nodeFs.Dirent & { path:string; parentPath:string }} DirentWithPath
 * @typedef {nodeFs} FsLike
 * @typedef {{
 *   onlyDirectories: boolean;
 *   suppressErrors: boolean;
 *   onlyFiles: boolean;
 *   absolute: boolean;
 *   extglob: boolean;
 *   ignore: string[];
 *   unique: boolean;
 *   deep: number;
 *   dot: boolean;
 *   cwd: string;
 *   fs: FsLike;
 * }} FastGlobtions
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

/**
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
function toUniqueArray(arr) {
  return Array.from(new Set(arr));
}

/**
 * @param {string} glob
 * @returns {boolean}
 */
function isRootGlob(glob) {
  return glob.startsWith('/') || glob.startsWith('!/') || Boolean(glob.match(/^([A-Z]:\\|\\\\)/));
}

/**
 * Makes sure cwd does not end with a slash
 * @param {string} str
 * @returns {string}
 */
function normalizeCwd(str) {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}

/**
 * @param {DirentWithPath} dirent
 * @param {{cwd:string}} cfg
 * @returns {string}
 */
function direntToLocalPath(dirent, { cwd }) {
  const parentPath = toPosixPath(dirent.parentPath || dirent.path);
  // Since `fs.glob` can return parent paths with files included, we need to strip the file part
  const parts = parentPath.split('/');
  const lastPart = parts[parts.length - 1];
  const isLastPartFile = !lastPart.startsWith('.') && lastPart.split('.').length > 1;
  const folder = isLastPartFile ? parts.slice(0, parts.length - 1).join('/') : parentPath;

  return toPosixPath(path.join(folder, dirent.name)).replace(
    new RegExp(`^${toPosixPath(cwd)}/`),
    '',
  );
}

/**
 * @param {{dirent:nodeFs.Dirent;relativeToCwdPath:string}[]} matchedEntries
 * @param {FastGlobtions} options
 * @returns {string[]}
 */
function postprocessOptions(matchedEntries, options) {
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
    filteredPaths = filteredPaths.map(f => {
      const isRootPath = isRootGlob(f);
      return isRootPath ? toPosixPath(f) : toPosixPath(path.join(options.cwd, f));
    });
    if (process.platform === 'win32') {
      const driveChar = path.win32.resolve(options.cwd).slice(0, 1).toUpperCase();
      filteredPaths = filteredPaths.map(f => `${driveChar}:${f}`);
    }
  }

  if (options.deep !== Infinity) {
    filteredPaths = filteredPaths.filter(f => f.split('/').length <= options.deep + 2);
  }

  const result = options.unique ? toUniqueArray(filteredPaths) : filteredPaths;
  return result.sort((a, b) => {
    const pathDiff = a.split('/').length - b.split('/').length;
    return pathDiff !== 0 ? pathDiff : a.localeCompare(b);
  });
}

const getStartPath = memoize(
  /**
   * @param {string} glob
   * @returns {string}
   */
  glob => {
    const reservedChars = ['?', '[', ']', '{', '}', ',', '.', '*'];
    const startPathParts = [];
    for (const part of glob.split('/')) {
      const hasReservedChar = reservedChars.some(reservedChar => part.includes(reservedChar));
      if (hasReservedChar) break;
      startPathParts.push(part);
    }
    return startPathParts.join('/');
  },
);

let isCacheEnabled = false;
let isExperimentalFsGlobEnabled = false;
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
      relativeToCwdPath: direntToLocalPath(dirent, { cwd: options.cwd }),
      dirent,
    }));

    return allDirEntsRelativeToCwd;
  },
);

/**
 * @param {string|string[]} globOrGlobs
 * @param {Partial<FastGlobtions> & {exclude?:Function; stats: boolean; cwd:string}} cfg
 * @returns {Promise<string[]|DirentWithPath[]>}
 */
async function nativeGlob(globOrGlobs, { fs, cwd, exclude, stats }) {
  // @ts-expect-error
  const asyncGenResult = await fs.promises.glob(globOrGlobs, {
    withFileTypes: true,
    cwd,
    ...(exclude ? { exclude } : {}),
  });
  const results = [];
  for await (const dirent of asyncGenResult) {
    if (dirent.name === '.' || dirent.isDirectory()) continue; // eslint-disable-line no-continue
    results.push(stats ? dirent : direntToLocalPath(dirent, { cwd }));
  }
  return results;
}

/**
 *
 * @param {{globs: string[]; ignoreGlobs: string[]; options: FastGlobtions; regularGlobs:string[]}} config
 * @returns {Promise<string[]|void>}
 */
async function getNativeGlobResults({ globs, options, ignoreGlobs, regularGlobs }) {
  const optionsNotSupportedByNativeGlob = ['onlyDirectories', 'dot'];
  const hasGlobWithFullPath = globs.some(isRootGlob);
  const doesConfigAllowNative =
    !optionsNotSupportedByNativeGlob.some(opt => options[opt]) && !hasGlobWithFullPath;

  if (!doesConfigAllowNative) return undefined;

  const negativeGlobs = [...ignoreGlobs, ...regularGlobs.filter(r => r.startsWith('!'))].map(r =>
    r.slice(1),
  );

  const negativeResults = negativeGlobs.length
    ? // @ts-ignore
      /** @type {string[]} */ (await nativeGlob(negativeGlobs, options))
    : [];
  const positiveGlobs = regularGlobs.filter(r => !r.startsWith('!'));

  const result = /** @type {DirentWithPath[]} */ (
    await nativeGlob(positiveGlobs, {
      cwd: /** @type {string} */ (options.cwd),
      fs: options.fs,
      stats: true,
      // we cannot use the exclude option here, because it's not working correctly
    })
  );

  const direntsFiltered = result.filter(
    dirent =>
      !negativeResults.includes(
        direntToLocalPath(dirent, { cwd: /** @type {string} */ (options.cwd) }),
      ),
  );

  return postprocessOptions(
    direntsFiltered.map(dirent => ({
      dirent,
      relativeToCwdPath: direntToLocalPath(dirent, { cwd: /** @type {string} */ (options.cwd) }),
    })),
    options,
  );
}

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
    ignore: [],
    // Add if needed: throwErrorOnBrokenSymbolicLink, markDirectories, objectMode, stats
    // https://github.com/mrmlnc/fast-glob?tab=readme-ov-file
    ...providedOptions,
  };

  options.cwd = normalizeCwd(options.cwd);

  if (!options.onlyFiles) {
    // This makes behavior aligned with globby
    options.onlyDirectories = true;
  }

  const regularGlobs = Array.isArray(globOrGlobs) ? globOrGlobs : [globOrGlobs];
  const ignoreGlobs = options.ignore.map((/** @type {string} */ g) =>
    g.startsWith('!') ? g : `!${g}`,
  );
  const globs = toUniqueArray([...regularGlobs, ...ignoreGlobs]);

  if (isExperimentalFsGlobEnabled && options.fs?.promises.glob) {
    const params = { regularGlobs, ignoreGlobs, options, globs };
    const nativeGlobResults = await getNativeGlobResults(params);
    if (nativeGlobResults) return nativeGlobResults;
  }

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
    const isRootPath = isRootGlob(startPath);
    const cwd = isRootPath ? '/' : options.cwd;
    const fullStartPath = path.join(cwd, startPath);
    try {
      const allDirEntsRelativeToCwd = await getAllDirentsRelativeToCwd(fullStartPath, {
        fs: options.fs,
        cwd,
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

  const res = postprocessOptions(matchedEntries, options);

  // It could happen the fs changes with the next call, so we clear the cache
  getAllDirentsRelativeToCwd.clearCache();
  getAllDirentsFromStartPath.clearCache();

  return res;
}

optimisedGlob.disableCache = () => {
  isCacheEnabled = false;
};

optimisedGlob.enableExperimentalFsGlob = () => {
  isExperimentalFsGlobEnabled = true;
};

optimisedGlob.disableExperimentalFsGlob = () => {
  isExperimentalFsGlobEnabled = false;
};
