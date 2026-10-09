/**
 * Which scoped custom element registry the scoped POC test runs use, selected with the
 * `SCOPED_POLYFILL` environment variable:
 *
 *   v0          the polyfill that is on npm today — @webcomponents/scoped-custom-element-registry@0.0.10,
 *               which implements the 0.x model (the shadow root is the scope)
 *   v1          the redesign (webcomponents/polyfills#668), which implements the 1.x model, forced so
 *               it is exercised even in a browser that already has native support. The build is
 *               vendored in packages/ui/components/core/test/scoped-registry-v1 (see its README, and
 *               `scripts/scoped-registry-polyfill.mjs` to regenerate it)
 *   v1-reserved like v1, with `lion-input` listed in `CustomElementRegistryPolyfill.formAssociated`
 *               before the polyfill loads (the redesign's escape hatch for form association)
 *   none        no polyfill at all: the browser's own support
 *   v0+v1       both polyfills, old one first (not supported - see the entry below)
 *   no-support  no polyfill *and* no native support: Chromium is started with
 *               `--disable-blink-features=ScopedCustomElementRegistry`, which removes the registry
 *               model entirely. This is the only way to exercise the global-registry fallback for
 *               real — mocking the DOM features away cannot reproduce it (see
 *               ScopedElementsMixin.test.js), and it is what a browser without support looks like.
 *
 * Shared by `web-test-runner.scoped-spec.config.mjs` (the scoped-elements suites) and
 * `web-test-runner.scoped-full.config.mjs` (the whole @lion/ui suite).
 */
import { playwrightLauncher } from '@web/test-runner-playwright';

/** Chromium feature that carries the whole scoped registry model (incl. `customElementRegistry`). */
const SCOPED_REGISTRY_FEATURE = 'ScopedCustomElementRegistry';

export const SCOPED_POLYFILL_VARIANTS = {
  v0: '<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>',
  v1: [
    // Force it, so the spec 1.x code path is exercised in a browser that may have native support.
    '<script>window.CustomElementRegistryPolyfill = { force: true };</script>',
    '<script src="/packages/ui/components/core/test/scoped-registry-v1/scoped-custom-element-registry.min.js"></script>',
  ].join('\n    '),
  none: '',
  // Same as v1, plus the redesign's escape hatch for form association: the tag names whose
  // capability must be reserved *before* the polyfill loads, because form association is decided
  // per tag name and first definition wins (see the form-associated demo).
  'v1-reserved': [
    '<script>window.CustomElementRegistryPolyfill = { force: true, formAssociated: new Set(["lion-input"]) };</script>',
    '<script src="/packages/ui/components/core/test/scoped-registry-v1/scoped-custom-element-registry.min.js"></script>',
  ].join('\n    '),
  'no-support': '',
  // The old and the new polyfill loaded on top of each other. NOT a supported configuration: both
  // patch the same DOM API and replace `window.customElements`/`window.CustomElementRegistry`, so
  // they contradict each other. It exists to reproduce that clash (the testing order is the one a
  // page would use: whatever is on the page first loads first).
  'v0+v1': [
    '<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>',
    '<script>window.CustomElementRegistryPolyfill = { force: true };</script>',
    '<script src="/packages/ui/components/core/test/scoped-registry-v1/scoped-custom-element-registry.min.js"></script>',
  ].join('\n    '),
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

/**
 * The browser for a variant: chromium, with the scoped registry feature switched off for
 * `no-support`.
 *
 * @param {keyof typeof SCOPED_POLYFILL_VARIANTS} variant
 */
export function scopedPolyfillBrowsers(variant) {
  return [
    playwrightLauncher({
      product: 'chromium',
      ...(variant === 'no-support'
        ? { launchOptions: { args: [`--disable-blink-features=${SCOPED_REGISTRY_FEATURE}`] } }
        : {}),
    }),
  ];
}
