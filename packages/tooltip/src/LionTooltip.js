import { LionPopup } from '@lion/popup';

export class LionTooltip extends LionPopup {
  constructor() {
    super();
    this.mouseActive = false;
    this.keyActive = false;

    // Trigger config setter to ensure it updates in OverlayController
    this.config = {
      ...this.config,
      elementToFocusAfterHide: null,
    };
  }

  _setupShowHideListeners() {
    this.__resetActive = () => {
      this.mouseActive = false;
      this.keyActive = false;
    };

    this.__showMouse = () => {
      if (!this.keyActive) {
        this.mouseActive = true;
        this.opened = true;
      }
    };

    this.__hideMouse = () => {
      if (!this.keyActive) {
        this.opened = false;
      }
    };

    this.__showKey = () => {
      if (!this.mouseActive) {
        this.keyActive = true;
        this.opened = true;
      }
    };

    this.__hideKey = () => {
      if (!this.mouseActive) {
        this.opened = false;
      }
    };

    this._overlayCtrl.addEventListener('hide', this.__resetActive);
    this.addEventListener('mouseenter', this.__showMouse);
    this.addEventListener('mouseleave', this.__hideMouse);
    this._overlayInvokerNode.addEventListener('focusin', this.__showKey);
    this._overlayInvokerNode.addEventListener('focusout', this.__hideKey);
  }

  _teardownShowHideListeners() {
    this._overlayCtrl.removeEventListener('hide', this.__resetActive);
    this.removeEventListener('mouseenter', this.__showMouse);
    this.removeEventListener('mouseleave', this._hideMouse);
    this._overlayInvokerNode.removeEventListener('focusin', this._showKey);
    this._overlayInvokerNode.removeEventListener('focusout', this._hideKey);
  }

  connectedCallback() {
    super.connectedCallback();
    this._overlayContentNode.setAttribute('role', 'tooltip');
  }
}
