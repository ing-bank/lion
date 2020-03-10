import { LitElement, html, css } from '../../core/index.js';

class StyledDialogContent extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          background-color: #fff;
        }
        .nice {
          font-weight: bold;
          color: green;
        }
        .close-button {
          color: black;
          font-size: 28px;
          line-height: 28px;
        }
      `,
    ];
  }

  _closeOverlay() {
    this.dispatchEvent(new Event('close-overlay', { bubbles: true }));
  }

  render() {
    return html`
      <div><p>Hello person who opened the dialog!</p></div>
      <div>
        <p>Look how nice this <span class="nice">dialog</span> looks!</p>
      </div>
      <button class="close-button" @click=${this._closeOverlay}>⨯</button>
    `;
  }
}

customElements.define('styled-dialog-content', StyledDialogContent);
