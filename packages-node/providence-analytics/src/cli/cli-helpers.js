/* eslint-disable no-shadow */
import child_process from 'child_process'; // eslint-disable-line camelcase
import path from 'path';

import { optimisedGlob } from '../program/utils/optimised-glob.js';
import { toPosixPath } from '../program/utils/to-posix-path.js';
import { LogService } from '../program/core/LogService.js';
import { fsAdapter } from '../program/utils/fs-adapter.js';

/**
 * @param {any[]} arr
 * @returns {any[]}
 */
export function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

/**
 * @param {string} v
 * @returns {string[]}
 */
export function csToArray(v) {
  return v.split(',').map(v => v.trim());
}

/**
 * @param {string} v like 'js,html'
 * @returns {string[]} like ['.js', '.html']
 */
export function extensionsFromCs(v) {
  return csToArray(v).map(v => `.${v}`);
}

/**
 * @param {*} m
 * @returns
 */
export function setQueryMethod(m) {
  const allowedMehods = ['grep', 'ast'];
  if (allowedMehods.includes(m)) {
    return m;
  }
  LogService.error(`Please provide one of the following methods: ${allowedMehods.join(', ')}`);
  return undefined;
}

/**
 * @param {string} targets
 * @returns {Promise<string[]|undefined>}
 */
export async function pathsArrayFromCs(targets, cwd = process.cwd()) {
  if (!targets) return undefined;

  const resultPaths = [];

  for (const t of targets.split(',')) {
    if (t.startsWith('/')) {
      resultPaths.push(t);
      continue; // eslint-disable-line no-continue
    }
    if (t.includes('*')) {
      const x = (await optimisedGlob(t, { cwd, absolute: true, onlyFiles: false })).map(
        toPosixPath,
      );
      resultPaths.push(...x);
      continue; // eslint-disable-line no-continue
    }
    resultPaths.push(toPosixPath(path.resolve(cwd, t.trim())));
  }
  return resultPaths;
}

/**
 * @param {string} name collection name found in eCfg
 * @param {'search-target'|'reference'} collectionType collection type
 * @param {{searchTargetCollections: {[repo:string]:string[]}; referenceCollections:{[repo:string]:string[]}}} [eCfg] external configuration. Usually providence.conf.js
 * @param {string} [cwd]
 * @returns {Promise<string[]|undefined>}
 */
export async function pathsArrayFromCollectionName(
  name,
  collectionType = 'search-target',
  eCfg = undefined,
  cwd = process.cwd(),
) {
  let collection;
  if (collectionType === 'search-target') {
    collection = eCfg?.searchTargetCollections;
  } else if (collectionType === 'reference') {
    collection = eCfg?.referenceCollections;
  }
  if (collection?.[name]) {
    return pathsArrayFromCs(collection[name].join(','), cwd);
  }
  return undefined;
}

/**
 * @param {string} processArgStr
 * @param {object} [opts]
 * @returns {Promise<{ code:number; output:string }>}
 * @throws {Error}
 */
export function spawnProcess(processArgStr, opts) {
  const processArgs = processArgStr.split(' ');
  // eslint-disable-next-line camelcase
  const proc = child_process.spawn(processArgs[0], processArgs.slice(1), opts);
  /** @type {string} */
  let output;
  proc.stdout.on('data', data => {
    output += data;
    LogService.debug(data.toString());
  });
  return new Promise((resolve, reject) => {
    proc.stderr.on('data', data => {
      LogService.error(data.toString());
      reject(data.toString());
    });
    proc.on('close', code => {
      resolve({ code, output });
    });
  });
}

/**
 * When providence is called from the root of a repo and no target is provided,
 * this will provide the default fallback (the project itself)
 * @param {string} cwd
 * @returns {string[]}
 */
export function targetDefault(cwd) {
  return [toPosixPath(cwd)];
}

/**
 * @param {string} targetPath
 * @param {((s:string) => boolean)|null} matcher
 * @param {'npm'|'bower'} [mode]
 */
async function readPackageTree(targetPath, matcher, mode) {
  const folderName = mode === 'npm' ? 'node_modules' : 'bower_components';
  const potentialPaths = await optimisedGlob(`${folderName}/**/*`, {
    onlyDirectories: true,
    fs: fsAdapter.fs,
    cwd: targetPath,
    absolute: true,
  });
  const matchingPaths = potentialPaths.filter(potentialPath => {
    // Only dirs that are direct children of node_modules. So '**/node_modules/a' will match, but '**/node_modules/a/b' won't
    const [, projectName] =
      toPosixPath(potentialPath).match(new RegExp(`^.*/${folderName}/([^/]*)$`)) || [];
    return matcher ? matcher(projectName) : true;
  });
  return matchingPaths;
}

/**
 * @param {string|undefined} matchPattern
 */
function getMatcher(matchPattern) {
  if (!matchPattern) return null;

  const isValidMatchPattern = matchPattern.startsWith('/') && matchPattern.endsWith('/');
  if (!isValidMatchPattern) {
    LogService.error(
      `[appendProjectDependencyPaths] Please provide a matchPattern enclosed by '/'. Found: ${matchPattern}`,
    );
    return null;
  }

  return (/** @type {string} */ d) => {
    const reString = matchPattern.slice(1, -1);
    const result = new RegExp(reString).test(d);
    LogService.debug(`[appendProjectDependencyPaths]: /${reString}/.test(${d} => ${result})`);
    return result;
  };
}
/**
 * Returns all sub projects matching condition supplied in matchFn
 * @param {string[]} rootPaths all search-target project paths
 * @param {string} [matchPattern] base for RegExp
 * @param {('npm'|'bower')[]} [modes]
 */
export async function appendProjectDependencyPaths(
  rootPaths,
  matchPattern,
  modes = ['npm', 'bower'],
) {
  const matcher = getMatcher(matchPattern);

  /** @type {string[]} */
  const depProjectPaths = [];
  for (const targetPath of rootPaths) {
    for (const mode of modes) {
      depProjectPaths.push(...(await readPackageTree(targetPath, matcher, mode)));
    }
  }

  return depProjectPaths.concat(rootPaths).map(toPosixPath);
}

export const _cliHelpersModule = {
  appendProjectDependencyPaths,
  pathsArrayFromCollectionName,
  extensionsFromCs,
  pathsArrayFromCs,
  setQueryMethod,
  targetDefault,
  spawnProcess,
  csToArray,
  flatten,
};
