/* eslint-disable no-param-reassign */
import { createRequire } from 'module';
import path from 'path';

import { getFilePathRelativeFromRoot } from '../utils/get-file-path-relative-from-root.js';
import { InputDataService } from './InputDataService.js';
import { toPosixPath } from '../utils/to-posix-path.js';
import { ReportService } from './ReportService.js';
import { QueryService } from './QueryService.js';
import { LogService } from './LogService.js';

/**
 * @typedef {(ast: File, astContext: {code:string; relativePath:PathRelativeFromProjectRoot; projectData: ProjectInputDataWithMeta; analyzerCfg: AnalyzerConfigResolved}) => Promise<{result: unknown[]; meta?: unknown}>} FileAstTraverseFn
 * @typedef {import('../../../types/index.js').ProjectInputDataWithMeta} ProjectInputDataWithMeta
 * @typedef {import('../../../types/index.js').ProjectInputDataWithAstMeta} ProjectInputDataWithAstMeta
 * @typedef {import('../../../types/index.js').AnalyzerQueryResult} AnalyzerQueryResult
 * @typedef {import('../../../types/index.js').MatchAnalyzerConfig} MatchAnalyzerConfig
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').ProjectInputData} ProjectInputData
 * @typedef {import('../../../types/index.js').Project} Project
 * @typedef {import('../../../types/index.js').GatherFilesConfig} GatherFilesConfig
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').QueryOutput} QueryOutput
 * @typedef {import("@swc/core").Module} SwcAstModule
 * @typedef {import('@babel/types').File} File
 */

/**
 * The `semver` package does not ship type declarations, so we describe the
 * small API surface used here.
 * @typedef {{ satisfies: (version: string, range: string) => boolean }} Semver
 */

/**
 * Metadata returned by an analyzer, as stored on the (intermediate) result
 * object before ReportService/QueryService wrap it in a `meta` envelope.
 * @typedef {object} AnalyzerMetaOut
 * @property {AnalyzerName} name
 * @property {AnalyzerAst} requiredAst
 * @property {string} identifier
 * @property {Project} [targetProject]
 * @property {Project} [referenceProject]
 * @property {AnalyzerConfigResolved} configuration
 * @property {boolean} [__fromCache]
 */

/**
 * Runtime shape produced by `ensureAnalyzerResultFormat`/`unwindJsonResult`.
 * @typedef {object} AnalyzerResult
 * @property {QueryOutput} queryOutput
 * @property {AnalyzerMetaOut} analyzerMeta
 */

/**
 * Full set of configuration keys an analyzer run can receive.
 * @typedef {object} AnalyzerConfigResolved
 * @property {PathFromSystemRoot} [targetProjectPath]
 * @property {PathFromSystemRoot} [referenceProjectPath]
 * @property {GatherFilesConfig} [gatherFilesConfig]
 * @property {GatherFilesConfig} [gatherFilesConfigReference]
 * @property {boolean} [skipCheckMatchCompatibility]
 * @property {boolean} [suppressNonCriticalLogs]
 * @property {AnalyzerQueryResult|AnalyzerResult} [targetProjectResult]
 * @property {AnalyzerQueryResult|AnalyzerResult} [referenceProjectResult]
 * @property {PathFromSystemRoot[]} [targetFilePaths]
 */

const require = createRequire(import.meta.url);
/** @type {Semver} */
const semver = require('semver');

/**
 * @param {string} identifier
 */
function displayProjectsInLog(identifier) {
  const [target, targetV, , reference, referenceV] = identifier.split('_');
  return decodeURIComponent(
    `${target}@${targetV} ${reference ? `- ${reference}@${referenceV}` : ''}`,
  );
}

/**
 * Analyzes one entry: the callback can traverse a given ast for each entry
 * @param {ProjectInputDataWithAstMeta} projectData
 * @param {FileAstTraverseFn} astAnalysis
 * @param {AnalyzerConfigResolved} analyzerCfg
 * @returns {Promise<{file: PathRelativeFromProjectRoot; meta: unknown; result: unknown[]}[]>}
 */
