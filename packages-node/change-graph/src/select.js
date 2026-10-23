/* eslint-disable no-continue */ // selection reads more clearly with early exits per case
/**
 * Selection: from a change set to the tests that have to run.
 *
 * The engine answers "which files can a file reach" and "which units reach a changed file"; this
 * module says what a unit is for this repo (a test directory for the browser tests), where the
 * change set comes from (the working tree, a pull request's merge base, or the last release tag) and
 * what happens when something cannot be resolved: a full run with a reason, never a silent skip.
 *
 * Lockfile changes are handled at dependency level: a dependency whose `version`, `resolved` or
 * `integrity` changed makes every file that imports it affected, and through those files the units
 * that reach them. npm and pnpm lockfiles are both supported.
 */
import fs from 'node:fs';
import path from 'node:path';

import { buildImportGraph, getModuleRequests } from './import-graph.js';
import { collectUnitFiles, findAffectedUnits } from './reachability.js';
import {
  changedFilesForPullRequest,
  changedFilesLocal,
  changedFilesSinceRelease,
  fileAtRevision,
  headRevision as gitHead,
  repoRoot,
} from './git.js';
import { changedPackagesInLockfile, lockfileFlavour } from './lockfile.js';
import {
  acquireLock,
  cacheDirFor,
  cacheKeyFor,
  readCache,
  releaseLock,
  waitForCache,
  writeCache,
} from './cache.js';

/** Files that change how tests run: their change means "run everything". */
export const ALWAYS_FULL_FILES = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'pnpm-lock.yml',
  'npm-shrinkwrap.json',
  'tsconfig.json',
  'web-test-runner.config.mjs',
  'web-test-runner-sr.config.mjs',
  'web-test-runner-chrome.config.mjs',
  'web-test-runner-firefox.config.mjs',
  'web-test-runner-webkit.config.mjs',
  '.changeset/config.json',
];

/**
 * Directories whose change means "run everything". The screen reader test runner is listed for the
 * same reason as `@web/test-runner`: its code runs inside every test the flow selects.
 */
export const ALWAYS_FULL_DIRS = [
  '.github/workflows/',
  '.github/actions/',
  'packages-node/test-runner-screenreader/',
];

/** The screen reader tests need a desktop reader, so they are never part of the browser set. */
export const SR_TEST_EXCLUDE = '**/*.sr.test.js';

/**
 * Dependencies that run *inside* every test, so their change means everything runs. Formatting-only
 * or type-only tooling is deliberately not in this list: it cannot change what a test observes, and
 * lint runs on every pull request anyway.
 */
export const TOOLING_DEPENDENCIES = [
  '@web/test-runner',
  '@web/test-runner-commands',
  '@web/test-runner-core',
  '@web/test-runner-playwright',
  '@web/dev-server',
  '@web/dev-server-core',
  '@open-wc/testing',
  '@open-wc/testing-helpers',
  'playwright',
  'mocha',
  'chai',
  '@esm-bundle/chai',
  'wireit',
  'patch-package',
];

/** Where the tests live. */
export const TEST_GLOBS = {
  browser: ['packages/*/test/**/*.test.js', 'packages/ui/components/**/test/**/*.test.js'],
  sr: ['packages/ui/components/**/test/*.sr.test.js'],
};

/**
 * @param {string} cwd
 * @returns {string} the revision the change set is relative to (`''` outside a repository)
 */
function headOf(cwd) {
  try {
    return gitHead(cwd);
  } catch {
    return '';
  }
}

/**
 * @param {string} file repo-relative
 * @returns {string} the path in git's form: forward slashes, no `./`
 */
export function toPosix(file) {
  return path.normalize(file).split(path.sep).join('/');
}

/**
 * @param {string} file repo-relative
 */
function isAlwaysFull(file) {
  // Git always names files with forward slashes; the lists above are written that way too, so
  // normalise to that form instead of to the platform's separator.
  const normalized = toPosix(file);
  // Documentation cannot change what a test observes (the runner's code can), so a markdown change
  // inside an always-full directory stays a selection instead of spending reader runners on prose.
  if (/\.(?:md|mdx)$/.test(normalized)) return false;
  return (
    ALWAYS_FULL_FILES.includes(normalized) ||
    ALWAYS_FULL_DIRS.some(dir => normalized.startsWith(dir))
  );
}

/**
 * @param {string} request
 * @returns {string} the bare package a module request belongs to, or an empty string
 */
export function packageOf(request) {
  if (!request || request.startsWith('.') || request.startsWith('/') || request.startsWith('#')) {
    return '';
  }
  if (request.startsWith('@')) {
    const [scope, name] = request.split('/');
    return `${scope}/${name ?? ''}`;
  }
  return request.split('/')[0];
}

/**
 * @param {string} cwd
 * @param {string[]} globs
 * @param {string[]} [exclude]
 * @returns {string[]} repo-relative test files
 */
