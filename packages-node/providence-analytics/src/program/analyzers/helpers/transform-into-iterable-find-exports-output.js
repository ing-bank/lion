/**
 * @typedef {import('../../types/analyzers').FindExportsAnalyzerResult} FindExportsAnalyzerResult
 */

/**
 * Convert to more easily iterable object
 *
 * From:
 * ```js
 * [
 *  "file": "./file-1.js",
 *  "result": [{
 *    "exportSpecifiers": [ "a", "b"],
 *    "localMap": [{...},{...}],
 *    "source": null,
 *    "rootFileMap": [{"currentFileSpecifier": "a", "rootFile": { "file": "[current]", "specifier": "a" }}]
 *  }, ...],
 * ```
 * To:
 * ```js
 * [{
 *   "file": ""./file-1.js",
 *   "exportSpecifier": "a",
 *   "localMap": {...},
 *   "source": null,
 *   "rootFileMap": {...}
 * },
 * {{
 *   "file": ""./file-1.js",
 *   "exportSpecifier": "b",
 *   "localMap": {...},
 *   "source": null,
 *   "rootFileMap": {...}
 * }}],
 *
 * @param {FindExportsAnalyzerResult} exportsAnalyzerResult
 */
function transformIntoIterableFindExportsOutput(exportsAnalyzerResult) {
  /** @type {IterableFindExportsAnalyzerEntry[]} */
  const iterableEntries = [];

  for (const { file, result } of exportsAnalyzerResult.queryOutput) {
    for (const { exportSpecifiers, source, rootFileMap, localMap, meta } of result) {
      if (!exportSpecifiers) {
        // eslint-disable-next-line no-continue
        continue;
      }
      for (const exportSpecifier of exportSpecifiers) {
        const i = exportSpecifiers.indexOf(exportSpecifier);
        /** @type {IterableFindExportsAnalyzerEntry} */
        const resultEntry = {
          file,
          specifier: exportSpecifier,
          source,
          rootFile: rootFileMap ? rootFileMap[i] : undefined,
          localSpecifier: localMap ? localMap[i] : undefined,
          meta,
        };
        iterableEntries.push(resultEntry);
      }
    }
  }
  return iterableEntries;
}
module.exports = {
  transformIntoIterableFindExportsOutput,
};
