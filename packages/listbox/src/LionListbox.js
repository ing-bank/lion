import { html, css, LitElement } from '@lion/core';

export class LionListbox extends LitElement {
  static get properties() {
    return {
      role: { type: String, reflect: true },
      tabIndex: { type: String, reflect: true, attribute: 'tabindex' },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          background: #fff;
          border: 1px solid #ccc;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.role = 'listbox';
    // this.tabIndex = -1;
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}
