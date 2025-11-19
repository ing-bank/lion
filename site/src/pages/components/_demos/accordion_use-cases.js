/** script code **/
import { html as previewHtml } from '@mdjs/mdjs-preview';

import '@lion/ui/define/lion-accordion.js';
/** stories code **/
export const HtmlStory0 = () => html`<lion-accordion>
  <h3 slot="invoker">
    <button>Sensory Factors</button>
  </h3>
  <div slot="content">
    <p>
      The taste of oranges is determined mainly by the relative ratios of sugars and acids, whereas
      orange aroma derives from volatile organic compounds, including alcohols, aldehydes, ketones,
      terpenes, and esters. Bitter limonoid compounds, such as limonin, decrease gradually during
      development, whereas volatile aroma compounds tend to peak in mid– to late–season development.
      Taste quality tends to improve later in harvests when there is a higher sugar/acid ratio with
      less bitterness. As a citrus fruit, the orange is acidic, with pH levels ranging from 2.9 to
      4.0.
    </p>

    <p>
      Sensory qualities vary according to genetic background, environmental conditions during
      development, ripeness at harvest, postharvest conditions, and storage duration.
    </p>
  </div>
  <h3 slot="invoker">
    <button>Nutritional value</button>
  </h3>
  <div slot="content">
    Orange flesh is 87% water, 12% carbohydrates, 1% protein, and contains negligible fat (table).
    In a 100 gram reference amount, orange flesh provides 47 calories, and is a rich source of
    vitamin C, providing 64% of the Daily Value. No other micronutrients are present in significant
    amounts (table).
  </div>
</lion-accordion>`;
export const HtmlStory1 = () => html`<lion-accordion expanded="[1]">
  <h3 slot="invoker">
    <button>Sensory Factors</button>
  </h3>
  <div slot="content">
    <p>
      The taste of oranges is determined mainly by the relative ratios of sugars and acids, whereas
      orange aroma derives from volatile organic compounds, including alcohols, aldehydes, ketones,
      terpenes, and esters. Bitter limonoid compounds, such as limonin, decrease gradually during
      development, whereas volatile aroma compounds tend to peak in mid– to late–season development.
      Taste quality tends to improve later in harvests when there is a higher sugar/acid ratio with
      less bitterness. As a citrus fruit, the orange is acidic, with pH levels ranging from 2.9 to
      4.0.
    </p>

    <p>
      Sensory qualities vary according to genetic background, environmental conditions during
      development, ripeness at harvest, postharvest conditions, and storage duration.
    </p>
  </div>
  <h3 slot="invoker">
    <button>Nutritional value</button>
  </h3>
  <div slot="content">
    Orange flesh is 87% water, 12% carbohydrates, 1% protein, and contains negligible fat (table).
    In a 100 gram reference amount, orange flesh provides 47 calories, and is a rich source of
    vitamin C, providing 64% of the Daily Value. No other micronutrients are present in significant
    amounts (table).
  </div>
</lion-accordion>`;
export const HtmlStory2 = () => html`<lion-accordion>
  <h3 slot="invoker">
    <button>Sensory Factors</button>
  </h3>
  <h3 slot="invoker">
    <button>Nutritional value</button>
  </h3>
  <div slot="content">
    <p>
      The taste of oranges is determined mainly by the relative ratios of sugars and acids, whereas
      orange aroma derives from volatile organic compounds, including alcohols, aldehydes, ketones,
      terpenes, and esters. Bitter limonoid compounds, such as limonin, decrease gradually during
      development, whereas volatile aroma compounds tend to peak in mid– to late–season development.
      Taste quality tends to improve later in harvests when there is a higher sugar/acid ratio with
      less bitterness. As a citrus fruit, the orange is acidic, with pH levels ranging from 2.9 to
      4.0.
    </p>

    <p>
      Sensory qualities vary according to genetic background, environmental conditions during
      development, ripeness at harvest, postharvest conditions, and storage duration.
    </p>
  </div>
  <div slot="content">
    Orange flesh is 87% water, 12% carbohydrates, 1% protein, and contains negligible fat (table).
    In a 100 gram reference amount, orange flesh provides 47 calories, and is a rich source of
    vitamin C, providing 64% of the Daily Value. No other micronutrients are present in significant
    amounts (table).
  </div>
</lion-accordion>`;
export const HtmlStory3 = () => html`<lion-accordion>
  <h3 slot="invoker">
    <button>
      Sensory Factors <br />
      <small>or the experience of taste</small>
    </button>
  </h3>
  <div slot="content">
    <p>
      The taste of oranges is determined mainly by the relative ratios of sugars and acids, whereas
      orange aroma derives from volatile organic compounds, including alcohols, aldehydes, ketones,
      terpenes, and esters. Bitter limonoid compounds, such as limonin, decrease gradually during
      development, whereas volatile aroma compounds tend to peak in mid– to late–season development.
      Taste quality tends to improve later in harvests when there is a higher sugar/acid ratio with
      less bitterness. As a citrus fruit, the orange is acidic, with pH levels ranging from 2.9 to
      4.0.
    </p>

    <p>
      Sensory qualities vary according to genetic background, environmental conditions during
      development, ripeness at harvest, postharvest conditions, and storage duration.
    </p>
  </div>
  <h3 slot="invoker">
    <button>
      Nutritional value
      <small>or the raw data</small>
    </button>
  </h3>
  <div slot="content">
    Orange flesh is 87% water, 12% carbohydrates, 1% protein, and contains negligible fat (table).
    In a 100 gram reference amount, orange flesh provides 47 calories, and is a rich source of
    vitamin C, providing 64% of the Daily Value. No other micronutrients are present in significant
    amounts (table).
  </div>
</lion-accordion>`;
export const HtmlStory4 = () => html`<lion-accordion exclusive>
  <h3 slot="invoker">
    <button>This collapsible closes all other ones</button>
  </h3>
  <div slot="content">
    <p>
      The taste of oranges is determined mainly by the relative ratios of sugars and acids, whereas
      orange aroma derives from volatile organic compounds, including alcohols, aldehydes, ketones,
      terpenes, and esters. Bitter limonoid compounds, such as limonin, decrease gradually during
      development, whereas volatile aroma compounds tend to peak in mid– to late–season development.
      Taste quality tends to improve later in harvests when there is a higher sugar/acid ratio with
      less bitterness. As a citrus fruit, the orange is acidic, with pH levels ranging from 2.9 to
      4.0.
    </p>

    <p>
      Sensory qualities vary according to genetic background, environmental conditions during
      development, ripeness at harvest, postharvest conditions, and storage duration.
    </p>
  </div>
  <h3 slot="invoker">
    <button>Same for this collapsible</button>
  </h3>
  <div slot="content">
    Orange flesh is 87% water, 12% carbohydrates, 1% protein, and contains negligible fat (table).
    In a 100 gram reference amount, orange flesh provides 47 calories, and is a rich source of
    vitamin C, providing 64% of the Daily Value. No other micronutrients are present in significant
    amounts (table).
  </div>
</lion-accordion>`;
import { html, LitElement } from 'lit';

