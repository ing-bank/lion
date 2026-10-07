import { Analyzer } from '../../src/program/core/Analyzer.js';

/**
 * @typedef {import('@babel/types').File} File
 * @typedef {import('../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../types/index.js').QueryOutputEntry} QueryOutputEntry
 * @typedef {import('../../types/index.js').AnalyzerConfig} AnalyzerConfig
 * @typedef {import('../../types/index.js').QueryOutput} QueryOutput
 * @typedef {import('../../types/index.js').ProjectInputDataWithMeta} ProjectInputDataWithMeta
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
 * @type {{ optionA: (entryResult: unknown) => unknown }}
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
function getResultPerAstFile(ast) {
  // Visit AST...
  const transformedEntryResult = [];
  // Do the traverse: https://babeljs.io/docs/en/babel-traverse
  // Inside of ypur traverse function, add when there is a match wrt intended analysis
  transformedEntryResult.push({ matched: 'entry' });
  return transformedEntryResult;
}

export class DummyAnalyzer extends Analyzer {
  /** @type {AnalyzerName} */
  static analyzerName = 'find-dummy-analyzer';

  /**
   * @param {AnalyzerConfig} customConfig
   */
  async execute(customConfig) {
    const cfg = {
      targetProjectPaths: null,
      optionA: false,
      optionB: '',
      ...customConfig,
    };

    /**
     * Prepare
     */
    const analyzerResult = await this._prepare(cfg);
    if (analyzerResult) {
      return analyzerResult;
    }

    /**
     * Traverse
     */
    const self =
      /** @type {{ _traverse: (fn: (ast: File, astContext: { code: string; relativePath: string; projectData: ProjectInputDataWithMeta }) => object) => Promise<QueryOutput> }} */ (
        /** @type {unknown} */ (this)
      );
    const queryOutput = await self._traverse((ast, astContext) => {
      // Run the traversel per entry
      /** @type {unknown} */
      let transformedEntryResult = getResultPerAstFile(ast);
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
