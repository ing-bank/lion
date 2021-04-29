// @ts-ignore-next-line
require('../types/index.js');

const deepmerge = require('deepmerge');
const child_process = require('child_process'); // eslint-disable-line camelcase
const { AstService } = require('./AstService.js');
const { LogService } = require('./LogService.js');
const { getFilePathRelativeFromRoot } = require('../utils/get-file-path-relative-from-root.js');

const astProjectsDataCache = new Map();

class QueryService {
  /**
   * @param {string} regexString string for 'free' regex searches.
   * @returns {QueryConfig}
   */
  static getQueryConfigFromRegexSearchString(regexString) {
    return { type: 'search', regexString };
  }

  /**
   * @desc Util function that can be used to parse cli input and feed the result object to a new
   * instance of QueryResult
   * @example
   * const queryConfig = QueryService.getQueryConfigFromFeatureString(”tg-icon[size=xs]”)
   * const myQueryResult = QueryService.grepSearch(inputData, queryConfig)
   * @param {string} queryString - string like ”tg-icon[size=xs]”
   * @returns {QueryConfig}
   */
  static getQueryConfigFromFeatureString(queryString) {
    function parseContains(candidate) {
      const hasAsterisk = candidate ? candidate.endsWith('*') : null;
      const filtered = hasAsterisk ? candidate.slice(0, -1) : candidate;
      return [filtered, hasAsterisk];
    }

    // Detect the features in the query
    let tagCandidate;
    let featString;

    // Creates tag ('tg-icon') and featString ('font-icon+size=xs')
    const match = queryString.match(/(^.*)(\[(.+)\])+/);
    if (match) {
      // eslint-disable-next-line prefer-destructuring
      tagCandidate = match[1];
      // eslint-disable-next-line prefer-destructuring
      featString = match[3];
    } else {
      tagCandidate = queryString;
    }

    const [tag, usesTagPartialMatch] = parseContains(tagCandidate);

    let featureObj;
    if (featString) {
      const [nameCandidate, valueCandidate] = featString.split('=');
      const [name, usesValueContains] = parseContains(nameCandidate);
      const [value, usesValuePartialMatch] = parseContains(valueCandidate);
      featureObj = /** @type {Feature} */ {
        name,
        value,
        tag,
        isAttribute: true,
        usesValueContains,
        usesValuePartialMatch,
        usesTagPartialMatch,
      };
    } else {
      // Just look for tag name
      featureObj = { tag, usesTagPartialMatch };
    }

    return { type: 'feature', feature: featureObj };
  }

