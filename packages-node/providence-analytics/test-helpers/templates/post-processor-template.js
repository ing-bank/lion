const /** @type {PostProcessorOptions} */ options = {
    optionA(transformedResult) {
      return transformedResult;
    },
  };

/**
 *
 * @param {AnalyzerResult} analyzerResult
 * @param {FindImportsConfig} customConfig
 * @returns {AnalyzerResult}
 */
function myPostProcessor(analyzerResult, customConfig) {
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

  return /** @type {AnalyzerResult} */ transformedResult;
}

module.exports = {
  name: 'my-post-processor',
  execute: myPostProcessor,
  compatibleAnalyzers: ['analyzer-template'],
  // This means it transforms the result output of an analyzer, and multiple
  // post processors cannot be chained after this one
  modifiesOutputStructure: true,
};
