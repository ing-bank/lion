---
'@lion/ui': minor
---

Document the slots a component renders, and the mixin factories that declare them.

The manifest carried 14 of the 49 slots the templates render, and it never inherited a slot: a field showed
no slots at all, even though its base class renders eight (label, input, prefix, suffix, before, after,
help-text, feedback). Those are now annotated once on the mixin that declares them and inherited by every
field, instead of being repeated per component - so the structure has one owner and a field cannot drift
from it.

The mixin factories themselves also get an entry. The analyzer names `FormControlMixin` in `mixins: [...]`
on every consumer but emitted its export as a `variable`, which everything looking for classes ignored - the
slot propagation, the generated references, the api-table coverage gates. The extension surface a subclasser
actually composes had no entry in the manifest at all. 130 classes (was 127), 31 own slots (was 20) and 194
inherited ones; the generated component references now carry a Slots table with descriptions.

`scripts/cem.js` carries the two rules and `scripts/check-cem.mjs` pins them in CI, so slot coverage can
only grow: it reports 18 declared slots annotated, 0 open, and names the mixins that have no slots rather
than hiding them.
