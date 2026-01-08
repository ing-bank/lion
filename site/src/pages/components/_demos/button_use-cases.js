/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-button-reset.js';
import '@lion/ui/define/lion-button-submit.js';
/** stories code **/
export const handler = () => html`
  <lion-button @click="${ev => console.log('clicked/spaced/entered', ev)}">
    Click | Space | Enter me and see log
  </lion-button>
`;
export const disabled = () => html`<lion-button disabled>Disabled</lion-button>`;
export const minimumClickArea = () =>
  html` <style>
      .small {
        padding: 4px;
        line-height: 1em;
      }
      .small::before {
        border: 1px dashed #000;
      }
    </style>
    <lion-button class="small">xs</lion-button>`;
export const withinForm = () => html`
  <form
    @submit=${ev => {
      ev.preventDefault();
      console.log('submit handler', ev.target);
    }}
  >
    <label for="firstNameId">First name</label>
    <input id="firstNameId" name="firstName" />
    <label for="lastNameId">Last name</label>
    <input id="lastNameId" name="lastName" />
    <lion-button-submit @click=${ev => console.log('click submit handler', ev.target)}
      >Submit</lion-button-submit
    >
    <lion-button-reset @click=${ev => console.log('click reset handler', ev.target)}
      >Reset</lion-button-reset
    >
  </form>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'handler', story: handler }, { key: 'disabled', story: disabled }, { key: 'minimumClickArea', story: minimumClickArea }, { key: 'withinForm', story: withinForm }];
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