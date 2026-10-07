import path from 'path';
import { parseArgs } from 'util';

import { InputDataService } from '../program/core/InputDataService.js';
import { getCurrentDir } from '../program/utils/get-current-dir.js';
import { QueryService } from '../program/core/QueryService.js';
import { _providenceModule } from '../program/providence.js';
import { fsAdapter } from '../program/utils/fs-adapter.js';
import { _cliHelpersModule } from './cli-helpers.js';

/**
 * @typedef {import('../../types/index.js').ProvidenceCliConf} ProvidenceCliConf
 * @typedef {import('../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../types/index.js').AnalyzerConfig} AnalyzerConfig
 * @typedef {import('../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../types/index.js').GatherFilesConfig} GatherFilesConfig
 * @typedef {{ name: AnalyzerName; config: AnalyzerConfig; promptOptionalConfig: boolean }} AnalyzerOptions
 * @typedef {{ cwd: string; externalConfig: Partial<ProvidenceCliConf> | undefined }} CliContext
 */

/**
 * A single command line flag.
 *
 * A `type: 'string'` flag takes an *optional* value, the way commander's
 * `--flag [value]` did: passing it without an argument sets it to `true`
 * instead of a string. A provided value goes through `coerce`, and when the
 * flag is absent `defaultValue` is used. Flag names are identical to the ones
 * commander declared, so the camelCased properties the rest of this file reads
 * are unchanged.
 *
 * @typedef {object} CliOptionSpec
 * @property {string} name long flag, without leading dashes
 * @property {string} [short] one character alias, without leading dash
 * @property {'boolean' | 'string'} type
 * @property {string} description
 * @property {string} [valueName] rendered as `[valueName]` in the help text
 * @property {(value: string, ctx: CliContext) => unknown} [coerce] applied to a provided value
 * @property {(ctx: CliContext) => unknown} [defaultValue] used when the flag is absent
 */

/**
 * The values the rest of this file consumes, after coercion and defaults.
 *
 * As with commander's own (untyped) option bag, a `string` flag passed without
 * a value is `true` at runtime; the declared types describe the value a caller
 * that passes an argument produces, which is what the consumers of this object
 * rely on.
 *
 * @typedef {object} ResolvedCliOptions
 * @property {GatherFilesConfig['extensions']} extensions
 * @property {boolean} debug
 * @property {PathFromSystemRoot[]} searchTargetPaths
 * @property {PathFromSystemRoot[]} referencePaths
 * @property {string[]} allowlist
 * @property {string[]} allowlistReference
 * @property {PathFromSystemRoot[]} searchTargetCollection
 * @property {PathFromSystemRoot[]} referenceCollection
 * @property {boolean} writeLogFile
 * @property {string} targetDependencies
 * @property {GatherFilesConfig['allowlistMode']} allowlistMode
 * @property {GatherFilesConfig['allowlistMode']} allowlistModeReference
 * @property {boolean} skipCheckMatchCompatibility
 * @property {boolean} measurePerf
 * @property {boolean} addSystemPaths
 * @property {boolean} fallbackToBabel
 * @property {AnalyzerConfig} config
 * @property {boolean} promptOptionalConfig
 */

const { version } = JSON.parse(
  fsAdapter.fs.readFileSync(
    path.resolve(getCurrentDir(import.meta.url), '../../package.json'),
    'utf8',
  ),
);
const { extensionsFromCs, targetDefault } = _cliHelpersModule;

