/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-pagination.js';
/** stories code **/
export const withoutCurrentPage = () => {
  return html` <lion-pagination count="20"></lion-pagination> `;
};
export const ensureCount = () => {
  return html` <lion-pagination></lion-pagination> `;
};
export const methods = ({ shadowRoot }) => {
  setTimeout(() => {
    shadowRoot.getElementById('pagination-method-demo').innerText =
      shadowRoot.getElementById('pagination-method').current;
  });

  return html`
    <p>The current page is: <span id="pagination-method-demo"></span></p>
    <lion-pagination
      id="pagination-method"
      count="100"
      current="75"
      @current-changed=${e => {
        const paginationState = shadowRoot.getElementById('pagination-method-demo');
        paginationState.innerText = e.target.current;
      }}
    ></lion-pagination>
    <section style="margin-top:16px">
      <button @click="${() => shadowRoot.getElementById('pagination-method').previous()}">
        Previous
      </button>
      <button @click="${() => shadowRoot.getElementById('pagination-method').next()}">Next</button>
      <br />
      <br />
      <button @click="${() => shadowRoot.getElementById('pagination-method').first()}">
        First
      </button>
      <button @click="${() => shadowRoot.getElementById('pagination-method').last()}">Last</button>
      <br />
      <br />
      <button @click="${() => shadowRoot.getElementById('pagination-method').goto(55)}">
        Go to 55
      </button>
    </section>
  `;
};
export const event = ({ shadowRoot }) => {
  setTimeout(() => {
    shadowRoot.getElementById('pagination-event-demo-text').innerText =
      shadowRoot.getElementById('pagination-event-demo').current;
  });

  return html`
    <p>The current page is: <span id="pagination-event-demo-text"></span></p>
    <lion-pagination
      id="pagination-event-demo"
      count="10"
      current="5"
      @current-changed=${e => {
        const paginationState = shadowRoot.getElementById('pagination-event-demo-text');
        paginationState.innerText = e.target.current;
      }}
    ></lion-pagination>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'withoutCurrentPage', story: withoutCurrentPage }, { key: 'ensureCount', story: ensureCount }, { key: 'methods', story: methods }, { key: 'event', story: event }];
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