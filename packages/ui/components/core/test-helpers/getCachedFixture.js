import { defineCE, fixture, html, unsafeStatic } from '@open-wc/testing';
import { LitElement, nothing } from 'lit';
import { cache } from 'lit/directives/cache.js';
import { createRef } from 'lit/directives/ref.js';

export async function getCachedFixture(render) {
  class CachingWrapper extends LitElement {
    static properties = {
      _show: { type: Boolean },
    };

    constructor() {
      super();
      this._show = true;
      this.ref = createRef();
    }

    async show() {
      this._show = true;
      return this.updateComplete;
    }

    async hide() {
      this._show = false;
      return this.updateComplete;
    }

    render() {
      return html`${cache(this._show ? render(this.ref) : nothing)}`;
    }
  }

  const customElementName = defineCE(CachingWrapper);
  const customTag = unsafeStatic(customElementName);

  const wrapper = await fixture(html`<${customTag}></${customTag}>`);

  return {
    wrapper,
    el: wrapper.ref.value,
    show: async () => wrapper.show(),
    hide: async () => wrapper.hide(),
  };
}
