/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { icons } from '@lion/ui/icon.js';
import '@lion/ui/define/lion-icon.js';

icons.addIconResolver('lion', (iconset, name) => {
  switch (iconset) {
    case 'bugs':
      return import('/node_modules/_lion_docs/components/icon/assets/iconset-bugs.js').then(module => module[name]);
    case 'space':
      return import('/node_modules/_lion_docs/components/icon/assets/iconset-space.js').then(module => module[name]);
    case 'misc':
      return import('/node_modules/_lion_docs/components/icon/assets/iconset-misc.js').then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
});
/** stories code **/
export const main = () => html`
  <lion-icon icon-id="lion:space:alienSpaceship" style="width: 50px; height: 50px;"></lion-icon>
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