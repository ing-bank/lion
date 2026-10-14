# change-graph

A small, codebase-agnostic engine that answers **"which units (components, packages, …) are affected by a change?"** and, optionally, **"is what I verified earlier still valid?"**.

It has no knowledge of any particular repository. Everything repo-specific (what a unit is, which files count, which values reference each other, how themes are scoped) is passed in by the consumer.

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
