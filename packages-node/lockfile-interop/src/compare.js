// @ts-check
import { entryName, npmEdges, npmVersionSet } from './npm-lock.js';
import { edgeVersion, isLocalLink, pnpmVersionSet } from './pnpm-lock.js';

/**
 * @typedef {object} VersionMismatch
 * @property {string} name
 * @property {string[]} pnpm
 * @property {string[]} npm
 */

/**
 * @typedef {object} DriftReport
 * @property {boolean} ok
 * @property {VersionMismatch[]} versionMismatches packages resolving to different versions in the two locks
 * @property {string[]} onlyPnpm `name@version` in the pnpm lock but not in the npm lock
 * @property {string[]} onlyNpm `name@version` in the npm lock but not in the pnpm lock
 * @property {number} pnpmRecords
 * @property {number} npmRecords
 */

/**
 * @param {Set<string>} set
 * @returns {Map<string, string[]>}
 */
function groupByName(set) {
  /** @type {Map<string, string[]>} */
  const grouped = new Map();
  for (const id of set) {
    const at = id.lastIndexOf('@');
    const name = id.slice(0, at);
    const version = id.slice(at + 1);
    grouped.set(name, [...(grouped.get(name) ?? []), version].sort());
  }
  return grouped;
}

/**
 * @typedef {object} DeclaredDriftEntry
 * @property {string} dir workspace dir the manifest belongs to
 * @property {string} name dependency name as declared
 * @property {string} resolved the version pnpm installs for that range
 * @property {string|null} npmVersion the version the npm lock installs for that same edge, null when absent
 */

/**
 * The version the committed npm lock installs for one workspace member's dependency: either a copy nested
 * under that member's install path or the hoisted one at the root. Comparing against *some* version of the
 * name (the first version of this check) is blind exactly where it matters - npm's lock records several
 * versions of a name, and `@mdjs/mdjs-preview` is the case that proved it: pnpm resolved the root's
 * `^0.6.0` edge to 0.5.9 while the npm lock had 0.5.9 (transitively) and 0.6.0 (for that very edge), so the
 * loose rule reported no drift and the repo's `patches/@mdjs+mdjs-preview+0.6.0.patch` then failed to apply.
 *
 * @param {import('./npm-lock.js').NpmLock} npm
 * @param {string} dir importer dir, `.` for the root
 * @param {string} name
 * @returns {string|null}
 */
export function npmResolutionFor(npm, dir, name) {
  // npm keys a workspace member's own deps under the member directory (`packages/ui/node_modules/<dep>`);
  // what it did not nest lives hoisted at the root.
  const atMember = npmEdges(npm, dir === '.' ? '' : dir).get(name);
  if (atMember) return atMember;
  if (dir === '.') return null;
  return npmEdges(npm, '').get(name) ?? null;
}

/**
 * The mode the hybrid really runs in: pnpm installs *from* the committed npm lock (`pnpm import`), so the
 * npm lock keeps duplicate versions npm's tree placement needs while pnpm dedupes them. Comparing the full
 * record sets then reports drift that cannot be removed - measured on this repo: 50 npm-only records
 * (`@babel/parser@7.29.0`, `@babel/parser@7.29.2`, ... - tails for other requirers) and 54 version-set
 * differences.
 *
 * So this compares what a manifest declares, edge by edge, against the version the npm lock installs for
 * that same edge. A `pnpm install`/`pnpm add` that resolved something else fails here - which is the drift
 * that matters: tooling reading package-lock.json decides on a version the install never loads, and patches
 * written against one version stop applying to the other.
 *
 * @param {import('./pnpm-lock.js').PnpmLock} pnpm
 * @param {import('./npm-lock.js').NpmLock} npm
 * @param {Map<string, Set<string>>} manifests importer dir -> declared dependency names
 * @returns {DeclaredDriftEntry[]}
 */
export function declaredDrift(pnpm, npm, manifests) {
  /** @type {DeclaredDriftEntry[]} */
  const drift = [];
  for (const [dir, names] of manifests) {
    const importer = pnpm.importers.get(dir);
    // a manifest without an importer is reported by missingDeclarations, not here
    if (importer) {
      for (const name of names) {
        const spec = importer.dependencies.get(name) ?? importer.devDependencies.get(name);
        const resolved = spec && !isLocalLink(spec.version) ? edgeVersion(spec.version) : undefined;
        if (resolved) {
          const npmVersion = npmResolutionFor(npm, dir, name);
          if (npmVersion !== resolved) {
            drift.push({ dir, name, resolved, npmVersion });
          }
        }
      }
    }
  }
  return drift.sort((a, b) => a.name.localeCompare(b.name) || a.dir.localeCompare(b.dir));
}

/**
 * Compares the version sets of both locks.
 *
 * A missing record in either direction is drift: it means the tooling that reads package-lock.json
 * derives versions that pnpm does not install (or vice versa). Version differences per package name are
 * reported separately so the failure names the packages to reconcile.
 *
 * @param {import('./pnpm-lock.js').PnpmLock} pnpm
 * @param {import('./npm-lock.js').NpmLock} npm
 * @returns {DriftReport}
 */
