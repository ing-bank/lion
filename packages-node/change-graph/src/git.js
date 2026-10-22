/* eslint-disable no-continue */ // the layers read more clearly with early exits per case
/**
 * The git layer: where the change set comes from in each mode.
 *
 * - `local`   : everything that differs from HEAD (staged + unstaged), plus untracked files. A brand
 *               new component is untracked until it is added, and that is exactly the case where its
 *               tests do have to run.
 * - `pr`      : the merge base of the target branch, so only this branch's own commits count. A
 *               two-dot diff would also report the target branch's commits as changes.
 * - `release` : since the last release tag. Tags are per package (`@lion/ui@0.25.0`), so the newest
 *               tag of the package that owns each changed file is used.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * @param {string} cwd
 * @param {string[]} args
 * @returns {string}
 */
function git(cwd, args) {
  // A lockfile is well over a megabyte and `git show` prints it in one go; the default buffer of
  // execFileSync truncates (and then throws) instead of returning the content.
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 }).trim();
}

/**
 * @param {string} output
 * @returns {string[]}
 */
function lines(output) {
  return output.split('\n').filter(Boolean);
}

/**
 * @param {string} cwd
 * @returns {string} the repository root
 */
export function repoRoot(cwd) {
  return git(cwd, ['rev-parse', '--show-toplevel']);
}

/**
 * @param {string} cwd
 * @returns {{ files: string[], untracked: string[] }}
 */
export function changedFilesLocal(cwd) {
  const tracked = lines(git(cwd, ['diff', 'HEAD', '--name-only', '--diff-filter=ACMR']));
  const untracked = lines(git(cwd, ['ls-files', '--others', '--exclude-standard']));
  return { files: [...new Set([...tracked, ...untracked])], untracked };
}

/**
 * @param {string} cwd
 * @param {string} ref
 * @returns {string} the merge base, or an empty string when there is none
 */
export function mergeBase(cwd, ref) {
  try {
    return git(cwd, ['merge-base', ref, 'HEAD']);
  } catch {
    return '';
  }
}

/**
 * @param {string} cwd
 * @param {string} base the target branch (a sha, branch or remote ref)
 * @returns {string[]}
 * @throws when the merge base is unknown - the caller falls back to a full run
 */
export function changedFilesForPullRequest(cwd, base) {
  const base_ = mergeBase(cwd, base);
  if (!base_) {
    throw new Error(`no merge base with ${JSON.stringify(base)}`);
  }
  return lines(git(cwd, ['diff', '--name-only', '--diff-filter=ACMR', base_]));
}

/**
 * The package a file belongs to: the nearest package.json above it.
 *
 * @param {string} cwd
 * @param {string} file relative to the repository root
 * @returns {{ name: string, dir: string, version: string }}
 */
export function ownerPackage(cwd, file) {
  let dir = path.dirname(path.resolve(cwd, file));
  const root = path.resolve(cwd);
  while (dir.startsWith(root) && dir !== root) {
    const packageJson = path.join(dir, 'package.json');
    if (fs.existsSync(packageJson)) {
      const parsed = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
      if (parsed.name) {
        return {
          name: parsed.name,
          dir: path.relative(root, dir),
          version: parsed.version ?? '0.0.0',
        };
      }
    }
    dir = path.dirname(dir);
  }
  return { name: '', dir: '', version: '' };
}

/**
 * The newest tag of a package, which is that package's last release.
 *
 * @param {string} cwd
 * @param {string} packageName
 * @returns {string} the tag, or an empty string when the package was never released
 */
export function latestTagForPackage(cwd, packageName) {
  if (!packageName) {
    return '';
  }
  try {
    const tags = lines(git(cwd, ['tag', '--list', `${packageName}@*`, '--sort=-creatordate']));
    return tags[0] ?? '';
  } catch {
    return '';
  }
}

/**
 * Everything that changed since each touched package's last release.
 *
 * @param {string} cwd
 * @param {string[]} files
 * @returns {{ files: string[], reasons: string[] }}
 */
export function changedFilesSinceRelease(cwd, files) {
  /** @type {Set<string>} */
  const changed = new Set();
  /** @type {string[]} */
  const reasons = [];
  /** @type {Map<string, string[]>} */
  const byPackage = new Map();
  for (const file of files) {
    const owner = ownerPackage(cwd, file);
    const key = owner.name || '(root)';
    if (!byPackage.has(key)) {
      byPackage.set(key, []);
    }
    /** @type {string[]} */ (byPackage.get(key)).push(file);
  }
  for (const [packageName, packageFiles] of byPackage) {
    const tag = latestTagForPackage(cwd, packageName);
    if (!tag) {
      // Unreleased package: everything it owns counts as changed.
      for (const file of packageFiles) {
        changed.add(file);
      }
      reasons.push(`${packageName}: never released, so every file counts`);
      continue;
    }
    reasons.push(`${packageName}: since ${tag}`);
    for (const file of lines(git(cwd, ['diff', '--name-only', '--diff-filter=ACMR', tag]))) {
      changed.add(file);
    }
  }
  return { files: [...changed], reasons };
}

/**
 * The content of a file at a revision (the lockfile of the target branch, a tag, HEAD).
 *
 * @param {string} cwd
 * @param {string} ref
 * @param {string} file
 * @returns {string} the content, or an empty string when the file does not exist there
 */
export function fileAtRevision(cwd, ref, file) {
  try {
    return git(cwd, ['show', `${ref}:${file}`]);
  } catch {
    return '';
  }
}
