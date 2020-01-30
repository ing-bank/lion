import { LitElement, html, css } from '@lion/core';

/**
 * # <ing-tab-panel> webcomponent
 *
 * @customElement ing-tab-panel
 * @extends LitElement
 */
export class MdTabPanel extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          background-color: white;
          padding: 16px 16px 20px;
          border: 1px solid #ccc;
        }
      `,
    ];
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}
