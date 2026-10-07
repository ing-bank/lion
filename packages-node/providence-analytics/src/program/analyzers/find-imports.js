/* eslint-disable no-shadow, no-param-reassign */
import { normalizeSourcePaths } from './helpers/normalize-source-paths.js';
import { isRelativeSourcePath } from '../utils/relative-source-path.js';
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
 * @property {LooseNode} [imported]
 * @property {LooseNode} [orig]
 * @property {LooseNode} [local]
 * @property {LooseNode} [exported]
 * @property {LooseNode} [source]
 * @property {LooseNode} [callee]
 * @property {LooseNode} [expression]
 * @property {LooseNode[]} [specifiers]
 * @property {LooseNode[]} [arguments]
 */
/**
 * @typedef {object} FindImportsConfig
 * @property {string} [targetProjectPath]
 * @property {boolean} [keepInternalSources=false] by default, relative paths like '../x.js' are
 * filtered out. This option keeps them.
 * means that 'external-dep/file' will be resolved to 'external-dep/file.js' will both be stored
 * as the latter
 */
/**
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerEntry} FindImportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').AnalyzerConfig} AnalyzerConfig
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import("../../../types/index.js").SwcPath} SwcPath
 * @typedef {import("@swc/core").Module} oxcAstModule
 * @typedef {import("@swc/core").Node} SwcNode
 */

/**
 * @param {LooseNode|undefined} node
 * @returns {boolean}
 */
function isLiteral(node) {
  return node?.type === 'Literal' || node?.type === 'StringLiteral';
}

/**
 * Intends to work for oxc, swc, and babel asts
 * @param {LooseNode} s
 * @returns {string|undefined}
 */
function getSpecifierValue(s) {
  return (
    // These are regular import values and must be checked first
    s.imported?.value ||
    s.imported?.name ||
    s.orig?.value ||
    s.orig?.name ||
    s.local?.value ||
    s.local?.name ||
    // Re-export
    s.exported?.value ||
    s.exported?.name
  );
}

/**
 * @param {LooseNode} node
 * @returns {string[]}
 */
function getImportOrReexportsSpecifiers(node) {
  return (node.specifiers || []).map(s => {
    if (
      s.type === 'ImportDefaultSpecifier' ||
      s.type === 'ExportDefaultSpecifier' ||
      (s.type === 'ExportSpecifier' &&
        (s.exported?.value === 'default' || s.exported?.name === 'default'))
    ) {
      return '[default]';
    }
    if (s.type === 'ImportNamespaceSpecifier' || s.type === 'ExportNamespaceSpecifier') {
      return '[*]';
    }
    const importedValue = getSpecifierValue(s);
    return /** @type {string} */ (importedValue);
  });
}

/**
 * Finds import specifiers and sources
 * @param {oxcAstModule} oxcAst
 */
