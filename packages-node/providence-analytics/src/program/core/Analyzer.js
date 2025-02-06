/* eslint-disable no-param-reassign */
import semver from 'semver';
import path from 'path';

import { getFilePathRelativeFromRoot } from '../utils/get-file-path-relative-from-root.js';
import { InputDataService } from './InputDataService.js';
import { toPosixPath } from '../utils/to-posix-path.js';
import { ReportService } from './ReportService.js';
import { QueryService } from './QueryService.js';
import { LogService } from './LogService.js';

/**
 * @typedef {(ast: File, astContext: {code:string; relativePath:string; projectData: ProjectInputDataWithMeta}) => object} FileAstTraverseFn
 * @typedef {import('../../../types/index.js').ProjectInputDataWithMeta} ProjectInputDataWithMeta
 * @typedef {import('../../../types/index.js').AnalyzerQueryResult} AnalyzerQueryResult
 * @typedef {import('../../../types/index.js').MatchAnalyzerConfig} MatchAnalyzerConfig
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').ProjectInputData} ProjectInputData
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').QueryOutput} QueryOutput
 * @typedef {import("@swc/core").Module} SwcAstModule
 * @typedef {import('@babel/types').File} File
 */

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
 * @param {ProjectInputDataWithMeta} projectData
 * @param {function} astAnalysis
 * @param {object} analyzerCfg
 */
async function analyzePerAstFile(projectData, astAnalysis, analyzerCfg) {
  const entries = [];
  for (const { file, ast, context: astContext } of projectData.entries) {
    const relativePath = getFilePathRelativeFromRoot(file, projectData.project.path);
    const context = { code: astContext.code, relativePath, projectData, analyzerCfg };

    const fullPath = path.resolve(projectData.project.path, file);
    LogService.debug(`[analyzePerAstFile]: ${fullPath}`);

    // We do a try and catch here, so that unparseable files do not block all metrics we're gathering in a run
    try {
      const { result, meta } = await astAnalysis(ast, context);
      entries.push({ file: relativePath, meta, result });
    } catch (/** @type {* & Error} */ e) {
      LogService.error(`[analyzePerAstFile]: ${fullPath} throws: ${e.message}. Cause: ${e.cause}`);
    }
  }
  const filteredEntries = entries.filter(({ result }) => Boolean(result.length));
  return filteredEntries;
}

/**
 * Transforms QueryResult entries to posix path notations on Windows
 * @param {object[]|object} data
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
        data[k] = toPosixPath(v);
      }
    });
  }
}

/**
 * This method ensures that the result returned by an analyzer always has a consistent format.
 * By returning the configuration for the queryOutput, it will be possible to run later queries
 * under the same circumstances
 * @param {QueryOutput} queryOutput
 * @param {object} cfg
 * @param {Analyzer} analyzer
 */
