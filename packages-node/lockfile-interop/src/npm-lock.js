// @ts-check
import fs from 'node:fs';
import path from 'node:path';

/**
 * @typedef {object} NpmLockEntry
 * @property {string} [version]
 * @property {string} [resolved]
 * @property {string} [integrity]
 * @property {boolean} [link]
 * @property {string} [name]
 * @property {Record<string, string>} [dependencies]
 * @property {Record<string, string>} [devDependencies]
 * @property {Record<string, string>} [optionalDependencies]
 */

/**
 * @typedef {object} NpmLock
 * @property {number} lockfileVersion
 * @property {Map<string, NpmLockEntry>} packages lock path (`''`, `packages/ui`, `node_modules/x`) -> entry
 */

/**
 * @param {string} repoRoot
 * @param {string} [lockFileName]
 * @returns {NpmLock|null} null when the repo has no npm lock
 */
export function readNpmLock(repoRoot, lockFileName = 'package-lock.json') {
  const lockPath = path.join(repoRoot, lockFileName);
  if (!fs.existsSync(lockPath)) return null;
  const raw = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  return {
    lockfileVersion: raw.lockfileVersion ?? 0,
    packages: new Map(Object.entries(raw.packages ?? {})),
  };
}

/**
 * Package name of a lock path: the last `node_modules/<name>` segment, or the workspace dir itself.
 *
 * @param {string} lockPath
 * @returns {string}
 */
export function entryName(lockPath) {
  const idx = lockPath.lastIndexOf('node_modules/');
  if (idx === -1) return lockPath; // a workspace project dir such as `packages/ui`
  return lockPath.slice(idx + 'node_modules/'.length);
}

/**
 * The set of `name@version` records the lock installs (links excluded: they carry no version).
 *
 * @param {NpmLock} lock
 * @returns {Set<string>}
 */
export function npmVersionSet(lock) {
  /** @type {Set<string>} */
  const set = new Set();
  for (const [lockPath, entry] of lock.packages) {
    // workspace project entries (no `node_modules/` in the path) repeat declared ranges, not installs
    const installs = entry.version && !entry.link && lockPath.includes('node_modules/');
    if (installs) set.add(`${entryName(lockPath)}@${entry.version}`);
  }
  return set;
}

/**
 * Resolved dependency name -> version at one lock path, derived from the entries below it.
 *
 * @param {NpmLock} lock
 * @param {string} lockPath
 * @returns {Map<string, string>}
 */
export function npmEdges(lock, lockPath) {
  const prefix = lockPath === '' ? 'node_modules/' : `${lockPath}/node_modules/`;
  /** @type {Map<string, string>} */
  const edges = new Map();
  for (const [key, entry] of lock.packages) {
    const rest = key.startsWith(prefix) ? key.slice(prefix.length) : null;
    // a direct child of this path, not a nested copy and not a link entry
    const direct =
      rest !== null && !rest.includes('/node_modules/') && !entry.link && entry.version;
    if (direct) edges.set(rest, entry.version);
  }
  return edges;
}
