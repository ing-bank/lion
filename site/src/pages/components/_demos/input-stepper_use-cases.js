/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-input-stepper.js';
loadDefaultFeedbackMessages();
/** stories code **/
export const HtmlStory20 = () => html`<lion-input-stepper name="year">
  <label slot="label">How old is the existence?</label>
  <div slot="after" data-description>In Billion Years</div>
</lion-input-stepper>`;
export const HtmlStory21 = () => html`<lion-input-stepper
  label="Amount of oranges"
  min="100"
  step="100"
  name="value"
  value="200"
></lion-input-stepper>`;
export const HtmlStory22 = () => html`<lion-input-stepper
  label="Amount of oranges"
  min="200"
  max="500"
  name="value"
  step="100"
  value="200"
></lion-input-stepper>`;
export const valueTextMapping = () => {
  const values = {
    1: 'first',
    2: 'second',
    3: 'third',
    4: 'fourth',
    5: 'fifth',
    6: 'sixth',
    7: 'seventh',
    8: 'eighth',
    9: 'ninth',
    10: 'tenth',
  };
  return html`
    <lion-input-stepper
      label="Order"
      min="1"
      max="10"
      name="value"
      .valueTextMapping="${values}"
    ></lion-input-stepper>
  `;
};
export const formatting = () => {
  const format = { locale: 'nl-NL' };
  return html`
    <lion-input-stepper
      label="Amount of oranges"
      min="0"
      max="5000"
      step="100"
      name="value"
      .formatOptions="${format}"
      .modelValue="${1200}"
    ></lion-input-stepper>
  `;
};
export const HtmlStory23 = () => html`<lion-input-stepper
  label="Amount of oranges"
  min="1"
  max="100"
  step="10"
  name="value"
  alignToStep
  value="55"
></lion-input-stepper>`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory20', story: HtmlStory20 }, { key: 'HtmlStory21', story: HtmlStory21 }, { key: 'HtmlStory22', story: HtmlStory22 }, { key: 'valueTextMapping', story: valueTextMapping }, { key: 'formatting', story: formatting }, { key: 'HtmlStory23', story: HtmlStory23 }];
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
  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }}