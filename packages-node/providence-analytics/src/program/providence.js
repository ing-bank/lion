const deepmerge = require('deepmerge');
const { ReportService } = require('./core/ReportService.js');
const { InputDataService } = require('./core/InputDataService.js');
const { LogService } = require('./core/LogService.js');
const { QueryService } = require('./core/QueryService.js');

/**
 * @typedef {import('./types/core').ProvidenceConfig} ProvidenceConfig
 * @typedef {import('./types/core').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('./types/core').QueryResult} QueryResult
 * @typedef {import('./types/core').AnalyzerQueryResult} AnalyzerQueryResult
 * @typedef {import('./types/core').QueryConfig} QueryConfig
 * @typedef {import('./types/core').AnalyzerQueryConfig} AnalyzerQueryConfig
 * @typedef {import('./types/core').GatherFilesConfig} GatherFilesConfig
 */

/**
 * After handling a combo, we should know which project versions we have, since
 * the analyzer internally called createDataObject(which provides us the needed meta info).
 * @param {{queryResult: QueryResult; queryConfig: QueryConfig; providenceConfig: Partial<ProvidenceConfig>}} opts
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
 *
 * @param {AnalyzerQueryResult} queryResult
 * @param {{outputPath:PathFromSystemRoot}} cfg
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
  const queryResult = await QueryService.astSearch(slicedQConfig, {
    gatherFilesConfig: cfg.gatherFilesConfig,
    gatherFilesConfigReference: cfg.gatherFilesConfigReference,
    skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
    ...slicedQConfig.analyzerConfig,
  });
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

async function handleFeature(queryConfig, cfg, inputData) {
  if (cfg.queryMethod === 'grep') {
    const queryResult = await QueryService.grepSearch(inputData, queryConfig, {
      gatherFilesConfig: cfg.gatherFilesConfig,
      gatherFilesConfigReference: cfg.gatherFilesConfigReference,
    });
    return queryResult;
  }
  return undefined;
}

async function handleRegexSearch(queryConfig, cfg, inputData) {
  if (cfg.queryMethod === 'grep') {
    const queryResult = await QueryService.grepSearch(inputData, queryConfig, {
      gatherFilesConfig: cfg.gatherFilesConfig,
      gatherFilesConfigReference: cfg.gatherFilesConfigReference,
    });
    return queryResult;
  }
  return undefined;
}

/**
 * Creates a report with usage metrics, based on a queryConfig.
 *
 * @param {QueryConfig} queryConfig a query configuration object containing analyzerOptions.
 * @param {Partial<ProvidenceConfig>} customConfig
 */
async function providenceMain(queryConfig, customConfig) {
  const cfg = deepmerge(
    {
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
    },
    customConfig,
  );

  if (cfg.debugEnabled) {
    LogService.debugEnabled = true;
  }

  if (cfg.referenceProjectPaths) {
    InputDataService.referenceProjectPaths = cfg.referenceProjectPaths;
  }

  let queryResults;
  if (queryConfig.type === 'ast-analyzer') {
    queryResults = await handleAnalyzer(queryConfig, cfg);
  } else {
    const inputData = InputDataService.createDataObject(
      cfg.targetProjectPaths,
      cfg.gatherFilesConfig,
    );

    if (queryConfig.type === 'feature') {
      queryResults = await handleFeature(queryConfig, cfg, inputData);
      report(queryResults, cfg);
    } else if (queryConfig.type === 'search') {
      queryResults = await handleRegexSearch(queryConfig, cfg, inputData);
      report(queryResults, cfg);
    }
  }

  if (cfg.writeLogFile) {
    LogService.writeLogFile();
  }

  return queryResults;
}

module.exports = {
  providence: providenceMain,
};
