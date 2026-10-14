---
'@lion/ui': minor
---

Deprecate `SlotMixin` in favour of `LightRenderMixin`.

`SlotMixin` renders the light dom once, from `connectedCallback`, so its light dom is not reactive
and it cannot render on the server. `LightRenderMixin` renders the light dom on every update and
serializes it into the server response with `@lit-labs/ssr`.

Nothing breaks: `SlotMixin` is unchanged behaviourally, stays published and is not scheduled for
removal. Both mixins accept the same `get slots()` map, so components can migrate one slot at a
time. `LionSelectInvoker` is migrated in this release as the reference.
