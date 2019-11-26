import { render, dedupeMixin } from '@lion/core';
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
          config: {
            type: Object,
          },
          closeEventName: {
            type: String,
          },
        };
      }

      constructor() {
        super();
        this.config = {};
        this.closeEventName = 'overlay-close';
      }

      get opened() {
        return this._overlayCtrl.isShown;
      }

      set opened(show) {
        this._opened = show; // mainly captured for sync on connectedCallback
        if (this._overlayCtrl) {
          this.__syncOpened();
        }
      }

      get config() {
        return this._config;
      }

      set config(value) {
        if (this._overlayCtrl) {
          this._overlayCtrl.updateConfig(value);
        }
        this._config = value;
      }

      /**
       * @overridable method `_overlayTemplate`
       * Be aware that the overlay will be placed in a different shadow root.
       * Therefore, style encapsulation should be provided by the contents of
       * _overlayTemplate
       * @return {TemplateResult}
       */

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
        return {};
      }

      /**
       * @overridable
       * @desc use this method to setup your open and close event listeners
       * For example, set a click event listener on _overlayInvokerNode to set opened to true
       */
      // eslint-disable-next-line class-methods-use-this
      _setupOpenCloseListeners() {}

      /**
       * @overridable
       * @desc use this method to tear down your event listeners
       */
      // eslint-disable-next-line class-methods-use-this
      _teardownOpenCloseListeners() {}

      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        this._createOverlay();

        // Default close event catcher on the contentNode which is useful if people want to close
        // their overlay but the content is not in the global root node (nowhere near the overlay component)
        this.__close = () => {
          this.opened = false;
        };
        this._overlayCtrl.contentNode.addEventListener(this.closeEventName, this.__close);

        this._setupOpenCloseListeners();
        this.__syncOpened();
        this.__syncPopper();
      }

      firstUpdated(c) {
        super.firstUpdated(c);
        this._createOutletForLocalOverlay();
      }

      updated(c) {
        super.updated(c);
        if (this.__managesOverlayViaTemplate) {
          this._renderOverlayContent();
        }
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }
        this._overlayCtrl.contentNode.removeEventListener(this.closeEventName, this.__close);
        this._teardownOpenCloseListeners();
      }

      get _overlayInvokerNode() {
        return Array.from(this.children).find(child => child.slot === 'invoker');
      }

      // FIXME: This should be refactored to
      // Array.from(this.children).find(child => child.slot === 'content')
      // When this issue is fixed https://github.com/ing-bank/lion/issues/382
      get _overlayContentNode() {
        const contentNode = this.querySelector('[slot=content]');
        if (contentNode) {
          this._cachedOverlayContentNode = contentNode;
        }
        return contentNode || this._cachedOverlayContentNode;
      }

      _renderOverlayContent() {
        render(this._overlayTemplate(), this.__contentParent, {
          scopeName: this.localName,
          eventContext: this,
        });
      }

      _createOverlay() {
        let contentNode;
        if (this.__managesOverlayViaTemplate) {
          this.__contentParent = document.createElement('div');
          this._renderOverlayContent();
          contentNode = this.__contentParent.firstElementChild;
        } else {
          contentNode = this._overlayContentNode;
        }

        // Why no template support for invokerNode?
        // -> Because this node will always be managed by the Subclasser and should
        //    reside in the dom of the sub class. A reference to a rendered node suffices.
        const invokerNode = this._overlayInvokerNode;
        this._overlayCtrl = this._defineOverlay({ contentNode, invokerNode });
      }

      // FIXME: We add an overlay slot to the wrapper, but the content node already has a slot="content"
      // This is a big problem, because slots should be direct children of its host element.
      // Putting the shadow outlet slot in between breaks that. https://github.com/ing-bank/lion/issues/382
      /**
       * @desc Should be called by Subclasser for local overlay support in shadow roots
       * Create an outlet slot in shadow dom that our local overlay can pass through
       */
      _createOutletForLocalOverlay() {
        const outlet = document.createElement('slot');
        outlet.name = '_overlay-shadow-outlet';
        this.shadowRoot.appendChild(outlet);
        this._overlayCtrl._contentNodeWrapper.slot = '_overlay-shadow-outlet';
      }

      /**
       * @desc Two options for a Subclasser:
       * - 1: Define a template in `._overlayTemplate`. In this case the overlay content is
       * predefined and thus belongs to the web component. Examples: datepicker.
       * - 2: Define a getter `_overlayContentNode` that returns a node reference to a (content
       * projected) node. Used when Application Developer is in charge of the content. Examples:
       * popover, dialog, bottom sheet, dropdown, tooltip, select, combobox etc.
       */
      get __managesOverlayViaTemplate() {
        return Boolean(this._overlayTemplate);
      }

      __syncOpened() {
        if (this._opened) {
          this._overlayCtrl.show();
        } else {
          this._overlayCtrl.hide();
        }
      }

      __syncPopper() {
        if (this._overlayCtrl) {
          // TODO: Use updateConfig directly.. But maybe we can remove this entirely.
          this._overlayCtrl.updatePopperConfig(this.config.popperConfig);
        }
      }
    },
);
