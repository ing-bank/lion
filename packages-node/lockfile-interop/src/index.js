// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import {
  compareLocks,
  declaredDrift,
  formatReport,
  missingDeclarations,
  npmResolutionFor,
} from './compare.js';
import { generateNpmLock, writeNpmLock } from './generator.js';
import { readNpmLock } from './npm-lock.js';
import {
  isTrackedByGit,
  overridesDrift,
  readNpmOverrides,
  readPnpmOverrides,
} from './overrides.js';
import { readPnpmLock } from './pnpm-lock.js';

/**
 * @typedef {object} RepoLayout
 * @property {string} repoRoot
 * @property {string} [pnpmLockFile]
 * @property {string} [npmLockFile]
 * @property {'strict'|'declared'} [mode] `strict` compares full record sets (repo commits pnpm-lock.yaml),
 *   `declared` compares what each workspace manifest declares against the npm lock (pnpm imports the npm
 *   lock). Defaults to `strict`.
 */

/**
 * @typedef {import('./compare.js').DriftReport & {
 *   missingDeclarations: string[],
 *   noNpmLock: boolean,
 *   noPnpmLock: boolean,
 *   noPnpmWorkspace: boolean,
 *   pnpmWorkspaceUntracked: boolean,
 *   declared: import('./compare.js').DeclaredDriftEntry[],
 *   overrides: import('./overrides.js').OverrideDriftEntry[],
 * }} CheckResult
 */

/**
 * @param {string} repoRoot
 * @param {import('./pnpm-lock.js').PnpmLock} pnpm
 * @returns {Map<string, Set<string>>}
 */
function manifestsOf(repoRoot, pnpm) {
  /** @type {Map<string, Set<string>>} */
  const manifests = new Map();
  for (const dir of pnpm.importers.keys()) {
    const manifestPath = path.join(repoRoot, dir === '.' ? 'package.json' : `${dir}/package.json`);
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      manifests.set(
        dir,
        new Set([
          ...Object.keys(manifest.dependencies ?? {}),
          ...Object.keys(manifest.devDependencies ?? {}),
        ]),
      );
    }
  }
  return manifests;
}

/**
 * The gate: compare pnpm-lock.yaml with the committed package-lock.json and report every divergence.
 *
 * A repo without a pnpm lock is not a failure: the guard only applies once the repo installs with pnpm.
 *
 * @param {RepoLayout} layout
 * @returns {CheckResult}
 */
export function check(layout) {
  /** @type {CheckResult} */
  const empty = {
    ok: true,
    versionMismatches: [],
    onlyPnpm: [],
    onlyNpm: [],
    pnpmRecords: 0,
    npmRecords: 0,
    missingDeclarations: [],
    declared: [],
    overrides: [],
    noNpmLock: false,
    noPnpmLock: false,
    noPnpmWorkspace: false,
    pnpmWorkspaceUntracked: false,
  };
  const lockPath = path.join(layout.repoRoot, layout.pnpmLockFile ?? 'pnpm-lock.yaml');
  if (!fs.existsSync(lockPath)) return { ...empty, noPnpmLock: true };

  const pnpm = readPnpmLock(layout.repoRoot, layout.pnpmLockFile);
  const npm = readNpmLock(layout.repoRoot, layout.npmLockFile);
  if (!npm) return { ...empty, ok: false, noNpmLock: true };

  // The overrides live in two committed files that cannot be one file: package.json carries npm's spelling,
  // pnpm-workspace.yaml pnpm's. Without the workspace file pnpm resolves without the overrides the npm lock
  // was built with, so the parity check is not optional.
  const pnpmOverrides = readPnpmOverrides(layout.repoRoot);
  if (!pnpmOverrides) return { ...empty, ok: false, noPnpmWorkspace: true };
  const overrides = overridesDrift(readNpmOverrides(layout.repoRoot), pnpmOverrides);
  const pnpmWorkspaceUntracked = !isTrackedByGit(layout.repoRoot);

  const manifests = manifestsOf(layout.repoRoot, pnpm);
  const missing = missingDeclarations(pnpm, npm, manifests);
  if (layout.mode === 'declared') {
    const declared = declaredDrift(pnpm, npm, manifests);
    return {
      ...empty,
      ok:
        declared.length === 0 &&
        missing.length === 0 &&
        overrides.length === 0 &&
        !pnpmWorkspaceUntracked,
      pnpmRecords: pnpm.packages.size,
      npmRecords: npm.packages.size,
      declared,
      missingDeclarations: missing,
      overrides,
      pnpmWorkspaceUntracked,
    };
  }

  const report = compareLocks(pnpm, npm);
  return {
    ...report,
    declared: [],
    overrides,
    pnpmWorkspaceUntracked,
    ok: report.ok && missing.length === 0 && overrides.length === 0 && !pnpmWorkspaceUntracked,
    missingDeclarations: missing,
    noNpmLock: false,
    noPnpmLock: false,
  };
}

/**
 * Regenerate package-lock.json from pnpm-lock.yaml without running npm.
 *
 * @param {import('./generator.js').GenerateOptions} options
 * @returns {import('./generator.js').GenerateResult}
 */
export function generate(options) {
  return writeNpmLock(options);
}

/**
 * @param {import('./generator.js').GenerateOptions} options
 * @returns {{ lock: Record<string, unknown>, result: import('./generator.js').GenerateResult }}
 */
export function generateInMemory(options) {
  return generateNpmLock(options);
}

export {
  compareLocks,
  declaredDrift,
  formatReport,
  missingDeclarations,
  readNpmLock,
  readPnpmLock,
};
export {
  flattenNpmOverrides,
  isTrackedByGit,
  overridesDrift,
  readNpmOverrides,
  readPnpmOverrides,
  readPnpmOverridesText,
} from './overrides.js';
export { renderPnpmWorkspace, syncPnpmWorkspace, workspaceIsInSync } from './workspace.js';
export { stringifyJson, toJsonLines } from './json-notation.js';
