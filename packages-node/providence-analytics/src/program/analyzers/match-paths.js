/* eslint-disable no-shadow, no-param-reassign */
import MatchSubclassesAnalyzer from './match-subclasses.js';
import FindExportsAnalyzer from './find-exports.js';
import FindCustomelementsAnalyzer from './find-customelements.js';
import { Analyzer } from '../core/Analyzer.js';

/**
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerMeta} AnalyzerMeta
 * @typedef {import('../../../types/index.js').AnalyzerQueryResult} AnalyzerQueryResult
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerResult} FindExportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerEntry} FindExportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').FindCustomelementsAnalyzerResult} FindCustomelementsAnalyzerResult
 * @typedef {import('../../../types/index.js').MatchSubclassesAnalyzerResult} MatchSubclassesAnalyzerResult
 * @typedef {import('../../../types/index.js').MatchedExportSpecifier} MatchedExportSpecifier
 * @typedef {import('../../../types/index.js').RootFile} RootFile
 * @typedef {import('../../../types/index.js').GatherFilesConfig} GatherFilesConfig
 * @typedef {import('../../../types/index.js').QueryOutput} QueryOutput
 * @typedef {import('../core/Analyzer.js').AnalyzerConfigResolved} AnalyzerConfigResolved
 * @typedef {FindExportsAnalyzerResult & { analyzerMeta: AnalyzerMeta }} FindExportsResultWithMeta
 * @typedef {AnalyzerConfigResolved & { prefix?: { from: string; to: string } | null }} MatchClasspathsConfig
 * @typedef {{ from: string; to: string }} PathMapping
 * @typedef {{ name: string; variable?: { from: string; to: string; paths: PathMapping[] }; tag?: { from: string; to: string; paths: PathMapping[] } }} MatchPathsAnalyzerOutputFile
 * @typedef {{ exportSpecifier: MatchedExportSpecifier }} MatchSubclassEntry
 * @typedef {{ file: string; tagName: string }} TagResult
 * @typedef {{ targetResult?: TagResult; refResult?: TagResult }} TagPathsResult
 */

/**
 * For prefix `{ from: 'lion', to: 'wolf' }`
 *
 * Keeps
 * - WolfCheckbox (extended from LionCheckbox)
 * - wolf-checkbox (extended from lion-checkbox)
 *
 * Removes
 * - SheepCheckbox (extended from LionCheckbox)
 * - WolfTickButton (extended from LionCheckbox)
 * - sheep-checkbox (extended from lion-checkbox)
 * - etc...
 * @param {MatchPathsAnalyzerOutputFile[]} queryOutput
 * @param {{from:string, to:string}} prefix
 */
function filterPrefixMatches(queryOutput, prefix) {
  const capitalize = (/** @type {string} */ prefixStr) =>
    `${prefixStr[0].toUpperCase()}${prefixStr.slice(1)}`;

  const filteredQueryOutput = queryOutput
    .map(e => {
      let keepVariable = false;
      let keepTag = false;
      if (e.variable) {
        const fromUnprefixed = e.variable.from.replace(capitalize(prefix.from), '');
        const toUnprefixed = e.variable.to.replace(capitalize(prefix.to), '');
        keepVariable = fromUnprefixed === toUnprefixed;
      }
      if (e.tag) {
        const fromUnprefixed = e.tag.from.replace(prefix.from, '');
        const toUnprefixed = e.tag.to.replace(prefix.to, '');
        keepTag = fromUnprefixed === toUnprefixed;
      }

      /** @type {MatchPathsAnalyzerOutputFile} */
      const result = {
        name: e.name,
        ...(keepVariable ? { variable: e.variable } : {}),
        ...(keepTag ? { tag: e.tag } : {}),
      };
      return result;
    })
    .filter(e => e.tag || e.variable);

  return filteredQueryOutput;
}

/**
 *
 * @param {MatchedExportSpecifier} matchSubclassesExportSpecifier
 * @param {FindExportsAnalyzerResult} refFindExportsResult
 * @returns {RootFile|undefined}
 */