export function compareLocks(pnpm, npm) {
  const pnpmSet = pnpmVersionSet(pnpm);
  const npmSet = npmVersionSet(npm);
  const onlyPnpm = [...pnpmSet].filter(id => !npmSet.has(id)).sort();
  const onlyNpm = [...npmSet].filter(id => !pnpmSet.has(id)).sort();

  const pnpmByName = groupByName(pnpmSet);
  const npmByName = groupByName(npmSet);
  /** @type {VersionMismatch[]} */
  const versionMismatches = [];
  for (const [name, pnpmVersions] of pnpmByName) {
    const npmVersions = npmByName.get(name) ?? [];
    if (npmVersions.length && pnpmVersions.join(',') !== npmVersions.join(',')) {
      versionMismatches.push({ name, pnpm: pnpmVersions, npm: npmVersions });
    }
  }
  versionMismatches.sort((a, b) => a.name.localeCompare(b.name));

  return {
    ok: onlyPnpm.length === 0 && onlyNpm.length === 0 && versionMismatches.length === 0,
    versionMismatches,
    onlyPnpm,
    onlyNpm,
    pnpmRecords: pnpmSet.size,
    npmRecords: npmSet.size,
  };
}

/**
 * Every dependency a workspace manifest declares must be present in the lock. Catches the case where a
 * dependency was added to a package.json and the committed lock was not regenerated, which a pure
 * version-set comparison can miss when the name is already installed for another project.
 *
 * @param {import('./pnpm-lock.js').PnpmLock} pnpm
 * @param {import('./npm-lock.js').NpmLock} npm
 * @param {Map<string, Set<string>>} manifests importer dir -> declared dependency names
 * @returns {string[]}
 */
export function missingDeclarations(pnpm, npm, manifests) {
  /** @type {Set<string>} */
  const have = new Set();
  for (const [lockPath, entry] of npm.packages) {
    if (entry.version && !entry.link && lockPath.includes('node_modules/'))
      have.add(entryName(lockPath));
  }
  /** @type {string[]} */
  const missing = [];
  for (const [dir, names] of manifests) {
    const importer = pnpm.importers.get(dir);
    for (const name of names) {
      const spec = importer?.dependencies.get(name) ?? importer?.devDependencies.get(name);
      if (!spec) {
        missing.push(`${dir}: ${name} declared in package.json but absent from the pnpm lock`);
      } else if (!have.has(name) && !/^(link|file|workspace):/.test(spec.version)) {
        missing.push(
          `${dir}: ${name}@${spec.version} is not installed by the committed package-lock.json`,
        );
      }
    }
  }
  return missing.sort();
}

/**
 * @param {DriftReport & {
 *   declared?: import('./compare.js').DeclaredDriftEntry[],
 *   overrides?: import('./overrides.js').OverrideDriftEntry[],
 * }} report
 * @returns {string}
 */
export function formatReport(report) {
  const summary = `pnpm-lock records: ${report.pnpmRecords}, package-lock records: ${report.npmRecords}`;
  const declared = report.declared ?? [];
  const overrides = report.overrides ?? [];
  if (report.ok) return `${summary}\nno drift: both locks resolve the same versions`;

  /** @type {string[]} */
  const lines = [summary, ''];
  if (overrides.length) {
    lines.push(
      `overrides that package.json (npm) and pnpm-workspace.yaml (pnpm) do not spell the same (${overrides.length}):`,
    );
    for (const entry of overrides) {
      lines.push(
        `  ${entry.selector}: npm ${entry.npm ?? '(absent)'} | pnpm ${entry.pnpm ?? '(absent)'}`,
      );
    }
  }
  if (declared.length) {
    lines.push(
      `declared dependencies pnpm installs at a version the npm lock does not record (${declared.length}):`,
    );
    for (const entry of declared.slice(0, 25)) {
      lines.push(
        `  ${entry.dir}: ${entry.name} -> pnpm ${entry.resolved} | npm ${entry.npmVersion ?? '(absent)'}`,
      );
    }
    if (declared.length > 25) lines.push(`  ... ${declared.length - 25} more`);
  }
  if (report.onlyPnpm.length) {
    lines.push(`only in pnpm-lock.yaml (${report.onlyPnpm.length}):`);
    lines.push(...report.onlyPnpm.slice(0, 25).map(id => `  ${id}`));
    if (report.onlyPnpm.length > 25) lines.push(`  ... ${report.onlyPnpm.length - 25} more`);
  }
  if (report.onlyNpm.length) {
    lines.push(`only in package-lock.json (${report.onlyNpm.length}):`);
    lines.push(...report.onlyNpm.slice(0, 25).map(id => `  ${id}`));
    if (report.onlyNpm.length > 25) lines.push(`  ... ${report.onlyNpm.length - 25} more`);
  }
  if (report.versionMismatches.length) {
    lines.push(`different versions (${report.versionMismatches.length}):`);
    for (const mismatch of report.versionMismatches.slice(0, 25)) {
      lines.push(
        `  ${mismatch.name}: pnpm ${mismatch.pnpm.join(', ')} | npm ${mismatch.npm.join(', ')}`,
      );
    }
    if (report.versionMismatches.length > 25) {
      lines.push(`  ... ${report.versionMismatches.length - 25} more`);
    }
  }
  return lines.join('\n');
}
