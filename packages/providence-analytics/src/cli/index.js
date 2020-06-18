#!/usr/bin/env node

// @ts-ignore-next-line
require('../program/types/index.js');

const child_process = require('child_process'); // eslint-disable-line camelcase
const pathLib = require('path');
const commander = require('commander');
const { providence } = require('../program/providence.js');
const { LogService } = require('../program/services/LogService.js');
const { QueryService } = require('../program/services/QueryService.js');
const { InputDataService } = require('../program/services/InputDataService.js');
const { promptAnalyzerMenu, promptAnalyzerConfigMenu } = require('./prompt-analyzer-menu.js');
const {
  extensionsFromCs,
  setQueryMethod,
  targetDefault,
  appendProjectDependencyPaths,
  installDeps,
  pathsArrayFromCollectionName,
  pathsArrayFromCs,
} = require('./cli-helpers.js');

// @ts-ignore-next-line
const { version } = require('../../package.json');

/** @type {'analyzer'|'queryString'} */
let searchMode;
/** @type {object} */
let analyzerOptions;
/** @type {object} */
let featureOptions;
/** @type {object} */
let regexSearchOptions;

const externalConfig = InputDataService.getExternalConfig();

// eslint-disable-next-line no-shadow
async function getQueryInputData(searchMode, regexSearchOptions, featureOptions, analyzerOptions) {
  let queryConfig = null;
  let queryMethod = null;

  if (searchMode === 'search-query') {
    queryConfig = QueryService.getQueryConfigFromRegexSearchString(regexSearchOptions.regexString);
    queryMethod = 'grep';
  } else if (searchMode === 'feature-query') {
    queryConfig = QueryService.getQueryConfigFromFeatureString(featureOptions.queryString);
    queryMethod = 'grep';
  } else if (searchMode === 'analyzer-query') {
    let { name, config } = analyzerOptions;
    if (!name) {
      const answers = await promptAnalyzerMenu();
      name = answers.analyzerName;
    }
    if (!config) {
      const answers = await promptAnalyzerConfigMenu(name, analyzerOptions.promptOptionalConfig);
      config = answers.analyzerConfig;
    }
    // Will get metaConfig from ./providence.conf.js
    const metaConfig = externalConfig ? externalConfig.metaConfig : {};
    config = { ...config, metaConfig };
    queryConfig = QueryService.getQueryConfigFromAnalyzer(name, config);
    queryMethod = 'ast';
  } else {
    LogService.error('Please define a feature, analyzer or search');
    process.exit(1);
  }
  return { queryConfig, queryMethod };
}

async function launchProvidence() {
  const { queryConfig, queryMethod } = await getQueryInputData(
    searchMode,
    regexSearchOptions,
    featureOptions,
    analyzerOptions,
  );

  const searchTargetPaths = commander.searchTargetCollection || commander.searchTargetPaths;
  let referencePaths;
  if (queryConfig.analyzer.requiresReference) {
    referencePaths = commander.referenceCollection || commander.referencePaths;
  }

  // const extendedSearchTargets = searchTargetPaths;
  const extendedSearchTargets = await appendProjectDependencyPaths(searchTargetPaths);

  // TODO: filter out:
  // - dependencies listed in reference (?) Or at least, inside match-imports, make sure that
  //   we do not test against ourselves...
  // -

  providence(queryConfig, {
    gatherFilesConfig: {
      extensions: commander.extensions,
      ...(commander.filteredTarget ? { excludeFolders: commander.filteredTarget } : {}),
      includePaths: commander.whitelist,
    },
    gatherFilesConfigReference: {
      extensions: commander.extensions,
      ...(commander.filteredTarget ? { excludeFolders: commander.filteredTarget } : {}),
      includePaths: commander.whitelistReference,
    },
    debugEnabled: commander.debug,
    queryMethod,
    targetProjectPaths: extendedSearchTargets,
    referenceProjectPaths: referencePaths,
    targetProjectRootPaths: searchTargetPaths,
    writeLogFile: commander.writeLogFile,
  });
}

