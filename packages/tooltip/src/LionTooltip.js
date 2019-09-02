import { LionPopup } from '@lion/popup';
import { overlays, LocalOverlayController } from '@lion/overlays';

export class LionTooltip extends LionPopup {
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
    this._show = () => this._controller.show();
    this._hide = () => this._controller.hide();

    this.addEventListener('mouseenter', this._show);
    this.addEventListener('mouseleave', this._hide);
    this.invokerNode.addEventListener('focusin', this._show);
    this.invokerNode.addEventListener('focusout', this._hide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this._show);
    this.removeEventListener('mouseleave', this._hide);
    this.invokerNode.removeEventListener('focusin', this._show);
    this.invokerNode.removeEventListener('focusout', this._hide);
  }
}
