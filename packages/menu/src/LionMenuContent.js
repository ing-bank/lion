import { css, html, LitElement } from '@lion/core';

/**
 * @extends {LitElement}
 */
export class LionMenuContent extends LitElement {
  static get properties() {
    return {
      role: { type: String, reflect: true },
      tabIndex: { type: Number, reflect: true, attribute: 'tabindex' },
    };
  }

  static get styles() {
    return [
      css`
        ::slotted([menu-type='menu-item']) {
          display: block;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.role = 'listbox';
    // we made it a Lit-Element property because of this
    // eslint-disable-next-line wc/no-constructor-attributes
    this.tabIndex = 0;
  }

  render() {
    return html`<slot></slot>`;
  }
}
