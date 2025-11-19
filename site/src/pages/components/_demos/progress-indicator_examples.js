/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-progress-indicator.js';
import '/node_modules/_lion_docs/components/progress-indicator/assets/my-indeterminate-progress-spinner.js';
import '/node_modules/_lion_docs/components/progress-indicator/assets/my-determinate-progress-bar.js';

const changeProgress = () => {
  const progressBar = document.getElementsByName('my-bar')[0];
  progressBar.value = Math.floor(Math.random() * 101);
};
/** stories code **/
export const progressBarDemo = () => html`
  <my-determinate-progress-bar
    aria-label="Interest rate"
    name="my-bar"
    value="50"
  ></my-determinate-progress-bar>
  <button @click="${changeProgress}">Randomize Value</button>
`;
export const main = () => html`
  <my-indeterminate-progress-spinner></my-indeterminate-progress-spinner>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'progressBarDemo', story: progressBarDemo }, { key: 'main', story: main }];
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