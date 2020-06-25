/* eslint-disable no-param-reassign */
// @ts-ignore-next-line
require('../types/index.js');

const fs = require('fs');
const pathLib = require('path');
const child_process = require('child_process'); // eslint-disable-line camelcase
const glob = require('glob');
const { LogService } = require('./LogService.js');
const { AstService } = require('./AstService.js');
const { getFilePathRelativeFromRoot } = require('../utils/get-file-path-relative-from-root.js');

/**
 *
 * @param {string|array} v
 * @returns {array}
 */
function ensureArray(v) {
  return Array.isArray(v) ? v : [v];
}

function multiGlobSync(patterns, { keepDirs = false } = {}) {
  patterns = ensureArray(patterns);
  const res = new Set();
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    files.forEach(filePath => {
      if (fs.lstatSync(filePath).isDirectory() && !keepDirs) {
        return;
      }
      res.add(filePath);
    });
  });
  return Array.from(res);
}

const defaultGatherFilesConfig = {
  extensions: ['.js'],
  excludeFiles: [],
  excludeFolders: ['node_modules', 'bower_components'],
  includePaths: [],
  depth: Infinity,
};

/**
 * @typedef {Object} ProjectData
 * @property {string} project project name
 * @property {string} path full path to project folder
 * @property {string[]} entries all file paths within project folder
 */

/**
 * To be used in main program.
 * It creates an instance on which the 'files' array is stored.
 * The files array contains all projects.
 *
 * Also serves as SSOT in many other contexts wrt data locations and gathering
 */
class InputDataService {
  /**
   * @desc create an array of ProjectData
   * @param {string[]} projectPaths
   * @param {GatherFilesConfig} gatherFilesConfig
   * @returns {ProjectData}
   */
  static createDataObject(projectPaths, gatherFilesConfig = {}) {
    const inputData = projectPaths.map(projectPath => ({
      project: {
        name: pathLib.basename(projectPath),
        path: projectPath,
      },
      entries: this.gatherFilesFromDir(projectPath, {
        ...defaultGatherFilesConfig,
        ...gatherFilesConfig,
      }),
    }));
    return this._addMetaToProjectsData(inputData);
  }

  /**
   * From 'main/file.js' or '/main/file.js' to './main/file.js'
   */
  static __normalizeMainEntry(mainEntry) {
    if (mainEntry.startsWith('/')) {
      return `.${mainEntry}`;
    }
    if (!mainEntry.startsWith('.')) {
      return `./${mainEntry}`;
    }
    return mainEntry;
  }

  /**
   * @param {string} projectPath
   */
  static getProjectMeta(projectPath) {
    const project = { path: projectPath };
    // Add project meta info
    try {
      const file = pathLib.resolve(projectPath, 'package.json');
      const pkgJson = JSON.parse(fs.readFileSync(file, 'utf8'));
      // eslint-disable-next-line no-param-reassign
      project.mainEntry = this.__normalizeMainEntry(pkgJson.main || './index.js');
      // eslint-disable-next-line no-param-reassign
      project.name = pkgJson.name;
      // TODO: also add meta info whether we are in a monorepo or not.
      // We do this by checking whether there is a lerna.json on root level.
      // eslint-disable-next-line no-empty
      project.version = pkgJson.version;
    } catch (e) {
      LogService.warn(e);
    }
    project.commitHash = this._getCommitHash(projectPath);
    return project;
  }

  static _getCommitHash(projectPath) {
    let commitHash;
    let isGitRepo;
    try {
      isGitRepo = fs.lstatSync(pathLib.resolve(projectPath, '.git')).isDirectory();
      // eslint-disable-next-line no-empty
    } catch (_) {}

    if (isGitRepo) {
      try {
        const hash = child_process
          .execSync('git rev-parse HEAD', {
            cwd: projectPath,
          })
          .toString('utf-8')
          .slice(0, -1);
        // eslint-disable-next-line no-param-reassign
        commitHash = hash;
      } catch (e) {
        LogService.warn(e);
      }
    } else {
      commitHash = '[not-a-git-root]';
    }
    return commitHash;
  }

