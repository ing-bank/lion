---
parts:
  - Research
  - Overlays
  - Systems
title: 'Research: predictable open/closed'
eleventyNavigation:
  key: Systems >> Overlays >> Research
  title: Research
  order: 50
  parent: Systems >> Overlays
---

# Research: a predictable, platform-first overlay system

This page summarises the research and the plan for a clean overlay layer: one that cannot produce
timing races, that is tree-shakable with lazily loaded features, that renders **closed** so it costs
nothing before first paint, and that uses platform and Open UI terminology. On top of it sits a
compatibility layer that keeps current extensions working.

The plan below is grounded in measurements and reproductions from the current branch
(`feat/overlay-disclosure-system-refactor`), not in theory.

## 1. The problem, as measured

The current implementation keeps **two authors of the same truth**: a logical flag (`opened`) and the
DOM (`wrappingDialogNode.style.display !== 'none'`). Every race we found is a window in which those
two disagree:

| symptom                                    | reproduction (unmodified tests)                                                               | cause                                                                                                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| overlay re-opens right after closing       | `lion-dialog > should close the popup dialog after rendered from cache`: 40 passed / 1 failed | a consumer's Lit update mirrors its own (stale) `opened: true` back into the controller, which issues a new `show()`                               |
| second `Escape` no longer closes           | `my-dialog > combobox integration > …second Escape`: 2 passed / 1 failed                      | the close-on-Esc handler bailed out early whenever focus sat in an input field                                                                     |
| order dependent failure in nested overlays | `Nested hidesOnEsc / hidesOnOutsideEsc`, 1 in 2 runs                                          | a controller torn down while still shown left a modal `<dialog>` open; the browser then ignores later `focus()` calls, so `Escape` lands elsewhere |

Measurements on the overlay entry as it exists today (`esbuild --bundle --minify` + `gzip -9`):

