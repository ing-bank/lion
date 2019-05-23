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
    return [
      // ...super.styles,
      css`
        :host {
          background-color: lightgray;
          display: block;
          padding: 8px;
        }

        /* sr-only */
        :host ::slotted(button) {
          position: absolute;
          visibility: hidden;
          top: 0;
        }
      `,
    ];
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

  // eslint-disable-next-line
  __clickDelegationHandler() {
    // no delegate here, just the original click
    // if (this.type === 'submit' && this.$$slot('_button').form) {
    //   this.$$slot('_button').form.dispatchEvent(new Event('submit'));
    // }
  }

  _contentTemplate() {
    return this.selectedElement ? this.selectedElement.value : '';
  }

  render() {
    return html`
      ${this._contentTemplate()}
      <slot name="_button"></slot>
      <div class="click-area" @click="${this.__clickDelegationHandler}"></div>
    `;
  }
}