export function listTestFiles(cwd, globs, exclude = []) {
  // Globs overlap (`packages/*/test/**` and `packages/ui/components/**/test/**`), so dedupe.
  return [
    ...new Set(
      globs.flatMap(glob => fs.globSync(glob, { cwd, exclude })).map(file => path.normalize(file)),
    ),
  ].sort();
}

/**
 * @param {string} cwd
 * @returns {string[]} every source file that can be part of a change since a release
 */
function listSourceFiles(cwd) {
  return fs.globSync(['packages/**/*.js', 'packages/**/*.ts', 'packages-node/**/*.js'], {
    cwd,
    exclude: ['**/node_modules/**'],
  });
}

/**
 * @param {string} cwd
 * @param {string} mode
 * @param {string} [base]
 * @returns {Map<string, string>} changed lockfile dependency -> why it changed
 */
export function changedDependenciesForMode(cwd, mode, base) {
  /** @type {Map<string, string>} */
  const changed = new Map();
  const ref = mode === 'pr' ? (base ?? 'origin/master') : 'HEAD';
  for (const lockfile of ['package-lock.json', 'pnpm-lock.yaml']) {
    const currentPath = path.resolve(cwd, lockfile);
    const current = fs.existsSync(currentPath) ? fs.readFileSync(currentPath, 'utf8') : '';
    if (!current) {
      continue;
    }
    try {
      const previous = fileAtRevision(cwd, ref, lockfile);
      for (const [name, why] of changedPackagesInLockfile(
        lockfileFlavour(lockfile),
        previous,
        current,
      )) {
        changed.set(name, why);
      }
    } catch (error) {
      changed.set(
        `(unreadable ${lockfile})`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
  return changed;
}

/**
 * @typedef {object} SelectionOptions
 * @property {string} [cwd]
 * @property {'local' | 'pr' | 'release'} [mode]
 * @property {string} [base] the target branch for `mode: 'pr'`
 * @property {boolean} [includeSr] also consider the screen reader tests
 * @property {boolean} [full] run everything
 * @property {boolean} [cache] reuse a previous computation (default true)
 * @property {string} [cacheDir] where those results live (default `node_modules/.cache/change-graph`)
 * @property {number} [lockWaitMs] how long to wait for a tool that is computing this very key (3000)
 * @property {string[]} [changedFiles] an explicit change set (CI can pass one, tests use it)
 */

/**
 * @typedef {object} Selection
 * @property {string} mode
 * @property {boolean} full
 * @property {boolean} cached
 * @property {string | null} cacheKey
 * @property {string[]} reasons
 * @property {string[]} changedFiles
 * @property {string[]} changedDependencies
 * @property {string[]} testFiles
 * @property {string[]} units
 * @property {{ files: number }} graph
 */

/**
 * @param {SelectionOptions} [options]
 * @returns {Promise<Selection>}
 */
/**
 * @param {string} file
 * @returns {string}
 */
function safeRead(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

/**
 * @param {SelectionOptions} [options]
 * @returns {Promise<Selection>}
 */
export async function selectTests(options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const mode = options.mode ?? 'local';
  const root = repoRoot(cwd);
  // `buildImportGraph` and the selection below work on the repository root; the screen reader tests
  // are only part of the set when they are asked for, and they are a separate runner.
  const globs = [...TEST_GLOBS.browser, ...(options.includeSr ? TEST_GLOBS.sr : [])];
  const exclude = options.includeSr ? [] : [SR_TEST_EXCLUDE];
  /** @type {string[]} */
  const reasons = [];
  /** @type {string[]} */
  let changedFiles = options.changedFiles ?? [];

  const allTestFiles = listTestFiles(cwd, globs, exclude);
  const testFiles = new Set(allTestFiles);

  if (!options.full && changedFiles.length === 0) {
    if (mode === 'local') {
      const local = changedFilesLocal(cwd);
      changedFiles = local.files;
      if (local.untracked.length > 0) {
        reasons.push(`${local.untracked.length} untracked file(s) count as changed`);
      }
    } else if (mode === 'pr') {
      try {
        changedFiles = changedFilesForPullRequest(cwd, options.base ?? 'origin/master');
      } catch (error) {
        return {
          mode,
          full: true,
          cached: false,
          cacheKey: null,
          reasons: [
            ...reasons,
            `run everything: ${error instanceof Error ? error.message : error}`,
          ],
          changedFiles: [],
          changedDependencies: [],
          testFiles: allTestFiles,
          units: [],
          graph: { files: 0 },
        };
      }
    } else {
      const release = changedFilesSinceRelease(cwd, listSourceFiles(cwd));
      changedFiles = release.files;
      reasons.push(...release.reasons);
    }
  }

  const alwaysFull = changedFiles.filter(isAlwaysFull);
  const changedDependencies = changedDependenciesForMode(cwd, mode, options.base);
  const tooling = [...changedDependencies.keys()].filter(name =>
    TOOLING_DEPENDENCIES.some(dependency => name === dependency),
  );

  if (options.full === true) {
    reasons.push('run everything was requested');
  }
  if (alwaysFull.length > 0) {
    reasons.push(`run everything: ${alwaysFull.join(', ')} changed`);
  }
  if (tooling.length > 0) {
    reasons.push(`run everything: test tooling changed (${tooling.join(', ')})`);
  }

  /** The test directories of the files that will run, without building the graph. */
  const unitsOfFiles = (/** @type {string[]} */ files) =>
    [...new Set(files.map(file => path.dirname(file)))].sort();

  // A full run does not need the graph at all, and it is nothing to memoise either: every tool is
  // going to run every test no matter what it asks.
  if (options.full === true || alwaysFull.length > 0 || tooling.length > 0) {
    return {
      mode,
      full: true,
      cached: false,
      cacheKey: null,
      reasons,
      changedFiles,
      changedDependencies: [...changedDependencies.keys()],
      testFiles: allTestFiles,
      units: unitsOfFiles(allTestFiles),
      graph: { files: 0 },
    };
  }

  // Tools start in parallel (lint, node tests, browser tests, screen reader tests), so the first one
  // computes and the rest read the same answer back: the key is the base revision plus the bytes of
  // every touched file, not the git status.
  const cacheDir = cacheDirFor(root, options.cacheDir);
  const useCache = options.cache !== false && process.env.CHANGE_GRAPH_NO_CACHE !== '1';
  const cacheKey = useCache
    ? await cacheKeyFor(root, {
        mode,
        base: options.base ?? null,
        includeSr: options.includeSr === true,
        globs,
        exclude,
        alwaysFullFiles: ALWAYS_FULL_FILES,
        alwaysFullDirs: ALWAYS_FULL_DIRS,
        tooling: TOOLING_DEPENDENCIES,
        head: headOf(cwd),
        files: changedFiles,
        dependencies: [...changedDependencies].sort(([a], [b]) => a.localeCompare(b)),
      })
    : null;

  if (cacheKey) {
    const usable = (/** @type {Record<string, any> | null} */ cached) =>
      Boolean(cached && cached.mode === mode && Array.isArray(cached.testFiles));

    const cached = readCache(cacheDir, cacheKey);
    if (usable(cached)) {
      return { .../** @type {Selection} */ (cached), cached: true, cacheKey };
    }

    // Another tool is already computing exactly this. Wait for its answer instead of building the
    // same import graph a second time; if it does not arrive in time, compute it ourselves.
    if (!acquireLock(cacheDir, cacheKey)) {
      const fromOther = await waitForCache(cacheDir, cacheKey, options.lockWaitMs ?? 3000);
      if (usable(fromOther)) {
        return { .../** @type {Selection} */ (fromOther), cached: true, cacheKey };
      }
    }
  }

  const graph = await buildImportGraph({
    root: path.join(root, 'packages'),
    include: filePath => /\.(?:js|ts|mjs)$/.test(filePath) && !filePath.includes('node_modules'),
  });
  /** @type {(filePath: string) => string | null} */
  const unitOf = filePath => {
    // Both sides of the comparison are relative to the repository root: the list of test files is.
    const relative = path.normalize(path.relative(root, filePath));
    return testFiles.has(relative) ? path.dirname(relative) : null;
  };
  const unitFiles = collectUnitFiles(graph, unitOf);

  // A changed dependency affects the files that import it, and through them the units reaching them.
  /** @type {string[]} */
  const dependencyTargets = [];
  for (const [name, why] of changedDependencies) {
    const importers = [];
    for (const file of graph.keys()) {
      const source = safeRead(file);
      if (!source) {
        continue;
      }
      try {
        if (getModuleRequests(file, source).some(request => packageOf(request) === name)) {
          importers.push(file);
        }
      } catch {
        // an unparsable file simply does not import the dependency
      }
    }
    if (importers.length > 0) {
      reasons.push(`${why} -> ${importers.length} file(s) import it`);
      dependencyTargets.push(...importers);
    }
  }

  const changedInGraph = changedFiles
    .map(file => path.join(root, file))
    .filter(file => graph.has(file));
  const missing = changedFiles.length - changedInGraph.length;
  if (missing > 0) {
    reasons.push(`${missing} changed file(s) are not in the graph (docs, tooling)`);
  }

  const changedTestUnits = changedFiles.flatMap(file => {
    const unit = unitOf(path.join(root, file));
    return unit ? [unit] : [];
  });
  const units = [
    ...new Set([
      ...findAffectedUnits(unitFiles, [...changedInGraph, ...dependencyTargets]),
      ...changedTestUnits,
    ]),
  ].sort();

  /** @type {Selection} */
  const selection = {
    mode,
    full: false,
    cached: false,
    cacheKey,
    reasons,
    changedFiles,
    changedDependencies: [...changedDependencies.keys()],
    testFiles: allTestFiles.filter(file => units.includes(path.dirname(file))),
    units,
    graph: { files: graph.size },
  };
  if (cacheKey) {
    writeCache(cacheDir, cacheKey, selection);
    releaseLock(cacheDir, cacheKey);
  }
  return selection;
}
