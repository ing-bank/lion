import { css, html, LitElement } from '@lion/core';
import { OverlayMixin } from '@lion/overlays';

/**
 * @customElement lion-tooltip
 */
export class LionTooltip extends OverlayMixin(LitElement) {
  static get properties() {
    return {
      hasArrow: {
        type: Boolean,
        reflect: true,
        attribute: 'has-arrow',
      },
      invokerRelation: {
        type: String,
        attribute: 'invoker-relation',
      },
    };
  }

  static get styles() {
    return css`
      :host {
        --tooltip-arrow-width: 12px;
        --tooltip-arrow-height: 8px;
        display: inline-block;
      }

      :host([hidden]) {
        display: none;
      }

      .arrow {
        position: absolute;
        width: var(--tooltip-arrow-width);
        height: var(--tooltip-arrow-height);
      }

      .arrow svg {
        display: block;
      }

      [x-placement^='bottom'] .arrow {
        top: calc(-1 * var(--tooltip-arrow-height));
        transform: rotate(180deg);
      }

      [x-placement^='left'] .arrow {
        right: calc(
          -1 * (var(--tooltip-arrow-height) +
                (var(--tooltip-arrow-width) - var(--tooltip-arrow-height)) / 2)
        );
        transform: rotate(270deg);
      }

      [x-placement^='right'] .arrow {
        left: calc(
          -1 * (var(--tooltip-arrow-height) +
                (var(--tooltip-arrow-width) - var(--tooltip-arrow-height)) / 2)
        );
        transform: rotate(90deg);
      }

      .arrow {
        display: none;
      }

      :host([has-arrow]) .arrow {
        display: block;
      }
    `;
  }

  constructor() {
    super();
    /**
     * Whether an arrow should be displayed
     * @type {boolean}
     */
    this.hasArrow = false;
    /**
     * Decides whether the tooltip invoker text should be considered a description
     * (sets aria-describedby) or a label (sets aria-labelledby).
     * @type {'label'\'description'}
     */
    this.invokerRelation = 'description';
    this._mouseActive = false;
    this._keyActive = false;
    this.__setupRepositionCompletePromise();
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="_overlay-shadow-outlet"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
        <div class="arrow" x-arrow>${this._arrowTemplate()}</div>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _arrowTemplate() {
    return html`
      <svg viewBox="0 0 12 8">
        <path d="M 0,0 h 12 L 6,8 z"></path>
      </svg>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      placementMode: 'local',
      elementToFocusAfterHide: null,
      hidesOnEsc: true,
      hidesOnOutsideEsc: true,
      popperConfig: {
        placement: 'top', // default
        modifiers: {
          keepTogether: {
            enabled: true,
          },
          arrow: {
            enabled: this.hasArrow,
          },
        },
        onCreate: data => {
          this.__syncFromPopperState(data);
        },
        onUpdate: data => {
          this.__syncFromPopperState(data);
        },
      },
      handlesAccessibility: true,
      isTooltip: true,
      invokerRelation: this.invokerRelation,
    };
  }

  __setupRepositionCompletePromise() {
    this.repositionComplete = new Promise(resolve => {
      this.__repositionCompleteResolver = resolve;
    });
  }

  get _arrowNode() {
    return this.shadowRoot.querySelector('[x-arrow]');
  }

  __syncFromPopperState(data) {
    if (!data) {
      return;
    }
    if (this._arrowNode && data.placement !== this._arrowNode.placement) {
      this.__repositionCompleteResolver(data.placement);
      this.__setupRepositionCompletePromise();
    }
  }

  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this.__resetActive = this.__resetActive.bind(this);
    this._overlayCtrl.addEventListener('hide', this.__resetActive);

    this.addEventListener('mouseenter', this._showMouse);
    this.addEventListener('mouseleave', this._hideMouse);

    this._showKey = this._showKey.bind(this);
    this._overlayInvokerNode.addEventListener('focusin', this._showKey);

    this._hideKey = this._hideKey.bind(this);
    this._overlayInvokerNode.addEventListener('focusout', this._hideKey);
  }

  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();
    this._overlayCtrl.removeEventListener('hide', this.__resetActive);
    this.removeEventListener('mouseenter', this._showMouse);
    this.removeEventListener('mouseleave', this._hideMouse);
    this._overlayInvokerNode.removeEventListener('focusin', this._showKey);
    this._overlayInvokerNode.removeEventListener('focusout', this._hideKey);
  }

  __resetActive() {
    this._mouseActive = false;
    this._keyActive = false;
  }

  _showMouse() {
    if (!this._keyActive) {
      this._mouseActive = true;
      this.opened = true;
    }
  }

  _hideMouse() {
    if (!this._keyActive) {
      this.opened = false;
    }
  }

  _showKey() {
    if (!this._mouseActive) {
      this._keyActive = true;
      this.opened = true;
    }
  }

  _hideKey() {
    if (!this._mouseActive) {
      this.opened = false;
    }
  }
}
