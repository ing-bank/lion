import child_process from 'child_process'; // eslint-disable-line camelcase
import path from 'path';

import { getFilePathRelativeFromRoot } from '../utils/get-file-path-relative-from-root.js';
import { optimisedGlob } from '../utils/optimised-glob.js';
import { toPosixPath } from '../utils/to-posix-path.js';
import { fsAdapter } from '../utils/fs-adapter.js';
import { memoize } from '../utils/memoize.js';
import { LogService } from './LogService.js';
import { AstService } from './AstService.js';

/**
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerEntry} FindImportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').ProjectInputDataWithMeta} ProjectInputDataWithMeta
 * @typedef {import('../../../types/index.js').AnalyzerQueryResult} AnalyzerQueryResult
 * @typedef {import('../../../types/index.js').AnalyzerQueryConfig} AnalyzerQueryConfig
 * @typedef {import('../../../types/index.js').FeatureQueryConfig} FeatureQueryConfig
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').SearchQueryConfig} SearchQueryConfig
 * @typedef {import('../../../types/index.js').GatherFilesConfig} GatherFilesConfig
 * @typedef {import('../../../types/index.js').ProjectInputData} ProjectInputData
 * @typedef {import('../../../types/index.js').AnalyzerConfig} AnalyzerConfig
 * @typedef {{path:PathFromSystemRoot; name:ProjectName}} ProjectNameAndPath
 * @typedef {import('../../../types/index.js').PathRelative} PathRelative
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').QueryConfig} QueryConfig
 * @typedef {import('../../../types/index.js').QueryResult} QueryResult
 * @typedef {import('../../../types/index.js').ProjectName} ProjectName
 * @typedef {import('../../../types/index.js').PackageJson} PackageJson
 * @typedef {import('../../../types/index.js').Analyzer} Analyzer
 * @typedef {import('../../../types/index.js').Project} Project
 * @typedef {import('../../../types/index.js').Feature} Feature
 */

/**
 * @typedef {(rootPath:PathFromSystemRoot) => PackageJson|undefined} GetPackageJsonFn
 * @type {GetPackageJsonFn}
 */
const getPackageJson = memoize((/** @type {PathFromSystemRoot} */ rootPath) => {
  try {
    const fileContent = fsAdapter.fs.readFileSync(`${rootPath}/package.json`, 'utf8');
    return JSON.parse(fileContent);
  } catch (_) {
    try {
      // For testing purposes, we allow to have a package.mock.json that contains 'fictional'
      // packages (like 'exporting-ref-project') not on npm registry
      const fileContent = fsAdapter.fs.readFileSync(`${rootPath}/package.mock.json`, 'utf8');
      return JSON.parse(fileContent);
    } catch (__) {
      return undefined;
    }
  }
});

/**
 * @typedef {(rootPath:PathFromSystemRoot) => object|undefined} GetLernaJsonFn
 * @type {GetLernaJsonFn}
 */
const getLernaJson = memoize((/** @type {PathFromSystemRoot} */ rootPath) => {
  try {
    const fileContent = fsAdapter.fs.readFileSync(`${rootPath}/lerna.json`, 'utf8');
    return JSON.parse(fileContent);
  } catch (_) {
    return undefined;
  }
});

/**
 * @typedef {(list:PathFromSystemRoot[]|string[], rootPath:PathFromSystemRoot) => Promise<ProjectNameAndPath[]>} GetPathsFromGlobListFn
 * @type {GetPathsFromGlobListFn}
 */
const getPathsFromGlobList = memoize(
  async (
    /** @type {PathFromSystemRoot[]|string[]} */ list,
    /** @type {PathFromSystemRoot} */ rootPath,
  ) => {
    /** @type {string[]} */
    const results = [];
    for (const pathOrGlob of list) {
      if (pathOrGlob.includes('*')) {
        const globResults = await optimisedGlob(pathOrGlob, {
          cwd: rootPath,
          absolute: false,
          onlyFiles: false,
        });
        results.push(...globResults);
      } else {
        results.push(pathOrGlob);
      }
    }
    return results.map(pkgPath => {
      const packageRoot = path.resolve(rootPath, pkgPath);
      const basename = path.basename(pkgPath);
      const pkgJson = getPackageJson(/** @type {PathFromSystemRoot} */ (packageRoot));
      const name = /** @type {ProjectName} */ ((pkgJson && pkgJson.name) || basename);
      return { name, path: /** @type {PathFromSystemRoot} */ (pkgPath) };
    });
  },
);

