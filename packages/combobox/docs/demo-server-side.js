import { LitElement, html } from '@lion/core';

function fetchMyData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('abcdefghijk'.split(''));
    }, 1000);
  });
}

class DemoServerSide extends LitElement {
  static get properties() {
    return { myData: Array, loading: Boolean };
  }

  constructor() {
    super();
    this.myData = [];
  }

  get _combobox() {
    return this.shadowRoot.querySelector('lion-combobox');
  }

  async fetchMyDataAndRender() {
    this.loading = true;
    this.myData = await fetchMyData();
    this.loading = false;
    await this.updateComplete;
    this._combobox._handleAutocompletion();
  }

  render() {
    return html`
      <lion-combobox
        name="combo"
        label="Server side completion"
        @input="${this.fetchMyDataAndRender}"
      >
        ${this.loading ? html`<span slot="after" data-description>loading...</span>` : ''}
        ${this.myData.map(
          entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `,
        )}
      </lion-combobox>
    `;
  }
}
customElements.define('demo-server-side', DemoServerSide);
