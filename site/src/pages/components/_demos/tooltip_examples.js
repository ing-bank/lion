/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-tooltip.js';
/** stories code **/
export const main = () => html`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }

    .demo-tooltip-content {
      display: block;
      font-size: 16px;
      color: white;
      background-color: black;
      border-radius: 4px;
      padding: 8px;
    }

    .demo-box-placements {
      display: flex;
      flex-direction: column;
      margin: 40px 0 0 200px;
    }

    .demo-box-placements lion-tooltip {
      margin: 20px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content" class="demo-tooltip-content">This is a tooltip</div>
  </lion-tooltip>
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