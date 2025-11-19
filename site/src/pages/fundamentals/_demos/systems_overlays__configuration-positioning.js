/** script code **/
import { html, render, LitElement } from '@mdjs/mdjs-preview';
import { ref, createRef } from 'lit/directives/ref.js';
import '@lion/demo-systems/overlays/assets/demo-el-using-overlaymixin.js';
import '@lion/demo-systems/overlays/assets/applyDemoOverlayStyles.js';
import '@lion/demo-systems/overlays/assets/demo-overlay-positioning.mjs';
/** stories code **/
export const localPositioning = () => html`<demo-overlay-positioning></demo-overlay-positioning>`;
export const globalPositioning = () =>
  html`<demo-overlay-positioning
    placement-mode="global"
    simulate-viewport
  ></demo-overlay-positioning>`;
export const placementLocal = () => {
  const placementModeLocalConfig = { placementMode: 'local' };
  return html`
    <demo-el-using-overlaymixin .config="${placementModeLocalConfig}">
      <button slot="invoker">Click me to open the local overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const placementGlobal = () => {
  const placementModeGlobalConfig = { placementMode: 'global' };
  return html`
    <demo-el-using-overlaymixin .config="${placementModeGlobalConfig}">
      <button slot="invoker">Click me to open the global overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'localPositioning', story: localPositioning }, { key: 'globalPositioning', story: globalPositioning }, { key: 'placementLocal', story: placementLocal }, { key: 'placementGlobal', story: placementGlobal }];
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