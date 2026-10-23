# change-graph

A small, codebase-agnostic engine that answers **"which units (components, packages, …) are affected by a change?"** and, optionally, **"is what I verified earlier still valid?"**.

It has no knowledge of any particular repository. Everything repo-specific (what a unit is, which files count, which values reference each other, how themes are scoped) is passed in by the consumer.

## Why

A pipeline that runs everything on every change is the safe default, and it is why one shared file
costs a full run: a change to a base mixin selects every unit that reaches it, whether or not the
change can be observed. The expensive part is not the test runner, it is what CI charges for it -
the screen reader jobs are the extreme case, because they need a desktop, a real reader and a
machine setup step before the first assertion.

Measured on the Lion repository (import graph over `packages/`: 2049 files, built in about a second):

| change                                                    | selection                                                                                |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `form-core/src/validate/ValidateMixin.js` (a shared base) | 29 of 53 units, 94 of 173 test files                                                     |
| `input-iban/src/LionInputIban.js`                         | 2 units, 12 test files (with `--include-sr`)                                             |
| nothing a component test can reach                        | no reader runner at all: one ~60s selection job instead of ≈7 min macOS + ≈7 min Windows |

## Layers

1. **Core (impact)**
   - `buildImportGraph({ root, include, includeResolved, resolve })` builds a `Map<file, Set<dependency>>` for JS/TS. Modules are parsed with [oxc-parser](https://oxc.rs) (static imports, `export … from`, and string-literal `import()`), specifiers are resolved with [oxc-resolver](https://github.com/oxc-project/oxc-resolver), so `package.json` `imports` aliases, `exports` and package self-references work without a hand-written alias list. External packages (`node_modules`, or anything outside `root`) are not followed.
   - `collectUnitFiles(graph, unitOf)` maps every unit to all files it can reach; `findAffectedUnits(unitFiles, changedFiles)` returns the units that reach a changed file. `collectReachable` and `invertGraph` are available for custom queries.
   - `resolveReferenceTrace`, `reachesProperty` and `collectReferenceInputs` walk a **reference tree** of declarations (for example CSS custom properties: base → alias → component). Nodes are `{ selector, property, value, source }`; you provide `getReferences(value)` and `accept(node, scope)`, so themes, surfaces or any other dimension are just opaque scope keys.
2. **Verification state (optional)**
   - `hashFiles`, `hashValue`: content hashes (working-tree changes included, no git SHAs).
   - `encodeValues` / `decodeValues`: compact storage of resolved values, so a later run can say _which_ value changed.
   - `selectRecordedEntries` / `getExitCode`: record only chosen entries; exit `0` when clean or recording, `1` when stale.

Reporting, external sources (e.g. design-tool polling) and the build step that produces generated inputs are deliberately **not** part of the package.

## Example

```js
import { buildImportGraph, collectUnitFiles, findAffectedUnits } from 'change-graph';
import path from 'path';

const root = path.resolve('packages/app');
const graph = await buildImportGraph({ root });
const units = collectUnitFiles(graph, file => /components\/([^/]+)\//.exec(file)?.[1] ?? null);
console.log(findAffectedUnits(units, [path.resolve('packages/app/shared/util.js')]));
```

## Repo configuration

The ing-web specific wiring lives in the consumer, not in this package: `scripts/code-connect/stale-detector.js` supplies the component root, the token build, the `#tokens` source scanning, theme/surface scoping, the expressive-token predicate and the Figma comparison.

## Tests

```sh
npm run test:node --workspace change-graph
```

## Selecting the tests a change can affect

`selectTests` (and the `change-graph` CLI) turns a change set into the test files that have to run.

```sh
npx change-graph --mode=local                      # working tree against HEAD
npx change-graph --mode=pr --base=origin/master     # this branch against its merge base
npx change-graph --mode=release --format=json       # since the last release tag of each package
npx change-graph --full                             # everything: the "run all" escape hatch
```

The selected test files go to **stdout** and the reasons to **stderr**, so a workflow can feed the
list straight to a runner and still show why something ran:

```yaml
- run: |
    files="$(npx change-graph --mode=pr --base=origin/master --include-sr --format=args)"
    npm run test:sr -- --files "$files"
```

Where the change set comes from:

| mode      | change set                                    | why                                                              |
| --------- | --------------------------------------------- | ---------------------------------------------------------------- |
| `local`   | `git diff HEAD` **plus untracked files**      | a brand new component is untracked until it is added             |
| `pr`      | `git diff --merge-base base...HEAD`           | three-dot: the target branch's own commits are not "this change" |
| `release` | since the newest tag of every touched package | this repo tags per package, not per repository                   |

What a unit is: the **test directory of a test file**. A changed source file affects every unit that
reaches it, transitively; a changed test file affects its own unit; a changed file nothing can reach
is reported as a reason instead of being skipped.

Dependencies are compared on the semantic fields of the lockfile only (`version`, `resolved`,
`integrity`, `resolution`), for npm and pnpm. npm rewrites the `dev`/`devOptional` flags of hundreds
of entries on every install, which says nothing about what a test consumes. A dependency that runs
_inside_ every test (the test runner, playwright, mocha, `@open-wc/testing`, wireit, patch-package)
means a full run; so do the files that change how tests run (the root `package.json`, the lockfiles,
the `web-test-runner*` configs, `.github/workflows/`).

Anything that cannot be resolved - no merge base, an unreadable lockfile - is a **full run with a
reason**, never a silent skip. `--full` is the explicit version of the same thing, and the runtime
that uses this selection is expected to honour it.

The screen reader tests (`*.sr.test.js`) are only selected with `--include-sr`: they need a real
NVDA or VoiceOver desktop, so they run in their own workflow.

### Reusing the computation between tools

`lint`, `test:node`, `test:browser` and the screen reader flow all ask the same question about the
same working tree, and they usually ask it at the same time (`run-p`). The answer is memoised per
state of the tree, keyed on a **content** hash: the base revision, every touched file _and its bytes_,
the semantic lockfile changes, the test globs, and a version of this logic. Not the git status -
the same content after an edit has to hit, and a touched file that is byte-identical must not miss.

The first tool to ask claims the key and writes the result atomically; the others wait briefly for
that answer instead of building the same import graph again, and compute it themselves if it never
arrives. Measured in this repository, four tools started together on a cold cache: one computation,
1.7s total, byte-identical output; warm, a call is ~0.4s instead of ~1.6s.

`--no-cache` (or `CHANGE_GRAPH_NO_CACHE=1`) turns it off. Results live in
`node_modules/.cache/change-graph`, outside the repository when there is no `node_modules`. Anything
that cannot be hashed means no caching - never a stale answer.
