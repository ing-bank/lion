---
title: Backwards compatibility
---

# Rationale: modernizing without breaking consumers

**Status: proposal**, to be decided with the review of
[#2890](https://github.com/ing-bank/lion/pull/2890). It records the options and the recommendation
rather than a decision that has been made.

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

## Should this be a separate package (`@lion/ui-compat-layer`)?

Recommendation: **no, not for the parts above.** Reasons, in order of how hard they are to work around:

1. **Mixin identity.** `dedupeMixin` keys on function identity. If a compat package re-exports or
   re-declares `LightRenderMixin`, a consumer can end up with two distinct mixin functions for the same
   concept, dedupe no longer recognises the second application, and the class renders its slots twice.
   Any compat package would therefore have to import the _installed_ `@lion/ui` and add nothing to the
   class hierarchy that `@lion/ui` does not already have — at which point it is a folder, not a package.
2. **A package that only wraps imports adds a release artefact, not a boundary.** It would need its own
   version, changesets, CI matrix and peer-range policy, while its contents can only change in lockstep
   with `@lion/ui` (it is tested against the same mixins).
3. **The opt-in would be invisible.** A consumer that forgets to install or apply the compat package
   gets the _breaking_ behaviour, which is the worst default for a migration path.
4. **The parts that must compose cannot be moved out.** Accepting the legacy map, the takeover and the
   guards are all decisions inside the mixin's own lifecycle; only _shims that constrain_ the mixin
   (the legacy slot options) can be applied from outside, as a mixin stacked above it.

**When a separate package does make sense:** for opt-in behaviour shims that keep the modern mixin
untouched — the legacy slot options (`firstRenderOnConnected`, `afterRender`,
`renderAsDirectHostChild`) are the natural candidate, because they are the only part that is neither
mixin identity nor lifecycle. Shape would be a mixin applied _above_ the modern one:

```js
class LionInput extends LegacySlotOptions(LightRenderMixin(LionField)) {
  get slots() {
    /* unchanged legacy map */
  }
}
```

It has to be applied above, because a shim below the modern mixin cannot influence the mixin's own
rendering; and it must import `LightRenderMixin` from the installed `@lion/ui` rather than shipping its
own copy (see 1.).

### Naming, if it is ever created

| candidate                                 | reads as                                    | verdict                                                          |
| :---------------------------------------- | :------------------------------------------ | :--------------------------------------------------------------- |
| `@lion/ui-compat-layer`                   | a layer around the whole package            | too broad for slot behaviour                                     |
| `@lion/ui-slot-compat`                    | compat for slot rendering specifically      | accurate, but slot rendering _is_ core, so it re-asks question 1 |
| `@lion/ui-legacy-slots`                   | "the old slots API", opt-in by name         | clearest of the three                                            |
| no package (`@lion/ui/core.js` submodule) | a folder in the package that owns the mixin | recommended while the shim is small                              |

## Open questions

- Does the option shim belong to `@lion/ui` until the usage data says the options can be dropped?
- Is an opt-in shim acceptable at all, or should the options be implemented on `LightRenderMixin`
  directly once the usage data is in?
