/**
 * Example post processor. Copy this file into your own project and adapt it.
 *
 * @typedef {import('../../types/index.js').AnalyzerConfig} AnalyzerConfig
 *
 * @typedef {{ foo: string; bar: number }} TemplateResultEntry
 * @typedef {{ result: TemplateResultEntry[] }} TemplateAnalyzerEntry
 * @typedef {{ name: string }} TemplateProject
 * @typedef {{ entries: TemplateAnalyzerEntry[]; project: TemplateProject }} TemplateQueryOutputEntry
 * @typedef {{ transformed: string; output: number }} TemplateTransformedEntry
 *
 * @typedef {object} PostProcessorOptions
 * @property {(transformedResult: TemplateTransformedEntry[][][]) => TemplateTransformedEntry[][][]} [optionA]
 * @property {unknown} [optionFoo]
 */

/** @type {{ optionA: (transformedResult: TemplateTransformedEntry[][][]) => TemplateTransformedEntry[][][] }} */
const options = {
  optionA(transformedResult) {
    return transformedResult;
  },
};

/**
 *
 * @param {TemplateQueryOutputEntry[]} analyzerResult
 * @param {AnalyzerConfig} customConfig
 * @returns {TemplateTransformedEntry[][][]}
 */
function myPostProcessor(analyzerResult, customConfig) {
  /** @type {PostProcessorOptions} */
  const cfg = {
    optionFoo: null,
    ...customConfig,
  };

  let transformedResult = analyzerResult.map(({ entries, project }) => {
    // eslint-disable-next-line no-unused-vars
    const projectName = project.name;
    return entries.map(entry =>
      entry.result.map(resultForEntry => ({
        transformed: resultForEntry.foo,
        output: resultForEntry.bar,
      })),
    );
  });

  if (cfg.optionA) {
    transformedResult = options.optionA(transformedResult);
  }

  return transformedResult;
}

module.exports = {
  name: 'my-post-processor',
  execute: myPostProcessor,
  compatibleAnalyzers: ['analyzer-template'],
  // This means it transforms the result output of an analyzer, and multiple
  // post processors cannot be chained after this one
  modifiesOutputStructure: true,
};
