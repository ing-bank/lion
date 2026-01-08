/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { icons } from '@lion/ui/icon.js';
import '@lion/demo-components/icon/assets/iconset-bugs.js';
import '@lion/demo-components/icon/assets/iconset-misc.js';
import * as spaceSet from '@lion/demo-components/icon/assets/iconset-space.js';

import '@lion/ui/define/lion-icon.js';
/** stories code **/
export const iconSets = () => html`
  ${Object.keys(spaceSet).map(
    name => html`
      <style>
        .demo-icon__container {
          display: inline-flex;
          position: relative;
          flex-grow: 1;
          flex-direction: column;
          align-items: center;
          width: 80px;
          height: 80px;
          padding: 4px;
        }
        .demo-icon__name {
          font-size: 10px;
        }
      </style>
      <div class="demo-icon__container">
        <lion-icon icon-id="lion:space:${name}" aria-label="${name}"></lion-icon>
        <span class="demo-icon__name">${name}</span>
      </div>
    `,
  )}
`;
export const accessibleLabel = () => html`
  <lion-icon icon-id="lion:misc:arrowLeft" aria-label="Pointing left"></lion-icon>
`;
export const Styling = () => html`
  <style>
    .demo-icon {
      width: 160px;
      height: 160px;
      fill: blue;
    }
  </style>
  <lion-icon icon-id="lion:bugs:bug02" aria-label="Bug" class="demo-icon"></lion-icon>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'iconSets', story: iconSets }, { key: 'accessibleLabel', story: accessibleLabel }, { key: 'Styling', story: Styling }];
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