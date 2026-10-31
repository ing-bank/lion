/* eslint-disable no-console */
/**
 * Dependency-surface lint.
 *
 * Weighs every dependency a workspace manifest declares by what it drags into the install, in the
 * order that matters for risk:
 *
 *   1. attack surface (highest)  - packages in the closure that execute code at install time, and how
 *                                  deep the chain that nobody chose runs. See "why these metrics"
 *                                  below and docs/maintenance/dependency-surface.md for the sources.
 *   2. unintentional nesting     - a stack installed twice inside one declaration's closure, which is
 *                                  an accident of a stale declared range rather than a choice.
 *   3. transitive weight (lowest) - the number of distinct packages, against a budget (20 by default).
 *                                  Count is a weak proxy for risk on its own, so it only warns at
 *                                  `low` and never escalates a row by itself.
 *
 * Everything except the platform check is derived from `package-lock.json`, so the check runs in CI
 * without an install and cannot disagree with what the lock would install.
 *
 * Warnings only for now: exit 0 unless `--strict` is passed. Declarations that are knowingly accepted
 * live in the root package.json under `dependencySurface.allow` (manifest path -> dependency -> why).
 *
 * Usage:
 *   node ./scripts/lint-dependency-surface.mjs
 *     [--max=20] [--depth=8] [--manifest=<path>]... [--json] [--show-allowed] [--strict] [--help]
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';

export const DEFAULT_MAX_PACKAGES = 20;
export const DEFAULT_MAX_DEPTH = 8;
export const SEVERITIES = ['high', 'medium', 'low'];

/**
 * Name of a lock path as a package name, or undefined for workspace/link directories.
 * `node_modules/foo/node_modules/@s/b` -> `@s/b`; `packages/ui` -> undefined.
 *
 * @param {string} key
 * @returns {string | undefined}
 */
function packageNameOfLockKey(key) {
  if (!key.includes('node_modules/')) {
    return undefined;
  }
  const segments = key.split('node_modules/');
  return segments[segments.length - 1] || undefined;
}

/**
 * Line number of `"<name>":` in the manifest text, so editors can jump to the declaration.
 *
 * @param {string} manifestPath
 * @param {string} name
 * @returns {number | undefined}
 */
export function findDeclarationLine(manifestPath, name) {
  if (!existsSync(manifestPath)) {
    return undefined;
  }
  const lines = readFileSync(manifestPath, 'utf8').split('\n');
  const needle = `"${name}"`;
  const index = lines.findIndex(line => line.trim().startsWith(`${needle}:`));
  return index === -1 ? undefined : index + 1;
}

/**
 * Specifiers npm never resolves through the lock (`file:`, `workspace:`, `link:`) plus the
 * non-registry protocols.
 *
 * @param {string} range
 * @returns {boolean}
 */
export function isLocalSpecifier(range) {
  return /^(file:|link:|workspace:|portal:|git\+|https?:)/.test(range);
}

/**
 * The generation of a package a version belongs to: the major, or the minor for a 0.x release, where
 * semver treats the minor as breaking. Two lock paths of one name in two different generations inside
 * one declaration's closure are two incompatible copies of the same package, which is what a stale
 * declared range produces (here: `@web/test-runner-commands` asked for ^0.6.1 while the root asked for
 * ^0.9.0, so npm nested an entire 0.6 stack, `ip@1.1.9` included).
 *
 * @param {string} version
 * @returns {string}
 */
export function versionIdentity(version) {
  const [major, minor] = String(version).split('.');
  return Number(major) > 0 ? String(major) : `0.${minor}`;
}

/**
 * Whether npm would install a package everywhere: an `os`/`cpu` restriction means the package (and
 * its install script) is skipped on the other platforms entirely. Measured in this repo: 12
 * declarations carry `fsevents` (os: darwin), so its install script never runs on a Linux or Windows
 * install. The check is deliberately static (read from the lock, not from the machine running the
 * lint) so the output -- and the allowlist in package.json -- is identical on every developer machine
 * and in CI.
 *
 * @param {any} record lock record
 * @returns {boolean}
 */
export function installsEverywhere(record) {
  return !record.os && !record.cpu;
}

/**
 * The platforms a restricted package installs on, for the reason text.
 *
 * @param {any} record lock record
 * @returns {string}
 */
export function platformGate(record) {
  const gates = []
    .concat(record.os || [])
    .concat((record.cpu || []).map(cpu => `cpu:${cpu}`))
    .join(', ');
  return gates || 'some platforms';
}

