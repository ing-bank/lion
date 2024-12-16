/* eslint-disable no-shadow, no-param-reassign */
import { normalizeSourcePaths } from './helpers/normalize-source-paths.js';
import { isRelativeSourcePath } from '../utils/relative-source-path.js';
import { getAssertionType } from '../utils/get-assertion-type.js';
import { oxcTraverse } from '../utils/oxc-traverse.js';
import { LogService } from '../core/LogService.js';
import { Analyzer } from '../core/Analyzer.js';

/**
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerEntry} FindImportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').AnalyzerConfig} AnalyzerConfig
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import("@swc/core").Module} oxcAstModule
 * @typedef {import("@swc/core").Node} SwcNode
 */

// const exportedNames = ['exported'];
// const importedNames = ['orig', 'imported', 'local'];
// const valueNames = ['name', 'value'];

/**
 * Intends to work for oxc, swc, and babel asts
 */
function getSpecifierValue(s) {
  // for (const exportedorImportedName of [...exportedNames, ...importedNames]) {
  //   for (const valueName of valueNames) {
  //     const result = s[exportedorImportedName][valueName];
  //     if (result) return result;
  //   }
  // }
  // return undefined;

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
 * @param {SwcNode} node
 */
function getImportOrReexportsSpecifiers(node) {
  // @ts-expect-error
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
    return importedValue;
  });
}

/**
 * Finds import specifiers and sources
 * @param {oxcAstModule} oxcAst
 */
function findImportsPerAstFile(oxcAst) {
  LogService.debug(`Analyzer "find-imports": started findImportsPerAstFile method`);

  // https://github.com/babel/babel/blob/672a58660f0b15691c44582f1f3fdcdac0fa0d2f/packages/babel-core/src/transformation/index.ts#L110
  // Visit AST...
  /** @type {Partial<FindImportsAnalyzerEntry>[]} */
  const transformedFile = [];
  oxcTraverse(oxcAst, {
    ImportDeclaration({ node }) {
      const importSpecifiers = getImportOrReexportsSpecifiers(node);
      if (!importSpecifiers.length) {
        importSpecifiers.push('[file]'); // apparently, there was just a file import
      }

      const source = node.source.value;
      const entry = /** @type {Partial<FindImportsAnalyzerEntry>} */ ({ importSpecifiers, source });
      const assertionType = getAssertionType(node);
      if (assertionType) {
        entry.assertionType = assertionType;
      }
      transformedFile.push(entry);
    },
    ExportNamedDeclaration({ node }) {
      // Are we dealing with a regular export, not a re-export?
      if (!node.source) return;

      const importSpecifiers = getImportOrReexportsSpecifiers(node);
      const source = node.source.value;
      const entry = /** @type {Partial<FindImportsAnalyzerEntry>} */ ({ importSpecifiers, source });
      const assertionType = getAssertionType(node);
      if (assertionType) {
        entry.assertionType = assertionType;
      }
      transformedFile.push(entry);
    },
    ExportAllDeclaration({ node }) {
      // Are we dealing with a regular export, not a re-export?
      if (!node.source) return;

      const importSpecifiers = ['[*]'];

      const source = node.source.value;
      const entry = /** @type {Partial<FindImportsAnalyzerEntry>} */ ({ importSpecifiers, source });
      const assertionType = getAssertionType(node);
      if (assertionType) {
        entry.assertionType = assertionType;
      }
      transformedFile.push(entry);
    },
    // Dynamic imports for swc
    // TODO: remove if swc is completely phased out
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
    // Dynamic imports for oxc

    ExpressionStatement({ node }) {
      if (node.expression.type !== 'ImportExpression') return;

      // TODO: check for specifiers catched via obj destructuring?
      // TODO: also check for ['file']
      const importSpecifiers = ['[default]'];
      const dynamicImportExpression = node.expression;
      const source =
        dynamicImportExpression.source?.type === 'StringLiteral'
          ? dynamicImportExpression.source.value
          : '[variable]';
      transformedFile.push({ importSpecifiers, source });
    },
  });

  return transformedFile;
}

export default class FindImportsSwcAnalyzer extends Analyzer {
  static analyzerName = /** @type {AnalyzerName} */ ('find-imports');

  static requiredAst = /** @type {AnalyzerAst} */ ('oxc');

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
    const cachedAnalyzerResult = await this._prepare(cfg);
    if (cachedAnalyzerResult) {
      return cachedAnalyzerResult;
    }

    /**
     * Traverse
     */
    const queryOutput = await this._traverse(async (oxcAst, context) => {
      // @ts-expect-error
      let transformedFile = findImportsPerAstFile(oxcAst);
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
