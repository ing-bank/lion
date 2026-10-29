---
parts:
  - Principles
  - Terminology
title: 'One word per concept'
eleventyNavigation:
  key: 'Principles: Terminology'
  order: 70
  parent: Principles
  title: Terminology
---

# One word per concept

A design system earns its name by being guessable. If a developer has used one of our components, the
next one should behave like it — including the words. This principle fixes the vocabulary for every
system and component, not just for overlays.

## The rules

1. **One concept, one word — in every system and component.** If the state is `open`, then the state is
   `open` everywhere: not `open` here on a disclosure and `expanded` on a collapsible, and not `showed`.
2. **A word is either a state or an action, never both.** `open` is a state (attribute, property, CSS
   hook): it describes. `show()` is an action: it does. A method named `open` next to a property named
   `open` shadows the property, and a reader can no longer tell from the call site whether state is
   being read or changed.
3. **Action pairs must be true opposites.** `show`/`hide` pair, `open`/`close` pair, `expand`/`collapse`
   pair. `show` + `close` does not: a consumer has to guess whether `close` undoes `show` or something
   else, and the mismatch survives forever in aliases and migrations.
4. **Prefer the platform's word for the platform's concept.** The Open UI and HTML vocabulary is shared
   with every other library and with MDN, so using it costs nothing and teaches transferable knowledge.
   Platform words that break a rule (`popover`, `closedby`, `showModal`) stay verbatim; we note them as
   platform vocabulary instead of renaming them.
5. **Attribute, property, method, event, config key and type use the same word** for the same concept.
   A config key `open`, a `toggle` event and a `toggle()` method all refer to one thing.
6. **Keep the vocabulary serializable and greppable.** A single word can be an attribute name, a JSON key
   and a log line at once, and `grep` finds every use of the concept in one pass.
7. **Coin names only for what the platform lacks, in the same shape, and list them in one glossary.**

## The shared vocabulary

| concept        | word                      | kind                  | platform precedent                               |
| -------------- | ------------------------- | --------------------- | ------------------------------------------------ |
| state          | `open` / `closed`         | attribute, property   | `<details open>`, `<dialog>.open`, popover state |
| actions        | `show()` / `hide()`       | methods               | `showPopover()` / `hidePopover()`                |
| actions        | `toggle()`                | method                | `togglePopover()`, `toggle` event                |
| events         | `beforetoggle` / `toggle` | `CustomEvent`         | popover and `<details>` fire both                |
| modality       | `modal`                   | attribute, config key | `<dialog>.showModal()`                           |
| closure policy | `closedby`                | attribute, config key | `closedby="any \| closest \| none"`              |

Notes that follow from the rules:

- the state word is `open`, so the _method_ that produces it may not be called `open()`. It is `show()`.
- the action pair is `show()`/`hide()`, so `close()` is not part of our vocabulary: `closed` is a state,
  not an action. Where older code calls `close()`, keep it as a documented alias and remove it later.
- `isShown`, `opened` and `toggleOpen` are all the same concept in older spelling; new code uses `open`.

## Applied to the overlay layer

The existing overlay API is `show()` / `hide()` with `opened` / `isShown` as state, so aligning with the
platform costs no consumer anything:

| concept    | legacy overlay name                                                  | after this principle          | compatibility                                         |
| ---------- | -------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------- |
| state      | `opened` (property), `isShown` (property)                            | `open` (attribute + property) | both legacy getters stay, as deprecated aliases       |
| state      | `display !== 'none'`                                                 | `open` read from the machine  | the machine owns it; the DOM is only a projection     |
| actions    | `show()` / `hide()`                                                  | `show()` / `hide()`           | unchanged                                             |
| action     | —                                                                    | `toggle()`                    | new                                                   |
| completion | `_showComplete` / `_hideComplete`                                    | kept verbatim                 | compatibility promises, not the consistency mechanism |
| events     | `before-show`, `show`, `before-hide`, `hide`                         | `beforetoggle`, `toggle`      | legacy names re-dispatched by the compatibility layer |
| events     | `before-opened`, `opened-changed`, `before-closed`, `closed-changed` | `beforetoggle`, `toggle`      | as above                                              |
| events     | `close-overlay`                                                      | `hide()`                      | the layer maps the event to the action                |

`close-overlay` deserves a note: it is an _action_ wearing an event name, and it spells the action
`close`. It survives as a legacy event, and it triggers `hide()`. Nothing new is named that way.

## How to check a system against this principle

- Can every concept be listed in one table with one word and one kind (state or action)? If a word
  appears twice in the "kind" column, it violates rule 2.
- Does every action have its opposite present under the same root? If you find `show` without `hide`, or
  a pair like `show`/`close`, rule 3 is broken.
- Does a grep for the word find attribute, property, method, event, key and type together? If a concept
  needs several greps, rule 5 is broken.
- Are the platform words recognisable to someone who only read MDN? If not, rule 4 is broken.

## Reference

This principle governs the vocabulary in the disclosure/overlay work (ADR 0001:
`open` is a state, `show`/`close`/`toggle` are actions — the actions are now `show`/`hide`/`toggle`), and
it is the reason the controller-to-mixin contract can stay as small as it is
(`docs/guides/principles/controller-to-mixin.md`).
