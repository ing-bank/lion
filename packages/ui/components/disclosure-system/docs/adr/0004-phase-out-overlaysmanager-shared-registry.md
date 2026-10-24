# Phase out `OverlaysManager`; keep one shared registry of live overlays

Status: proposed

## What the manager actually does

`OverlaysManager` owns two unrelated things and glues them together through a global singleton:

1. **Knowledge** — which overlays are live (`list`), which are shown (`shownList`), which one blocks the
   others (`blockingMap`), and what the stacking order is (`elevation`).
2. **Side effects on the document** — scroll lock, body metrics and scrollbar compensation, show-only
   (blocking) and inert siblings.

Part 2 can only be correct with knowledge of _every_ overlay on the page: a scroll lock may only be
released when the last overlay closes, body metrics must be captured once and restored once, and the
topmost overlay must be known for elevation — **including overlays that belong to another version of Lion
or of a Lion extension**. That is why part 1 is registered globally today:

```js
// components/disclosure-system/src/singleton.js
singletonManager.set('@lion/ui::overlays::0.x', new OverlaysManager());
export const overlays = lazifyInstantiation(getOverlaysManager);
```

`singleton-manager` keeps that in `globalThis[Symbol.for('lion::SingletonManagerClassStorage')]`, one map
keyed by a string, with `0.x` meaning "all 0.x versions share it". So on a multi-version page, one
version's manager instance holds the other version's controllers and calls version-specific members on
them.

The decision: **remove the manager as the owner, keep the knowledge.**

## The registry: one DOM structure every version can read

No instance, no singleton, no shared object. Every live overlay projects its own entry onto its host
element, and what used to be method calls becomes selectors:

```html
<lion-dialog
  data-overlay-registry="o7"
  data-overlay-state="open"
  data-overlay-flags="preventsScroll blocksOthers"
  data-overlay-elevation="3"
></lion-dialog>
```

| what the manager held            | the query that replaces it                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `list`                           | `document.querySelectorAll('[data-overlay-registry]')`                                                  |
| `shownList`                      | `document.querySelectorAll('[data-overlay-state="open"]')`                                              |
| how many overlays prevent scroll | `[data-overlay-state="open"][data-overlay-flags~="preventsScroll"]`                                     |
| `elevation`                      | the position of an entry among the open ones (topmost = highest), computed by the controller that opens |
| `blockingMap`                    | `[data-overlay-blocked-by="o7"]` on the entries that were blocked                                       |

The registry lives on the elements themselves on purpose: it is visible in devtools, it survives module
duplication, and a version that knows nothing about our events can still be understood by reading
attributes.

## Cross-version coordination: ask, never call

A version may not call a method on another version's controller. It asks the _element_, and the owning
version answers:

```js
sibling.dispatchEvent(
  new CustomEvent('lion-overlays-request-hide', {
    bubbles: true,
    detail: { requestedBy: myId, reason: 'showOnly' },
  }),
);
```

The owning controller listens on its own host element, hides itself, and its projection updates
`data-overlay-state` — which is how every other version, including ones that do not know the event,
still sees what happened. Document-level `lion-overlays-before-show` (cancelable), `lion-overlays-show`
and `lion-overlays-hide` are the notification contract; attributes are the fallback.

## Behaviour mapping

| today on `OverlaysManager`                        | after                                                                                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `list`, `add`, `remove`                           | registry entries; the existing per-version static list (`DisclosureController.list`) keeps serving version-scoped needs such as the hidden-popup check |
| `shownList`, `show`, `hide`                       | `data-overlay-state` + `data-overlay-elevation`, written by the controller when it projects                                                            |
| `elevation`                                       | computed from all open entries, not assigned by one owner                                                                                              |
| `requestToPreventScroll`, `requestToEnableScroll` | a `scroll-lock` feature queries the registry: lock when it is the first open entry with the flag, release when the last one of _any_ version closes    |
| `requestToKeepBodySize`                           | the same feature: body metrics and scrollbar compensation, captured once and restored once, guarded by the same cross-version count                    |
| `requestToShowOnly`, `retractRequestToShowOnly`   | `lion-overlays-request-hide` to the other entries plus `data-overlay-blocked-by`, so the blocked set is restored exactly                               |
| `siblingsInert`                                   | derived from the registry: any open entry that is modal                                                                                                |
| `teardown()`                                      | each controller tears itself down and removes its entry; the shared `<style data-overlays>` is reference-counted by entries                            |
| `singleton.js` registration                       | removed from the new layer; kept as a deprecated facade behind `<html data-lion-overlays="singleton">`                                                 |

## What stays for backwards compatibility

- `OverlaysManager` stays as a **deprecated facade** for one major, implemented on the registry and the
  events, so `overlays.list`, `overlays.shownList`, `overlays.add(...)`,
  `overlays.requestToPreventScroll()` keep working.
- `import { overlays } from '@lion/ui/overlays.js'` keeps resolving.
- No consumer changes; only the place where the truth lives changes.

## Why this is better

- The knowledge is version-agnostic: the DOM is the same object for every version, classes are not.
- A version never executes code from another version's class.
- The manager's two responsibilities are separated — state in the registry, side effects in features —
  which also makes scroll lock and body compensation testable without a manager.
- It is observable: devtools show which overlays are live, open, blocking, and with which elevation.

## Plan, with a gate per step

1. **Registry projection.** Every controller writes its entry (id, state, flags, elevation) while the
   manager still runs as today. Gate: existing suites unchanged (dialog, the private my-ui matrix), plus a
   test that the registry query equals `manager.list` / `manager.shownList`.
2. **Features read the registry.** Scroll lock and body metrics become query-based; the manager's counters
   are derived from the registry during the transition. Gate: a foreign entry (a plain element carrying
   registry attributes) must prevent a second version from double-locking and double-compensating — the
   multi-version case in one test.
3. **Blocking via events.** Show-only becomes `lion-overlays-request-hide` + `data-overlay-blocked-by`.
   Gate: three overlays from two "versions" → one shown, two blocked, restored in order.
4. **Facade.** `OverlaysManager` is implemented on the registry; the singleton registration moves behind
   `<html data-lion-overlays="singleton">`. Gate: the old public API still passes its suite.
5. **Removal in a major.** Delete the facade and the singleton dependency from the overlay layer, with a
   changeset describing the migration.

Steps 1–3 are additive and can land before any behaviour switches; step 4 is where multi-version consumers
start to profit.
