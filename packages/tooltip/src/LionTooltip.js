import { UpdatingElement } from '@lion/core';
import { overlays, LocalOverlayController } from '@lion/overlays';

export class LionTooltip extends UpdatingElement {
  static get properties() {
    return {
      position: {
        type: String,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.contenNode = this.querySelector('[slot="content"]');
    this.invokerNode = this.querySelector('[slot="invoker"]');

    this._tooltip = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        placement: this.position,
        contentNode: this.contenNode,
        invokerNode: this.invokerNode,
      }),
    );
    this._show = () => this._tooltip.show();
    this._hide = () => this._tooltip.hide();

    this.invokerNode.addEventListener('mouseenter', this._show);
    this.invokerNode.addEventListener('mouseleave', this._hide);
    this.invokerNode.addEventListener('focusin', this._show);
    this.invokerNode.addEventListener('focusout', this._hide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.invokerNode.removeEventListener('mouseenter', this._show);
    this.invokerNode.removeEventListener('mouseleave', this._hide);
    this.invokerNode.removeEventListener('focusin', this._show);
    this.invokerNode.removeEventListener('focusout', this._hide);
  }
}
