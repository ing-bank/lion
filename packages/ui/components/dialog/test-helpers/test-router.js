import { html, LitElement } from 'lit';

class TestRouter extends LitElement {
  static properties = {
    routingMap: {
      type: Object,
      attribute: false,
    },
    path: { type: String },
  };

  constructor() {
    super();

    /** @type {{ [path: string]: HTMLElement }} */
    this.routingMap = {};
    /** @type {string} */
    this.path = '';
  }

  render() {
    return html`
      <div>
        <div id="selector">
          ${Object.keys(this.routingMap).map(
            path =>
              html`<button
                id="path-${path}"
                @click="${() => {
                  this.path = path;
                }}"
              >
                ${path}
              </button>`,
          )}
        </div>
        <div id="view">${this.routingMap[this.path]}</div>
      </div>
    `;
  }
}

customElements.define('test-router', TestRouter);