function getExportSpecifierRootFile(matchSubclassesExportSpecifier, refFindExportsResult) {
  /* eslint-disable arrow-body-style */
  /** @type {RootFile|undefined} */
  let rootFile;
  refFindExportsResult.queryOutput.some(exportEntry => {
    return exportEntry.result.some(exportEntryResult => {
      if (!exportEntryResult.exportSpecifiers) {
        return false;
      }
      /** @type {RootFile} */
      exportEntryResult.exportSpecifiers.some(exportSpecifierString => {
        const { name, filePath } = matchSubclassesExportSpecifier;
        if (name === exportSpecifierString && filePath === exportEntry.file) {
          const entry = exportEntryResult.rootFileMap.find(
            rfEntry => rfEntry.currentFileSpecifier === name,
          );
          if (entry) {
            rootFile = entry.rootFile;
            if (rootFile.file === '[current]') {
              rootFile.file = filePath;
            }
          }
        }
        return false;
      });
      return Boolean(rootFile);
    });
  });
  return rootFile;
  /* eslint-enable arrow-body-style */
}

/**
 * @param {string[]} targetPaths
 * @param {FindExportsResultWithMeta} targetExportsResult
 * @returns {string|undefined}
 */
function getClosestToRootTargetPath(targetPaths, targetExportsResult) {
  /** @type {string|undefined} */
  let targetPath;
  const { mainEntry } = targetExportsResult.analyzerMeta.targetProject;
  if (targetPaths.includes(mainEntry)) {
    targetPath = mainEntry;
  } else {
    // sort targetPaths: paths closest to root 'win'
    [targetPath] = targetPaths.sort((a, b) => a.split('/').length - b.split('/').length);
  }
  return targetPath;
}

/**
 * @param {FindExportsAnalyzerResult} targetExportsResult
 * @param {FindExportsAnalyzerResult} refFindExportsResult
 * @param {string} targetMatchedFile file where `toClass` from match-subclasses is defined
 * @param {string} fromClass Identifier exported by reference project, for instance LionCheckbox
 * @param {string} toClass Identifier exported by target project, for instance WolfCheckbox
 * @param {string} refProjectName for instance @lion/checkbox
 * @returns {PathMapping[]|undefined}
 */
function getVariablePaths(
  targetExportsResult,
  refFindExportsResult,
  targetMatchedFile,
  fromClass,
  toClass,
  refProjectName,
) {
  /* eslint-disable arrow-body-style */

  /**
   * finds all paths that export WolfCheckbox
   * @example ['./src/WolfCheckbox.js', './index.js']
   * @type {string[]}
   */
  const targetPaths = [];

  targetExportsResult.queryOutput.forEach(({ file: targetExportsFile, result }) => {
    // Find the FindExportAnalyzerEntry with the same rootFile as the rootPath of match-subclasses
    // (targetMatchedFile)
    const targetPathMatch = result.find(targetExportsEntry => {
      return targetExportsEntry.rootFileMap.find(rootFileMapEntry => {
        if (!rootFileMapEntry) {
          return false;
        }
        const { rootFile } = rootFileMapEntry;
        if (rootFile.specifier !== toClass) {
          return false;
        }
        if (rootFile.file === '[current]') {
          return targetExportsFile === targetMatchedFile;
        }
        return rootFile.file === targetMatchedFile;
      });
    });
    if (targetPathMatch) {
      targetPaths.push(targetExportsFile);
    }
  });

  if (!targetPaths.length) {
    return undefined; // there would be nothing to replace
  }

  const targetPath = getClosestToRootTargetPath(
    targetPaths,
    /** @type {FindExportsResultWithMeta} */ (/** @type {unknown} */ (targetExportsResult)),
  );

  // [A3]
  /**
   * finds all paths that import LionCheckbox
   * @example ['./packages/checkbox/src/LionCheckbox.js', './index.js']
   * @type {string[]}
   */
  const refPaths = [];
  refFindExportsResult.queryOutput.forEach(({ file, result }) => {
    const refPathMatch = result.find(entry => {
      const entryWithLocalMap =
        /** @type {FindExportsAnalyzerEntry & { localMap?: { exported?: string }[] }} */ (entry);
      if (entryWithLocalMap.exportSpecifiers.includes(fromClass)) {
        return true;
      }
      // if we're dealing with `export {x as y}`...
      if (
        entryWithLocalMap.localMap &&
        entryWithLocalMap.localMap.find(({ exported }) => exported === fromClass)
      ) {
        return true;
      }
      return false;
    });
    if (refPathMatch) {
      refPaths.push(file);
    }
  });

  const paths = refPaths.map(refP => ({ from: refP, to: /** @type {string} */ (targetPath) }));

  // Add all paths with project prefix as well.
  const projectPrefixedPaths = paths.map(({ from, to }) => {
    return { from: `${refProjectName}/${from.slice(2)}`, to };
  });

  return [...paths, ...projectPrefixedPaths];
  /* eslint-enable arrow-body-style */
}

