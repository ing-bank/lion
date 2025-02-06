import { performance } from 'perf_hooks';
import nodeFs from 'fs';

import { InputDataService } from './core/InputDataService.js';
import { ReportService } from './core/ReportService.js';
import { QueryService } from './core/QueryService.js';
import { fsAdapter } from './utils/fs-adapter.js';
import { LogService } from './core/LogService.js';
import { AstService } from './core/AstService.js';

/**
 * @typedef {import('../../types/index.js').AnalyzerQueryResult} AnalyzerQueryResult
 * @typedef {import('../../types/index.js').AnalyzerQueryConfig} AnalyzerQueryConfig
 * @typedef {import('../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../types/index.js').GatherFilesConfig} GatherFilesConfig
 * @typedef {import('../../types/index.js').ProvidenceConfig} ProvidenceConfig
 * @typedef {import('../../types/index.js').QueryResult} QueryResult
 * @typedef {import('../../types/index.js').QueryConfig} QueryConfig
 */

/**
 * After handling a combo, we should know which project versions we have, since
 * the analyzer internally called createDataObject(which provides us the needed meta info).
 * @param {{queryResult: AnalyzerQueryResult; queryConfig: AnalyzerQueryConfig; providenceConfig: ProvidenceConfig}} opts
 */
function addToSearchTargetDepsFile({ queryResult, queryConfig, providenceConfig }) {
  const currentSearchTarget = queryConfig.analyzerConfig.targetProjectPath;
  // eslint-disable-next-line array-callback-return, consistent-return
  providenceConfig.targetProjectRootPaths.some(rootRepo => {
    const rootProjectMeta = InputDataService.getProjectMeta(rootRepo);

    if (currentSearchTarget.startsWith(rootRepo)) {
      const { name: depName, version: depVersion } = queryResult.meta.analyzerMeta.targetProject;

      // TODO: get version of root project as well. For now, we're good with just the name
      // const rootProj = pathLib.basename(rootRepo);
      const depProj = `${depName}#${depVersion}`;
      // Write to file... TODO: add to array first
      ReportService.writeEntryToSearchTargetDepsFile(depProj, rootProjectMeta);
      return true;
    }
  });
}

/**
 * @param {AnalyzerQueryResult} queryResult
 * @param {{outputPath:PathFromSystemRoot;report:boolean}} cfg
 */
function report(queryResult, cfg) {
  if (cfg.report && !queryResult.meta.analyzerMeta.__fromCache) {
    const { identifier } = queryResult.meta.analyzerMeta;
    ReportService.writeToJson(queryResult, identifier, cfg.outputPath);
  }
}

/**
 * Creates unique QueryConfig for analyzer turn
 * @param {AnalyzerQueryConfig} queryConfig
 * @param {PathFromSystemRoot} targetProjectPath
 * @param {PathFromSystemRoot} referenceProjectPath
 * @returns {Partial<AnalyzerQueryResult>}
 */
function getSlicedQueryConfig(queryConfig, targetProjectPath, referenceProjectPath) {
  return /** @type {Partial<AnalyzerQueryResult>} */ ({
    ...queryConfig,
    ...{
      analyzerConfig: {
        ...queryConfig.analyzerConfig,
        ...{
          ...(referenceProjectPath ? { referenceProjectPath } : {}),
          targetProjectPath,
        },
      },
    },
  });
}

/**
 * Definition "projectCombo": referenceProject#version + searchTargetProject#version
 * @param {AnalyzerQueryConfig} slicedQConfig
 * @param {{ gatherFilesConfig:GatherFilesConfig, gatherFilesConfigReference:GatherFilesConfig, skipCheckMatchCompatibility:boolean }} cfg
 */
async function handleAnalyzerForProjectCombo(slicedQConfig, cfg) {
  performance.mark(`${slicedQConfig.analyzerName}-start`);

  const queryResult = await QueryService.astSearch(slicedQConfig, {
    gatherFilesConfig: cfg.gatherFilesConfig,
    gatherFilesConfigReference: cfg.gatherFilesConfigReference,
    skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
    addSystemPathsInResult: cfg.addSystemPathsInResult,
    parser: cfg.parser,
    ...slicedQConfig.analyzerConfig,
  });

  performance.mark(`${slicedQConfig.analyzerName}-end`);
  const measurement = /** @type {* & PerformanceMeasure} */ (
    performance.measure(
      slicedQConfig.analyzerName,
      `${slicedQConfig.analyzerName}-start`,
      `${slicedQConfig.analyzerName}-end`,
    )
  );
  LogService.perf(measurement);

  if (queryResult) {
    report(queryResult, cfg);
  }
  return queryResult;
}

