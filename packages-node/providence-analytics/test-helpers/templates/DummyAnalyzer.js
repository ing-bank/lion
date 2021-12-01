const { Analyzer } = require('../../src/program/core/Analyzer.js');

/**
 * @typedef {import('@babel/types').File} File
 * @typedef {import('../../src/program/types/core').QueryOutputEntry} QueryOutputEntry
 */

/**
 * This file outlines the minimum required functionality for an analyzer.
 * Whenever a new analyzer is created, this file can serve as a guideline on how to do this.
 * For 'match-analyzers' (having requiresReference: true), please look in the analyzers folder for
 * an example
 */

/**
 * Everything that is configured via {AnalyzerConfig} [customConfig] in the execute
 * function, should be configured here
 */
const options = {
  optionA(entryResult) {
    // here, we perform a transformation on the entryResult
    return entryResult;
  },
};

/**
 * This file takes the output of one AST (or 'program'), which
 * corresponds to one file.
 * The contents of this function should be designed in such a way that they
 * can be directly pasted and edited in https://astexplorer.net/
 * @param {File} ast
 */
// eslint-disable-next-line no-unused-vars
function myAnalyzerPerAstEntry(ast) {
  // Visit AST...
  const transformedEntryResult = [];
  // Do the traverse: https://babeljs.io/docs/en/babel-traverse
  // Inside of ypur traverse function, add when there is a match wrt intended analysis
  transformedEntryResult.push({ matched: 'entry' });
  return transformedEntryResult;
}

class DummyAnalyzer extends Analyzer {
  static get analyzerName() {
    return 'dummy-analyzer';
  }

  /**
   * @param {AstDataProject[]} astDataProjects
   * @param {AnalyzerConfig} [customConfig]
   * @returns {QueryResult}
   */
  async execute(customConfig = {}) {
    const cfg = {
      targetProjectPaths: null,
      optionA: false,
      optionB: '',
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
    const queryOutput = await this._traverse((ast, astContext) => {
      // Run the traversel per entry
      let transformedEntryResult = myAnalyzerPerAstEntry(ast);
      const meta = {};

      // (optional): Post processors on TransformedEntry
      if (cfg.optionA) {
        // Run entry transformation based on option A
        transformedEntryResult = options.optionA(astContext);
      }

      return { result: transformedEntryResult, meta };
    });
    // (optional): Post processors on TransformedQueryResult
    if (cfg.optionB) {
      // Run your QueryResult transformation based on option B
    }

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }
}

module.exports = { DummyAnalyzer };
