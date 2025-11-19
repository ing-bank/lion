/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-collapsible.js';
/** stories code **/
export const defaultOpen = () => html`
  <lion-collapsible opened>
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`;
export const methods = ({ shadowRoot }) => html`
  <lion-collapsible id="car-collapsible">
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
  <section style="margin-top:16px">
    <button @click="${() => shadowRoot.querySelector('#car-collapsible').toggle()}">
      Toggle content
    </button>
    <button @click="${() => shadowRoot.querySelector('#car-collapsible').show()}">
      Show content
    </button>
    <button @click="${() => shadowRoot.querySelector('#car-collapsible').hide()}">
      Hide content
    </button>
  </section>
`;
export const events = ({ shadowRoot }) => html`
  <div class="demo-custom-collapsible-state-container">
    <strong id="collapsible-state"></strong>
  </div>
  <lion-collapsible
    @opened-changed=${ev => {
      const collapsibleState = shadowRoot.getElementById('collapsible-state');
      collapsibleState.innerText = `Opened: ${ev.target.opened}`;
    }}
  >
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'defaultOpen', story: defaultOpen }, { key: 'methods', story: methods }, { key: 'events', story: events }];
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