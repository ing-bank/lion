/**
 * @typedef {import('../../../../types/index.js').FindExportsAnalyzerResult} FindExportsAnalyzerResult
 * @typedef {import('../../../../types/index.js').FindExportsAnalyzerEntry} FindExportsAnalyzerEntry
 * @typedef {import('../../../../types/index.js').IterableFindExportsAnalyzerEntry} IterableFindExportsAnalyzerEntry
 * @typedef {import('../../../../types/index.js').RootFile} RootFile
 * @typedef {FindExportsAnalyzerEntry & { localMap?: unknown[]; meta?: object }} EntryWithMeta
 */

/*
 * Convert to more easily iterable object
 *
 * From:
 * [
 *  "file": "./file-1.js",
 *  "result": [{
 *    "exportSpecifiers": [ "a", "b"],
 *    "localMap": [{...},{...}],
 *    "source": null,
 *    "rootFileMap": [{"currentFileSpecifier": "a", "rootFile": { "file": "[current]", "specifier": "a" }}]
 *  }]
 * ]
 * To:
 * [{
 *   "file": "./file-1.js",
 *   "exportSpecifier": "a",
 *   "localSpecifier": "a",
 *   "source": null,
 *   "rootFile": {...}
 * }, {
 *   "file": "./file-1.js",
 *   "exportSpecifier": "b",
 *   "localSpecifier": "b",
 *   "source": null,
 *   "rootFile": {...}
 * }]
 */

/**
 * @param {FindExportsAnalyzerResult} exportsAnalyzerResult
 * @returns {IterableFindExportsAnalyzerEntry[]}
 */
export function transformIntoIterableFindExportsOutput(exportsAnalyzerResult) {
  /** @type {IterableFindExportsAnalyzerEntry[]} */
  const iterableEntries = [];

  for (const { file, result } of exportsAnalyzerResult.queryOutput) {
    for (const entry of result) {
      const { exportSpecifiers, source, rootFileMap, localMap, meta } =
        /** @type {EntryWithMeta} */ (entry);
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
          rootFile: /** @type {RootFile} */ (
            /** @type {unknown} */ (rootFileMap ? rootFileMap[i] : undefined)
          ),
          localSpecifier: /** @type {string} */ (
            /** @type {unknown} */ (localMap ? localMap[i] : undefined)
          ),
          meta,
        };
        iterableEntries.push(resultEntry);
      }
    }
  }
  return iterableEntries;
}
