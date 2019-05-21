import { html, css, LitElement } from '@lion/core';

// https://www.w3.org/WAI/PF/aria/roles#separator

export class LionSeparator extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'separator');
  }

  static get styles() {
    return [
      css`
        .c-separator {
          padding-top: 4px;
          padding-bottom: 4px;
          border-bottom: 4px dotted lightgray;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="c-separator"></div>
    `;
  }
}