async function analyzePerAstFile(projectData, astAnalysis, analyzerCfg) {
  /** @type {{file: PathRelativeFromProjectRoot; meta: unknown; result: unknown[]}[]} */
  const entries = [];
  for (const { file, ast, context: astContext } of projectData.entries) {
    const relativePath = getFilePathRelativeFromRoot(
      /** @type {PathFromSystemRoot} */ (file),
      projectData.project.path,
    );
    const context = { code: astContext.code, relativePath, projectData, analyzerCfg };

    const fullPath = path.resolve(projectData.project.path, file);
    LogService.debug(`[analyzePerAstFile]: ${fullPath}`);

    // We do a try and catch here, so that unparseable files do not block all metrics we're gathering in a run
    try {
      const { result, meta } = await astAnalysis(ast, context);
      entries.push({ file: relativePath, meta, result });
    } catch (e) {
      LogService.error(`[analyzePerAstFile]: ${fullPath} throws: ${e}`);
    }
  }
  const filteredEntries = entries.filter(({ result }) => Boolean(result.length));
  return filteredEntries;
}

/**
 * Transforms QueryResult entries to posix path notations on Windows
 * @param {unknown} data
 */
function posixify(data) {
  if (!data) return;

  if (Array.isArray(data)) {
    data.forEach(posixify);
  } else if (typeof data === 'object') {
    Object.entries(data).forEach(([k, v]) => {
      if (Array.isArray(v) || typeof v === 'object') {
        posixify(v);
      }
      // TODO: detect whether filePath instead of restricting by key name?
      else if (typeof v === 'string' && k === 'file') {
        /** @type {Record<string, unknown>} */ (data)[k] = toPosixPath(v);
      }
    });
  }
}

/**
 * This method ensures that the result returned by an analyzer always has a consistent format.
 * By returning the configuration for the queryOutput, it will be possible to run later queries
 * under the same circumstances
 * @param {QueryOutput} queryOutput
 * @param {AnalyzerConfigResolved} cfg
 * @param {Analyzer} analyzer
 * @returns {AnalyzerResult}
 */
function ensureAnalyzerResultFormat(queryOutput, cfg, analyzer) {
  const { targetProjectMeta, referenceProjectMeta } = analyzer;
  const { identifier: rawIdentifier } = analyzer;
  const identifier = /** @type {string} */ (rawIdentifier);
  /** @type {{targetProject?: Project; referenceProject?: Project}} */
  const optional = {};
  if (targetProjectMeta) {
    optional.targetProject = { ...targetProjectMeta };
    delete (/** @type {{path?: PathFromSystemRoot}} */ (optional.targetProject).path); // get rid of machine specific info
  }
  if (referenceProjectMeta) {
    optional.referenceProject = { ...referenceProjectMeta };
    delete (/** @type {{path?: PathFromSystemRoot}} */ (optional.referenceProject).path); // get rid of machine specific info
  }

  const AnalyzerClass = /** @type {typeof Analyzer} */ (analyzer.constructor);

  /** @type {AnalyzerResult} */
  const aResult = {
    queryOutput,
    analyzerMeta: {
      name: AnalyzerClass.analyzerName,
      requiredAst: AnalyzerClass.requiredAst,
      identifier,
      ...optional,
      configuration: cfg,
    },
  };

  // For now, delete data relatable to local machine + path data that will recognize
  // projX#v1 (via rootA/projX#v1, rootB/projX#v2) as identical entities.
  // Cleaning up local data paths will make  sure their hashes will be similar
  // across different machines
  delete aResult.analyzerMeta.configuration.referenceProjectPath;
  delete aResult.analyzerMeta.configuration.targetProjectPath;

  const { referenceProjectResult, targetProjectResult } = aResult.analyzerMeta.configuration;

  if (referenceProjectResult) {
    delete aResult.analyzerMeta.configuration.referenceProjectResult;
  } else if (targetProjectResult) {
    delete aResult.analyzerMeta.configuration.targetProjectResult;
  }

  if (Array.isArray(aResult.queryOutput)) {
    aResult.queryOutput.forEach(projectOutput => {
      const entry =
        /** @type {import('../../../types/index.js').QueryOutputEntry & {project?: Partial<Project>}} */ (
          projectOutput
        );
      if (entry.project) {
        delete entry.project.path;
      }
    });
  }

  if (process.platform === 'win32') {
    posixify(aResult);
  }

  return aResult;
}

