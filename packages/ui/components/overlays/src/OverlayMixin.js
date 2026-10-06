import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { OverlayController } from './OverlayController.js';

/**
 * @typedef {<T>(ingOverlayHost:T) => void} PostProcessor
 */

/** @type {PostProcessor[]} */
const overlayMixinPostProcessors = [];

/** @param {PostProcessor} postProcessor */
export function _addOverlayMixinPostProcessor(postProcessor) {
  overlayMixinPostProcessors.push(postProcessor);
}

/**
 * @typedef {import('../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 * @typedef {import('../types/OverlayMixinTypes.js').DefineOverlayConfig} DefineOverlayConfig
 * @typedef {import('../types/OverlayMixinTypes.js').OverlayMixin} OverlayMixin
 */

/**
 * @slot backdrop - The backdrop element for the overlay
 * @slot content - The content element for the overlay
 * @slot invoker - The invoker element for the overlay
 *
 * @type {OverlayMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
// @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
export const OverlayMixinImplementation = superclass => {
  class OverlayMixin extends superclass {
    static get properties() {
      return {
        opened: { type: Boolean, reflect: true },
      };
    }

    #hasSetup = false;

    constructor() {
      super();
      /**
       * If you add the opened attribute a dialog will be opened on page load. The invoker can be left out
       * in case the user does not need to be able to reopen the dialog.
       */
      this.opened = false;

      /**
       * Configure the many options of the `OverlayController`
       * @type {Partial<OverlayConfig>}
       */
      this.config = {};

      /** @type {EventListener} */
      this.toggle = this.toggle.bind(this);
      /** @type {EventListener} */
      this.open = this.open.bind(this);
      /** @type {EventListener} */
      this.close = this.close.bind(this);
    }

    get config() {
      return /** @type {OverlayConfig} */ (this.__config);
    }

    /** @param {OverlayConfig} value */
    set config(value) {
      // The OverlayController already guards against redundant updates
      // (see OverlayController#updateConfig), so we delegate unconditionally here.
      if (this._overlayCtrl) {
        this._overlayCtrl.updateConfig(value);
      }
      this.__config = value;
      if (this._overlayCtrl) {
        this.__syncToOverlayController();
      }
    }

    /**
     * @param {string} [name]
     * @param {unknown} [oldValue]
     * @param {import('lit').PropertyDeclaration} [options]
     * @returns {void}
     */
    requestUpdate(name, oldValue, options) {
      super.requestUpdate(name, oldValue, options);
      if (name === 'opened' && this.opened !== oldValue) {
        this.dispatchEvent(
          new CustomEvent('opened-changed', {
            detail: { opened: this.opened },
          }),
        );
      }
    }

    /**
     * @overridable method `_defineOverlay`
     * @desc returns an instance of a (dynamic) overlay controller
     * In case overriding _defineOverlayConfig is not enough
     * @param {DefineOverlayConfig} config
     * @returns {OverlayController}
     * @protected
     */
    // eslint-disable-next-line
    _defineOverlay({ contentNode, invokerNode, referenceNode, backdropNode, contentWrapperNode }) {
      const overlayConfig = this._defineOverlayConfig() || {};
      return new OverlayController({
        contentNode,
        invokerNode,
        referenceNode,
        backdropNode,
        contentWrapperNode,
        ...overlayConfig, // wc provided in the class as defaults
        ...this.config, // user provided (e.g. in template)
        popperConfig: {
          ...(overlayConfig.popperConfig || {}),
          ...(this.config?.popperConfig || {}),
          modifiers: [
            ...(overlayConfig.popperConfig?.modifiers || []),
            ...(this.config?.popperConfig?.modifiers || []),
          ],
        },
      });
    }

    /**
     * @overridable method `_defineOverlayConfig`
     * @desc returns an object with default configuration options for your overlay component.
     * This is generally speaking easier to override than _defineOverlay method entirely.
     * @returns {OverlayConfig}
     * @protected
     */
    // eslint-disable-next-line
    _defineOverlayConfig() {
      return {
        placementMode: 'local',
      };
    }

    /**
     * @param {import('lit').PropertyValues } changedProperties
     */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (changedProperties.has('opened') && this._overlayCtrl && !this.__blockSyncToOverlayCtrl) {
        this.__syncToOverlayController();
      }
    }

    /**
     * @overridable
     * @desc use this method to setup your open and close event listeners
     * For example, set a click event listener on _overlayInvokerNode to set opened to true
     * @protected
     */
    // eslint-disable-next-line class-methods-use-this
    _setupOpenCloseListeners() {
      // Keeps the close-overlay event private for the controller.
      // (we already have )
      /**
       * @param {{ stopPropagation: () => void; }} ev
       */
      this.__closeEventInContentNodeHandler = ev => {
        ev.stopPropagation();
        /** @type {OverlayController} */ (this._overlayCtrl).hide();
      };
      if (this._overlayContentNode) {
        this._overlayContentNode.addEventListener(
          'close-overlay',
          this.__closeEventInContentNodeHandler,
        );
      }
    }

    /**
     * @overridable
     * @desc use this method to tear down your event listeners
     * @protected
     */
    // eslint-disable-next-line class-methods-use-this
    _teardownOpenCloseListeners() {
      if (this._overlayContentNode) {
        this._overlayContentNode.removeEventListener(
          'close-overlay',
          /** @type {EventListener} */ (this.__closeEventInContentNodeHandler),
        );
      }
    }

    connectedCallback() {
      super.connectedCallback();

      this.updateComplete.then(() => {
        if (!this.isConnected) return;
        if (this.#hasSetup) return;
        this._setupOverlayCtrl();
        this.#hasSetup = true;
      });
    }

    async disconnectedCallback() {
      super.disconnectedCallback();

      if (await this._isPermanentlyDisconnected()) {
        this._teardownOverlayCtrl();
        this.#hasSetup = false;
      }
    }

    /**
     * // TODO: check if this is a false positive or if we can improve
     * @configure ReactiveElement
     */
    // @ts-expect-error
    static enabledWarnings = super.enabledWarnings?.filter(w => w !== 'change-in-update') || [];

    /**
     * @overridable
     */
    // eslint-disable-next-line class-methods-use-this
    get _overlayReferenceNode() {
      return undefined;
    }

    get _overlayBackdropNode() {
      if (!this.__cachedOverlayBackdropNode) {
        this.__cachedOverlayBackdropNode = /** @type {HTMLElement | undefined} */ (
          Array.from(this.children).find(child => child.slot === 'backdrop')
        );
      }
      return this.__cachedOverlayBackdropNode;
    }

    get _overlayContentNode() {
      if (!this._cachedOverlayContentNode) {
        this._cachedOverlayContentNode =
          Array.from(this.children).find(child => child.slot === 'content') ||
          this.config.contentNode;
      }
      return /** @type {HTMLElement} */ (this._cachedOverlayContentNode);
    }

    get _overlayContentWrapperNode() {
      return /** @type {HTMLElement | undefined} */ (
        this.shadowRoot?.querySelector('#overlay-content-node-wrapper')
      );
    }

    /**
     * Returns the element that can actually receive focus inside the passed
     * invoker (wrapper) element: the element itself when it is focusable,
     * otherwise the first focusable descendant.
     * @param {Element|null|undefined} focusableElOrWrapper
     * @returns {Element|null}
     */
    /**
     * @param {Element | null | undefined} focusableElOrWrapper
     * @returns {Element | null}
     */
    static _getFocusableInvokerEl(focusableElOrWrapper) {
      if (!focusableElOrWrapper) return null;
      const focusableSelector = '[tabindex], button, a[href], [role=button]';
      return focusableElOrWrapper.matches(focusableSelector)
        ? focusableElOrWrapper
        : focusableElOrWrapper.querySelector(focusableSelector);
    }

    /**
     * The node that opens/closes this overlay.
     *
     * Resolved in a stable, declarative way (independent of the exact DOM order)
     * by looking, in order, for:
     * 1. a child with `[slot="invoker"]`
     * 2. any element in the same root that opts in via `[data-invoker]` and
     *    references this host by id (`for="<id>"`)
     * 3. a preceding sibling that opts in via `[data-invoker]`
     * @protected
     */
    get _overlayInvokerNode() {
      if (!this.__invokerNode) {
        this.__invokerNode = this._getInvokerNode();
      }
      return this.__invokerNode;
    }

    /**
     * @protected
     * @returns {Element|null}
     */
    _getInvokerNode() {
      const ctor = /** @type {typeof OverlayMixin} */ (this.constructor);

      const slottedNode = Array.from(this.children).find(child => child.slot === 'invoker');
      if (slottedNode) {
        return ctor._getFocusableInvokerEl(slottedNode);
      }

      if (this.id) {
        // Reference the invoker declaratively: `<button data-invoker for="my-menu">`
        const root = /** @type {Document|ShadowRoot} */ (this.getRootNode());
        const explicitInvoker = root.querySelector?.(`[data-invoker][for="${this.id}"]`);
        if (explicitInvoker) {
          return ctor._getFocusableInvokerEl(explicitInvoker);
        }
      }

      // Fall back to a preceding sibling that opted in via [data-invoker]
      const { previousElementSibling } = this;
      return previousElementSibling && previousElementSibling.hasAttribute('data-invoker')
        ? ctor._getFocusableInvokerEl(previousElementSibling)
        : null;
    }

    /** @protected */
    _setupOverlayCtrl() {
      if (this.#hasSetup) return;

      const invokerNode = this._overlayInvokerNode;

      const config = {
        contentNode: this._overlayContentNode,
        contentWrapperNode: this._overlayContentWrapperNode,
        invokerNode: invokerNode && invokerNode instanceof HTMLElement ? invokerNode : undefined,
        referenceNode: this._overlayReferenceNode,
        backdropNode: this._overlayBackdropNode,
      };

      // @ts-ignore [ts7-2565] TS7 checks definite assignment on this inferred field; assigned from another method: declare the field with an explicit `| undefined` in its JSDoc type
      if (this._overlayCtrl) {
        // when `lit` `cache` attaches node to the DOM, register the controller back in the OverlaysManager
        this._overlayCtrl.updateConfig(config);
      } else {
        /** @type {OverlayController} */
        this._overlayCtrl = this._defineOverlay(config);
      }

      this.__syncToOverlayController();
      this.__setupSyncFromOverlayController();
      this._setupOpenCloseListeners();
    }

    /** @protected */
    _teardownOverlayCtrl() {
      // Make sure that dynamic behavior (e.g. responsive) is possible by allowing multiple setups and teardowns of the overlay controller.
      this.#hasSetup = false;
      if (!this._overlayCtrl) return;

      this._teardownOpenCloseListeners();
      this.__teardownSyncFromOverlayController();

      /** @type {OverlayController} */ (this._overlayCtrl).teardown();
    }

    /**
     * When the opened state is changed by an Application Developer,cthe OverlayController is
     * requested to show/hide. It might happen that this request is not honoured
     * (intercepted in before-hide for instance), so that we need to sync the controller state
     * to this webcomponent again, preventing eternal loops.
     * @param {boolean} newOpened
     * @protected
     */
    async _setOpenedWithoutPropertyEffects(newOpened) {
      this.__blockSyncToOverlayCtrl = true;
      this.opened = newOpened;
      await this.updateComplete;
      this.__blockSyncToOverlayCtrl = false;
    }

    /** @private */
    __setupSyncFromOverlayController() {
      this.__onOverlayCtrlShow = () => {
        this.opened = true;
      };

      this.__onOverlayCtrlHide = () => {
        this.opened = false;
      };

      /**
       * @param {{ preventDefault: () => void; }} beforeShowEvent
       */
      this.__onBeforeShow = beforeShowEvent => {
        const event = new CustomEvent('before-opened', { cancelable: true });
        this.dispatchEvent(event);
        if (event.defaultPrevented) {
          // Check whether our current `.opened` state is not out of sync with overlayCtrl
          this._setOpenedWithoutPropertyEffects(
            /** @type {OverlayController} */ (this._overlayCtrl).isShown,
          );
          beforeShowEvent.preventDefault();
        }
      };

      /**
       * @param {{ preventDefault: () => void; }} beforeHideEvent
       */
      this.__onBeforeHide = beforeHideEvent => {
        const event = new CustomEvent('before-closed', { cancelable: true });
        this.dispatchEvent(event);
        if (event.defaultPrevented) {
          // Check whether our current `.opened` state is not out of sync with overlayCtrl
          this._setOpenedWithoutPropertyEffects(
            /** @type {OverlayController} */
            (this._overlayCtrl).isShown,
          );
          beforeHideEvent.preventDefault();
        }
      };

      /** @type {OverlayController} */
      (this._overlayCtrl).addEventListener('show', this.__onOverlayCtrlShow);
      /** @type {OverlayController} */
      (this._overlayCtrl).addEventListener('hide', this.__onOverlayCtrlHide);
      /** @type {OverlayController} */
      (this._overlayCtrl).addEventListener('before-show', this.__onBeforeShow);
      /** @type {OverlayController} */
      (this._overlayCtrl).addEventListener('before-hide', this.__onBeforeHide);
    }

    /** @private */
    __teardownSyncFromOverlayController() {
      /** @type {OverlayController} */
      (this._overlayCtrl).removeEventListener(
        'show',
        /** @type {EventListener} */ (this.__onOverlayCtrlShow),
      );
      /** @type {OverlayController} */ (this._overlayCtrl).removeEventListener(
        'hide',
        /** @type {EventListener} */ (this.__onOverlayCtrlHide),
      );
      /** @type {OverlayController} */ (this._overlayCtrl).removeEventListener(
        'before-show',
        /** @type {EventListener} */ (this.__onBeforeShow),
      );
      /** @type {OverlayController} */ (this._overlayCtrl).removeEventListener(
        'before-hide',
        /** @type {EventListener} */ (this.__onBeforeHide),
      );
    }

    /** @private */
    __syncToOverlayController() {
      if (this.opened) {
        /** @type {OverlayController} */
        (this._overlayCtrl).show();
      } else {
        /** @type {OverlayController} */
        (this._overlayCtrl).hide();
      }
    }

    /**
     * Toggles the overlay
     */
    async toggle() {
      await /** @type {OverlayController} */ (this._overlayCtrl).toggle();
    }

    /**
     * Shows the overlay
     */
    async open() {
      await /** @type {OverlayController} */ (this._overlayCtrl).show();
    }

    /**
     * Hides the overlay
     */
    async close() {
      await /** @type {OverlayController} */ (this._overlayCtrl).hide();
    }

    /**
     * Sometimes it's needed to recompute Popper position of an overlay, for instance when we have
     * an opened combobox and the surrounding context changes (the space consumed by the textbox
     * increases vertically)
     */
    repositionOverlay() {
      const ctrl = /** @type {OverlayController} */ (this._overlayCtrl);
      if (ctrl.placementMode === 'local' && ctrl._popper) {
        ctrl._popper.update();
      }
    }

    /**
     * When we're moving around in dom, disconnectedCallback gets called.
     * Before we decide to teardown, let's wait to see if we were not just moving nodes around.
     * @return {Promise<boolean>}
     */
    async _isPermanentlyDisconnected() {
      await this.updateComplete;
      return !this.isConnected;
    }
  }
  for (const postProcessor of overlayMixinPostProcessors) {
    postProcessor(OverlayMixin);
  }
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  return OverlayMixin;
};
export const OverlayMixin = dedupeMixin(OverlayMixinImplementation);
