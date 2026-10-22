# @lion-tools/smart-baseline

Generic **baseline-worktree comparison**: run any spec in the **current worktree** against a
**baseline worktree** checked out at the **previous state** — the same "always measure against a
worktree of the previous state" idea as `scripts/screenshots-comparison`, but as a standalone,
**performance-agnostic** package. Smart-baseline knows nothing about forced layout, FCP, paint,
or any metric: the spec and its WTR config decide what is measured (see
`@lion-labs/test-runner-advanced-perf` for the tracing/FCP specs).

**Accurate baselines, without a heavy artifact-storing solution and without polluting a git repo.**
A baseline is never a checked-in binary (no committed screenshots/dumps to churn). It is re-derived
on demand from a `git worktree` at the exact previous revision, so the baseline is _always accurate_
for whatever you are comparing against. At most we store the minimum info needed to **reproduce a
formerly accepted baseline** — the baseline ref (or ref + spec hash) — and recompute it in a fresh
worktree whenever it is needed again. Nothing extra lives in the repo.

## What it does

1. Resolves the baseline ref (default: `git merge-base HEAD origin/master` — the previous state).
2. Ensures a **worktree** exists at that ref (`git worktree add --detach`) — the measured branch is
   never re-checked-out, and the repo stays clean.
3. Runs the **same spec** (with the caller-supplied WTR config) in both worktrees. The spec emits a
   `__BASELINE_RESULT__` JSON marker (an array of `{ name, value }` records).
4. Prints a **before/after** report table.

## Usage

```bash
node compare-measures.mjs \
  --current /path/to/branch-worktree \
  --spec /abs/path/to/spec.js \
  --config /abs/path/to/wtr-config.mjs \
  [--baseline-ref <ref>]      # default: merge-base with origin/master
  [--baseline-dir <dir>]      # default: <current>/../before-<short-ref>
  [--relink <script>]         # e.g. /path/to/lion-ts/relink.sh (isolates worktree node_modules)
  [--value-key <key>]         # result field to compare, default 'value'
  [--out <dir>]               # default: <current>/.tmp/smart-baseline
```

Single-side run:

```bash
node run-measure.mjs --worktree <dir> --spec <spec> --config <wtr-config> --out <json>
```

## Spec contract

A spec is a WTR test file that prints `console.error('__BASELINE_RESULT__' + JSON.stringify([{ name, value }]))`
when it runs. It is copied into each worktree (untracked, under `.tmp/smart-baseline`) so both sides
run the exact same file; only the code under measurement differs.

## Design notes

- The spec is copied into each worktree at a stable path so both sides run the identical file — the
  repo is never polluted by the measurement.
- The result marker is parsed by `run-measure.mjs` from WTR output; `compare-measures.mjs` diffs the
  `value` per `name` and prints the table.
- What is measured is entirely the caller's choice: point `--spec`/`--config` at the tracing specs
  shipped by `@lion-labs/test-runner-advanced-perf` for forced-layout/FCP measurements, or at any
  other spec.
