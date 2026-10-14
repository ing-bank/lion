---
title: Backwards compatibility
---

# Rationale: modernizing without breaking consumers

**Status: decided in outline, design open.** The compatibility layer is wanted (see
[Decisions](#decisions)), its _shape_ is still open. [#2890](https://github.com/ing-bank/lion/pull/2890)
is held as a branch until the usage data is in.

## The philosophy

1. **Additive first.** A modern replacement is added next to the old implementation; the old one keeps
   working, is not scheduled for removal, and only gets a deprecation notice.
2. **The compatibility lives next to the modern API, not in a layer around it.** A consumer that
   migrates one class should not have to change its import graph, and both implementations have to be
   able to live in _one_ class hierarchy while the migration is in progress.
3. **Loud beats silent.** Where an old idiom cannot be supported (a `slots` class field, a map made by
   spreading an array shaped `slots`), the mixin throws with an actionable message instead of
   rendering a subtly wrong light dom.
4. **Deprecate, do not delete.** Deprecation is a statement about what to use for new work, visible in
   editors and docs. It is not a removal plan; there is no removal date.
5. **Migrate one class at a time.** The unit of migration is a class, never "the whole design system in
   one go".

## Where the compatibility layer lives today

Inside `@lion/ui` itself, in `packages/ui/components/core`:

| piece                                         | what it does                                                                                         |
| :-------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| `normalizeSlots()`                            | accepts the legacy `get slots()` map next to the array shape                                         |
| `assertSlotsMapIsUsable()`                    | throws when a map lost its slot names by spreading an array shaped `slots`                           |
| `findShadowedSlotsAccessor()`                 | throws when a class field shadows the `get slots()` accessor                                         |
| `moveUserProvidedDefaultSlottablesToTarget()` | one implementation, re-exported from `SlotMixin.js` for the old import path                          |
| `neutralizeSlotMixin()`                       | when both mixins are in one hierarchy, `LightRenderMixin` takes over and `SlotMixin` does not render |
| `SlotMixin` (deprecated)                      | unchanged behaviour, still exported                                                                  |

## Decisions

**A compatibility layer is needed, and its scope is the full package** — not the slot API alone. It
exists to modernize `@lion/ui` while consumers keep working, which is what makes it possible to adhere
to semver: the modern implementation can move, the old surface stays available. Codemods are
_additional_ (they help consumers move faster), never a substitute for the layer.

**How long it lives:** until the majority is migrated, or until the extension layer
(`my-ui`) takes a breaking change — whichever comes first. That is the retirement trigger; it is a
condition, not a date.

**Sequencing:** internals first. `LightRenderMixin` is applied throughout this codebase, and only then
do we collect consumer data about the _protected_ surface (methods subclasses override, e.g.
`_connectSlotMixin`). Protected-method compatibility is a consumer question that needs evidence, not a
guess.

**Takeover loudness:** undecided on purpose. It waits for the same usage data; the branch stays open
until then.

## Constraint any compat layer has to respect

`dedupeMixin` keys on function identity, so a compat layer must build on the _installed_ `@lion/ui` and
must not ship a second copy of a mixin: two distinct functions for one concept end up both applied to
one class, dedupe stops recognising the second, and the class renders its light dom twice. That is a
fact about the mechanism, not a preference — it constrains the shape of the layer (a re-export shell
around `@lion/ui` plus shims that compose _above_ the modern mixin), not whether it should exist.

## The legacy options: what the repo itself does

Worth knowing before the options are called unused: three components in this repo pass
`renderAsDirectHostChild: true` — `LionInputFile`, `LionInputAmountDropdown`,
`LionInputTelDropdown`. That value is exactly what `LightRenderMixin` does unconditionally (content is
always a direct host child), so those three are migration-equivalent without the option being
implemented. `false` (keep the wrapper element) and `firstRenderOnConnected` /
`afterRender` have no usage in this repo at all, which is why the consumer data decides whether they
have to exist.

## Open questions

- Naming and shape of the layer once its scope is the full package: a package that re-exports the old
  surface, a submodule entry point (`@lion/ui/compat`), or a sibling package (`my-ui`-facing) that
  depends on the installed `@lion/ui`.
- Does the layer carry the _deprecated_ surface only (SlotMixin, legacy maps) or the whole pre-change
  API of `@lion/ui`?
- Where do the internal migrations land: one branch per package, or one branch for the codebase?
- Do `firstRenderOnConnected` / `renderAsDirectHostChild: false` become per-slot options once the
  consumer data is in, or stay unsupported with a documented workaround?
