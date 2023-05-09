/* eslint-disable no-continue */
const pathLib = require('path');
/* eslint-disable no-shadow, no-param-reassign */
const FindClassesAnalyzer = require('./find-classes.js');
const FindExportsAnalyzer = require('./find-exports.js');
const { Analyzer } = require('../core/Analyzer.js');
const { fromImportToExportPerspective } = require('./helpers/from-import-to-export-perspective.js');

/**
 * @typedef {import('../types/analyzers').FindClassesAnalyzerResult} FindClassesAnalyzerResult
 * @typedef {import('../types/analyzers').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 * @typedef {import('../types/analyzers').FindExportsAnalyzerResult} FindExportsAnalyzerResult
 * @typedef {import('../types/analyzers').IterableFindExportsAnalyzerEntry} IterableFindExportsAnalyzerEntry
 * @typedef {import('../types/analyzers').IterableFindImportsAnalyzerEntry} IterableFindImportsAnalyzerEntry
 * @typedef {import('../types/analyzers').ConciseMatchImportsAnalyzerResult} ConciseMatchImportsAnalyzerResult
 * @typedef {import('../types/analyzers').MatchImportsConfig} MatchImportsConfig
 * @typedef {import('../types/core').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../types/core').PathFromSystemRoot} PathFromSystemRoot
 */

function getMemberOverrides(
  refClassesAResult,
  classMatch,
  exportEntry,
  exportEntryResult,
  exportSpecifier,
) {
  if (!classMatch.members) return;
  const { rootFile } = exportEntryResult.rootFileMap.find(
    m => m.currentFileSpecifier === exportSpecifier,
  );

  const classFile = rootFile.file === '[current]' ? exportEntry.file : rootFile.file;

  // check which methods are overridden as well...?
  const entry = refClassesAResult.queryOutput.find(classEntry => classEntry.file === classFile);
  if (!entry) {
    // TODO: we should look in an external project for our classFile definition
    return;
  }

  const originalClass = entry.result.find(({ name }) => name === classMatch.rootFile.specifier);

  const methods = classMatch.members.methods.filter(m =>
    originalClass.members.methods.find(({ name }) => name === m.name),
  );
  const props = classMatch.members.methods.filter(m =>
    originalClass.members.methods.find(({ name }) => name === m.name),
  );

  // eslint-disable-next-line consistent-return
  return { methods, props };
}

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
 * @param {FindExportsAnalyzerResult} refExportsAnalyzerResult
 * @param {FindClassesAnalyzerResult} targetClassesAnalyzerResult
 * @param {FindClassesAnalyzerResult} refClassesAResult
 * @param {MatchSubclassesConfig} customConfig
 * @returns {AnalyzerQueryResult}
 */
