/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-button.js';
import iconSvg from '@lion/demo-components/button/src/icon.svg.js';
/** stories code **/
export const iconButton = () => html`<lion-button>${iconSvg(html)}Bug</lion-button>`;
export const iconOnly = () => html`<lion-button aria-label="Bug">${iconSvg(html)}</lion-button>`;
export const mainAndIconButton = () => html`
  <lion-button>Default</lion-button>
  <lion-button>${iconSvg(html)} Bug</lion-button>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'iconButton', story: iconButton }, { key: 'iconOnly', story: iconOnly }, { key: 'mainAndIconButton', story: mainAndIconButton }];
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