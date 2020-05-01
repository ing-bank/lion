import { LitElement, css, html } from 'lit-element';
import { overlaysId, OverlaysManager } from 'overlays';
import { overlaysId as overlaysId2 } from './node_modules/page-b/node_modules/overlays/index.js';

import 'page-a/page-a.js';
import 'page-b/page-b.js';

class CompatibleManager extends OverlaysManager {
  name = 'Compatible from App';

  constructor() {
    super();
    this.blocker.innerText = `Blocker for ${this.name}`;
  }

  blockingBody() {
    this.block();
  }

  unBlockingBody() {
    this.unBlock();
  }
}

class DemoApp extends LitElement {
  constructor() {
    super();
    this.page = 'A';
    this._instances = new Map();

    this.addEventListener('request-instance', ev => {
      const { key } = ev.detail;
      if (this._instances.has(key)) {
        ev.detail.instance = this._instances.get(key);
      }
    });

    const manager = new CompatibleManager();

    this.provideInstance(overlaysId, manager);
    this.provideInstance(overlaysId2, manager);
  }

  provideInstance(key, instance) {
    this._instances.set(key, instance);
  }

  static get properties() {
    return {
      page: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        max-width: 680px;
        margin: 0 auto;
      }

      nav {
        padding: 0 10px 10px 10px;
      }

      button {
        border: none;
        padding: 1rem 2rem;
        background: #0069ed;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
        text-align: center;
        transition: background 250ms ease-in-out, transform 150ms ease;
      }

      button:hover,
      button:focus {
        background: #0053ba;
      }

      button:focus {
        outline: 1px solid #fff;
        outline-offset: -4px;
      }

      button:active {
        transform: scale(0.99);
      }

      button.active {
        background: #33a43f;
      }

      h1 {
        text-align: center;
      }
    `;
  }

  render() {
    return html`
      <h1>Demo App</h1>
      <nav>
        <button class=${this.page === 'A' ? 'active' : ''} @click=${() => (this.page = 'A')}>
          Page A
        </button>
        <button class=${this.page === 'B' ? 'active' : ''} @click=${() => (this.page = 'B')}>
          Page B
        </button>
      </nav>
      ${this.page === 'A' ? html` <page-a></page-a> ` : html` <page-b></page-b> `}
    `;
  }
}

customElements.define('demo-app', DemoApp);
