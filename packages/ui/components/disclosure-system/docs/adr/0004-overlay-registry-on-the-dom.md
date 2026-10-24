# The overlay registry lives on the DOM, not in a global singleton

Status: proposed

Every overlay in a document is coordinated by one `OverlaysManager`: it holds `list` and `shownList`,
decides which overlay may be shown, applies `siblingsInert`, keeps the body size and scroll behaviour
straight and can block other overlays. Today it is registered as a _global singleton_:

```js
// components/disclosure-system/src/singleton.js
singletonManager.set('@lion/ui::overlays::0.x', new OverlaysManager());
export const overlays = lazifyInstantiation(getOverlaysManager);
```

`singleton-manager` stores that in `globalThis[Symbol.for('lion::SingletonManagerClassStorage')]`, i.e.
in one global map keyed by a string. The key deliberately ends in `0.x`, so **all 0.x versions of Lion
share one manager instance** — whichever version created it first. That is a feature for a single
ing-web version (locale and overlays stay synchronised across duplicated packages) and a hazard for two:

| scenario                                 | what happens today                                                                                                                                                                                                                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| one version on the page                  | one manager, one `shownList`, one scroll lock: correct                                                                                                                                                                                                                                      |
| two ing-web versions, shared key (`0.x`) | the second version's controllers are registered in the _first_ version's manager instance. The manager calls version-specific members on foreign controllers and its internal shape may differ: coordination works by accident, and a minor release can change the shape of the fused state |
| two versions, key made exact-versioned   | two managers, each with its own `shownList` and its own scroll lock: "only one overlay at a time" holds _within_ a version, not between them; both fight over `inert` siblings and body margins                                                                                             |
| one version, manager replaced by an app  | works, but only through the same undocumented global map                                                                                                                                                                                                                                    |

The goal: several versions of ing-web on one page must run **without sharing JavaScript objects**, while
still coordinating one overlay at a time and one scroll lock — because the page, the user and the
accessibility tree are shared.

## Decision

Move the registry and the coordination surface to the DOM:

1. **Every manager is addressable from the DOM.** The stylesheet it already injects
   (`<style data-overlays>`) becomes its anchor: it carries `data-overlays-manager="<id>"` (a short,
   unique id). Content elements it manages get `data-overlay-manager="<id>"`, so "which manager owns this
   overlay" is `element.closest('[data-overlay-manager]')` — no JavaScript lookup, and a manager from any
   version can be found by any other version.
2. **Shared coordination state is published as attributes, not as instance state.** The document element
   reflects what is currently shown (`data-overlays-shown="<count>"`, and the ids of the shown managers),
   and the body keeps its existing scroll/margin variables. A version that cannot see another version's
   manager object can still see the DOM.
3. **Cross-version coordination happens through `document`-level events**, with a documented contract
   (same shape as the platform's `toggle` events):
   `lion-overlays-show`, `lion-overlays-hide`, `lion-overlays-teardown`, plus a cancelable
   `lion-overlays-before-show` whose `detail` carries `{ managerId, controller, phase }`. Events cross the
   version boundary; object identity does not. A version that does not know an event still leaves the
   attribute behind, which is what makes the contract degrade gracefully.
4. **`overlays` keeps working, but is version-scoped.** The export becomes "the manager of _this_ copy of
   `@lion/ui`" instead of "the manager of the page". `import { overlays } from '@lion/ui/overlays.js'`
   keeps resolving (backwards compatible), and the new
   `getOverlaysManagerFor(element)` resolves ownership through the DOM.
5. **The singleton stays available behind an explicit switch**, so a single-version application sees no
   change and an application that needs the old sharing can ask for it:
   `<html data-lion-overlays="singleton">` keeps today's global instance (default until the switch is
   flipped in a major); `data-lion-overlays="scoped"` uses per-version managers with DOM coordination.

## Considered options

- **Keep the global singleton and version the key exactly.** Rejected: two managers on one page means two
  sources of truth for "shown" and two scroll locks, i.e. coordination bugs instead of version bugs.
- **Share the manager through a `window` global instead of `singleton-manager`.** Rejected: the same
  object-sharing problem in a different hiding place; `singleton-manager` exists precisely to make that
  map global, and its documentation still recommends the "latest version registers first" dance.
- **Coordination through the events only, no ownership attribute.** Rejected: an older version that does
  not listen to the new events would be invisible; the attribute is the fallback that makes the contract
  observable from the outside (and debuggable in devtools).
- **Let each overlay manage itself completely (no manager at all).** Rejected for now: document-wide
  features (one overlay at a time, scroll lock, body size, inert siblings) have to live somewhere shared;
  this decision only changes _where_.

## Consequences

- Two ing-web versions can coexist: each owns its overlays, and the DOM coordinates them. No class from
  one version is instantiated or called by another.
- The manager id appears in the DOM, which makes cross-version problems visible in devtools (`data-overlays-shown`,
  `data-overlays-manager`) instead of hidden in a symbol-keyed global map.
- Cost: one extra attribute per manager and per managed element, and the event contract has to be
  documented as public API (its shape may not change casually).
- `singleton-manager` is no longer required by the overlay layer; the dependency stays in the repo for
  `localize` and `icons` until those follow the same reasoning.
- Backwards compatible by construction: the current behaviour is the default, the new mode is opt-in, and
  `overlays` keeps resolving for existing code.

## Plan, with a gate per step

1. **Attribute + ids.** Manager gets an id; `<style data-overlays>` carries it; managed elements get
   `data-overlay-manager`. Gate: no behaviour change, existing suites (dialog, my-ui matrix) unchanged.
2. **DOM-published state.** `data-overlays-shown` on the document element, kept in sync by `show`/`hide`/
   `teardown`. Gate: as above plus a test that the attribute follows the manager.
3. **Event contract.** `lion-overlays-before-show` (cancelable) / `-show` / `-hide` / `-teardown` on
   `document`. Gate: two managers in one test — one acting as a "foreign version" that only listens to
   events and reads attributes — must still end with one shown overlay and one scroll lock.
4. **Version-scoped `overlays` + `getOverlaysManagerFor`.** Gate: the existing import path still works, the
   `data-lion-overlays="singleton"` mode still passes the old suites.
5. **Flip the default in a major**, remove the singleton registration from the overlay layer, and note the
   migration in the changeset.

Steps 1–3 are additive and can land before the behaviour switch; step 4 is where consumers with two
versions on a page start to profit.
