# Phase out `OverlaysManager`; keep one shared, version-neutral registry

Status: proposed

## What the manager does today

`OverlaysManager` glues two unrelated jobs together through a global singleton:

1. **Knowledge** — which overlays are live (`list`), shown (`shownList`), blocking (`blockingMap`) and the
   stacking order (`elevation`).
2. **Document side effects** — scroll lock, body metrics and scrollbar compensation, show-only, inert
   siblings.

Job 2 is only correct with knowledge of _every_ overlay on the page: a scroll lock may be released only
when the last overlay closes, metrics must be captured once and restored once, and elevation needs the
whole order — including overlays that belong to another version of Lion or of a Lion extension. That need
is why job 1 is registered in `singletonManager` under `@lion/ui::overlays::0.x`, which makes all 0.x
versions share one instance of _one_ version's class:

```js
// components/disclosure-system/src/singleton.js
singletonManager.set('@lion/ui::overlays::0.x', new OverlaysManager());
export const overlays = lazifyInstantiation(getOverlaysManager);
```

## The three constraints

1. **The knowledge must be shared across versions.** A per-version registry cannot coordinate a page-wide
   scroll lock or a page-wide stacking order.
2. **Global state may not be read from the DOM.** `querySelectorAll` is expensive on every transition, it
   misses everything inside a shadow root, and it fails for a host element that is not in the document tree
   at that moment (overlay content is regularly rendered elsewhere). A registry built on querying elements
   is unreliable by construction.
3. **A version may not execute another version's class internals.** That is what breaks today: a foreign
   manager reads and calls members of controllers it did not create.

## Decision

**One shared registry object with a small, documented, version-neutral shape: plain data plus one event
target.** No DOM queries, no attributes, no foreign instances.

It is obtained through a global key, so duplicated copies of the module converge on the same object:

```js
const registry =
  globalThis[Symbol.for('lion::overlays::registry')] ||
  (globalThis[Symbol.for('lion::overlays::registry')] = createRegistry());
```

The first version on the page wins; every later version **adopts** the existing object. If the object it
finds does not have the shape that version knows, it leaves it alone and falls back to today's singleton
manager behaviour, so an older and a newer version can still share a page.

The shape carries primitives and ids only — no DOM nodes, no controller instances:

```js
{
  seq: 0,                                     // monotonic stacking order
  entries: Map<id, { flags, modal, openedAt, blocked: [id] }>,
  events: new EventTarget(),                  // shown | hidden | request-hide | restore | teardown
  styles: new Set(),                          // reference count for the shared <style data-overlays>
}
```

| what a controller uses       | meaning                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| `register({ flags, modal })` | returns an `id`; the controller keeps owning its own state and DOM                 |
| `unregister(id)`             | on close or teardown; the entry disappears                                         |
| `countOf(flag)`              | derived from `entries`, e.g. how many live overlays prevent scroll                 |
| `order(id)`                  | position in `seq` order, used for `elevation`                                      |
| `requestShowOnly(id)`        | dispatches `request-hide` for the other entries and records which ids were blocked |
| `events`                     | the only channel for cross-version coordination                                    |

### Scope: per realm, and inert without a DOM

`globalThis` is the carrier precisely because it exists everywhere, including Node: the state must not need
a DOM to be held, or the layer cannot be used for SSR. But "global" has to be scoped correctly:

| environment                     | registry                                                                                                                                                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a browser document              | one per realm, stored on `globalThis` under the symbol, so every version and every duplicated bundle on that page shares it                                                                                             |
| an iframe or another `Document` | its own `globalThis` → its own registry. Separate pages must not share a scroll lock or a stacking order                                                                                                                |
| SSR / Node, no `document`       | **not registered globally.** A process-wide registry would leak overlays between concurrent requests and let one request's body state affect another's render. The registry is created per render and discarded with it |
| hydration                       | entries are runtime state and never serialized; the client registry starts empty and fills as components connect                                                                                                        |

So `register()` never touches the document (usable during SSR), the features that perform document side
effects — scroll lock, body metrics, inert siblings — check for a DOM and stay inert on the server, and
nothing in the registry has to match between server and client.

## Rules

- **The registry is realm-scoped and never serialized.** One per realm in a browser, a per-render one
  under SSR, nothing persisted: sharing across processes or requests would leak page-wide state between
  unrelated documents.
- **The registry is the only source of global state.** No attribute, no `querySelector`, no
  `element.closest(...)` decides anything. Local dev-only markers may still exist, but nothing reads them.
