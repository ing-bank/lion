/* eslint-disable no-shadow, no-param-reassign */
import { isRelativeSourcePath } from '../utils/relative-source-path.js';
import { swcTraverse } from '../utils/swc-traverse.js';
import { normalizeSourcePaths } from './helpers/normalize-source-paths.js';
import { Analyzer } from '../core/Analyzer.js';
import { LogService } from '../core/LogService.js';

/**
 * @typedef {import("@swc/core").Module} SwcAstModule
 * @typedef {import("@swc/core").Node} SwcNode
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').AnalyzerConfig} AnalyzerConfig
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerEntry} FindImportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 */

/**
 * @param {SwcNode} node
 */
function getImportOrReexportsSpecifiers(node) {
  // @ts-expect-error
  return node.specifiers.map(s => {
    if (
      s.type === 'ImportDefaultSpecifier' ||
      s.type === 'ExportDefaultSpecifier' ||
      (s.type === 'ExportSpecifier' && s.exported?.value === 'default')
    ) {
      return '[default]';
    }
    if (s.type === 'ImportNamespaceSpecifier' || s.type === 'ExportNamespaceSpecifier') {
      return '[*]';
    }
    const importedValue = s.imported?.value || s.orig?.value || s.exported?.value || s.local?.value;
    return importedValue;
  });
}

/**
 * Finds import specifiers and sources
 * @param {SwcAstModule} swcAst
 */
function findImportsPerAstFile(swcAst) {
  LogService.debug(`Analyzer "find-imports": started findImportsPerAstFile method`);

  // https://github.com/babel/babel/blob/672a58660f0b15691c44582f1f3fdcdac0fa0d2f/packages/babel-core/src/transformation/index.ts#L110
  // Visit AST...
  /** @type {Partial<FindImportsAnalyzerEntry>[]} */
  const transformedFile = [];

  swcTraverse(swcAst, {
    ImportDeclaration({ node }) {
      const importSpecifiers = getImportOrReexportsSpecifiers(node);
      if (!importSpecifiers.length) {
        importSpecifiers.push('[file]'); // apparently, there was just a file import
      }
      const source = node.source.value;
      const entry = /** @type {Partial<FindImportsAnalyzerEntry>} */ ({ importSpecifiers, source });
      if (node.asserts) {
        entry.assertionType = node.asserts.properties[0].value?.value;
      }
      transformedFile.push(entry);
    },
    ExportNamedDeclaration({ node }) {
      if (!node.source) {
        return; // we are dealing with a regular export, not a reexport
      }
      const importSpecifiers = getImportOrReexportsSpecifiers(node);
      const source = node.source.value;
      const entry = /** @type {Partial<FindImportsAnalyzerEntry>} */ ({ importSpecifiers, source });
      if (node.asserts) {
        entry.assertionType = node.asserts.properties[0].value?.value;
      }
      transformedFile.push(entry);
    },
    // Dynamic imports
    CallExpression({ node }) {
      if (node.callee?.type !== 'Import') {
        return;
      }
      // TODO: check for specifiers catched via obj destructuring?
      // TODO: also check for ['file']
      const importSpecifiers = ['[default]'];
      const dynamicImportExpression = node.arguments[0].expression;
      const source =
        dynamicImportExpression.type === 'StringLiteral'
          ? dynamicImportExpression.value
          : '[variable]';
      transformedFile.push({ importSpecifiers, source });
    },
  });

  return transformedFile;
}

export default class FindImportsSwcAnalyzer extends Analyzer {
  static analyzerName = /** @type {AnalyzerName} */ ('find-imports');

  static requiredAst = /** @type {AnalyzerAst} */ ('swc');

  /**
   * Finds import specifiers and sources
   * @param {FindImportsConfig} customConfig
   */
  async execute(customConfig = {}) {
    /**
     * @typedef FindImportsConfig
     * @property {boolean} [keepInternalSources=false] by default, relative paths like '../x.js' are
     * filtered out. This option keeps them.
     * means that 'external-dep/file' will be resolved to 'external-dep/file.js' will both be stored
     * as the latter
     */
    const cfg = {
      targetProjectPath: null,
      // post process file
      keepInternalSources: false,
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
    const queryOutput = await this._traverse(async (swcAst, context) => {
      // @ts-expect-error
      let transformedFile = findImportsPerAstFile(swcAst);
      // Post processing based on configuration...
      transformedFile = await normalizeSourcePaths(
        transformedFile,
        context.relativePath,
        // @ts-expect-error
        cfg.targetProjectPath,
      );

      if (!cfg.keepInternalSources) {
        // @ts-expect-error
        transformedFile = transformedFile.filter(entry => !isRelativeSourcePath(entry.source));
      }

      return { result: transformedFile };
    });

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }
}
