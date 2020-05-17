import { dedupeMixin } from '@lion/core';
import { OverlayController } from './OverlayController.js';

/**
 * @type {Function()}
 * @polymerMixinOverlayMixin
 * @mixinFunction
 */
export const OverlayMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow
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
        this.config = {};

        this._overlaySetupComplete = new Promise(resolve => {
          this.__overlaySetupCompleteResolve = resolve;
        });
      }

      get config() {
        return this.__config;
      }

      set config(value) {
        if (this._overlayCtrl) {
          this._overlayCtrl.updateConfig(value);
        }
        this.__config = value;
      }

      _requestUpdate(name, oldValue) {
        super._requestUpdate(name, oldValue);
        if (name === 'opened') {
          this.dispatchEvent(new Event('opened-changed'));
        }
      }

      /**
       * @overridable method `_defineOverlay`
       * @desc returns an instance of a (dynamic) overlay controller
       * In case overriding _defineOverlayConfig is not enough
       * @returns {OverlayController}
       */
      // eslint-disable-next-line
      _defineOverlay({ contentNode, invokerNode, backdropNode, contentWrapperNode }) {
        return new OverlayController({
          contentNode,
          invokerNode,
          backdropNode,
          contentWrapperNode,
          ...this._defineOverlayConfig(), // wc provided in the class as defaults
          ...this.config, // user provided (e.g. in template)
          popperConfig: {
            ...(this._defineOverlayConfig().popperConfig || {}),
            ...(this.config.popperConfig || {}),
            modifiers: {
              ...((this._defineOverlayConfig().popperConfig &&
                this._defineOverlayConfig().popperConfig.modifiers) ||
                {}),
              ...((this.config.popperConfig && this.config.popperConfig.modifiers) || {}),
            },
          },
        });
      }

      /**
       * @overridable method `_defineOverlay`
       * @desc returns an object with default configuration options for your overlay component.
       * This is generally speaking easier to override than _defineOverlay method entirely.
       * @returns {OverlayController}
       */
      // eslint-disable-next-line
      _defineOverlayConfig() {
        return {
          placementMode: 'local',
        };
      }

      updated(changedProperties) {
        super.updated(changedProperties);

        if (
          changedProperties.has('opened') &&
          this._overlayCtrl &&
          !this.__blockSyncToOverlayCtrl
        ) {
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
        this.__closeEventInContentNodeHandler = ev => {
          ev.stopPropagation();
          this._overlayCtrl.hide();
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

      async connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }

        // Wait for DOM to be ready before setting up the overlay, else extensions like rich select breaks
        this.updateComplete.then(() => {
          if (!this.__isOverlaySetup) {
            this._setupOverlayCtrl();
          }
        });

        // When dom nodes are being moved around (meaning connected/disconnected are being fired
        // repeatedly), we need to delay the teardown until we find a 'permanent disconnect'
        if (this.__rejectOverlayDisconnectComplete) {
          // makes sure _overlayDisconnectComplete never resolves: we don't want a teardown
          this.__rejectOverlayDisconnectComplete();
        }
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }

        this._overlayDisconnectComplete = new Promise((resolve, reject) => {
          this.__resolveOverlayDisconnectComplete = resolve;
          this.__rejectOverlayDisconnectComplete = reject;
        });

        setTimeout(() => {
          // we start the teardown below
          this.__resolveOverlayDisconnectComplete();
        });

        if (this._overlayCtrl) {
          // We need to prevent that we create a setup/teardown cycle during startup, where it
          // is common that the overlay system moves around nodes. Therefore, we make the
          // teardown async, so that it only happens when we are permanently disconnecting from dom
          this._overlayDisconnectComplete.then(() => {
            this._teardownOverlayCtrl();
          });
        }
      }

      get _overlayInvokerNode() {
        return Array.from(this.children).find(child => child.slot === 'invoker');
      }

      get _overlayBackdropNode() {
        return Array.from(this.children).find(child => child.slot === 'backdrop');
      }

      get _overlayContentNode() {
        if (!this._cachedOverlayContentNode) {
          this._cachedOverlayContentNode = Array.from(this.children).find(
            child => child.slot === 'content',
          );
        }
        return this._cachedOverlayContentNode;
      }

      get _overlayContentWrapperNode() {
        return this.shadowRoot.querySelector('#overlay-content-node-wrapper');
      }

      _setupOverlayCtrl() {
        this._overlayCtrl = this._defineOverlay({
          contentNode: this._overlayContentNode,
          contentWrapperNode: this._overlayContentWrapperNode,
          invokerNode: this._overlayInvokerNode,
          backdropNode: this._overlayBackdropNode,
        });
        this.__syncToOverlayController();
        this.__setupSyncFromOverlayController();
        this._setupOpenCloseListeners();
        this.__overlaySetupCompleteResolve();
        this.__isOverlaySetup = true;
      }

      _teardownOverlayCtrl() {
        this._teardownOpenCloseListeners();
        this.__teardownSyncFromOverlayController();
        this._overlayCtrl.teardown();
        this.__isOverlaySetup = false;
      }

      /**
       * When the opened state is changed by an Application Developer,cthe OverlayController is
       * requested to show/hide. It might happen that this request is not honoured
       * (intercepted in before-hide for instance), so that we need to sync the controller state
       * to this webcomponent again, preventing eternal loops.
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

        this.__onBeforeShow = beforeShowEvent => {
          const event = new CustomEvent('before-opened', { cancelable: true });
          this.dispatchEvent(event);
          if (event.defaultPrevented) {
            // Check whether our current `.opened` state is not out of sync with overlayCtrl
            this._setOpenedWithoutPropertyEffects(this._overlayCtrl.isShown);
            beforeShowEvent.preventDefault();
          }
        };

        this.__onBeforeHide = beforeHideEvent => {
          const event = new CustomEvent('before-closed', { cancelable: true });
          this.dispatchEvent(event);
          if (event.defaultPrevented) {
            // Check whether our current `.opened` state is not out of sync with overlayCtrl
            this._setOpenedWithoutPropertyEffects(this._overlayCtrl.isShown);
            beforeHideEvent.preventDefault();
          }
        };

        this._overlayCtrl.addEventListener('show', this.__onOverlayCtrlShow);
        this._overlayCtrl.addEventListener('hide', this.__onOverlayCtrlHide);
        this._overlayCtrl.addEventListener('before-show', this.__onBeforeShow);
        this._overlayCtrl.addEventListener('before-hide', this.__onBeforeHide);
      }

      __teardownSyncFromOverlayController() {
        this._overlayCtrl.removeEventListener('show', this.__onOverlayCtrlShow);
        this._overlayCtrl.removeEventListener('hide', this.__onOverlayCtrlHide);
        this._overlayCtrl.removeEventListener('before-show', this.__onBeforeShow);
        this._overlayCtrl.removeEventListener('before-hide', this.__onBeforeHide);
      }

      __syncToOverlayController() {
        if (this.opened) {
          this._overlayCtrl.show();
        } else {
          this._overlayCtrl.hide();
        }
      }
    },
);
