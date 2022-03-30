# Accordion >> Use Cases ||20

```js script
import { html as previewHtml } from '@mdjs/mdjs-preview';

import '@lion/accordion/define';
```

## Default Accordion collapsed

All accordion panels are collapsed by default.

```html preview-story
<lion-accordion>
  <h3 slot="invoker">
    <button>Sensory Factors</button>
  </h3>
  <div slot="content" class="lion-paragraph-container">
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
</lion-accordion>
```

## Expanded

Multiple accordion panels can be expanded at the same time. When content drops out of the viewport when expanding an accordion panel, the accordion does not reposition the page (no autoscrolling).

```html preview-story
<lion-accordion expanded="[1]">
  <h3 slot="invoker">
    <button>Sensory Factors</button>
  </h3>
  <div slot="content" class="lion-paragraph-container">
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
</lion-accordion>
```

## Slots Order

The invoker and content slots are ordered by DOM order. This means you can put all invoker nodes at the top followed by all container nodes and it will still retain the correct order.

```html preview-story
<lion-accordion>
  <h3 slot="invoker">
    <button>Sensory Factors</button>
  </h3>
  <h3 slot="invoker">
    <button>Nutritional value</button>
  </h3>
  <div slot="content" class="lion-paragraph-container">
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
</lion-accordion>
```

## Multiline header

A header can be multiline.

```html preview-story
<lion-accordion>
  <h3 slot="invoker">
    <button>
      Sensory Factors <br />
      <small>or the experience of taste</small>
    </button>
  </h3>
  <div slot="content" class="lion-paragraph-container">
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
</lion-accordion>
```

## Distribute New Elements

Below, we demonstrate how you could dynamically add a new invoker + content.

One way is by creating the DOM elements and appending them as needed. For how this work feel tree to check out the `__handleAppendClick` function.
Another way is by adding data to the Lit property that you loop over in your template. See `__handlePushClick` for an example.

```js preview-story
import { html, LitElement } from '@lion/core';

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
```
