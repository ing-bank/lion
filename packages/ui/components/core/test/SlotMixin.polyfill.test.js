import sinon from 'sinon';
import { defineCE, expect, fixture, unsafeStatic, html } from '@open-wc/testing';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { SlotMixin } from '@lion/ui/core.js';
import { LitElement } from 'lit';

it('supports scoped elements when polyfill loaded', async () => {
  // @ts-ignore the scoped-custom-element-registry polyfill makes sure `ShadowRoot.prototype.createElement` is defined
  const createElementSpy = sinon.spy(ShadowRoot.prototype, 'createElement');

  class ScopedEl extends LitElement {}

  const tagName = defineCE(
    class extends ScopedElementsMixin(SlotMixin(LitElement)) {
      static get scopedElements() {
        return {
          // @ts-expect-error
          ...super.scopedElements,
          'scoped-elm': ScopedEl,
        };
      }

      get slots() {
        return {
          ...super.slots,
          template: () => html`<scoped-elm></scoped-elm>`,
        };
      }

      render() {
        return html`<slot name="template"></slot>`;
      }
    },
  );

  const tag = unsafeStatic(tagName);
  await fixture(html`<${tag}></${tag}>`);

  expect(createElementSpy.getCalls()).to.have.length(1);
});