/**
 * Index a `package-lock.json` for npm-shaped resolution.
 *
 * @param {any} lock parsed package-lock.json
 */
export function createLockIndex(lock) {
  const entries = lock.packages || {};

  /**
   * Resolve `name` as npm does: from the declaring directory, walking up every `node_modules` level.
   *
   * @param {string} name
   * @param {string} fromDir directory of the entry that declares `name` ('' = repo root)
   * @returns {{ key: string, record: any } | undefined}
   */
  function resolve(name, fromDir) {
    const segments = fromDir ? fromDir.split('/') : [];
    for (let i = segments.length; i >= 0; i -= 1) {
      const dir = segments.slice(0, i).join('/');
      const key = `${dir ? `${dir}/` : ''}node_modules/${name}`;
      if (entries[key]) {
        return { key, record: entries[key] };
      }
    }
    return undefined;
  }

  /**
   * The dependencies that belong to a lock entry: a `link: true` entry points at a workspace
   * directory whose own entry holds them, and those resolve from that directory.
   *
   * @param {string} key
   * @param {any} record
   * @returns {{ target: any, fromDir: string }}
   */
  function targetOf(key, record) {
    const linked = record.link && entries[record.resolved];
    return {
      target: linked || record,
      fromDir: record.link ? record.resolved : key,
    };
  }

  /**
   * Everything reachable from `name`, which is what that one declaration costs the install.
   *
   * @param {string} name
   * @param {string} fromDir
   * @returns {any} { names, keys, maxDepth, duplicateNames, installScripts }
   */
  function closure(name, fromDir) {
    const resolvedRoot = resolve(name, fromDir);
    if (!resolvedRoot) {
      return { names: [], keys: [], maxDepth: 0, duplicateNames: [], installScripts: [] };
    }
    /** @type {Map<string, number>} lock key -> depth from the declaration */
    const seen = new Map([[resolvedRoot.key, 0]]);
    /** @type {Map<string, { version: string, identity: string }[]>} */
    const namePaths = new Map();
    /** @type {Map<string, any>} package name -> one lock record of it */
    const records = new Map();
    let maxDepth = 0;
    const queue = [[resolvedRoot.key, resolvedRoot.record, 0]];
    while (queue.length > 0) {
      const [key, record, depth] = queue.shift();
      maxDepth = Math.max(maxDepth, depth);
      const packageName = packageNameOfLockKey(key);
      if (packageName) {
        const paths = namePaths.get(packageName) || [];
        paths.push({ version: record.version, identity: versionIdentity(record.version) });
        namePaths.set(packageName, paths);
        records.set(packageName, record);
      }
      const { target, fromDir: entryDir } = targetOf(key, record);
      const declared = [
        ...Object.keys(target.dependencies || {}),
        ...Object.keys(target.optionalDependencies || {}),
        ...Object.keys(target.peerDependencies || {}),
      ];
      for (const depName of declared) {
        const found = resolve(depName, entryDir);
        if (found && !seen.has(found.key)) {
          seen.set(found.key, depth + 1);
          queue.push([found.key, found.record, depth + 1]);
        }
      }
    }
    const duplicateNames = [...namePaths.entries()]
      .map(([dupName, paths]) => ({
        name: dupName,
        lockPaths: paths.length,
        identities: [...new Set(paths.map(entry => entry.identity))].sort(),
      }))
      .filter(entry => entry.identities.length > 1);
    const installScripts = [...namePaths.keys()]
      .filter(packageName => records.get(packageName).hasInstallScript)
      .map(packageName => ({
        name: packageName,
        version: records.get(packageName).version,
        // a package npm skips on other platforms is not surface for an install here
        installsEverywhere: installsEverywhere(records.get(packageName)),
        gate: platformGate(records.get(packageName)),
      }));
    return {
      names: [...namePaths.keys()],
      keys: [...seen.keys()].filter(key => packageNameOfLockKey(key)),
      maxDepth,
      duplicateNames,
      installScripts,
    };
  }

  return { entries, resolve, closure, targetOf };
}

/**
 * @param {any} pkg parsed package.json
 * @returns {{ name: string, range: string, kind: string }[]}
 */
function declaredDependencies(pkg) {
  /** @type {{ name: string, range: string, kind: string }[]} */
  const result = [];
  const seen = new Set();
  const kinds = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
  for (const kind of kinds) {
    for (const [name, range] of Object.entries(pkg[kind] || {})) {
      if (!seen.has(name)) {
        seen.add(name);
        result.push({ name, range: String(range), kind });
      }
    }
  }
  return result;
}

