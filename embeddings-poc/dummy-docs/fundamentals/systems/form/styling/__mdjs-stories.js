/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-button.js';
/** stories code **/
export const label = () => html`
  <style>
    .u-sr-only {
      position: absolute;
      top: 0;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(100%);
      clip: rect(1px, 1px, 1px, 1px);
      white-space: nowrap;
      border: 0;
      margin: 0;
      padding: 0;
    }
  </style>
  <lion-input>
    <label slot="label"
      >Label <span class="u-sr-only">partially only visible for screen-readers</span></label
    >
  </lion-input>
`;
export const prefix = () => html`
  <lion-input label="Prefix">
    <div slot="prefix">[prefix]</div>
  </lion-input>
`;
export const suffix = () => html`
  <lion-input label="Suffix">
    <div slot="suffix">[suffix]</div>
  </lion-input>
`;
export const before = () => html`
  <lion-input label="Before">
    <div slot="before">[before]</div>
  </lion-input>
`;
export const after = () => html`
  <lion-input label="Amount">
    <div slot="after">EUR</div>
  </lion-input>
  <lion-input label="Percentage">
    <div slot="after">%</div>
  </lion-input>
`;
export const ButtonsWithFields = () => html`
  <lion-input label="Prefix and suffix">
    <lion-button slot="prefix">prefix</lion-button>
    <lion-button slot="suffix">suffix</lion-button>
  </lion-input>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'label', story: label }, { key: 'prefix', story: prefix }, { key: 'suffix', story: suffix }, { key: 'before', story: before }, { key: 'after', story: after }, { key: 'ButtonsWithFields', story: ButtonsWithFields }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }
  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }
}