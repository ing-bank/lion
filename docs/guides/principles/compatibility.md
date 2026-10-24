---
parts:
  - Principles
  - Compatibility
title: 'Forward-thinking compatibility'
eleventyNavigation:
  key: 'Principles: Compatibility'
  order: 80
  parent: Principles
  title: Compatibility
---

# Forward-thinking compatibility

Compatibility cannot be added after the fact: it is a property of how a system is layered. This page
records the strategy we apply to every system we reshape — general, with the disclosure/overlay work as
the worked example.

The goal is not "never change anything". It is: **consumers we cannot see must keep working, while the
system is free to move forward** — and both must be demonstrable, not hoped for.

## The strategy, in layers

| layer                      | what it does                                                                           | how it stays honest                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **1. Alias**               | old names keep working (`opened` → `open`, `close()` → `hide()`)                       | one direction, thin, marked `@deprecated`, listed in one table with its replacement                                |
| **2. Adapter**             | presents the old _timing and events_ (`before-show`, `_hideComplete`, `close-overlay`) | pure mapping: it never re-times a transition, and the consumer tests that await the old promises are what prove it |
| **3. Entry point**         | the import path is the contract, not the file location (`@lion/ui/overlays.js`)        | the compat layer ships as subpath exports, so it can move to its own package later without a consumer noticing     |
| **4. Generated surface**   | the mixin and its types are generated from the controller                              | a renamed member is a build error in the generator, a diff in the output, and a compile error in consumers         |
| **5. Feature boundary**    | platform drift is absorbed inside a feature, not in the contract                       | native first, polyfill lazy: the API is unchanged whether anchor positioning exists or popper does the work        |
| **6. Destination package** | the old surface eventually lives in `@lion-ui-legacy`, which depends on `@lion/ui`     | deleting it later is one step for consumers (uninstall/adjust imports), not a rewrite                              |

## Rules

1. **Timing is part of the contract.** Existing code awaits `_showComplete` / `_hideComplete` and asserts
   the order of `before-show` → `show`. The adapter maps those onto the state machine without changing
   when they happen. A compatibility layer that changes timing is a behaviour change with a compat label.
2. **Aliases are additive and enumerable.** Keep an alias only where consumers exist, document its
   replacement next to it, and keep the whole set in one table. If the table needs three columns of
   explanation, the alias should have been a migration instead.
3. **Never edit a consumer to make the new code fit.** When generated types or deep imports point at an old
   path, leave a re-export at that path. Those files stay byte-identical to the previous version, which is
   also what makes rebasing them onto master trivial.
4. **Move the boundary, not the behaviour.** New surface, new names, new events — and the old surface
   presented by a layer that is _deletable_: one entry point and one adapter file, not calls scattered
   through components.
5. **Test compatibility where it is consumed.** Our own suite proves the new system; a consumer repo (the
   private extension layer's overlay matrix) proves that nothing broke. Both gates, every step.
6. **Deprecate before deleting, delete only in a major.** The alias exists for a release cycle, its
   replacement is documented, and removal is announced in the changeset — never silently.
7. **Absorb the platform forward, not backward.** When an engine catches up (anchor positioning, `closedby`,
   invoker commands, `interestfor`), the feature switches route; the public API keeps the same words and
   the same shape. A support matrix is re-checked before each release, so the fallback never becomes the
   definition.

## Applied to the overlay layer today

| what                                                                                                          | state                                                                            | why it is safe                                                               |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `opened`, `isShown`                                                                                           | kept as deprecated getters next to `open`                                        | additive; consumers read the same value                                      |
| `show()`, `hide()`                                                                                            | unchanged (already opposite pair)                                                | the new core adopted the consumer's names, not the other way round           |
| `close()`                                                                                                     | documented alias of `hide()`                                                     | code that already calls it keeps working; removal in a major                 |
| `before-show`/`show`/`before-hide`/`hide`, `before-opened`/`opened-changed`, `before-closed`/`closed-changed` | re-dispatched by the adapter on top of `beforetoggle`/`toggle`                   | mapping only; listener code is untouched                                     |
| `close-overlay`                                                                                               | mapped to `hide()`                                                               | the event keeps working, the action it triggers is the new one               |
| `_showComplete`, `_hideComplete`                                                                              | kept verbatim                                                                    | they are the timing contract the existing tests assert                       |
| `menu/` and `input-*-dropdown/` types                                                                         | untouched; `overlays/src/OverlayController.js` remains as a three-line re-export | shipped declarations import that exact path                                  |
| deep implementation copies                                                                                    | deleted (8,020 lines)                                                            | the public entry points were re-pointed first; the shim covers the type path |
| duplicate tests in the old tree                                                                               | deleted after diffing the file lists                                             | the unique ones (`invoker-compatibility`) were kept                          |

Eventually this whole table moves into `@lion-ui-legacy`: a package that depends on `@lion/ui`, holds the
alias and adapter layers, and can be dropped by an application that has migrated. The subpath-export
strategy is what makes that move uneventful (ADR 0003 of the disclosure system).

## How to tell the strategy is being respected

- There is one table that lists every alias, its replacement and its lifetime; nothing else in the code
  presents two names for one concept.
- Deleting the compatibility layer is a change in one or two files, and a test fails loudly if the layer
  is bypassed.
- A rename in the controller surfaces as a build error, not as a runtime mismatch.
- An engine catching up changes a feature's internals and nothing in the public surface.
- The consumer suites of a _different_ repository are part of the gate for every step.

## Reference

- ADR 0003 (`packages/ui/components/disclosure-system/docs/adr/0003-compat-layer-ships-as-subpath-exports.md`):
  the compat layer ships as subpath exports inside `@lion/ui`.
- Research section 4 (`docs/fundamentals/systems/overlays/research.md`): the destination package
  `@lion-ui-legacy` and the entry-point trigger.
- `docs/guides/principles/controller-to-mixin.md` and `docs/guides/principles/terminology.md`: the two
  principles this strategy depends on.