/**
 * Before running the analyzer, we need two conditions for a 'compatible match':
 * - 1. referenceProject is imported by targetProject at all
 * - 2. referenceProject and targetProject have compatible major versions
 * @typedef {(referencePath:PathFromSystemRoot,targetPath:PathFromSystemRoot) => {compatible:boolean; reason?:string}} CheckForMatchCompatibilityFn
 * @type {CheckForMatchCompatibilityFn}
 */
const checkForMatchCompatibility = (
  /** @type {PathFromSystemRoot} */ referencePath,
  /** @type {PathFromSystemRoot} */ targetPath,
) => {
  const referencePkg = InputDataService.getPackageJson(referencePath);
  const targetPkg = InputDataService.getPackageJson(targetPath);

  const allTargetDeps = [
    ...Object.entries(targetPkg?.devDependencies || {}),
    ...Object.entries(targetPkg?.dependencies || {}),
  ];

  const importEntry = allTargetDeps.find(([name]) => referencePkg?.name === name);
  if (!importEntry) {
    return { compatible: false, reason: 'no-dependency' };
  }
  if (referencePkg?.version && !semver.satisfies(referencePkg.version, importEntry[1])) {
    return { compatible: false, reason: 'no-matched-version' };
  }
  return { compatible: true };
};

/**
 * If in json format, 'unwind' to be compatible for analysis...
 * @param {AnalyzerQueryResult} targetOrReferenceProjectResult
 * @returns {AnalyzerResult}
 */
function unwindJsonResult(targetOrReferenceProjectResult) {
  const { queryOutput } = targetOrReferenceProjectResult;
  const { analyzerMeta } = targetOrReferenceProjectResult.meta;
  return { queryOutput, analyzerMeta };
}

/**
 * Reads the analyzer metadata either from the intermediate (`analyzerMeta` at
 * the root) or from the json/cached (`meta.analyzerMeta`) shape.
 * @param {AnalyzerQueryResult|AnalyzerResult} result
 * @returns {AnalyzerMetaOut}
 */
function getAnalyzerMeta(result) {
  return 'analyzerMeta' in result ? result.analyzerMeta : result.meta.analyzerMeta;
}

export class Analyzer {
  static requiresReference = false;

  /** @type {AnalyzerAst} */
  static requiredAst = 'babel';

  /** @type {AnalyzerName} */
  static analyzerName = '';

  name = /** @type  {typeof Analyzer} */ (this.constructor).analyzerName;

  /** @type {AnalyzerConfigResolved} */
  _customConfig = {};

  /** @type {Project|undefined} */
  targetProjectMeta;

  /** @type {Project|undefined} */
  referenceProjectMeta;

  /** @type {string|undefined} */
  identifier;

  /** @type {ProjectInputDataWithMeta[]|undefined} */
  targetData;

  /** @type {ProjectInputDataWithMeta[]|undefined} */
  referenceData;

  get config() {
    return {
      ...this._customConfig,
    };
  }

  /**
   * In a MatchAnalyzer, two Analyzers (a reference and targer) are run.
   * For instance, in a MatchImportsAnalyzer, a FindExportsAnalyzer and FinImportsAnalyzer are run.
   * Their results can be provided as config params.
   * When they were stored in json format in the filesystem, 'unwind' them to be compatible for analysis...
   * @param {AnalyzerConfigResolved} cfg
   */
  static __unwindProvidedResults(cfg) {
    if (cfg.targetProjectResult && !('analyzerMeta' in cfg.targetProjectResult)) {
      cfg.targetProjectResult = unwindJsonResult(cfg.targetProjectResult);
    }
    if (cfg.referenceProjectResult && !('analyzerMeta' in cfg.referenceProjectResult)) {
      cfg.referenceProjectResult = unwindJsonResult(cfg.referenceProjectResult);
    }
  }

