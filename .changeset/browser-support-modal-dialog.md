---
'@lion/ui': minor
---

[browser support] drop support for browsers without `<dialog>.showModal()`.

A modal overlay is opened as a native modal dialog: the browser then keeps the keyboard focus inside it and
makes the rest of the page unreachable, which is also why a screen reader does not read that other content.
The library never had a fallback for browsers that cannot do this - the platform capability _is_ the
mechanism - so the support policy now states what the implementation requires instead of leaving it
implicit. Safari 16 is the oldest supported browser; Chrome, Edge and Firefox are supported for their last
four versions. This is recorded in `.browserslistrc`.
