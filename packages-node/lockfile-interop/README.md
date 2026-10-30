# @lion/lockfile-interop

The piece that makes a pnpm/npm hybrid install safe: pnpm installs, an npm-generated lock stays the
artifact external tooling reads, and this package makes the two provably equal.

## Why pnpm, and why a hybrid

pnpm is not a style preference here, it is what makes the current workflow affordable. Measured in a
worktree of this repo (2632 packages, `--ignore-scripts` unless stated):

|                                                          | wall time | real disk for `node_modules` |
| -------------------------------------------------------- | --------- | ---------------------------- |
| `npm ci`                                                 | 59.3 s    | 989 MB                       |
| `npm ci`, with lifecycle scripts                         | 132.4 s   | 989 MB                       |
| `pnpm install --frozen-lockfile`, warm store             | 11.6 s    | **60 MB**                    |
| `pnpm install --frozen-lockfile`, with lifecycle scripts | 26.4 s    | **60 MB**                    |

That is ~5x faster and ~16x smaller per worktree, because the content-addressed store hardlinks the same
files into every project instead of unpacking its own copy. Worktrees, per-branch review environments and
parallel CI jobs are the normal developer workflow now, and each of those used to cost about a gigabyte;
with pnpm the marginal cost is tens of megabytes. pnpm additionally resolves and records peer sets and
integrity per package (`snapshots:` alongside `packages:` in lockfile v9), it links local packages
offline (`link-workspace-packages`, `link:`) where npm rejects those specifiers outright, and it keeps
workspace members out of a shared `node_modules` unless they are actually declared.

What cannot move yet is the artifact: scanners, SBOM tooling and our internal tooling that decides shared
singleton versions for a microfrontend setup read `package-lock.json`. pnpm cannot produce a compatible
one at acceptable cost — `pnpm import` only converts _into_ pnpm, the published converters are scan-only
(`pnpm-lock-to-npm-lock` emits `lockfileVersion` 2 with keys `npm ci` rejects) or unpublished
(`ndom91/pnpm-lock-to-package-lock`), and an exact converter means re-implementing npm's tree placement
(see Prior art). So the two managers split the work:

- **pnpm owns installing**: one store, hardlinks, ~5x the speed, ~16x less disk per worktree.
- **npm owns the lock artifact**: `npm install --package-lock-only` in CI, so the file the tooling reads is
  one npm itself would write.
- **this package owns the agreement**: it fails the build the moment the two locks resolve different
  versions, so the tooling can never derive a version the app does not install.

Without that last piece the hybrid is a silent trap: a lock one dependency behind looks fine in review and
only shows up as a wrong version decision downstream.

## The hybrid workflow

1. **Develop with pnpm.** `pnpm add` and `pnpm update` write `package.json` and `pnpm-lock.yaml`; pnpm
   stays the installer (see `pnpm-workspace.yaml` and the two `.npmrc` settings in the PR description).
2. **Regenerate the npm artifact.** `npm install --package-lock-only --ignore-scripts` needs no
   `node_modules` and costs about a second. It only re-resolves pins that no longer satisfy the ranges, so
   after a dependency refresh the drifted packages need `npm update --package-lock-only <pkg>`.
3. **Let the gate decide.** `npm run repo:lockfile:check` exits 1 with every package whose versions differ,
   plus any dependency a manifest declares that the lock never resolved.
4. **On failure**: regenerate the drifted packages with npm, or pin them in `package.json` when the two
   managers genuinely disagree (peer-heavy packages are the usual case), and commit both locks in the same
   PR. A repo without `pnpm-lock.yaml` skips the gate, so this lands before the switch.

## Commands

```bash
npm run repo:lockfile:check      # exit 1 on any divergence between the two locks
npm run repo:lockfile:generate   # write package-lock.json from pnpm-lock.yaml (no npm resolve)
```

The binary is `lockfile-interop` (`src/cli.js`), so the same gate runs in another repo without copying
code — see "Using it in another repo" below. Plain JavaScript with JSDoc types.

## Tests

```bash
npm run test:node --workspace @lion/lockfile-interop
```

Mocha + chai, as in the other `packages-node` packages, with one file per behaviour
(`parser.test.js`, `check.test.js`, `generator.test.js`), shared fixtures in `test-node/fixtures.js` and
shared plumbing in `test-node/test-helpers.js`. Test titles state the guarantee, and every file opens with
the failure it protects against.

JSON is written through `src/json-notation.js`: the document is authored as an array of lines and
concatenated instead of via `JSON.stringify(value, null, 2)`, so a change in the source reads like the
change in the lock. A test pins the output to be byte-identical to the built-in serializer, because
external tooling parses these files.

Fixture repos are generated into a temp directory (`fs.mkdtempSync`, always cleaned up) and never
committed: lock-shaped mock data in a repository is read by external security scanners as a real
dependency set. The fixture keeps the shape that matters — two versions of one package, a private
workspace member behind a `link:` edge, a peer-suffixed snapshot key — and every registry package in it
exists with its real `sha512` value.

Programmatic use:

```js
import { check, formatReport } from '@lion/lockfile-interop';

const result = check({ repoRoot: '/path/to/repo' });
if (!result.ok) console.error(formatReport(result));
```

## The npx flow: using this in another repo