export const distributeNewElement = () => {
  class DemoDistribute extends LitElement {
    static get properties() {
      return {
        __collection: { type: Array },
      };
    }
    render() {
      return html`
        <h3>Append</h3>
        <lion-accordion id="appendAccordion">
          <h4 slot="invoker">
            <button>header 1</button>
          </h4>
          <p slot="content">content 1</p>
          <h4 slot="invoker">
            <button>header 2</button>
          </h4>
          <p slot="content">content 2</p>
        </lion-accordion>
        <button @click="${this.__handleAppendClick}">Append dom elements</button>
        <hr />
        <h3>Push</h3>
        <lion-accordion id="pushTabs">
          <h4 slot="invoker">
            <button>header 1</button>
          </h4>
          <p slot="content">content 1</p>
          <h4 slot="invoker">
            <button>header 2</button>
          </h4>
          <p slot="content">content 2</p>
          ${this.__collection.map(
            item => html`
              <h4 slot="invoker"><button>${item.invoker}</button></h4>
              <p slot="content">${item.content}</p>
            `,
          )}
        </lion-accordion>
        <button @click="${this.__handlePushClick}">Push to tabs collection</button>
      `;
    }
    constructor() {
      super();
      this.__collection = [];
    }
    __handleAppendClick() {
      const accordionElement = this.shadowRoot.querySelector('#appendAccordion');
      const c = 2;
      const n = Math.floor(accordionElement.children.length / 2);
      for (let i = n + 1; i < n + c; i += 1) {
        const invoker = document.createElement('h4');
        const button = document.createElement('button');
        button.innerText = `header ${i}`;
        invoker.setAttribute('slot', 'invoker');
        invoker.appendChild(button);
        const content = document.createElement('p');
        content.setAttribute('slot', 'content');
        content.innerText = `content ${i}`;
        accordionElement.append(invoker);
        accordionElement.append(content);
      }
    }
    __handlePushClick() {
      const accordionElement = this.shadowRoot.querySelector('#pushTabs');
      const i = Math.floor(accordionElement.children.length / 2) + 1;
      this.__collection = [
        ...this.__collection,
        {
          invoker: `header ${i}`,
          content: `content ${i}`,
        },
      ];
    }
  }
  customElements.define('demo-distribute', DemoDistribute);

  return previewHtml`<demo-distribute></demo-distribute>`;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory0', story: HtmlStory0 }, { key: 'HtmlStory1', story: HtmlStory1 }, { key: 'HtmlStory2', story: HtmlStory2 }, { key: 'HtmlStory3', story: HtmlStory3 }, { key: 'HtmlStory4', story: HtmlStory4 }, { key: 'distributeNewElement', story: distributeNewElement }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}