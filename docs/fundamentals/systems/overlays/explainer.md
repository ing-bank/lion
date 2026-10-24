---
parts:
  - Explainer
  - Overlays
  - Systems
title: 'Explainer: what the disclosure system adds'
eleventyNavigation:
  key: Systems >> Overlays >> Explainer
  title: Explainer
  order: 60
  parent: Systems >> Overlays
---

# What the disclosure system adds on top of the platform

The platform now ships most of the machinery for overlays: the `popover` attribute, `<dialog>` with
`showModal()`, `closedby`, Invoker Commands (`command`/`commandfor`), `::backdrop` and CSS anchor
positioning. This system does not re-implement any of it. It adds the parts the platform deliberately
leaves to authors, and it adds one thing the platform does not address at all: **the same disclosure
can change shape with the context** — a collapsible on a narrow viewport, an overlay or a modal dialog
on a wide one — without tearing down the DOM, without re-parenting and without losing focus or state.

See also [Research: predictable open/close](./research.md) for the state machine, the measurements and
the budget, and `packages/ui/components/disclosure-system/CONTEXT.md` for the vocabulary.

## 1. What the platform already gives you

Use it. Where the platform can do the job, the system stays out of the way.

| capability                                             | platform                                   | caveats you still own                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| top layer, no z-index fights, no overflow clipping     | `popover`, `<dialog>`                      | a popover can only be invoked by a real `<button>` declaratively; custom elements use the JS API                         |
| light dismiss, Escape to close                         | `popover="auto"`, `closedby` on `<dialog>` | Escape precedence between stacked layers is on you (see §3)                                                              |
| modal inertness + focus trap                           | `<dialog showModal()>`                     | without `inert` support you would need `aria-hidden` + `tabindex="-1"` yourself                                          |
| implicit `aria-expanded` on the invoker                | browsers, for `popovertarget` buttons      | only for button invokers                                                                                                 |
| implicit `aria-details` relationship                   | Chrome, Edge, Firefox                      | Safari sets `aria-expanded` only; the relationship may not be announced until the user leaves and returns to the invoker |
| automatic `group` role fallback                        | Chrome, Edge, Firefox                      | Safari does not add it; an unnamed group is often ignored anyway, so name it                                             |
| focus returns to the invoker when the popover closes   | browsers                                   | only when focus was inside the popover                                                                                   |
| tab order skips past-to-popover and continues after it | browsers                                   | only helps when invoker and popover are siblings; otherwise authors use `aria-owns`                                      |
| positioning relative to an anchor                      | CSS anchor positioning                     | engine support still varies; a polyfill is needed on older engines                                                       |
| keyboard-free invocation                               | `command`/`commandfor`                     | one command per invoker element                                                                                          |

## 2. What the platform does not give you — and what we add

