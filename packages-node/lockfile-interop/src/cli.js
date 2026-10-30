#!/usr/bin/env node
// @ts-check
/* eslint-disable no-console -- a CLI's output is its interface */
import path from 'node:path';
import { check, formatReport, generate } from './index.js';
import { stringifyJson } from './json-notation.js';

/**
 * @returns {never}
 */
function usage() {
  console.error(`usage: lockfile-interop <command> [--root <dir>] [--json]

  check     compare pnpm-lock.yaml with package-lock.json, exit 1 on any divergence
            --require  also fail when the repo has no pnpm lock
  generate  write package-lock.json from pnpm-lock.yaml (no npm run needed)
            --out <file>  write elsewhere (default: <root>/package-lock.json)
            --dedupe      one root copy per version instead of a copy per requirer (drops conflicts)
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

const repoRoot = path.resolve(flag('--root') ?? process.cwd());
const asJson = args.includes('--json');

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

const result = check({ repoRoot });
if (result.noPnpmLock) {
  console.log('no pnpm-lock.yaml in this repo — nothing to guard (pass --require to fail on that)');
  process.exit(args.includes('--require') ? 1 : 0);
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

if (command === 'report') process.exit(0);
process.exit(result.ok ? 0 : 1);
