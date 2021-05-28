import { html, css } from '@lion/core';
import { SourceCounter } from '../src/SourceCounter.js';

export class ExtensionCounter extends SourceCounter {
  static get styles() {
    return [
      ...super.styles,
      css`
        button {
          background: #c43f16;
        }
      `,
    ];
  }

  _renderHeader() {
    return html`<h2>I am ExtensionCounter</h2> `;
  }
}