/** @type {CliOptionSpec[]} */
const GLOBAL_OPTIONS = [
  {
    name: 'extensions',
    short: 'e',
    type: 'string',
    valueName: 'extensions',
    description: 'extensions like "js,html"',
    coerce: v => extensionsFromCs(v),
    defaultValue: () => ['.js', '.html'],
  },
  { name: 'debug', short: 'D', type: 'boolean', description: 'shows extensive logging' },
  {
    name: 'search-target-paths',
    short: 't',
    type: 'string',
    valueName: 'targets',
    description: `path(s) to project(s) on which analysis/querying should take place. Requires
    a list of comma seperated values relative to project root`,
    coerce: (v, ctx) => _cliHelpersModule.pathsArrayFromCs(v, ctx.cwd),
    defaultValue: ctx => targetDefault(ctx.cwd),
  },
  {
    name: 'reference-paths',
    short: 'r',
    type: 'string',
    valueName: 'references',
    description: `path(s) to project(s) which serve as a reference (applicable for certain analyzers like
    'match-imports'). Requires a list of comma seperated values relative to
    project root (like 'node_modules/lion-based-ui, node_modules/lion-based-ui-labs').`,
    coerce: (v, ctx) => _cliHelpersModule.pathsArrayFromCs(v, ctx.cwd),
    defaultValue: () => InputDataService.referenceProjectPaths,
  },
  {
    name: 'allowlist',
    short: 'a',
    type: 'string',
    valueName: 'allowlist',
    description: `allowlisted paths, like 'src/**/*, packages/**/*'`,
    coerce: v => _cliHelpersModule.csToArray(v),
  },
  {
    name: 'allowlist-reference',
    type: 'string',
    valueName: 'allowlist-reference',
    description: `allowed paths for reference, like 'src/**/*, packages/**/*'`,
    coerce: v => _cliHelpersModule.csToArray(v),
  },
  {
    name: 'search-target-collection',
    type: 'string',
    valueName: 'collection-name',
    description: `path(s) to project(s) which serve as a reference (applicable for certain analyzers like
    'match-imports'). Should be a collection defined in providence.conf.js as paths relative to
    project root.`,
    coerce: (v, ctx) =>
      _cliHelpersModule.pathsArrayFromCollectionName(v, 'search-target', ctx.externalConfig),
  },
  {
    name: 'reference-collection',
    type: 'string',
    valueName: 'collection-name',
    description: `path(s) to project(s) on which analysis/querying should take place. Should be a collection
    defined in providence.conf.js as paths relative to project root.`,
    coerce: (v, ctx) =>
      _cliHelpersModule.pathsArrayFromCollectionName(v, 'reference', ctx.externalConfig),
  },
  {
    name: 'write-log-file',
    type: 'boolean',
    description: `Writes all logs to 'providence.log' file`,
  },
  {
    name: 'target-dependencies',
    type: 'string',
    valueName: 'target-dependencies',
    description: `For all search targets, will include all its dependencies
    (node_modules and bower_components). When --target-dependencies is applied
    without argument, it will act as boolean and include all dependencies.
    When a regex is supplied like --target-dependencies /^my-brand-/, it will filter
    all packages that comply with the regex`,
  },
  {
    name: 'allowlist-mode',
    type: 'string',
    valueName: 'allowlist-mode',
    description: `Depending on whether we are dealing with a published artifact
      (a dependency installed via npm) or a git repository, different paths will be
      automatically put in the appropiate mode.
      A mode of 'npm' will look at the package.json "files" entry and a mode of
      'git' will look at '.gitignore' entry. A mode of 'export-map' will look for all paths
      exposed via an export map.
      The mode will be auto detected, but can be overridden
      via this option.`,
  },
  {
    name: 'allowlist-mode-reference',
    type: 'string',
    valueName: 'allowlist-mode-reference',
    description: `allowlist mode applied to refernce project`,
  },
  {
    name: 'skip-check-match-compatibility',
    type: 'boolean',
    description: `skips semver checks, handy for forward compatible libs or libs below v1`,
  },
  { name: 'measure-perf', type: 'boolean', description: 'Logs the completion time in seconds' },
  { name: 'add-system-paths', type: 'boolean', description: 'Adds system paths to results' },
  {
    name: 'fallback-to-babel',
    type: 'boolean',
    description:
      'Uses babel instead of swc. This will be slower, but guaranteed to be 100% compatible with @babel/generate and @babel/traverse',
  },
];

/** @type {CliOptionSpec[]} */
const ANALYZE_OPTIONS = [
  {
    name: 'prompt-optional-config',
    short: 'o',
    type: 'boolean',
    description: `by default, only required configuration options are
    asked for. When this flag is provided, optional configuration options are shown as well`,
  },
  {
    name: 'config',
    short: 'c',
    type: 'string',
    valueName: 'config',
    description: 'configuration object for analyzer',
    coerce: c => JSON.parse(c),
  },
];

/**
 * Not part of the option table: they short circuit before anything else runs.
 * @type {CliOptionSpec[]}
 */
const META_OPTIONS = [
  {
    name: 'version',
    short: 'v',
    type: 'boolean',
    description: 'output the version number',
  },
  {
    name: 'help',
    short: 'h',
    type: 'boolean',
    description: 'display help for command',
  },
];

const ALL_OPTIONS = [...GLOBAL_OPTIONS, ...ANALYZE_OPTIONS, ...META_OPTIONS];

/** The command that carries the analyzer name; `a` is its alias. */
const ANALYZE_COMMAND = 'analyze';
const ANALYZE_COMMAND_ALIAS = 'a';

/**
 * commander exposed `--flag-name` also as `flagName`; the rest of this file
 * reads the camelCased form.
 * @param {string} flagName
 */
function toCamelCase(flagName) {
  return flagName.replace(/-([a-z])/g, (_match, char) => char.toUpperCase());
}

/**
 * @param {CliOptionSpec} spec
 * @returns {{ type: 'boolean' | 'string'; short?: string }}
 */
