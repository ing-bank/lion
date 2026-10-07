import path from 'path';

import { getCurrentDir } from '../utils/get-current-dir.js';
import { AstService } from './AstService.js';
import { LogService } from './LogService.js';
// import { memoize } from '../utils/memoize.js';

/**
 * Identity stand-in for the utils memoize (kept local to avoid a require cycle).
 * @template {Function} T
 * @param {T} fn
 * @returns {T}
 */
const memoize = fn => fn;

/**
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerEntry} FindImportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').AnalyzerQueryConfig} AnalyzerQueryConfig
 * @typedef {import('../../../types/index.js').AnalyzerQueryResult} AnalyzerQueryResult
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').FeatureQueryConfig} FeatureQueryConfig
 * @typedef {import('../../../types/index.js').GatherFilesConfig} GatherFilesConfig
 * @typedef {import('../../../types/index.js').SearchQueryConfig} SearchQueryConfig
 * @typedef {import('../../../types/index.js').ProjectInputData} ProjectInputData
 * @typedef {import('../../../types/index.js').AnalyzerConfig} AnalyzerConfig
 * @typedef {import('../../../types/index.js').AnalyzerMeta} AnalyzerMeta
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').QueryConfig} QueryConfig
 * @typedef {import('../../../types/index.js').QueryResult} QueryResult
 * @typedef {import('../../../types/index.js').Feature} Feature
 * @typedef {import('../../../types/index.js').ProjectInputDataWithMeta} ProjectInputDataWithMeta
 * @typedef {typeof import('./Analyzer.js').Analyzer} AnalyzerClass
 * @typedef {import('./Analyzer.js').Analyzer} Analyzer
 */

const astProjectsDataCache = new Map();

export class QueryService {
  /**
   * Retrieves the default export found in ./program/analyzers/find-import.js
   * @param {AnalyzerClass|string} analyzerObjectOrString
   * @param {AnalyzerConfig} [analyzerConfig]
   * @returns {Promise<AnalyzerQueryConfig>}
   */
  static async getQueryConfigFromAnalyzer(analyzerObjectOrString, analyzerConfig) {
    /** @type {AnalyzerClass} */
    let analyzer;
    if (typeof analyzerObjectOrString === 'string') {
      // Get it from our location(s) of predefined analyzers.
      // Mainly needed when this method is called via cli
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const module = /** @type {{default: AnalyzerClass}} */ (
          await import(
            path.join(
              'file:///',
              path.resolve(
                getCurrentDir(import.meta.url),
                `../analyzers/${analyzerObjectOrString}.js`,
              ),
            )
          )
        );
        analyzer = module.default;
      } catch (e) {
        LogService.error(/** @type {Error} */ (e).toString());
        process.exit(1);
      }
    } else {
      // We don't need to import the analyzer, since we already have it
      analyzer = analyzerObjectOrString;
    }
    const { analyzerName } = analyzer;
    const analyzerInstance = /** @type {Analyzer} */ (/** @type {unknown} */ (analyzer));
    return /** @type {AnalyzerQueryConfig} */ ({
      type: 'ast-analyzer',
      analyzerName,
      analyzerConfig,
      analyzer: analyzerInstance,
    });
  }

  /**
   * Perform ast analysis
   * @param {AnalyzerQueryConfig} analyzerQueryConfig
   * @param {AnalyzerConfig} [customConfig]
   * @returns {Promise<AnalyzerQueryResult|undefined>}
   */
  static async astSearch(analyzerQueryConfig, customConfig) {
    LogService.debug('started astSearch method');
    if (analyzerQueryConfig.type !== 'ast-analyzer') {
      LogService.error('Only analyzers supported for ast searches at the moment');
      process.exit(1);
    }

    const AnalyzerCtor = /** @type {AnalyzerClass} */ (
      /** @type {unknown} */ (analyzerQueryConfig.analyzer)
    );
    // eslint-disable-next-line new-cap
    const analyzer = new AnalyzerCtor();
    const analyzerResult = await analyzer.execute(
      /** @type {Parameters<Analyzer['execute']>[0]} */ (customConfig),
    );
    if (!analyzerResult) {
      return analyzerResult;
    }
    const { queryOutput, analyzerMeta } = analyzerResult;
    const analyzerResultMeta = /** @type {AnalyzerMeta} */ (analyzerMeta);
    const /** @type {AnalyzerQueryResult} */ queryResult = {
        meta: {
          searchType: 'ast-analyzer',
          analyzerMeta: analyzerResultMeta,
        },
        queryOutput,
      };
    return queryResult;
  }

  /**
   * @param {ProjectInputDataWithMeta[]} projectsData
   * @param {AnalyzerAst} requiredAst
   */
  static async addAstToProjectsData(projectsData, requiredAst) {
    const resultWithAsts = [];

    for (const projectData of projectsData) {
      const cachedData = astProjectsDataCache.get(projectData.project.path);
      if (cachedData) {
        resultWithAsts.push(cachedData);
        continue; // eslint-disable-line no-continue
      }

      const resultEntries = [];
      for (const entry of projectData.entries) {
        const ast = await AstService.getAst(entry.context.code, requiredAst, {
          filePath: /** @type {PathFromSystemRoot} */ (entry.file),
        });
        resultEntries.push({ ...entry, ast });
      }
      const astData = { ...projectData, entries: resultEntries };
      this._addToProjectsDataCache(`${projectData.project.path}#${requiredAst}`, astData);
      resultWithAsts.push(astData);
    }

    return resultWithAsts;
  }

  /**
   * We need to make sure we don't run into memory issues (ASTs are huge),
   * so we only store one project in cache now. This will be a performance benefit for
   * lion-based-ui-cli, that runs providence consecutively for the same project
   * TODO: instead of storing one result in cache, use sizeof and a memory limit
   * to allow for more projects
   * @param {string} pathAndRequiredAst
   * @param {ProjectInputDataWithMeta} astData
   */
  static _addToProjectsDataCache(pathAndRequiredAst, astData) {
    if (this.cacheDisabled) {
      return;
    }
    // In order to prevent running out of memory, there is a limit to the number of
    // project ASTs in cache. For a session running multiple analyzers for reference
    if (astProjectsDataCache.size >= this.amountOfCachedProjects) {
      astProjectsDataCache.delete(astProjectsDataCache.keys().next().value);
    }
    astProjectsDataCache.set(pathAndRequiredAst, astData);
  }
}
QueryService.cacheDisabled = false;
QueryService.amountOfCachedProjects = 2;
QueryService.addAstToProjectsData = memoize(QueryService.addAstToProjectsData);
