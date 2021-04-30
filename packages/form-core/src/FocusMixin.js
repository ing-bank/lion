import { dedupeMixin } from '@lion/core';

const windowWithOptionalPolyfill = /** @type {Window & typeof globalThis & {applyFocusVisiblePolyfill?: function}} */ (window);
const polyfilledNodes = new WeakMap();

/**
 * @param {Node} node
 */
function applyFocusVisiblePolyfillWhenNeeded(node) {
  if (windowWithOptionalPolyfill.applyFocusVisiblePolyfill && !polyfilledNodes.has(node)) {
    windowWithOptionalPolyfill.applyFocusVisiblePolyfill(node);
    polyfilledNodes.set(node, undefined);
  }
}

/**
 * @typedef {import('../types/FocusMixinTypes').FocusMixin} FocusMixin
 * @type {FocusMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 */
const FocusMixinImplementation = superclass =>
  class FocusMixin extends superclass {
    /** @type {any} */
    static get properties() {
      return {
        focused: { type: Boolean, reflect: true },
        focusedVisible: { type: Boolean, reflect: true, attribute: 'focused-visible' },
      };
    }

    constructor() {
      super();

      /**
       * Whether the focusable element within (`._focusableNode`) is focused.
       * Reflects to attribute '[focused]' as a styling hook
       * @type {boolean}
       */
      this.focused = false;

      /**
       * Whether the focusable element within (`._focusableNode`) matches ':focus-visible'
       * Reflects to attribute '[focused-visible]' as a styling hook
       * @see https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
       * @type {boolean}
       */
      this.focusedVisible = false;
    }

    connectedCallback() {
      super.connectedCallback();
      this.__registerEventsForFocusMixin();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.__teardownEventsForFocusMixin();
    }

    /**
     * Calls `focus()` on focusable element within
     */
    focus() {
      this._focusableNode?.focus();
    }

    /**
     * Calls `blur()` on focusable element within
     */
    blur() {
      this._focusableNode?.blur();
    }

    /**
     * The focusable element:
     * could be an input, textarea, select, button or any other element with tabindex > -1
     * @protected
     * @type {HTMLElement}
     */
    // @ts-ignore it's up to Subclassers to return the right element. This is needed for docs/types
    // eslint-disable-next-line class-methods-use-this, getter-return, no-empty-function
    get _focusableNode() {
      // TODO: [v1]: remove return of _inputNode (it's now here for backwards compatibility)
      // @ts-expect-error see above
      return /** @type {HTMLElement} */ (this._inputNode || document.createElement('input'));
    }

    /**
     * @private
     */
    __onFocus() {
      this.focused = true;

      if (typeof windowWithOptionalPolyfill.applyFocusVisiblePolyfill === 'function') {
        this.focusedVisible = this._focusableNode.hasAttribute('data-focus-visible-added');
      } else
        try {
          // Safari throws when matches is called
          this.focusedVisible = this._focusableNode.matches(':focus-visible');
        } catch (_) {
          this.focusedVisible = false;
        }
    }

    /**
     * @private
     */
    __onBlur() {
      this.focused = false;
      this.focusedVisible = false;
    }

    /**
     * @private
     */
    __registerEventsForFocusMixin() {
      applyFocusVisiblePolyfillWhenNeeded(this.getRootNode());

      /**
       * focus
       * @param {Event} ev
       */
      this.__redispatchFocus = ev => {
        ev.stopPropagation();
        this.dispatchEvent(new Event('focus'));
      };
      this._focusableNode.addEventListener('focus', this.__redispatchFocus);

      /**
       * blur
       * @param {Event} ev
       */
      this.__redispatchBlur = ev => {
        ev.stopPropagation();
        this.dispatchEvent(new Event('blur'));
      };
      this._focusableNode.addEventListener('blur', this.__redispatchBlur);

      /**
       * focusin
       * @param {Event} ev
       */
      this.__redispatchFocusin = ev => {
        ev.stopPropagation();
        this.__onFocus();
        this.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      };
      this._focusableNode.addEventListener('focusin', this.__redispatchFocusin);

      /**
       * focusout
       * @param {Event} ev
       */
      this.__redispatchFocusout = ev => {
        ev.stopPropagation();
        this.__onBlur();
        this.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
      };
      this._focusableNode.addEventListener('focusout', this.__redispatchFocusout);
    }

    /**
     * @private
     */
    __teardownEventsForFocusMixin() {
      this._focusableNode.removeEventListener(
        'focus',
        /** @type {EventListenerOrEventListenerObject} */ (this.__redispatchFocus),
      );
      this._focusableNode.removeEventListener(
        'blur',
        /** @type {EventListenerOrEventListenerObject} */ (this.__redispatchBlur),
      );
      this._focusableNode.removeEventListener(
        'focusin',
        /** @type {EventListenerOrEventListenerObject} */ (this.__redispatchFocusin),
      );
      this._focusableNode.removeEventListener(
        'focusout',
        /** @type {EventListenerOrEventListenerObject} */ (this.__redispatchFocusout),
      );
    }
  };

/**
 * For browsers that not support the [spec](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible),
 * be sure to load the polyfill into your application https://github.com/WICG/focus-visible
 * (or go for progressive enhancement).
 */
export const FocusMixin = dedupeMixin(FocusMixinImplementation);
