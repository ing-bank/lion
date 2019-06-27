import { UpdatingElement } from '@lion/core';
import { overlays, LocalOverlayController } from '@lion/overlays';

export class LionPopup extends UpdatingElement {
  static get properties() {
    return {
      popperConfig: {
        type: Object,
      },
    };
  }

  get popperConfig() {
    return this._popperConfig;
  }

  set popperConfig(config) {
    this._popperConfig = {
      ...this._popperConfig,
      ...config,
    };

    if (this._controller && this._controller._popper) {
      this._controller.updatePopperConfig(this._popperConfig);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.contentNode = this.querySelector('[slot="content"]');
    this.invokerNode = this.querySelector('[slot="invoker"]');

    this._controller = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        popperConfig: this.popperConfig,
        contentNode: this.contentNode,
        invokerNode: this.invokerNode,
      }),
    );
    this._show = () => this._controller.show();
    this._hide = () => this._controller.hide();
    this._toggle = () => this._controller.toggle();

    this.invokerNode.addEventListener('click', this._toggle);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.invokerNode.removeEventListener('click', this._toggle);
  }
}
