/* eslint-disable no-shadow, no-param-reassign */
const MatchSubclassesAnalyzer = require('./match-subclasses.js');
const FindExportsAnalyzer = require('./find-exports.js');
const FindCustomelementsAnalyzer = require('./find-customelements.js');
const { Analyzer } = require('./helpers/Analyzer.js');

/** @typedef {import('./types').FindExportsAnalyzerResult} FindExportsAnalyzerResult */
/** @typedef {import('./types').FindCustomelementsAnalyzerResult} FindCustomelementsAnalyzerResult */
/** @typedef {import('./types').MatchSubclassesAnalyzerResult} MatchSubclassesAnalyzerResult */
/** @typedef {import('./types').FindImportsAnalyzerResult} FindImportsAnalyzerResult */
/** @typedef {import('./types').MatchedExportSpecifier} MatchedExportSpecifier */
/** @typedef {import('./types').RootFile} RootFile */

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
  const capitalize = prefix => `${prefix[0].toUpperCase()}${prefix.slice(1)}`;

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

      return {
        name: e.name,
        ...(keepVariable ? { variable: e.variable } : {}),
        ...(keepTag ? { tag: e.tag } : {}),
      };
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
  /** @type {RootFile} */
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

function getClosestToRootTargetPath(targetPaths, targetExportsResult) {
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
 *
 * @param {FindExportsAnalyzerResult} targetExportsResult
 * @param {FindExportsAnalyzerResult} refFindExportsResult
 * @param {string} targetMatchedFile file where `toClass` from match-subclasses is defined
 * @param {string} fromClass Identifier exported by reference project, for instance LionCheckbox
 * @param {string} toClass Identifier exported by target project, for instance WolfCheckbox
 * @param {string} refProjectName for instance @lion/checkbox
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

  const targetPath = getClosestToRootTargetPath(targetPaths, targetExportsResult);

  // [A3]
  /**
   * finds all paths that import LionCheckbox
   * @example ['./packages/checkbox/src/LionCheckbox.js', './index.js']
   * @type {string[]}
   */
  const refPaths = [];
  refFindExportsResult.queryOutput.forEach(({ file, result }) => {
    const refPathMatch = result.find(entry => {
      if (entry.exportSpecifiers.includes(fromClass)) {
        return true;
      }
      // if we're dealing with `export {x as y}`...
      if (entry.localMap && entry.localMap.find(({ exported }) => exported === fromClass)) {
        return true;
      }
      return false;
    });
    if (refPathMatch) {
      refPaths.push(file);
    }
  });

  const paths = refPaths.map(refP => ({ from: refP, to: targetPath }));

  // Add all paths with project prefix as well.
  const projectPrefixedPaths = paths.map(({ from, to }) => {
    return { from: `${refProjectName}/${from.slice(2)}`, to };
  });

  return [...paths, ...projectPrefixedPaths];
  /* eslint-enable arrow-body-style */
}

/**
 *
 * @param {FindCustomelementsAnalyzerResult} targetFindCustomelementsResult
 * @param {FindCustomelementsAnalyzerResult} refFindCustomelementsResult
 * @param {FindExportsAnalyzerResult} refFindExportsResult
 * @param {string} targetMatchedFile file where `toClass` from match-subclasses is defined
 * @param {string} toClass Identifier exported by target project, for instance `WolfCheckbox`
 * @param {MatchSubclassEntry} matchSubclassEntry
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
 * @param {FindExportsAnalyzerResult} targetExportsResult
 * @param {FindCustomelementsAnalyzerResult} targetFindCustomelementsResult
 * @param {FindCustomelementsAnalyzerResult} refFindCustomelementsResult
 * @param {FindExportsAnalyzerResult} refFindExportsResult
 * @returns {AnalyzerQueryResult}
 */
function matchPathsPostprocess(
  targetMatchSubclassesResult,
  targetExportsResult,
  targetFindCustomelementsResult,
  refFindCustomelementsResult,
  refFindExportsResult,
  refProjectName,
) {
  /** @type {AnalyzerQueryResult} */
  const resultsArray = [];

  targetMatchSubclassesResult.queryOutput.forEach(matchSubclassEntry => {
    const fromClass = matchSubclassEntry.exportSpecifier.name;

    matchSubclassEntry.matchesPerProject.forEach(projectMatch => {
      projectMatch.files.forEach(({ identifier: toClass, file: targetMatchedFile }) => {
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

        if (paths && paths.length) {
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
      });
    });
  });

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
class MatchPathsAnalyzer extends Analyzer {
  constructor() {
    super();
    this.name = 'match-paths';
  }

  static get requiresReference() {
    return true;
  }

  /**
   * @param {MatchClasspathsConfig} customConfig
   */
  async execute(customConfig = {}) {
    /**
     * @typedef MatchClasspathsConfig
     * @property {GatherFilesConfig} [gatherFilesConfig]
     * @property {GatherFilesConfig} [gatherFilesConfigReference]
     * @property {string} [referenceProjectPath] reference path
     * @property {string} [targetProjectPath] search target path
     * @property {{ from: string, to: string }} [prefix]
     */
    const cfg = {
      gatherFilesConfig: {},
      gatherFilesConfigReference: {},
      referenceProjectPath: null,
      targetProjectPath: null,
      prefix: null,
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
    const targetMatchSubclassesResult = await targetMatchSubclassesAnalyzer.execute({
      targetProjectPath: cfg.targetProjectPath,
      referenceProjectPath: cfg.referenceProjectPath,
      gatherFilesConfig: cfg.gatherFilesConfig,
      gatherFilesConfigReference: cfg.gatherFilesConfigReference,
      skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
    });

    // [A2]
    const targetFindExportsAnalyzer = new FindExportsAnalyzer();
    /** @type {FindExportsAnalyzerResult} */
    const targetExportsResult = await targetFindExportsAnalyzer.execute({
      targetProjectPath: cfg.targetProjectPath,
      gatherFilesConfig: cfg.gatherFilesConfig,
      skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
    });

    // [A3]
    const refFindExportsAnalyzer = new FindExportsAnalyzer();
    /** @type {FindExportsAnalyzerResult} */
    const refFindExportsResult = await refFindExportsAnalyzer.execute({
      targetProjectPath: cfg.referenceProjectPath,
      gatherFilesConfig: cfg.gatherFilesConfigReference,
      skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
    });

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
    const targetFindCustomelementsResult = await targetFindCustomelementsAnalyzer.execute({
      targetProjectPath: cfg.targetProjectPath,
      gatherFilesConfig: cfg.gatherFilesConfig,
      skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
    });

    // [B2]
    const refFindCustomelementsAnalyzer = new FindCustomelementsAnalyzer();
    /** @type {FindCustomelementsAnalyzerResult} */
    const refFindCustomelementsResult = await refFindCustomelementsAnalyzer.execute({
      targetProjectPath: cfg.referenceProjectPath,
      gatherFilesConfig: cfg.gatherFilesConfigReference,
      skipCheckMatchCompatibility: cfg.skipCheckMatchCompatibility,
    });
    // refFindExportsAnalyzer was already created in A3

    // Use one of the reference analyzer instances to get the project name
    const refProjectName = refFindExportsAnalyzer.targetProjectMeta.name;

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
    return this._finalize(queryOutput, cfg);
  }
}

module.exports = MatchPathsAnalyzer;
