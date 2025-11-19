/** script code **/
import { LitElement, html } from '@mdjs/mdjs-preview';

import '@lion/ui/define/lion-tabs.js';
/** stories code **/
export const selectedIndex = () => html`
  <lion-tabs .selectedIndex="${1}">
    <button slot="tab">Info</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <button slot="tab">Work</button>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`;
export const slotsOrder = () => html`
  <lion-tabs>
    <button slot="tab">Info</button>
    <button slot="tab">Work</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`;
export const tabsDisabled = () => html`
  <lion-tabs>
    <button slot="tab">tab 1</button>
    <div slot="panel">panel 1</div>
    <button slot="tab" disabled>tab 2</button>
    <div slot="panel">panel 2</div>
    <button slot="tab" disabled>tab 3</button>
    <div slot="panel">panel 3</div>
    <button slot="tab">tab 4</button>
    <div slot="panel">panel 4</div>
    <button slot="tab">tab 5</button>
    <div slot="panel">panel 5</div>
    <button slot="tab" disabled>tab 6</button>
    <div slot="panel">panel 6</div>
  </lion-tabs>
`;
export const nestedTabs = () => html`
  <lion-tabs>
    <button slot="tab">Movies</button>
    <button slot="tab">Work</button>
    <div slot="panel">
      <p>Find some more info about our favorite movies:</p>
      <lion-tabs>
        <button slot="tab">Info about Cars</button>
        <button slot="tab">Info about Toy Story</button>
        <p slot="panel">
          Cars is a 2006 American computer-animated comedy film produced by Pixar Animation Studios
          and released by Walt Disney Pictures.
        </p>
        <p slot="panel">
          The feature film directorial debut of John Lasseter, it was the first entirely
          computer-animated feature film, as well as the first feature film from Pixar.
        </p>
      </lion-tabs>
    </div>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`;
export const distributeNewElement = () => {
  const tagName = 'demo-tabs-add-dynamically';
  if (!customElements.get(tagName)) {
    customElements.define(
      tagName,
      class extends LitElement {
        static get properties() {
          return {
            __collection: { type: Array },
          };
        }
        render() {
          return html`
            <h3>Append</h3>
            <lion-tabs id="appendTabs">
              <button slot="tab">tab 1</button>
              <p slot="panel">panel 1</p>
              <button slot="tab">tab 2</button>
              <p slot="panel">panel 2</p>
            </lion-tabs>
            <button @click="${this.__handleAppendClick}">Append</button>
            <hr />
            <h3>Push</h3>
            <lion-tabs id="pushTabs">
              <button slot="tab">tab 1</button>
              <p slot="panel">panel 1</p>
              <button slot="tab">tab 2</button>
              <p slot="panel">panel 2</p>
              ${this.__collection.map(
                item => html`
                  <button slot="tab">${item.button}</button>
                  <p slot="panel">${item.panel}</p>
                `,
              )}
            </lion-tabs>
            <button @click="${this.__handlePushClick}">Push</button>
          `;
        }
        constructor() {
          super();
          this.__collection = [];
        }
        __handleAppendClick() {
          const tabsElement = this.shadowRoot.querySelector('#appendTabs');
          const c = 2;
          const n = Math.floor(tabsElement.children.length / 2);
          for (let i = n + 1; i < n + c; i += 1) {
            const tab = document.createElement('button');
            tab.setAttribute('slot', 'tab');
            tab.innerText = `tab ${i}`;
            const panel = document.createElement('p');
            panel.setAttribute('slot', 'panel');
            panel.innerText = `panel ${i}`;
            tabsElement.append(tab);
            tabsElement.append(panel);
          }
        }
        __handlePushClick() {
          const tabsElement = this.shadowRoot.querySelector('#pushTabs');
          const i = Math.floor(tabsElement.children.length / 2) + 1;
          this.__collection = [
            ...this.__collection,
            {
              button: `tab ${i}`,
              panel: `panel ${i}`,
            },
          ];
        }
      },
    );
  }
  return html` <demo-tabs-add-dynamically></demo-tabs-add-dynamically> `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'selectedIndex', story: selectedIndex }, { key: 'slotsOrder', story: slotsOrder }, { key: 'tabsDisabled', story: tabsDisabled }, { key: 'nestedTabs', story: nestedTabs }, { key: 'distributeNewElement', story: distributeNewElement }];
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