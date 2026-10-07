/* eslint-disable no-shadow, no-param-reassign */
import path from 'path';

// import { transformIntoIterableFindExportsOutput } from './helpers/transform-into-iterable-find-exports-output.js';
import { getReferencedDeclaration } from '../utils/get-source-code-fragment-of-declaration.js';
import { normalizeSourcePaths } from './helpers/normalize-source-paths.js';
import { trackDownIdentifier } from '../utils/track-down-identifier.js';
import { getAssertionType } from '../utils/get-assertion-type.js';
import { oxcTraverse } from '../utils/oxc-traverse.js';
import { LogService } from '../core/LogService.js';
import { Analyzer } from '../core/Analyzer.js';

/**
 * A structural representation of the AST nodes (swc/oxc/babel) that are visited by this
 * analyzer. Every field is optional because the concrete node type depends on the parser.
 * @typedef {object} LooseNode
 * @property {string} [type]
 * @property {string} [name]
 * @property {string} [value]
 * @property {LooseNode} [id]
 * @property {LooseNode} [identifier]
 * @property {LooseNode} [declaration]
 * @property {LooseNode} [decl]
 * @property {LooseNode} [expression]
 * @property {LooseNode} [source]
 * @property {LooseNode} [exported]
 * @property {LooseNode} [local]
 * @property {LooseNode} [orig]
 * @property {LooseNode} [imported]
 * @property {LooseNode[]} [specifiers]
 * @property {LooseNode[]} [declarations]
 */
/**
 * @typedef {{ local:string; exported:string }} LocalMapEntry
 * @typedef {object} FindExportsSpecifierObj
 * @property {string[]} exportSpecifiers
 * @property {(LocalMapEntry|undefined)[]} [localMap]
 * @property {string} [source]
 * @property {string} [normalizedSource]
 * @property {string} [assertionType]
 * @property {(RootFileMapEntry|undefined)[]} [rootFileMap]
 * @property {{ astPath: SwcPath }} [__tmp]
 */
/**
 * @typedef {object} FindExportsConfig
 * @property {PathFromSystemRoot} targetProjectPath
 * @property {boolean} [onlyInternalSources=false]
 * @property {boolean} [skipFileImports=false] Instead of both focusing on specifiers like
 * [import {specifier} 'lion-based-ui/foo.js'], and [import 'lion-based-ui/foo.js'] as a result,
 * not list file exports
 */
/**
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerResult} FindExportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindExportsAnalyzerEntry} FindExportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').RootFileMapEntry} RootFileMapEntry
 * @typedef {import('../../../types/index.js').RootFile} RootFile
 * @typedef {import('@swc/core').VariableDeclaration} SwcVariableDeclaration
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').SwcBinding} SwcBinding
 * @typedef {import('../../../types/index.js').SwcVisitor} SwcVisitor
 * @typedef {import('../../../types/index.js').SwcScope} SwcScope
 * @typedef {import('../../../types/index.js').SwcPath} SwcPath
 * @typedef {import("@swc/core").Module} SwcAstModule
 * @typedef {import("@swc/core").Node} SwcNode
 */

/**
 * @param {FindExportsSpecifierObj[]} transformedFile
 * @param {string} relativePath
 * @param {string} projectPath
 */
async function trackdownRoot(transformedFile, relativePath, projectPath) {
  const fullCurrentFilePath = path.resolve(projectPath, relativePath);
  for (const specObj of transformedFile) {
    /** @type {(RootFileMapEntry|undefined)[]} */
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
        /** @type {RootFile} */
        let rootFile;
        /** @type {LocalMapEntry|undefined} */
        let localMapMatch;
        if (specObj.localMap) {
          localMapMatch = specObj.localMap.find(m => m?.exported === specifier);
        }

        // TODO: find out if possible to use trackDownIdentifierFromScope
        if (specObj.source) {
          // TODO: see if still needed: && (localMapMatch || specifier === '[default]')
          const importedIdentifier = localMapMatch?.local || specifier;

          rootFile = await trackDownIdentifier(
            specObj.source,
            importedIdentifier,
            /** @type {PathFromSystemRoot} */ (fullCurrentFilePath),
            /** @type {PathFromSystemRoot} */ (projectPath),
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

/**
 * @param {FindExportsSpecifierObj[]} transformedFile
 */
function cleanup(transformedFile) {
  transformedFile.forEach(specObj => {
    if (specObj.__tmp) {
      delete specObj.__tmp;
    }
  });
  return transformedFile;
}

/**
 * @param {LooseNode} node
 * @returns {string[]}
 */
function getExportSpecifiers(node) {
  // handles default [export const g = 4];
  if (node.declaration?.declarations) {
    const declaration = node.declaration.declarations[0];
    return [/** @type {string} */ (declaration.id?.value || declaration.id?.name)];
  }
  if (node.declaration?.identifier) {
    return [
      /** @type {string} */ (node.declaration.identifier.value || node.declaration.identifier.name),
    ];
  }
  if (node.declaration?.id) {
    return [/** @type {string} */ (node.declaration.id.value || node.declaration.id.name)];
  }

  // handles (re)named specifiers [export { x (as y)} from 'y'];
  return (node.specifiers || []).map(s => {
    if (s.exported) {
      // { x as y }
      return (s.exported.value || s.exported.name) === 'default'
        ? '[default]'
        : /** @type {string} */ (s.exported.value || s.exported.name);
    }
    // { x }
    return /** @type {string} */ (s.orig?.value || s.local?.name);
  });
}

/**
 * @param {LooseNode} node
 * @returns {(LocalMapEntry|undefined)[]}
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
              : /** @type {string} */ (s.orig?.value || s.local?.name),
          exported: /** @type {string} */ (s.exported.value || s.exported.name),
        };
      }
      return undefined;
    })
    .filter(Boolean);
}

