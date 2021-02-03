import { dedupeMixin } from '@lion/core';

/**
 * @typedef {import('@lion/core').PropertyValues } changedProperties
 */

/**
 * Designed for webcomponents that need to behave like a link.
 * For instance, comboboxes that have search result options opening a webpage on click.
 * Using an <a> is not a viable alternative, because:
 * - no shadow dom (and thus no style encapsulation possibilities)
 * - we need to extend from LionOption (and we cannot put the anchor inside
 * the focusable element (LionOption which has [role=option]))
 */
const LinkMixinImplementation = superclass =>
  class extends superclass {
    static get properties() {
      return {
        href: String,
        target: String,
      };
    }

    constructor() {
      super();
      this._nativeAnchor = document.createElement('a');
    }

    connectedCallback() {
      super.connectedCallback();
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'link');
      }
    }

    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.addEventListener('click', this.__navigate);
      this.addEventListener('keydown', ({ key }) => {
        if (key === ' ' || key === 'Enter') {
          this.__navigate();
        }
      });
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      if (changedProperties.has('href')) {
        this._nativeAnchor.href = this.href;
      }
      if (changedProperties.has('target')) {
        this._nativeAnchor.target = this.target;
      }
      if (changedProperties.has('rel')) {
        this._nativeAnchor.rel = this.rel;
      }
    }

    __navigate() {
      this._nativeAnchor.click();
    }
  };
export const LinkMixin = dedupeMixin(LinkMixinImplementation);
