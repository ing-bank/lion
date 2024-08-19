import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { OverlayController } from './OverlayController.js';
import { isEqualConfig } from './utils/is-equal-config.js';

/**
 * @typedef {import('../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 * @typedef {import('../types/OverlayMixinTypes.js').DefineOverlayConfig} DefineOverlayConfig
 * @typedef {import('../types/OverlayMixinTypes.js').OverlayMixin} OverlayMixin
 */

/**
 * @type {OverlayMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
export const OverlayMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class OverlayMixin extends superclass {
    static get properties() {
      return {
        opened: {
          type: Boolean,
          reflect: true,
        },
      };
    }

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
      const shouldUpdate = !isEqualConfig(this.config, value);

      if (this._overlayCtrl && shouldUpdate) {
        this._overlayCtrl.updateConfig(value);
      }
      this.__config = value;
      if (this._overlayCtrl && shouldUpdate) {
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

    /**
     * @param {import('lit-element').PropertyValues } changedProperties
     */
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);

      this._setupOverlayCtrl();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      if (this._overlayCtrl) {
        this._teardownOverlayCtrl();
      }
    }

    get _overlayInvokerNode() {
      return /** @type {HTMLElement | undefined} */ (
        Array.from(this.children).find(child => child.slot === 'invoker')
      );
    }

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

    /** @protected */
    _setupOverlayCtrl() {
      /** @type {OverlayController} */
      this._overlayCtrl = this._defineOverlay({
        contentNode: this._overlayContentNode,
        contentWrapperNode: this._overlayContentWrapperNode,
        invokerNode: this._overlayInvokerNode,
        referenceNode: this._overlayReferenceNode,
        backdropNode: this._overlayBackdropNode,
      });
      this.__syncToOverlayController();
      this.__setupSyncFromOverlayController();
      this._setupOpenCloseListeners();
    }

    /** @protected */
    _teardownOverlayCtrl() {
      this._teardownOpenCloseListeners();
      this.__teardownSyncFromOverlayController();
      /** @type {OverlayController} */
      (this._overlayCtrl).teardown();
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
  };
export const OverlayMixin = dedupeMixin(OverlayMixinImplementation);
