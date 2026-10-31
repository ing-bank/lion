/**
 * Fixture builders for the dependency-surface lint.
 *
 * Lock-shaped fixtures are generated into a temp dir at test time and never committed: committed mock
 * locks read as real dependencies to external scanners. Every record used here is a *real* registry
 * package with its real version and sha512, lifted out of this repo's own package-lock.json, with only
 * the fields the lint reads (`dependencies`, `hasInstallScript`, `os`) written over the top.
 */
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoLock = JSON.parse(
  readFileSync(path.resolve(fileURLToPath(import.meta.url), '../../../package-lock.json'), 'utf8'),
);

/**
 * A real lock record for `name@version`, deep-cloned, from this repo's own lock.
 *
 * @param {string} name
 * @param {string} [version] pin a specific copy when the lock holds several
 * @returns {any}
 */
export function realRecord(name, version) {
  const key =
    Object.keys(repoLock.packages).find(candidate => {
      const packageName = candidate.split('node_modules/').slice(-1)[0];
      if (packageName !== name || repoLock.packages[candidate].link) {
        return false;
      }
      return version ? repoLock.packages[candidate].version === version : true;
    }) || null;
  if (!key) {
    throw new Error(
      `no real lock record for ${name}${version ? `@${version}` : ''} to build a fixture from`,
    );
  }
  return JSON.parse(JSON.stringify(repoLock.packages[key]));
}

/**
 * A real record with the shape a test needs written over it: `dependencies` (replaces the real ones),
 * `hasInstallScript` and `os` are exactly the fields the lint reads.
 *
 * @param {string} name
 * @param {any} [overrides]
 * @param {string} [version]
 * @returns {any}
 */
export function recordWith(name, overrides, version) {
  const record = realRecord(name, version);
  for (const [field, value] of Object.entries(overrides || {})) {
    if (value === undefined) {
      delete record[field];
    } else {
      record[field] = value;
    }
  }
  return record;
}

/**
 * Write a throwaway repo: `package-lock.json` plus one `package.json` per given manifest.
 * Returns the root dir; callers clean up with `cleanupFixture`.
 *
 * @param {object} options
 * @param {Record<string, any>} options.entries `packages` map of the lock
 * @param {Record<string, any>} options.manifests manifest path (relative) -> parsed package.json
 * @param {string[]} [options.workspaces]
 * @param {any} [options.dependencySurface] root manifest's `dependencySurface` (the allowlist)
 * @returns {string}
 */
export function writeFixture({
  entries,
  manifests,
  workspaces = ['packages/*'],
  dependencySurface,
}) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'lion-dependency-surface-'));
  const rootManifest = manifests['package.json'] || {
    name: 'fixture-root',
    version: '0.0.0',
    private: true,
    workspaces,
  };
  if (dependencySurface) {
    rootManifest.dependencySurface = dependencySurface;
  }
  writeFileSync(path.join(dir, 'package.json'), `${JSON.stringify(rootManifest, null, 2)}\n`);
  for (const [manifestPath, pkg] of Object.entries(manifests)) {
    if (manifestPath !== 'package.json') {
      mkdirSync(path.join(dir, path.dirname(manifestPath)), { recursive: true });
      writeFileSync(path.join(dir, manifestPath), `${JSON.stringify(pkg, null, 2)}\n`);
    }
  }
  const lock = {
    name: rootManifest.name,
    version: rootManifest.version,
    lockfileVersion: 3,
    requires: true,
    packages: {
      '': {
        name: rootManifest.name,
        version: rootManifest.version,
        workspaces,
      },
      ...entries,
    },
  };
  writeFileSync(path.join(dir, 'package-lock.json'), `${JSON.stringify(lock, null, 2)}\n`);
  return dir;
}

/**
 * @param {string} dir
 */
export function cleanupFixture(dir) {
  rmSync(dir, { recursive: true, force: true });
}
