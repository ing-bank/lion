/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-range.js';
/** stories code **/
export const HtmlStory14 = () => html`<lion-input-range min="200" max="500" .modelValue="${300}" label="Input range"></lion-input-range>`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory14', story: HtmlStory14 }];
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