| part                                                    | min     | gzip        |
| ------------------------------------------------------- | ------- | ----------- |
| `@lion/ui/overlays.js`, lit external (the layer itself) | 70.2 KB | **20.5 KB** |
| `@lion/ui/overlays.js`, incl. lit                       | 85.7 KB | 26.1 KB     |
| `@popperjs/core`                                        | 20.4 KB | **7.5 KB**  |
| `lit` (host's own cost, not the layer)                  | 15.8 KB | 6.2 KB      |
| probe core: state machine + projection + events + epoch | 821 B   | **433 B**   |

So: the layer is 20.5 KB gzip, of which 7.5 KB is positioning, and the actual open/close logic can be
~0.4 KB. That asymmetry is what this plan exploits.

## 2. Terminology: platform and Open UI are the source

The glossary lives in
[`packages/ui/components/disclosure-system/CONTEXT.md`](https://github.com/ing-bank/lion/blob/master/packages/ui/components/disclosure-system/CONTEXT.md).
The rule that removes the naming collision (`open` property versus an `open()` method) comes from the
platform itself:

- **`open` is a state**, never an action: `<details open>`, `<dialog open>`, `dialog.open`, CSS `:open`.
- **The platform's actions are `show*` and `close`**: `showPopover()`, `hidePopover()`,
  `togglePopover()`, `showModal()`, `close()`, and the Invoker Commands
  `show-popover`, `hide-popover`, `show-modal`, `close`, `toggle-popover`. There is deliberately **no
  `open` command**.

Therefore: `open` / `closed` = state (property, attribute, `:open`); `show` / `hide` / `toggle` = actions.

The platform mixes its own pair — `showPopover()` with `close()`, and an Invoker Command literally named
`close` — but we do not adopt that for our own API: `show`/`hide` are opposites, `open` stays the only
state word, and `close()` is kept as a documented alias for code that already calls it
(`docs/guides/principles/terminology.md`).
One word per concept, identical on the controller, on the host element, in the docs and in the
platform. See ADR
[0001](https://github.com/ing-bank/lion/blob/master/packages/ui/components/disclosure-system/docs/adr/0001-open-is-state-show-close-toggle-are-actions.md).

| concept                    | platform / spec                                                              | legacy alias (compat layer)                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `open`                     | `open` attribute/property, `:open`                                           | `opened`, `isShown`                                                                                                       |
| `show` / `hide` / `toggle` | `showPopover/hidePopover/togglePopover`, `showModal/close`, invoker commands | `show()` / `hide()` / `toggle()`                                                                                          |
| `beforetoggle` / `toggle`  | `ToggleEvent` with `newState` / `oldState`                                   | `before-show\|show\|before-hide\|hide` and the host events `before-opened\|opened-changed\|before-closed\|closed-changed` |
| `invoker`                  | `commandfor`, `interestfor`                                                  | `invokerNode`, `slot="invoker"`                                                                                           |
| `content`                  | slotted element / popover target                                             | `contentNode`                                                                                                             |
| `anchor`                   | CSS `anchor-name`, `position-anchor`, `position-area`                        | `placementMode: 'local'`                                                                                                  |
| `backdrop`                 | `::backdrop`                                                                 | backdrop element                                                                                                          |
| `modal`                    | `showModal()`                                                                | `trapsKeyboardFocus`                                                                                                      |
| `closedby`                 | `closedby="any \| closest \| none"`                                          | `hidesOnEsc` + `hidesOnOutsideEsc`                                                                                        |
| scroll lock                | no platform API (own feature)                                                | `preventsScroll`                                                                                                          |

## 3. The three layers

```
packages/ui/components/disclosure-system/                  ← clean layer, standalone, tree-shakable
  core/DisclosureCore.js     state machine, single DOM projection, beforetoggle/toggle, epoch
  core/registry.js           feature registry: { when: config => boolean, load: () => import(…) }
  features/position.js       CSS anchor positioning first, popper only as a lazy polyfill
  features/{arrow,focus,esc,outside,scroll-lock,backdrop}.js
  index.js                   export { Disclosure }         (usable on its own, no Lit required)
  CONTEXT.md, docs/adr/      glossary and decisions

packages/ui/components/overlays/                            ← compatibility layer (unchanged import path)
  index.js                   export { OverlayController, OverlayMixin, ArrowMixin }
  legacy-adapter.js          alias → canonical mapping (open ⇄ opened, show/hide unchanged, 4 events → 2)
  legacy-timing.js           old timing quirks, dynamically imported only for legacy consumers

packages/ui/exports/overlays.js            → compatibility layer (existing path, identical behaviour)
packages/ui/exports/disclosure-system.js   → clean layer (already exists on the branch)
```

### The core

- `#state`: `'closed' | 'opening' | 'open' | 'closing'`. `open` reads from this, never from `display`.
- `#epoch`: incremented on every transition. `sync(open, observedEpoch)` ignores any request whose
  observation predates the current epoch — a stale mirror cannot resurrect an overlay, without any
  timing window, flag or value heuristic.
- `#project()` is the **only** DOM writer (dialog `open`, `display`, `content[data-open]`), so no two
  code paths can interleave.
- Events are the platform's: `beforetoggle` (cancelable) and `toggle`, both with `newState`.
- `timing`: the observable part (state, events) flips **synchronously**; only animations, focus and
  positioning are awaited. The core exposes no promises: `toggle` is the platform-style
  subscription, and the compatibility layer derives the legacy `_showComplete`/`_hideComplete` from it,
  so existing extensions keep their promise API without the core carrying it.

### Features are lazy

```js
const registry = [
  { when: c => c.anchor, load: () => import('./features/position.js') },
  { when: c => c.arrow, load: () => import('./features/arrow.js') },
  { when: c => c.closedby !== 'none', load: () => import('./features/esc.js') },
  { when: c => c.modal, load: () => import('./features/focus.js') },
];
```

Loading happens on `show()` (after first paint) or earlier on intent (`interest`, `pointerenter`,
`focus`). Anticipation is allowed, blocking never.

### Fast first paint

An overlay starts closed **without JavaScript**: the element's own stylesheet hides it
(`[data-overlay]:not([data-open]) { display: none }`), so a page with ten closed overlays loads the
core and nothing else. Budget targets, derived from the measurements above:

| target                    | budget                                                                                          | status                                                                                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| core                      | measured 1.17 KB gzip; below 0.5 KB only if the feature loader and the resource ledger move out | the production core carries the machine, one projection, the epoch, lazy feature loading and the resource ledger; the stripped variant measured 0.43 KB |
| each feature              | ≤ 2 KB gzip (native anchoring 0 KB; popper polyfill 7.5 KB, lazy)                               | measured per chunk: esc 0.22, position 0.37, focus 0.45, scroll-lock 0.26 KB gzip; popper is its own 7.8 KB chunk, never in the core                    |
| full stack without popper | ≤ 3 KB gzip                                                                                     | core chunk 0.84 KB + registry 0.28 KB + the four features 1.3 KB = ~2.4 KB measured                                                                     |
| on first paint            | 0 KB features, 0 layout                                                                         | by design                                                                                                                                               |

## 4. Compatibility layer and its distribution

Where it ends up: a separate package, `@lion-ui-legacy`, that depends on `@lion/ui` and keeps presenting
the old surface to extensions that have not migrated. Until that package exists, the layer lives inside
`@lion/ui` and must be fully backwards compatible — the old names (`opened`, `isShown`, `show()`,
`hide()`, `_showComplete`, `_hideComplete`) and the old events are mapped onto the state machine without
re-timing anything.

The last two roadmap items are both about the same boundary: the overlay registry currently still uses
the global `singletonManager` key `@lion/ui::overlays::0.x`, which makes every 0.x version on a page share
one manager instance. ADR 0004 proposes to move that registry to the DOM (a manager id on the injected
`<style data-overlays>`, `data-overlay-manager` on managed elements, shown-state and coordination events on
`document`), so two versions of ing-web can run side by side without sharing JavaScript objects.

Distribution choice: **subpath exports inside `@lion/ui`**, not a new package. The existing import path
(`@lion/ui/overlays.js`) must keep resolving, so a separate package would need that path to re-export
it anyway — you would pay the indirection twice.

Trigger for the legacy shims is **implicit by entry point**: everything entering through
`overlays.js` gets `legacy-adapter.js` (measured 1.5 KB gzip; it owns the completion promises, so the
core does not have to). The behavioural quirks (`legacy-timing.js`) are imported
dynamically only when a legacy key or method is actually touched, so new consumers never pay for them.

What the compatibility layer must preserve (this list came out of the migration work, not from
guesswork):

- API names: `OverlayController`, `OverlayMixin`, `ArrowMixin`, `opened`, `show()`, `hide()`,
  `toggle()`, `isShown`, `_overlayCtrl`, `_overlayContentNode`, `_overlayInvokerNode`,
  `_showComplete`, `_hideComplete`.
- Events: `before-show`, `show`, `before-hide`, `hide`, `close-overlay`, `before-opened`,
  `opened-changed`, `before-closed`, `closed-changed`.
- Config keys: `placementMode`, `hidesOnEsc`, `hidesOnOutsideEsc`, `trapsKeyboardFocus`,
  `elementToFocusOnShow`, `inheritReferenceWidth`, `syncChildrenCloseState`, `viewportConfig`,
  `zIndex`.
- Timing semantics: `hide()` must still dispatch `hide` when the DOM was already hidden, and the
  completion promises must resolve as consumers expect. Because the core resolves them on terminal
  state, the adapter is a pure name/event mapping and does not re-time anything.

## 5. Element surface

Host elements follow the platform names and keep their configuration in **one serializable object**
(plain strings/booleans, so it can be passed around, logged and diffed):

```html
<my-dialog open closedby="closest" modal anchor="--my-dialog-anchor"> … </my-dialog>
```

```js
el.open; // state (boolean), reflects the [open] attribute
el.show(); // actions, mirroring show-popover / hide-popover / toggle-popover
el.hide();
el.toggle();
el.descriptor; // serializable: { closedby, modal, anchor, scrollLock, … }
el.addEventListener('beforetoggle', e => e.detail.newState);
el.addEventListener('toggle', e => e.detail.newState);
```

## 6. Roadmap, with a gate per step

Each step is verified against suites that are green today: `lion-dialog.test.js` 41/0,
the my-ui overlay matrix (6 fixtures) 190/2 — the 2 being harness artefacts that also fail on master
and on `@lion/ui@0.21.1` — and the full chromium suite 3869/0.

1. Core + `sync(epoch)` next to the existing code; compatibility adapter points at it. Gate: those
   three suites unchanged.
2. Features split out behind the registry and loaded lazily. Gate: as above plus a bundle check
   (core < 0.5 KB gzip, popper in no core chunk).
3. Resources ledger + the dev-only `invariants()` helper (`state`, `epoch`, `projected`, `resources`,
   exported separately so production bundles tree-shake it); any
   leaked modal or listener becomes a hard failure. Gate: nested `hidesOnEsc` green 5 runs in a row.
4. Element surface on platform names, config in one serializable object; `closedby`, `anchor`, `modal`
   as attributes.
5. **Done.** The duplicate implementation is gone: 8,020 lines removed from
   `packages/ui/components/overlays/src/` (OverlayMixin, OverlayController, ArrowMixin, OverlaysManager,
   singleton, styles, configurations) and from the duplicated tests. `overlays/src/OverlayController.js`
   remains as a three-line re-export, because the generated types of `menu/` and `input-*-dropdown/`
   import that exact path; that keeps those files byte-identical to master and keeps deep imports
   working. Exactly one implementation runs now, instead of `dedupeMixin` deciding by load order.

6. **Next.** Generate the mixin surface from the controller, per the principle in
   `docs/guides/principles/controller-to-mixin.md`: one transform, deterministic output, and types taken
   from the controller so a renamed member is a build error instead of a runtime mismatch. Gate: the
   dialog suite, the my-ui matrix and the disclosure tests pass unchanged against the generated surface.

## 7. Risks and open questions

- Browser support for CSS anchor positioning, `closedby`, `commandfor` and `interestfor` differs per
  engine; the research page should carry a support matrix that is re-checked before each release.
  Until anchor positioning is broadly available, the position feature keeps popper as a lazy polyfill.
- `::backdrop` styling has engine differences (transitions, `allow-discrete`).
- Deleting the duplicate legacy implementation is a public-surface decision in itself and needs its
  own check of downstream imports.
