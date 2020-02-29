import { LitElement, html, css } from 'lit-element';

export class LeaTabPanel extends LitElement {
  static get styles() {
    return css`
      :host {
        background-color: #fff;
        background-image: linear-gradient(top, #fff, #ddd);
        border-radius: 0 2px 2px 2px;
        box-shadow: 0 2px 2px #000, 0 -1px 0 #fff inset;
        padding: 30px;
      }
    `;
  }

  render() {
    return html`
      <!-- dom as needed -->
      <slot></slot>
    `;
  }
}
