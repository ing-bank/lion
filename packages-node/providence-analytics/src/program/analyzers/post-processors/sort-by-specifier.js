import pathLib from 'path';
import { LogService } from '../../core/LogService.js';

/**
 * @typedef {import('../../../../types/index.js').AnalyzerQueryResult} AnalyzerQueryResult
 * @typedef {{ specifier?: string; source?: string; id?: string; dependents?: string[]; [key: string]: unknown }} SpecifierResult
 * @typedef {{ normalizedSource?: string; source?: string; [key: string]: unknown }} SortResultEntry
 * @typedef {{ file: string; result: SortResultEntry[] }} SortInputEntry
 * @typedef {{ entries: SortInputEntry[]; project: { name: string } }} SortInputProject
 * @typedef {{ filterSpecifier: (results: SpecifierResult[], targetSpecifier: string, specifiersKey: string) => SpecifierResult[] }} AnalyzerOptions
 * @typedef {{ filterSpecifier?: string; specifiersKey?: string; keepOriginalSourcePaths?: boolean }} SortBySpecifierConfig
 */

const /** @type {AnalyzerOptions} */ options = {
    filterSpecifier(results, targetSpecifier, specifiersKey) {
      return results.filter(entry => entry[specifiersKey] === targetSpecifier);
    },
  };

/**
 *
 * @param {SortInputProject[]} analyzerResult
 * @param {SortBySpecifierConfig} customConfig
 * @returns {AnalyzerQueryResult}
 */
function sortBySpecifier(analyzerResult, customConfig) {
  const cfg = {
    filterSpecifier: '',
    specifiersKey: 'importSpecifiers', // override to make compatible with exportSpecifiers
    ...customConfig,
  };

  if (customConfig && customConfig.keepOriginalSourcePaths) {
    LogService.error(
      '[ post-processor "sort-by-specifier" ]: Please provide a QueryResult without "keepOriginalSourcePaths" configured',
    );
    process.exit(1);
  }

  /** @type {{ [key: string]: string[] }} */
  const resultsObj = {};
  analyzerResult.forEach(({ entries, project }) => {
    const projectName = project.name;
    entries.forEach(entry => {
      entry.result.forEach(resultForEntry => {
        const { normalizedSource, source } = resultForEntry;
        const specifiers = /** @type {string[]} */ (
          /** @type {Record<string, unknown>} */ (resultForEntry)[
            /** @type {string} */ (cfg.specifiersKey)
          ]
        );
        specifiers.forEach(s => {
          const uniqueKey = `${s}::${normalizedSource || source}`;
          const filePath = pathLib.resolve('/', projectName, entry.file).replace(/^\//, '');
          if (resultsObj[uniqueKey]) {
            resultsObj[uniqueKey] = [...resultsObj[uniqueKey], filePath];
          } else {
            resultsObj[uniqueKey] = [filePath];
          }
        });
      });
    });
  });

  /**
   * Now transform into this format:
   *  "specifier": "LitElement",
   *  "source": "lion-based-ui/core.js",
   *  "id": "LitElement::lion-based-ui/core.js",
   *  "dependents": [
   *    "my-app/src/content-template.js",
   *    "my-app/src/table/data-table.js",
   */
  /** @type {SpecifierResult[]} */
  let resultsBySpecifier = Object.entries(resultsObj).map(([id, dependents]) => {
    const [specifier, source] = id.split('::');
    return {
      specifier,
      source,
      id,
      dependents,
    };
  });

  if (cfg.filterSpecifier) {
    resultsBySpecifier = options.filterSpecifier(
      resultsBySpecifier,
      cfg.filterSpecifier,
      cfg.specifiersKey,
    );
  }

  return /** @type {AnalyzerQueryResult} */ (/** @type {unknown} */ (resultsBySpecifier));
}

export default {
  name: 'sort-by-specifier',
  execute: sortBySpecifier,
  compatibleAnalyzers: ['find-imports', 'find-exports'],
  // This means it transforms the result output of an analyzer, and multiple
  // post processors cannot be chained after this one
  modifiesOutputStructure: true,
};
