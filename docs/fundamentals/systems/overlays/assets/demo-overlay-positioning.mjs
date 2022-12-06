/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
import { html, LitElement, css } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { OverlayMixin } from '@lion/ui/overlays.js';
import './demo-overlay-system.mjs';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/types/overlays.js').OverlayHost} OverlayHost
 * @typedef {import('@lion/ui/button.js').LionButton} LionButton
 * @typedef {'top-start'|'top'|'top-end'|'right-start'|'right'|'right-end'|'bottom-start'|'bottom'|'bottom-end'|'left-start'|'left'|'left-end'} LocalPlacement
 * @typedef {'center'|'top-left'|'top'|'top-right'|'right'|'bottom-right'|'bottom'|'bottom-left'|'left'} ViewportPlacement
 * @typedef {{refs: { contentNodeWrapper:{ref: {value:HTMLElement}}; closeButton: {ref: {value:HTMLButtonElement|LionButton}; label:string} }}} TemplateDataForOverlay
 */
class DemoOverlayEl extends OverlayMixin(LitElement) {
  /** @type {any} */
  static get properties() {
    return {
      simulateViewport: { type: Boolean, attribute: 'simulate-viewport', reflect: true },
      noDialogEl: { type: Boolean, attribute: 'no-dialog-el' },
      useAbsolute: { type: Boolean, attribute: 'use-absolute', reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles || [],
      css`
        :host([use-absolute]) dialog {
          position: absolute !important;
        }

        :host([simulate-viewport]) {
          position: absolute;
          inset: 0;
          z-index: -1;
        }

        :host([simulate-viewport]) dialog {
          position: absolute !important;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        :host([simulate-viewport])
          #overlay-content-node-wrapper.global-overlays__overlay-container {
          position: absolute;
        }

        /*=== demo invoker and content ===*/

        :host ::slotted([slot='invoker']) {
          border: 4px dashed;
          height: 24px;
          min-width: 24px;
        }

        :host ::slotted([slot='content']) {
          background-color: black;
          color: white;
          height: 54px;
          min-width: 54px;
          display: flex;
          place-items: center;
          padding: 20px;
          text-align: center;
          font-size: 0.8rem;
        }
      `,
    ];
  }

  constructor() {
    super();

    this.simulateViewport = false;
    this._noDialogEl = false;
    this.useAbsolute = false;
  }

  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return /** @type {OverlayConfig} */ ({
      placementMode: 'local',
      noDialogEl: this._noDialogEl,
      popperConfig: { strategy: this.useAbsolute ? 'absolute' : 'fixed' },
    });
  }

  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.addEventListener('click', this.toggle);
    }
  }

  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.removeEventListener('click', this.toggle);
    }
  }

  refs = {
    invokerSlot: /** @type {{value: HTMLSlotElement}} */ (createRef()),
    backdropSlot: /** @type {{value: HTMLSlotElement}} */ (createRef()),
    contentSlot: /** @type {{value: HTMLSlotElement}} */ (createRef()),
    closeButton: /** @type {{value: HTMLButtonElement|LionButton}} */ (createRef()),
    contentNodeWrapper: /** @type {{value: HTMLElement}} */ (createRef()),
  };

  /**
   * @overridable
   * @type {TemplateDataForOverlay}
   */
  get _templateData() {
    return {
      refs: {
        contentNodeWrapper: {
          ref: this.refs.contentNodeWrapper,
        },
        closeButton: {
          ref: this.refs.closeButton,
          label: 'close dialog',
        },
      },
    };
  }

  static templates = {
    main: (/** @type {TemplateDataForOverlay} */ { refs }) => html`
      <slot name="invoker"></slot>
      <slot name="backdrop"></slot>
      <div ${ref(refs.contentNodeWrapper.ref)} id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
    `,
  };

  render() {
    const ctor = /** @type {typeof DemoOverlayEl} */ (this.constructor);
    const templates = this.templates || ctor.templates;
    return templates.main(this._templateData);
  }
}
customElements.define('demo-overlay-el', DemoOverlayEl);

class DemoOverlayPositioning extends LitElement {
  static properties = {
    placementMode: { attribute: 'placement-mode', type: String },
    simulateViewport: { type: Boolean, attribute: 'simulate-viewport', reflect: true },
    _activePos: { type: String, reflect: true, attribute: 'active-pos' },
    _activeConfig: { type: Object, state: true },
  };