function findImportsPerAstFile(oxcAst) {
  LogService.debug(`Analyzer "find-imports": started findImportsPerAstFile method`);

  // TODO: possibly make traversal quicker by using import/export data from oxcAst.module

  // https://github.com/babel/babel/blob/672a58660f0b15691c44582f1f3fdcdac0fa0d2f/packages/babel-core/src/transformation/index.ts#L110
  // Visit AST...
  /** @type {Partial<FindImportsAnalyzerEntry>[]} */
  const transformedFile = [];
  oxcTraverse(oxcAst, {
    ImportDeclaration(astPath) {
      const { node } = /** @type {{ node: LooseNode }} */ (astPath);
      const importSpecifiers = getImportOrReexportsSpecifiers(node);
      if (!importSpecifiers.length) {
        importSpecifiers.push('[file]'); // apparently, there was just a file import
      }

      const source = node.source?.value;
      const entry = /** @type {Partial<FindImportsAnalyzerEntry>} */ ({ importSpecifiers, source });
      const assertionType = getAssertionType(
        /** @type {Parameters<typeof getAssertionType>[0]} */ (
          /** @type {unknown} */ (astPath.node)
        ),
      );
      if (assertionType) {
        entry.assertionType = assertionType;
      }
      transformedFile.push(entry);
    },
    ExportNamedDeclaration(astPath) {
      const { node } = /** @type {{ node: LooseNode }} */ (astPath);
      // Are we dealing with a regular export, not a re-export?
      if (!node.source) return;

      const importSpecifiers = getImportOrReexportsSpecifiers(node);
      const source = node.source?.value;
      const entry = /** @type {Partial<FindImportsAnalyzerEntry>} */ ({ importSpecifiers, source });
      const assertionType = getAssertionType(
        /** @type {Parameters<typeof getAssertionType>[0]} */ (
          /** @type {unknown} */ (astPath.node)
        ),
      );
      if (assertionType) {
        entry.assertionType = assertionType;
      }
      transformedFile.push(entry);
    },
    ExportAllDeclaration(astPath) {
      const { node } = /** @type {{ node: LooseNode }} */ (astPath);
      // Are we dealing with a regular export, not a re-export?
      if (!node.source) return;

      const importSpecifiers = ['[*]'];

      const source = node.source?.value;
      const entry = /** @type {Partial<FindImportsAnalyzerEntry>} */ ({ importSpecifiers, source });
      const assertionType = getAssertionType(
        /** @type {Parameters<typeof getAssertionType>[0]} */ (
          /** @type {unknown} */ (astPath.node)
        ),
      );
      if (assertionType) {
        entry.assertionType = assertionType;
      }
      transformedFile.push(entry);
    },
    // Dynamic imports for swc
    // TODO: remove if swc is completely phased out
    CallExpression(astPath) {
      const { node } = /** @type {{ node: LooseNode }} */ (astPath);
      if (node.callee?.type !== 'Import') {
        return;
      }
      // TODO: check for specifiers catched via obj destructuring?
      // TODO: also check for ['file']
      const importSpecifiers = ['[default]'];
      const args = /** @type {LooseNode[]} */ (node.arguments);
      const dynamicImportExpression = args[0].expression;
      const source = isLiteral(dynamicImportExpression)
        ? /** @type {string} */ (dynamicImportExpression?.value)
        : '[variable]';
      transformedFile.push({ importSpecifiers, source });
    },
    // Dynamic imports for oxc

    ExpressionStatement(astPath) {
      const { node } = /** @type {{ node: LooseNode }} */ (astPath);
      if (node.expression?.type !== 'ImportExpression') return;

      // TODO: check for specifiers catched via obj destructuring?
      // TODO: also check for ['file']
      const importSpecifiers = ['[default]'];
      const dynamicImportExpression = node.expression;
      const source = isLiteral(dynamicImportExpression.source)
        ? /** @type {string} */ (dynamicImportExpression.source?.value)
        : '[variable]';
      transformedFile.push({ importSpecifiers, source });
    },
  });

  return transformedFile;
}

export default class FindImportsSwcAnalyzer extends Analyzer {
  static analyzerName = /** @type {AnalyzerName} */ ('find-imports');

  static requiredAst = /** @type {AnalyzerAst} */ ('oxc');

  get config() {
    return /** @type {Analyzer['config']} */ (
      /** @type {unknown} */ ({
        targetProjectPath: null,
        // post process file
        keepInternalSources: false,
        ...this._customConfig,
      })
    );
  }

  /**
   * @param {oxcAstModule} oxcAst
   * @param {{ relativePath:string; analyzerCfg: FindImportsConfig }} context
   */
  static async analyzeFile(oxcAst, context) {
    let transformedFile = findImportsPerAstFile(oxcAst);
    // Post processing based on configuration...
    transformedFile = await normalizeSourcePaths(
      transformedFile,
      context.relativePath,
      context.analyzerCfg.targetProjectPath,
    );

    if (!context.analyzerCfg.keepInternalSources) {
      transformedFile = transformedFile.filter(
        entry => !isRelativeSourcePath(/** @type {string} */ (entry.source)),
      );
    }

    return { result: transformedFile };
  }
}
