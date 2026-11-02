// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

/**
 * @typedef {object} DependencySpec
 * @property {string} specifier the range as written in package.json
 * @property {string} version the resolved version, or a `link:`/`file:` reference
 */

/**
 * @typedef {object} Importer
 * @property {Map<string, DependencySpec>} dependencies
 * @property {Map<string, DependencySpec>} devDependencies
 */

/**
 * @typedef {object} PackageRecord
 * @property {string} [integrity]
 * @property {string} [tarball]
 * @property {Record<string, string>} [engines]
 */

/**
 * @typedef {object} SnapshotRecord
 * @property {Map<string, string>} dependencies
 * @property {Map<string, string>} optionalDependencies
 */

/**
 * The pnpm lockfile, normalised: `packages` is keyed by `name@version`, `snapshots` may carry peer
 * suffixes in its key.
 *
 * @typedef {object} PnpmLock
 * @property {Map<string, Importer>} importers
 * @property {Map<string, PackageRecord>} packages
 * @property {Map<string, SnapshotRecord>} snapshots
 */

/**
 * `@scope/pkg@1.2.3` / `pkg@1.2.3` -> `['@scope/pkg', '1.2.3']`
 *
 * @param {string} nameVersion
 * @returns {[string, string]}
 */
export function splitNameVersion(nameVersion) {
  const at = nameVersion.lastIndexOf('@');
  return [nameVersion.slice(0, at), nameVersion.slice(at + 1)];
}

/**
 * pnpm v9 snapshot keys look like `pkg@1.2.3(peer@4.5.6)`; strip the peer suffix.
 *
 * @param {string} key
 * @returns {string}
 */
export function baseKey(key) {
  return key.split('(')[0];
}

/**
 * Snapshot edge value -> resolved version. Values are `1.2.3`, `1.2.3(peer@x)` or `/pkg@1.2.3(peer@x)`.
 *
 * @param {string} value
 * @returns {string}
 */
export function edgeVersion(value) {
  const bare = value.startsWith('/') ? value.slice(1).split('(')[0] : value.split('(')[0];
  if (value.startsWith('/')) return bare.slice(bare.lastIndexOf('@') + 1);
  return bare;
}

/**
 * True for the specifier/version forms that mean "a local directory", not a registry package.
 *
 * @param {string} value
 * @returns {boolean}
 */
export function isLocalLink(value) {
  return /^(link|file|workspace):/.test(value);
}

/**
 * @param {Record<string, DependencySpec>|undefined} input
 * @returns {Map<string, DependencySpec>}
 */
function toMap(input) {
  return new Map(Object.entries(input ?? {}));
}

/**
 * @param {string} repoRoot
 * @param {string} [lockFileName]
 * @returns {PnpmLock}
 */
export function readPnpmLock(repoRoot, lockFileName = 'pnpm-lock.yaml') {
  const lockPath = path.join(repoRoot, lockFileName);
  if (!fs.existsSync(lockPath)) {
    throw new Error(
      `no ${lockFileName} in ${repoRoot} — run pnpm install (or pnpm install --lockfile-only) first`,
    );
  }
  const raw = parse(fs.readFileSync(lockPath, 'utf8'));

  /** @type {Map<string, Importer>} */
  const importers = new Map();
  for (const [dir, importer] of Object.entries(raw.importers ?? {})) {
    importers.set(dir, {
      dependencies: toMap(importer.dependencies),
      devDependencies: toMap(importer.devDependencies),
    });
  }

  /** @type {Map<string, PackageRecord>} */
  const packages = new Map();
  for (const [key, value] of Object.entries(raw.packages ?? {})) {
    const record = value ?? {};
    const resolution = record.resolution ?? {};
    packages.set(key, {
      integrity: resolution.integrity,
      tarball: resolution.tarball,
      engines: record.engines,
    });
  }

  /** @type {Map<string, SnapshotRecord>} */
  const snapshots = new Map();
  for (const [key, value] of Object.entries(raw.snapshots ?? {})) {
    const record = value ?? {};
    snapshots.set(key, {
      dependencies: new Map(Object.entries(record.dependencies ?? {})),
      optionalDependencies: new Map(Object.entries(record.optionalDependencies ?? {})),
    });
  }

  return { importers, packages, snapshots };
}

/**
 * The set of `name@version` records the lock resolves, from package records plus importer-declared
 * versions.
 *
 * @param {PnpmLock} lock
 * @returns {Set<string>}
 */
export function pnpmVersionSet(lock) {
  /** @type {Set<string>} */
  const set = new Set();
  for (const key of lock.packages.keys()) set.add(baseKey(key));
  for (const importer of lock.importers.values()) {
    for (const [name, spec] of [...importer.dependencies, ...importer.devDependencies]) {
      // importer versions can carry peer suffixes too (`7.29.7(@babel/core@7.29.7)`); link: is not a version
      if (!isLocalLink(spec.version)) set.add(`${name}@${edgeVersion(spec.version)}`);
    }
  }
  return set;
}

/**
 * Resolved dependencies of one package record, keyed by dependency name -> version.
 *
 * @param {PnpmLock} lock
 * @param {string} nameVersion
 * @returns {Map<string, string>}
 */
export function pnpmEdges(lock, nameVersion) {
  const key = lock.snapshots.has(nameVersion)
    ? nameVersion
    : [...lock.snapshots.keys()].find(candidate => baseKey(candidate) === nameVersion);
  const snapshot = key ? lock.snapshots.get(key) : undefined;
  /** @type {Map<string, string>} */
  const edges = new Map();
  if (!snapshot) return edges;
  for (const map of [snapshot.dependencies, snapshot.optionalDependencies]) {
    for (const [dep, value] of map) edges.set(dep, edgeVersion(value));
  }
  return edges;
}