/**
 * Severity of one declaration. Attack surface decides the band; a duplicated stack inside the closure
 * (an accident, not a choice) escalates too; the raw package count only ever reaches `low`, because
 * count is a weak proxy for risk -- see docs/maintenance/dependency-surface.md.
 *
 * @param {any} row
 * @param {object} budgets
 * @param {number} budgets.maxPackages
 * @param {number} budgets.maxDepth
 * @returns {{ severity: string, reasons: string[] }}
 */
export function severityOf(row, { maxPackages, maxDepth }) {
  const reasons = [];
  let severity = 'low';
  const escalate = candidate => {
    if (SEVERITIES.indexOf(candidate) < SEVERITIES.indexOf(severity)) {
      severity = candidate;
    }
  };
  const running = row.installScripts.filter(script => script.installsEverywhere);
  if (running.length > 0) {
    escalate('high');
    reasons.push(
      `install script runs on every install: ${running
        .map(script => `${script.name}@${script.version}`)
        .join(', ')}`,
    );
  }
  if (row.maxDepth > maxDepth) {
    escalate('medium');
    reasons.push(`depth ${row.maxDepth} > ${maxDepth}`);
  }
  if (row.duplicateNames.length > 0) {
    escalate('medium');
    const named = row.duplicateNames
      .slice(0, 3)
      .map(dup => `${dup.name} ${dup.identities.join('/')}`)
      .join(', ');
    reasons.push(
      `two generations of the same package: ${row.duplicateNames.length} names, e.g. ${named}${
        row.duplicateNames.length > 3 ? ', …' : ''
      }`,
    );
  }
  if (row.packages > maxPackages) {
    reasons.push(
      `weight ${row.packages} > ${maxPackages}${
        row.duplicateNames.length > 0 ? ' (count here is a nesting accident, not a choice)' : ''
      }`,
    );
  }
  return { severity, reasons };
}

/**
 * Weigh every registry dependency a manifest declares.
 *
 * `packages` is the absolute weight: everything reachable from that dependency alone. `exclusive` is
 * the marginal one: the packages no sibling declaration in the same manifest also reaches -- what
 * would really leave this manifest with the declaration gone.
 *
 * @param {object} options
 * @param {ReturnType<typeof createLockIndex>} options.index
 * @param {any} options.pkg parsed package.json
 * @param {string} options.manifestPath
 * @param {string} options.dir directory of the manifest ('' = repo root)
 * @param {number} options.maxPackages
 * @param {number} options.maxDepth
 * @returns {{ rows: any[], flagged: any[] }}
 */
export function weighManifest({ index, pkg, manifestPath, dir, maxPackages, maxDepth }) {
  const declarations = declaredDependencies(pkg);
  /** @type {Map<string, string[]>} */
  const closures = new Map();
  for (const declaration of declarations) {
    if (!isLocalSpecifier(declaration.range)) {
      closures.set(declaration.name, index.closure(declaration.name, dir).names);
    }
  }
  // a name that two declarations of this manifest both reach is shared: neither one owns it
  /** @type {Map<string, number>} */
  const reachCount = new Map();
  for (const reachedNames of closures.values()) {
    for (const reached of reachedNames) {
      reachCount.set(reached, (reachCount.get(reached) || 0) + 1);
    }
  }
  const shared = new Set(
    [...reachCount.entries()].filter(([, count]) => count > 1).map(([reached]) => reached),
  );

  /** @type {any[]} */
  const rows = [];
  for (const { name, range, kind } of declarations) {
    if (!isLocalSpecifier(range)) {
      const base = {
        manifest: manifestPath,
        packageName: pkg.name,
        name,
        kind,
        range,
        line: findDeclarationLine(manifestPath, name),
      };
      const resolvedRoot = index.resolve(name, dir);
      if (!resolvedRoot) {
        rows.push({
          ...base,
          installed: false,
          packages: 0,
          lockPaths: 0,
          exclusive: 0,
          maxDepth: 0,
          duplicateNames: [],
          installScripts: [],
          heaviest: null,
          severity: 'low',
          reasons: [],
        });
      } else {
        const {
          names,
          keys,
          maxDepth: depth,
          duplicateNames,
          installScripts,
        } = index.closure(name, dir);
        const { target, fromDir } = index.targetOf(resolvedRoot.key, resolvedRoot.record);
        let heaviest = null;
        for (const child of [
          ...Object.keys(target.dependencies || {}),
          ...Object.keys(target.optionalDependencies || {}),
        ]) {
          if (index.resolve(child, fromDir)) {
            const childWeight = index.closure(child, fromDir).names.length;
            if (!heaviest || childWeight > heaviest.packages) {
              heaviest = { name: child, packages: childWeight };
            }
          }
        }
        const row = {
          ...base,
          installed: true,
          packages: names.length,
          lockPaths: keys.length,
          exclusive: names.filter(reached => !shared.has(reached)).length,
          maxDepth: depth,
          duplicateNames,
          installScripts,
          heaviest,
        };
        rows.push({ ...row, ...severityOf(row, { maxPackages, maxDepth }) });
      }
    }
  }
  const flagged = rows
    .filter(row => row.reasons.length > 0)
    .sort(
      (a, b) =>
        SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) ||
        b.installScripts.length - a.installScripts.length ||
        b.maxDepth - a.maxDepth ||
        b.packages - a.packages,
    );
  return { rows, flagged };
}