/**
 * @param {LooseNode} pathOrNode
 */
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
  /** @type {{[key:string]:SwcBinding}|undefined} */
  let globalScopeBindings;

  const exportHandler = (/** @type {SwcPath} */ astPath) => {
    const { node } = /** @type {{ node: LooseNode }} */ (astPath);
    const exportSpecifiers = getExportSpecifiers(node);
    const localMap = getLocalNameSpecifiers(node);
    const source = node.source?.value || node.source?.name;
    const entry = /** @type {FindExportsSpecifierObj} */ ({
      exportSpecifiers,
      localMap,
      source,
      __tmp: { astPath },
    });
    const assertionType = getAssertionType(
      /** @type {Parameters<typeof getAssertionType>[0]} */ (/** @type {unknown} */ (astPath.node)),
    );
    if (assertionType) {
      entry.assertionType = assertionType;
    }
    transformedFile.push(entry);
  };

  const exportDefaultHandler = (/** @type {SwcPath} */ astPath) => {
    const exportSpecifiers = ['[default]'];
    const { node } = /** @type {{ node: LooseNode }} */ (astPath);
    /** @type {string|undefined} */
    let source;

    // Is it an inline declaration like "export default class X {};" ?
    if (
      node.decl?.type === 'Identifier' ||
      node.expression?.type === 'Identifier' ||
      node.declaration?.type === 'Identifier'
    ) {
      // It is a reference to an identifier like "export { x } from 'y';"
      const bindings = /** @type {{[key:string]:SwcBinding}} */ (globalScopeBindings);
      const importOrDeclPath = getReferencedDeclaration({
        referencedIdentifierName: /** @type {string} */ (
          node.decl?.value || node.expression?.value || node.declaration?.name
        ),
        globalScopeBindings: bindings,
      });
      const declPath = /** @type {SwcPath} */ (/** @type {unknown} */ (importOrDeclPath));
      if (isImportingSpecifier(/** @type {LooseNode} */ (declPath))) {
        const { parentPath } = /** @type {{ parentPath: SwcPath }} */ (
          /** @type {unknown} */ (declPath)
        );
        source = /** @type {LooseNode} */ (parentPath.node).source?.value;
      }
    }
    transformedFile.push({ exportSpecifiers, source, __tmp: { astPath } });
  };

  const globalScopeHandler = (/** @type {SwcPath} */ astPath) => {
    globalScopeBindings = /** @type {SwcScope} */ (astPath.scope).bindings;
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

  get config() {
    return /** @type {Analyzer['config']} */ (
      /** @type {unknown} */ ({
        targetProjectPath: null,
        skipFileImports: false,
        ...this._customConfig,
      })
    );
  }

  /**
   * @param {SwcAstModule} ast
   * @param {{ relativePath:string; analyzerCfg: FindExportsConfig }} context
   */
  static async analyzeFile(ast, { relativePath, analyzerCfg }) {
    const projectPath = analyzerCfg.targetProjectPath;

    let transformedFile = findExportsPerAstFile(ast, analyzerCfg);

    try {
      transformedFile = await normalizeSourcePaths(transformedFile, relativePath, projectPath);
      transformedFile = await trackdownRoot(transformedFile, relativePath, projectPath);
    } finally {
      transformedFile = cleanup(transformedFile);
    }

    return { result: transformedFile };
  }

  /**
   * @param {Parameters<typeof Analyzer.analyzeProject>[0]} analyzeFileCfg
   */
  static async analyzeProject(analyzeFileCfg) {
    const totalResult = await super.analyzeProject(analyzeFileCfg);
    // return transformIntoIterableFindExportsOutput({ queryOutput: totalResult });
    return totalResult;
  }
}
