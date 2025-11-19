/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { LionInputAmountDropdown } from '@lion/ui/input-amount-dropdown.js';
import '@lion/ui/define/lion-input-amount-dropdown.js';
/** stories code **/
export const InputAmountDropdown = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Shows all currencies by default"
      name="amount"
    ></lion-input-amount-dropdown>
  `;
};
export const allowedCurrencies = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Shows only allowed currencies"
      name="amount"
      .allowedCurrencies=${['EUR', 'GBP']}
    ></lion-input-amount-dropdown>
  `;
};
export const preferredCurrencies = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Preferred currencies show on top"
      name="amount"
      .allowedCurrencies=${['EUR', 'GBP', 'USD', 'JPY']}
      .preferredCurrencies=${['USD', 'JPY']}
    ></lion-input-amount-dropdown>
  `;
};
class DemoAmountDropdown extends LionInputAmountDropdown {
  constructor() {
    super();

    this._dropdownSlot = 'suffix';
  }
}

customElements.define('demo-amount-dropdown', DemoAmountDropdown);

export const suffixSlot = () => {
  loadDefaultFeedbackMessages();
  return html`
    <demo-amount-dropdown
      label="Select region via dropdown"
      help-text="the dropdown shows in the suffix slot"
      name="amount"
    ></demo-amount-dropdown>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'InputAmountDropdown', story: InputAmountDropdown }, { key: 'allowedCurrencies', story: allowedCurrencies }, { key: 'preferredCurrencies', story: preferredCurrencies }, { key: 'suffixSlot', story: suffixSlot }];
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