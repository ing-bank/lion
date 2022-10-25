/**
 * @typedef {import('../../types/analyzers').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 */

/**
 * Convert to more easily iterable object
 *
 * From:
 * ```js
 * [
 *  "file": "./file-1.js",
 *  "result": [{
 *    "importSpecifiers": [ "a", "b" ],
 *    "source": "exporting-ref-project",
 *    "normalizedSource": "exporting-ref-project"
 * }], ,
 * ```
 * To:
 * ```js
 * [{
 *   "file": ""./file-1.js",
 *   "importSpecifier": "a",,
 *   "source": "exporting-ref-project",
 *   "normalizedSource": "exporting-ref-project"
 * },
 * {{
 *   "file": ""./file-1.js",
 *   "importSpecifier": "b",,
 *   "source": "exporting-ref-project",
 *   "normalizedSource": "exporting-ref-project"
 * }}],
 *
 * @param {FindImportsAnalyzerResult} importsAnalyzerResult
 */
function transformIntoIterableFindImportsOutput(importsAnalyzerResult) {
  /** @type {IterableFindImportsAnalyzerEntry[]} */
  const iterableEntries = [];

  for (const { file, result } of importsAnalyzerResult.queryOutput) {
    for (const { importSpecifiers, source, normalizedSource } of result) {
      if (!importSpecifiers) {
        // eslint-disable-next-line no-continue
        continue;
      }
      for (const importSpecifier of importSpecifiers) {
        /** @type {IterableFindImportsAnalyzerEntry} */
        const resultEntry = {
          file,
          specifier: importSpecifier,
          source,
          normalizedSource,
        };
        iterableEntries.push(resultEntry);
      }
    }
  }
  return iterableEntries;
}

module.exports = {
  transformIntoIterableFindImportsOutput,
};
