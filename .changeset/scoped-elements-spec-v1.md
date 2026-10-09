---
'@lion/ui': minor
---

ScopedElementsMixin is now compatible with both versions of the scoped custom element registries proposal: the 0.x contract (`shadowRoot.createElement` and the `customElements` option of `attachShadow`, what the polyfill on npm implements today) and the 1.x contract (`CustomElementRegistry` as a first class value, passed with the `customElementRegistry` option of `attachShadow`, `document.createElement` and `document.importNode`, as implemented by native browser support and by the redesigned `@webcomponents/scoped-custom-element-registry`).

The version in use is detected at runtime, so a consumer can adopt the new polyfill or a browser with native support without changing any application code. `supportsScopedRegistryV0()` and `supportsScopedRegistryV1()` are exported for diagnostics; `supportsScopedRegistry()` reports whether either contract is available.

The implementation now lives in `ScopedElementsMixinV4.js` — the candidate for `@open-wc/scoped-elements` v4, and what Lion uses internally — while `ScopedElementsMixin` re-exports it under the established name and type surface. Both names resolve to the same deduped mixin, so extension layers and consumers are unaffected.
