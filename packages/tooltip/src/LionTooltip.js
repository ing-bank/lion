import { OverlayMixin } from '@lion/overlays';
import { LitElement, html } from '@lion/core';

export class LionTooltip extends OverlayMixin(LitElement) {
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      placementMode: 'local', // have to set a default
      elementToFocusAfterHide: null,
      hidesOnEsc: true,
    };
  }

  constructor() {
    super();
    this.mouseActive = false;
    this.keyActive = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._overlayContentNode.setAttribute('role', 'tooltip');
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
    this.shadowRoot
      .querySelector('slot[name="arrow"]')
      .addEventListener('slotchange', this.__updateSlottedArrow.bind(this));
    this.__updateSlottedArrow();
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
      <slot name="arrow"></slot>
      <slot name="_overlay-shadow-outlet"></slot>
    `;
  }

  _setupOpenCloseListeners() {
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

  _teardownOpenCloseListeners() {
    this._overlayCtrl.removeEventListener('hide', this.__resetActive);
    this.removeEventListener('mouseenter', this.__showMouse);
    this.removeEventListener('mouseleave', this._hideMouse);
    this._overlayInvokerNode.removeEventListener('focusin', this._showKey);
    this._overlayInvokerNode.removeEventListener('focusout', this._hideKey);
  }

  __updateSlottedArrow() {
    const arrowSlottableNode = Array.from(this.children).find(child => child.slot === 'arrow');
    if (arrowSlottableNode) {
      this.__removeExistingArrowInsideContent();
      this.__moveArrowInsideContent(arrowSlottableNode);
    }
  }

  // Move arrow slottable inside the content node
  __moveArrowInsideContent(node) {
    const _node = node;
    _node.setAttribute('x-arrow', true);
    _node.style.position = 'absolute';
    this.__arrowHeight = _node.getBoundingClientRect().height;

    // Broken for placement: bottom --> offset = top , popper removes inline styles :(
    _node.style[`${this.__arrowStyles.offset}`] = `-${this.__arrowHeight}px`;

    _node.style.transform = `rotate(deg(${this.__arrowStyles.rotation}))`;

    this._overlayContentNode.appendChild(_node);
    if (this._overlayCtrl && this._overlayCtrl._popper) {
      this._overlayCtrl._popper.update();
    }
  }

  // Remove pre-existing arrow slottable
  __removeExistingArrowInsideContent() {
    if (this._overlayContentNode) {
      const arrowInContent = Array.from(this._overlayContentNode.children).find(
        child => child.slot === 'arrow',
      );

      if (arrowInContent) {
        this._overlayContentNode.removeChild(arrowInContent);
      }
    }
  }

  get __arrowStyles() {
    let pos;
    const popperCfg = this._overlayCtrl.config.popperConfig;
    if (popperCfg && popperCfg.placement) {
      const reg = RegExp('([a-z]{3,})(-)?', 'g');
      const result = reg.exec(popperCfg.placement);
      pos = result ? result[1] : 'bottom'; // fallback bottom, because popper fallback is also bottom
    }

    switch (pos) {
      case 'top':
        return { rotation: 0, offset: 'bottom' };
      case 'left':
        return { rotation: 270, offset: 'right' };
      case 'right':
        return { rotation: 90, offset: 'left' };
      default:
        return { rotation: 180, offset: 'top' };
    }
  }
}
