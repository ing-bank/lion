# Migrating a component to the clean layer: the menu first

Status: proposed (analysis done, no implementation yet)

The clean layer exists, is exported (`@lion/ui/disclosure-system.js`) and is tested, but **no Lion component
uses it yet**. The six consumers still import the old `OverlayMixin` and `with*Config` from
`@lion/ui/overlays.js`:

| consumer         | file                                                     |
| ---------------- | -------------------------------------------------------- |
| menu             | `components/menu/src/LionMenu.js`                        |
| combobox         | `components/combobox/src/LionCombobox.js`                |
| tooltip          | `components/tooltip/src/LionTooltip.js`                  |
| input-datepicker | `components/input-datepicker/src/LionInputDatepicker.js` |
| select-rich      | `components/select-rich/src/LionSelectRich.js`           |
| dialog           | `components/dialog/src/LionDialog.js`                    |

The menu goes first: its overlay surface is a dropdown (local placement, one open at a time), its source is
small, and its behaviour is asserted by the shared suites rather than by many local tests.

## The menu's overlay contract, as it is today

| what the menu uses                          | where                        | what it needs from the layer                                                                              |
| ------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| `OverlayMixin`                              | `LionMenu.js:11`             | the mixin to apply; four lifecycle hooks (`_setupOverlayCtrl`, `_teardownOverlayCtrl`) with `super` calls |
| `_overlayCtrl` + `addEventListener('show')` | `LionMenu.js:294-307`        | a controller that is an event target, and a `show` event it can listen to                                 |
| `_overlayCtrl.hide()`                       | `MoreButtonMenuMixin.js:104` | hiding a **sublist** found by `this.querySelector('[level="2"]:has([data-open])')`                        |
| `data-open` attribute                       | same line, in the selector   | the layer must project a state attribute the menu can select on                                           |
| `_contentNode` / `_invokerNode` getters     | `LionMenu.js:311-322`        | the layer reads nodes through overridable getters                                                         |
| `withDropdownConfig()`                      | `LionMenu.js:397`            | a config factory that becomes a descriptor                                                                |

Sharp edges to design for:

1. `MoreButtonMenuMixin` queries the DOM for a sublist and calls `hide()` on its controller. That is a
   _local_ relationship (menu to its own sublist), so an attribute is the right carrier here — the rule that
   bans DOM queries is about **global** state, and this is a parent-child contract inside one component.
   The clean layer keeps projecting the state attribute for exactly this reason.
2. The menu listens to the controller's `show` event; the clean layer's notification is `toggle` /
   `beforetoggle`, so the adapter has to re-dispatch `show` (it already does for the compat layer).
3. `_setupOverlayCtrl` / `_teardownOverlayCtrl` are overridden with `super` calls, so they are part of the
   contract and cannot be replaced by a different hook name.

## Mapping to the clean layer

| menu contract                                | clean layer                                                                              |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `withDropdownConfig()`                       | a `descriptor` object (`closedby`, `anchor`, `placement`, `lightDismiss`)                |
| `opened`                                     | `open` (state, projected as the attribute the menu already selects on)                   |
| `show()` / `hide()`                          | `show()` / `hide()` (unchanged names, by the terminology principle)                      |
| `_overlayCtrl.addEventListener('show')`      | `toggle` event on the element (the adapter re-dispatches `show`)                         |
| `_contentNode` / `_invokerNode`              | `content` / `invoker` in the controller options; the getters stay as the component's own |
| `_setupOverlayCtrl` / `_teardownOverlayCtrl` | keep the names; internally they create/tear down the `Disclosure` plus its features      |

## Order and gates

| step | component        | gate                                                                                                                        |
| ---- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1    | menu             | the menu suites (shared `LionMenu.suite.js` + interactions) unchanged, the my-ui menu matrix unchanged, no test file edited |
| 2    | combobox         | as above (combobox adds listbox semantics)                                                                                  |
| 3    | tooltip          | as above; tooltip is the case where focus-out dismissal must stay off                                                       |
| 4    | select-rich      | as above; the largest of the six                                                                                            |
| 5    | input-datepicker | as above                                                                                                                    |
| 6    | dialog           | last: the modal case, where modality and the focus trap must keep their timing                                              |

Each step is its own commit, with the consumer suites and the private my-ui overlay matrix as the gate, and
with `@lion/ui/overlays.js` still exporting the old surface until the last consumer has moved.

## Where this happens

`packages/ui/components/menu/**` is byte-identical to master today, and master is actively changing it. This
migration therefore belongs on **its own branch, branched from the latest master**, not in the overlay
refactor PR — the same reason the refactor kept the menu untouched.

## Open question

Whether the menu is migrated onto the **adapter** first (fast, proves compatibility, keeps `OverlayMixin` as
the public name) or directly onto the clean core (cleaner, but forces the rewire of `@lion/ui/overlays.js`
earlier). The plan above assumes the adapter route, because it keeps every consumer's import path intact.