/**
 * Here, we will match all our reference projects (exports) against all our search targets
 * (imports).
 *
 * This is an expensive operation. Therefore, we allow caching.
 * For each project, we store 'commitHash' and 'version' meta data.
 * For each combination of referenceProject#version and searchTargetProject#version we
 * will create a json output file.
 * For its filename, it will create a hash based on referenceProject#version +
 * searchTargetProject#version + cfg of analyzer.
 * Whenever the generated hash already exists in previously stored query results,
 * we don't have to regenerate it.
 *
 * All the json outputs can be aggregated in our dashboard and visually presented in
 * various ways.
 *
 * @param {AnalyzerQueryConfig} queryConfig
 * @param {Partial<ProvidenceConfig>} cfg
 */
async function handleAnalyzer(queryConfig, cfg) {
  const queryResults = [];
  const { referenceProjectPaths, targetProjectPaths } = cfg;

  for (const searchTargetProject of targetProjectPaths) {
    if (referenceProjectPaths) {
      for (const ref of referenceProjectPaths) {
        // Create shallow cfg copy with just currrent reference folder
        const slicedQueryConfig = getSlicedQueryConfig(queryConfig, searchTargetProject, ref);
        const queryResult = await handleAnalyzerForProjectCombo(slicedQueryConfig, cfg);
        queryResults.push(queryResult);
        if (cfg.targetProjectRootPaths) {
          addToSearchTargetDepsFile({
            queryResult,
            queryConfig: slicedQueryConfig,
            providenceConfig: cfg,
          });
        }
      }
    } else {
      const slicedQueryConfig = getSlicedQueryConfig(queryConfig, searchTargetProject);
      const queryResult = await handleAnalyzerForProjectCombo(slicedQueryConfig, cfg);
      queryResults.push(queryResult);
      if (cfg.targetProjectRootPaths) {
        addToSearchTargetDepsFile({
          queryResult,
          queryConfig: slicedQueryConfig,
          providenceConfig: cfg,
        });
      }
    }
  }
  return queryResults;
}

/**
 * Creates a report with usage metrics, based on a queryConfig.
 *
 * @param {QueryConfig} queryConfig a query configuration object containing analyzerOptions.
 * @param {Partial<ProvidenceConfig>} customConfig
 * @return {Promise<QueryResult[]>}
 */
export async function providence(queryConfig, customConfig) {
  const tStart = performance.now();

  const cfg = /** @type {ProvidenceConfig} */ ({
    queryMethod: 'grep',
    // This is a merge of all 'main entry projects'
    // found in search-targets, including their children
    targetProjectPaths: null,
    referenceProjectPaths: null,
    // This will be needed to identify the parent/child relationship to write to
    // {outputFolder}/entryProjectDependencies.json, which will map
    // a project#version to [ depA#version, depB#version ]
    targetProjectRootPaths: null,
    gatherFilesConfig: {},
    report: true,
    debugEnabled: false,
    writeLogFile: false,
    skipCheckMatchCompatibility: false,
    measurePerformance: false,
    /** Allows to navigate to source file in code editor */
    addSystemPathsInResult: false,
    fallbackToBabel: false,
    fs: nodeFs,
    ...customConfig,
  });

  if (cfg.fs) {
    // Allow to mock fs for testing
    fsAdapter.setFs(cfg.fs);
  }

  if (cfg.debugEnabled) {
    LogService.debugEnabled = true;
  }

  if (cfg.referenceProjectPaths) {
    InputDataService.referenceProjectPaths = cfg.referenceProjectPaths;
  }

  if (cfg.fallbackToBabel) {
    AstService.fallbackToBabel = true;
  }

  const queryResults = await handleAnalyzer(queryConfig, cfg);

  if (cfg.writeLogFile) {
    LogService.writeLogFile();
  }

  const tEnd = performance.now();

  if (cfg.measurePerformance) {
    // eslint-disable-next-line no-console
    console.log(`completed in ${((tEnd - tStart) / 1000).toFixed(2)} seconds`);
  }
  return queryResults;
}

export const _providenceModule = {
  providence,
};
