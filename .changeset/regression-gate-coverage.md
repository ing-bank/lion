---
'@lion/ui': patch
'@lion/ajax': patch
'singleton-manager': patch
---

Raise unit-test coverage as a regression gate for future refactors (chromium lines 96.1% -> 98.4%, functions 95.2% -> 98.4%), and fix the bugs the new tests exposed:

- [menu] `wrap` + ArrowUp, and Home/End next to a disabled item, no longer freeze the page; `bar` now renders `role="menubar"`; typeahead is case-insensitive, accepts non-string values and restarts its timer per key
- [listbox] Home/End next to a hidden option no longer freeze the page; [select-rich] arrow keys on the closed invoker skip disabled options instead of clearing the selection
- [select] one native `change` dispatches one `user-input-changed` (was two)
- [form-core] removed validators stop triggering validation; the latest async validation wins and `isPending` stays true until it settles; `validateComplete` resolves on every path; focus tracking keeps working after a reconnect; renaming one `name[]` child no longer moves the whole collection, and renaming onto an existing name throws like registration does; setting `selectionStart`/`selectionEnd` works from caret 0
- [form] `lion-form` without an inner `<form>` no longer throws on connect/disconnect
- [overlays] tooltips reference the content's own id in `aria-describedby`/`aria-labelledby`; a prevented `before-show`/`before-hide` leaves no trace; teardown removes all listeners and destroys Popper, also while a `show()` is in flight
- [drawer] fires `opened-changed` once per toggle
- [button] the implicit submit helper is restored when removed and leaves no empty wrapper on teardown
- [checkbox-group] the indeterminate checkbox updates when a sub checkbox is removed
- [textarea] disconnects its IntersectionObserver; [input-stepper] no duplicate validators after reconnect, and `min`/`max` changes update validation
- [input-amount-dropdown] currency names follow the full locale; serializing round-trips with a numeric amount and empty values serialize to `''`
- [input-datepicker] removing MinDate/MaxDate/IsDateDisabled releases the calendar limits; en-US and tr-TR get the overlay translations
- [calendar] disabled-date messages use localized month names; focused-date tracking uses `focusin`/`focusout`
- [input-date] deserializing `YYYY-MM-DD` gives local midnight (was UTC, a day off west of UTC)
- [steps] steps added or removed after first render can be navigated to
- [core] `ScopedStylesController` falls back to its default styles; `browserDetection` reads `navigator.userAgent`; `SlotMixin` falls back to the document without a shadowRoot
- [helpers] `sortEachDepth` no longer loops forever on kinds with a trailing slash
- [ajax] `fetchJson` keeps headers passed as a `Headers` instance or as tuples
- [singleton-manager] `lazifyInstantiation` binds every inherited method (e.g. `dispatchEvent`) and supports the `in` operator
