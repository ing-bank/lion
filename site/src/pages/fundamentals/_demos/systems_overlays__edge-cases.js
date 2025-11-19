/** script code **/
import { html, render, LitElement } from '@mdjs/mdjs-preview';
import { ref, createRef } from 'lit/directives/ref.js';
import '@lion/demo-systems/overlays/assets/demo-el-using-overlaymixin.js';
import '@lion/demo-systems/overlays/assets/applyDemoOverlayStyles.js';
import '@lion/demo-systems/overlays/assets/demo-overlay-positioning.mjs';
/** stories code **/
export const edgeCaseOverflowProblem = () => html`
  <div style="padding: 54px 24px 36px;">
    <div
      style="overflow: hidden; border: 1px black dashed; padding-top: 44px; padding-bottom: 16px;"
    >
      <div style="display: flex; justify-content: space-evenly; position: relative;">
        <demo-overlay-el opened use-absolute>
          <button slot="invoker" aria-label="local, non modal"></button>
          <div slot="content">absolute (for&nbsp;demo)</div>
        </demo-overlay-el>
      </div>
    </div>
  </div>
`;
export const edgeCaseOverflowSolution = () => html`
  <div style="padding: 54px 24px 36px;">
    <div
      style="overflow: hidden; border: 1px black dashed; padding-top: 36px; padding-bottom: 16px;"
    >
      <div style="display: flex; justify-content: space-evenly; position: relative;">
        <demo-overlay-el opened .config="${{ placementMode: 'local', trapsKeyboardFocus: false }}">
          <button slot="invoker" aria-label="local, non modal"></button>
          <div slot="content">no matter</div>
        </demo-overlay-el>

        <demo-overlay-el opened .config="${{ placementMode: 'local', trapsKeyboardFocus: true }}">
          <button slot="invoker" aria-label="local, modal"></button>
          <div slot="content">what configuration</div>
        </demo-overlay-el>

        <demo-overlay-el
          opened
          .config="${{ placementMode: 'local', popperConfig: { strategy: 'absolute' } }}"
        >
          <button slot="invoker" aria-label="local, absolute"></button>
          <div slot="content">...it</div>
        </demo-overlay-el>

        <demo-overlay-el
          opened
          .config="${{ placementMode: 'local', popperConfig: { strategy: 'fixed' } }}"
        >
          <button slot="invoker" aria-label="local, fixed"></button>
          <div slot="content">just</div>
        </demo-overlay-el>

        <demo-overlay-el opened .config="${{ placementMode: 'global' }}">
          <button slot="invoker" aria-label="global"></button>
          <div slot="content">works</div>
        </demo-overlay-el>
      </div>
    </div>
  </div>
`;
export const edgeCaseStackProblem = () => html`
  <div style="width: 300px; height: 300px; position: relative;">
    <div
      id="stacking-context-a"
      style="position: absolute; z-index: 2; top: 0; width: 100px; height: 200px;"
    >
      I am on top and I don't care about your 9999
    </div>

    <div
      id="stacking-context-b"
      style="position: absolute; z-index: 1; top: 0; width: 200px; height: 200px;"
    >
      <demo-overlay-el no-dialog-el style="overflow:hidden; position: relative;">
        <button slot="invoker">invoke</button>
        <div slot="content">
          The overlay can never be in front, since the parent stacking context has a lower priority
          than its sibling.
          <div id="stacking-context-b-inner" style="position: absolute; z-index: 9999;">
            So, even if we add a new stacking context in our overlay with z-index 9999, it will
            never be painted on top.
          </div>
        </div>
      </demo-overlay-el>
    </div>
  </div>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'edgeCaseOverflowProblem', story: edgeCaseOverflowProblem }, { key: 'edgeCaseOverflowSolution', story: edgeCaseOverflowSolution }, { key: 'edgeCaseStackProblem', story: edgeCaseStackProblem }];
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