- **Entries are data.** The registry never holds a controller instance — only an id, flags, order. It can
  therefore be created by one version and used by another without either version's internals leaking.
- **Coordination is asking.** The registry dispatches on its own `EventTarget`; a version listens with a
  handler it created itself and then acts on **its own** controllers. Nothing in the registry calls a
  method on a foreign class.
- **`register` / `unregister` are the only mutations.** Counters are derived, so two versions cannot
  disagree about how many overlays prevent scroll: there is one map and one number computed from it.
- **Teardown unregisters**, and the shared stylesheet is reference-counted by the entries instead of by
  whichever version created it first.

## Behaviour mapping

| today on `OverlaysManager`                        | after                                                                                                                                                      |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list`, `add`, `remove`                           | `registry.entries`, plus the existing per-version static list (`DisclosureController.list`) for version-scoped needs such as the hidden-popup check        |
| `shownList`, `show`, `hide`                       | entry `openedAt` / `seq`, owned by the controller that opens; `elevation` from `registry.order(id)`                                                        |
| `requestToPreventScroll`, `requestToEnableScroll` | a `scroll-lock` feature: capture and lock when `countOf('preventsScroll')` goes 0 → 1, restore when it goes 1 → 0 — page-wide, because the count is shared |
| `requestToKeepBodySize`                           | the same feature, behind the same shared count: metrics captured once and restored once                                                                    |
| `requestToShowOnly`, `retractRequestToShowOnly`   | `registry.requestShowOnly(id)` → `request-hide` events plus `blocked` ids on the entry; `restore` for the way back                                         |
| `siblingsInert`                                   | derived from entries: any live entry that is modal                                                                                                         |
| `teardown()`                                      | each controller unregisters itself; `styles` empties and the style tag is removed                                                                          |
| `singleton.js` registration                       | gone from the new layer; kept as a deprecated facade behind `<html data-lion-overlays="singleton">`                                                        |

## Backwards compatibility

- `OverlaysManager` stays as a **deprecated facade** for one major, implemented on the registry, so
  `overlays.list`, `overlays.shownList`, `overlays.add(...)`, `overlays.requestToPreventScroll()` keep
  working for existing code.
- `import { overlays } from '@lion/ui/overlays.js'` keeps resolving.
- No consumer changes; only the place where the truth lives changes.

## Considered options

- **Global state in DOM attributes, read with `querySelectorAll`.** Rejected: expensive per transition,
  unreliable inside shadow roots and for content outside the document tree, and it needs extra attributes
  to tell a live overlay from a hidden one.
- **A `window` property holding a manager instance.** Rejected: the same class-instance fusion as
  `singletonManager`, in a more visible hiding place.
- **Keying `singleton-manager` by exact version.** Rejected: two managers mean two scroll locks and two
  stacking orders — coordination bugs instead of version bugs.
- **A shared registry without an adopt-and-fall-back rule.** Rejected: a version on the page that predates
  this change would be invisible to the new one.

## Plan, with a gate per step

1. **Registry next to the manager.** Controllers register and unregister; the manager's lists and counters
   are derived from it while it still runs as today. Gate: existing suites unchanged (dialog, the private
   my-ui matrix) plus a test that `manager.list` / `manager.shownList` equal the registry contents.
2. **Features read the registry.** Scroll lock and body metrics become count-based. Gate: two "versions" in
   one test — two module identities sharing the registry through the global key, one of them with an
   overlay rendered inside a shadow root — end with exactly one scroll lock and one metric capture, and
   no DOM query is involved.
3. **Server safety.** Import the layer in Node, register a controller with no DOM, render, and assert that
   nothing was stored globally, that two consecutive renders do not leak into each other, and that no
   document side effect was attempted. Gate: a Node-side test, with the browser suites unchanged.
4. **Blocking and elevation through the registry.** `request-hide` / `restore` and `seq` order. Gate: three
   overlays from two "versions" → one shown, two blocked, restored in order; elevation follows `seq`.
5. **Facade.** `OverlaysManager` is implemented on the registry; the singleton registration moves behind
   `<html data-lion-overlays="singleton">`. Gate: the old public API still passes its suite.
6. **Removal in a major.** Delete the facade and the singleton dependency from the overlay layer, with a
   changeset describing the migration.

Steps 1–4 are additive and can land before any behaviour switches; step 5 is where multi-version consumers
start to profit.
