// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { compareLocks, formatReport, missingDeclarations } from './compare.js';
import { generateNpmLock, writeNpmLock } from './generator.js';
import { readNpmLock } from './npm-lock.js';
import { readPnpmLock } from './pnpm-lock.js';

/**
 * @typedef {object} RepoLayout
 * @property {string} repoRoot
 * @property {string} [pnpmLockFile]
 * @property {string} [npmLockFile]
 */

/**
 * @typedef {import('./compare.js').DriftReport & {
 *   missingDeclarations: string[],
 *   noNpmLock: boolean,
 *   noPnpmLock: boolean,
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
    noNpmLock: false,
    noPnpmLock: false,
  };
  const lockPath = path.join(layout.repoRoot, layout.pnpmLockFile ?? 'pnpm-lock.yaml');
  if (!fs.existsSync(lockPath)) return { ...empty, noPnpmLock: true };

  const pnpm = readPnpmLock(layout.repoRoot, layout.pnpmLockFile);
  const npm = readNpmLock(layout.repoRoot, layout.npmLockFile);
  if (!npm) return { ...empty, ok: false, noNpmLock: true };

  const report = compareLocks(pnpm, npm);
  const missing = missingDeclarations(pnpm, npm, manifestsOf(layout.repoRoot, pnpm));
  return {
    ...report,
    ok: report.ok && missing.length === 0,
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

export { compareLocks, formatReport, missingDeclarations, readNpmLock, readPnpmLock };
export { stringifyJson, toJsonLines } from './json-notation.js';
