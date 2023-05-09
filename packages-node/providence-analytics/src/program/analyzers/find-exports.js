/* eslint-disable no-shadow, no-param-reassign */
import pathLib from 'path';
import babelTraverse from '@babel/traverse';
import { Analyzer } from '../core/Analyzer.js';
import { trackDownIdentifier } from './helpers/track-down-identifier.js';
import { normalizeSourcePaths } from './helpers/normalize-source-paths.js';
import { getReferencedDeclaration } from '../utils/get-source-code-fragment-of-declaration.js';
import { LogService } from '../core/LogService.js';

/**
 * @typedef {import('@babel/types').File} File
 * @typedef {import('@babel/types').Node} Node
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerResult} FindExportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerEntry} FindExportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('./helpers/track-down-identifier.js').RootFile} RootFile
 * @typedef {object} RootFileMapEntry
 * @typedef {string} currentFileSpecifier this is the local name in the file we track from
 * @typedef {RootFile} rootFile contains file(filePath) and specifier
 * @typedef {RootFileMapEntry[]} RootFileMap
 * @typedef {{ exportSpecifiers:string[]; localMap: object; source:string, __tmp: { path:string } }} FindExportsSpecifierObj
 */

/**
 * @param {FindExportsSpecifierObj[]} transformedFile
 */
async function trackdownRoot(transformedFile, relativePath, projectPath) {
  const fullCurrentFilePath = pathLib.resolve(projectPath, relativePath);
  for (const specObj of transformedFile) {
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
  return transformedFile;
}

function cleanup(transformedFile) {
  transformedFile.forEach(specObj => {
    if (specObj.__tmp) {
      delete specObj.__tmp;
    }
  });
  return transformedFile;
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
      specifier = s.exported.name === 'default' ? '[default]' : s.exported.name;
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
          // if reserved keyword 'default' is used, translate it into 'providence keyword'
          local: s.local.name === 'default' ? '[default]' : s.local.name,
          exported: s.exported.name,
        };
      }
      return undefined;
    })
    .filter(s => s);
}

const isImportingSpecifier = pathOrNode =>
  pathOrNode.type === 'ImportDefaultSpecifier' || pathOrNode.type === 'ImportSpecifier';

/**
 * Finds import specifiers and sources for a given ast result
 * @param {File} babelAst
 * @param {FindExportsConfig} config
 */
function findExportsPerAstFile(babelAst, { skipFileImports }) {
  LogService.debug(`Analyzer "find-exports": started findExportsPerAstFile method`);

  // Visit AST...

  /** @type {FindExportsSpecifierObj[]} */
  const transformedFile = [];
  // Unfortunately, we cannot have async functions in babel traverse.
  // Therefore, we store a temp reference to path that we use later for
  // async post processing (tracking down original export Identifier)
  let globalScopeBindings;

  babelTraverse.default(babelAst, {
    Program: {
      enter(babelPath) {
        const body = babelPath.get('body');
        if (body.length) {
          globalScopeBindings = body[0].scope.bindings;
        }
      },
    },
    ExportNamedDeclaration(astPath) {
      const exportSpecifiers = getExportSpecifiers(astPath.node);
      const localMap = getLocalNameSpecifiers(astPath.node);
      const source = astPath.node.source?.value;
      const entry = { exportSpecifiers, localMap, source, __tmp: { astPath } };
      if (astPath.node.assertions?.length) {
        entry.assertionType = astPath.node.assertions[0].value?.value;
      }
      transformedFile.push(entry);
    },
    ExportDefaultDeclaration(defaultExportPath) {
      const exportSpecifiers = ['[default]'];
      let source;
      if (defaultExportPath.node.declaration?.type !== 'Identifier') {
        source = defaultExportPath.node.declaration.name;
      } else {
        const importOrDeclPath = getReferencedDeclaration({
          referencedIdentifierName: defaultExportPath.node.declaration.name,
          globalScopeBindings,
        });
        if (isImportingSpecifier(importOrDeclPath)) {
          source = importOrDeclPath.parentPath.node.source.value;
        }
      }
      transformedFile.push({ exportSpecifiers, source, __tmp: { astPath: defaultExportPath } });
    },
  });

  if (!skipFileImports) {
    // Always add an entry for just the file 'relativePath'
    // (since this also can be imported directly from a search target project)
    transformedFile.push({
      exportSpecifiers: ['[file]'],
      // source: relativePath,
    });
  }

  return transformedFile;
}

export default class FindExportsAnalyzer extends Analyzer {
  /** @type {AnalyzerName} */
  static analyzerName = 'find-exports';

  /** @type {'babel'|'swc-to-babel'} */
  requiredAst = 'swc-to-babel';

  /**
   * Finds export specifiers and sources
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
    const cachedAnalyzerResult = this._prepare(cfg);
    if (cachedAnalyzerResult) {
      return cachedAnalyzerResult;
    }

    /**
     * Traverse
     */
    const projectPath = cfg.targetProjectPath;

    const traverseEntryFn = async (ast, { relativePath }) => {
      let transformedFile = findExportsPerAstFile(ast, cfg);

      transformedFile = await normalizeSourcePaths(transformedFile, relativePath, projectPath);
      transformedFile = await trackdownRoot(transformedFile, relativePath, projectPath);
      transformedFile = cleanup(transformedFile);

      return { result: transformedFile };
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