  static get styles() {
    return [
      css`
        /*=== .pos-container ===*/

        .pos-container {
          padding: 0.5rem;
          overflow: hidden;
          place-items: center;
          height: 20rem;
          display: grid;
          position: relative;
        }

        /*=== .pos-btn-wrapper ===*/

        /** 
         * We need a wrapper for position transforms, so that we can apply scale transforms on .pos-btn hover 
        */

        .pos-btn-wrapper {
          position: absolute;
        }

        .pos-container--local .pos-btn-wrapper--bottom-start,
        .pos-container--local .pos-btn-wrapper--bottom-end,
        .pos-container--local .pos-btn-wrapper--top-start,
        .pos-container--local .pos-btn-wrapper--top-end,
        .pos-container--local .pos-btn-wrapper--top,
        .pos-container--local .pos-btn-wrapper--bottom {
          left: 50%;
          transform: translateX(-50%);
        }

        .pos-container--local .pos-btn-wrapper--top-start,
        .pos-container--local .pos-btn-wrapper--top-end,
        .pos-container--local .pos-btn-wrapper--top {
          top: 0;
        }

        .pos-container--local .pos-btn-wrapper--bottom-start,
        .pos-container--local .pos-btn-wrapper--bottom-end,
        .pos-container--local .pos-btn-wrapper--bottom {
          bottom: 0;
        }

        .pos-container--local .pos-btn-wrapper--left-start,
        .pos-container--local .pos-btn-wrapper--left-end,
        .pos-container--local .pos-btn-wrapper--right-start,
        .pos-container--local .pos-btn-wrapper--right-end,
        .pos-container--local .pos-btn-wrapper--left,
        .pos-container--local .pos-btn-wrapper--right {
          top: 50%;
          transform: translateY(-50%);
        }

        .pos-container--local .pos-btn-wrapper--left-start,
        .pos-container--local .pos-btn-wrapper--left-end,
        .pos-container--local .pos-btn-wrapper--left {
          left: 0;
        }

        .pos-container--local .pos-btn-wrapper--right-start,
        .pos-container--local .pos-btn-wrapper--right-end,
        .pos-container--local .pos-btn-wrapper--right {
          right: 0;
        }

        .pos-container--local .pos-btn-wrapper--bottom-start,
        .pos-container--local .pos-btn-wrapper--top-start {
          transform: translateX(-50%) translateX(-48px);
        }

        .pos-container--local .pos-btn-wrapper--bottom-end,
        .pos-container--local .pos-btn-wrapper--top-end {
          transform: translateX(-50%) translateX(48px);
        }

        .pos-container--local .pos-btn-wrapper--left-start,
        .pos-container--local .pos-btn-wrapper--right-start {
          transform: translateY(calc(-50% - 48px));
        }

        .pos-container--local .pos-btn-wrapper--left-end,
        .pos-container--local .pos-btn-wrapper--right-end {
          transform: translateY(calc(-50% + 48px));
        }

        .pos-container--global .pos-btn-wrapper {
          top: 50%;
          left: 50%;
        }

        .pos-container--global .pos-btn-wrapper--center {
          transform: translateY(-50%) translateX(-50%);
        }

        .pos-container--global .pos-btn-wrapper--top-left {
          transform: translateY(-50%) translateX(-50%) translateY(-48px) translateX(-48px);
        }

        .pos-container--global .pos-btn-wrapper--top {
          transform: translateY(-50%) translateX(-50%) translateY(-48px);
        }

        .pos-container--global .pos-btn-wrapper--top-right {
          transform: translateY(-50%) translateX(-50%) translateY(-48px) translateX(48px);
        }

        .pos-container--global .pos-btn-wrapper--bottom-left {
          transform: translateY(-50%) translateX(-50%) translateY(48px) translateX(-48px);
        }

        .pos-container--global .pos-btn-wrapper--bottom {
          transform: translateY(-50%) translateX(-50%) translateY(48px);
        }

        .pos-container--global .pos-btn-wrapper--bottom-right {
          transform: translateY(-50%) translateX(-50%) translateY(48px) translateX(48px);
        }

        .pos-container--global .pos-btn-wrapper--right {
          transform: translateY(-50%) translateX(-50%) translateX(48px);
        }

        .pos-container--global .pos-btn-wrapper--left {
          transform: translateY(-50%) translateX(-50%) translateX(-48px);
        }

        /*=== .pos-btn ===*/

        .pos-btn {
          padding: 1rem;
          cursor: pointer;
          -webkit-appearance: button;
          background-color: transparent;
          background-image: none;
          text-transform: none;
          font-family: inherit;
          font-size: 100%;
          line-height: inherit;
          color: inherit;
          margin: 0;
          box-sizing: border-box;
          border: 0 solid #bfc3d9;
        }

        .pos-btn__inner {
          border-style: solid;
          border-width: 2px;
          border-radius: 100%;
          width: 0.25rem;
          height: 0.25rem;
        }

        .pos-btn:hover {
          transform: scaleX(2) scaleY(2);
        }

        .pos-btn--active .pos-btn__inner {
          background-color: black;
        }

        /*=== .reference-btn ===*/

        .reference-btn {
          background: white;
          box-sizing: border-box;
          border: 5px dashed black;
          cursor: pointer;
          padding: 1rem;
          width: 8rem;
          height: 8rem;
        }

        .pos-container--global .reference-btn {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        /*=== .close-btn ===*/

        .close-btn {
          background: transparent;
          border: none;
          position: absolute;
          right: 0;
          top: 0;
          padding: 0.5rem;
        }

        .close-btn::after {
          content: '';
          clear: both;
        }

        /*=== .overlay-content ===*/

        .overlay-content {
          display: flex;
          box-sizing: border-box;
          border: 1px solid black;
          align-items: center;
          justify-items: center;
          background-color: #000;
          padding: 1rem;
          width: 2rem;
          height: 2rem;
        }

        :host([active-pos^='center']) .pos-container--global .overlay-content {
          width: 14rem;
          height: 16rem;
        }

        :host([active-pos^='bottom']) .pos-container--global .overlay-content,
        :host([active-pos^='top']) .pos-container--global .overlay-content {
          width: 50%;
        }

        :host([active-pos^='left']) .pos-container--global .overlay-content,
        :host([active-pos^='right']) .pos-container--global .overlay-content {
          height: 50%;
        }

        :host([active-pos^='center']) .pos-btn {
          color: white;
        }
      `,
    ];
  }

