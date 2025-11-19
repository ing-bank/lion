/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-button.js';
/** stories code **/
export const label = () => html`
  <lion-input>
    <label slot="label"> Label with <b>html tag</b> inside </label>
  </lion-input>
`;
export const HtmlStory0 = () => html`<lion-input label="Prefix">
  <div slot="prefix" data-description>[prefix]</div>
</lion-input>`;
export const HtmlStory1 = () => html`<lion-input label="Suffix">
  <div slot="suffix" data-description>[suffix]</div>
</lion-input>`;
export const HtmlStory2 = () => html`<lion-input label="Before">
  <div slot="before" data-description>[before]</div>
</lion-input>`;
export const HtmlStory3 = () => html`<lion-input label="Amount">
  <div slot="after" data-description>EUR</div>
</lion-input>
<lion-input label="Percentage">
  <div slot="after" data-description>%</div>
</lion-input>`;
export const HtmlStory4 = () => html`<lion-input label="Prefix and suffix">
  <lion-button slot="prefix">prefix</lion-button>
  <lion-button slot="suffix">suffix</lion-button>
</lion-input>`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'label', story: label }, { key: 'HtmlStory0', story: HtmlStory0 }, { key: 'HtmlStory1', story: HtmlStory1 }, { key: 'HtmlStory2', story: HtmlStory2 }, { key: 'HtmlStory3', story: HtmlStory3 }, { key: 'HtmlStory4', story: HtmlStory4 }];
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