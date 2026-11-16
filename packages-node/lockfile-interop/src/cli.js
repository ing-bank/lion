#!/usr/bin/env node
// @ts-check
/* eslint-disable no-console -- a CLI's output is its interface */
import path from 'node:path';
import { check, formatReport, generate } from './index.js';
import { stringifyJson } from './json-notation.js';
import { resolveRepoRoot } from './repo-root.js';
import { syncPnpmWorkspace } from './workspace.js';

/**
 * @returns {never}
 */
function usage() {
  console.error(`usage: lockfile-interop <command> [--root <dir>] [--json]

  check     compare pnpm-lock.yaml with package-lock.json, exit 1 on any divergence
            --declared  compare what the workspace manifests declare (the mode this repo runs: pnpm
                        installs from the committed npm lock, so npm's duplicate tails are legitimate);
                        without it every record in both locks must match exactly
            --strict    full record-set comparison (explicit form of the default)
            --require  also fail when the repo has no pnpm lock
  generate  write package-lock.json from pnpm-lock.yaml (no npm run needed)
            --out <file>  write elsewhere (default: <root>/package-lock.json)
            --dedupe      one root copy per version instead of a copy per requirer (drops conflicts)
  sync      derive pnpm-workspace.yaml from package.json (workspaces + overrides)
            --write       write the file (default: report and exit 1 when it is out of date)
  report    print the comparison without failing`);
  process.exit(2);
}

const args = process.argv.slice(2);
const command = args[0];
if (!command || command.startsWith('--')) usage();

/**
 * @param {string} name
 * @returns {string|undefined}
 */
const flag = name => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};

const repoRoot = flag('--root') ? path.resolve(flag('--root')) : resolveRepoRoot(process.cwd());
const asJson = args.includes('--json');
const mode = args.includes('--declared') ? 'declared' : 'strict';

if (command === 'sync') {
  const result = syncPnpmWorkspace({ repoRoot, write: args.includes('--write') });
  if (result.written) {
    console.log(
      `pnpm-workspace.yaml written: ${result.members.length} members, ${result.overrides.length} overrides`,
    );
    process.exit(0);
  }
  if (!result.changed) {
    console.log(
      `pnpm-workspace.yaml is what package.json implies (${result.members.length} members, ${result.overrides.length} overrides)`,
    );
    process.exit(0);
  }
  console.error(
    'pnpm-workspace.yaml is not what package.json implies — run `lockfile-interop sync --write`',
  );
  process.exit(1);
}

if (command === 'generate') {
  const out = flag('--out');
  const result = generate({
    repoRoot,
    outFile: out ? path.resolve(out) : undefined,
    dedupe: args.includes('--dedupe'),
  });
  console.log(stringifyJson(result));
  process.exit(0);
}

const result = check({ repoRoot, mode });
if (result.noPnpmLock) {
  console.log('no pnpm-lock.yaml in this repo — nothing to guard (pass --require to fail on that)');
  process.exit(args.includes('--require') ? 1 : 0);
}
if (result.noPnpmWorkspace) {
  console.error(
    'pnpm-lock.yaml without pnpm-workspace.yaml: pnpm resolves the workspace members and the overrides from\n' +
      'that file, so the install would differ from the npm lock this gate compares against. Commit it.',
  );
  process.exit(1);
}
if (asJson) {
  console.log(stringifyJson(result));
} else if (result.noNpmLock) {
  console.log('no package-lock.json found — nothing to compare');
} else {
  console.log(formatReport(result));
  if (result.missingDeclarations.length) {
    console.log(
      `\nmanifest declarations missing from the lock (${result.missingDeclarations.length}):`,
    );
    console.log(...result.missingDeclarations.slice(0, 25).map(line => `  ${line}`));
  }
}

if (result.pnpmWorkspaceUntracked) {
  console.error(
    'pnpm-workspace.yaml is not tracked by git: a checkout without it installs something else than this\n' +
      'commit describes (the overrides and the workspace members live in it). Add it to the commit.',
  );
}
if (command === 'report') process.exit(0);
process.exit(result.ok ? 0 : 1);
