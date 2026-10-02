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
