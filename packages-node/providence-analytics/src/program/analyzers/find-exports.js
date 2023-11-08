/* eslint-disable no-shadow, no-param-reassign */
import path from 'path';
import { swcTraverse } from '../utils/swc-traverse.js';
import { getAssertionType } from '../utils/get-assertion-type.js';
import { Analyzer } from '../core/Analyzer.js';
import { trackDownIdentifier } from './helpers/track-down-identifier.js';
import { normalizeSourcePaths } from './helpers/normalize-source-paths.js';
import { getReferencedDeclaration } from '../utils/get-source-code-fragment-of-declaration.js';
import { LogService } from '../core/LogService.js';

/**
 * @typedef {import("@swc/core").Module} SwcAstModule
 * @typedef {import("@swc/core").Node} SwcNode
 * @typedef {import("@swc/core").VariableDeclaration} SwcVariableDeclaration
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerResult} FindExportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerEntry} FindExportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').SwcScope} SwcScope
 * @typedef {import('../../../types/index.js').SwcBinding} SwcBinding
 * @typedef {import('../../../types/index.js').SwcPath} SwcPath
 * @typedef {import('../../../types/index.js').SwcVisitor} SwcVisitor
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
  const fullCurrentFilePath = path.resolve(projectPath, relativePath);
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
 * @param {*} node
 * @returns {string[]}
 */
function getExportSpecifiers(node) {
  // handles default [export const g = 4];
  if (node.declaration) {
    if (node.declaration.declarations) {
      return [node.declaration.declarations[0].id.value];
    }
    if (node.declaration.identifier) {
      return [node.declaration.identifier.value];
    }
  }

  // handles (re)named specifiers [export { x (as y)} from 'y'];
  return (node.specifiers || []).map(s => {
    if (s.exported) {
      // { x as y }
      return s.exported.value === 'default' ? '[default]' : s.exported.value;
    }
    // { x }
    return s.orig.value;
  });
}

/**
 * @returns {{local:string;exported:string;}|undefined[]}
 */
function getLocalNameSpecifiers(node) {
  return (node.declaration?.declarations || node.specifiers || [])
    .map(s => {
      if (s.exported && s.orig && s.exported.value !== s.orig.value) {
        return {
          // if reserved keyword 'default' is used, translate it into 'providence keyword'
          local: s.orig.value === 'default' ? '[default]' : s.orig.value,
          exported: s.exported.value,
        };
      }
      return undefined;
    })
    .filter(Boolean);
}

const isImportingSpecifier = pathOrNode =>
  pathOrNode.type === 'ImportDefaultSpecifier' || pathOrNode.type === 'ImportSpecifier';

/**
 * Finds import specifiers and sources for a given ast result
 * @param {SwcAstModule} swcAst
 * @param {FindExportsConfig} config
 */
function findExportsPerAstFile(swcAst, { skipFileImports }) {
  LogService.debug(`Analyzer "find-exports": started findExportsPerAstFile method`);

  // Visit AST...

  /** @type {FindExportsSpecifierObj[]} */
  const transformedFile = [];
  // Unfortunately, we cannot have async functions in babel traverse.
  // Therefore, we store a temp reference to path that we use later for
  // async post processing (tracking down original export Identifier)
  /** @type {{[key:string]:SwcBinding}} */
  let globalScopeBindings;

  const exportHandler = (/** @type {SwcPath} */ astPath) => {
    const exportSpecifiers = getExportSpecifiers(astPath.node);
    const localMap = getLocalNameSpecifiers(astPath.node);
    const source = astPath.node.source?.value;
    const entry = { exportSpecifiers, localMap, source, __tmp: { astPath } };
    const assertionType = getAssertionType(astPath.node);
    if (assertionType) {
      entry.assertionType = assertionType;
    }
    transformedFile.push(entry);
  };

  const exportDefaultHandler = (/** @type {SwcPath} */ astPath) => {
    const exportSpecifiers = ['[default]'];
    let source;
    // Is it an inline declaration like "export default class X {};" ?
    if (
      astPath.node.decl?.type === 'Identifier' ||
      astPath.node.expression?.type === 'Identifier'
    ) {
      // It is a reference to an identifier like "export { x } from 'y';"
      const importOrDeclPath = getReferencedDeclaration({
        referencedIdentifierName: astPath.node.decl?.value || astPath.node.expression.value,
        globalScopeBindings,
      });
      if (isImportingSpecifier(importOrDeclPath)) {
        source = importOrDeclPath.parentPath.node.source.value;
      }
    }
    transformedFile.push({ exportSpecifiers, source, __tmp: { astPath } });
  };

  /** @type {SwcVisitor} */
  const visitor = {
    Module({ scope }) {
      globalScopeBindings = scope.bindings;
    },
    ExportDeclaration: exportHandler,
    ExportNamedDeclaration: exportHandler,
    ExportDefaultDeclaration: exportDefaultHandler,
    ExportDefaultExpression: exportDefaultHandler,
  };

  swcTraverse(swcAst, visitor, { needsAdvancedPaths: true });

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
  static analyzerName = /** @type {AnalyzerName} */ ('find-exports');

  static requiredAst = /** @type {AnalyzerAst} */ ('swc');

  /**
   * @typedef FindExportsConfig
   * @property {boolean} [onlyInternalSources=false]
   * @property {boolean} [skipFileImports=false] Instead of both focusing on specifiers like
   * [import {specifier} 'lion-based-ui/foo.js'], and [import 'lion-based-ui/foo.js'] as a result,
   * not list file exports
   */
  get config() {
    return {
      targetProjectPath: null,
      skipFileImports: false,
      ...this._customConfig,
    };
  }

  static async analyzeFile(ast, { relativePath, analyzerCfg }) {
    const projectPath = analyzerCfg.targetProjectPath;

    let transformedFile = findExportsPerAstFile(ast, analyzerCfg);

    transformedFile = await normalizeSourcePaths(transformedFile, relativePath, projectPath);
    transformedFile = await trackdownRoot(transformedFile, relativePath, projectPath);
    transformedFile = cleanup(transformedFile);

    return { result: transformedFile };
  }
}
