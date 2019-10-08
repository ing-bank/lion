import { render, dedupeMixin } from '@lion/core';

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
          popperConfig: Object,
        };
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

      __syncOpened() {
        if (this._opened) {
          this._overlayCtrl.show();
        } else {
          this._overlayCtrl.hide();
        }
      }

      get popperConfig() {
        return this._popperConfig;
      }

      set popperConfig(config) {
        this._popperConfig = {
          ...this._popperConfig,
          ...config,
        };

        if (this._overlayCtrl && this._overlayCtrl._popper) {
          this._overlayCtrl.updatePopperConfig(this._popperConfig);
        }
      }

      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        this._createOverlay();
        this.__syncOpened();
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

      _renderOverlayContent() {
        render(this._overlayTemplate(), this.__contentParent, {
          scopeName: this.localName,
          eventContext: this,
        });
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
       * @overridable method `_overlayTemplate`
       * Be aware that the overlay will be placed in a different shadow root.
       * Therefore, style encapsulation should be provided by the contents of
       * _overlayTemplate
       * @return {TemplateResult}
       */

      /**
       * @overridable method `_defineOverlay`
       * @desc returns an instance of a (dynamic) overlay controller
       * @returns {OverlayController}
       */
      // eslint-disable-next-line
      _defineOverlay({ contentNode, invokerNode }) {}
    },
);
