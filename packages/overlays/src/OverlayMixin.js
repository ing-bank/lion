import { dedupeMixin } from '@lion/core';
import { OverlayController } from './OverlayController.js';

/**
 * @type {Function()}
 * @polymerMixin
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
      _defineOverlay({ contentNode, invokerNode }) {
        return new OverlayController({
          contentNode,
          invokerNode,
          ...this._defineOverlayConfig(),
          ...this.config,
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

        if (changedProperties.has('opened')) {
          if (this._overlayCtrl) {
            this.__syncToOverlayController();
          }
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

      firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        // we setup in firstUpdated so we can use nodes from light and shadowDom
        this._setupOverlayCtrl();
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

      get _overlayContentNode() {
        if (this._cachedOverlayContentNode) {
          return this._cachedOverlayContentNode;
        }

        // FIXME: This should shadow outlet in between the host and the content slot, is a problem
        // Should simply be Array.from(this.children).find(child => child.slot === 'content')
        // Issue: https://github.com/ing-bank/lion/issues/382
        const shadowOutlet = Array.from(this.children).find(
          child => child.slot === '_overlay-shadow-outlet',
        );
        if (shadowOutlet) {
          this._cachedOverlayContentNode = Array.from(shadowOutlet.children).find(
            child => child.slot === 'content',
          );
        } else {
          this._cachedOverlayContentNode = Array.from(this.children).find(
            child => child.slot === 'content',
          );
        }
        return this._cachedOverlayContentNode;
      }

      _setupOverlayCtrl() {
        this._overlayCtrl = this._defineOverlay({
          contentNode: this._overlayContentNode,
          invokerNode: this._overlayInvokerNode,
        });
        this.__syncToOverlayController();
        this.__setupSyncFromOverlayController();
        this._setupOpenCloseListeners();
      }

      _teardownOverlayCtrl() {
        this._teardownOpenCloseListeners();
        this.__teardownSyncFromOverlayController();
        this._overlayCtrl.teardown();
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
            beforeShowEvent.preventDefault();
          }
        };

        this.__onBeforeHide = beforeHideEvent => {
          const event = new CustomEvent('before-closed', { cancelable: true });
          this.dispatchEvent(event);
          if (event.defaultPrevented) {
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