/**
 * @typedef {(rootPath:PathFromSystemRoot) => string|undefined} GetGitignoreFileFn
 * @type {GetGitignoreFileFn}
 */
const getGitignoreFile = memoize((/** @type {PathFromSystemRoot} */ rootPath) => {
  try {
    return fsAdapter.fs.readFileSync(`${rootPath}/.gitignore`, 'utf8');
  } catch (_) {
    return undefined;
  }
});

/**
 * @typedef {(rootPath:PathFromSystemRoot) => string[]} GetGitIgnorePathsFn
 * @type {GetGitIgnorePathsFn}
 */
const getGitIgnorePaths = memoize((/** @type {PathFromSystemRoot} */ rootPath) => {
  const fileContent = /** @type {string} */ (getGitignoreFile(rootPath));
  if (!fileContent) {
    return [];
  }

  const entries = fileContent.split('\n').filter(entry => {
    // eslint-disable-next-line no-param-reassign
    entry = entry.trim();
    if (entry.startsWith('#')) {
      return false;
    }
    if (entry.startsWith('!')) {
      return false; // negated folders will be kept
    }
    return entry.trim().length;
  });

  // normalize entries to be compatible with anymatch
  const normalizedEntries = entries.map(entry => {
    // eslint-disable-next-line no-param-reassign
    entry = toPosixPath(entry);

    if (entry.startsWith('/')) {
      // eslint-disable-next-line no-param-reassign
      entry = entry.slice(1);
    }
    const isFile = entry.indexOf('.') > 0; // index of 0 means hidden file.
    if (entry.endsWith('/')) {
      // eslint-disable-next-line no-param-reassign
      entry += '**';
    } else if (!isFile) {
      // eslint-disable-next-line no-param-reassign
      entry += '/**';
    }
    return entry;
  });
  return normalizedEntries;
});

/**
 * Gives back all files and folders that need to be added to npm artifact
 * @typedef {(rootPath:PathFromSystemRoot) => string[]} GetNpmPackagePathsFn
 * @type {GetNpmPackagePathsFn}
 */
const getNpmPackagePaths = memoize((/** @type {PathFromSystemRoot} */ rootPath) => {
  const pkgJson = getPackageJson(rootPath);
  if (!pkgJson) {
    return [];
  }
  if (pkgJson.files) {
    return pkgJson.files.map(fileOrFolder => {
      const isFolderGlob = !fileOrFolder.includes('*') && !fileOrFolder.includes('.');
      if (isFolderGlob) {
        return `${fileOrFolder}/**/*`;
      }
      return fileOrFolder;
    });
  }
  return [];
});

/**
 * @param {any|any[]} v
 * @returns {any[]}
 */
function ensureArray(v) {
  return Array.isArray(v) ? v : [v];
}

/**
 * @param {string} localPathWithDotSlash
 * @returns {string}
 */
