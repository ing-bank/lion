/* eslint-disable no-shadow, no-param-reassign */
// const { default: traverse } = require('@babel/traverse');
const { isRelativeSourcePath } = require('../utils/relative-source-path.js');
const { normalizeSourcePaths } = require('./helpers/normalize-source-paths.js');
const { Analyzer } = require('./helpers/Analyzer.js');
const { traverseHtml } = require('../utils/traverse-html.js');

/**
 * Options that allow to filter 'on a file basis'.
 * We can also filter on the total result
 */
const /** @type {AnalyzerOptions} */ options = {
    /**
     * @desc Only leaves entries with external sources:
     * - keeps: '@open-wc/testing'
     * - drops: '../testing'
     * @param {FindImportsAnalysisResult} result
     * @param {string} targetSpecifier for instance 'LitElement'
     */
    onlyExternalSources(result) {
      return result.filter(entry => !isRelativeSourcePath(entry.normalizedSource));
    },
  };

/**
 * @desc Finds import specifiers and sources
 * @param {BabelAst} ast
 * @param {string} context.relativePath the file being currently processed
 */
function findHtmlImportsPerAstEntry(ast) {
  // Visit AST...
  const transformedEntry = [];
  traverseHtml(ast, {
    link(p5Path) {
      const isHtmlImport = Boolean(
        p5Path.node.attrs.find(a => a.name === 'rel' && a.value === 'import'),
      );
      if (isHtmlImport) {
        const hrefAttr = p5Path.node.attrs.find(a => a.name === 'href');
        if (!hrefAttr) {
          return;
        }
        const source = hrefAttr.value;
        // This will always be the same for an html import. However, we add this specifier to
        // align the result with that of 'find-imports' analyzer
        const importSpecifiers = ['[file]'];
        transformedEntry.push({ source, importSpecifiers });
      }
    },
  });
  return transformedEntry;
}

class FindHtmlImportsAnalyzer extends Analyzer {
  constructor() {
    super();
    this.name = 'find-html-imports';
    this.requiredAst = 'parse5';
  }

  /**
   * @desc Finds import specifiers and sources
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
      let transformedEntry = findHtmlImportsPerAstEntry(ast);
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

module.exports = FindHtmlImportsAnalyzer;
