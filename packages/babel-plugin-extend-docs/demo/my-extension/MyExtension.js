import { html, css } from 'lit-element';
import { MyCounter } from '../src/MyCounter.js';

export class MyExtension extends MyCounter {
  static get styles() {
    return [
      super.styles,
      css`
        button {
          background: #c43f16;
        }
      `,
    ];
  }

  _renderHeader() {
    return html`
      <h2>I am MyExtension</h2>
    `;
  }
}
