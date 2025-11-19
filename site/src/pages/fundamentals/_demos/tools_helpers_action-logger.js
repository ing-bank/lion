/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define-helpers/sb-action-logger.js';
/** stories code **/
export const main = () => {
  const uid = Math.random().toString(36).substr(2, 10);
  return html`
    <p>To log: <code>Hello, World!</code></p>
    <button
      @click=${e => {
        e.target.parentElement.querySelector(`#logger-${uid}`).log('Hello, World!');
      }}
    >
      Click this button
    </button>
    <p>Or to log: <code>What's up, Planet!</code></p>
    <button
      @click=${e => {
        e.target.parentElement.querySelector(`#logger-${uid}`).log(`What's up, Planet!`);
      }}
    >
      Click this button
    </button>
    <sb-action-logger id="logger-${uid}"></sb-action-logger>
  `;
};
export const simpleMode = () => {
  const uid = Math.random().toString(36).substr(2, 10);
  return html`
    <div>To log: <code>Hello, World!</code></div>
    <button
      @click=${e => {
        e.target.parentElement.querySelector(`#logger-${uid}`).log('Hello, World!');
      }}
    >
      Click this button
    </button>
    <div>Or to log: <code>What's up, Planet!</code></div>
    <button
      @click=${e => {
        e.target.parentElement.querySelector(`#logger-${uid}`).log(`What's up, Planet!`);
      }}
    >
      Click this button
    </button>
    <sb-action-logger simple id="logger-${uid}"></sb-action-logger>
  `;
};
export const customTitle = () => {
  const uid = Math.random().toString(36).substr(2, 10);
  return html`
    <button
      @click="${e => e.target.parentElement.querySelector(`#logger-${uid}`).log('Hello, World!')}"
    >
      Log
    </button>
    <sb-action-logger id="logger-${uid}" .title="${'Hello World'}"></sb-action-logger>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'main', story: main }, { key: 'simpleMode', story: simpleMode }, { key: 'customTitle', story: customTitle }];
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