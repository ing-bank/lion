#!/usr/bin/env node
/* eslint-disable no-console */ // a CLI writes to stdout/stderr
/**
 * `change-graph`: print the tests a change can affect.
 *
 * ```bash
 * npx change-graph --mode=local                     # working tree against HEAD
 * npx change-graph --mode=pr --base=origin/master   # this branch against its merge base
 * npx change-graph --mode=release                   # since the last release tag of each package
 * npx change-graph --full                           # everything (the "run all" escape hatch)
 * npx change-graph --include-sr --format=args       # screen reader tests too, as one line of args
 * ```
 *
 * The selected test files go to stdout (one per line, or space separated with `--format=args`) and
 * the reasons go to stderr, so a workflow can pass the list straight to the runner:
 *
 * ```yaml
 * run: npm run test:sr -- --files "$(npx change-graph --mode=pr --base=origin/master --include-sr --format=args)"
 * ```
 */
import process from 'node:process';

import { selectTests } from './select.js';

/**
 * @param {string[]} argv
 * @returns {Record<string, string | boolean>}
 */
function readFlags(argv) {
  /** @type {Record<string, string | boolean>} */
  const flags = {};
  for (const arg of argv) {
    const match = /^--([^=]+)(?:=(.*))?$/.exec(arg);
    if (match) {
      const [, name, value] = match;
      flags[name] = value === undefined ? true : value;
    }
  }
  return flags;
}

const flags = readFlags(process.argv.slice(2));
const format = typeof flags.format === 'string' ? flags.format : 'lines';

let selection;
try {
  selection = await selectTests({
    mode: /** @type {'local' | 'pr' | 'release'} */ (
      typeof flags.mode === 'string' ? flags.mode : 'local'
    ),
    base: typeof flags.base === 'string' ? flags.base : undefined,
    cwd: typeof flags.cwd === 'string' ? flags.cwd : undefined,
    full: flags.full === true,
    includeSr: flags['include-sr'] === true,
    changedFiles:
      typeof flags.files === 'string' && flags.files ? flags.files.split(',') : undefined,
  });
} catch (error) {
  console.error(`[change-graph] ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}

for (const reason of selection.reasons) {
  console.error(`[change-graph] ${reason}`);
}
console.error(
  `[change-graph] mode=${selection.mode} full=${selection.full} changed=${selection.changedFiles.length} deps=${selection.changedDependencies.length} units=${selection.units.length} graph=${selection.graph.files} files`,
);

if (format === 'json') {
  process.stdout.write(`${JSON.stringify(selection, null, 2)}\n`);
} else if (format === 'args') {
  process.stdout.write(`${selection.testFiles.join(' ')}\n`);
} else {
  process.stdout.write(`${selection.testFiles.join('\n')}\n`);
}
