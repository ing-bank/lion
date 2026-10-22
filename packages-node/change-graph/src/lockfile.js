/* eslint-disable no-continue */ // entry comparison reads more clearly with early exits
/**
 * The lockfile layer: which dependencies were *updated*, so their importers can be selected.
 *
 * Only semantic fields count (`version`, `resolved`, `integrity`). npm rewrites the `dev` and
 * `devOptional` flags of hundreds of entries on a single install, which says nothing about what any
 * test consumes; treating those as changes would mean a full run on every lock touch.
 *
 * Both lockfiles are supported: `package-lock.json` (npm, including workspaces) and `pnpm-lock.yaml`
 * (pnpm v9 layout: `importers`, `packages`, `snapshots`), because this tool is also meant for repos
 * that install with pnpm.
 */
import { parse as parseYaml } from 'yaml';

/** The fields that make a lockfile entry a different dependency. */
export const SEMANTIC_LOCK_FIELDS = ['version', 'resolved', 'integrity', 'resolution'];

/**
 * The package name of a lockfile entry key.
 *
 * - npm: `node_modules/@scope/name`, `node_modules/@scope/name/node_modules/other` ->
 *   `@scope/name`, `other`
 * - pnpm: `@scope/name@1.2.3`, `/@scope/name@1.2.3`, `@scope/name@1.2.3(peer@1)` -> `@scope/name`
 *
 * @param {string} key
 * @returns {string}
 */
export function packageNameOfLockKey(key) {
  let rest = key;
  if (rest.startsWith('node_modules/')) {
    rest = rest.slice('node_modules/'.length);
  }
  const nested = rest.lastIndexOf('node_modules/');
  if (nested !== -1) {
    rest = rest.slice(nested + 'node_modules/'.length);
  }
  rest = rest.replace(/^\//, '');
  if (rest.startsWith('@')) {
    const [scope, name] = rest.split('/');
    return `${scope}/${(name ?? '').split('@')[0]}`;
  }
  return rest.split('@')[0];
}

/**
 * The semantically changed entries of an npm lockfile, as a set of package names.
 *
 * @param {any} before a parsed package-lock.json
 * @param {any} after a parsed package-lock.json
 * @returns {Map<string, string>} package name -> why it changed
 */
export function changedNpmPackages(before, after) {
  /** @type {Map<string, string>} */
  const changed = new Map();
  const beforePackages = before?.packages ?? {};
  const afterPackages = after?.packages ?? {};

  for (const key of Object.keys(afterPackages)) {
    const name = packageNameOfLockKey(key);
    if (!name) {
      continue;
    }
    const previous = beforePackages[key];
    const current = afterPackages[key];
    if (!previous) {
      changed.set(name, `${key} added`);
      continue;
    }
    for (const field of SEMANTIC_LOCK_FIELDS) {
      if (previous[field] !== undefined && previous[field] !== current[field]) {
        changed.set(name, `${name}: ${field} ${previous[field]} -> ${current[field]}`);
        break;
      }
    }
  }
  for (const key of Object.keys(beforePackages)) {
    if (afterPackages[key]) {
      continue;
    }
    const name = packageNameOfLockKey(key);
    if (name && !changed.has(name)) {
      changed.set(name, `${key} removed`);
    }
  }
  return changed;
}

/**
 * The semantically changed entries of a pnpm lockfile (v9), as a set of package names.
 *
 * @param {any} before a parsed pnpm-lock.yaml
 * @param {any} after a parsed pnpm-lock.yaml
 * @returns {Map<string, string>} package name -> why it changed
 */
export function changedPnpmPackages(before, after) {
  /** @type {Map<string, string>} */
  const changed = new Map();
  const sections = ['packages', 'snapshots'];
  for (const section of sections) {
    const beforeSection = before?.[section] ?? {};
    const afterSection = after?.[section] ?? {};
    for (const key of Object.keys(afterSection)) {
      const name = packageNameOfLockKey(key);
      if (!name || changed.has(name)) {
        continue;
      }
      const previous = beforeSection[key];
      const current = afterSection[key];
      if (!previous) {
        changed.set(name, `${section}.${key} added`);
        continue;
      }
      for (const field of SEMANTIC_LOCK_FIELDS) {
        if (previous[field] !== undefined && previous[field] !== current[field]) {
          changed.set(name, `${name}: ${field} ${previous[field]} -> ${current[field]}`);
          break;
        }
      }
      if (
        !changed.has(name) &&
        JSON.stringify(previous.dependencies ?? {}) !== JSON.stringify(current.dependencies ?? {})
      ) {
        changed.set(name, `${name}: dependencies changed`);
      }
    }
  }
  return changed;
}

/**
 * @param {string} file the lockfile name
 * @returns {'npm' | 'pnpm' | ''}
 */
export function lockfileFlavour(file) {
  if (file.endsWith('package-lock.json') || file.endsWith('npm-shrinkwrap.json')) {
    return 'npm';
  }
  if (file.endsWith('pnpm-lock.yaml') || file.endsWith('pnpm-lock.yml')) {
    return 'pnpm';
  }
  return '';
}

/**
 * @param {string} flavour
 * @param {string} before the content at the base revision
 * @param {string} after the content in the working tree
 * @returns {Map<string, string>}
 */
export function changedPackagesInLockfile(flavour, before, after) {
  try {
    if (flavour === 'npm') {
      return changedNpmPackages(JSON.parse(before || '{}'), JSON.parse(after || '{}'));
    }
    if (flavour === 'pnpm') {
      return changedPnpmPackages(parseYaml(before || '{}'), parseYaml(after || '{}'));
    }
  } catch (error) {
    throw new Error(
      `could not read the lockfile: ${error instanceof Error ? error.message : error}`,
    );
  }
  return new Map();
}
