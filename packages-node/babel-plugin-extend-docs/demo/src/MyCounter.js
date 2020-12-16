import { LitElement, html, css } from 'lit-element';

export class MyCounter extends LitElement {
  static get properties() {
    return {
      count: { type: Number },
    };
  }

  static styles = css`
    :host {
      display: block;
      width: 220px;
      margin: 0 auto;
    }

    button,
    span {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    button {
      width: 64px;
      height: 64px;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }

    h3 {
      text-align: center;
    }
  `;

  constructor() {
    super();
    this.count = 0;
  }

  inc() {
    this.count += 1;
  }

  dec() {
    this.count -= 1;
  }

  _renderHeader() {
    return html`<h3>I am MyCounter</h3> `;
  }

  _renderIncButton() {
    return html`<button @click="${this.inc}">+</button> `;
  }

  render() {
    return html`
      ${this._renderHeader()}
      <button @click="${this.dec}">-</button>
      <span>${this.count}</span>
      ${this._renderIncButton()}
    `;
  }
}