function stripDotSlashFromLocalPath(localPathWithDotSlash) {
  return localPathWithDotSlash.replace(/^\.\//, '');
}

/**
 * @param {string} localPathWithoutDotSlash
 * @returns {string}
 */
function normalizeLocalPathWithDotSlash(localPathWithoutDotSlash) {
  if (!localPathWithoutDotSlash.startsWith('.')) {
    return `./${localPathWithoutDotSlash}`;
  }
  return localPathWithoutDotSlash;
}

/**
 * @param {{valObjOrStr:object|string|null;nodeResolveMode:string}} opts
 * @returns {string|null}
 */
function getStringOrObjectValOfExportMapEntry({ valObjOrStr, nodeResolveMode }) {
  if (typeof valObjOrStr !== 'object') {
    return valObjOrStr;
  }
  if (!valObjOrStr?.[nodeResolveMode]) {
    // This is allowed: it makes sense to have an entrypoint on the root for typescript, not for others
    return null;
  }
  return valObjOrStr[nodeResolveMode];
}

/**
 * To be used in main program.
 * It creates an instance on which the 'files' array is stored.
 * The files array contains all projects.
 *
 * Also serves as SSOT in many other contexts wrt data locations and gathering
 */
export class InputDataService {
  /**
   * Create an array of ProjectData
   * @param {(PathFromSystemRoot|ProjectInputData)[]} projectPaths
   * @param {Partial<GatherFilesConfig>} gatherFilesConfig
   * @returns {Promise<ProjectInputDataWithMeta[]>}
   */
  static async createDataObject(projectPaths, gatherFilesConfig = {}) {
    console.debug('[createDataObject]');

    /** @type {ProjectInputData[]} */
    const inputData = [];
    for (const projectPathOrObj of projectPaths) {
      if (typeof projectPathOrObj === 'object') {
        // ProjectInputData was provided already manually
        inputData.push(projectPathOrObj);
        continue; // eslint-disable-line no-continue
      }

      const projectPath = projectPathOrObj;
      inputData.push({
        project: /** @type {Project} */ ({
          name: path.basename(projectPath),
          path: projectPath,
        }),
        entries: await this.gatherFilesFromDir(projectPath, {
          ...this.defaultGatherFilesConfig,
          ...gatherFilesConfig,
        }),
      });
    }
    return this._addMetaToProjectsData(inputData);
  }

  /**
   * From 'main/file.js' or '/main/file.js' to './main/file.js'
   * @param {string} mainEntry
   * @returns {PathRelativeFromProjectRoot}
   */
  static __normalizeMainEntry(mainEntry) {
    if (mainEntry.startsWith('/')) {
      return /** @type {PathRelativeFromProjectRoot} */ (`.${mainEntry}`);
    }
    if (!mainEntry.startsWith('.')) {
      return `./${mainEntry}`;
    }
    return /** @type {PathRelativeFromProjectRoot} */ (mainEntry);
  }

  /**
   * @param {PathFromSystemRoot} projectPath
   * @returns {Project}
   */
  static getProjectMeta(projectPath) {
    /** @type {Partial<Project>} */
    const project = { path: projectPath };
    // Add project meta info
    try {
      const pkgJson = getPackageJson(projectPath);
      // eslint-disable-next-line no-param-reassign
      project.mainEntry = this.__normalizeMainEntry(pkgJson?.main || './index.js');
      // eslint-disable-next-line no-param-reassign
      project.name = pkgJson?.name;
      // TODO: also add meta info whether we are in a monorepo or not.
      // We do this by checking whether there is a lerna.json on root level.
      // eslint-disable-next-line no-empty
      project.version = pkgJson?.version;
    } catch (e) {
      LogService.warn(/** @type {string} */ (e));
    }
    project.commitHash = this._getCommitHash(projectPath);
    return /** @type {Project} */ (Object.freeze(project));
  }

  /**
   * @param {PathFromSystemRoot} projectPath
   * @returns {string|'[not-a-git-root]'|undefined}
   */
  static _getCommitHash(projectPath) {
    let commitHash;
    let isGitRepo;
    try {
      isGitRepo = fsAdapter.fs.lstatSync(path.resolve(projectPath, '.git')).isDirectory();
      // eslint-disable-next-line no-empty
    } catch (_) {}

    if (isGitRepo) {
      try {
        // eslint-disable-next-line camelcase
        const hash = child_process
          .execSync('git rev-parse HEAD', {
            cwd: projectPath,
          })
          .toString('utf-8')
          .slice(0, -1);
        // eslint-disable-next-line no-param-reassign
        commitHash = hash;
      } catch (e) {
        LogService.warn(/** @type {string} */ (e));
      }
    } else {
      commitHash = '[not-a-git-root]';
    }
    return commitHash;
  }

  /**
   * Adds context with code (c.q. file contents), project name and project 'main' entry
   * @param {ProjectInputData[]} inputData
   * @returns {ProjectInputDataWithMeta[]}
   */
  static _addMetaToProjectsData(inputData) {
    return /** @type {* & ProjectInputDataWithMeta[]} */ (
      inputData.map(projectObj => {
        // Add context obj with 'code' to files

        /** @type {ProjectInputDataWithMeta['entries'][]} */
        const newEntries = [];
        projectObj.entries.forEach(entry => {
          let code;
          try {
            code = fsAdapter.fs.readFileSync(entry, 'utf8');
          } catch (e) {
            LogService.error(`Could not find "${entry}"`);
          }
          const file = getFilePathRelativeFromRoot(
            toPosixPath(entry),
            toPosixPath(projectObj.project.path),
          );
          if (path.extname(file) === '.html') {
            const extractedScripts = AstService.getScriptsFromHtml(/** @type {string} */ (code));
            // eslint-disable-next-line no-shadow
            extractedScripts.forEach((code, i) => {
              newEntries.push({
                file: /** @type {PathRelativeFromProjectRoot} */ (`${file}#${i}`),
                context: { code },
              });
            });
          } else {
            newEntries.push({ file, context: { code } });
          }
        });

        const project = this.getProjectMeta(toPosixPath(projectObj.project.path));

        return { project, entries: newEntries };
      })
    );
  }

  /**
   * Gets all project directories/paths from './submodules'
   * @type {PathFromSystemRoot[]} a list of strings representing all entry paths for projects we want to query
   */
  static get targetProjectPaths() {
    if (this.__targetProjectPaths) {
      return this.__targetProjectPaths;
    }
    const submoduleDir = path.resolve(__dirname, '../../../providence-input-data/search-targets');
    let dirs;
    try {
      dirs = fsAdapter.fs.readdirSync(submoduleDir);
    } catch (_) {
      return [];
    }
    return dirs
      .map(dir => /** @type {PathFromSystemRoot} */ (path.join(submoduleDir, dir)))
      .filter(dirPath => fsAdapter.fs.lstatSync(dirPath).isDirectory());
  }

  static set targetProjectPaths(v) {
    this.__targetProjectPaths = ensureArray(v);
  }

  /**
   * @type {PathFromSystemRoot[]} a list of strings representing all entry paths for projects we want to query
   */
  static get referenceProjectPaths() {
    if (this.__referenceProjectPaths) {
      return this.__referenceProjectPaths;
    }

    let dirs;
    try {
      const referencesDir = path.resolve(__dirname, '../../../providence-input-data/references');
      dirs = fsAdapter.fs.readdirSync(referencesDir);
      dirs = dirs
        .map(dir => path.join(referencesDir, dir))
        .filter(dirPath => fsAdapter.fs.lstatSync(dirPath).isDirectory());
      // eslint-disable-next-line no-empty
    } catch (_) {}
    return /** @type {PathFromSystemRoot[]} */ (dirs);
  }

  static set referenceProjectPaths(v) {
    this.__referenceProjectPaths = ensureArray(v);
  }

  /**
   * @type {GatherFilesConfig}
   */
  static get defaultGatherFilesConfig() {
    return {
      allowlist: ['!node_modules/**', '!bower_components/**', '!**/*.conf.js', '!**/*.config.js'],
      extensions: ['.js'],
      depth: Infinity,
    };
  }

  /**
   * @protected
   * @param {number} depth
   * @param {string[]} extensions
   * @returns {string}
   */
  static _getDefaultGlobDepthPattern(depth = Infinity, extensions = ['.js']) {
    // `.{${cfg.extensions.map(e => e.slice(1)).join(',')},}`;
    const extensionsGlobPart = `.{${extensions.map(extension => extension.slice(1)).join(',')},}`;
    if (depth === Infinity) {
      return `**/*${extensionsGlobPart}`;
    }
    if (depth > 1) {
      return `${`/*`.repeat(depth + 1)}${extensionsGlobPart}`;
    }
    if (depth === 0) {
      return `*${extensionsGlobPart}`;
    }
    return '';
  }

  /**
   * Gets allowlist mode that determines which files to analyze
   * @param {PathFromSystemRoot} startPath - local filesystem path
   * @returns {'git'|'npm'}
   */
  static _determineAllowListMode(startPath) {
    const isNodeModule = /^.*\/(node_modules\/@.*|node_modules)\/.*$/.test(startPath);
    return isNodeModule ? 'npm' : 'git';
  }

  /**
   * Gets an array of files for given extension
   * @param {PathFromSystemRoot} startPath - local filesystem path
   * @param {Partial<GatherFilesConfig>} customConfig - configuration object
   * @returns {Promise<PathFromSystemRoot[]>} result list of file paths
   */
  static async gatherFilesFromDir(startPath, customConfig = {}) {
    console.debug('[gatherFilesFromDir]');

    const cfg = {
      ...this.defaultGatherFilesConfig,
      ...customConfig,
    };
    if (!customConfig.omitDefaultAllowlist) {
      cfg.allowlist = [
        ...this.defaultGatherFilesConfig.allowlist,
        ...(customConfig.allowlist || []),
      ];
    }

    const allowlistModes = ['npm', 'git', 'all', 'export-map'];
    if (customConfig.allowlistMode && !allowlistModes.includes(customConfig.allowlistMode)) {
      throw new Error(
        `[gatherFilesConfig] Please provide a valid allowListMode like "${allowlistModes.join(
          '|',
        )}". Found: "${customConfig.allowlistMode}"`,
      );
    }

    if (cfg.allowlistMode === 'export-map') {
      const pkgJson = getPackageJson(startPath);
      if (!pkgJson?.exports) {
        LogService.error(`No exports found in package.json of ${startPath}`);
      }
      if (pkgJson?.exports) {
        const exposedAndInternalPaths = await this.getPathsFromExportMap(pkgJson?.exports, {
          packageRootPath: startPath,
        });
        return /** @type {PathFromSystemRoot[]} */ (
          exposedAndInternalPaths
            // TODO: path.resolve(startPath, p.internal)?
            .map(p => p.internal)
            .filter(p =>
              cfg.extensions.includes(/** @type {`.${string}`} */ (`${path.extname(p)}`)),
            )
        );
      }
    }

    /** @type {string[]} */
    const negativeGitGlobs = [];
    /** @type {string[]} */
    const npmGlobs = [];
    const allowlistMode = cfg.allowlistMode || this._determineAllowListMode(startPath);

    if (allowlistMode === 'git') {
      negativeGitGlobs.push(
        ...getGitIgnorePaths(startPath).map(gitIgnorePath => `!${gitIgnorePath}`),
      );
    } else if (allowlistMode === 'npm') {
      npmGlobs.push(...getNpmPackagePaths(startPath));
    }

    const combinedGlobs = [...cfg.allowlist, ...npmGlobs, ...negativeGitGlobs];
    const hasProvidedPositiveGlob = cfg.allowlist.some(glob => !glob.startsWith('!'));

    // We need to expand
    const shouldLookForAllFilesInProject =
      allowlistMode === 'all' || (!npmGlobs.length && !hasProvidedPositiveGlob);
    if (shouldLookForAllFilesInProject) {
      combinedGlobs.push(this._getDefaultGlobDepthPattern(cfg.depth, cfg.extensions));
    }

    const globbyCfg = {
      expandDirectories: false,
      onlyFiles: true,
      absolute: true,
      cwd: startPath,
    };
    let filteredGlobRes = await optimisedGlob(combinedGlobs, globbyCfg);

    // Unfortunatly, globby does not correctly remove the negated globs,
    // so we have to do it manually
    const negatedGlobs = combinedGlobs.filter(p => p.startsWith('!'));
    if (negatedGlobs.length) {
      const subtract = await optimisedGlob(
        negatedGlobs.map(p => p.slice(1)),
        globbyCfg,
      );
      // eslint-disable-next-line no-shadow
      filteredGlobRes = filteredGlobRes.filter(file => !subtract.includes(file));
    }

    // Make sure we don't delete to much by giving customConfig.allowlist priority
    if (customConfig.allowlist?.length) {
      const customResults = await optimisedGlob(customConfig.allowlist, globbyCfg);
      filteredGlobRes = Array.from(new Set([...filteredGlobRes, ...customResults]));
    }

    // Filter by extension (in the future: use globs exclusively for this?)
    if (cfg.extensions.length) {
      filteredGlobRes = filteredGlobRes.filter(glob =>
        cfg.extensions.some(ext => glob.endsWith(ext)),
      );
    }

    if (!filteredGlobRes?.length) {
      LogService.warn(`No files found for path '${startPath}'`);
      return [];
    }

    return /** @type {PathFromSystemRoot[]} */ (filteredGlobRes.map(toPosixPath));
  }

  /**
   * Allows the user to provide a providence.conf.js file in its repository root
   */
  static getExternalConfig() {
    throw new Error(
      `[InputDataService.getExternalConfig]: Until fully ESM: use 'src/program/utils/get-providence=conf.mjs instead`,
    );
  }

  /**
   * Gives back all monorepo package paths
   * @param {PathFromSystemRoot} rootPath
   * @returns {ProjectNameAndPath[]|undefined}
   */
  static async getMonoRepoPackages(rootPath) {
    // [1] Look for npm/yarn workspaces
    const pkgJson = getPackageJson(rootPath);
    if (pkgJson?.workspaces) {
      return getPathsFromGlobList(pkgJson.workspaces, rootPath);
    }
    // [2] Look for lerna packages
    const lernaJson = getLernaJson(rootPath);
    if (lernaJson?.packages) {
      return getPathsFromGlobList(lernaJson.packages, rootPath);
    }
    // TODO: support forward compatibility for npm?
    return undefined;
  }

  /**
   * @param {{[key:string]: string|object|null}} exports
   * @param {object} opts
   * @param {'default'|'development'|string} [opts.nodeResolveMode='default']
   * @param {string} opts.packageRootPath
   * @returns {Promise<{internal:string; exposed:string}[]>}
   */
  static async getPathsFromExportMap(exports, { nodeResolveMode = 'default', packageRootPath }) {
    const exportMapPaths = [];

    for (const [key, valObjOrStr] of Object.entries(exports)) {
      let resolvedKey = key;
      let resolvedVal = getStringOrObjectValOfExportMapEntry({ valObjOrStr, nodeResolveMode });
      if (resolvedVal === null) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Allow older specs like "./__element-definitions/" : "./__element-definitions/" to also work,
      // so we normalize them to the new spec
      if (resolvedVal.endsWith?.('/') && resolvedKey.endsWith('/')) {
        resolvedVal += '*';
        resolvedKey += '*';
      }

      if (!resolvedKey.includes('*')) {
        exportMapPaths.push({
          internal: resolvedVal,
          exposed: resolvedKey,
        });
        // eslint-disable-next-line no-continue
        continue;
      }

      // https://nodejs.org/api/packages.html#subpath-exports
      const valueToUseForGlob = stripDotSlashFromLocalPath(resolvedVal).replace('*', '**/*');

      // Generate all possible entries via glob, first strip './'
      const internalExportMapPathsForKeyRaw = await optimisedGlob(valueToUseForGlob, {
        cwd: packageRootPath,
        onlyFiles: true,
      });

      const exposedExportMapPathsForKeyRaw = internalExportMapPathsForKeyRaw.map(pathInside => {
        // Say we have "exports": { "./*.js": "./src/*.js" }
        // => internalExportMapPathsForKey: ['./src/a.js', './src/b.js']
        // => exposedExportMapPathsForKey: ['./a.js', './b.js']
        const [, variablePart] =
          pathInside.match(new RegExp(valueToUseForGlob.replace('*', '(.*)'))) || [];
        return resolvedKey.replace('*', variablePart);
      });
      const internalExportMapPathsForKey = internalExportMapPathsForKeyRaw.map(
        normalizeLocalPathWithDotSlash,
      );
      const exposedExportMapPathsForKey = exposedExportMapPathsForKeyRaw.map(
        normalizeLocalPathWithDotSlash,
      );

      exportMapPaths.push(
        ...internalExportMapPathsForKey.map((internal, idx) => ({
          internal,
          exposed: exposedExportMapPathsForKey[idx],
        })),
      );
    }

    return exportMapPaths;
  }
}

InputDataService.getProjectMeta = memoize(InputDataService.getProjectMeta);
InputDataService.gatherFilesFromDir = memoize(InputDataService.gatherFilesFromDir);
InputDataService.getMonoRepoPackages = memoize(InputDataService.getMonoRepoPackages);
InputDataService.createDataObject = memoize(InputDataService.createDataObject);

InputDataService.getPackageJson = getPackageJson;
