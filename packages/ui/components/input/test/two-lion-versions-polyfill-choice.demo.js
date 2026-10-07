/**
 * POC demo — which polyfill does a page need when two @lion/ui versions are on it?
 *
 * Two lion versions side by side do NOT need two polyfills: the polyfill is a page-global shim, and
 * every scoped registry on the page is served by the one that is loaded. What *does* matter is which
 * contract the oldest version on the page speaks:
 *
 * - the shipped (0.x) mixin creates scoped elements through the shadow root
 *   (`shadowRoot.createElement`, and a shadow root as lit's creation scope) and hands the registry
 *   over as `customElements`. That API only exists while the 0.x polyfill is loaded;
 * - the compat mixin (this branch, `ScopedElementsMixinV4`) speaks whichever contract is present, so
 *   it works with the 0.x polyfill, with the redesign and on native support.
 *
 * Hence a page that still has an old version on it must load the **0.x** polyfill, and it can only
 * move to the redesign once every version on it carries the compat mixin. Loading both polyfills
 * together is not a supported configuration — they patch the same DOM APIs and both replace
 * `window.customElements`/`window.CustomElementRegistry`. That state is **not runnable under this
 * test runner**: touching the patched DOM throws
 * `TypeError: Cannot read properties of undefined (reading 'get')` *asynchronously* (the redesign's
 * deferred-upgrade flush runs the 0.x shim's bookkeeping), and uncaught page errors fail the file
 * whatever it asserts. `SCOPED_POLYFILL=v0+v1` stays in `web-test-runner.polyfills.mjs` to reproduce
 * it by hand; the measurements are in
 * docs/guides/principles/scoped-elements-polyfill-compatibility.md.
 *
 * Run it with:
 *
 *   npm run demo:polyfill-choice
 *   SCOPED_POLYFILL=v0 npm run demo:polyfill-choice
 *   SCOPED_POLYFILL=none npm run demo:polyfill-choice
 *
 * Not named `*.test.js` on purpose, so the regular suite stays green.
 */
import { expect } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { LionInput } from '../src/LionInput.js';
import {
  ScopedElementsMixin,
  supportsScopedRegistry,
  supportsScopedRegistryV0,
} from '../../core/src/ScopedElementsMixin.js';

/**
 * What the *shipped* (0.x-contract) ScopedElementsMixin does, minimally: hand the registry over as
 * `customElements`, use the shadow root as lit's creation scope, and fall back to the global registry
 * when there is no scoped registry support at all.
 */
class LegacyContractHost extends LitElement {
  createRenderRoot() {
    const registry = supportsScopedRegistry() ? new CustomElementRegistry() : customElements;
    // Without scoped registries the compat host may have registered the tag first, in which case the
    // fallback path must not try to define it again.
    if (!registry.get('lion-input')) {
      registry.define('lion-input', LionInput);
    }
    const root = Element.prototype.attachShadow.call(this, {
      ...this.constructor.shadowRootOptions,
      // The 0.x spelling, and the intermediate one the shipped mixin also sends.
      customElements: registry,
      registry,
    });
    if (supportsScopedRegistry()) {
      // The 0.x contract's creation scope; the shipped mixin only sets it when scoping exists, and
      // without scoped registries a shadow root has no `importNode` at all.
      // @ts-expect-error the 0.x polyfill's creation scope
      this.renderOptions.creationScope = root;
    }
    return root;
  }

  render() {
    return html`<form><lion-input name="legacy"></lion-input></form>`;
  }
}

/** The compat mixin, as Lion ships it in this branch. */
class CompatContractHost extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'lion-input': LionInput };

  render() {
    return html`<form><lion-input name="compat"></lion-input></form>`;
  }
}

/**
 * @param {string} tagName
 */
const HOSTS = {
  'poc-legacy-contract-host': LegacyContractHost,
  'poc-compat-contract-host': CompatContractHost,
};

/**
 * @param {string} tagName
 */
async function renderHost(tagName) {
  let host = null;
  let error = null;
  try {
    // Registered here rather than at module scope: with two shims on the page the patched DOM throws
    // as soon as it is touched, which would fail even a skipped test file.
    if (!customElements.get(tagName)) {
      customElements.define(tagName, HOSTS[tagName]);
    }
    // Creating the element is part of the measurement: with two shims on the page the patched
    // `document.createElement` itself throws (measured below).
    host = document.createElement(tagName);
    document.body.append(host);
    await /** @type {any} */ (host).updateComplete;
  } catch (thrown) {
    error = `${thrown.name}: ${thrown.message.slice(0, 90)}`;
  }
  if (!host) {
    return { rendered: false, child: null, upgraded: false, hasZeroXCreationApi: false, error };
  }
  const child = host.shadowRoot ? host.shadowRoot.querySelector('lion-input') : null;
  const result = {
    rendered: Boolean(child),
    child: child ? child.constructor.name : null,
    upgraded: child ? child instanceof LionInput : false,
    hasZeroXCreationApi: Boolean(
      host.shadowRoot && typeof host.shadowRoot.createElement === 'function',
    ),
    error,
  };
  host.remove();
  return result;
}

describe('POC: which polyfill does a page with two lion versions need?', () => {
  it('the compat mixin works in every mode; the legacy contract needs the 0.x polyfill', async () => {
    const compat = await renderHost('poc-compat-contract-host');
    const legacy = await renderHost('poc-legacy-contract-host');

    // The compat mixin (what this branch ships in every version) works here, whatever is loaded.
    expect(
      compat.rendered && compat.upgraded,
      `the compat mixin must render its scoped child (${JSON.stringify(compat)})`,
    ).to.equal(true);

    if (supportsScopedRegistryV0()) {
      // The 0.x polyfill is loaded: a version that still speaks the 0.x contract keeps working.
      expect(
        legacy.rendered && legacy.upgraded,
        `with the 0.x polyfill the legacy contract must scope (${JSON.stringify(legacy)})`,
      ).to.equal(true);
      expect(legacy.hasZeroXCreationApi).to.equal(true);
    } else if (supportsScopedRegistry()) {
      // The redesign (or native support) and no 0.x API: an old version cannot scope at all.
      expect(
        legacy.upgraded,
        [
          'a version that still speaks the 0.x contract cannot scope while only the 1.x model is',
          'available - that is why the 0.x polyfill must stay until every version carries the compat',
          `mixin (${JSON.stringify(legacy)})`,
        ].join('\n'),
      ).to.equal(false);
      expect(legacy.hasZeroXCreationApi).to.equal(false);
    } else {
      // No scoped registries at all: the legacy contract leans on its global-registry fallback.
      expect(
        legacy.rendered && legacy.upgraded && !legacy.hasZeroXCreationApi,
        `without scoped registries the legacy contract falls back to the global registry (${JSON.stringify(legacy)})`,
      ).to.equal(true);
    }
  });
});
