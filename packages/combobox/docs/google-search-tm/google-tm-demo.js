import { css, html, LitElement } from '@lion/core';
import { GoogleSearchTm } from './google-search-tm.js';
import { googleSearch1998 } from './decorations/1998/decorate1998.js';
import { googleSearch2000 } from './decorations/2000/decorate2000.js';
import { googleSearch2020 } from './decorations/2020/decorate2020.js';

const appleLogoUrl = new URL('../google-combobox/assets/appleLogo.png', import.meta.url).href;

// GlobalDecorator.addMixins(LionCombobox, [Combobox2020Mixin]);

const decorations = [
  { time: '1998', decoration: googleSearch1998 },
  { time: '2000', decoration: googleSearch2000 },
  { time: '2020', decoration: googleSearch2020 },
];
GoogleSearchTm.decorateMembers(decorations[0].decoration);

export class GoogleTmDemo extends LitElement {
  static get properties() {
    return { time: String };
  }

  constructor() {
    super();

    this.time = decorations[0].time;
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('time') && this.time === null) {
      this.time = this._nextTime;
      const entry = decorations.find(d => d.time === this.time);
      if (entry) {
        GoogleSearchTm.decorateMembers(entry.decoration);
      }
    }
  }

  render() {
    return html`
      <div>
        <select
          @change="${({ currentTarget }) => {
            this._nextTime = currentTarget.value;
            this.time = null; // trigger rerender
          }}"
        >
          ${decorations.map(d => html`<option value="${d.time}">${d.time}</option>`)}
        </select>
      </div>

      ${this.time
        ? html`
            <google-search-tm name="combo" label="Google Search">
              <google-option-tm
                href="https://www.google.com/search?query=apple"
                target="_blank"
                rel="noopener noreferrer"
                .choiceValue=${'Apple'}
                .imageUrl=${appleLogoUrl}
                >Apple</google-option-tm
              >
              <google-option-tm
                href="https://www.google.com/search?query=Artichoke"
                target="_blank"
                rel="noopener noreferrer"
                .choiceValue=${'Artichoke'}
                >Artichoke</google-option-tm
              >
              <google-option-tm
                href="https://www.google.com/search?query=Asparagus"
                target="_blank"
                rel="noopener noreferrer"
                .choiceValue=${'Asparagus'}
                >Asparagus</google-option-tm
              >
              <google-option-tm
                href="https://www.google.com/search?query=Banana"
                target="_blank"
                rel="noopener noreferrer"
                .choiceValue=${'Banana'}
                >Banana</google-option-tm
              >
              <google-option-tm
                href="https://www.google.com/search?query=Beets"
                target="_blank"
                rel="noopener noreferrer"
                .choiceValue=${'Beets'}
                >Beets</google-option-tm
              >
            </google-search-tm>
          `
        : ''}
      <div style="height:200px;"></div>
    `;
  }
}
customElements.define('google-tm-demo', GoogleTmDemo);
