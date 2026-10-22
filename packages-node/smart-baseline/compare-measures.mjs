#!/usr/bin/env node
/**
 * Generic before/after comparison using a baseline worktree — the "always measure the previous
 * state from a worktree" mechanism. Performance agnostic: the spec and its WTR config decide what
 * is measured; this script only guarantees both sides run the exact same spec and reports the
 * diff. The spec's result must be a JSON array of { name, value } records.
 *
 * Usage:
 *   node compare-measures.mjs \
 *     --current <branch worktree dir> \
 *     --spec <abs spec path> \
 *     --config <abs wtr config path> \
 *     [--baseline-ref <ref>]  (default: merge-base of current with origin/master)
 *     [--baseline-dir <dir>]  (default: <current>/../before-<short ref>)
 *     [--relink <script>]     (optional: make the baseline worktree's node_modules resolve)
 *     [--out <dir>]           (default: <current>/.tmp/smart-baseline)
 *
 * Flow:
 *   1. resolve the baseline ref (previous state).
 *   2. ensure a worktree exists at that ref (git worktree add --detach) — ALWAYS a worktree,
 *      never a re-checkout of the measured branch.
 *   3. run the spec in the current worktree (after) and the baseline worktree (before).
 *   4. print a before/after report.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const packageDir = path.dirname(fileURLToPath(import.meta.url));
const runMeasure = path.join(packageDir, 'run-measure.mjs');

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}

function sh(cmd, args, cwd) {
  return execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}

const current = path.resolve(arg('--current') ?? process.cwd());
const spec = path.resolve(arg('--spec') ?? '');
const config = path.resolve(arg('--config') ?? '');
if (!spec || !config) {
  console.error('[compare] --spec and --config are required');
  process.exit(1);
}
const relink = arg('--relink');
const valueKey = arg('--value-key') ?? 'value';
const outDir = path.resolve(arg('--out') ?? path.join(current, '.tmp/smart-baseline'));
fs.mkdirSync(outDir, { recursive: true });

// 1. baseline ref
let baselineRef = arg('--baseline-ref');
if (!baselineRef) {
  baselineRef = sh('git', ['merge-base', 'HEAD', 'origin/master'], current);
}
const shortRef = baselineRef.slice(0, 10);

// 2. baseline worktree (create once, reuse)
const baselineDir = path.resolve(
  arg('--baseline-dir') ?? path.join(current, '..', `before-${shortRef}`),
);
if (!fs.existsSync(path.join(baselineDir, '.git'))) {
  console.error(`[compare] creating baseline worktree at ${baselineRef} -> ${baselineDir}`);
  fs.mkdirSync(path.dirname(baselineDir), { recursive: true });
  sh('git', ['worktree', 'add', '--detach', baselineDir, baselineRef], current);
} else {
  console.error(`[compare] reusing baseline worktree ${baselineDir}`);
}
if (relink && !fs.existsSync(path.join(baselineDir, 'node_modules/@web/test-runner'))) {
  console.error(`[compare] relinking baseline node_modules via ${relink}`);
  sh('bash', [relink, baselineDir], process.cwd());
}

// 3. measure both
const beforeJson = path.join(outDir, 'before.json');
const afterJson = path.join(outDir, 'after.json');
console.error('[compare] measuring baseline (before)…');
sh(
  'node',
  [runMeasure, '--worktree', baselineDir, '--spec', spec, '--config', config, '--out', beforeJson],
  current,
);
console.error('[compare] measuring current (after)…');
sh(
  'node',
  [runMeasure, '--worktree', current, '--spec', spec, '--config', config, '--out', afterJson],
  current,
);

// 4. report
const before = JSON.parse(fs.readFileSync(beforeJson, 'utf8'));
const after = JSON.parse(fs.readFileSync(afterJson, 'utf8'));

const rows = [];
for (const b of before) {
  const a = after.find(x => x.name === b.name);
  rows.push({ name: b.name, before: b[valueKey], after: a?.[valueKey] });
}
const totalBefore = rows.reduce((s, r) => s + (r.before ?? 0), 0);
const totalAfter = rows.reduce((s, r) => s + (r.after ?? 0), 0);

console.log('\n=== SMART-BASELINE REPORT ===');
console.log(`baseline ref : ${baselineRef} (worktree ${baselineDir})`);
console.log(`current      : ${sh('git', ['rev-parse', 'HEAD'], current)} (worktree ${current})`);
console.log(`value key    : ${valueKey}`);
console.log('');
console.table(rows);
console.log(`TOTAL ${valueKey}: before=${totalBefore} after=${totalAfter}`);
console.log(`Report JSON: ${beforeJson} (before), ${afterJson} (after)`);
