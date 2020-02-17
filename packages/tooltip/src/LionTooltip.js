import { html, css, LitElement } from '@lion/core';
import { OverlayMixin } from '@lion/overlays';

export class LionTooltip extends OverlayMixin(LitElement) {
  constructor() {
    super();
    this._mouseActive = false;
    this._keyActive = false;
    this.__setupRepositionCompletePromise();
  }

  connectedCallback() {
    super.connectedCallback();
    this._overlayContentNode.setAttribute('role', 'tooltip');
  }

  static get styles() {
    return css`
      .arrow {
        position: absolute;
        --tooltip-arrow-width: 12px;
        --tooltip-arrow-height: 8px;
        width: var(--tooltip-arrow-width);
        height: var(--tooltip-arrow-height);
      }

      .arrow__graphic {
        display: block;
      }

      [data-popper-placement^='bottom'] .arrow {
        top: calc(-1 * var(--tooltip-arrow-height));
      }

      [data-popper-placement^='bottom'] .arrow__graphic {
        transform: rotate(180deg);
      }

      [data-popper-placement^='left'] .arrow {
        right: calc(
          -1 * (var(--tooltip-arrow-height) +
                (var(--tooltip-arrow-width) - var(--tooltip-arrow-height)) / 2)
        );
      }

      [data-popper-placement^='left'] .arrow__graphic {
        transform: rotate(270deg);
      }

      [data-popper-placement^='right'] .arrow {
        left: calc(
          -1 * (var(--tooltip-arrow-height) +
                (var(--tooltip-arrow-width) - var(--tooltip-arrow-height)) / 2)
        );
      }

      [data-popper-placement^='right'] .arrow__graphic {
        transform: rotate(90deg);
      }
    `;
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
        <div class="arrow" data-popper-arrow>
          ${this._arrowTemplate()}
        </div>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _arrowTemplate() {
    return html`
      <svg class="arrow__graphic" viewBox="0 0 12 8">
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
        modifiers: [
          {
            name: 'keepTogether',
            enabled: true,
          },
          {
            name: 'arrow',
            enabled: true,
            options: {
              padding: 8, // 8px from the edges of the popper
            },
          },
        ],
        onFirstUpdate: data => {
          this.__syncFromPopperState(data);
        },
        afterWrite: data => {
          this.__syncFromPopperState(data);
        },
      },
    };
  }

  __setupRepositionCompletePromise() {
    this.repositionComplete = new Promise(resolve => {
      this.__repositionCompleteResolver = resolve;
    });
  }

  __syncFromPopperState(data) {
    if (!data) {
      return;
    }
    if (this.__arrowElement && data.placement !== this.__arrowElement.placement) {
      this.__arrowElement.placement = data.placement;
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
