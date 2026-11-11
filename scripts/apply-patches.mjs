#!/usr/bin/env node
/**
 * Apply the repo's dependency patches when npm installed the tree.
 *
 * pnpm applies `patchedDependencies` itself during `pnpm install` (root: pnpm-workspace.yaml, portal:
 * portal/package.json `pnpm.patchedDependencies`). npm has no such mechanism, and CI installs with
 * `npm ci` from the committed package-lock.json, so this script applies the same files with the same
 * rule pnpm uses: a patch is bound to an exact `name@version`, it is applied to every installed copy of
 * that version, and it is an error when no copy of that version is installed (so a version bump cannot
 * silently drop a patch). Re-running is a no-op: an already applied patch is detected and skipped.
 *
 * Usage: node scripts/apply-patches.mjs [--dir portal]
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/* eslint-disable no-console */

if ((process.env.npm_config_user_agent ?? '').startsWith('pnpm/')) {
  // pnpm applied patchedDependencies during the install.
  process.exit(0);
}

const dirFlag = process.argv.indexOf('--dir');
const projectDir = path.resolve(dirFlag === -1 ? '.' : process.argv[dirFlag + 1]);
const gitRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: projectDir })
  .toString()
  .trim();

/** @returns {Record<string, string>} `name@version` -> patch path relative to projectDir */
function readPatchedDependencies() {
  const workspaceFile = path.join(projectDir, 'pnpm-workspace.yaml');
  if (existsSync(workspaceFile)) {
    const [, block = ''] = readFileSync(workspaceFile, 'utf8').split(/^patchedDependencies:\s*$/m);
    /** @type {Record<string, string>} */
    const entries = {};
    for (const line of block.split('\n').slice(1)) {
      const match = line.match(/^\s{2}["']?([^"':]+@[^"':]+)["']?:\s*(\S+)\s*$/);
      if (!match) break;
      const [, nameVersion, patchFile] = match;
      entries[nameVersion] = patchFile;
    }
    return entries;
  }
  const manifest = JSON.parse(readFileSync(path.join(projectDir, 'package.json'), 'utf8'));
  return manifest.pnpm?.patchedDependencies ?? {};
}

const lock = JSON.parse(readFileSync(path.join(projectDir, 'package-lock.json'), 'utf8'));
const installed = Object.entries(lock.packages ?? {});

/**
 * @param {string[]} args
 * @param {string} directory relative to the git root
 */
function gitApply(args, directory) {
  try {
    execFileSync('git', ['apply', `--directory=${directory}`, ...args], {
      cwd: gitRoot,
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

let failed = 0;
for (const [nameVersion, patchFile] of Object.entries(readPatchedDependencies())) {
  const at = nameVersion.lastIndexOf('@');
  const name = nameVersion.slice(0, at);
  const version = nameVersion.slice(at + 1);
  const copies = installed
    .filter(
      ([key, record]) =>
        key.endsWith(`node_modules/${name}`) && record.version === version && !record.link,
    )
    .map(([key]) => key);
  const patch = path.resolve(projectDir, patchFile);

  if (copies.length === 0) {
    console.error(`apply-patches: ${nameVersion} is not installed, so ${patchFile} cannot apply`);
    failed += 1;
  }
  for (const copy of copies) {
    // an optional/platform package can be in the lock without being on disk
    const onDisk = existsSync(path.join(projectDir, copy));
    const directory = path.relative(gitRoot, path.join(projectDir, copy));
    if (!onDisk) {
      console.log(`apply-patches: ${nameVersion} not on disk at ${copy}, skipped`);
    } else if (gitApply(['--check', '--reverse', patch], directory)) {
      console.log(`apply-patches: ${nameVersion} already applied in ${copy}`);
    } else if (gitApply([patch], directory)) {
      console.log(`apply-patches: ${nameVersion} applied in ${copy}`);
    } else {
      console.error(`apply-patches: ${patchFile} does not apply to ${copy}`);
      failed += 1;
    }
  }
}
process.exit(failed ? 1 : 0);
