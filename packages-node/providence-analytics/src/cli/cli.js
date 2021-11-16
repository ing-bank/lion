// @ts-ignore-next-line
require('../program/types/index.js');

const child_process = require('child_process'); // eslint-disable-line camelcase
const pathLib = require('path');
const commander = require('commander');
const providenceModule = require('../program/providence.js');
const { LogService } = require('../program/services/LogService.js');
const { QueryService } = require('../program/services/QueryService.js');
const { InputDataService } = require('../program/services/InputDataService.js');
const promptModule = require('./prompt-analyzer-menu.js');
const cliHelpers = require('./cli-helpers.js');
const extendDocsModule = require('./launch-providence-with-extend-docs.js');
const { toPosixPath } = require('../program/utils/to-posix-path.js');

const { extensionsFromCs, setQueryMethod, targetDefault, installDeps, spawnProcess } = cliHelpers;

const { version } = require('../../package.json');

async function cli({ cwd, providenceConf } = {}) {
  let resolveCli;
  let rejectCli;

  const cliPromise = new Promise((resolve, reject) => {
    resolveCli = resolve;
    rejectCli = reject;
  });

  /** @type {'analyzer'|'queryString'} */
  let searchMode;
  /** @type {object} */
  let analyzerOptions;
  /** @type {object} */
  let featureOptions;
  /** @type {object} */
  let regexSearchOptions;

  // TODO: change back to "InputDataService.getExternalConfig();" once full package ESM
  const externalConfig = providenceConf;

  async function getQueryInputData(
    /* eslint-disable no-shadow */
    searchMode,
    regexSearchOptions,
    featureOptions,
    analyzerOptions,
    /* eslint-enable no-shadow */
  ) {
    let queryConfig = null;
    let queryMethod = null;

    if (searchMode === 'search-query') {
      queryConfig = QueryService.getQueryConfigFromRegexSearchString(
        regexSearchOptions.regexString,
      );
      queryMethod = 'grep';
    } else if (searchMode === 'feature-query') {
      queryConfig = QueryService.getQueryConfigFromFeatureString(featureOptions.queryString);
      queryMethod = 'grep';
    } else if (searchMode === 'analyzer-query') {
      let { name, config } = analyzerOptions;
      if (!name) {
        const answers = await promptModule.promptAnalyzerMenu();
        name = answers.analyzerName;
      }
      if (!config) {
        const answers = await promptModule.promptAnalyzerConfigMenu(
          name,
          analyzerOptions.promptOptionalConfig,
        );
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

    /**
     * May or may not include dependencies of search target
     * @type {string[]}
     */
    let totalSearchTargets;
    if (commander.targetDependencies !== undefined) {
      totalSearchTargets = await cliHelpers.appendProjectDependencyPaths(
        searchTargetPaths,
        commander.targetDependencies,
      );
    } else {
      totalSearchTargets = searchTargetPaths;
    }

    // TODO: filter out:
    // - dependencies listed in reference (?) Or at least, inside match-imports, make sure that
    //   we do not test against ourselves...
    // -

    providenceModule.providence(queryConfig, {
      gatherFilesConfig: {
        extensions: commander.extensions,
        allowlistMode: commander.allowlistMode,
        allowlist: commander.allowlist,
      },
      gatherFilesConfigReference: {
        extensions: commander.extensions,
        allowlistMode: commander.allowlistModeReference,
        allowlist: commander.allowlistReference,
      },
      debugEnabled: commander.debug,
      queryMethod,
      targetProjectPaths: totalSearchTargets,
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

  async function runDashboard() {
    const pathFromServerRootToDashboard = `${pathLib.relative(
      process.cwd(),
      pathLib.resolve(__dirname, '../../dashboard'),
    )}`;

    spawnProcess(`node ${pathFromServerRootToDashboard}/src/server.mjs`);
  }

  commander
    .version(version, '-v, --version')
    .option('-e, --extensions [extensions]', 'extensions like "js,html"', extensionsFromCs, [
      '.js',
      '.html',
    ])
    .option('-D, --debug', 'shows extensive logging')
    .option(
      '-t, --search-target-paths [targets]',
      `path(s) to project(s) on which analysis/querying should take place. Requires
    a list of comma seperated values relative to project root`,
      v => cliHelpers.pathsArrayFromCs(v, cwd),
      targetDefault(),
    )
    .option(
      '-r, --reference-paths [references]',
      `path(s) to project(s) which serve as a reference (applicable for certain analyzers like
    'match-imports'). Requires a list of comma seperated values relative to
    project root (like 'node_modules/lion-based-ui, node_modules/lion-based-ui-labs').`,
      v => cliHelpers.pathsArrayFromCs(v, cwd),
      InputDataService.referenceProjectPaths,
    )
    .option('-a, --allowlist [allowlist]', `allowlisted paths, like 'src/**/*, packages/**/*'`, v =>
      cliHelpers.csToArray(v, cwd),
    )
    .option(
      '--allowlist-reference [allowlist-reference]',
      `allowed paths for reference, like 'src/**/*, packages/**/*'`,
      v => cliHelpers.csToArray(v, cwd),
    )
    .option(
      '--search-target-collection [collection-name]',
      `path(s) to project(s) which serve as a reference (applicable for certain analyzers like
    'match-imports'). Should be a collection defined in providence.conf.js as paths relative to
    project root.`,
      v => cliHelpers.pathsArrayFromCollectionName(v, 'search-target', externalConfig),
    )
    .option(
      '--reference-collection [collection-name]',
      `path(s) to project(s) on which analysis/querying should take place. Should be a collection
    defined in providence.conf.js as paths relative to project root.`,
      v => cliHelpers.pathsArrayFromCollectionName(v, 'reference', externalConfig),
    )
    .option('--write-log-file', `Writes all logs to 'providence.log' file`)
    .option(
      '--target-dependencies [target-dependencies]',
      `For all search targets, will include all its dependencies
    (node_modules and bower_components). When --target-dependencies is applied
    without argument, it will act as boolean and include all dependencies.
    When a regex is supplied like --target-dependencies /^my-brand-/, it will filter
    all packages that comply with the regex`,
    )
    .option(
      '--allowlist-mode [allowlist-mode]',
      `Depending on whether we are dealing with a published artifact
      (a dependency installed via npm) or a git repository, different paths will be
      automatically put in the appropiate mode.
      A mode of 'npm' will look at the package.json "files" entry and a mode of
      'git' will look at '.gitignore' entry. The mode will be auto detected, but can be overridden
      via this option.`,
    )
    .option(
      '--allowlist-mode-reference [allowlist-mode-reference]',
      `allowlist mode applied to refernce project`,
    );

  commander
    .command('search <regex>')
    .alias('s')
    .description('perfoms regex search string like "my-.*-comp"')
    .action((regexString, options) => {
      searchMode = 'search-query';
      regexSearchOptions = options;
      regexSearchOptions.regexString = regexString;
      launchProvidence().then(resolveCli).catch(rejectCli);
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
      launchProvidence().then(resolveCli).catch(rejectCli);
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
    .option('-c, --config [config]', 'configuration object for analyzer', c => JSON.parse(c))
    .action((analyzerName, options) => {
      searchMode = 'analyzer-query';
      analyzerOptions = options;
      analyzerOptions.name = analyzerName;
      launchProvidence().then(resolveCli).catch(rejectCli);
    });

  commander
    .command('extend-docs')
    .alias('e')
    .description(
      `Generates data for "babel-extend-docs" plugin. These data are generated by the "match-paths"
    plugin, which automatically resolves import paths from reference projects
    (say [@lion/input, @lion/textarea, ...etc]) to a target project (say "wolf-ui").`,
    )
    .option(
      '--prefix-from [prefix-from]',
      `Prefix for components of reference layer. By default "lion"`,
      a => a,
      'lion',
    )
    .option(
      '--prefix-to [prefix-to]',
      `Prefix for components of reference layer. For instance "wolf"`,
    )
    .option(
      '--output-folder [output-folder]',
      `This is the file path where the result file "providence-extend-docs-data.json" will be written to`,
      p => toPosixPath(pathLib.resolve(process.cwd(), p.trim())),
      process.cwd(),
    )
    .action(options => {
      if (!options.prefixTo) {
        LogService.error(`Please provide a "prefix to" like '--prefix-to "myprefix"'`);
        process.exit(1);
      }
      if (!commander.referencePaths) {
        LogService.error(`Please provide referencePaths path like '-r "node_modules/@lion/*"'`);
        process.exit(1);
      }
      const prefixCfg = { from: options.prefixFrom, to: options.prefixTo };
      extendDocsModule
        .launchProvidenceWithExtendDocs({
          referenceProjectPaths: commander.referencePaths,
          prefixCfg,
          outputFolder: options.outputFolder,
          extensions: commander.extensions,
          allowlist: commander.allowlist,
          allowlistReference: commander.allowlistReference,
          cwd,
        })
        .then(resolveCli)
        .catch(rejectCli);
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

  commander
    .command('dashboard')
    .description(
      `Runs an interactive dashboard that shows all aggregated data from proivdence-output, configured
      via providence.conf`,
    )
    .action(() => {
      runDashboard();
    });

  commander.parse(process.argv);

  await cliPromise;
}

module.exports = { cli };
