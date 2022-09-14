/* eslint-disable no-shadow, no-param-reassign */
const pathLib = require('path');
const { default: traverse } = require('@babel/traverse');
const { Analyzer } = require('./helpers/Analyzer.js');
const { trackDownIdentifier } = require('./helpers/track-down-identifier.js');
const { normalizeSourcePaths } = require('./helpers/normalize-source-paths.js');
const { LogService } = require('../services/LogService.js');

/**
 * @typedef {import('./helpers/track-down-identifier.js').RootFile} RootFile
 * @typedef {object} RootFileMapEntry
 * @typedef {string} currentFileSpecifier this is the local name in the file we track from
 * @typedef {RootFile} rootFile contains file(filePath) and specifier
 * @typedef {RootFileMapEntry[]} RootFileMap
 *
 * @typedef {{ exportSpecifiers:string[]; localMap: object; source:string, __tmp: { path:string } }} FindExportsSpecifierObj
 */

/**
 * @param {FindExportsSpecifierObj[]} transformedEntry
 */
async function trackdownRoot(transformedEntry, relativePath, projectPath) {
  const fullCurrentFilePath = pathLib.resolve(projectPath, relativePath);
  for (const specObj of transformedEntry) {
    /** @type {RootFileMap} */
    const rootFileMap = [];
    if (specObj.exportSpecifiers[0] === '[file]') {
      rootFileMap.push(undefined);
    } else {
      /**
       * './src/origin.js': `export class MyComp {}`
       *  './index.js:' `export { MyComp as RenamedMyComp } from './src/origin'`
       *
       * Goes from specifier like 'RenamedMyComp' to object for rootFileMap like:
       * {
       *   currentFileSpecifier: 'RenamedMyComp',
       *   rootFile: {
       *     file: './src/origin.js',
       *     specifier: 'MyCompDefinition',
       *   }
       * }
       */
      for (const specifier of specObj.exportSpecifiers) {
        let rootFile;
        let localMapMatch;
        if (specObj.localMap) {
          localMapMatch = specObj.localMap.find(m => m.exported === specifier);
        }
        // TODO: find out if possible to use trackDownIdentifierFromScope
        if (specObj.source) {
          // TODO: see if still needed: && (localMapMatch || specifier === '[default]')
          const importedIdentifier = localMapMatch?.local || specifier;
          rootFile = await trackDownIdentifier(
            specObj.source,
            importedIdentifier,
            fullCurrentFilePath,
            projectPath,
          );
          /** @type {RootFileMapEntry} */
          const entry = {
            currentFileSpecifier: specifier,
            rootFile,
          };
          rootFileMap.push(entry);
        } else {
          /** @type {RootFileMapEntry} */
          const entry = {
            currentFileSpecifier: specifier,
            rootFile: { file: '[current]', specifier },
          };
          rootFileMap.push(entry);
        }
      }
    }
    specObj.rootFileMap = rootFileMap;
  }
  return transformedEntry;
}

function cleanup(transformedEntry) {
  transformedEntry.forEach(specObj => {
    if (specObj.__tmp) {
      delete specObj.__tmp;
    }
  });
  return transformedEntry;
}

/**
 * @returns {string[]}
 */
function getExportSpecifiers(node) {
  // handles default [export const g = 4];
  if (node.declaration) {
    if (node.declaration.declarations) {
      return [node.declaration.declarations[0].id.name];
    }
    if (node.declaration.id) {
      return [node.declaration.id.name];
    }
  }

  // handles (re)named specifiers [export { x (as y)} from 'y'];
  return node.specifiers.map(s => {
    let specifier;
    if (s.exported) {
      // { x as y }
      specifier = s.exported.name;
    } else {
      // { x }
      specifier = s.local.name;
    }
    return specifier;
  });
}

/**
 * @returns {object[]}
 */
function getLocalNameSpecifiers(node) {
  return node.specifiers
    .map(s => {
      if (s.exported && s.local && s.exported.name !== s.local.name) {
        return {
          local: s.local.name,
          exported: s.exported.name,
        };
      }
      return undefined;
    })
    .filter(s => s);
}

/**
 * @desc Finds import specifiers and sources for a given ast result
 * @param {BabelAst} ast
 * @param {FindExportsConfig} config
 */
function findExportsPerAstEntry(ast, { skipFileImports }) {
  LogService.debug(`Analyzer "find-exports": started findExportsPerAstEntry method`);

  // Visit AST...

  /** @type {FindExportsSpecifierObj} */
  const transformedEntry = [];
  // Unfortunately, we cannot have async functions in babel traverse.
  // Therefore, we store a temp reference to path that we use later for
  // async post processing (tracking down original export Identifier)
  traverse(ast, {
    ExportNamedDeclaration(path) {
      const exportSpecifiers = getExportSpecifiers(path.node);
      const localMap = getLocalNameSpecifiers(path.node);
      const source = path.node.source?.value;
      transformedEntry.push({ exportSpecifiers, localMap, source, __tmp: { path } });
    },
    ExportDefaultDeclaration(path) {
      const exportSpecifiers = ['[default]'];
      const source = path.node.declaration.name;
      transformedEntry.push({ exportSpecifiers, source, __tmp: { path } });
    },
  });

  if (!skipFileImports) {
    // Always add an entry for just the file 'relativePath'
    // (since this also can be imported directly from a search target project)
    transformedEntry.push({
      exportSpecifiers: ['[file]'],
      // source: relativePath,
    });
  }

  return transformedEntry;
}

class FindExportsAnalyzer extends Analyzer {
  constructor() {
    super();
    this.name = 'find-exports';
  }

  /**
   * @desc Finds export specifiers and sources
   * @param {FindExportsConfig} customConfig
   */
  async execute(customConfig = {}) {
    /**
     * @typedef FindExportsConfig
     * @property {boolean} [onlyInternalSources=false]
     * @property {boolean} [skipFileImports=false] Instead of both focusing on specifiers like
     * [import {specifier} 'lion-based-ui/foo.js'], and [import 'lion-based-ui/foo.js'] as a result,
     * not list file exports
     */
    const cfg = {
      targetProjectPath: null,
      skipFileImports: false,
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
    const projectPath = cfg.targetProjectPath;

    const traverseEntryFn = async (ast, { relativePath }) => {
      let transformedEntry = findExportsPerAstEntry(ast, cfg);

      transformedEntry = await normalizeSourcePaths(transformedEntry, relativePath, projectPath);
      transformedEntry = await trackdownRoot(transformedEntry, relativePath, projectPath);
      transformedEntry = cleanup(transformedEntry);

      return { result: transformedEntry };
    };

    const queryOutput = await this._traverse({
      traverseEntryFn,
      filePaths: cfg.targetFilePaths,
      projectPath: cfg.targetProjectPath,
    });

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }
}

module.exports = FindExportsAnalyzer;
