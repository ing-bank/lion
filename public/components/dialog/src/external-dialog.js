import { LitElement, html } from 'lit';

class DialogTriggerDemo extends LitElement {
  static get properties() {
    return {
      _isOpen: { state: true },
    };
  }

  toggleDialog(open) {
    // eslint-disable-next-line no-return-assign
    return () => (this._isOpen = open);
  }

  handleDialog(e) {
    this._isOpen = e.detail.opened;
  }

  render() {
    return html`
      <button @click=${this.toggleDialog(true)}>Open dialog</button>
      <lion-dialog ?opened=${this._isOpen} @opened-changed=${this.handleDialog}>
        <div slot="content" class="dialog demo-box">
          Hello! You can close this notification here:
          <button class="close-button" @click=${this.toggleDialog(false)}>⨯</button>
        </div>
      </lion-dialog>
    `;
  }
}

customElements.define('dialog-trigger-demo', DialogTriggerDemo);
