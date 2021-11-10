const pathLib = require('path');
/* eslint-disable no-shadow, no-param-reassign */
const FindImportsAnalyzer = require('./find-imports.js');
const FindExportsAnalyzer = require('./find-exports.js');
const { Analyzer } = require('./helpers/Analyzer.js');
const { fromImportToExportPerspective } = require('./helpers/from-import-to-export-perspective.js');

/**
 * Helper method for matchImportsPostprocess. Modifies its resultsObj
 * @param {object} resultsObj
 * @param {string} exportId like 'myExport::./reference-project/my/export.js::my-project'
 * @param {Set<string>} filteredList
 */
function storeResult(resultsObj, exportId, filteredList, meta) {
  if (!resultsObj[exportId]) {
    // eslint-disable-next-line no-param-reassign
    resultsObj[exportId] = { meta };
  }
  // eslint-disable-next-line no-param-reassign
  resultsObj[exportId].files = [...(resultsObj[exportId].files || []), ...Array.from(filteredList)];
}

/**
 * Needed in case fromImportToExportPerspective does not have a
 * externalRootPath supplied.
 * @param {string} exportPath exportEntry.file
 * @param {string} translatedImportPath result of fromImportToExportPerspective
 */
function compareImportAndExportPaths(exportPath, translatedImportPath) {
  return (
    exportPath === translatedImportPath ||
    exportPath === `${translatedImportPath}.js` ||
    exportPath === `${translatedImportPath}/index.js`
  );
}

/**
 * @param {FindExportsAnalyzerResult} exportsAnalyzerResult
 * @param {FindImportsAnalyzerResult} importsAnalyzerResult
 * @param {matchImportsConfig} customConfig
 * @returns {Promise<AnalyzerResult>}
 */
async function matchImportsPostprocess(exportsAnalyzerResult, importsAnalyzerResult, customConfig) {
  // eslint-disable-next-line no-unused-vars
  const cfg = {
    ...customConfig,
  };

  /**
   * Step 1: a 'flat' data structure
   * @desc Create a key value storage map for exports/imports matches
   * - key: `${exportSpecifier}::${normalizedSource}::${project}` from reference project
   * - value: an array of import file matches like `${targetProject}::${normalizedSource}`
   * @example
   * {
   *   'myExport::./reference-project/my/export.js::my-project' : {
   *      meta: {...},
   *      files: [
   *        'target-project-a::./import/file.js',
   *        'target-project-b::./another/import/file.js'
   *      ],
   *    ]}
   * }
   */
  const resultsObj = {};

  // console.log(JSON.stringify(importsAnalyzerResult.queryOutput, null, 2));
  const importProject = importsAnalyzerResult.analyzerMeta.targetProject.name;
  // TODO: What if this info is retrieved from cached importProject/target project?
  const importProjectPath = cfg.targetProjectPath;

  for (const exportEntry of exportsAnalyzerResult.queryOutput) {
    const exportsProjectObj = exportsAnalyzerResult.analyzerMeta.targetProject;

    // Look for all specifiers that are exported, like [import {specifier} 'lion-based-ui/foo.js']
    for (const exportEntryResult of exportEntry.result) {
      if (!exportEntryResult.exportSpecifiers) {
        break;
      }

      for (const exportSpecifier of exportEntryResult.exportSpecifiers) {
        // Get all unique imports (name::source::project combinations) that match current exportSpecifier
        const filteredImportsList = new Set();
        const exportId = `${exportSpecifier}::${exportEntry.file}::${exportsProjectObj.name}`;

        for (const { result, file } of importsAnalyzerResult.queryOutput) {
          for (const importEntryResult of result) {
            if (exportSpecifier === '[default]') {
              console.log('importEntryResult.importSpecifiers', importEntryResult.importSpecifiers);
            }
            /**
             * @example
             * Example context (read by 'find-imports'/'find-exports' analyzers)
             * - export (/folder/exporting-file.js):
             * `export const x = 'foo'`
             * - import (target-project-a/importing-file.js):
             * `import { x, y } from '@reference-repo/folder/exporting-file.js'`
             * Example variables (extracted by 'find-imports'/'find-exports' analyzers)
             * - exportSpecifier: 'x'
             * - importSpecifiers: ['x', 'y']
             */
            const hasExportSpecifierImported =
              // ['x', 'y'].includes('x')
              importEntryResult.importSpecifiers.includes(exportSpecifier) ||
              importEntryResult.importSpecifiers.includes('[*]');

            if (!hasExportSpecifierImported) {
              if (exportId === '[default]::./ref-src/core.js::exporting-ref-project') {
                console.log(
                  '--> !hasExportSpecifierImported',
                  importEntryResult.normalizedSource,
                  importEntryResult.importSpecifiers,
                );
              }
              break;
            }

            /**
             * @example
             * exportFile './foo.js'
             * => export const z = 'bar'
             * importFile 'importing-target-project/file.js'
             * => import { z } from '@reference/foo.js'
             */
            const fromImportToExport = await fromImportToExportPerspective({
              importee: importEntryResult.normalizedSource,
              importer: pathLib.resolve(importProjectPath, file),
            });
            const isFromSameSource = compareImportAndExportPaths(
              exportEntry.file,
              fromImportToExport,
            );

            if (!isFromSameSource) {
              // if (exportId === '[default]::./ref-src/core.js::exporting-ref-project') {
              //   console.log(
              //     '--> !isFromSameSource',
              //     `${exportId}`,
              //     { 'exportEntry.file': exportEntry.file, fromImportToExport },
              //     {
              //       importee: importEntryResult.normalizedSource,
              //       importer: pathLib.resolve(importProjectPath, file),
              //     },
              //   );
              // }
              if (exportId === '[default]::./ref-src/core.js::exporting-ref-project') {
                console.log('--> !isFromSameSource', importEntryResult.normalizedSource);
              }
              break;
            }
            if (exportId === '[default]::./ref-src/core.js::exporting-ref-project') {
              console.log('--> add', importEntryResult.normalizedSource);
            }
            // TODO: transitive deps recognition? Could also be distinct post processor

            filteredImportsList.add(`${importProject}::${file}`);
          }
        }
        storeResult(resultsObj, exportId, filteredImportsList, exportEntry.meta);
      }
    }
  }

  /**
   * Step 2: a rich data structure
   * @desc Transform resultObj from step 1 into an array of objects
   * @example
   * [{
   *   exportSpecifier: {
   *     name: 'RefClass',
   *     // name under which it is registered in npm ("name" attr in package.json)
   *     project: 'exporting-ref-project',
   *     filePath: './ref-src/core.js',
   *     id: 'RefClass::ref-src/core.js::exporting-ref-project',
   *     meta: {...},
   *
   *     // most likely via post processor
   *   },
   *   // All the matched targets (files importing the specifier), ordered per project
   *   matchesPerProject: [
   *     {
   *       project: 'importing-target-project',
   *       files: [
   *         './target-src/indirect-imports.js',
   *         ...
   *       ],
   *     },
   *     ...
   *   ],
   * }]
   */
  const resultsArray = Object.entries(resultsObj)
    .map(([id, flatResult]) => {
      const [exportSpecifierName, filePath, project] = id.split('::');
      const { meta } = flatResult;

      const exportSpecifier = {
        name: exportSpecifierName,
        project,
        filePath,
        id,
        ...(meta || {}),
      };

      const matchesPerProject = [];
      flatResult.files.forEach(projectFile => {
        // eslint-disable-next-line no-shadow
        const [project, file] = projectFile.split('::');
        let projectEntry = matchesPerProject.find(m => m.project === project);
        if (!projectEntry) {
          matchesPerProject.push({ project, files: [] });
          projectEntry = matchesPerProject[matchesPerProject.length - 1];
        }
        projectEntry.files.push(file);
      });

      return {
        exportSpecifier,
        matchesPerProject,
      };
    })
    .filter(r => Object.keys(r.matchesPerProject).length);

  return /** @type {AnalyzerResult} */ resultsArray;
}

