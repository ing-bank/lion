/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-option.js';
/** stories code **/
export const main = () => html`
  <lion-listbox name="listbox" label="Default">
    <lion-option .choiceValue="${'Apple'}">Apple</lion-option>
    <lion-option checked .choiceValue="${'Artichoke'}">Artichoke</lion-option>
    <lion-option .choiceValue="${'Asparagus'}">Asparagus</lion-option>
    <lion-option .choiceValue="${'Banana'}">Banana</lion-option>
    <lion-option .choiceValue="${'Beets'}">Beets</lion-option>
  </lion-listbox>
`;
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