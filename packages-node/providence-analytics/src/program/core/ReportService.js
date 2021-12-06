const fs = require('fs');
const pathLib = require('path');
const getHash = require('../utils/get-hash.js');
// const { memoize } = require('../utils/memoize.js');
const memoize = fn => fn;

/**
 * @typedef {import('../types/core').Project} Project
 * @typedef {import('../types/core').ProjectName} ProjectName
 * @typedef {import('../types/core').AnalyzerQueryResult} AnalyzerQueryResult
 * @typedef {import('../types/core').AnalyzerConfig} AnalyzerConfig
 * @typedef {import('../types/core').AnalyzerName} AnalyzerName
 * @typedef {import('../types/core').QueryResult} QueryResult
 * @typedef {import('../types/core').PathFromSystemRoot} PathFromSystemRoot
 */

/**
 * Should be used to write results to and read results from the file system.
 * Creates a unique identifier based on searchP, refP (optional) and an already created
 * @param {Project} searchP search target project meta
 * @param {AnalyzerConfig} cfg configuration used for analyzer
 * @param {Project} [refP] reference project meta
 * @returns {string} identifier
 */
function createResultIdentifier(searchP, cfg, refP) {
  // why encodeURIComponent: filters out slashes for path names for stuff like @lion/button
  const format = (/** @type {Project} */ p) =>
    `${encodeURIComponent(p.name)}_${p.version || (p.commitHash && p.commitHash.slice(0, 5))}`;
  const cfgHash = getHash(cfg);
  return `${format(searchP)}${refP ? `_+_${format(refP)}` : ''}__${cfgHash}`;
}

class ReportService {
  /**
   * Prints queryResult report to console
   * @param {QueryResult} queryResult
   */
  static printToConsole(queryResult) {
    /* eslint-disable no-console */
    console.log('== QUERY: =========');
    console.log(JSON.stringify(queryResult.meta, null, 2));
    console.log('\n== RESULT: =========');
    console.log(JSON.stringify(queryResult.queryOutput, null, 2));
    console.log('\n----------------------------------------\n');
    /* eslint-enable no-console */
  }

  /**
   * Prints queryResult report as JSON to outputPath
   * @param {AnalyzerQueryResult} queryResult
   * @param {string} [identifier]
   * @param {string} [outputPath]
   */
  static writeToJson(
    queryResult,
    identifier = (new Date().getTime() / 1000).toString(),
    outputPath = this.outputPath,
  ) {
    const output = JSON.stringify(queryResult, null, 2);
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }
    const { name } = queryResult.meta.analyzerMeta;
    const filePath = this._getResultFileNameAndPath(name, identifier);

    fs.writeFileSync(filePath, output, { flag: 'w' });
  }

  /**
   * @type {string}
   */
  static get outputPath() {
    return this.__outputPath || pathLib.join(process.cwd(), '/providence-output');
  }

  static set outputPath(p) {
    this.__outputPath = p;
  }

  /**
   * @param {{ targetProject: Project; referenceProject: Project; analyzerConfig: AnalyzerConfig }} options
   * @returns {string}
   */
  static createIdentifier({ targetProject, referenceProject, analyzerConfig }) {
    return createResultIdentifier(targetProject, analyzerConfig, referenceProject);
  }

  /**
   * @param {{analyzerName: AnalyzerName; identifier: string}} options
   * @returns {QueryResult}
   */
  static getCachedResult({ analyzerName, identifier }) {
    let cachedResult;
    try {
      cachedResult = JSON.parse(
        fs.readFileSync(this._getResultFileNameAndPath(analyzerName, identifier), 'utf-8'),
      );
      // eslint-disable-next-line no-empty
    } catch (_) {}
    return cachedResult;
  }

  /**
   * @param {string} name
   * @param {string} identifier
   * @returns {PathFromSystemRoot}
   */
  static _getResultFileNameAndPath(name, identifier) {
    return /** @type {PathFromSystemRoot} */ (
      pathLib.join(this.outputPath, `${name || 'query'}_-_${identifier}.json`)
    );
  }

  /**
   * @param {ProjectName} depProj
   * @param {Project} rootProjectMeta
   */
  static writeEntryToSearchTargetDepsFile(depProj, rootProjectMeta) {
    const rootProj = `${rootProjectMeta.name}#${rootProjectMeta.version}`;
    const filePath = pathLib.join(this.outputPath, 'search-target-deps-file.json');
    let file = {};
    try {
      file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      // eslint-disable-next-line no-empty
    } catch (_) {}
    const deps = [...(file[rootProj] || []), depProj];
    file[rootProj] = [...new Set(deps)];
    fs.writeFileSync(filePath, JSON.stringify(file, null, 2), { flag: 'w' });
  }
}
ReportService.createIdentifier = memoize(ReportService.createIdentifier);
ReportService.getCachedResult = memoize(ReportService.getCachedResult);

module.exports = { ReportService };