`@lion/lockfile-interop` ships the `lockfile-interop` binary, so a repo that has to keep a
`package-lock.json` next to its `pnpm-lock.yaml` can run the gate without copying code.

1. **Get the tool** — packed tarball today, published name after a release:

   ```bash
   # without publishing
   npm pack --workspace @lion/lockfile-interop --pack-destination /tmp
   # or, once released: npx --yes @lion/lockfile-interop ...
   ```

2. **Run it against the target repo.** npx fetches the package, installs its `yaml` dependency and runs
   the binary with that repo as root:

   ```bash
   npx --yes --package=/tmp/lion-lockfile-interop-0.0.0.tgz lockfile-interop check --root .
   ```

   Exit `0` = both locks resolve the same versions; exit `1` = drift, with the offending packages named:

   ```text
   pnpm-lock records: 10, package-lock records: 9

   only in pnpm-lock.yaml (1):
     ansi-styles@4.3.0
   different versions (1):
     ansi-styles: pnpm 3.2.1, 4.3.0 | npm 3.2.1
   ```

3. **Act on the result.** Either regenerate the npm lock in that repo (`npm update --package-lock-only
<pkg>` for the drifted packages, or a full `npm install --package-lock-only`) or pin the package in
   `package.json` when the two managers genuinely disagree (peer-heavy packages are the usual case).
   `lockfile-interop report` prints the same comparison but always exits `0` — useful to read before
   deciding.

4. **Wire it into that repo's CI**, where it fails the build instead of failing a human:

   ```yaml
   - run: npx --yes @lion/lockfile-interop check --root . --require
   ```

   `--require` turns "this repo has no `pnpm-lock.yaml`" into a failure, which is what a repo that already
   installs with pnpm wants. Without it the check is a no-op there.

Requirements: Node 22+ (ESM + `node --test`) and registry access so npx can install `yaml`. Commands:
`check` (exit 1 on drift), `report` (never fails), `generate` (`--out`, `--dedupe`), `--json` on any of
them for machine-readable output.

## Prior art (checked before writing this)

- `@npvd/npvd` (mdmower/node-package-version-diff, MIT, v1.0.1) diffs two lock files or two git
  revisions; npm v2/3, pnpm v6/9, yarn berry; text/JSON/CSV. `--mode` applies to _both_ sides, so it
  compares locks of the same manager: it cannot diff a pnpm lock against an npm lock. Good for "what
  changed between two tags", not a gate.
- `lockfile-tools` (ljharb, v1.3.1) parses npm/yarn/pnpm/bun/vlt locks on top of `@npmcli/arborist` —
  a parser toolkit, no comparison and no policy.
- `pnpm-lock-to-npm-lock` (v1.0.0, last published 2023) converts pnpm-lock to package-lock, explicitly
  for scanning only: it emits `lockfileVersion` 2 with `@`-suffixed keys that `npm ci` rejects.
- `ndom91/pnpm-lock-to-package-lock` does the same conversion but was never published to npm, and writes
  one entry per package name, so a second version of the same name overwrites the first.
- `synp` (v1.9.14) converts yarn.lock to/from package-lock.json; no pnpm support at all.
- `lockfile-lint` (v5.1.0) lints one lockfile against security policies; no cross-manager comparison.
- `@pnpm/lockfile.fs`, `@pnpm/lockfile-utils`, `@pnpm/dependency-path` are the official pnpm lockfile
  read/write utilities: building blocks, with no npm-lock side and no cross-manager view.
- `@cyclonedx/cyclonedx-npm`, `osv-scanner` and `syft` read `pnpm-lock.yaml` (or an SBOM) natively — a
  different direction: change the consuming tool instead of maintaining a second lock.

Nothing compares a pnpm lock against an npm lock in one repo, so the gate itself is not a solved
problem. The _parsing_ could be delegated to `lockfile-tools` later; until then this stays policy-only
(~200 lines of JS plus the CLI), which is what makes it movable into a Lion toolbox package unchanged.

## Dependencies

`yaml` is declared in this package's own `dependencies`, which npm workspaces installs at the root, so
the parser is present as soon as `npm install` has run. That is why the CI step sits _after_ the install:
the first CI run of this gate failed because the check ran before the parser existed. Availability only
as a transitive dependency is not enough — declare what the tool imports.

Fixtures use only registry packages that really exist, with their real `sha512` integrity values, and
the fixture-internal packages are `private` and reachable only as workspace `link:` entries. Invented
names or invented hashes in test data get filed as security findings by external scanners, so drift is
produced by removing or re-versioning a real record instead of inventing one.

## What `check` compares

| Comparison                                        | Why it matters                                                                                 |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `name@version` records in both locks              | a version the pnpm lock resolves but the npm lock lacks is read by tooling and never installed |
| versions per package name                         | catches a package that exists in both but at different versions                                |
| manifest declarations (all importers) vs the lock | catches "dependency added to package.json, lock not regenerated"                               |

Local `link:` edges are resolved as links, never as versions — pnpm stores them as the literal string
`link:../dir`, which npm rejects (`Invalid Version: link:../dir`).

## `generate`

Converts `pnpm-lock.yaml` into an installable `package-lock.json` v3 without running npm. Placement is
one copy per requirer (resolution walks up the tree, so it is correct by construction); the consequence
is a much larger file than npm would write, which is why the check — not the generated file — is the
normal gate.