  /**
   * @param {AnalyzerConfigResolved} cfg
   * @returns {Promise<AnalyzerResult|undefined>}
   */
  async _prepare(cfg) {
    LogService.debug(`Analyzer "${this.name}": started _prepare method`);
    /** @type {typeof Analyzer} */ (this.constructor).__unwindProvidedResults(cfg);

    if (!cfg.targetProjectResult) {
      this.targetProjectMeta = InputDataService.getProjectMeta(
        /** @type {PathFromSystemRoot} */ (cfg.targetProjectPath),
      );
    } else {
      this.targetProjectMeta = getAnalyzerMeta(cfg.targetProjectResult).targetProject;
    }

    if (cfg.referenceProjectPath && !cfg.referenceProjectResult) {
      this.referenceProjectMeta = InputDataService.getProjectMeta(cfg.referenceProjectPath);
    } else if (cfg.referenceProjectResult) {
      this.referenceProjectMeta = getAnalyzerMeta(cfg.referenceProjectResult).targetProject;
    }

    /**
     * Create a unique hash based on target, reference and configuration
     */
    this.identifier = ReportService.createIdentifier({
      targetProject: /** @type {Project} */ (this.targetProjectMeta),
      referenceProject: this.referenceProjectMeta,
      analyzerConfig: cfg,
    });

    // If we have a provided result cfg.referenceProjectResult, we assume the providing
    // party provides compatible results for now...
    if (cfg.referenceProjectPath && !cfg.skipCheckMatchCompatibility) {
      const { compatible, reason } = checkForMatchCompatibility(
        cfg.referenceProjectPath,
        /** @type {PathFromSystemRoot} */ (cfg.targetProjectPath),
      );

      if (!compatible) {
        if (!cfg.suppressNonCriticalLogs) {
          LogService.info(
            `${LogService.pad(`skipping  ${this.name} (${reason})`)}${displayProjectsInLog(
              /** @type {string} */ (this.identifier),
            )}`,
          );
        }
        return ensureAnalyzerResultFormat(/** @type {QueryOutput} */ (`[${reason}]`), cfg, this);
      }
    }

    /**
     * See if we maybe already have our result in cache in the file-system.
     */
    const cachedResult = Analyzer._getCachedAnalyzerResult({
      analyzerName: this.name,
      identifier: /** @type {string} */ (this.identifier),
      cfg,
    });

    if (cachedResult) {
      return cachedResult;
    }

    if (!cfg.suppressNonCriticalLogs) {
      LogService.info(
        `${LogService.pad(`starting ${this.name}`)}${displayProjectsInLog(
          /** @type {string} */ (this.identifier),
        )}`,
      );
    }

    /**
     * Get reference and search-target data
     */
    if (!cfg.targetProjectResult) {
      performance.mark('analyzer--prepare--createDTarg-start');
      this.targetData = await InputDataService.createDataObject(
        [/** @type {PathFromSystemRoot} */ (cfg.targetProjectPath)],
        cfg.gatherFilesConfig,
      );
      performance.mark('analyzer--prepare--createDTarg-end');
      const m1 = performance.measure(
        'analyzer--prepare--createDTarg',
        'analyzer--prepare--createDTarg-start',
        'analyzer--prepare--createDTarg-end',
      );
      LogService.perf(m1);
    }

    if (cfg.referenceProjectPath) {
      performance.mark('analyzer--prepare--createDRef-start');

      this.referenceData = await InputDataService.createDataObject(
        [cfg.referenceProjectPath],
        cfg.gatherFilesConfigReference || cfg.gatherFilesConfig,
      );
      performance.mark('analyzer--prepare--createDRef-end');
      const m2 = performance.measure(
        'analyzer--prepare--createDRef',
        'analyzer--prepare--createDRef-start',
        'analyzer--prepare--createDRef-end',
      );
      LogService.perf(m2);
    }

    return undefined;
  }

