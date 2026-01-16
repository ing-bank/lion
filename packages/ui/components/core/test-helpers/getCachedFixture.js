import { defineCE, fixture, html, unsafeStatic } from '@open-wc/testing';
import { LitElement, nothing } from 'lit';
import { cache } from 'lit/directives/cache.js';
import { createRef } from 'lit/directives/ref.js';

/**
 * Helper to get a fixture with a cached render function and show/hide methods.
 * @template T
 * @param {(ref: import('lit/directives/ref.js').Ref<T>) => import('lit').TemplateResult} render - The render function
 * @returns {Promise<{ wrapper: LitElement, el: T | undefined, show: () => Promise<void>, hide: () => Promise<void> }>}
 */
export async function getCachedFixture(
  /** @type {(ref: import('lit/directives/ref.js').Ref<any>) => import('lit').TemplateResult} */ render,
) {
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

  const wrapper =
    /** @type {LitElement & { ref: import('lit/directives/ref.js').Ref<any>, show(): Promise<void>, hide(): Promise<void> }} */ (
      await fixture(html`<${customTag}></${customTag}>`)
    );

  return {
    wrapper,
    el: wrapper.ref.value,
    show: async () => wrapper.show(),
    hide: async () => wrapper.hide(),
  };
}
