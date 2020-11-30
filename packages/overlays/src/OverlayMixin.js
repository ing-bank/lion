import { dedupeMixin } from '@lion/core';
import { OverlayController } from './OverlayController.js';

/**
 * @typedef {import('../types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('../types/OverlayMixinTypes').DefineOverlayConfig} DefineOverlayConfig
 * @typedef {import('../types/OverlayMixinTypes').OverlayHost} OverlayHost
 * @typedef {import('../types/OverlayMixinTypes').OverlayMixin} OverlayMixin
 */

/**
 * @type {OverlayMixin}
 */
export const OverlayMixinImplementation = superclass =>
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
      this.opened = false;
      this.__needsSetup = true;
      /** @type {OverlayConfig} */
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
      if (this._overlayCtrl) {
        this._overlayCtrl.updateConfig(value);
      }
      this.__config = value;
    }

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
     * @overridable method `_defineOverlay`
     * @desc returns an instance of a (dynamic) overlay controller
     * In case overriding _defineOverlayConfig is not enough
     * @param {DefineOverlayConfig} config
     * @returns {OverlayController}
     */
    // eslint-disable-next-line
    _defineOverlay({ contentNode, invokerNode, referenceNode, backdropNode, contentWrapperNode }) {
      return new OverlayController({
        contentNode,
        invokerNode,
        referenceNode,
        backdropNode,
        contentWrapperNode,
        ...this._defineOverlayConfig(), // wc provided in the class as defaults
        ...this.config, // user provided (e.g. in template)
        popperConfig: {
          ...(this._defineOverlayConfig().popperConfig || {}),
          ...(this.config.popperConfig || {}),
          // TODO: Fix modifiers merging logic
          modifiers: [
            ...((this._defineOverlayConfig().popperConfig &&
              this._defineOverlayConfig()?.popperConfig?.modifiers) ||
              []),
            ...((this.config.popperConfig && this.config.popperConfig.modifiers) || []),
          ],
        },
      });
    }

    /**
     * @overridable method `_defineOverlayConfig`
     * @desc returns an object with default configuration options for your overlay component.
     * This is generally speaking easier to override than _defineOverlay method entirely.
     * @returns {OverlayConfig}
     */
    // eslint-disable-next-line
    _defineOverlayConfig() {
      return {
        placementMode: 'local',
      };
    }

    /**
     * @param {import('lit-element').PropertyValues } changedProperties
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
     */
    // eslint-disable-next-line class-methods-use-this
    _teardownOpenCloseListeners() {
      if (this._overlayContentNode) {
        this._overlayContentNode.removeEventListener(
          'close-overlay',
          this.__closeEventInContentNodeHandler,
        );
      }
    }

    connectedCallback() {
      super.connectedCallback();
      // we do a setup after every connectedCallback as firstUpdated will only be called once
      this.__needsSetup = true;
      this.updateComplete.then(() => {
        if (this.__needsSetup) {
          this._setupOverlayCtrl();
        }
        this.__needsSetup = false;
      });
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      if (this._overlayCtrl) {
        this._teardownOverlayCtrl();
      }
    }

    get _overlayInvokerNode() {
      return Array.from(this.children).find(child => child.slot === 'invoker');
    }

    /**
     * @overridable
     */
    // eslint-disable-next-line class-methods-use-this
    get _overlayReferenceNode() {
      return undefined;
    }

    get _overlayBackdropNode() {
      return Array.from(this.children).find(child => child.slot === 'backdrop');
    }

    get _overlayContentNode() {
      if (!this._cachedOverlayContentNode) {
        this._cachedOverlayContentNode =
          Array.from(this.children).find(child => child.slot === 'content') ||
          this.config.contentNode;
      }
      return this._cachedOverlayContentNode;
    }

    get _overlayContentWrapperNode() {
      return this.shadowRoot.querySelector('#overlay-content-node-wrapper');
    }

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
     */
    async _setOpenedWithoutPropertyEffects(newOpened) {
      this.__blockSyncToOverlayCtrl = true;
      this.opened = newOpened;
      await this.updateComplete;
      this.__blockSyncToOverlayCtrl = false;
    }

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
    toggle() {
      /** @type {OverlayController} */ (this._overlayCtrl).toggle();
    }

    /**
     * Shows the overlay
     */
    open() {
      /** @type {OverlayController} */ (this._overlayCtrl).show();
    }

    /**
     * Hides the overlay
     */
    close() {
      /** @type {OverlayController} */ (this._overlayCtrl).hide();
    }
  };
export const OverlayMixin = dedupeMixin(OverlayMixinImplementation);
