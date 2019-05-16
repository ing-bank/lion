import { UpdatingElement } from '@lion/core';
import { overlays, LocalOverlayController } from '@lion/overlays';

export class LionPopup extends UpdatingElement {
  static get properties() {
    return {
      position: {
        type: String,
        reflect: true,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.contentNode = this.querySelector('[slot="content"]');
    this.invokerNode = this.querySelector('[slot="invoker"]');

    this._popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        placement: this.position,
        contentNode: this.contentNode,
        invokerNode: this.invokerNode,
      }),
    );
    this._show = () => this._popup.show();
    this._hide = () => this._popup.hide();
    this._toggle = () => this._popup.toggle();

    this.invokerNode.addEventListener('click', this._toggle);
  }

  update(changedProperties) {
    super.update();
    // To reflect in the LocalOverlayController instance, and trigger the managePosition with this latest position
    if (changedProperties.get('position')) {
      this._popup.sync({ data: { placement: this.position } });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.invokerNode.removeEventListener('click', this._toggle);
  }
}