function toParseArgsOption(spec) {
  return spec.short ? { type: spec.type, short: spec.short } : { type: spec.type };
}

/**
 * Turns the command line into the shape `parseArgs` understands.
 *
 * A `string` flag takes an optional value: when it is the last token, or is
 * followed by another flag, it has to be consumed without one. Those tokens are
 * pulled out of the argv here (and reported through `flagsWithoutValue`), so
 * that `parseArgs` -- which has no notion of an optional value -- only ever
 * sees a flag that is followed by its value.
 *
 * @param {string[]} args without the node executable and the script path
 * @returns {{ rest: string[]; flagsWithoutValue: Set<string> }}
 */
function splitOptionalValueFlags(args) {
  /** @type {Map<string, string>} every accepted spelling -> long flag name */
  const optionalValueFlags = new Map();
  for (const spec of ALL_OPTIONS) {
    if (spec.type !== 'string') continue; // eslint-disable-line no-continue
    optionalValueFlags.set(`--${spec.name}`, spec.name);
    if (spec.short) optionalValueFlags.set(`-${spec.short}`, spec.name);
  }

  /** @type {Set<string>} */
  const flagsWithoutValue = new Set();
  /** @type {string[]} */
  const rest = [];

  for (let i = 0; i < args.length; i += 1) {
    const flagName = optionalValueFlags.get(args[i]);
    const next = args[i + 1];
    if (flagName && (next === undefined || next.startsWith('-'))) {
      flagsWithoutValue.add(flagName);
      continue; // eslint-disable-line no-continue
    }
    rest.push(args[i]);
  }

  return { rest, flagsWithoutValue };
}

/**
 * Applies coercions and defaults and camelCases the names, so the rest of this
 * file reads exactly what it read from commander's program object.
 *
 * @param {Record<string, unknown>} parsedValues
 * @param {Set<string>} flagsWithoutValue
 * @param {CliContext} ctx
 * @returns {ResolvedCliOptions}
 */
function resolveOptionValues(parsedValues, flagsWithoutValue, ctx) {
  /** @type {Record<string, unknown>} */
  const resolved = {};
  for (const spec of ALL_OPTIONS) {
    if (flagsWithoutValue.has(spec.name)) {
      resolved[toCamelCase(spec.name)] = true;
      continue; // eslint-disable-line no-continue
    }
    if (Object.prototype.hasOwnProperty.call(parsedValues, spec.name)) {
      const rawValue = parsedValues[spec.name];
      resolved[toCamelCase(spec.name)] = spec.coerce
        ? spec.coerce(/** @type {string} */ (rawValue), ctx)
        : rawValue;
      continue; // eslint-disable-line no-continue
    }
    if (spec.defaultValue) {
      resolved[toCamelCase(spec.name)] = spec.defaultValue(ctx);
    }
  }
  return /** @type {ResolvedCliOptions} */ (resolved);
}

/**
 * @param {CliOptionSpec[]} specs
 * @returns {string}
 */
function optionLines(specs) {
  return specs
    .map(spec => {
      const short = spec.short ? `-${spec.short}, ` : '    ';
      const value = spec.valueName ? ` [${spec.valueName}]` : '';
      return `  ${short}--${spec.name}${value}\n      ${spec.description}`;
    })
    .join('\n');
}

function helpText() {
  return `Usage: providence [options] [command]

Options:
${optionLines([...GLOBAL_OPTIONS, ...META_OPTIONS])}

Commands:
  ${ANALYZE_COMMAND} [analyzer-name] (alias: ${ANALYZE_COMMAND_ALIAS})
      predefined "query" for ast analysis. Can be a script found in program/analyzers,
    like "find-imports"

${ANALYZE_COMMAND} options:
${optionLines(ANALYZE_OPTIONS)}
`;
}

/**
 * @param {{cwd?:string; argv?: string[]; providenceConf?: Partial<ProvidenceCliConf>}} cfg
 */
