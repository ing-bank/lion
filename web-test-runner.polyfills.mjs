/**
 * Which scoped custom element registry polyfill the scoped POC test runs load, selected with
 * the `SCOPED_POLYFILL` environment variable:
 *
 *   v0    the polyfill that is on npm today — @webcomponents/scoped-custom-element-registry@0.0.10,
 *         which implements the 0.x model (the shadow root is the scope)
 *   v1    the redesign (webcomponents/polyfills#668), which implements the 1.x model, forced so it
 *         is exercised even in a browser that already has native support. The build is vendored in
 *         packages/ui/components/core/test/scoped-registry-v1 (see its README, and
 *         `scripts/scoped-registry-polyfill.mjs` to regenerate it)
 *   none  no polyfill at all: the browser's own support, or the global-registry fallback when it
 *         has none
 *
 * Shared by `web-test-runner.scoped-spec.config.mjs` (the scoped-elements suites) and
 * `web-test-runner.scoped-full.config.mjs` (the whole @lion/ui suite).
 */

export const SCOPED_POLYFILL_VARIANTS = {
  v0: '<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>',
  v1: [
    // Force it, so the spec 1.x code path is exercised in a browser that may have native support.
    '<script>window.CustomElementRegistryPolyfill = { force: true };</script>',
    '<script src="/packages/ui/components/core/test/scoped-registry-v1/scoped-custom-element-registry.min.js"></script>',
  ].join('\n    '),
  none: '',
};

/**
 * @param {string} [fallback] variant to use when `SCOPED_POLYFILL` is unset
 * @returns {keyof typeof SCOPED_POLYFILL_VARIANTS}
 */
export function resolveScopedPolyfillVariant(fallback = 'v1') {
  const variant = process.env.SCOPED_POLYFILL ?? fallback;
  if (!(variant in SCOPED_POLYFILL_VARIANTS)) {
    throw new Error(
      `Unknown SCOPED_POLYFILL "${variant}" (expected one of ${Object.keys(SCOPED_POLYFILL_VARIANTS).join(', ')})`,
    );
  }
  return /** @type {keyof typeof SCOPED_POLYFILL_VARIANTS} */ (variant);
}

/**
 * The `<head>` of the test runner page for a variant: the polyfill script (if any) before the
 * test runner module, as the polyfill must patch the DOM before anything is registered.
 *
 * @param {keyof typeof SCOPED_POLYFILL_VARIANTS} variant
 * @returns {(testRunnerImport: string) => string}
 */
export function scopedPolyfillTestRunnerHtml(variant) {
  return testRunnerImport => `
<html>
  <head>
    ${SCOPED_POLYFILL_VARIANTS[variant]}
    <script type="module" src="${testRunnerImport}"></script>
  </head>
</html>
`;
}
