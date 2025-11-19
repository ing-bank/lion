/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-tel-dropdown.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
/** stories code **/
export const main = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-tel-dropdown label="Telephone number" name="phoneNumber"></lion-input-tel-dropdown>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'main', story: main }];
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