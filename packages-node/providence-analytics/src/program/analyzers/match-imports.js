/* eslint-disable no-continue */
import pathLib from 'path';
/* eslint-disable no-shadow, no-param-reassign */
import FindImportsAnalyzer from './find-imports.js';
import FindExportsAnalyzer from './find-exports.js';
import { Analyzer } from '../core/Analyzer.js';
import { fromImportToExportPerspective } from './helpers/from-import-to-export-perspective.js';
import { transformIntoIterableFindExportsOutput } from './helpers/transform-into-iterable-find-exports-output.js';
import { transformIntoIterableFindImportsOutput } from './helpers/transform-into-iterable-find-imports-output.js';

/**
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerResult} FindExportsAnalyzerResult
 * @typedef {import('../../../types/index.js').IterableFindExportsAnalyzerEntry} IterableFindExportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').IterableFindImportsAnalyzerEntry} IterableFindImportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').ConciseMatchImportsAnalyzerResult} ConciseMatchImportsAnalyzerResult
 * @typedef {import('../../../types/index.js').MatchImportsConfig} MatchImportsConfig
 * @typedef {import('../../../types/index.js').MatchImportsAnalyzerResult} MatchImportsAnalyzerResult
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 */

/**
 * Needed in case fromImportToExportPerspective does not have a
 * externalRootPath supplied.
 * @param {string} exportPath exportEntry.file
 * @param {PathRelativeFromProjectRoot} translatedImportPath result of fromImportToExportPerspective
 */
function compareImportAndExportPaths(exportPath, translatedImportPath) {
  return (
    exportPath === translatedImportPath ||
    exportPath === `${translatedImportPath}.js` ||
    exportPath === `${translatedImportPath}/index.js`
  );
}

/**
 * Makes a 'compatible resultsArray' (compatible with dashboard + tests + ...?) from
 * a conciseResultsArray.
 * @param {ConciseMatchImportsAnalyzerResult} conciseResultsArray
 * @param {string} importProject
 */
function createCompatibleMatchImportsResult(conciseResultsArray, importProject) {
  const compatibleResult = [];
  for (const matchedExportEntry of conciseResultsArray) {
    const [name, filePath, project] = matchedExportEntry.exportSpecifier.id.split('::');
    const exportSpecifier = {
      ...matchedExportEntry.exportSpecifier,
      name,
      filePath,
      project,
    };
    compatibleResult.push({
      exportSpecifier,
      matchesPerProject: [{ project: importProject, files: matchedExportEntry.importProjectFiles }],
    });
  }
  return compatibleResult;
}

/**
 * @param {FindExportsAnalyzerResult} exportsAnalyzerResult
 * @param {FindImportsAnalyzerResult} importsAnalyzerResult
 * @param {MatchImportsConfig} customConfig
 * @returns {Promise<MatchImportsAnalyzerResult>}
 */
async function matchImportsPostprocess(exportsAnalyzerResult, importsAnalyzerResult, customConfig) {
  const cfg = {
    ...customConfig,
  };

  // TODO: What if this info is retrieved from cached importProject/target project?
  const importProjectPath = cfg.targetProjectPath;

  // TODO: make find-import / export automatically output these, to improve perf...
  const iterableFindExportsOutput = transformIntoIterableFindExportsOutput(exportsAnalyzerResult);
  const iterableFindImportsOutput = transformIntoIterableFindImportsOutput(importsAnalyzerResult);

  /** @type {ConciseMatchImportsAnalyzerResult} */
  const conciseResultsArray = [];

  for (const exportEntry of iterableFindExportsOutput) {
    for (const importEntry of iterableFindImportsOutput) {
      /**
       * 1. Does target import ref specifier?
       *
       * Example context (read by 'find-imports'/'find-exports' analyzers)
       * - export (/folder/exporting-file.js):
       * `export const x = 'foo'`
       * - import (target-project-a/importing-file.js):
       * `import { x, y } from '@reference-repo/folder/exporting-file.js'`
       * Example variables (extracted by 'find-imports'/'find-exports' analyzers)
       * - exportSpecifier: 'x'
       * - importSpecifiers: ['x', 'y']
       * @type {boolean}
       */
      const hasExportSpecifierImported =
        exportEntry.specifier === importEntry.specifier || importEntry.specifier === '[*]';
      if (!hasExportSpecifierImported) {
        continue;
      }

      /**
       * 2. Are we from the same source?
       * A.k.a. is source required by target the same as the one found in target.
       * (we know the specifier name is the same, now we need to check the file as well.)
       *
       * Example:
       * exportFile './foo.js'
       * => export const z = 'bar'
       * importFile 'importing-target-project/file.js'
       * => import { z } from '@reference/foo.js'
       * @type {PathRelativeFromProjectRoot|null}
       */
      const fromImportToExport = await fromImportToExportPerspective({
        importee: importEntry.normalizedSource,
        importer: /** @type {PathFromSystemRoot} */ (
          pathLib.resolve(importProjectPath, importEntry.file)
        ),
        importeeProjectPath: cfg.referenceProjectPath,
      });
      const isFromSameSource = compareImportAndExportPaths(exportEntry.file, fromImportToExport);

      if (!isFromSameSource) {
        continue;
      }

      /**
       * 3. When above checks pass, we have a match.
       * Add it to the results array
       */
      const id = `${exportEntry.specifier}::${exportEntry.file}::${exportsAnalyzerResult.analyzerMeta.targetProject.name}`;
      const resultForCurrentExport = conciseResultsArray.find(
        entry => entry.exportSpecifier && entry.exportSpecifier.id === id,
      );
      if (resultForCurrentExport) {
        // Prevent that we count double import like "import * as all from 'x'" and "import {smth} from 'x'"
        if (!resultForCurrentExport.importProjectFiles.includes(importEntry.file)) {
          resultForCurrentExport.importProjectFiles.push(importEntry.file);
        }
      } else {
        conciseResultsArray.push({
          exportSpecifier: { id, ...(exportEntry.meta ? { meta: exportEntry.meta } : {}) },
          importProjectFiles: [importEntry.file],
        });
      }
    }
  }

  const importProject = importsAnalyzerResult.analyzerMeta.targetProject.name;
  return /** @type {AnalyzerQueryResult} */ (
    createCompatibleMatchImportsResult(conciseResultsArray, importProject)
  );
}

export default class MatchImportsAnalyzer extends Analyzer {
  /** @type {AnalyzerName} */
  static analyzerName = 'match-imports';

  static requiresReference = true;

  /**
   * Based on ExportsAnalyzerResult of reference project(s) (for instance lion-based-ui)
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
    const cachedAnalyzerResult = this._prepare(cfg);
    if (cachedAnalyzerResult) {
      return cachedAnalyzerResult;
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
        suppressNonCriticalLogs: true,
      });
    }

    let { targetProjectResult } = cfg;
    if (!targetProjectResult) {
      const findImportsAnalyzer = new FindImportsAnalyzer();
      targetProjectResult = await findImportsAnalyzer.execute({
        metaConfig: cfg.metaConfig,
        targetProjectPath: cfg.targetProjectPath,
        skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
        suppressNonCriticalLogs: true,
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
