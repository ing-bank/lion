/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { listboxData } from '/node_modules/_lion_docs/components/listbox/src/listboxData.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
import { lazyRender } from '/node_modules/_lion_docs/components/combobox/src/lazyRender.js';
/** stories code **/
export const main = () => html`
  <lion-combobox name="combo" label="Default">
    ${lazyRender(
      listboxData.map(
        (entry, i) => html`
          <lion-option .checked="${i === 0}" .choiceValue="${entry}">${entry}</lion-option>
        `,
      ),
    )}
  </lion-combobox>
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