Hidde de Vries and Scott O'Hara documented precisely where the platform stops:
[On popover accessibility](https://hidde.blog/popover-accessibility/) (with Scott O'Hara),
[which role to use when](https://hidde.blog/popover-semantics/),
[dialogs vs popovers](https://hidde.blog/dialog-modal-popover-differences/) and
[Popping preconceived popover ponderings](https://www.scottohara.me/blog/2025/03/14/popovers.html).

| gap (documented)                                                                                                                                                                                                                                                                             | what the disclosure system adds                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `popover` has **no role**: it adds behaviour, like `tabindex` or `contenteditable`, no semantics                                                                                                                                                                                             | the descriptor decides the semantics per use: menu, listbox, dialog, tooltip — chosen by the component, not guessed by us                 |
| **focus does not move into the popover** on invoke (unless the element is a `<dialog>`); you need `autofocus`                                                                                                                                                                                | a focus policy per descriptor: `elementToFocus`, or the first focusable, or nothing at all for a tooltip                                  |
| **no dismissal when focus leaves** (deliberate, to protect screen-reader users)                                                                                                                                                                                                              | an explicit opt-in for dismissal on focus-out, per descriptor, so the choice is visible instead of emergent                               |
| a popover does not have to be named or labelled                                                                                                                                                                                                                                              | an accessible-name requirement in the component contract, so a dialog-like disclosure is labelled by its heading                          |
| **no Escape precedence** between stacked layers: with a `<div role="dialog">` modal underneath, Escape closed the _dialog_ while a toggle-tip was open, and users lost the button they needed ([Adrian Roselli](https://adrianroselli.com/2023/05/brief-note-on-popovers-with-dialogs.html)) | one Escape policy: the innermost open disclosure closes first; a modal beats a non-modal; nested overlays coordinate instead of competing |
| the `aria-details` relationship may only be announced after leaving and returning                                                                                                                                                                                                            | we announce on open (a live-region-free, event-driven nudge to assistive tech) so the relation is usable immediately                      |
| no scroll locking, no backdrop semantics for non-modal                                                                                                                                                                                                                                       | `scrollLock` and `backdrop` as features, so they are opt-in and released again on close                                                   |
| no answer to **context switching** at all                                                                                                                                                                                                                                                    | §4: a descriptor swap morphs the same disclosure between collapsible, overlay and modal                                                   |

Everything above is a _feature_: it is loaded only when the descriptor asks for it. A disclosure that
merely opens and closes pays for none of it (measured: core 0.84 KB gzip, features 0.22–0.45 KB each).

## 3. Accessibility: what we do, and what we deliberately do not

### We do

- give the component a role and a name — the platform refuses to guess, so the component decides;
- keep `aria-expanded` in sync for invokers that are _not_ buttons, where no browser helps;
- keep the `aria-details`/`aria-controls` relation explicit and announce it when it appears;
- define focus: where it goes when the disclosure opens, that it returns to the invoker on close, and
  that a non-modal overlay never steals focus from a text field;
- make modality a switch, not an accident: `modal` means `showModal()`, hence inertness and a focus
  trap, and that trap is always temporary (WCAG 2.1.2);
- order Escape: innermost first, modal over non-modal, and never swallow it when the disclosure is
  already closed;
- warn (in development) when a popover-like disclosure is stacked over a modal dialog, because that
  combination is a known quagmire in the top layer
  ([WHATWG #9936](https://github.com/whatwg/html/issues/9936),
  [#10811](https://github.com/whatwg/html/issues/10811),
  [Top layer troubles](https://www.htmhell.dev/adventcalendar/2025/1/)).

### We do not

- add a role or a name automatically. Guessing a role is exactly what the platform refused to do, and
  it would be wrong for menus, listboxes and tooltips alike;
- pretend a popover is modal. Only `showModal()` makes the rest of the page inert;
- move focus into hover/focus tooltips, or trap focus in a non-modal overlay;
- replace the top layer, `::backdrop` or anchor positioning with our own versions.

## 4. Context switching without rebuilding the DOM

A menu is a collapsible in a narrow viewport and an overlay on a wide one. Its dialog sibling is
non-modal on a desktop and modal in a mobile flow. The DOM stays the same; only the _description_ of
the disclosure changes.

```js
const wide = matchMedia('(min-width: 768px)');

function applyContext() {
  disclosure.setDescriptor(
    wide.matches
      ? { closedby: 'any', anchor: '--nav-anchor', area: 'bottom' } // overlay in the top layer
      : { closedby: 'closest' }, // inline collapsible
  );
}

wide.addEventListener('change', applyContext);
applyContext();
```

Why this works without the usual damage:

1. **State lives in the machine, not in the DOM.** `open` is read from the state machine, so a change
   of shape never changes _whether_ it is open.
2. **The DOM is a projection.** One writer keeps the `[open]` attribute, `display` and dialog modality
   in step, so nothing re-parents the content node; the element keeps its identity and its children.
3. **Features are resources.** When the descriptor changes, the features that no longer apply are
   released and the new ones load lazily: `closedby` adds or removes the Escape listener, `anchor`
   adds or removes positioning, `modal` switches the projection from `show()` to `showModal()`.
4. **Focus survives.** The element is never disconnected, so the browser does not blur it and no
   `focus()` bookkeeping round-trip is needed. Where the platform forces a move (a dialog must be
   re-shown to become modal), the old focus owner is restored explicitly.
5. **Form state, scroll position and selection survive** for the same reason: the nodes are untouched.

The invariant is testable, and tested: after a descriptor swap the content node is the same object,
the focus stays on the same element, the state (`open`) is unchanged, and the set of held resources
differs only by what the new descriptor asked for.

## 5. What this means for a design system

- **One component, many presentations.** A menu, a tooltip, a dialog and a collapsible share one state
  machine and one a11y contract; the difference is a serializable descriptor.
- **Platform-first, polyfill-last.** Anchor positioning is the default; popper is a lazy fallback
  (0 KB until an engine needs it).
- **Cheap by default.** Closed overlays cost no features and no layout on first paint.
- **Predictable.** A stale update can never resurrect a closed disclosure, and transitions are
  synchronous where they are observable; see ADR
  [0002](https://github.com/ing-bank/lion/blob/master/packages/ui/components/disclosure-system/docs/adr/0002-state-machine-owns-truth-dom-is-a-projection.md).
- **Backwards compatible.** Existing extensions keep their entry point and their names through the
  compatibility layer; see ADR
  [0003](https://github.com/ing-bank/lion/blob/master/packages/ui/components/disclosure-system/docs/adr/0003-compat-layer-ships-as-subpath-exports.md).

## Sources

- Hidde de Vries (with Scott O'Hara), [On popover accessibility: what the browser does and doesn't do](https://hidde.blog/popover-accessibility/)
- Hidde de Vries, [Semantics and the popover attribute: which role to use when?](https://hidde.blog/popover-semantics/)
- Hidde de Vries, [Dialogs and popovers seem similar. How are they different?](https://hidde.blog/dialog-modal-popover-differences/)
- Scott O'Hara, [Popping preconceived popover ponderings](https://www.scottohara.me/blog/2025/03/14/popovers.html) and [popover accessibility](https://www.scottohara.me/blog/2024/03/22/popover-a11y.html)
- Adrian Roselli, [Brief Note on Popovers with Dialogs](https://adrianroselli.com/2023/05/brief-note-on-popovers-with-dialogs.html)
- Stephanie Eckles, [Top layer troubles: popover vs. dialog](https://www.htmhell.dev/adventcalendar/2025/1/), and the WHATWG issues [#9936](https://github.com/whatwg/html/issues/9936) and [#10811](https://github.com/whatwg/html/issues/10811)
- Open UI, [popover research explainer](https://open-ui.org/components/popover.research.explainer/)
