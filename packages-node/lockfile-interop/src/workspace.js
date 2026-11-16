// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { parse, stringify } from 'yaml';
import { flattenNpmOverrides, readNpmOverrides, readPnpmOverrides } from './overrides.js';

/**
 * Generate pnpm-workspace.yaml from package.json, so the second config file does not have to be maintained
 * by hand.
 *
 * The file exists because pnpm cannot read two things npm keeps in package.json: the `workspaces` member list
 * and the `overrides` (different spelling, measured: pnpm silently resolves without them). Both have an npm
 * spelling that is the source of truth here - npm still produces the lock external tooling reads - so the
 * pnpm side is derived from it. Everything pnpm-only (today `onlyBuiltDependencies`, the pnpm 10 build-script
 * allowlist) is not touched: it has no npm counterpart to derive from.
 *
 * `check` stays the gate; this command is how you satisfy it without editing yaml by hand. In CI, run it
 * without `--write`: it exits 1 when the committed file is not what package.json implies.
 */

const HEADER = `# Generated from package.json by \`pnpm run repo:workspace:sync\` (@lion/lockfile-interop).
#
# Edit package.json - the \`workspaces\` field and \`overrides\` - and re-run the sync: npm's spelling is the
# source of truth (it produces the lock external tooling reads), and the gate (\`pnpm run repo:lockfile:check\`)
# fails when the two files do not spell the same overrides.
#
# Keys without an npm counterpart (only pnpm reads them) are preserved as written.
`;

/**
 * @param {string} repoRoot
 * @returns {{ text: string, changed: boolean, members: string[], overrides: string[] }}
 */
export function renderPnpmWorkspace(repoRoot) {
  const manifestPath = path.join(repoRoot, 'package.json');
  if (!fs.existsSync(manifestPath)) throw new Error(`no package.json in ${repoRoot}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const members = manifest.workspaces ?? [];
  const overrides = Object.fromEntries(flattenNpmOverrides(manifest.overrides));

  const workspacePath = path.join(repoRoot, 'pnpm-workspace.yaml');
  const current = fs.existsSync(workspacePath)
    ? (parse(fs.readFileSync(workspacePath, 'utf8')) ?? {})
    : {};
  // pnpm-only keys stay exactly as written; everything else is derived
  const pnpmOnly = Object.fromEntries(
    Object.entries(current).filter(([key]) => key !== 'packages' && key !== 'overrides'),
  );

  const document = {
    packages: members,
    ...pnpmOnly,
    overrides,
  };
  const text = HEADER + stringify(document, { indent: 2, lineWidth: 0, singleQuote: false });
  const changed = !fs.existsSync(workspacePath) || fs.readFileSync(workspacePath, 'utf8') !== text;
  return { text, changed, members, overrides: Object.keys(overrides) };
}

/**
 * @param {{ repoRoot: string, write?: boolean }} options
 * @returns {{ changed: boolean, written: boolean, members: string[], overrides: string[] }}
 */
export function syncPnpmWorkspace({ repoRoot, write = false }) {
  const { text, changed, members, overrides } = renderPnpmWorkspace(repoRoot);
  if (write && changed) fs.writeFileSync(path.join(repoRoot, 'pnpm-workspace.yaml'), text);
  return { changed, written: Boolean(write && changed), members, overrides };
}

/**
 * What `check` compares, as a boolean for callers that only need "is the pnpm side derived from npm's".
 *
 * @param {string} repoRoot
 * @returns {boolean}
 */
export function workspaceIsInSync(repoRoot) {
  const pnpm = readPnpmOverrides(repoRoot);
  if (!pnpm) return false;
  const npm = readNpmOverrides(repoRoot);
  if (npm.size !== pnpm.size) return false;
  for (const [selector, spec] of npm) if (pnpm.get(selector) !== spec) return false;
  return true;
}