  /**
   * @desc retrieves the default export found in ./program/analyzers/findImport.js
   * @param {string|Analyzer} analyzer
   * @returns {QueryConfig}
   */
  static getQueryConfigFromAnalyzer(analyzerObjectOrString, analyzerConfig) {
    let analyzer;
    if (typeof analyzerObjectOrString === 'string') {
      // Get it from our location(s) of predefined analyzers.
      // Mainly needed when this method is called via cli
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        analyzer = require(`../analyzers/${analyzerObjectOrString}`);
      } catch (e) {
        LogService.error(e);
        process.exit(1);
      }
    } else {
      // We don't need to import the analyzer, since we already have it
      analyzer = analyzerObjectOrString;
    }
    return {
      type: 'analyzer',
      analyzerName: analyzer.name,
      analyzerConfig,
      analyzer,
    };
  }

  /**
   * @desc Search via unix grep
   * @param {InputData} inputData
   * @param {QueryConfig} queryConfig
   * @param {object} [customConfig]
   * @param {boolean} [customConfig.hasVerboseReporting]
   * @param {object} [customConfig.gatherFilesConfig]
   * @returns {Promise<QueryResult>}
   */
  static async grepSearch(inputData, queryConfig, customConfig) {
    const cfg = deepmerge(
      {
        hasVerboseReporting: false,
        gatherFilesConfig: {},
      },
      customConfig,
    );

    const results = [];
    // 1. Analyze the type of query from the QueryConfig (for instance 'feature' or 'search').
    let regex;
    if (queryConfig.type === 'feature') {
      regex = this._getFeatureRegex(queryConfig.feature);
    } else if (queryConfig.type === 'search') {
      regex = queryConfig.regexString;
    }

    await Promise.all(
      inputData.map(async projectData => {
        // 2. For all files found in project, we will do a different grep
        const projectResult = {};
        const countStdOut = await this._performGrep(projectData.project.path, regex, {
          count: true,
          gatherFilesConfig: cfg.gatherFilesConfig,
        });
        projectResult.count = Number(countStdOut);

        if (cfg.hasVerboseReporting) {
          const detailStdout = await this._performGrep(projectData.project.path, regex, {
            count: false,
            gatherFilesConfig: cfg.gatherFilesConfig,
          });
          projectResult.files = detailStdout
            .split('\n')
            .filter(l => l)
            .map(l => {
              const [absolutePath, line] = l.split(':');
              const file = getFilePathRelativeFromRoot(absolutePath, projectData.path);
              const link = l.split(':').slice(0, 2).join(':');
              const match = l.split(':').slice(2);
              return { file, line: Number(line), match, link };
            });
        }
        results.push({ project: projectData.project, ...projectResult });
      }),
    );

    return /** @type {QueryResult} */ {
      meta: {
        searchType: 'grep',
        query: queryConfig,
      },
      queryOutput: results,
    };
  }

  /**
   * @desc Search via ast (typescript compilation)
   * @param {QueryConfig} queryConfig
   * @param {AnalyzerConfig} [customConfig]
   * @param {GatherFilesConfig} [customConfig.gatherFilesConfig]
   * @returns {QueryResult}
   */
  static async astSearch(queryConfig, customConfig) {
    LogService.debug('started astSearch method');
    if (queryConfig.type !== 'analyzer') {
      LogService.error('Only analyzers supported for ast searches at the moment');
      process.exit(1);
    }

    // eslint-disable-next-line new-cap
    const analyzer = new queryConfig.analyzer();
    const analyzerResult = await analyzer.execute(customConfig);
    if (!analyzerResult) {
      return analyzerResult;
    }
    const { queryOutput, analyzerMeta } = analyzerResult;
    const /** @type {QueryResult} */ queryResult = {
        meta: {
          searchType: 'ast-analyzer',
          analyzerMeta,
        },
        queryOutput,
      };
    return queryResult;
  }

  /**
   * @param {ProjectData[]} projectsData
   * @param {'babel'|'typescript'|'es-module-lexer'} requiredAst
   */
  static async addAstToProjectsData(projectsData, requiredAst) {
    return projectsData.map(projectData => {
      const cachedData = astProjectsDataCache.get(projectData.project.path);
      if (cachedData) {
        return cachedData;
      }
      const resultEntries = projectData.entries.map(entry => {
        const ast = AstService.getAst(entry.context.code, requiredAst, { filePath: entry.file });
        return { ...entry, ast };
      });
      const astData = { ...projectData, entries: resultEntries };
      this._addToProjectsDataCache(projectData.project.path, astData);
      return astData;
    });
  }

  /**
   * We need to make sure we don't run into memory issues (ASTs are huge),
   * so we only store one project in cache now. This will be a performance benefit for
   * lion-based-ui-cli, that runs providence consecutively for the same project
   * TODO: instead of storing one result in cache, use sizeof and a memory ;imit
   * to allow for more projects
   * @param {string} path
   * @param {InputData} astData
   */
  static _addToProjectsDataCache(path, astData) {
    if (this.cacheDisabled) {
      return;
    }
    // In order to prevent running out of memory, there is a limit to the number of
    // project ASTs in cache. For a session running multiple analyzers for reference
    // and target projects, we need this number to be at least 2.
    if (astProjectsDataCache.size >= 2) {
      astProjectsDataCache.delete(astProjectsDataCache.keys()[0]);
    }
    astProjectsDataCache.set(path, astData);
  }

  /**
   * @desc Performs a grep on given path for a certain tag name and feature
   * @param {string} searchPath - the project path to search in
   * @param {Feature} feature
   * @param {object} [customConfig]
   * @param {boolean} [customConfig.count] - enable wordcount in grep
   * @param {GatherFilesConfig} [customConfig.gatherFilesConfig] - extensions, excludes
   * @param {boolean} [customConfig.hasDebugEnabled]
   */
  static _getFeatureRegex(feature) {
    const { name, value, tag } = feature;
    let potentialTag;
    if (tag) {
      potentialTag = feature.usesTagPartialMatch ? `.*${tag}.+` : tag;
    } else {
      potentialTag = '.*';
    }

    let regex;
    if (name) {
      if (value) {
        // We are looking for an exact match: div[class=foo] -> <div class="foo">
        let valueRe = value;
        if (feature.usesValueContains) {
          if (feature.usesValuePartialMatch) {
            // We are looking for a partial match: div[class*=foo*] -> <div class="baz foo-bar">
            valueRe = `.+${value}.+`;
          } else {
            // We are looking for an exact match inside a space separated list within an
            // attr: div[class*=foo] -> <div class="baz foo bar">
            valueRe = `((${value})|("${value} .*)|(.* ${value}")|(.* ${value} .*))`;
          }
        }
        regex = `<${potentialTag} .*${name}="${valueRe}".+>`;
      } else {
        regex = `<${potentialTag} .*${name}(>|( |=).+>)`;
      }
    } else if (tag) {
      regex = `<${potentialTag} .+>`;
    } else {
      LogService.error('Please provide a proper Feature');
    }

    return regex;
  }

  static _performGrep(searchPath, regex, customConfig) {
    const cfg = deepmerge(
      {
        count: false,
        gatherFilesConfig: {},
        hasDebugEnabled: false,
      },
      customConfig,
    );

    const /** @type {string[]} */ ext = cfg.gatherFilesConfig.extensions;
    const include = ext ? `--include="\\.(${ext.map(e => e.slice(1)).join('|')})" ` : '';
    const count = cfg.count ? ' | wc -l' : '';

    // TODO: test on Linux (only tested on Mac)
    const cmd = `pcregrep -ornM ${include} '${regex}' ${searchPath} ${count}`;

    if (cfg.hasDebugEnabled) {
      LogService.debug(cmd, 'grep command');
    }

    return new Promise(resolve => {
      child_process.exec(cmd, { maxBuffer: 200000000 }, (err, stdout) => {
        resolve(stdout);
      });
    });
  }
}
QueryService.cacheDisabled = false;

module.exports = { QueryService };