export async function cli({ cwd = process.cwd(), providenceConf, argv = process.argv }) {
  /** @type {(value: any) => void} */
  let resolveCli = () => {};
  /** @type {(reason?: any) => void} */
  let rejectCli = () => {};

  const cliPromise = new Promise((resolve, reject) => {
    resolveCli = resolve;
    rejectCli = reject;
  });

  /** @type {AnalyzerOptions} */
  let analyzerOptions;
  /** @type {ResolvedCliOptions} */
  let cliOptions;

  // TODO: change back to "InputDataService.getExternalConfig();" once full package ESM
  const externalConfig = providenceConf;
  const ctx = { cwd, externalConfig };

  /**
   * @param {{analyzerOptions:{name:AnalyzerName; config:AnalyzerConfig;promptOptionalConfig:boolean}}} opts
   */
  async function getQueryConfigAndMeta(opts) {
    let queryConfig = null;
    /** @type {'ast' | 'grep'} */
    let queryMethod = 'ast';

    // eslint-disable-next-line prefer-const
    let { name, config } = opts.analyzerOptions;
    if (!name) {
      throw new Error('Please provide an analyzer name');
    }
    // Will get metaConfig from ./providence.conf.js
    const metaConfig = externalConfig ? externalConfig.metaConfig : {};
    config = /** @type {AnalyzerConfig} */ ({ ...config, metaConfig });
    queryConfig = await QueryService.getQueryConfigFromAnalyzer(name, config);
    queryMethod = 'ast';
    return { queryConfig, queryMethod };
  }

  async function launchProvidence() {
    const { queryConfig, queryMethod } = await getQueryConfigAndMeta({ analyzerOptions });

    const searchTargetPaths = cliOptions.searchTargetCollection || cliOptions.searchTargetPaths;
    let referencePaths;
    if (
      /** @type {typeof import('../program/core/Analyzer.js').Analyzer} */ (
        /** @type {unknown} */ (queryConfig.analyzer)
      ).requiresReference
    ) {
      referencePaths = cliOptions.referenceCollection || cliOptions.referencePaths;
    }

    /**
     * May or may not include dependencies of search target
     * @type {PathFromSystemRoot[]}
     */
    let totalSearchTargets;
    if (cliOptions.targetDependencies !== undefined) {
      totalSearchTargets = /** @type {PathFromSystemRoot[]} */ (
        await _cliHelpersModule.appendProjectDependencyPaths(
          /** @type {PathFromSystemRoot[]} */ (searchTargetPaths),
          cliOptions.targetDependencies,
        )
      );
    } else {
      totalSearchTargets = /** @type {PathFromSystemRoot[]} */ (searchTargetPaths);
    }

    // TODO: filter out:
    // - dependencies listed in reference (?) Or at least, inside match-imports, make sure that
    //   we do not test against ourselves...
    // -

    _providenceModule.providence(queryConfig, {
      gatherFilesConfig: {
        extensions: cliOptions.extensions,
        allowlistMode: cliOptions.allowlistMode,
        allowlist: cliOptions.allowlist,
      },
      gatherFilesConfigReference: {
        extensions: cliOptions.extensions,
        allowlistMode: cliOptions.allowlistModeReference,
        allowlist: cliOptions.allowlistReference,
      },
      debugEnabled: cliOptions.debug,
      queryMethod,
      targetProjectPaths: totalSearchTargets,
      referenceProjectPaths: referencePaths,
      targetProjectRootPaths: /** @type {PathFromSystemRoot[]} */ (searchTargetPaths),
      writeLogFile: cliOptions.writeLogFile,
      skipCheckMatchCompatibility: cliOptions.skipCheckMatchCompatibility,
      measurePerformance: cliOptions.measurePerf,
      addSystemPathsInResult: cliOptions.addSystemPaths,
      fallbackToBabel: cliOptions.fallbackToBabel,
    });
  }

  // Like commander, the first two entries are the node executable and the script path.
  const { rest, flagsWithoutValue } = splitOptionalValueFlags(argv.slice(2));

  /** @type {Record<string, {type: 'boolean' | 'string'; short?: string}>} */
  const parseArgsOptions = {};
  for (const spec of ALL_OPTIONS) {
    parseArgsOptions[spec.name] = toParseArgsOption(spec);
  }

  const { values, positionals } = parseArgs({
    args: rest,
    options: parseArgsOptions,
    allowPositionals: true,
    strict: true,
  });

  if (values.version) {
    process.stdout.write(`${version}\n`);
    resolveCli(undefined);
    return;
  }

  if (values.help) {
    process.stdout.write(helpText());
    resolveCli(undefined);
    return;
  }

  const command = positionals[0];
  if (command !== ANALYZE_COMMAND && command !== ANALYZE_COMMAND_ALIAS) {
    process.stdout.write(helpText());
    rejectCli(new Error(`Unknown command: ${command === undefined ? '(none)' : command}`));
    return;
  }

  cliOptions = resolveOptionValues(values, flagsWithoutValue, ctx);

  const [analyzerName] = positionals.slice(1);
  analyzerOptions = {
    name: /** @type {AnalyzerName} */ (analyzerName),
    config: /** @type {AnalyzerConfig} */ (cliOptions.config),
    promptOptionalConfig: Boolean(cliOptions.promptOptionalConfig),
  };

  launchProvidence().then(resolveCli).catch(rejectCli);

  await cliPromise;
}
