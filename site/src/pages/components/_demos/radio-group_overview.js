/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
/** stories code **/
export const main = () => html`
  <lion-radio-group name="dinos" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${'allosaurus'}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${'brontosaurus'}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
  </lion-radio-group>
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
  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }}