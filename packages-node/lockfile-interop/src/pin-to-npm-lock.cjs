'use strict';

/**
 * pnpm `readPackage` hook that makes pnpm resolve exactly what package-lock.json installs.
 *
 * package-lock.json is the committed lock (external tooling reads it, CI installs from it with `npm ci`).
 * pnpm cannot install from it: `pnpm import` re-resolves every range against the registry and picks the
 * newest match, so the derived pnpm lock drifts the moment a dependency publishes (measured: 22 declared
 * edges, e.g. `mocha ^10` -> pnpm 10.8.2 | npm 10.7.3). This hook removes that freedom: for every package
 * pnpm reads, each dependency range is replaced by the exact version npm's lock resolves for that same
 * edge (the requirer's own install path, walking up `node_modules` like Node does). Same input lock, same
 * pnpm tree, on any day.
 *
 * Only plain registry ranges are pinned; `link:`/`file:`/`workspace:`/`npm:` aliases/git specs and peer
 * dependencies stay as declared. A requirer whose copies in the npm lock resolve one dependency to
 * different versions keeps its range (it cannot be pinned without choosing one), and `stats()` counts it.
 *
 * Usage, in a `.pnpmfile.cjs` next to the package-lock.json it should follow:
 *   module.exports = require('<path>/pin-to-npm-lock.cjs').createHooks(__dirname);
 */
const fs = require('node:fs');
const path = require('node:path');

const PINNABLE = /^[\s\d^~<>=*xX.|-]+$|^[\^~]?\d/;
const SECTIONS = ['dependencies', 'optionalDependencies'];

/**
 * @param {string} key a package-lock `packages` key
 * @param {{ name?: string }} record
 */
function nameOf(key, record) {
  if (record.name) return record.name;
  const at = key.lastIndexOf('node_modules/');
  return at === -1 ? undefined : key.slice(at + 'node_modules/'.length);
}

/**
 * Resolve `dep` from install path `from` the way Node does: nearest `node_modules/dep` walking up.
 * @param {Record<string, any>} packages
 * @param {string} from
 * @param {string} dep
 */
function resolveFrom(packages, from, dep) {
  let dir = from;
  for (;;) {
    const candidate = dir ? `${dir}/node_modules/${dep}` : `node_modules/${dep}`;
    const record = packages[candidate];
    if (record) {
      if (record.link) return packages[record.resolved]?.version;
      return record.version;
    }
    if (!dir) return undefined;
    const parent = dir.lastIndexOf('/node_modules/');
    dir = parent === -1 ? '' : dir.slice(0, parent);
  }
}

/**
 * Build `name@version` (or the workspace member name) -> { dep: exact version } from a package-lock.
 * @param {string} lockFile
 */
function buildPins(lockFile) {
  const { packages = {} } = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  /** @type {Map<string, Map<string, string | null>>} */
  const pins = new Map();
  // npm records workspace members without a name; the root `node_modules/<name>` link names them.
  /** @type {Map<string, string>} */
  const memberNames = new Map();
  for (const [key, record] of Object.entries(packages)) {
    if (record.link && record.resolved) memberNames.set(record.resolved, nameOf(key, {}) ?? '');
  }
  for (const [key, record] of Object.entries(packages)) {
    if (record.link) continue;
    const isProject = key === '' || !key.includes('node_modules/');
    const name = isProject ? (record.name ?? memberNames.get(key)) : nameOf(key, record);
    if (!name) continue;
    const id = isProject ? `project:${name}` : `${name}@${record.version}`;
    const deps = {
      ...record.dependencies,
      ...record.optionalDependencies,
      ...(isProject ? record.devDependencies : {}),
    };
    let entry = pins.get(id);
    if (!entry) pins.set(id, (entry = new Map()));
    for (const dep of Object.keys(deps)) {
      const version = resolveFrom(packages, key, dep);
      if (!version) continue;
      const seen = entry.get(dep);
      if (seen === undefined) entry.set(dep, version);
      else if (seen !== version) entry.set(dep, null); // ambiguous across copies: leave the range
    }
  }
  return pins;
}

/**
 * @param {string} lockDir directory holding the package-lock.json to follow
 */
function createHooks(lockDir) {
  const lockFile = path.join(lockDir, 'package-lock.json');
  if (process.env.LOCKFILE_INTEROP_NO_PIN || !fs.existsSync(lockFile)) return { hooks: {} };
  const pins = buildPins(lockFile);
  const counters = { pinned: 0, ambiguous: 0 };

  /** @param {any} pkg */
  function readPackage(pkg) {
    const entry = pins.get(`project:${pkg.name}`) ?? pins.get(`${pkg.name}@${pkg.version}`);
    if (!entry) return pkg;
    const sections = pins.has(`project:${pkg.name}`) ? [...SECTIONS, 'devDependencies'] : SECTIONS;
    for (const section of sections) {
      const deps = pkg[section];
      if (!deps) continue;
      for (const [dep, range] of Object.entries(deps)) {
        if (typeof range !== 'string' || !PINNABLE.test(range.trim())) continue;
        const version = entry.get(dep);
        if (version === null) counters.ambiguous += 1;
        if (!version) continue;
        deps[dep] = version;
        counters.pinned += 1;
      }
    }
    return pkg;
  }

  return { hooks: { readPackage }, stats: () => ({ ...counters }) };
}

module.exports = { createHooks, buildPins, resolveFrom };
