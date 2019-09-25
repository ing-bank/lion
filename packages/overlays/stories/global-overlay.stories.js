import { storiesOf, html } from '@open-wc/demoing-storybook';

import { css } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { overlays, GlobalOverlayController } from '../index.js';

const globalOverlayDemoStyle = css`
  .demo-overlay {
    background-color: white;
    position: absolute;
    top: 20px;
    left: 20px;
    width: 200px;
    border: 1px solid blue;
  }

  .demo-overlay--2 {
    left: 240px;
  }

  .demo-overlay--toast {
    left: initial;
    right: 20px;
  }
`;

storiesOf('Global Overlay System|Global Overlay', module)
  .add('Default', () => {
    const overlayCtrl = overlays.add(
      new GlobalOverlayController({
        contentTemplate: () => html`
          <div class="demo-overlay">
            <p>Simple overlay</p>
            <button @click="${() => overlayCtrl.hide()}">Close</button>
          </div>
        `,
      }),
    );

    return html`
      <style>
        ${globalOverlayDemoStyle}
      </style>
      <a href="#">Anchor 1</a>
      <button
        @click="${event => overlayCtrl.show(event.target)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open overlay
      </button>
      <a href="#">Anchor 2</a>
      ${Array(50).fill(
        html`
          <p>Lorem ipsum</p>
        `,
      )}
    `;
  })
  .add('Option "preventsScroll"', () => {
    const overlayCtrl = overlays.add(
      new GlobalOverlayController({
        preventsScroll: true,
        contentTemplate: () => html`
          <div class="demo-overlay">
            <p>Scrolling the body is blocked</p>
            <button @click="${() => overlayCtrl.hide()}">Close</button>
          </div>
        `,
      }),
    );

    return html`
      <style>
        ${globalOverlayDemoStyle}
      </style>
      <button
        @click="${event => overlayCtrl.show(event.target)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open overlay
      </button>
      ${Array(50).fill(
        html`
          <p>Lorem ipsum</p>
        `,
      )}
    `;
  })
  .add('Option "hasBackdrop"', () => {
    const overlayCtrl = overlays.add(
      new GlobalOverlayController({
        hasBackdrop: true,
        contentTemplate: () => html`
          <div class="demo-overlay">
            <p>There is a backdrop</p>
            <button @click="${() => overlayCtrl.hide()}">Close</button>
          </div>
        `,
      }),
    );

    return html`
      <style>
        ${globalOverlayDemoStyle}
      </style>
      <button
        @click="${event => overlayCtrl.show(event.target)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open overlay
      </button>
    `;
  })
  .add('Option "trapsKeyboardFocus"', () => {
    const overlayCtrl = overlays.add(
      new GlobalOverlayController({
        trapsKeyboardFocus: true,
        contentTemplate: () => html`
          <div class="demo-overlay">
            <p>Tab key is trapped within the overlay</p>

            <button id="el1">Button</button>
            <a id="el2" href="#">Anchor</a>
            <div id="el3" tabindex="0">Tabindex</div>
            <input id="el4" placeholder="Input" />
            <div id="el5" contenteditable>Contenteditable</div>
            <textarea id="el6">Textarea</textarea>
            <select id="el7">
              <option>1</option>
            </select>
            <button @click="${() => overlayCtrl.hide()}">Close</button>
          </div>
        `,
      }),
    );

    return html`
      <style>
        ${globalOverlayDemoStyle}
      </style>
      <a href="#">Anchor 1</a>
      <button
        @click="${event => overlayCtrl.show(event.target)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open overlay
      </button>
      <a href="#">Anchor 2</a>
    `;
  })
  .add('Option "trapsKeyboardFocus" (multiple)', () => {
    const overlayCtrl2 = overlays.add(
      new GlobalOverlayController({
        trapsKeyboardFocus: true,
        contentTemplate: () => html`
          <div class="demo-overlay demo-overlay--2">
            <p>Overlay 2. Tab key is trapped within the overlay</p>
            <button @click="${() => overlayCtrl2.hide()}">Close</button>
          </div>
        `,
      }),
    );

    const overlayCtrl1 = overlays.add(
      new GlobalOverlayController({
        trapsKeyboardFocus: true,
        contentTemplate: () => html`
          <div class="demo-overlay">
            <p>Overlay 1. Tab key is trapped within the overlay</p>
            <button
              @click="${event => overlayCtrl2.show(event.target)}"
              aria-haspopup="dialog"
              aria-expanded="false"
            >
              Open overlay 2
            </button>
            <button @click="${() => overlayCtrl1.hide()}">Close</button>
          </div>
        `,
      }),
    );

    return html`
      <style>
        ${globalOverlayDemoStyle}
      </style>
      <a href="#">Anchor 1</a>
      <button
        @click="${event => overlayCtrl1.show(event.target)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open overlay 1
      </button>
      <a href="#">Anchor 2</a>
    `;
  })
  .add('Option "isBlocking"', () => {
    const blockingOverlayCtrl = overlays.add(
      new GlobalOverlayController({
        isBlocking: true,
        contentTemplate: () => html`
          <div class="demo-overlay demo-overlay--2">
            <p>Hides other overlays</p>
            <button @click="${() => blockingOverlayCtrl.hide()}">Close</button>
          </div>
        `,
      }),
    );

    const normalOverlayCtrl = overlays.add(
      new GlobalOverlayController({
        contentTemplate: () => html`
          <div class="demo-overlay">
            <p>Normal overlay</p>
            <button
              @click="${event => blockingOverlayCtrl.show(event.target)}"
              aria-haspopup="dialog"
              aria-expanded="false"
            >
              Open blocking overlay
            </button>
            <button @click="${() => normalOverlayCtrl.hide()}">Close</button>
          </div>
        `,
      }),
    );

    return html`
      <style>
        ${globalOverlayDemoStyle}
      </style>
      <button
        @click="${event => normalOverlayCtrl.show(event.target)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open overlay
      </button>
    `;
  })
  .add('Sync', () => {
    const overlayCtrl = overlays.add(
      new GlobalOverlayController({
        contentTemplate: ({ title = 'default' } = {}) => html`
          <div class="demo-overlay">
            <p>${title}</p>
            <label>Edit title:</label>
            <input
              value="${title}"
              @input="${e => overlayCtrl.sync({ isShown: true, data: { title: e.target.value } })}"
            />
            <button @click="${() => overlayCtrl.hide()}">Close</button>
          </div>
        `,
      }),
    );

    return html`
      <style>
        ${globalOverlayDemoStyle}
      </style>
      <button
        @click="${() => overlayCtrl.sync({ isShown: true, data: { title: 'My title' } })}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open overlay
      </button>
    `;
  })
  .add('In web components', () => {
    class EditUsernameOverlay extends LionLitElement {
      static get properties() {
        return {
          username: { type: String },
        };
      }

      static get styles() {
        return css`
          :host {
            position: fixed;
            left: 20px;
            top: 20px;
            display: block;
            width: 300px;
            padding: 24px;
            background-color: white;
            border: 1px solid blue;
          }

          .close-button {
            position: absolute;
            top: 8px;
            right: 8px;
          }
        `;
      }

      render() {
        return html`
          <div>
            <button class="close-button" @click="${this._onClose}">X</button>
            <label for="usernameInput">Edit Username</label>
            <input id="usernameInput" value="${this.username}" />
            <button @click="${this._onUsernameEdited}">
              Save
            </button>
          </div>
        `;
      }

      _onUsernameEdited() {
        this.dispatchEvent(
          new CustomEvent('edit-username-submitted', {
            detail: this.$id('usernameInput').value,
          }),
        );
      }

      _onClose() {
        this.dispatchEvent(new CustomEvent('edit-username-closed'));
      }
    }
    if (!customElements.get('edit-username-overlay')) {
      customElements.define('edit-username-overlay', EditUsernameOverlay);
    }
    class MyComponent extends LionLitElement {
      static get properties() {
        return {
          username: { type: String },
          _editingUsername: { type: Boolean },
        };
      }

      constructor() {
        super();

        this.username = 'Steve';
        this._editingUsername = false;
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        this._editOverlay.hide();
      }

      render() {
        return html`
          <p>Your username is: ${this.username}</p>
          <button @click=${this._onStartEditUsername} aria-haspopup="dialog" aria-expanded="false">
            Edit username
          </button>
        `;
      }

      firstUpdated() {
        this._editOverlay = overlays.add(
          new GlobalOverlayController({
            focusElementAfterHide: this.shadowRoot.querySelector('button'),
            contentTemplate: ({ username = 'standard' } = {}) => html`
              <edit-username-overlay
                username="${username}"
                @edit-username-submitted="${e => this._onEditSubmitted(e)}"
                @edit-username-closed="${() => this._onEditClosed()}"
              >
              </edit-username-overlay>
            `,
          }),
        );
      }

      updated() {
        this._editOverlay.sync({
          isShown: this._editingUsername,
          data: { username: this.username },
        });
      }

      _onEditSubmitted(e) {
        this.username = e.detail;
        this._editingUsername = false;
      }

      _onEditClosed() {
        this._editingUsername = false;
      }

      _onStartEditUsername() {
        this._editingUsername = true;
      }
    }
    if (!customElements.get('my-component')) {
      customElements.define('my-component', MyComponent);
    }
    return html`
      <my-component></my-component>
    `;
  });