  /**
   * @desc adds context with code (c.q. file contents), project name and project 'main' entry
   * @param {InputData} inputData
   */
  static _addMetaToProjectsData(inputData) {
    return inputData.map(projectObj => {
      // Add context obj with 'code' to files
      const newEntries = [];
      projectObj.entries.forEach(entry => {
        const code = fs.readFileSync(entry, 'utf8');
        const file = getFilePathRelativeFromRoot(entry, projectObj.project.path);
        if (pathLib.extname(file) === '.html') {
          const extractedScripts = AstService.getScriptsFromHtml(code);
          // eslint-disable-next-line no-shadow
          extractedScripts.forEach((code, i) => {
            newEntries.push({ file: `${file}#${i}`, context: { code } });
          });
        } else {
          newEntries.push({ file, context: { code } });
        }
      });

      const project = this.getProjectMeta(projectObj.project.path);

      return { project, entries: newEntries };
    });
  }

  // TODO: rename to `get targetProjectPaths`
  /**
   * @desc gets all project directories/paths from './submodules'
   * @returns {string[]} a list of strings representing all entry paths for projects we want to query
   */
  static getTargetProjectPaths() {
    if (this.__targetProjectPaths) {
      return this.__targetProjectPaths;
    }
    const submoduleDir = pathLib.resolve(
      __dirname,
      '../../../providence-input-data/search-targets',
    );
    let dirs;
    try {
      dirs = fs.readdirSync(submoduleDir);
    } catch (_) {
      return [];
    }
    return dirs
      .map(dir => pathLib.join(submoduleDir, dir))
      .filter(dirPath => fs.lstatSync(dirPath).isDirectory());
  }

  static get referenceProjectPaths() {
    if (this.__referenceProjectPaths) {
      return this.__referenceProjectPaths;
    }

    let dirs;
    try {
      const referencesDir = pathLib.resolve(__dirname, '../../../providence-input-data/references');
      dirs = fs.readdirSync(referencesDir);
      dirs = dirs
        .map(dir => pathLib.join(referencesDir, dir))
        .filter(dirPath => fs.lstatSync(dirPath).isDirectory());
      // eslint-disable-next-line no-empty
    } catch (_) {}
    return dirs;
  }

  static set referenceProjectPaths(v) {
    this.__referenceProjectPaths = ensureArray(v);
  }

  static set targetProjectPaths(v) {
    this.__targetProjectPaths = ensureArray(v);
  }

  static getDefaultGatherFilesConfig() {
    return defaultGatherFilesConfig;
  }

  static getGlobPattern(startPath, cfg, withoutDepth = false) {
    // if startPath ends with '/', remove
    let globPattern = startPath.replace(/\/$/, '');
    if (!withoutDepth) {
      if (cfg.depth !== Infinity) {
        globPattern += `/*`.repeat(cfg.depth + 1);
      } else {
        globPattern += `/**/*`;
      }
    }
    return globPattern;
  }

  /**
   * @desc Gets an array of files for given extension
   * @param {string} startPath - local filesystem path
   * @param {GatherFilesConfig} customConfig - configuration object
   * @param {number} [customConfig.depth=Infinity] how many recursive calls should be made
   * @param {string[]} [result] - list of file paths, for internal (recursive) calls
   * @returns {string[]} result list of file paths
   */
  static gatherFilesFromDir(startPath, customConfig) {
    const cfg = {
      ...defaultGatherFilesConfig,
      ...customConfig,
    };

    let globPattern = this.getGlobPattern(startPath, cfg);
    globPattern += `.{${cfg.extensions.map(e => e.slice(1)).join(',')},}`;
    const globRes = multiGlobSync(globPattern);

    const globPatternWithoutDepth = this.getGlobPattern(startPath, cfg, true);
    let excludedGlobFiles;
    if (cfg.exclude) {
      excludedGlobFiles = multiGlobSync(`${globPatternWithoutDepth}/${cfg.exclude}`);
    }

    let filteredGlobRes = globRes.filter(gr => {
      const localGr = gr.replace(startPath, '');
      return (
        !cfg.excludeFolders.some(f => localGr.includes(`${f}/`)) &&
        !cfg.excludeFiles.some(f => localGr.includes(f)) &&
        !(excludedGlobFiles && excludedGlobFiles.some(f => gr.includes(f)))
      );
    });

    if (cfg.includePaths && cfg.includePaths.length) {
      filteredGlobRes = globRes.filter(gr =>
        cfg.includePaths.some(p => gr.startsWith(pathLib.resolve(startPath, p))),
      );
    }

    if (!filteredGlobRes || !filteredGlobRes.length) {
      LogService.warn(`No files found for path '${startPath}'`);
    }

    return filteredGlobRes;
  }

  /**
   * @desc Allows the user to provide a providence.conf.js file in its repository root
   */
  static getExternalConfig() {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(`${process.cwd()}/providence.conf.js`);
    } catch (_) {
      return null;
    }
  }
}

module.exports = { InputDataService };
