/* eslint-disable no-shadow, no-param-reassign */
import babelTraverse from '@babel/traverse';
import { isRelativeSourcePath } from '../utils/relative-source-path.js';
import { normalizeSourcePaths } from './helpers/normalize-source-paths.js';
import { Analyzer } from '../core/Analyzer.js';
import { LogService } from '../core/LogService.js';

/**
 * @typedef {import('@babel/types').File} File
 * @typedef {import('@babel/types').Node} Node
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').AnalyzerConfig} AnalyzerConfig
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 * @typedef {import('../../../types/index.js').FindImportsAnalyzerEntry} FindImportsAnalyzerEntry
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 */

/**
 * Options that allow to filter 'on a file basis'.
 * We can also filter on the total result
 */
const /** @type {AnalyzerConfig} */ options = {
    /**
     * Only leaves entries with external sources:
     * - keeps: '@open-wc/testing'
     * - drops: '../testing'
     * @param {FindImportsAnalyzerQueryOutput} result
     * @param {string} targetSpecifier for instance 'LitElement'
     */
    onlyExternalSources(result) {
      return result.filter(entry => !isRelativeSourcePath(entry.source));
    },
  };

/**
 * @param {Node} node
 */
function getImportOrReexportsSpecifiers(node) {
  return node.specifiers.map(s => {
    if (
      s.type === 'ImportDefaultSpecifier' ||
      s.type === 'ExportDefaultSpecifier' ||
      (s.type === 'ExportSpecifier' && s.exported?.name === 'default')
    ) {
      return '[default]';
    }
    if (s.type === 'ImportNamespaceSpecifier' || s.type === 'ExportNamespaceSpecifier') {
      return '[*]';
    }
    if ((s.imported && s.type === 'ImportNamespaceSpecifier') || s.type === 'ImportSpecifier') {
      return s.imported.name;
    }
    if (s.exported && s.type === 'ExportNamespaceSpecifier') {
      return s.exported.name;
    }
    return s.local.name;
  });
}

/**
 * Finds import specifiers and sources
 * @param {File} babelAst
 */
function findImportsPerAstFile(babelAst, context) {
  LogService.debug(`Analyzer "find-imports": started findImportsPerAstFile method`);

  // https://github.com/babel/babel/blob/672a58660f0b15691c44582f1f3fdcdac0fa0d2f/packages/babel-core/src/transformation/index.ts#L110
  // Visit AST...
  /** @type {Partial<FindImportsAnalyzerEntry>[]} */
  const transformedFile = [];
  babelTraverse.default(babelAst, {
    ImportDeclaration(path) {
      const importSpecifiers = getImportOrReexportsSpecifiers(path.node);
      if (!importSpecifiers.length) {
        importSpecifiers.push('[file]'); // apparently, there was just a file import
      }
      const source = path.node.source.value;
      const entry = /** @type {Partial<FindImportsAnalyzerEntry>} */ ({ importSpecifiers, source });
      if (path.node.assertions?.length) {
        entry.assertionType = path.node.assertions[0].value?.value;
      }
      transformedFile.push(entry);
    },
    // Dynamic imports
    CallExpression(path) {
      if (path.node.callee?.type !== 'Import') {
        return;
      }
      // TODO: check for specifiers catched via obj destructuring?
      // TODO: also check for ['file']
      const importSpecifiers = ['[default]'];
      let source = path.node.arguments[0].value;
      if (!source) {
        // TODO: with advanced retrieval, we could possibly get the value
        source = '[variable]';
      }
      transformedFile.push({ importSpecifiers, source });
    },
    ExportNamedDeclaration(path) {
      if (!path.node.source) {
        return; // we are dealing with a regular export, not a reexport
      }
      const importSpecifiers = getImportOrReexportsSpecifiers(path.node);
      const source = path.node.source.value;
      const entry = /** @type {Partial<FindImportsAnalyzerEntry>} */ ({ importSpecifiers, source });
      if (path.node.assertions?.length) {
        entry.assertionType = path.node.assertions[0].value?.value;
      }
      transformedFile.push(entry);
    },
    // ExportAllDeclaration(path) {
    //   if (!path.node.source) {
    //     return; // we are dealing with a regular export, not a reexport
    //   }
    //   const importSpecifiers = ['[*]'];
    //   const source = path.node.source.value;
    //   transformedFile.push({ importSpecifiers, source });
    // },
  });

  return transformedFile;
}

export default class FindImportsAnalyzer extends Analyzer {
  /** @type {AnalyzerName} */
  static analyzerName = 'find-imports';

  /** @type {'babel'|'swc-to-babel'} */
  requiredAst = 'swc-to-babel';

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
    const queryOutput = await this._traverse(async (ast, context) => {
      let transformedFile = findImportsPerAstFile(ast, context);
      // Post processing based on configuration...
      transformedFile = await normalizeSourcePaths(
        transformedFile,
        context.relativePath,
        cfg.targetProjectPath,
      );

      if (!cfg.keepInternalSources) {
        transformedFile = options.onlyExternalSources(transformedFile);
      }

      return { result: transformedFile };
    });

    // if (cfg.sortBySpecifier) {
    //   queryOutput = sortBySpecifier.execute(queryOutput, {
    //     ...cfg,
    //     specifiersKey: 'importSpecifiers',
    //   });
    // }

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }
}