function ensureAnalyzerResultFormat(queryOutput, cfg, analyzer) {
  const { targetProjectMeta, identifier, referenceProjectMeta } = analyzer;
  const optional = {};
  if (targetProjectMeta) {
    optional.targetProject = { ...targetProjectMeta };
    delete optional.targetProject.path; // get rid of machine specific info
  }
  if (referenceProjectMeta) {
    optional.referenceProject = { ...referenceProjectMeta };
    delete optional.referenceProject.path; // get rid of machine specific info
  }

  /** @type {AnalyzerQueryResult} */
  const aResult = {
    queryOutput,
    analyzerMeta: {
      name: analyzer.constructor.analyzerName,
      requiredAst: analyzer.constructor.requiredAst,
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
      if (projectOutput.project) {
        delete projectOutput.project.path;
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
 */
function unwindJsonResult(targetOrReferenceProjectResult) {
  const { queryOutput } = targetOrReferenceProjectResult;
  const { analyzerMeta } = targetOrReferenceProjectResult.meta;
  return { queryOutput, analyzerMeta };
}

export class Analyzer {
  static requiresReference = false;

  /** @type {AnalyzerAst} */
  static requiredAst = 'babel';

  /** @type {AnalyzerName} */
  static analyzerName = '';

  name = /** @type  {typeof Analyzer} */ (this.constructor).analyzerName;

  _customConfig = {};

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
   * @param {MatchAnalyzerConfig} cfg
   */
  static __unwindProvidedResults(cfg) {
    if (cfg.targetProjectResult && !cfg.targetProjectResult?.analyzerMeta) {
      cfg.targetProjectResult = unwindJsonResult(cfg.targetProjectResult);
    }
    if (cfg.referenceProjectResult && !cfg.referenceProjectResult?.analyzerMeta) {
      cfg.referenceProjectResult = unwindJsonResult(cfg.referenceProjectResult);
    }
  }

  /**
   * @param {AnalyzerConfig} cfg
   * @returns {CachedAnalyzerResult|undefined}
   */
  async _prepare(cfg) {
    LogService.debug(`Analyzer "${this.name}": started _prepare method`);
    /** @type {typeof Analyzer} */ (this.constructor).__unwindProvidedResults(cfg);

    if (!cfg.targetProjectResult) {
      this.targetProjectMeta = InputDataService.getProjectMeta(cfg.targetProjectPath);
    } else {
      this.targetProjectMeta = cfg.targetProjectResult.analyzerMeta.targetProject;
    }

    if (cfg.referenceProjectPath && !cfg.referenceProjectResult) {
      this.referenceProjectMeta = InputDataService.getProjectMeta(cfg.referenceProjectPath);
    } else if (cfg.referenceProjectResult) {
      this.referenceProjectMeta = cfg.referenceProjectResult.analyzerMeta.targetProject;
    }

    /**
     * Create a unique hash based on target, reference and configuration
     */
    this.identifier = ReportService.createIdentifier({
      targetProject: this.targetProjectMeta,
      referenceProject: this.referenceProjectMeta,
      analyzerConfig: cfg,
    });

    // If we have a provided result cfg.referenceProjectResult, we assume the providing
    // party provides compatible results for now...
    if (cfg.referenceProjectPath && !cfg.skipCheckMatchCompatibility) {
      const { compatible, reason } = checkForMatchCompatibility(
        cfg.referenceProjectPath,
        cfg.targetProjectPath,
      );

      if (!compatible) {
        if (!cfg.suppressNonCriticalLogs) {
          LogService.info(
            `${LogService.pad(`skipping ${this.name} (${reason})`)}${displayProjectsInLog(this.identifier)}`,
          );
        }
        return ensureAnalyzerResultFormat(`[${reason}]`, cfg, this);
      }
    }

    /**
     * See if we maybe already have our result in cache in the file-system.
     */
    const cachedResult = Analyzer._getCachedAnalyzerResult({
      analyzerName: this.name,
      identifier: this.identifier,
      cfg,
    });

    if (cachedResult) {
      return cachedResult;
    }

    if (!cfg.suppressNonCriticalLogs) {
      LogService.info(
        `${LogService.pad(`starting ${this.name}`)}${displayProjectsInLog(this.identifier)}`,
      );
    }

    /**
     * Get reference and search-target data
     */
    if (!cfg.targetProjectResult) {
      performance.mark('analyzer--prepare--createDTarg-start');
      this.targetData = await InputDataService.createDataObject(
        [cfg.targetProjectPath],
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
   * @param {AnalyzerConfig} cfg
   * @returns {AnalyzerQueryResult}
   */
  _finalize(queryOutput, cfg) {
    LogService.debug(`Analyzer "${this.name}": started _finalize method`);

    performance.mark('analyzer--finalize-start');
    const analyzerResult = ensureAnalyzerResultFormat(queryOutput, cfg, this);
    if (!cfg.suppressNonCriticalLogs) {
      LogService.success(
        `${LogService.pad(`finished ${this.name}`)}${displayProjectsInLog(this.identifier)}`,
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
   * @param {FileAstTraverseFn|{traverseEntryFn: FileAstTraverseFn; filePaths:string[]; projectPath: string; targetData: ProjectInputDataWithMeta}} analyzeFileCfg
   */
  static async analyzeProject(analyzeFileCfg) {
    LogService.debug(`Analyzer "${this.name}": started _traverse method`);

    let finalTargetData;
    if (!analyzeFileCfg.filePaths) {
      finalTargetData = analyzeFileCfg.targetData;
    } else {
      const { projectPath, projectName } = analyzeFileCfg;
      if (!projectPath) {
        LogService.error(`[Analyzer._traverse]: you must provide a projectPath`);
      }
      finalTargetData = await InputDataService.createDataObject([
        {
          project: {
            name: projectName || '[n/a]',
            path: projectPath,
          },
          entries: analyzeFileCfg.filePaths,
        },
      ]);
    }

    /**
     * Create ASTs for our inputData
     */
    const astDataProjects = await QueryService.addAstToProjectsData(
      finalTargetData,
      analyzeFileCfg.config.parser || this.requiredAst,
    );
    return analyzePerAstFile(
      astDataProjects[0],
      analyzeFileCfg.traverseEntryFn,
      analyzeFileCfg.config,
    );
  }

  /**
   * Finds export specifiers and sources
   * @param {FindExportsConfig} customConfig
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
    const queryOutput = await /** @type {typeof Analyzer} */ (this.constructor).analyzeProject({
      // @ts-ignore
      traverseEntryFn: this.constructor.analyzeFile,
      projectPath: cfg.targetProjectPath,
      filePaths: cfg.targetFilePaths,
      targetData: this.targetData,
      config: cfg,
    });

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }

  /**
   * Gets a cached result from ReportService. Since ReportService slightly modifies analyzer
   * output, we 'unwind' before we return...
   * @param {{ analyzerName:AnalyzerName, identifier:string, cfg:AnalyzerConfig}} config
   * @returns {AnalyzerQueryResult|undefined}
   */
  static _getCachedAnalyzerResult({ analyzerName, identifier, cfg }) {
    const cachedResult = ReportService.getCachedResult({ analyzerName, identifier });
    if (!cachedResult) {
      return undefined;
    }
    if (!cfg.suppressNonCriticalLogs) {
      LogService.success(`cached version found for ${identifier}`);
    }

    /** @type {AnalyzerQueryResult} */
    const result = unwindJsonResult(cachedResult);
    result.analyzerMeta.__fromCache = true;
    return result;
  }
}
