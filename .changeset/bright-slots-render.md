---
'@lion/ui': minor
---

Add `LightRenderMixin`: render part of the shadow dom template in the light dom, so accessible
relations (labels, descriptions, error messages, aria-activedescendant/controls/owns) can be
expressed by the consumer and survive without client side hydration.

The mixin is published as `LightRenderMixin` from `@lion/ui/core.js`. `slots` is declared as a
getter (a class field would shadow the accessor that `...super.slots` composition relies on), and it
accepts the legacy `SlotMixin` `get slots()` map next to its own array shape, so existing components
can migrate one slot at a time. `SlotMixin` is unchanged.

Server side rendering is supported: the mixin implements the light dom protocol of `@lit-labs/ssr`
(`renderLight()`), so with the `renderLight()` directive in the server template the light dom is
serialized into the initial response as plain markup, without hydration. On connect the client
render takes over that markup, so nothing is rendered twice.

Migration support in this release:

- `LightRenderMixin` takes over when a class hierarchy carries both mixins, so a component can be
  migrated class by class instead of whole-chain. SlotMixin then does not render at all. Known
  consequence: a subclass override of `_connectSlotMixin()` (the connect-time hook SlotMixin calls) is
  not called anymore; move that logic to the reactive cycle when you migrate the component.
- `moveUserProvidedDefaultSlottablesToTarget` now lives in `LightRenderMixin.js` and is re-exported
  from `SlotMixin.js`, so existing imports keep working. Same function, one implementation.
- The legacy slot options (`firstRenderOnConnected`, `afterRender`, `renderAsDirectHostChild`) are
  still not implemented; see `docs/fundamentals/systems/core/LightRenderMixin.md`.
