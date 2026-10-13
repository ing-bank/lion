/**
 * Public entry point for the scoped elements mixin.
 *
 * The implementation lives in `ScopedElementsMixinV4.js` — the candidate for
 * `@open-wc/scoped-elements` v4 — and is what Lion itself uses. This module re-exports it
 * under the established name, with the established type surface, so that:
 *
 * - existing consumers (and Lion extension layers) keep importing `ScopedElementsMixin`
 *   without any change;
 * - both names resolve to the *same* deduped mixin, so applying one and later the other to
 *   the same superclass does not double the mixin;
 * - the mixin stays compatible with both versions of the scoped custom element registry
 *   proposal (see `ScopedElementsMixinV4.js`): the 0.x contract of the polyfill published on
 *   npm today, and the 1.x contract of native browser support and of the redesigned polyfill.
 */
export {
  ScopedElementsMixinV4 as ScopedElementsMixin,
  supportsScopedRegistry,
  supportsScopedRegistryV0,
  supportsScopedRegistryV1,
} from './ScopedElementsMixinV4.js';
