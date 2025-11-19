/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/demo-components/input-tel-dropdown/src/intl-input-tel-dropdown.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
/** stories code **/
export const IntlInputTelDropdown = () => {
  loadDefaultFeedbackMessages();
  return html`
    <intl-input-tel-dropdown
      .preferredRegions="${['NL', 'PH']}"
      .modelValue="${'+639608920056'}"
      label="Telephone number"
      help-text="Advanced dropdown and styling"
      name="phoneNumber"
    ></intl-input-tel-dropdown>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'IntlInputTelDropdown', story: IntlInputTelDropdown }];
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