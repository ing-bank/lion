# Accordion >> Overview ||10

<p class="lion-paragraph--emphasis">An accordion is a vertically stacked set of interactive headings that each contain a title representing a section of content. It allows users to toggle the display of sections of content.</p>

```js script
import { html as previewHtml } from '@mdjs/mdjs-preview';
```

```js preview-story
import { html, LitElement, ScopedElementsMixin } from '@lion/core';
import { LionAccordion } from '@lion/accordion';

class MyComponent extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return { 'lion-accordion': LionAccordion };
  }
  render() {
    return html`
      <lion-accordion>
        <h3 slot="invoker">
          <button>Sensory Factors</button>
        </h3>
        <div slot="content">
          <p>
            The taste of oranges is determined mainly by the relative ratios of sugars and acids,
            whereas orange aroma derives from volatile organic compounds, including alcohols,
            aldehydes, ketones, terpenes, and esters. Bitter limonoid compounds, such as limonin,
            decrease gradually during development, whereas volatile aroma compounds tend to peak in
            mid– to late–season development. Taste quality tends to improve later in harvests when
            there is a higher sugar/acid ratio with less bitterness. As a citrus fruit, the orange
            is acidic, with pH levels ranging from 2.9 to 4.0.
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
          Orange flesh is 87% water, 12% carbohydrates, 1% protein, and contains negligible fat
          (table). In a 100 gram reference amount, orange flesh provides 47 calories, and is a rich
          source of vitamin C, providing 64% of the Daily Value. No other micronutrients are present
          in significant amounts (table).
        </div>
      </lion-accordion>
    `;
  }
}

customElements.define('my-component', MyComponent);

export const overview = () => previewHtml`<my-component></my-component>`;
```

## When to use

- Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page
- Longer pages can benefit users. Accordions shorten pages and reduce scrolling, but they increase the interaction cost by requiring people to decide on topic headings.
- Accordions conserve space on mobile but they can also cause disorientation and too much scrolling.
- Accordions should be avoided when your audience needs most or all of the content on the page to answer their question. Better to show all page content at once when the use case supports it.
- Accordions are more suitable when people need only a few key pieces of content on a single page. By hiding most of the content, users can spend their time more efficiently focused on the few topics that matter.

## Features

- Content gets provided by users (slotted in)
- Handles accessibility
- Support navigation via keyboard

## How to use

### Code

1. Install

```bash
npm i --save @lion/accordion
```

2. Use scoped registry

```js
import { html, LitElement, ScopedElementsMixin } from '@lion/core';
import { LionAccordion } from '@lion/accordion';

class MyComponent extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return { 'lion-accordion': LionAccordion };
  }
  render() {
    return html`
      <lion-accordion>
        <h3 slot="invoker">
          <button>Nutritional value</button>
        </h3>
        <p slot="content">
          Orange flesh is 87% water, 12% carbohydrates, 1% protein, and contains negligible fat
          (table). In a 100 gram reference amount, orange flesh provides 47 calories, and is a rich
          source of vitamin C, providing 64% of the Daily Value. No other micronutrients are present
          in significant amounts (table).
        </p>
      </lion-accordion>
    `;
  }
}
```

3. Use html

```html
<script type="module">
  import '@lion/accordion/define';
</script>

<lion-accordion>
  <h3 slot="invoker">
    <button>Nutritional value</button>
  </h3>
  <p slot="content">
    Orange flesh is 87% water, 12% carbohydrates, 1% protein, and contains negligible fat (table).
    In a 100 gram reference amount, orange flesh provides 47 calories, and is a rich source of
    vitamin C, providing 64% of the Daily Value. No other micronutrients are present in significant
    amounts (table).
  </p>
</lion-accordion>
```
