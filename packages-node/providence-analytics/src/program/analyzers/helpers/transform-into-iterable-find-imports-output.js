/**
 * @typedef {import('../../../../types/index.js').FindImportsAnalyzerResult} FindImportsAnalyzerResult
 * @typedef {import('../../../../types/index.js').IterableFindImportsAnalyzerEntry} IterableFindImportsAnalyzerEntry
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
export function transformIntoIterableFindImportsOutput(importsAnalyzerResult) {
  /** @type {IterableFindImportsAnalyzerEntry[]} */
  const iterableEntries = [];

  for (const { file, result } of importsAnalyzerResult.queryOutput) {
    for (const { importSpecifiers, source, normalizedSource } of result) {
      if (!importSpecifiers) {
        // eslint-disable-next-line no-continue
        continue;
      }
      for (const importSpecifier of importSpecifiers) {
        const resultEntry = /** @type {IterableFindImportsAnalyzerEntry} */ ({
          file,
          specifier: importSpecifier,
          source,
          normalizedSource,
        });
        iterableEntries.push(resultEntry);
      }
    }
  }
  return iterableEntries;
}
