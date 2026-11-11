// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { stringifyJson } from './json-notation.js';
import { baseKey, edgeVersion, isLocalLink, pnpmEdges, readPnpmLock, splitNameVersion } from './pnpm-lock.js';

/**
 * @typedef {object} GenerateOptions
 * @property {string} repoRoot
 * @property {string} [outFile] defaults to `<repoRoot>/package-lock.json`
 * @property {boolean} [dedupe] reuse one root-level copy per version instead of a copy per requirer
 */

/**
 * @typedef {object} GenerateResult
 * @property {number} entries
 * @property {number} duplicates
 * @property {number} rootEntries
 * @property {number} linkedEntries
 * @property {number} skippedLocalLinks
 */

/**
 * @typedef {object} Workspace
 * @property {string} dir
 * @property {string} name
 * @property {string} version
 */

/**
 * @param {string} repoRoot
 * @param {import('./pnpm-lock.js').PnpmLock} lock
 * @returns {Workspace[]}
 */
function readWorkspaces(repoRoot, lock) {
  /** @type {Workspace[]} */
  const workspaces = [];
  for (const dir of lock.importers.keys()) {
    const manifestPath = path.join(repoRoot, dir, 'package.json');
    if (dir !== '.' && fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      workspaces.push({ dir, name: manifest.name, version: manifest.version ?? '0.0.0' });
    }
  }
  return workspaces;
}

/**
 * Converts pnpm-lock.yaml into an installable package-lock.json (lockfileVersion 3).
 *
 * Placement rule: every package is written under the path of the package that requires it, with the root
 * project's own dependencies at the top level. Resolution walks up the tree, so every requirer finds its
 * exact version without re-implementing npm's hoisting — the price is a copy per requirer.
 *
 * @param {GenerateOptions} options
 * @returns {{ lock: Record<string, unknown>, result: GenerateResult }}
 */