/**
 * @param {FindCustomelementsAnalyzerResult} targetFindCustomelementsResult
 * @param {FindCustomelementsAnalyzerResult} refFindCustomelementsResult
 * @param {FindExportsAnalyzerResult} refFindExportsResult
 * @param {string} targetMatchedFile file where `toClass` from match-subclasses is defined
 * @param {string} toClass Identifier exported by target project, for instance `WolfCheckbox`
 * @param {MatchSubclassEntry} matchSubclassEntry
 * @returns {TagPathsResult}
 */
function getTagPaths(
  targetFindCustomelementsResult,
  refFindCustomelementsResult,
  refFindExportsResult,
  targetMatchedFile,
  toClass,
  matchSubclassEntry,
) {
  /* eslint-disable arrow-body-style */

  /** @type {TagResult|undefined} */
  let targetResult;
  targetFindCustomelementsResult.queryOutput.some(({ file, result }) => {
    const targetPathMatch = result.find(entry => {
      const sameRoot = entry.rootFile.file === targetMatchedFile;
      const sameIdentifier = entry.rootFile.specifier === toClass;
      return sameRoot && sameIdentifier;
    });
    if (targetPathMatch) {
      targetResult = { file, tagName: targetPathMatch.tagName };
      return true;
    }
    return false;
  });

  /** @type {TagResult|undefined} */
  let refResult;
  refFindCustomelementsResult.queryOutput.some(({ file, result }) => {
    const refPathMatch = result.find(entry => {
      const matchSubclassSpecifierRootFile = getExportSpecifierRootFile(
        matchSubclassEntry.exportSpecifier,
        refFindExportsResult,
      );
      if (!matchSubclassSpecifierRootFile) {
        return false;
      }

      const sameRoot = entry.rootFile.file === matchSubclassSpecifierRootFile.file;
      const sameIdentifier = entry.rootFile.specifier === matchSubclassEntry.exportSpecifier.name;

      return sameRoot && sameIdentifier;
    });
    if (refPathMatch) {
      refResult = { file, tagName: refPathMatch.tagName };
      return true;
    }
    return false;
  });

  return { targetResult, refResult };
  /* eslint-enable arrow-body-style */
}

/**
 * @param {MatchSubclassesAnalyzerResult} targetMatchSubclassesResult
 * @param {FindExportsResultWithMeta} targetExportsResult
 * @param {FindCustomelementsAnalyzerResult} targetFindCustomelementsResult
 * @param {FindCustomelementsAnalyzerResult} refFindCustomelementsResult
 * @param {FindExportsAnalyzerResult} refFindExportsResult
 * @param {string} refProjectName
 * @returns {MatchPathsAnalyzerOutputFile[]}
 */
