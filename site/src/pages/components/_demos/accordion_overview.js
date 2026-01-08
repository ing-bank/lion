/** script code **/
import { html as previewHtml } from '@mdjs/mdjs-preview';
/** stories code **/
import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionAccordion } from '@lion/ui/accordion.js';

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
            is acidic, with pH levels ranging from 2.9 to 4.0. <a href="#">Link</a>
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
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'overview', story: overview }];
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
  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }
  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }
}