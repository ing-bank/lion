import { LionPopup } from '@lion/popup';
import { overlays, LocalOverlayController } from '@lion/overlays';

export class LionTooltip extends LionPopup {
  constructor() {
    super();
    this.mouseActive = false;
    this.keyActive = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.contentNode = this.querySelector('[slot="content"]');
    this.invokerNode = this.querySelector('[slot="invoker"]');
    this.contentNode.setAttribute('role', 'tooltip');

    this._controller = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        popperConfig: this.popperConfig,
        contentNode: this.contentNode,
        invokerNode: this.invokerNode,
      }),
    );

    this.__resetActive = () => {
      this.mouseActive = false;
      this.keyActive = false;
    };

    this.__showMouse = () => {
      if (!this.keyActive) {
        this.mouseActive = true;
        this._controller.show();
      }
    };

    this.__hideMouse = () => {
      if (!this.keyActive) {
        this._controller.hide();
      }
    };

    this.__showKey = () => {
      if (!this.mouseActive) {
        this.keyActive = true;
        this._controller.show();
      }
    };

    this.__hideKey = () => {
      if (!this.mouseActive) {
        this._controller.hide();
      }
    };

    this._controller.addEventListener('hide', this.__resetActive);
    this.addEventListener('mouseenter', this.__showMouse);
    this.addEventListener('mouseleave', this.__hideMouse);
    this.invokerNode.addEventListener('focusin', this.__showKey);
    this.invokerNode.addEventListener('focusout', this.__hideKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._controller.removeEventListener('hide', this.__resetActive);
    this.removeEventListener('mouseenter', this.__showMouse);
    this.removeEventListener('mouseleave', this._hideMouse);
    this.invokerNode.removeEventListener('focusin', this._showKey);
    this.invokerNode.removeEventListener('focusout', this._hideKey);
  }
}