/**
 * The root manifest plus one entry per directory matched by its `workspaces` globs.
 *
 * @param {string} cwd
 * @returns {{ manifestPath: string, dir: string }[]}
 */
export function collectManifests(cwd) {
  const rootManifestPath = path.join(cwd, 'package.json');
  /** @type {{ manifestPath: string, dir: string }[]} */
  const result = [{ manifestPath: rootManifestPath, dir: '' }];
  if (existsSync(rootManifestPath)) {
    const root = JSON.parse(readFileSync(rootManifestPath, 'utf8'));
    for (const glob of root.workspaces || []) {
      const parts = glob.split('/');
      const parent = path.join(cwd, ...parts.slice(0, -1));
      const last = parts[parts.length - 1];
      if (existsSync(parent)) {
        const dirs =
          last === '*'
            ? readdirSync(parent, { withFileTypes: true })
                .filter(entry => entry.isDirectory())
                .map(entry => entry.name)
            : [last];
        for (const dir of dirs) {
          const manifestPath = path.join(parent, dir, 'package.json');
          if (existsSync(manifestPath)) {
            result.push({ manifestPath, dir: parts.slice(0, -1).concat(dir).join('/') });
          }
        }
      }
    }
  }
  return result;
}

/**
 * Accepted declarations, keyed by manifest path relative to the repo root, from the root manifest's
 * `dependencySurface.allow`. A declaration that is allowed is counted, never warned about.
 *
 * @param {string} cwd
 * @returns {Record<string, Record<string, string>>}
 */
export function readAllowlist(cwd) {
  const manifestPath = path.join(cwd, 'package.json');
  if (!existsSync(manifestPath)) {
    return {};
  }
  const root = JSON.parse(readFileSync(manifestPath, 'utf8'));
  return (root.dependencySurface || {}).allow || {};
}

/**
 * @param {object} options
 * @param {string} options.cwd
 * @param {number} options.maxPackages
 * @param {number} options.maxDepth
 * @param {string[]} [options.only] restrict to these manifest paths
 * @returns {{ results: any[], totals: any }}
 */
export function evaluate({ cwd, maxPackages, maxDepth, only }) {
  const lock = JSON.parse(readFileSync(path.join(cwd, 'package-lock.json'), 'utf8'));
  const index = createLockIndex(lock);
  const allow = readAllowlist(cwd);
  let manifests = collectManifests(cwd);
  if (only && only.length > 0) {
    manifests = manifests.filter(entry =>
      only.some(wanted => path.resolve(cwd, wanted) === path.resolve(entry.manifestPath)),
    );
  }
  const results = manifests.map(({ manifestPath, dir }) => {
    const pkg = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const weighed = weighManifest({ index, pkg, manifestPath, dir, maxPackages, maxDepth });
    const allowed = allow[path.relative(cwd, manifestPath) || 'package.json'] || {};
    return {
      manifestPath,
      dir,
      pkg,
      ...weighed,
      flagged: weighed.flagged.map(row =>
        allowed[row.name] ? { ...row, allowed: allowed[row.name] } : row,
      ),
    };
  });
  const all = results.flatMap(result => result.flagged);
  const warnings = all.filter(row => !row.allowed);
  const countBySeverity = severity => warnings.filter(row => row.severity === severity).length;
  const totals = {
    manifests: results.length,
    declarations: results.reduce((sum, result) => sum + result.rows.length, 0),
    warnings: warnings.length,
    warningsWithManifest: results.filter(result => result.flagged.some(row => !row.allowed)).length,
    allowed: all.filter(row => row.allowed).length,
    high: countBySeverity('high'),
    medium: countBySeverity('medium'),
    low: countBySeverity('low'),
    uninstalled: results.reduce(
      (sum, result) => sum + result.rows.filter(row => !row.installed).length,
      0,
    ),
  };
  return { results, totals };
}

