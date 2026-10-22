#!/usr/bin/env node
/**
 * Runs a spec in ONE worktree with a caller-supplied WTR config and extracts the machine-readable
 * result — the generic primitive behind compare-measures.mjs. Smart-baseline is performance
 * agnostic: it has no notion of forced layout, FCP, or any metric. The spec and config decide
 * what is measured; this runner only guarantees both sides run the exact same file.
 *
 * Usage:
 *   node run-measure.mjs --worktree <dir> --spec <abs spec path> --config <abs wtr config> --out <json>
 *
 * The spec is copied into the worktree (untracked, under .tmp) so the exact same file runs in
 * every worktree; only the code under measurement differs. The result is the `__BASELINE_RESULT__`
 * JSON marker the spec prints (via console.error) in its WTR output.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const packageDir = path.dirname(fileURLToPath(import.meta.url));

function arg(name) {
  const i = process.argv.indexOf(name);
  if (i === -1) throw new Error(`Missing required argument: ${name}`);
  return process.argv[i + 1];
}

const worktree = path.resolve(arg('--worktree'));
const spec = path.resolve(arg('--spec'));
const config = path.resolve(arg('--config'));
const out = path.resolve(arg('--out'));

// stable location inside the worktree so the spec resolves its imports from that worktree's code
const specInWorktree = path.join(worktree, '.tmp/smart-baseline', path.basename(spec));

fs.mkdirSync(path.dirname(specInWorktree), { recursive: true });
fs.copyFileSync(spec, specInWorktree);

const wtr = path.join(worktree, 'node_modules/@web/test-runner/dist/bin.js');
const outLog = path.join(path.dirname(out), `${path.basename(out, '.json')}.log`);

console.error(`[run-measure] worktree=${worktree}`);
console.error(`[run-measure] running spec in worktree… (log: ${outLog})`);
let stdout;
try {
  stdout = execFileSync('node', [wtr, '--config', config, '--files', specInWorktree], {
    cwd: worktree,
    encoding: 'utf8',
    timeout: 300000,
    maxBuffer: 64 * 1024 * 1024,
  });
} catch (err) {
  stdout = err.stdout ?? '';
  const stderr = err.stderr ?? '';
  fs.writeFileSync(outLog, `${stdout}\n${stderr}`);
  console.error(`[run-measure] WTR exited ${err.status}: see ${outLog}`);
  process.exit(1);
}
fs.writeFileSync(outLog, stdout);

const marker = stdout.match(/__BASELINE_RESULT__(.+)/);
if (!marker) {
  console.error(`[run-measure] no __BASELINE_RESULT__ marker found in output`);
  process.exit(1);
}
const result = JSON.parse(marker[1]);
fs.writeFileSync(out, JSON.stringify(result, null, 2));
console.error(`[run-measure] wrote ${out}`);
console.log(JSON.stringify(result, null, 2));
