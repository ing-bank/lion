import { html, css } from '@lion/core';
import { LionOption } from '../index.js';
import './md-ripple.js';

export class MdOption extends LionOption {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          position: relative;
          padding: 8px;
        }

        :host([focused]) {
          background: lightgray;
        }

        :host([hierarchy-level='1']) {
          padding-left: 16px;
        }
      `,
    ];
  }

  render() {
    return html`
      ${super.render()}
      <md-ripple></md-ripple>
    `;
  }
}
customElements.define('md-option', MdOption);
