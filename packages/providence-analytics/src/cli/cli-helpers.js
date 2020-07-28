/* eslint-disable no-shadow */
const pathLib = require('path');
const child_process = require('child_process'); // eslint-disable-line camelcase
const glob = require('glob');
const readPackageTree = require('../program/utils/read-package-tree-with-bower-support.js');
const { InputDataService } = require('../program/services/InputDataService.js');
const { LogService } = require('../program/services/LogService.js');
const { aForEach } = require('../program/utils/async-array-utils.js');

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

function csToArray(v) {
  return v.split(',').map(v => v.trim());
}

function extensionsFromCs(v) {
  return csToArray(v).map(v => `.${v}`);
}

function setQueryMethod(m) {
  const allowedMehods = ['grep', 'ast'];
  if (allowedMehods.includes(m)) {
    return m;
  }
  // eslint-disable-next-line no-console
  LogService.error(`Please provide one of the following methods: ${allowedMehods.join(', ')}`);
  return undefined;
}

/**
 * @returns {string[]}
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
        return glob.sync(t, { cwd, absolute: true });
      }
      return pathLib.resolve(cwd, t.trim());
    }),
  );
}

/**
 * @param {string} name collection name found in eCfg
 * @param {'search-target'|'reference'} [colType='search-targets'] collection type
 * @param {object} eCfg external configuration. Usually providence.conf.js
 * @returns {string[]}
 */
function pathsArrayFromCollectionName(name, colType = 'search-target', eCfg, cwd) {
  let collection;
  if (colType === 'search-target') {
    collection = eCfg.searchTargetCollections;
  } else if (colType === 'reference') {
    collection = eCfg.referenceCollections;
  }
  if (collection && collection[name]) {
    return pathsArrayFromCs(collection[name].join(','), cwd);
  }
  return undefined;
}

function spawnProcess(processArgStr, opts) {
  const processArgs = processArgStr.split(' ');
  const proc = child_process.spawn(processArgs[0], processArgs.slice(1), opts);
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
    return InputDataService.getTargetProjectPaths();
  }
  return [process.cwd()];
}

/**
 * @desc Returns all sub projects matching condition supplied in matchFn
 * @param {string[]} searchTargetPaths all search-target project paths
 * @param {string} matchPattern base for RegExp
 * @param {string[]} modes
 */
async function appendProjectDependencyPaths(rootPaths, matchPattern, modes = ['npm', 'bower']) {
  let matchFn;
  if (matchPattern) {
    matchFn = (_, d) => new RegExp(matchPattern).test(d);
  }
  const depProjectPaths = [];
  await aForEach(rootPaths, async targetPath => {
    await aForEach(modes, async mode => {
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
    });
  });
  // Write all data to {outputPath}/projectDeps.json
  // const projectDeps = {};
  // rootPaths.forEach(rootP => {
  //   depProjectPaths.filter(depP => depP.startsWith(rootP)).;
  // });

  return depProjectPaths.concat(rootPaths);
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
};
