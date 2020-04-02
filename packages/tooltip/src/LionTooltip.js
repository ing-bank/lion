import { html, LitElement } from '@lion/core';
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
    // Schedule setting up the arrow element so that it works both on firstUpdated
    // and when the tooltip is moved in the DOM (disconnected + reconnected)
    this.updateComplete.then(() => this.__setupArrowElement());
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
      <slot name="arrow"></slot>
      <slot name="_overlay-shadow-outlet"></slot>
    `;
  }

  __setupArrowElement() {
    this.__arrowElement = Array.from(this.children).find(child => child.slot === 'arrow');
    if (!this.__arrowElement) {
      return;
    }
    this.__arrowElement.setAttribute('x-arrow', true);
    this._overlayContentNodeWrapper.appendChild(this.__arrowElement);
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
            enabled: true,
          },
        },
        onCreate: data => {
          this.__syncFromPopperState(data);
        },
        onUpdate: data => {
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
