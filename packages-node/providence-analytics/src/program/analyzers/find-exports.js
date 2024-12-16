/* eslint-disable no-shadow, no-param-reassign */
import path from 'path';

import { getReferencedDeclaration } from '../utils/get-source-code-fragment-of-declaration.js';
import { normalizeSourcePaths } from './helpers/normalize-source-paths.js';
import { trackDownIdentifier } from '../utils/track-down-identifier.js';
import { getAssertionType } from '../utils/get-assertion-type.js';
import { oxcTraverse } from '../utils/oxc-traverse.js';
import { LogService } from '../core/LogService.js';
import { Analyzer } from '../core/Analyzer.js';

/**
 * @typedef {{ exportSpecifiers:string[]; localMap: object; source:string, __tmp: { path:string } }} FindExportsSpecifierObj
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerResult} FindExportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerEntry} FindExportsAnalyzerEntry
 * @typedef {import("@swc/core").VariableDeclaration} SwcVariableDeclaration
 * @typedef {import('../utils/track-down-identifier.js').RootFile} RootFile
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').SwcBinding} SwcBinding
 * @typedef {import('../../../types/index.js').SwcVisitor} SwcVisitor
 * @typedef {import('../../../types/index.js').SwcScope} SwcScope
 * @typedef {import('../../../types/index.js').SwcPath} SwcPath
 * @typedef {import("@swc/core").Module} SwcAstModule
 * @typedef {import("@swc/core").Node} SwcNode
 * @typedef {RootFileMapEntry[]} RootFileMap
 * @typedef {string} currentFileSpecifier this is the local name in the file we track from
 * @typedef {object} RootFileMapEntry
 * @typedef {RootFile} rootFile contains file(filePath) and specifier
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
  if (node.declaration?.declarations) {
    return [node.declaration.declarations[0].id.value || node.declaration.declarations[0].id.name];
  }
  if (node.declaration?.identifier) {
    return [node.declaration.identifier.value || node.declaration.identifier.name];
  }
  if (node.declaration?.id) {
    return [node.declaration.id.value || node.declaration.id.name];
  }

  // handles (re)named specifiers [export { x (as y)} from 'y'];
  return (node.specifiers || []).map(s => {
    if (s.exported) {
      // { x as y }
      return (s.exported.value || s.exported.name) === 'default'
        ? '[default]'
        : s.exported.value || s.exported.name;
    }
    // { x }
    return s.orig.value || s.local.name;
  });
}

/**
 * @returns {{local:string;exported:string;}|undefined[]}
 */
function getLocalNameSpecifiers(node) {
  return (node.declaration?.declarations || node.specifiers || [])
    .map(s => {
      if (
        s.exported &&
        (s.orig || s.local) &&
        (s.exported.value || s.exported.name) !== (s.orig?.value || s.local?.name)
      ) {
        return {
          // if reserved keyword 'default' is used, translate it into 'providence keyword'
          local:
            (s.orig?.value || s.local?.name) === 'default'
              ? '[default]'
              : s.orig?.value || s.local?.name,
          exported: s.exported.value || s.exported.name,
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
 * @param {SwcAstModule} oxcAst
 * @param {FindExportsConfig} config
 */
function findExportsPerAstFile(oxcAst, { skipFileImports }) {
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
    const source = astPath.node.source?.value || astPath.node.source?.name;
    const entry = { exportSpecifiers, localMap, source, __tmp: { astPath } };
    const assertionType = getAssertionType(astPath.node);
    if (assertionType) {
      entry.assertionType = assertionType;
    }
    transformedFile.push(entry);
  };

  const exportDefaultHandler = (/** @type {SwcPath} */ astPath) => {
    const exportSpecifiers = ['[default]'];
    const { node } = astPath;
    let source;
    // Is it an inline declaration like "export default class X {};" ?
    if (
      node.decl?.type === 'Identifier' ||
      node.expression?.type === 'Identifier' ||
      node.declaration?.type === 'Identifier'
    ) {
      // It is a reference to an identifier like "export { x } from 'y';"
      const importOrDeclPath = getReferencedDeclaration({
        referencedIdentifierName:
          node.decl?.value || node.expression?.value || node.declaration?.name,
        globalScopeBindings,
      });
      if (isImportingSpecifier(importOrDeclPath)) {
        source = importOrDeclPath.parentPath.node.source.value;
      }
    }
    transformedFile.push({ exportSpecifiers, source, __tmp: { astPath } });
  };

  const globalScopeHandler = ({ scope }) => {
    globalScopeBindings = scope.bindings;
  };

  /** @type {SwcVisitor} */
  const visitor = {
    // for swc
    Module: globalScopeHandler,
    // for oxc and babel
    Program: globalScopeHandler,
    ExportDeclaration: exportHandler,
    ExportNamedDeclaration: exportHandler,
    ExportDefaultDeclaration: exportDefaultHandler,
    ExportDefaultExpression: exportDefaultHandler,
  };

  oxcTraverse(oxcAst, visitor, { needsAdvancedPaths: true });

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

  static requiredAst = /** @type {AnalyzerAst} */ ('oxc');

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