class MatchImportsAnalyzer extends Analyzer {
  constructor() {
    super();
    this.name = 'match-imports';
  }

  static get requiresReference() {
    return true;
  }

  /**
   * @desc Based on ExportsAnalyzerResult of reference project(s) (for instance lion-based-ui)
   * and ImportsAnalyzerResult of search-targets (for instance my-app-using-lion-based-ui),
   * an overview is returned of all matching imports and exports.
   * @param {MatchImportsConfig} customConfig
   */
  async execute(customConfig = {}) {
    /**
     * @typedef MatchImportsConfig
     * @property {FindExportsConfig} [exportsConfig] These will be used when no exportsAnalyzerResult
     * is provided (recommended way)
     * @property {FindImportsConfig} [importsConfig]
     * @property {GatherFilesConfig} [gatherFilesConfig]
     * @property {array} [referenceProjectPath] reference paths
     * @property {array} [targetProjectPath] search target paths
     * @property {FindImportsAnalyzerResult} [targetProjectResult]
     * @property {FindExportsAnalyzerResult} [referenceProjectResult]
     */
    const cfg = {
      gatherFilesConfig: {},
      referenceProjectPath: null,
      targetProjectPath: null,
      targetProjectResult: null,
      referenceProjectResult: null,
      ...customConfig,
    };

    /**
     * Prepare
     */
    const analyzerResult = this._prepare(cfg);

    if (analyzerResult) {
      return analyzerResult;
    }

    /**
     * Traverse
     */
    let { referenceProjectResult } = cfg;
    if (!referenceProjectResult) {
      const findExportsAnalyzer = new FindExportsAnalyzer();
      referenceProjectResult = await findExportsAnalyzer.execute({
        metaConfig: cfg.metaConfig,
        targetProjectPath: cfg.referenceProjectPath,
        skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
      });
    }

    let { targetProjectResult } = cfg;
    if (!targetProjectResult) {
      const findImportsAnalyzer = new FindImportsAnalyzer();
      targetProjectResult = await findImportsAnalyzer.execute({
        metaConfig: cfg.metaConfig,
        targetProjectPath: cfg.targetProjectPath,
        skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
      });
    }

    const queryOutput = await matchImportsPostprocess(
      referenceProjectResult,
      targetProjectResult,
      cfg,
    );

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }
}

module.exports = MatchImportsAnalyzer;
