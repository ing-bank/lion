// @ts-check
import { entryName, npmVersionSet } from './npm-lock.js';
import { pnpmVersionSet } from './pnpm-lock.js';

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
 * @param {DriftReport} report
 * @returns {string}
 */
export function formatReport(report) {
  const summary = `pnpm-lock records: ${report.pnpmRecords}, package-lock records: ${report.npmRecords}`;
  if (report.ok) return `${summary}\nno drift: both locks resolve the same versions`;

  /** @type {string[]} */
  const lines = [summary, ''];
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