function matchPathsPostprocess(
  targetMatchSubclassesResult,
  targetExportsResult,
  targetFindCustomelementsResult,
  refFindCustomelementsResult,
  refFindExportsResult,
  refProjectName,
) {
  /** @type {MatchPathsAnalyzerOutputFile[]} */
  const resultsArray = [];

  for (const matchSubclassEntry of targetMatchSubclassesResult.queryOutput) {
    const fromClass = matchSubclassEntry.exportSpecifier.name;

    for (const projectMatch of matchSubclassEntry.matchesPerProject) {
      for (const { identifier: toClass, file: targetMatchedFile } of projectMatch.files) {
        /** @type {MatchPathsAnalyzerOutputFile} */
        const resultEntry = {
          name: fromClass,
        };

        // [A] Get variable paths
        const paths = getVariablePaths(
          targetExportsResult,
          refFindExportsResult,
          targetMatchedFile,
          fromClass,
          toClass,
          refProjectName,
        );

        if (paths?.length) {
          resultEntry.variable = {
            from: fromClass,
            to: toClass,
            paths,
          };
        }
        // [B] Get tag paths
        const { targetResult, refResult } = getTagPaths(
          targetFindCustomelementsResult,
          refFindCustomelementsResult,
          refFindExportsResult,
          targetMatchedFile,
          toClass,
          matchSubclassEntry,
        );

        if (refResult && targetResult) {
          resultEntry.tag = {
            from: refResult.tagName,
            to: targetResult.tagName,
            paths: [
              { from: refResult.file, to: targetResult.file },
              { from: `${refProjectName}/${refResult.file.slice(2)}`, to: targetResult.file },
            ],
          };
        }

        if (resultEntry.variable || resultEntry.tag) {
          resultsArray.push(resultEntry);
        }
      }
    }
  }

  return resultsArray;
}

/**
 * Designed to work in conjunction with npm package `babel-plugin-extend-docs`.
 * It will lookup all class exports from reference project A (and store their available paths) and
 * matches them against all imports of project B that extend exported class (and store their
 * available paths).
 *
 * @example
 * [
 *   ...
 *   {
 *    name: 'LionCheckbox',
 *    variable: {
 *      from: 'LionCheckbox',
 *      to: 'WolfCheckbox',
 *      paths: [
 *        { from: './index.js', to: './index.js' },
 *        { from: './src/LionCheckbox.js', to: './index.js' },
 *        { from: '@lion/checkbox-group', to: './index.js' },
 *        { from: '@lion/checkbox-group/src/LionCheckbox.js', to: './index.js' },
 *      ],
 *    },
 *    tag: {
 *      from: 'lion-checkbox',
 *      to: 'wolf-checkbox',
 *      paths: [
 *        { from: './lion-checkbox.js', to: './wolf-checkbox.js' },
 *        { from: '@lion/checkbox-group/lion-checkbox.js', to: './wolf-checkbox.js' },
 *      ],
 *    }
 *   },
 *   ...
 * ]
 */
export default class MatchPathsAnalyzer extends Analyzer {
  /** @type {AnalyzerName} */
  static analyzerName = 'match-paths';

  static requiresReference = true;