async function manageSearchTargets(options) {
  const basePath = pathLib.join(__dirname, '../..');
  if (options.update) {
    LogService.info('git submodule update --init --recursive');

    const updateResult = child_process.execSync('git submodule update --init --recursive', {
      cwd: basePath,
    });

    LogService.info(String(updateResult));
  }
  if (options.deps) {
    await installDeps(commander.searchTargetPaths);
  }
  if (options.createVersionHistory) {
    await installDeps(commander.searchTargetPaths);
  }
}

commander
  .version(version, '-v, --version')
  .option('-e, --extensions [extensions]', 'extensions like ".js, .html"', extensionsFromCs, [
    '.js',
    '.html',
  ])
  .option('-D, --debug', 'shows extensive logging')
  .option(
    '-t, --search-target-paths [targets]',
    `path(s) to project(s) on which analysis/querying should take place. Requires
    a list of comma seperated values relative to project root`,
    pathsArrayFromCs,
    targetDefault(),
  )
  .option(
    '-r, --reference-paths [references]',
    `path(s) to project(s) which serve as a reference (applicable for certain analyzers like
    'match-imports'). Requires a list of comma seperated values relative to
    project root (like 'node_modules/lion-based-ui, node_modules/lion-based-ui-labs').`,
    pathsArrayFromCs,
    InputDataService.referenceProjectPaths,
  )
  .option(
    '-w, --whitelist [whitelist]',
    `whitelisted paths, like './src, ./packages'`,
    pathsArrayFromCs,
  )
  .option(
    '--whitelist-reference [whitelist-reference]',
    `whitelisted paths fro reference, like './src, ./packages'`,
    pathsArrayFromCs,
  )
  .option(
    '--search-target-collection [collection-name]',
    `path(s) to project(s) which serve as a reference (applicable for certain analyzers like
    'match-imports'). Should be a collection defined in providence.conf.js as paths relative to
    project root.`,
    v => pathsArrayFromCollectionName(v, 'search-target', externalConfig),
  )
  .option(
    '--reference-collection [collection-name]',
    `path(s) to project(s) on which analysis/querying should take place. Should be a collection
    defined in providence.conf.js as paths relative to project root.`,
    v => pathsArrayFromCollectionName(v, 'reference', externalConfig),
  )
  .option('--write-log-file', `Writes all logs to 'providence.log' file`);

commander
  .command('search <regex>')
  .alias('s')
  .description('perfoms regex search string like "my-.*-comp"')
  .action((regexString, options) => {
    searchMode = 'search-query';
    regexSearchOptions = options;
    regexSearchOptions.regexString = regexString;
    launchProvidence();
  });

commander
  .command('feature <query-string>')
  .alias('f')
  .description('query like "tg-icon[size=xs]"')
  .option('-m, --method [method]', 'query method: "grep" or "ast"', setQueryMethod, 'grep')
  .action((queryString, options) => {
    searchMode = 'feature-query';
    featureOptions = options;
    featureOptions.queryString = queryString;
    launchProvidence();
  });

commander
  .command('analyze [analyzer-name]')
  .alias('a')
  .description(
    `predefined "query" for ast analysis. Can be a script found in program/analyzers,
    like "find-imports"`,
  )
  .option(
    '-o, --prompt-optional-config',
    `by default, only required configuration options are
    asked for. When this flag is provided, optional configuration options are shown as well`,
  )
  .option('-c, --config [config]', 'configration object for analyzer', c => JSON.parse(c))
  .action((analyzerName, options) => {
    searchMode = 'analyzer-query';
    analyzerOptions = options;
    analyzerOptions.name = analyzerName;
    launchProvidence();
  });

commander
  .command('manage-projects')
  .description(
    `Before running a query, be sure to have search-targets up to date (think of
    npm/bower dependencies, latest version etc.)`,
  )
  .option('-u, --update', 'gets latest of all search-targets and references')
  .option('-d, --deps', 'installs npm/bower dependencies of search-targets')
  .option('-h, --create-version-history', 'gets latest of all search-targets and references')
  .action(options => {
    manageSearchTargets(options);
  });

commander.parse(process.argv);