/**
 * @param {{ results: any[], totals: any }} report
 * @param {object} options
 * @param {number} options.maxPackages
 * @param {number} options.maxDepth
 * @param {string} options.cwd
 * @param {boolean} [options.showAllowed]
 * @returns {string[]}
 */
export function render(report, { maxPackages, maxDepth, cwd, showAllowed }) {
  /** @type {string[]} */
  const lines = [];
  const relative = manifestPath => path.relative(cwd, manifestPath) || 'package.json';
  for (const result of report.results) {
    const shown = result.flagged.filter(row => showAllowed || !row.allowed);
    if (shown.length > 0) {
      lines.push(`${relative(result.manifestPath)} (${result.pkg.name || 'unnamed'}):`);
      for (const row of shown) {
        const location = row.line
          ? `${relative(result.manifestPath)}:${row.line}`
          : relative(result.manifestPath);
        lines.push(
          `  ${row.severity.padEnd(6)} ${location}  ${row.name} (${row.kind}) · ${
            row.packages
          } packages · depth ${row.maxDepth} · ${row.exclusive} exclusive${
            row.allowed ? ` · allowed: ${row.allowed}` : ''
          }`,
        );
        for (const reason of row.reasons) {
          lines.push(`           ↳ ${reason}`);
        }
      }
      lines.push('');
    }
  }
  lines.push(
    `budgets: packages ${maxPackages} · depth ${maxDepth} · install scripts 0 · duplicate generations 0`,
  );
  lines.push(
    `${report.totals.warnings} declarations flagged (${report.totals.high} high, ${
      report.totals.medium
    } medium, ${report.totals.low} low) of ${report.totals.declarations} checked in ${
      report.totals.manifests
    } manifests; ${report.totals.allowed} allowed in package.json`,
  );
  return lines;
}

/**
 * @param {string[]} argv
 * @returns {number} exit code
 */
export function main(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      max: { type: 'string', default: String(DEFAULT_MAX_PACKAGES) },
      depth: { type: 'string', default: String(DEFAULT_MAX_DEPTH) },
      manifest: { type: 'string', multiple: true },
      json: { type: 'boolean', default: false },
      'show-allowed': { type: 'boolean', default: false },
      strict: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
    allowPositionals: false,
  });
  if (values.help) {
    console.log(
      [
        'usage: node ./scripts/lint-dependency-surface.mjs [options]',
        '',
        '  --max=<n>        package-count budget per declaration (default 20, the lowest-weight signal)',
        '  --depth=<n>      warn when the chain from a declaration is deeper (default 8)',
        '  --manifest=<p>   only this manifest (repeatable, default: root + every workspace)',
        '  --json           machine-readable output',
        '  --show-allowed   also list the declarations allowed in package.json',
        '  --strict         exit 1 when anything is flagged (default: warnings only, exit 0)',
      ].join('\n'),
    );
    return 0;
  }
  const cwd = process.cwd();
  const maxPackages = Number(values.max);
  const maxDepth = Number(values.depth);
  const invalid = [
    ['--max', maxPackages, values.max],
    ['--depth', maxDepth, values.depth],
  ].find(([, parsed]) => !Number.isFinite(parsed) || parsed < 0);
  if (invalid) {
    console.error(`${invalid[0]} must be a non-negative number, got "${invalid[2]}"`);
    return 1;
  }
  const report = evaluate({ cwd, maxPackages, maxDepth, only: values.manifest });
  if (values.json) {
    console.log(
      JSON.stringify(
        {
          budgets: { packages: maxPackages, depth: maxDepth },
          totals: report.totals,
          warnings: report.results.flatMap(result =>
            result.flagged
              .filter(row => !row.allowed)
              .map(row => ({ ...row, manifest: path.relative(cwd, row.manifest) })),
          ),
        },
        null,
        2,
      ),
    );
  } else {
    for (const line of render(report, {
      maxPackages,
      maxDepth,
      cwd,
      showAllowed: values['show-allowed'],
    })) {
      console.log(line);
    }
  }
  return values.strict && report.totals.warnings > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