  /**
   * @param {AnalyzerConfigResolved} [customConfig]
   */
  async execute(customConfig = {}) {
    /** @type {MatchClasspathsConfig} */
    const cfg = /** @type {MatchClasspathsConfig} */ ({
      ...{
        gatherFilesConfig: {},
        gatherFilesConfigReference: {},
        referenceProjectPath: null,
        targetProjectPath: null,
        prefix: null,
      },
      ...customConfig,
    });

    /**
     * Prepare
     */
    const analyzerResult = await this._prepare(cfg);
    if (analyzerResult) {
      return analyzerResult;
    }

    /**
     * ## Goal A: variable
     * Automatically generate a mapping from lion docs import paths to extension layer
     * import paths. To be served to extend-docs
     *
     * ## Traversal steps
     *
     * [A1] Find path variable.to 'WolfCheckbox'
     * Run 'match-subclasses' for target project: we find the 'rootFilePath' of class definition,
     * which will be matched against the rootFiles found in [A2]
     * Result: './packages/wolf-checkbox/WolfCheckbox.js'
     * [A2] Find root export path under which 'WolfCheckbox' is exported
     * Run 'find-exports' on target: we find all paths like ['./index.js', './src/WolfCheckbox.js']
     * Result: './index.js'
     * [A3] Find all exports of LionCheckbox
     * Run 'find-exports' for reference project
     * Result: ['./src/LionCheckbox.js', './index.js']
     * [A4] Match data and create a result object "variable"
     */

    // [A1]
    const targetMatchSubclassesAnalyzer = new MatchSubclassesAnalyzer();
    /** @type {MatchSubclassesAnalyzerResult} */
    const targetMatchSubclassesResult = /** @type {MatchSubclassesAnalyzerResult} */ (
      /** @type {unknown} */ (
        await targetMatchSubclassesAnalyzer.execute({
          targetProjectPath: cfg.targetProjectPath,
          referenceProjectPath: cfg.referenceProjectPath,
          gatherFilesConfig: cfg.gatherFilesConfig,
          gatherFilesConfigReference: cfg.gatherFilesConfigReference,
          skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
          suppressNonCriticalLogs: true,
        })
      )
    );

    // [A2]
    const targetFindExportsAnalyzer = new FindExportsAnalyzer();
    /** @type {FindExportsResultWithMeta} */
    const targetExportsResult = /** @type {FindExportsResultWithMeta} */ (
      /** @type {unknown} */ (
        await targetFindExportsAnalyzer.execute({
          targetProjectPath: cfg.targetProjectPath,
          gatherFilesConfig: cfg.gatherFilesConfig,
          skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
          suppressNonCriticalLogs: true,
        })
      )
    );

    // [A3]
    const refFindExportsAnalyzer = new FindExportsAnalyzer();
    /** @type {FindExportsResultWithMeta} */
    const refFindExportsResult = /** @type {FindExportsResultWithMeta} */ (
      /** @type {unknown} */ (
        await refFindExportsAnalyzer.execute({
          targetProjectPath: cfg.referenceProjectPath,
          gatherFilesConfig: cfg.gatherFilesConfigReference,
          skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
          suppressNonCriticalLogs: true,
        })
      )
    );

    /**
     * ## Goal B: tag
     * Automatically generate a mapping from lion docs import paths to extension layer
     * import paths. To be served to extend-docs
     *
     * [B1] Find path variable.to 'WolfCheckbox'
     * Run 'match-subclasses' for target project: we find the 'rootFilePath' of class definition,
     * Result: './packages/wolf-checkbox/WolfCheckbox.js'
     * [B2] Find export path of 'wolf-checkbox'
     * Run 'find-customelements' on target project and match rootFile of [B1] with rootFile of
     * constructor.
     * Result: './wolf-checkbox.js'
     * [B3] Find export path of 'lion-checkbox'
     * Run 'find-customelements' and find-exports (for rootpath) on reference project and match
     * rootFile of constructor with rootFiles of where LionCheckbox is defined.
     * Result: './packages/checkbox/lion-checkbox.js',
     * [B4] Match data and create a result object "tag"
     */

    // [B1]
    const targetFindCustomelementsAnalyzer = new FindCustomelementsAnalyzer();
    /** @type {FindCustomelementsAnalyzerResult} */
    const targetFindCustomelementsResult = /** @type {FindCustomelementsAnalyzerResult} */ (
      /** @type {unknown} */ (
        await targetFindCustomelementsAnalyzer.execute({
          targetProjectPath: cfg.targetProjectPath,
          gatherFilesConfig: cfg.gatherFilesConfig,
          skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
          suppressNonCriticalLogs: true,
        })
      )
    );

    // [B2]
    const refFindCustomelementsAnalyzer = new FindCustomelementsAnalyzer();
    /** @type {FindCustomelementsAnalyzerResult} */
    const refFindCustomelementsResult = /** @type {FindCustomelementsAnalyzerResult} */ (
      /** @type {unknown} */ (
        await refFindCustomelementsAnalyzer.execute({
          targetProjectPath: cfg.referenceProjectPath,
          gatherFilesConfig: cfg.gatherFilesConfigReference,
          skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
          suppressNonCriticalLogs: true,
        })
      )
    );
    // refFindExportsAnalyzer was already created in A3

    // Use one of the reference analyzer instances to get the project name
    const refProjectName = /** @type {string} */ (refFindExportsAnalyzer.targetProjectMeta?.name);

    /** @type {MatchPathsAnalyzerOutputFile[]} */
    let queryOutput = matchPathsPostprocess(
      targetMatchSubclassesResult,
      targetExportsResult,
      targetFindCustomelementsResult,
      refFindCustomelementsResult,
      refFindExportsResult,
      refProjectName,
    );

    if (cfg.prefix) {
      queryOutput = filterPrefixMatches(queryOutput, cfg.prefix);
    }

    /**
     * Finalize
     */
    return this._finalize(/** @type {QueryOutput} */ (/** @type {unknown} */ (queryOutput)), cfg);
  }
}