  /**
   * @param {QueryOutput} queryOutput
   * @param {AnalyzerConfigResolved} cfg
   * @returns {AnalyzerResult}
   */
  _finalize(queryOutput, cfg) {
    LogService.debug(`Analyzer "${this.name}": started _finalize method`);

    performance.mark('analyzer--finalize-start');
    const analyzerResult = ensureAnalyzerResultFormat(queryOutput, cfg, this);
    if (!cfg.suppressNonCriticalLogs) {
      LogService.success(
        `${LogService.pad(`finished ${this.name}`)}${displayProjectsInLog(
          /** @type {string} */ (this.identifier),
        )}`,
      );
    }
    performance.mark('analyzer--finalize-end');
    const measurementFinalize = performance.measure(
      'analyzer--finalize',
      'analyzer--finalize-start',
      'analyzer--finalize-end',
    );
    LogService.perf(measurementFinalize);

    return analyzerResult;
  }

  /**
   * @param {{traverseEntryFn: FileAstTraverseFn; config: AnalyzerConfigResolved; filePaths?: PathFromSystemRoot[]; projectPath?: PathFromSystemRoot; projectName?: string; targetData?: ProjectInputDataWithMeta[]}} analyzeFileCfg
   * @returns {Promise<{file: PathRelativeFromProjectRoot; meta: unknown; result: unknown[]}[]>}
   */
  static async analyzeProject(analyzeFileCfg) {
    LogService.debug(`Analyzer "${this.name}": started _traverse method`);

    /** @type {ProjectInputDataWithMeta[]} */
    let finalTargetData;
    if (!analyzeFileCfg.filePaths) {
      finalTargetData = /** @type {ProjectInputDataWithMeta[]} */ (analyzeFileCfg.targetData);
    } else {
      const { projectPath, projectName } = analyzeFileCfg;
      if (!projectPath) {
        LogService.error(`[Analyzer._traverse]: you must provide a projectPath`);
      }
      finalTargetData = await InputDataService.createDataObject([
        {
          project: /** @type {Project} */ ({
            name: projectName || '[n/a]',
            path: projectPath,
          }),
          entries: analyzeFileCfg.filePaths,
        },
      ]);
    }

    /**
     * Create ASTs for our inputData
     */
    const astDataProjects = await QueryService.addAstToProjectsData(
      finalTargetData,
      this.requiredAst,
    );
    return analyzePerAstFile(
      astDataProjects[0],
      analyzeFileCfg.traverseEntryFn,
      analyzeFileCfg.config,
    );
  }

  /**
   * Finds export specifiers and sources
   * @param {AnalyzerConfigResolved} customConfig
   * @returns {Promise<AnalyzerResult|undefined>}
   */
  async execute(customConfig) {
    this._customConfig = customConfig;
    const cfg = this.config;

    /**
     * Prepare
     */
    const cachedAnalyzerResult = await this._prepare(cfg);
    if (cachedAnalyzerResult) {
      return cachedAnalyzerResult;
    }

    /**
     * Traverse
     */
    const AnalyzerClass = /** @type {typeof Analyzer & {analyzeFile: FileAstTraverseFn}} */ (
      this.constructor
    );
    const queryOutput = await AnalyzerClass.analyzeProject({
      traverseEntryFn: AnalyzerClass.analyzeFile,
      projectPath: cfg.targetProjectPath,
      filePaths: cfg.targetFilePaths,
      targetData: this.targetData,
      config: this.config,
    });

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }

  /**
   * Gets a cached result from ReportService. Since ReportService slightly modifies analyzer
   * output, we 'unwind' before we return...
   * @param {{ analyzerName:AnalyzerName, identifier:string, cfg:AnalyzerConfigResolved}} config
   * @returns {AnalyzerResult|undefined}
   */
  static _getCachedAnalyzerResult({ analyzerName, identifier, cfg }) {
    const cachedResult = ReportService.getCachedResult({ analyzerName, identifier });
    if (!cachedResult) {
      return undefined;
    }
    if (!cfg.suppressNonCriticalLogs) {
      LogService.success(`cached version found for ${identifier}`);
    }

    const result = unwindJsonResult(cachedResult);
    result.analyzerMeta.__fromCache = true;
    return result;
  }
}
