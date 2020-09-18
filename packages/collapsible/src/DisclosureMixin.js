import { dedupeMixin } from '@lion/core';

/**
 * @typedef {import('../types/DisclosureMixinTypes').DisclosureHost} DisclosureHost
 * @typedef {import('../types/DisclosureMixinTypes').DisclosureMixin} DisclosureMixin
 */

/**
 *
 * @type {DisclosureMixin}
 */
const DisclosureMixinImplementation = superclass =>
  class DisclosureMixin extends superclass {
    static get properties() {
      return {
        opened: { type: Boolean, reflect: true },
        handleFocus: { type: Boolean, attribute: 'handle-focus' },
        invokerInteraction: { type: String, attribute: 'invoker-interaction' },
      };
    }

    get _invokerNode() {
      return Array.from(this.children).find(child => child.slot === 'invoker');
    }

    get _contentNode() {
      if (!this._cachedOverlayContentNode) {
        this._cachedOverlayContentNode = Array.from(this.children).find(
          child => child.slot === 'content',
        );
      }
      return this._cachedOverlayContentNode;
    }

    constructor() {
      super();
      this.opened = false;
      /**
       * @type {'click'|'hover'|undefined}
       */
      this.invokerInteraction = undefined;
      /**
       * Puts focus on `_contentNode` on open and on `_invokerNode` on close.
       * @type {Boolean}
       */
      this.handleFocus = false;
      this.__disclosureNeedsSetup = true;

      this.toggle = this.toggle.bind(this);
      this.open = this.open.bind(this);
      this.close = this.close.bind(this);

      this.__handeAnimateComplete = this.__handeAnimateComplete.bind(this);

      this.__onInvokerMouseenter = this.__onInvokerMouseenter.bind(this);
      this.__onContentMouseenter = this.__onContentMouseenter.bind(this);
      this.__onInvokerMouseleave = this.__onInvokerMouseleave.bind(this);
      this.__onContentMouseleave = this.__onContentMouseleave.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      // we do a setup after every connectedCallback as firstUpdated will only be called once
      this.__disclosureNeedsSetup = true;
      this.updateComplete.then(() => {
        if (this.__disclosureNeedsSetup) {
          this._setupDisclosure();
        }
        this.__disclosureNeedsSetup = false;
      });
      this.__setupAnimation();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this._teardownDisclosure();
      this.__teardownAnimation();
    }

    /**
     * @overridable
     */
    _setupDisclosure() {
      this._setupOpenCloseListeners();
    }

    /**
     * @overridable
     */
    _teardownDisclosure() {
      this._teardownOpenCloseListeners();
    }

    /**
     * @overridable
     */
    _setupOpenCloseListeners() {
      if (!this._invokerNode) {
        return;
      }

      const interactions = this.invokerInteraction.split(' ');

      if (interactions.includes('hover')) {
        this._invokerNode.addEventListener('mouseenter', this.__onInvokerMouseenter);
        this._contentNode.addEventListener('mouseenter', this.__onContentMouseenter);
        this._invokerNode.addEventListener('mouseleave', this.__onInvokerMouseleave);
        this._contentNode.addEventListener('mouseleave', this.__onContentMouseleave);
      }
      if (interactions.includes('click')) {
        this._invokerNode.addEventListener('click', this.toggle);
      }
    }

    __onInvokerMouseenter() {
      this.__invokerHover = true;
      this.open();
    }

    __onContentMouseenter() {
      this.__contentHover = true;
      console.log('this.__contentHover', this.__contentHover);
      this.open();
    }

    __onInvokerMouseleave() {
      setTimeout(() => {
        if (!this.__contentHover) {
          this.close();
        }
      });
      this.__invokerHover = false;
    }

    __onContentMouseleave() {
      setTimeout(() => {
        if (!this.__invokerHover) {
          this.close();
        }
      });
      this.__contentHover = false;
    }

    /**
     * @overridable
     */
    _teardownOpenCloseListeners() {
      if (!this._invokerNode) {
        return;
      }

      this._invokerNode.removeEventListener('mouseenter', this.open);
      this._invokerNode.removeEventListener('mouseleave', this.close);
      this._contentNode.removeEventListener('mouseenter', this.open);
      this._contentNode.removeEventListener('mouseleave', this.close);

      this._invokerNode.removeEventListener('click', this.toggle);
    }

    // TODO: fire event on updated?
    /**
     * @override
     * @param {string} name
     * @param {any} oldValue
     */
    requestUpdateInternal(name, oldValue) {
      super.requestUpdateInternal(name, oldValue);
      if (name === 'opened') {
        this.dispatchEvent(new Event('opened-changed'));
      }
    }

    /**
     * @param {import('lit-element').PropertyValues } changedProperties
     */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (changedProperties.has('opened')) {
        this._onOpenedChanged();
      }
    }

    /**
     * @param {import('lit-element').PropertyValues } changedProperties
     */
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this._onOpenedChanged();

      if (this.handleFocus) {
        this._contentNode.setAttribute('tabindex', '-1');
      }
    }

    /**
     * @overridable
     */
    async _onOpenedChanged() {
      this._invokerNode.setAttribute('aria-expanded', `${this.opened}`);

      if (this.opened) {
        this._contentNode.style.setProperty('display', '');
        await this._showAnimation({ contentNode: this._contentNode });
        this._onDisclosureShow();
      } else {
        this._onDisclosureHide();
        await this._hideAnimation({ contentNode: this._contentNode });
        this._contentNode.style.setProperty('display', 'none');
      }
    }

    _onDisclosureShow() {
      // if (this.checkedIndex != null) {
      //   this.activeIndex = this.checkedIndex;
      // }

      if (this.handleFocus) {
        this._contentNode.focus();
      }
    }

    _onDisclosureHide() {
      if (this.handleFocus) {
        this._invokerNode.focus();
      }
    }

    /**
     * Show animation implementation in sub-classer.
     * @param {{ contentNode: HTMLElement; }} cfg
     */
    // eslint-disable-next-line class-methods-use-this, no-empty-function
    async _showAnimation(cfg) {
      this._refreshAnimateCompletePromise();
    }

    /**
     * Hide animation implementation in sub-classer.
     * @param {{ contentNode: HTMLElement; }} cfg
     */
    // eslint-disable-next-line class-methods-use-this, no-empty-function
    async _hideAnimation(cfg) {
      this._refreshAnimateCompletePromise();
    }

    _refreshAnimateCompletePromise() {
      this._animateComplete = new Promise(resolve => {
        // Note that when a lib like GSAP is used, neither 'transitionend' or 'animationend' will be called.
        // In such a case, a subclasser needs to resolve this pending promise by calling this method
        this._resolveAnimateComplete = resolve;
      });
    }

    __setupAnimation() {
      this._contentNode.addEventListener('transitionend', this.__handeAnimateComplete);
      this._contentNode.addEventListener('animationend', this.__handeAnimateComplete);
    }

    __teardownAnimation() {
      this._contentNode.removeEventListener('transitionend', this.__handeAnimateComplete);
      this._contentNode.removeEventListener('animationend', this.__handeAnimateComplete);
    }

    __handeAnimateComplete() {
      if (typeof this._resolveAnimateComplete === 'function') {
        this._resolveAnimateComplete();
      }
    }

    toggle() {
      this.opened = !this.opened;
    }

    open() {
      this.opened = true;
    }

    close() {
      this.opened = false;
    }
  };
export const DisclosureMixin = dedupeMixin(DisclosureMixinImplementation);
