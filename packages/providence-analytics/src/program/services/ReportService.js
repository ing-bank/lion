// @ts-ignore-next-line
require('../types/index.js');

const fs = require('fs');
const pathLib = require('path');
const getHash = require('../utils/get-hash.js');

/**
 * @desc Should be used to write results to and read results from the file system.
 * Creates a unique identifier based on searchP, refP (optional) and an already created
 * @param {object} searchP search target project meta
 * @param {object} cfg configuration used for analyzer
 * @param {object} [refP] reference project meta
 * @returns {string} identifier
 */
function createResultIdentifier(searchP, cfg, refP) {
  // why encodeURIComponent: filters out slashes for path names for stuff like @lion/button
  const format = p =>
    `${encodeURIComponent(p.name)}_${p.version || (p.commitHash && p.commitHash.slice(0, 5))}`;
  const cfgHash = getHash(cfg);
  return `${format(searchP)}${refP ? `_+_${format(refP)}` : ''}__${cfgHash}`;
}

class ReportService {
  /**
   * @desc
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
   * @desc
   * Prints queryResult report as JSON to outputPath
   * @param {QueryResult} queryResult
   * @param {string} [identifier]
   * @param {string} [outputPath]
   */
  static writeToJson(
    queryResult,
    identifier = new Date().getTime() / 1000,
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

  static set outputPath(p) {
    this.__outputPath = p;
  }

  static get outputPath() {
    return this.__outputPath || pathLib.join(process.cwd(), '/providence-output');
  }

  static createIdentifier({ targetProject, referenceProject, analyzerConfig }) {
    return createResultIdentifier(targetProject, analyzerConfig, referenceProject);
  }

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

  static _getResultFileNameAndPath(name, identifier) {
    return pathLib.join(this.outputPath, `${name || 'query'}_-_${identifier}.json`);
  }

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

module.exports = { ReportService };
