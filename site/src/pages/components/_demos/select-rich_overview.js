/** script code **/
import { LitElement, html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';
/** stories code **/
export const HtmlStory33 = () => html`<lion-select-rich name="favoriteColor" label="Favorite color">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}">Hotpink</lion-option>
  <lion-option .choiceValue="${'blue'}">Blue</lion-option>
</lion-select-rich>`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory33', story: HtmlStory33 }];
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