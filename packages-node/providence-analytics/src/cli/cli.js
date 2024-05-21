import path from 'path';

import commander from 'commander';

import { InputDataService } from '../program/core/InputDataService.js';
import { getCurrentDir } from '../program/utils/get-current-dir.js';
import { QueryService } from '../program/core/QueryService.js';
import { _providenceModule } from '../program/providence.js';
import { fsAdapter } from '../program/utils/fs-adapter.js';
import { _cliHelpersModule } from './cli-helpers.js';

/**
 * @typedef {import('../../types/index.js').ProvidenceCliConf} ProvidenceCliConf
 * @typedef {import('../../types/index.js').AnalyzerName} AnalyzerName
 */

const { version } = JSON.parse(
  fsAdapter.fs.readFileSync(
    path.resolve(getCurrentDir(import.meta.url), '../../package.json'),
    'utf8',
  ),
);
const { extensionsFromCs, targetDefault } = _cliHelpersModule;

/**
 * @param {{cwd?:string; argv?: string[]; providenceConf?: Partial<ProvidenceCliConf>}} cfg
 */
export async function cli({ cwd = process.cwd(), providenceConf, argv = process.argv }) {
  /** @type {(value: any) => void} */
  let resolveCli;
  /** @type {(reason?: any) => void} */
  let rejectCli;

  const cliPromise = new Promise((resolve, reject) => {
    resolveCli = resolve;
    rejectCli = reject;
  });

  /** @type {object} */
  let analyzerOptions;

  // TODO: change back to "InputDataService.getExternalConfig();" once full package ESM
  const externalConfig = providenceConf;

  /**
   * @param {{analyzerOptions:{name:AnalyzerName; config:object;promptOptionalConfig:object}}} opts
   */
  async function getQueryConfigAndMeta(opts) {
    let queryConfig = null;
    let queryMethod = null;

    // eslint-disable-next-line prefer-const
    let { name, config } = opts.analyzerOptions;
    if (!name) {
      throw new Error('Please provide an analyzer name');
    }
    // Will get metaConfig from ./providence.conf.js
    const metaConfig = externalConfig ? externalConfig.metaConfig : {};
    config = { ...config, metaConfig };
    queryConfig = await QueryService.getQueryConfigFromAnalyzer(name, config);
    queryMethod = 'ast';
    return { queryConfig, queryMethod };
  }

  async function launchProvidence() {
    const { queryConfig, queryMethod } = await getQueryConfigAndMeta({ analyzerOptions });

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
      totalSearchTargets = await _cliHelpersModule.appendProjectDependencyPaths(
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

    _providenceModule.providence(queryConfig, {
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
      skipCheckMatchCompatibility: commander.skipCheckMatchCompatibility,
      measurePerformance: commander.measurePerf,
      addSystemPathsInResult: commander.addSystemPaths,
      fallbackToBabel: commander.fallbackToBabel,
    });
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
      v => _cliHelpersModule.pathsArrayFromCs(v, cwd),
      targetDefault(cwd),
    )
    .option(
      '-r, --reference-paths [references]',
      `path(s) to project(s) which serve as a reference (applicable for certain analyzers like
    'match-imports'). Requires a list of comma seperated values relative to
    project root (like 'node_modules/lion-based-ui, node_modules/lion-based-ui-labs').`,
      v => _cliHelpersModule.pathsArrayFromCs(v, cwd),
      InputDataService.referenceProjectPaths,
    )
    .option('-a, --allowlist [allowlist]', `allowlisted paths, like 'src/**/*, packages/**/*'`, v =>
      _cliHelpersModule.csToArray(v),
    )
    .option(
      '--allowlist-reference [allowlist-reference]',
      `allowed paths for reference, like 'src/**/*, packages/**/*'`,
      v => _cliHelpersModule.csToArray(v),
    )
    .option(
      '--search-target-collection [collection-name]',
      `path(s) to project(s) which serve as a reference (applicable for certain analyzers like
    'match-imports'). Should be a collection defined in providence.conf.js as paths relative to
    project root.`,
      v => _cliHelpersModule.pathsArrayFromCollectionName(v, 'search-target', externalConfig),
    )
    .option(
      '--reference-collection [collection-name]',
      `path(s) to project(s) on which analysis/querying should take place. Should be a collection
    defined in providence.conf.js as paths relative to project root.`,
      v => _cliHelpersModule.pathsArrayFromCollectionName(v, 'reference', externalConfig),
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
      'git' will look at '.gitignore' entry. A mode of 'export-map' will look for all paths
      exposed via an export map.
      The mode will be auto detected, but can be overridden
      via this option.`,
    )
    .option(
      '--allowlist-mode-reference [allowlist-mode-reference]',
      `allowlist mode applied to refernce project`,
    )
    .option(
      '--skip-check-match-compatibility',
      `skips semver checks, handy for forward compatible libs or libs below v1`,
    )
    .option('--measure-perf', 'Logs the completion time in seconds')
    .option('--add-system-paths', 'Adds system paths to results')
    .option(
      '--fallback-to-babel',
      'Uses babel instead of swc. This will be slower, but guaranteed to be 100% compatible with @babel/generate and @babel/traverse',
    );

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
      analyzerOptions = options;
      analyzerOptions.name = analyzerName;
      launchProvidence().then(resolveCli).catch(rejectCli);
    });

  commander.parse(argv);

  await cliPromise;
}
