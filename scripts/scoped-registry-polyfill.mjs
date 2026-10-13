#!/usr/bin/env node
/**
 * Fetch, build and vendor the *redesign* of `@webcomponents/scoped-custom-element-registry`
 * (the spec 1.x model, [webcomponents/polyfills#668](https://github.com/webcomponents/polyfills/pull/668)).
 *
 * The redesign is not published to npm — the published `0.0.10` is still the spec 0.x model —
 * so the test matrix runs against a build of the PR branch, vendored at
 * `packages/ui/components/core/test/scoped-registry-v1/`.
 *
 * Usage:
 *   node scripts/scoped-registry-polyfill.mjs                 # the pinned commit (reproducible)
 *   node scripts/scoped-registry-polyfill.mjs --latest        # tip of the ref instead
 *   node scripts/scoped-registry-polyfill.mjs --ref master    # another branch/tag (with --latest)
 *   node scripts/scoped-registry-polyfill.mjs --check         # verify the vendored build is current
 *   node scripts/scoped-registry-polyfill.mjs --out <dir>     # write somewhere else
 *
 * The clone is cached in `.tmp/scoped-registry-polyfill` (gitignored). The built file and a
 * `source.json` recording the exact commit are written next to the README that documents them;
 * commit them together, and delete the whole fixture once the redesign ships on npm.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

/** The build that the repo vendors. Keep in sync with the fixture's `source.json`. */
const PIN = {
  repository: 'https://github.com/webcomponents/polyfills.git',
  /** Branch of the open PR; falls back to `master` once it is merged. */
  ref: 'scoped-registry-redesign',
  commit: '8b60db656b898cc72958b531bf9a2d89d392f41a',
};

const PACKAGE_DIR = 'packages/scoped-custom-element-registry';
const BUILD_ENTRY = `${PACKAGE_DIR}/src/scoped-custom-element-registry.ts`;
const ARTIFACT = 'scoped-custom-element-registry.min.js';

const repoRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const cacheDir = path.join(repoRoot, '.tmp/scoped-registry-polyfill');

const args = process.argv.slice(2);
const has = flag => args.includes(flag);
const valueOf = flag => {
  const i = args.indexOf(flag);
  return i === -1 ? undefined : args[i + 1];
};

const latest = has('--latest');
const check = has('--check');
const ref = valueOf('--ref') ?? PIN.ref;
const outDir = path.resolve(
  repoRoot,
  valueOf('--out') ?? 'packages/ui/components/core/test/scoped-registry-v1',
);

const run = (cmd, argv, opts = {}) =>
  execFileSync(cmd, argv, {
    stdio: ['ignore', 'pipe', 'inherit'],
    encoding: 'utf8',
    ...opts,
  }).trim();

// 1. cached, blobless clone
if (!existsSync(path.join(cacheDir, '.git'))) {
  mkdirSync(path.dirname(cacheDir), { recursive: true });
  console.log(`[polyfill] cloning ${PIN.repository} into ${path.relative(repoRoot, cacheDir)}`);
  run('git', ['clone', '--filter=blob:none', '--no-checkout', PIN.repository, cacheDir]);
}

// 2. decide the commit
const hasCommit = sha => {
  try {
    return (
      run('git', ['-C', cacheDir, 'cat-file', '-t', sha], {
        stdio: ['ignore', 'pipe', 'ignore'],
      }) === 'commit'
    );
  } catch {
    return false;
  }
};

let commit = PIN.commit;
if (latest) {
  run('git', ['-C', cacheDir, 'fetch', '--quiet', 'origin', ref]);
  commit = run('git', ['-C', cacheDir, 'rev-parse', `origin/${ref}`]);
  console.log(`[polyfill] --latest: ${ref} is at ${commit}`);
} else if (!hasCommit(PIN.commit)) {
  try {
    run('git', ['-C', cacheDir, 'fetch', '--quiet', 'origin', PIN.commit]);
  } catch {
    console.warn('[polyfill] could not fetch the pinned commit; using whatever the cache has');
  }
}
run('git', ['-C', cacheDir, 'checkout', '--force', '--quiet', commit]);

// 3. build it into a standalone script (the polyfill patches the DOM on load, it is not a module).
//    esbuild rather than upstream's closure-compiler: no property mangling, so the polyfill's
//    `Object.defineProperty(obj, 'name', …)` string keys survive; closure would need the flagfile.
const localBin = path.join(repoRoot, 'node_modules/.bin/esbuild');
const esbuild = existsSync(localBin)
  ? { cmd: localBin, argv: [] }
  : { cmd: 'npx', argv: ['--yes', 'esbuild'] };
let esbuildVersion = 'unknown';
try {
  esbuildVersion = require('esbuild/package.json').version;
} catch {
  console.warn('[polyfill] esbuild is not resolvable locally; falling back to `npx --yes esbuild`');
}

const buildTo = target => {
  run(esbuild.cmd, [
    ...esbuild.argv,
    path.join(cacheDir, BUILD_ENTRY),
    '--format=esm',
    '--target=es2020',
    '--minify',
    `--outfile=${target}`,
  ]);
};

const target = path.join(outDir, ARTIFACT);
if (check) {
  const tmp = path.join(repoRoot, '.tmp/scoped-registry-polyfill-check', ARTIFACT);
  mkdirSync(path.dirname(tmp), { recursive: true });
  buildTo(tmp);
  const committed = existsSync(target) ? readFileSync(target) : null;
  const fresh = readFileSync(tmp);
  rmSync(tmp, { force: true });
  const pinnedJson = existsSync(path.join(outDir, 'source.json'))
    ? JSON.parse(readFileSync(path.join(outDir, 'source.json'), 'utf8'))
    : {};
  if (!committed || !committed.equals(fresh)) {
    console.error(`[polyfill] ${path.relative(repoRoot, target)} is NOT the build of ${commit}`);
    process.exit(1);
  }
  if (pinnedJson.commit !== commit) {
    console.error(`[polyfill] source.json pins ${pinnedJson.commit}, expected ${commit}`);
    process.exit(1);
  }
  console.log(`[polyfill] ok: ${path.relative(repoRoot, target)} matches ${commit}`);
} else {
  mkdirSync(outDir, { recursive: true });
  buildTo(target);
  writeFileSync(
    path.join(outDir, 'source.json'),
    `${JSON.stringify(
      {
        repository: PIN.repository,
        ref,
        commit,
        artifact: ARTIFACT,
        builtWith: `esbuild ${esbuildVersion}`,
      },
      null,
      2,
    )}\n`,
  );
  console.log(`[polyfill] built ${path.relative(repoRoot, target)} from ${ref}@${commit}`);
  console.log(
    '[polyfill] commit that file together with source.json (and the tests still need to pass on it)',
  );
}
