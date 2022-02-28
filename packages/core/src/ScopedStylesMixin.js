import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { unsafeCSS, css } from 'lit';

/**
 * @typedef {import('../types/ScopedStylesMixinTypes').ScopedStylesMixin} ScopedStylesMixin
 */

/**
 * @type {ScopedStylesMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
const ScopedStylesMixinImplementation = superclass =>
  // eslint-disable-next-line no-shadow
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class ScopedStylesHost extends superclass {
    /**
     * @param {import('lit').CSSResult} scope
     * @return {import('lit').CSSResultGroup}
     */
    // eslint-disable-next-line no-unused-vars
    static scopedStyles(scope) {
      return css``;
    }

    constructor() {
      super();
      // Perhaps use constructable stylesheets instead once Safari supports replace(Sync) methods
      this.__styleTag = document.createElement('style');
      this.scopedClass = `${this.localName}-${Math.floor(Math.random() * 10000)}`;
    }

    connectedCallback() {
      super.connectedCallback();
      this.classList.add(this.scopedClass);
      this.__setupStyleTag();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.__teardownStyleTag();
    }

    __setupStyleTag() {
      this.__styleTag.textContent = /** @type {typeof ScopedStylesHost} */ (this.constructor)
        .scopedStyles(unsafeCSS(this.scopedClass))
        .toString();
      this.insertBefore(this.__styleTag, this.childNodes[0]);
    }

    __teardownStyleTag() {
      this.removeChild(this.__styleTag);
    }
  };

export const ScopedStylesMixin = dedupeMixin(ScopedStylesMixinImplementation);
