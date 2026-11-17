---
'@lion/ui': patch
---

fix(core): LightRenderMixin no longer breaks when a subclass overrides `shadowRoot`

`renderLightDomInScopedContext` used `shadowHost.shadowRoot` to find the scoped custom element
registry root. Any subclass or consumer-side mixin that legitimately overrides the public
`shadowRoot` getter (e.g. a compatibility shim making `el.shadowRoot` work uniformly for
shadow:false components) redirected that internal read too, so the registry root no longer had
`.createElement` and the component threw `TypeError: registryRoot.createElement is not a
function` on first render. Fixed by reading the raw platform accessor via
`Object.getOwnPropertyDescriptor(Element.prototype, 'shadowRoot')` instead of the overridable
instance property.
