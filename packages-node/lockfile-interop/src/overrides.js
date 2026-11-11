// @ts-check
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

/**
 * Override parity between the two managers.
 *
 * `overrides` is the one dependency declaration that cannot live in one file: npm reads the `overrides`
 * field in package.json (with its nested object form, `"."` for the package itself), pnpm reads its own
 * `overrides` in pnpm-workspace.yaml (a flat `parent>child` selector per entry) and ignores npm's field
 * entirely - measured on this repo: without the mirror, pnpm resolved `@mdjs/mdjs-preview` to 0.5.9 while
 * the committed npm lock installs 0.6.0 for that edge, and `patches/@mdjs+mdjs-preview+0.6.0.patch` then
 * failed to apply.
 *
 * So the package keeps the mirror honest instead of trusting it: both files are committed, and this
 * normalises the two spellings into one selector -> spec map so a difference fails the gate. That is what
 * makes "the versions pnpm installs are the versions the npm lock records" checkable at override level too,
 * not just for the dependencies a manifest declares.
 */

/** @typedef {{ selector: string, npm: string|null, pnpm: string|null }} OverrideDriftEntry */

/**
 * npm's `overrides` in pnpm's flat spelling: a nested object means "and its dependencies", `"."` means the
 * package itself, so `{ '@mdjs/mdjs-preview': { '.': '^0.6.0', '@lion/ui': '^0.15.0' } }` becomes
 * `@mdjs/mdjs-preview -> ^0.6.0` plus `@mdjs/mdjs-preview>@lion/ui -> ^0.15.0`.
 *
 * @param {Record<string, unknown>} [overrides]
 * @param {string} [prefix]
 * @returns {Map<string, string>}
 */
export function flattenNpmOverrides(overrides, prefix = '') {
  /** @type {Map<string, string>} */
  const flat = new Map();
  for (const [key, value] of Object.entries(overrides ?? {})) {
    const selector = prefix ? `${prefix}>${key}` : key;
    if (typeof value === 'string') {
      flat.set(selector, value);
      continue;
    }
    if (value && typeof value === 'object') {
      const nested = /** @type {Record<string, unknown>} */ (value);
      const self = nested['.'];
      if (typeof self === 'string') flat.set(selector, self);
      const rest = Object.fromEntries(Object.entries(nested).filter(([k]) => k !== '.'));
      for (const [nestedSelector, spec] of flattenNpmOverrides(rest, selector)) {
        flat.set(nestedSelector, spec);
      }
    }
  }
  return flat;
}

/**
 * The `overrides` block of pnpm-workspace.yaml, as written. pnpm's syntax is already flat, so this only has
 * to reject shapes that mean something else (an object value is npm's nesting, not pnpm's).
 *
 * @param {string} yamlText
 * @returns {Map<string, string>}
 */
export function readPnpmOverridesText(yamlText) {
  const doc = parse(yamlText) ?? {};
  const overrides = doc.overrides ?? {};
  /** @type {Map<string, string>} */
  const flat = new Map();
  for (const [selector, value] of Object.entries(overrides)) {
    if (typeof value !== 'string') {
      throw new Error(
        `pnpm-workspace.yaml override "${selector}" is not a string: pnpm's form is one "parent>child": "spec" entry per line (npm's nested object form would be flattened into exactly those selectors)`,
      );
    }
    flat.set(selector, value);
  }
  return flat;
}

/**
 * @param {string} repoRoot
 * @returns {Map<string, string>} npm's overrides, flattened to pnpm selectors
 */
export function readNpmOverrides(repoRoot) {
  const manifestPath = path.join(repoRoot, 'package.json');
  if (!fs.existsSync(manifestPath)) return new Map();
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return flattenNpmOverrides(manifest.overrides);
}

/**
 * @param {string} repoRoot
 * @returns {Map<string, string>|null} null when the repo has no pnpm-workspace.yaml
 */
export function readPnpmOverrides(repoRoot) {
  const workspacePath = path.join(repoRoot, 'pnpm-workspace.yaml');
  if (!fs.existsSync(workspacePath)) return null;
  return readPnpmOverridesText(fs.readFileSync(workspacePath, 'utf8'));
}

/**
 * Is pnpm-workspace.yaml a committed file? It carries the overrides (and the workspace member list) that
 * pnpm resolves with, so a checkout without it installs something else than the commit describes. Outside a
 * git work tree the question does not apply and this returns true.
 *
 * @param {string} repoRoot
 * @param {string} [file]
 * @returns {boolean}
 */
export function isTrackedByGit(repoRoot, file = 'pnpm-workspace.yaml') {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', file], {
      cwd: repoRoot,
      stdio: ['ignore', 'ignore', 'ignore'],
    });
    return true;
  } catch (error) {
    const stderr = String(/** @type {any} */ (error).stderr ?? '');
    // 128 = not a git repository (a fixture dir, or a tarball checkout)
    if (/** @type {any} */ (error).status === 128 || stderr.includes('not a git repository'))
      return true;
    return false;
  }
}

/**
 * Every selector where the two manifests disagree, in either direction.
 *
 * @param {Map<string, string>} npmOverrides
 * @param {Map<string, string>} pnpmOverrides
 * @returns {OverrideDriftEntry[]}
 */
export function overridesDrift(npmOverrides, pnpmOverrides) {
  const selectors = [...new Set([...npmOverrides.keys(), ...pnpmOverrides.keys()])].sort();
  /** @type {OverrideDriftEntry[]} */
  const drift = [];
  for (const selector of selectors) {
    const npm = npmOverrides.get(selector) ?? null;
    const pnpm = pnpmOverrides.get(selector) ?? null;
    if (npm !== pnpm) drift.push({ selector, npm, pnpm });
  }
  return drift;
}