export function generateNpmLock(options) {
  const { repoRoot } = options;
  const pnpm = readPnpmLock(repoRoot);
  const workspaces = readWorkspaces(repoRoot, pnpm);
  const workspaceByName = new Map(workspaces.map(workspace => [workspace.name, workspace]));

  /** @type {Record<string, any>} */
  const packages = {};
  const rootVersions = new Map();
  let duplicates = 0;
  let linkedEntries = 0;
  let skippedLocalLinks = 0;

  /**
   * @param {string} dir
   * @param {('dependencies'|'devDependencies')[]} fields
   * @returns {Record<string, string>}
   */
  const declaredRanges = (dir, fields) => {
    const importer = pnpm.importers.get(dir);
    /** @type {Record<string, string>} */
    const out = {};
    for (const field of fields) {
      for (const [name, spec] of importer?.[field] ?? []) {
        if (isLocalLink(spec.specifier)) {
          const local = workspaceByName.get(name);
          out[name] = local ? `^${local.version}` : spec.specifier;
        } else {
          out[name] = spec.specifier;
        }
      }
    }
    return out;
  };

  /**
   * Places `name@version` at `<prefix>node_modules/<name>` and recurses into its resolved dependencies.
   *
   * `resolvable` is what a requirer at `prefix` can already reach by walking up the tree: the repo-root
   * copies plus whatever every ancestor directory placed. A dependency that is already in there is not
   * copied — npm's tree truncates exactly those edges, and a cyclic edge is the special case where the
   * ancestor is the package itself. Both matter: copying a cycle never terminates, and copying every shared
   * leaf is what turns a real lock into an explosion (`es-errors` alone is reached from thousands of
   * requirers) that then overflows the serializer.
   *
   * @param {string} prefix
   * @param {string} nameVersion
   * @param {Set<string>} resolvable `name@version` reachable from `prefix` by walking up
   * @returns {void}
   */
  const place = (prefix, nameVersion, resolvable) => {
    const [name, version] = splitNameVersion(nameVersion);
    const key = `${prefix}node_modules/${name}`;
    if (packages[key]) return;
    if (options.dedupe && prefix) {
      if (rootVersions.get(name) === version) return;
      if (rootVersions.has(name)) duplicates += 1;
    }

    const record = pnpm.packages.get(baseKey(nameVersion));
    /** @type {Record<string, unknown>} */
    const entry = {
      version,
      resolved: record?.tarball ?? `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`,
    };
    if (record?.integrity) entry.integrity = record.integrity;
    if (record?.engines) entry.engines = record.engines;

    const edges = pnpmEdges(pnpm, baseKey(nameVersion));
    /** @type {Record<string, string>} */
    const dependencies = {};
    /** @type {Array<[string, string]>} */
    const localEdges = [];
    for (const [dep, depVersion] of [...edges].sort(([a], [b]) => a.localeCompare(b))) {
      if (isLocalLink(depVersion)) {
        localEdges.push([dep, depVersion]);
      } else {
        dependencies[dep] = depVersion;
      }
    }
    if (Object.keys(dependencies).length) entry.dependencies = dependencies;

    packages[key] = entry;
    if (!prefix) rootVersions.set(name, version);

    for (const [dep, linkTarget] of localEdges) {
      // resolution reaches a workspace member through its own root link entry, so it needs no copy here
      if (workspaceByName.has(dep)) {
        skippedLocalLinks += 1;
      } else {
        const linkKey = `${key}/node_modules/${dep}`;
        if (!packages[linkKey]) {
          packages[linkKey] = { resolved: linkTarget.split(':').slice(1).join(':'), link: true };
          linkedEntries += 1;
        }
      }
    }

    // this package's dependencies land in `${key}/node_modules`, and from there resolution also reaches
    // everything in `resolvable` plus their siblings in this directory
    const scope = new Set(resolvable);
    scope.add(baseKey(nameVersion));
    for (const dep of Object.keys(dependencies)) scope.add(`${dep}@${dependencies[dep]}`);
    for (const [dep, depVersion] of Object.entries(dependencies)) {
      const childId = `${dep}@${depVersion}`;
      // a dependency the requirer already reaches up the tree is not copied below it
      if (!resolvable.has(childId)) place(`${key}/`, childId, scope);
    }
  };

  // the root project first: its own dependencies occupy the top-level node_modules
  const rootImporter = pnpm.importers.get('.');
  /** @type {Record<string, unknown>} */
  const rootManifest = { name: 'root', version: '0.0.0' };
  /** @type {string[]} */
  const rootIds = [];
  for (const field of /** @type {const} */ (['dependencies', 'devDependencies'])) {
    const ranges = declaredRanges('.', [field]);
    if (Object.keys(ranges).length) rootManifest[field] = ranges;
    for (const [name, spec] of rootImporter?.[field] ?? []) {
      if (isLocalLink(spec.version)) {
        if (!workspaceByName.has(name)) {
          packages[`node_modules/${name}`] = {
            resolved: spec.version.split(':').slice(1).join(':'),
            link: true,
          };
          linkedEntries += 1;
        }
      } else {
        rootIds.push(`${name}@${edgeVersion(spec.version)}`);
      }
    }
  }
  // the root copies are reachable from every requirer in the install, so a nested requirer reuses them
  const rootVisible = new Set(rootIds);
  for (const id of rootIds) place('', id, rootVisible);
  packages[''] = rootManifest;

  for (const workspace of workspaces) {
    /** @type {Record<string, unknown>} */
    const manifest = { name: workspace.name, version: workspace.version };
    const dependencies = declaredRanges(workspace.dir, ['dependencies']);
    const devDependencies = declaredRanges(workspace.dir, ['devDependencies']);
    if (Object.keys(dependencies).length) manifest.dependencies = dependencies;
    if (Object.keys(devDependencies).length) manifest.devDependencies = devDependencies;
    packages[workspace.dir] = manifest;
    packages[`node_modules/${workspace.name}`] = { resolved: workspace.dir, link: true };

    /** @type {string[]} */
    const workspaceIds = [];
    for (const field of /** @type {const} */ (['dependencies', 'devDependencies'])) {
      for (const [name, spec] of pnpm.importers.get(workspace.dir)?.[field] ?? []) {
        if (isLocalLink(spec.version)) {
          if (workspaceByName.has(name)) {
            skippedLocalLinks += 1;
          } else {
            const linkKey = `${workspace.dir}/node_modules/${name}`;
            if (!packages[linkKey]) {
              packages[linkKey] = {
                resolved: spec.version.split(':').slice(1).join(':'),
                link: true,
              };
              linkedEntries += 1;
            }
          }
        } else {
          workspaceIds.push(`${name}@${edgeVersion(spec.version)}`);
        }
      }
    }
    // a workspace requirer walks up to the repo-root node_modules as well as its own
    const resolvable = new Set([...rootVisible, ...workspaceIds]);
    for (const id of workspaceIds) place(`${workspace.dir}/`, id, resolvable);
  }

  /** @type {Record<string, any>} */
  const sorted = {};
  for (const key of Object.keys(packages).sort()) sorted[key] = packages[key];
  const lock = {
    name: 'root',
    version: '0.0.0',
    lockfileVersion: 3,
    requires: true,
    packages: sorted,
  };

  return {
    lock,
    result: {
      entries: Object.keys(sorted).length,
      duplicates,
      rootEntries: Object.keys(sorted).filter(key => key.startsWith('node_modules/')).length,
      linkedEntries,
      skippedLocalLinks,
    },
  };
}

/**
 * @param {GenerateOptions} options
 * @returns {GenerateResult}
 */
export function writeNpmLock(options) {
  const { lock, result } = generateNpmLock(options);
  const outFile = options.outFile ?? path.join(options.repoRoot, 'package-lock.json');
  fs.writeFileSync(outFile, stringifyJson(lock));
  return result;
}
