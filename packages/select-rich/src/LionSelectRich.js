import { LionField } from '@lion/field';
import { html } from '@lion/core';
import { LocalOverlayController, overlays } from '@lion/overlays'; // eslint-disable-line
import '../lion-listbox-invoker.js'; // eslint-disable-line

/**
 * LionSelectRich: wraps the <lion-listbox> element
 *
 * @customElement
 * @extends LionField
 */
export class LionSelectRich extends LionField {
  get slots() {
    return {
      ...super.slots,
      invoker: () => {
        return document.createElement('lion-listbox-invoker');
      },
    };
  }

  constructor() {
    super();
    this.__syncSelectedStateWithInvoker = this.__syncSelectedStateWithInvoker.bind(this);
  }

  connectedCallback() {
    super.connectedCallback(); // eslint-disable-line
    this.__handleA11ySelect();
    this.__createDropdownSelect();
    this.$$slot('input').addEventListener(
      'user-input-changed',
      this.__syncSelectedStateWithInvoker,
    );
  }

  __createDropdownSelect() {
    this._overlayCtrl = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        placement: 'bottom center',
        invokerNode: this.$$slot('invoker'),
        contentNode: this.$$slot('input'),
      }),
    );
    this.$$slot('invoker').addEventListener('click', () => this._overlayCtrl.toggle());
    this.$$slot('input').setAttribute('tabindex', '0');
  }

  __handleA11ySelect() {
    this.$$slot('invoker').setAttribute('aria-haspopup', 'listbox');
  }

  __syncSelectedStateWithInvoker({ target }) {
    // TODO: also support array when multi is supported
    this.$$slot('invoker').selectedElement = target;
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      ${super.render()}
    `;
  }
}
