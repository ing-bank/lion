import path from 'path';

import { getCurrentDir } from '../utils/get-current-dir.js';
import { LogService } from './LogService.js';

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
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').QueryConfig} QueryConfig
 * @typedef {import('../../../types/index.js').QueryResult} QueryResult
 * @typedef {import('../../../types/index.js').Feature} Feature
 * @typedef {import('./Analyzer.js').Analyzer} Analyzer
 */

export class QueryService {
  /**
   * Retrieves the default export found in ./program/analyzers/find-import.js
   * @param {typeof Analyzer} analyzerObjectOrString
   * @param {AnalyzerConfig} [analyzerConfig]
   * @returns {Promise<AnalyzerQueryConfig>}
   */
  static async getQueryConfigFromAnalyzer(analyzerObjectOrString, analyzerConfig) {
    let analyzer;
    if (typeof analyzerObjectOrString === 'string') {
      // Get it from our location(s) of predefined analyzers.
      // Mainly needed when this method is called via cli
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const module = /** @type {Analyzer} */ (
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
        LogService.error(e.toString());
        process.exit(1);
      }
    } else {
      // We don't need to import the analyzer, since we already have it
      analyzer = analyzerObjectOrString;
    }
    return /** @type {AnalyzerQueryConfig} */ ({
      type: 'ast-analyzer',
      analyzerName: /** @type {AnalyzerName} */ (analyzer.analyzerName),
      analyzerConfig,
      analyzer,
    });
  }

  /**
   * Perform ast analysis
   * @param {AnalyzerQueryConfig} analyzerQueryConfig
   * @param {AnalyzerConfig} [customConfig]
   * @returns {Promise<AnalyzerQueryResult>}
   */
  static async astSearch(analyzerQueryConfig, customConfig) {
    LogService.debug('started astSearch method');
    if (analyzerQueryConfig.type !== 'ast-analyzer') {
      LogService.error('Only analyzers supported for ast searches at the moment');
      process.exit(1);
    }

    // @ts-ignore
    // eslint-disable-next-line new-cap
    const analyzer = new analyzerQueryConfig.analyzer();
    const analyzerResult = await analyzer.execute(customConfig);
    if (!analyzerResult) {
      return analyzerResult;
    }
    const { queryOutput, analyzerMeta } = analyzerResult;
    const /** @type {AnalyzerQueryResult} */ queryResult = {
        meta: {
          searchType: 'ast-analyzer',
          analyzerMeta,
        },
        queryOutput,
      };
    return queryResult;
  }
}
QueryService.cacheDisabled = false;
QueryService.amountOfCachedProjects = 2;