  refs = {
    overlay: /** @type {{value: OverlayHost}} */ (createRef()),
  };

  constructor() {
    super();

    this.placementMode = 'local';
    /** @type {ViewportPlacement[]|LocalPlacement[]} */
    this._placements = [];
    this.simulateViewport = false;
    this._activePos = 'top';
  }

  /**
   *
   * @param {{pos:ViewportPlacement|LocalPlacement}} opts
   */
  async _updatePos({ pos }) {
    this._activePos = pos;

    const overlayEl = this.refs.overlay.value;

    // @ts-ignore allow protected
    if (overlayEl?._overlayCtrl) {
      overlayEl.config = /** @type {Partial<OverlayConfig>} */ ({
        popperConfig: { placement: pos },
        viewportConfig: { placement: pos },
      });
      // TODO: these hacks below should not be needed. Fix when moving to floating-ui
      // => animate different positions
      // @ts-ignore allow protected
      await overlayEl._overlayCtrl.hide();
      // @ts-ignore allow protected
      overlayEl._overlayCtrl.show();
      overlayEl.config = /** @type {Partial<OverlayConfig>} */ ({
        popperConfig: { placement: pos },
        viewportConfig: { placement: pos },
      });
    }
  }

  /**
   * @param {import('lit').PropertyValues } changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    this._updatePos({ pos: this.placementMode === 'local' ? 'top' : 'center' });
  }

  /**
   * @param {import('lit').PropertyValues } changedProperties
   */
  update(changedProperties) {
    if (changedProperties.has('placementMode')) {
      if (this.placementMode === 'local') {
        this._placements = [
          `top-start`,
          `top`,
          `top-end`,
          `right-start`,
          `right`,
          `right-end`,
          `bottom-start`,
          `bottom`,
          `bottom-end`,
          `left-start`,
          `left`,
          `left-end`,
        ];
      } else {
        this._placements = [
          `center`,
          `top-left`,
          `top`,
          `top-right`,
          `right`,
          `bottom-right`,
          `bottom`,
          `bottom-left`,
          `left`,
        ];
      }
    }
    super.update(changedProperties);
  }

  /**
   * @param {import('lit').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('placementMode')) {
      this._activeConfig = {
        placementMode: this.placementMode,
      };
    }
  }

  /**
   * @param {{pos:string}} opts
   * @returns
   */
  _isActivePosBtn({ pos }) {
    return pos === this._activePos;
  }

  render() {
    return html`
      <div class="pos-container pos-container--${this.placementMode}">
        ${this._placements.map(
          pos =>
            html`
              <div class="pos-btn-wrapper pos-btn-wrapper--${pos}">
                <button
                  @click="${() => this._updatePos({ pos })}"
                  class="pos-btn ${this._isActivePosBtn({ pos }) ? 'pos-btn--active' : ''}"
                  aria-label="${pos}"
                >
                  <div class="pos-btn__inner"></div>
                </button>
              </div>
            `,
        )}

        <demo-overlay-el
          opened
          ?simulate-viewport="${this.simulateViewport}"
          ${ref(
            // @ts-ignore
            this.refs.overlay,
          )}
          .config="${this._activeConfig}"
        >
          <button class="reference-btn" slot="invoker"></button>
          <div class="overlay-content" slot="content"></div>
        </demo-overlay-el>
      </div>
    `;
  }
}
customElements.define('demo-overlay-positioning', DemoOverlayPositioning);
