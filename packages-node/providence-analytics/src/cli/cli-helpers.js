/* eslint-disable no-shadow */
import pathLib from 'path';
import child_process from 'child_process'; // eslint-disable-line camelcase
import glob from 'glob';
import readPackageTree from '../program/utils/read-package-tree-with-bower-support.js';
import { LogService } from '../program/core/LogService.js';
import { toPosixPath } from '../program/utils/to-posix-path.js';

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
 *
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
 * @param {string} t
 * @returns {string[]|undefined}
 */
export function pathsArrayFromCs(t, cwd = process.cwd()) {
  if (!t) {
    return undefined;
  }

  return flatten(
    t.split(',').map(t => {
      if (t.startsWith('/')) {
        return t;
      }
      if (t.includes('*')) {
        if (!t.endsWith('/')) {
          // eslint-disable-next-line no-param-reassign
          t = `${t}/`;
        }
        return glob.sync(t, { cwd, absolute: true }).map(toPosixPath);
      }
      return toPosixPath(pathLib.resolve(cwd, t.trim()));
    }),
  );
}

/**
 * @param {string} name collection name found in eCfg
 * @param {'search-target'|'reference'} collectionType collection type
 * @param {{searchTargetCollections: {[repo:string]:string[]}; referenceCollections:{[repo:string]:string[]}}} [eCfg] external configuration. Usually providence.conf.js
 * @param {string} [cwd]
 * @returns {string[]|undefined}
 */
export function pathsArrayFromCollectionName(
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
  let matchFn;
  if (matchPattern) {
    if (matchPattern.startsWith('/') && matchPattern.endsWith('/')) {
      matchFn = (/** @type {any} */ _, /** @type {string} */ d) => {
        const reString = matchPattern.slice(1, -1);
        const result = new RegExp(reString).test(d);
        LogService.debug(`[appendProjectDependencyPaths]: /${reString}/.test(${d} => ${result})`);
        return result;
      };
    } else {
      LogService.error(
        `[appendProjectDependencyPaths] Please provide a matchPattern enclosed by '/'. Found: ${matchPattern}`,
      );
    }
  }
  /** @type {string[]} */
  const depProjectPaths = [];
  for (const targetPath of rootPaths) {
    for (const mode of modes) {
      await readPackageTree(
        targetPath,
        matchFn,
        (/** @type {string | undefined} */ err, /** @type {{ children: any[]; }} */ tree) => {
          if (err) {
            throw new Error(err);
          }
          const paths = tree.children.map(child => child.realpath);
          depProjectPaths.push(...paths);
        },
        mode,
      );
    }
  }
  // Write all data to {outputPath}/projectDeps.json
  // const projectDeps = {};
  // rootPaths.forEach(rootP => {
  //   depProjectPaths.filter(depP => depP.startsWith(rootP)).;
  // });

  return depProjectPaths.concat(rootPaths).map(toPosixPath);
}

/**
 * Will install all npm and bower deps, so an analysis can be performed on them as well.
 * Relevant when '--target-dependencies' is supplied.
 * @param {string[]} searchTargetPaths
 */
export async function installDeps(searchTargetPaths) {
  for (const targetPath of searchTargetPaths) {
    LogService.info(`Installing npm dependencies for ${pathLib.basename(targetPath)}`);
    try {
      await spawnProcess('npm i --no-progress', { cwd: targetPath });
    } catch (e) {
      // @ts-expect-error
      LogService.error(e);
    }

    LogService.info(`Installing bower dependencies for ${pathLib.basename(targetPath)}`);
    try {
      await spawnProcess(`bower i --production --force-latest`, { cwd: targetPath });
    } catch (e) {
      // @ts-expect-error
      LogService.error(e);
    }
  }
}

export const _cliHelpersModule = {
  csToArray,
  extensionsFromCs,
  setQueryMethod,
  pathsArrayFromCs,
  targetDefault,
  appendProjectDependencyPaths,
  spawnProcess,
  installDeps,
  pathsArrayFromCollectionName,
  flatten,
};
