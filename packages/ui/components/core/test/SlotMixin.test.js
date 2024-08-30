import sinon from 'sinon';
import { defineCE, expect, html } from '@open-wc/testing';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { SlotMixin } from '@lion/ui/core.js';
import { LitElement } from 'lit';

/**
 * @typedef {import('../types/SlotMixinTypes.js').SlotHost} SlotHost
 */

// @ts-ignore
const createElementNative = ShadowRoot.prototype.createElement;

function unMockScopedRegistry() {
  // @ts-expect-error wait for browser support
  ShadowRoot.prototype.createElement = createElementNative;
}

describe('SlotMixin', () => {
  describe('Scoped Registries', () => {
    it('does not scope elements when polyfill not loaded', async () => {
      // @ts-expect-error
      ShadowRoot.prototype.createElement = null;
      class ScopedEl extends LitElement {}

      const tagName = defineCE(
        class extends ScopedElementsMixin(SlotMixin(LitElement)) {
          static get scopedElements() {
            return {
              // @ts-expect-error
              ...super.scopedElements,
              'scoped-el': ScopedEl,
            };
          }

          get slots() {
            return {
              ...super.slots,
              template: () => html`<scoped-el></scoped-el>`,
            };
          }

          render() {
            return html`<slot name="template"></slot>`;
          }
        },
      );

      const renderTarget = document.createElement('div');
      const el = document.createElement(tagName);

      // We don't use fixture, so we limit the amount of calls to document.createElement
      const docSpy = sinon.spy(document, 'createElement');
      document.body.appendChild(renderTarget);
      renderTarget.appendChild(el);

      expect(docSpy.callCount).to.equal(2);

      document.body.removeChild(renderTarget);
      docSpy.restore();
      unMockScopedRegistry();
    });
  });
});
