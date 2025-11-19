/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '/node_modules/_lion_docs/components/button/assets/bootstrap-button.js';
/** stories code **/
const capitalize = s => s[0].toUpperCase() + s.slice(1);

export const bootstrapButton = () => {
  const variants = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'link',
  ];

  return html`<div>
    ${variants.map(v => html`<bootstrap-button variant="${v}">${capitalize(v)}</bootstrap-button>`)}
  </div>`;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'bootstrapButton', story: bootstrapButton }];
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