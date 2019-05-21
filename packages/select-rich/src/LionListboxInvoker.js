import { LionButton } from '@lion/button';
import { html, css } from '@lion/core';

/**
 * LionListboxInvoker: invoker button consuming seleceted state of listbox
 *
 * @customElement
 * @extends LionButton
 */
// eslint-disable-next-line no-unused-vars
export class LionListboxInvoker extends LionButton {
  static get styles() {
    return [css``];
  }

  static get properties() {
    return {
      selectedElement: {
        type: Array,
      },
      /**
       * Reference list with the currently selected element(s)
       */
      selectedElements: {
        type: Array,
      },
    };
  }

  __clickDelegationHandler() {
    // eslint-disable-line
    // no delegate here, just the original click
  }

  _contentTemplate() {
    return this.selectedElement && this.selectedElement.value;
  }

  render() {
    return html`
      <div class="btn">
        ${this._contentTemplate()}
        <slot name="_button"></slot>
        <div class="click-area" @click="${this.__clickDelegationHandler}"></div>
      </div>
    `;
  }
}
