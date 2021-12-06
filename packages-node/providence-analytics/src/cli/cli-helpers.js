/* eslint-disable no-shadow */
const pathLib = require('path');
const child_process = require('child_process'); // eslint-disable-line camelcase
const glob = require('glob');
const readPackageTree = require('../program/utils/read-package-tree-with-bower-support.js');
const { InputDataService } = require('../program/core/InputDataService.js');
const { LogService } = require('../program/core/LogService.js');
const { aForEach } = require('../program/utils/async-array-utils.js');
const { toPosixPath } = require('../program/utils/to-posix-path.js');

/**
 * @param {any[]} arr
 * @returns {any[]}
 */
function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

/**
 * @param {string} v
 * @returns {string[]}
 */
function csToArray(v) {
  return v.split(',').map(v => v.trim());
}

/**
 * @param {string} v like 'js,html'
 * @returns {string[]} like ['.js', '.html']
 */
function extensionsFromCs(v) {
  return csToArray(v).map(v => `.${v}`);
}

function setQueryMethod(m) {
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
function pathsArrayFromCs(t, cwd = process.cwd()) {
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
 * @param {object} eCfg external configuration. Usually providence.conf.js
 * @param {string} [cwd]
 * @returns {string[]|undefined}
 */
function pathsArrayFromCollectionName(
  name,
  collectionType = 'search-target',
  eCfg,
  cwd = process.cwd(),
) {
  let collection;
  if (collectionType === 'search-target') {
    collection = eCfg.searchTargetCollections;
  } else if (collectionType === 'reference') {
    collection = eCfg.referenceCollections;
  }
  if (collection && collection[name]) {
    return pathsArrayFromCs(collection[name].join(','), cwd);
  }
  return undefined;
}

/**
 * @param {string} processArgStr
 * @param {object} [opts]
 * @returns {Promise<{ code:string; number:string }>}
 */
function spawnProcess(processArgStr, opts) {
  const processArgs = processArgStr.split(' ');
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
 * @returns {string[]}
 */
function targetDefault() {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { name } = require(`${process.cwd()}/package.json`);
  if (name === 'providence') {
    return InputDataService.targetProjectPaths;
  }
  return [toPosixPath(process.cwd())];
}

/**
 * Returns all sub projects matching condition supplied in matchFn
 * @param {string[]} searchTargetPaths all search-target project paths
 * @param {string} matchPattern base for RegExp
 * @param {string[]} modes
 */
async function appendProjectDependencyPaths(rootPaths, matchPattern, modes = ['npm', 'bower']) {
  let matchFn;
  if (matchPattern) {
    if (matchPattern.startsWith('/') && matchPattern.endsWith('/')) {
      matchFn = (_, d) => {
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
  const depProjectPaths = [];
  for (const targetPath of rootPaths) {
    for (const mode of modes) {
      await readPackageTree(
        targetPath,
        matchFn,
        (err, tree) => {
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

async function installDeps(searchTargetPaths) {
  return aForEach(searchTargetPaths, async t => {
    const spawnConfig = { cwd: t };
    const extraOptions = { log: true };

    LogService.info(`Installing npm dependencies for ${pathLib.basename(t)}`);
    try {
      await spawnProcess('npm i --no-progress', spawnConfig, extraOptions);
    } catch (e) {
      LogService.error(e);
    }

    LogService.info(`Installing bower dependencies for ${pathLib.basename(t)}`);
    try {
      await spawnProcess(`bower i --production --force-latest`, spawnConfig, extraOptions);
    } catch (e) {
      LogService.error(e);
    }
  });
}

module.exports = {
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
