import { describe, it } from 'vitest';
import { LitElement, html } from 'lit';
import sinon from 'sinon';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from '../../../test-helpers.js';

import { ScopedElementsMixin, supportsScopedRegistry } from '../src/ScopedElementsMixin.js';
import { browserDetection } from '../src/browserDetection.js';

// SSR fixtures from @lit-labs/testing don't work in Vitest browser mode
// We'll use csrFixture only which is the main browser test case
const csrFixture = fixture;
const ssrNonHydratedFixture = null;
const ssrHydratedFixture = null;

const hasRealScopedRegistrySupport = supportsScopedRegistry();
const originalShadowRootProps = {
  // @ts-expect-error
  createElement: globalThis.ShadowRoot?.prototype.createElement,
  // @ts-expect-error
  importNode: globalThis.ShadowRoot?.prototype.importNode,
};

// Even though the polyfill might be loaded in this test or we run it in a browser supporting these features,
// we mock "no support", so that `supportsScopedRegistry()` returns false inside ScopedElementsMixin..
function mockNoRegistrySupport() {
  // Are we on a server or do we have no polyfill? Nothing to be done here...
  if (!hasRealScopedRegistrySupport) return;

  // This will be enough to make the `supportsScopedRegistry()` check fail inside ScopedElementsMixin and bypass scoped registries
  globalThis.ShadowRoot = globalThis.ShadowRoot || { prototype: {} };
  // @ts-expect-error
  globalThis.ShadowRoot.prototype.createElement = null;
}

mockNoRegistrySupport.restore = () => {
  // Are we on a server or do we have no polyfill? Nothing to be done here...
  if (!hasRealScopedRegistrySupport) return;

  // @ts-expect-error
  globalThis.ShadowRoot.prototype.createElement = originalShadowRootProps.createElement;
  // @ts-expect-error
  globalThis.ShadowRoot.prototype.importNode = originalShadowRootProps.importNode;
};

class ScopedElementsChild extends LitElement {
  render() {
    return html`<span>I'm a child</span>`;
  }
}

class ScopedElementsHost extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'scoped-elements-child': ScopedElementsChild };

  render() {
    return html`<scoped-elements-child></scoped-elements-child>`;
  }
}
customElements.define('scoped-elements-host', ScopedElementsHost);

describe('ScopedElementsMixin', () => {
  it('renders child elements correctly (that were not registered yet on global registry)', async () => {
    // Skip SSR fixtures in Vitest browser mode - only test CSR
    const fixtures = [csrFixture, ssrNonHydratedFixture, ssrHydratedFixture].filter(Boolean);
    for (const _fixture of fixtures) {
      const el = await _fixture(html`<scoped-elements-host></scoped-elements-host>`);

      // Wait for FF support
      if (!browserDetection.isFirefox) {
        expect(
          el.shadowRoot?.querySelector('scoped-elements-child')?.shadowRoot?.innerHTML,
        ).to.contain("<span>I'm a child</span>");
      }

      // @ts-expect-error
      expect(el.registry.get('scoped-elements-child')).to.not.be.undefined;
    }
  });

  describe('When scoped registries are supported', () => {
    it('registers elements on local registry', async () => {
      if (!hasRealScopedRegistrySupport) return;

      const ceDefineSpy = sinon.spy(customElements, 'define');

      const el = /** @type {ScopedElementsHost} */ (
        await fixture(html`<scoped-elements-host></scoped-elements-host>`)
      );

      // @ts-expect-error
      expect(el.registry.get('scoped-elements-child')).to.equal(ScopedElementsChild);
      expect(el.registry).to.not.equal(customElements);
      expect(ceDefineSpy.calledWith('scoped-elements-child')).to.be.false;

      ceDefineSpy.restore();
    });
  });

  describe('When scoped registries are not supported', () => {
    class ScopedElementsChildNoReg extends LitElement {
      render() {
        return html`<span>I'm a child</span>`;
      }
    }

    class ScopedElementsHostNoReg extends ScopedElementsMixin(LitElement) {
      static scopedElements = { 'scoped-elements-child-no-reg': ScopedElementsChildNoReg };

      render() {
        return html`<scoped-elements-child-no-reg></scoped-elements-child-no-reg>`;
      }
    }
    before(() => {
      mockNoRegistrySupport();
      customElements.define('scoped-elements-host-no-reg', ScopedElementsHostNoReg);
    });

    after(() => {
      mockNoRegistrySupport.restore();
    });

    it('registers elements', async () => {
      const ceDefineSpy = sinon.spy(customElements, 'define');

      const el = /** @type {ScopedElementsHostNoReg} */ (
        await fixture(html`<scoped-elements-host-no-reg></scoped-elements-host-no-reg>`)
      );

      expect(el.registry).to.equal(customElements);
      expect(ceDefineSpy.calledWith('scoped-elements-child-no-reg')).to.be.true;
      ceDefineSpy.restore();
    });

    it('fails when different classes are registered under different name', async () => {
      class ScopedElementsHostNoReg2 extends ScopedElementsMixin(LitElement) {
        static scopedElements = { 'scoped-elements-child-no-reg': class extends HTMLElement {} };

        render() {
          return html`<scoped-elements-child-no-reg></scoped-elements-child-no-reg>`;
        }
      }
      customElements.define('scoped-elements-host-no-reg-2', ScopedElementsHostNoReg2);

      const errorStub = sinon.stub(console, 'error');
      /** @type {ScopedElementsHostNoReg2} */ (
        await fixture(html`<scoped-elements-host-no-reg></scoped-elements-host-no-reg>`)
      );
      /** @type {ScopedElementsHostNoReg2} */ (
        await fixture(html`<scoped-elements-host-no-reg-2></scoped-elements-host-no-reg-2>`)
      );

      expect(errorStub.args[0][0]).to.equal(
        [
          'You are trying to re-register the "scoped-elements-child-no-reg" custom element with a different class via ScopedElementsMixin.',
          'This is only possible with a CustomElementRegistry.',
          'Your browser does not support this feature so you will need to load a polyfill for it.',
          'Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.',
          'e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>" as your first script tag.',
          'For more details you can visit https://open-wc.org/docs/development/scoped-elements/',
        ].join('\n'),
      );
      errorStub.restore();
    });
  });
});
