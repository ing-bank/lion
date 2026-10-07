import { expect, fixture } from '@open-wc/testing';
import { LitElement, html } from 'lit';

import {
  ScopedElementsMixin,
  supportsScopedRegistry,
  supportsScopedRegistryV0,
  supportsScopedRegistryV1,
} from '../src/ScopedElementsMixin.js';
import { ScopedElementsMixinV4 } from '../src/ScopedElementsMixinV4.js';

/**
 * These tests are run under three polyfill configurations (see
 * `web-test-runner.scoped-spec.config.mjs`): the spec 0.x polyfill that is on npm
 * today, the redesigned spec 1.x polyfill (webcomponents/polyfills#668) and no
 * polyfill at all. They assert the *same* application-level contract in each of them.
 */

const scopedSupport = supportsScopedRegistry();
/** @type {string} */
let specVersion = 'none';
if (supportsScopedRegistryV1()) {
  specVersion = '1.x';
} else if (supportsScopedRegistryV0()) {
  specVersion = '0.x';
}

// Two hosts that deliberately declare the SAME tag for a DIFFERENT class. A global
// registry can only hold one definition per tag, so this only works when the tag is
// resolved per host.
class ScopedChildA extends LitElement {
  render() {
    return html`<span>child A</span>`;
  }
}
class ScopedChildB extends LitElement {
  render() {
    return html`<span>child B</span>`;
  }
}

class ScopedHostA extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'compat-scoped-child': ScopedChildA };

  render() {
    return html`<compat-scoped-child></compat-scoped-child>`;
  }
}
class ScopedHostB extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'compat-scoped-child': ScopedChildB };

  render() {
    return html`<compat-scoped-child></compat-scoped-child>`;
  }
}
customElements.define('compat-scoped-host-a', ScopedHostA);
customElements.define('compat-scoped-host-b', ScopedHostB);

describe(`ScopedElementsMixin compatibility (scoped registry spec ${specVersion})`, () => {
  it('detects scoped registry support consistently', () => {
    expect(supportsScopedRegistry()).to.equal(
      supportsScopedRegistryV0() || supportsScopedRegistryV1(),
    );
    // The two versions are mutually exclusive in practice: 0.x is the old polyfill
    // contract (shadow root creation methods), 1.x the registry-as-a-value contract.
    expect(supportsScopedRegistryV0() && supportsScopedRegistryV1()).to.be.false;
  });

  it('resolves a declared internal element from the host its own scope', async () => {
    const el = /** @type {ScopedHostA} */ (
      await fixture(html`<compat-scoped-host-a></compat-scoped-host-a>`)
    );

    const child = el.shadowRoot?.querySelector('compat-scoped-child');
    expect(child).to.not.equal(null);
    await /** @type {LitElement} */ (child).updateComplete;
    expect(child?.shadowRoot?.textContent).to.contain('child A');
  });

  it('keeps two definitions of the same tag apart', async () => {
    if (!scopedSupport) {
      // Without scoped registries one definition wins globally; both hosts then
      // render the very same class. Document the degraded behaviour.
      const elB = /** @type {ScopedHostB} */ (
        await fixture(html`<compat-scoped-host-b></compat-scoped-host-b>`)
      );
      const child = elB.shadowRoot?.querySelector('compat-scoped-child');
      expect(child).to.be.instanceOf(ScopedChildA);
      return;
    }

    const elA = /** @type {ScopedHostA} */ (
      await fixture(html`<compat-scoped-host-a></compat-scoped-host-a>`)
    );
    const elB = /** @type {ScopedHostB} */ (
      await fixture(html`<compat-scoped-host-b></compat-scoped-host-b>`)
    );

    const childA = elA.shadowRoot?.querySelector('compat-scoped-child');
    const childB = elB.shadowRoot?.querySelector('compat-scoped-child');

    expect(childA).to.be.instanceOf(ScopedChildA);
    expect(childB).to.be.instanceOf(ScopedChildB);
    expect(
      /** @type {{ registry: CustomElementRegistry }} */ (elA).registry.get('compat-scoped-child'),
    ).to.equal(ScopedChildA);
    expect(
      /** @type {{ registry: CustomElementRegistry }} */ (elB).registry.get('compat-scoped-child'),
    ).to.equal(ScopedChildB);
  });

  it('uses its own registry, not the global one (when scoped)', async () => {
    const el = /** @type {ScopedHostA} */ (
      await fixture(html`<compat-scoped-host-a></compat-scoped-host-a>`)
    );

    if (scopedSupport) {
      expect(el.registry).to.not.equal(customElements);
      // The tag is intentionally absent from the global registry.
      expect(customElements.get('compat-scoped-child')).to.equal(undefined);
    } else {
      expect(el.registry).to.equal(customElements);
      expect(customElements.get('compat-scoped-child')).to.equal(ScopedChildA);
    }
  });

  it('createScopedElement resolves through the registry of the host', async () => {
    const el = /** @type {ScopedHostB} */ (
      await fixture(html`<compat-scoped-host-b></compat-scoped-host-b>`)
    );

    const created = el.createScopedElement('compat-scoped-child');
    expect(created.localName).to.equal('compat-scoped-child');
    // eslint-disable-next-line no-unused-expressions
    expect(created).to.be.instanceOf(scopedSupport ? ScopedChildB : ScopedChildA);
  });

  it('registers the map on the conceptual global registry when scoped is unavailable', async () => {
    if (scopedSupport) return;
    const el = /** @type {ScopedHostA} */ (
      await fixture(html`<compat-scoped-host-a></compat-scoped-host-a>`)
    );
    // @ts-expect-error registry is added by the mixin
    expect(el.registry.get('compat-scoped-child')).to.equal(ScopedChildA);
  });

  it('exposes the v4 implementation under both names, as one deduped mixin', () => {
    // `ScopedElementsMixin` re-exports `ScopedElementsMixinV4`, so Lion (which uses the v4
    // name internally) and its consumers (which use the established name) apply the same mixin.
    expect(ScopedElementsMixin).to.equal(ScopedElementsMixinV4);

    const once = ScopedElementsMixinV4(LitElement);
    expect(ScopedElementsMixin(once)).to.equal(once);
  });
});