async function matchSubclassesPostprocess(
  refExportsAnalyzerResult,
  targetClassesAnalyzerResult,
  refClassesAResult,
  customConfig,
) {
  // eslint-disable-next-line no-unused-vars
  const cfg = {
    ...customConfig,
  };

  /**
   * Step 1: a 'flat' data structure
   * @desc Create a key value storage map for exports/class matches
   * - key: `${exportSpecifier}::${normalizedSource}::${project}` from reference project
   * - value: an array of import file matches like `${targetProject}::${normalizedSource}::${className}`
   * @example
   * {
   *   'LionDialog::./reference-project/my/export.js::my-project' : {
   *      meta: {...},
   *      files: [
   *        'target-project-a::./import/file.js::MyDialog',
   *        'target-project-b::./another/import/file.js::MyOtherDialog'
   *      ],
   *    ]}
   * }
   */
  const resultsObj = {};

  for (const exportEntry of refExportsAnalyzerResult.queryOutput) {
    const exportsProjectObj = refExportsAnalyzerResult.analyzerMeta.targetProject;
    const exportsProjectName = exportsProjectObj.name;

    // Look for all specifiers that are exported, like [import {specifier} 'lion-based-ui/foo.js']
    for (const exportEntryResult of exportEntry.result) {
      if (!exportEntryResult.exportSpecifiers) {
        continue;
      }

      for (const exportSpecifier of exportEntryResult.exportSpecifiers) {
        // Get all unique imports (name::source::project combinations) that match current
        // exportSpecifier
        const filteredImportsList = new Set();
        const exportId = `${exportSpecifier}::${exportEntry.file}::${exportsProjectName}`;

        // eslint-disable-next-line no-shadow
        const importProject = targetClassesAnalyzerResult.analyzerMeta.targetProject.name;

        // TODO: What if this info is retrieved from cached importProject/target project?
        const importProjectPath = cfg.targetProjectPath;
        for (const { result, file } of targetClassesAnalyzerResult.queryOutput) {
          const importerFilePath = /** @type {PathFromSystemRoot} */ (
            pathLib.resolve(importProjectPath, file)
          );
          for (const classEntryResult of result) {
            /**
             * @example
             * Example context (read by 'find-classes'/'find-exports' analyzers)
             * - export (/folder/exporting-file.js):
             * `export class X {}`
             * - import (target-project-a/importing-file.js):
             * `import { X } from '@reference-repo/folder/exporting-file.js'
             *
             *  class Z extends Mixin(X) {}
             * `
             * Example variables (extracted by 'find-classes'/'find-exports' analyzers)
             * - exportSpecifier: 'X'
             * - superClasses: [{ name: 'X', ...}, { name: 'Mixin', ...}]
             */
            const classMatch =
              // [{ name: 'X', ...}, ...].find(klass => klass.name === 'X')
              classEntryResult.superClasses &&
              classEntryResult.superClasses.find(
                klass => klass.rootFile.specifier === exportSpecifier,
              );

            if (!classMatch) {
              continue;
            }

            /**
             * @example
             * - project "reference-project"
             * - exportFile './foo.js'
             * `export const z = 'bar'`
             * - project "target-project"
             * - importFile './file.js'
             * `import { z } from 'reference-project/foo.js'`
             */
            const isFromSameSource =
              exportEntry.file ===
              (await fromImportToExportPerspective({
                importee: classMatch.rootFile.file,
                importer: importerFilePath,
                importeeProjectPath: cfg.referenceProjectPath,
              }));

            if (classMatch && isFromSameSource) {
              const memberOverrides = getMemberOverrides(
                refClassesAResult,
                classMatch,
                exportEntry,
                exportEntryResult,
                exportSpecifier,
              );

              let projectFileId = `${importProject}::${file}::${classEntryResult.name}`;
              if (cfg.addSystemPathsInResult) {
                projectFileId += `::${importerFilePath}`;
              }

              filteredImportsList.add({
                projectFileId,
                memberOverrides,
              });
            }
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
   *     // name under which it is registered in npm ("name" attr in package.json)
   *     name: 'RefClass',
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
   *         { file:'./target-src/indirect-imports.js', className: 'X'},
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

      // Although we only handle 1 target project, this structure (matchesPerProject, assuming we
      // deal with multiple target projects)
      // allows for easy aggregation of data in dashboard.
      const matchesPerProject = [];
      flatResult.files.forEach(({ projectFileId, memberOverrides }) => {
        // eslint-disable-next-line no-shadow
        const [project, file, identifier, filePath] = projectFileId.split('::');
        let projectEntry = matchesPerProject.find(m => m.project === project);
        if (!projectEntry) {
          matchesPerProject.push({ project, files: [] });
          projectEntry = matchesPerProject[matchesPerProject.length - 1];
        }
        const entry = { file, identifier, memberOverrides };
        if (filePath) {
          // @ts-ignore
          entry.filePath = filePath;
        }
        projectEntry.files.push(entry);
      });

      return {
        exportSpecifier,
        matchesPerProject,
      };
    })
    .filter(r => Object.keys(r.matchesPerProject).length);

  return /** @type {AnalyzerQueryResult} */ resultsArray;
}

// function postProcessAnalyzerResult(aResult) {
//   // Don't bloat the analyzerResult with the outputs (just the configurations) of other analyzers
//   // delete aResult.analyzerMeta.configuration.targetClassesAnalyzerResult.queryOutput;
//   // delete aResult.analyzerMeta.configuration.exportsAnalyzerResult.queryOutput;
//   return aResult;
// }

class MatchSubclassesAnalyzer extends Analyzer {
  static get analyzerName() {
    return 'match-subclasses';
  }

  static get requiresReference() {
    return true;
  }

  /**
   * @desc Based on ExportsAnalyzerResult of reference project(s) (for instance lion-based-ui)
   * and targetClassesAnalyzerResult of search-targets (for instance my-app-using-lion-based-ui),
   * an overview is returned of all matching imports and exports.
   * @param {MatchSubclassesConfig} customConfig
   */
  async execute(customConfig = {}) {
    /**
     * @typedef MatchSubclassesConfig
     * @property {FindExportsConfig} [exportsConfig] These will be used when no exportsAnalyzerResult
     * is provided (recommended way)
     * @property {FindClassesConfig} [findClassesConfig]
     * @property {GatherFilesConfig} [gatherFilesConfig]
     * @property {GatherFilesConfig} [gatherFilesConfigReference]
     * @property {array} [referenceProjectPath] reference paths
     * @property {array} [targetProjectPath] search target paths
     */
    const cfg = {
      gatherFilesConfig: {},
      gatherFilesConfigReference: {},
      referenceProjectPath: null,
      targetProjectPath: null,
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
    const findExportsAnalyzer = new FindExportsAnalyzer();
    /** @type {FindExportsAnalyzerResult} */
    const refExportsAnalyzerResult = await findExportsAnalyzer.execute({
      targetProjectPath: cfg.referenceProjectPath,
      gatherFilesConfig: cfg.gatherFilesConfigReference,
      skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
      suppressNonCriticalLogs: true,
    });
    const findClassesAnalyzer = new FindClassesAnalyzer();
    /** @type {FindClassesAnalyzerResult} */
    const targetClassesAnalyzerResult = await findClassesAnalyzer.execute({
      targetProjectPath: cfg.targetProjectPath,
      skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
      suppressNonCriticalLogs: true,
    });
    const findRefClassesAnalyzer = new FindClassesAnalyzer();
    /** @type {FindClassesAnalyzerResult} */
    const refClassesAnalyzerResult = await findRefClassesAnalyzer.execute({
      targetProjectPath: cfg.referenceProjectPath,
      gatherFilesConfig: cfg.gatherFilesConfigReference,
      skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
      suppressNonCriticalLogs: true,
    });

    const queryOutput = await matchSubclassesPostprocess(
      refExportsAnalyzerResult,
      targetClassesAnalyzerResult,
      refClassesAnalyzerResult,
      cfg,
    );

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }
}

module.exports = MatchSubclassesAnalyzer;
