/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
/** stories code **/
export const HtmlStory5 = () => html`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox label="Archimedes" .choiceValue="${'Archimedes'}"></lion-checkbox>
  <lion-checkbox label="Francis Bacon" .choiceValue="${'Francis Bacon'}"></lion-checkbox>
  <lion-checkbox label="Marie Curie" .choiceValue="${'Marie Curie'}"></lion-checkbox>
</lion-checkbox-group>`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory5', story: HtmlStory5 }];
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