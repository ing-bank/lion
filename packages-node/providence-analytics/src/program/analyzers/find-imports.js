/* eslint-disable no-shadow, no-param-reassign */
const { default: traverse } = require('@babel/traverse');
const { isRelativeSourcePath } = require('../utils/relative-source-path.js');
const { normalizeSourcePaths } = require('./helpers/normalize-source-paths.js');
const { Analyzer } = require('./helpers/Analyzer.js');
const { LogService } = require('../services/LogService.js');

/**
 * @typedef {import('../types/core').AnalyzerName} AnalyzerName
 * @typedef {import('../types/analyzers').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 * @typedef {import('../types/analyzers').FindImportsAnalyzerEntry} FindImportsAnalyzerEntry
 * @typedef {import('../types/core').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 */

/**
 * Options that allow to filter 'on a file basis'.
 * We can also filter on the total result
 */
const /** @type {AnalyzerOptions} */ options = {
    /**
     * Only leaves entries with external sources:
     * - keeps: '@open-wc/testing'
     * - drops: '../testing'
     * @param {FindImportsAnalyzerResult} result
     * @param {string} targetSpecifier for instance 'LitElement'
     */
    onlyExternalSources(result) {
      return result.filter(entry => !isRelativeSourcePath(entry.source));
    },
  };

function getImportOrReexportsSpecifiers(node) {
  return node.specifiers.map(s => {
    if (s.type === 'ImportDefaultSpecifier' || s.type === 'ExportDefaultSpecifier') {
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
 * @param {any} ast
 */
function findImportsPerAstEntry(ast) {
  LogService.debug(`Analyzer "find-imports": started findImportsPerAstEntry method`);

  // Visit AST...
  /** @type {Partial<FindImportsAnalyzerEntry>[]} */
  const transformedEntry = [];
  traverse(ast, {
    ImportDeclaration(path) {
      const importSpecifiers = getImportOrReexportsSpecifiers(path.node);
      if (!importSpecifiers.length) {
        importSpecifiers.push('[file]'); // apparently, there was just a file import
      }
      const source = path.node.source.value;
      const entry = { importSpecifiers, source };
      if (path.node.assertions?.length) {
        entry.assertionType = path.node.assertions[0].value?.value;
      }
      transformedEntry.push(entry);
    },
    // Dynamic imports
    CallExpression(path) {
      if (path.node.callee && path.node.callee.type === 'Import') {
        // TODO: check for specifiers catched via obj destructuring?
        // TODO: also check for ['file']
        const importSpecifiers = ['[default]'];
        let source = path.node.arguments[0].value;
        if (!source) {
          // TODO: with advanced retrieval, we could possibly get the value
          source = '[variable]';
        }
        transformedEntry.push({ importSpecifiers, source });
      }
    },
    ExportNamedDeclaration(path) {
      if (!path.node.source) {
        return; // we are dealing with a regular export, not a reexport
      }
      const importSpecifiers = getImportOrReexportsSpecifiers(path.node);
      const source = path.node.source.value;
      const entry = { importSpecifiers, source };
      if (path.node.assertions?.length) {
        entry.assertionType = path.node.assertions[0].value?.value;
      }
      transformedEntry.push(entry);
    },
    // ExportAllDeclaration(path) {
    //   if (!path.node.source) {
    //     return; // we are dealing with a regular export, not a reexport
    //   }
    //   const importSpecifiers = ['[*]'];
    //   const source = path.node.source.value;
    //   transformedEntry.push({ importSpecifiers, source });
    // },
  });

  return transformedEntry;
}

class FindImportsAnalyzer extends Analyzer {
  constructor() {
    super();
    /** @type {AnalyzerName} */
    this.name = 'find-imports';
  }

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
    const analyzerResult = this._prepare(cfg);
    if (analyzerResult) {
      return analyzerResult;
    }

    /**
     * Traverse
     */
    const queryOutput = await this._traverse(async (ast, { relativePath }) => {
      let transformedEntry = findImportsPerAstEntry(ast);
      // Post processing based on configuration...
      transformedEntry = await normalizeSourcePaths(
        transformedEntry,
        relativePath,
        cfg.targetProjectPath,
      );

      if (!cfg.keepInternalSources) {
        transformedEntry = options.onlyExternalSources(transformedEntry);
      }

      return { result: transformedEntry };
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

module.exports = FindImportsAnalyzer;
